import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { HotelWithLocation, QRCodeResponse, PaymentInfo } from "@/utils/types";
import { formatCurrency, calculateTax, calculateTotalWithTax } from "@/utils/formatCurrency";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { LoadingOverlay } from "@/components/ui/loading-spinner";
import { apiRequest, queryClient } from "@/lib/queryClient";

const PaymentPage = () => {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [match, params] = useRoute("/payment/:hotelId");
  
  const hotelId = match ? parseInt(params.hotelId) : 0;
  
  // Get URL params
  const searchParams = new URLSearchParams(window.location.search);
  const checkInStr = searchParams.get('checkIn');
  const checkOutStr = searchParams.get('checkOut');
  
  const checkInDate = checkInStr ? new Date(checkInStr) : null;
  const checkOutDate = checkOutStr ? new Date(checkOutStr) : null;
  
  // Form state
  const [paymentMethod, setPaymentMethod] = useState<string>("upi");
  const [upiId, setUpiId] = useState<string>("");
  const [guestName, setGuestName] = useState<string>(user?.name || "");
  const [guestEmail, setGuestEmail] = useState<string>(user?.email || "");
  const [guestPhone, setGuestPhone] = useState<string>("");
  const [specialRequests, setSpecialRequests] = useState<string>("");
  const [qrCode, setQrCode] = useState<string>("");
  const [numberOfNights, setNumberOfNights] = useState<number>(0);
  const [showPaymentProcessing, setShowPaymentProcessing] = useState<boolean>(false);
  
  // Calculate number of nights
  useEffect(() => {
    if (checkInDate && checkOutDate) {
      const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setNumberOfNights(diffDays);
    }
  }, [checkInDate, checkOutDate]);
  
  // Redirect if not authenticated or missing dates
  useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to continue with the booking",
        variant: "destructive",
      });
      setLocation("/auth");
      return;
    }
    
    if (!checkInDate || !checkOutDate) {
      toast({
        title: "Invalid booking",
        description: "Please select dates for your stay",
        variant: "destructive",
      });
      setLocation(`/hotels/${hotelId}`);
    }
  }, [user, checkInDate, checkOutDate, hotelId, toast, setLocation]);
  
  // Fetch hotel data
  const { data: hotel, isLoading: isHotelLoading } = useQuery<HotelWithLocation>({
    queryKey: [`/api/hotels/${hotelId}`],
    queryFn: async () => {
      const res = await fetch(`/api/hotels/${hotelId}`);
      if (!res.ok) throw new Error("Failed to fetch hotel details");
      return res.json();
    },
    enabled: hotelId > 0,
  });
  
  // Generate QR Code
  const generateQRCode = useMutation<QRCodeResponse, Error, PaymentInfo>({
    mutationFn: async (paymentInfo) => {
      const res = await apiRequest("POST", "/api/generate-qr-code", { paymentInfo });
      return res.json();
    },
    onSuccess: (data) => {
      setQrCode(data.qrCode);
    },
    onError: (error) => {
      toast({
        title: "QR Code generation failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Create booking mutation
  const createBooking = useMutation({
    mutationFn: async (bookingData: any) => {
      const res = await apiRequest("POST", "/api/bookings", bookingData);
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      // Simulate payment processing
      setTimeout(() => {
        setShowPaymentProcessing(false);
        setLocation(`/booking-confirmation/${data.id}`);
      }, 2000);
    },
    onError: (error: Error) => {
      setShowPaymentProcessing(false);
      toast({
        title: "Booking failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Generate QR code when payment method changes to UPI
  useEffect(() => {
    if (paymentMethod === "upi" && hotel && !qrCode) {
      const totalAmount = calculateTotalWithTax(hotel.price * numberOfNights);
      
      const paymentInfo: PaymentInfo = {
        bookingId: `IND${Date.now().toString().slice(-8)}`,
        amount: totalAmount,
        customerName: user?.name || "Guest",
        hotelName: hotel.name,
        dateTime: new Date().toISOString(),
      };
      
      generateQRCode.mutate(paymentInfo);
    }
  }, [paymentMethod, hotel, qrCode, user, numberOfNights, generateQRCode]);
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !hotel || !checkInDate || !checkOutDate) {
      toast({
        title: "Cannot complete booking",
        description: "Missing required information",
        variant: "destructive",
      });
      return;
    }
    
    if (!guestName || !guestEmail || !guestPhone) {
      toast({
        title: "Missing information",
        description: "Please fill in all guest details",
        variant: "destructive",
      });
      return;
    }
    
    const totalPrice = calculateTotalWithTax(hotel.price * numberOfNights);
    
    const bookingData = {
      userId: user.id,
      hotelId: hotel.id,
      checkInDate: checkInDate.toISOString(),
      checkOutDate: checkOutDate.toISOString(),
      totalPrice,
      paymentMethod,
      status: "confirmed",
      guestName,
      guestEmail,
      guestPhone,
      specialRequests: specialRequests || ""
    };
    
    setShowPaymentProcessing(true);
    createBooking.mutate(bookingData);
  };
  
  // Calculate total price
  const calculateTotalPrice = () => {
    if (!hotel || !numberOfNights) return 0;
    return hotel.price * numberOfNights;
  };
  
  const totalPrice = calculateTotalPrice();
  const taxAmount = calculateTax(totalPrice);
  const totalWithTax = calculateTotalWithTax(totalPrice);
  
  if (isHotelLoading) {
    return (
      <div className="pt-24 md:pt-20 pb-12">
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-1/2 mx-auto mb-6" />
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Skeleton className="h-96 w-full" />
              <Skeleton className="h-96 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!hotel || !checkInDate || !checkOutDate) {
    return (
      <div className="pt-24 md:pt-20 pb-12">
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold text-center mb-4">Invalid Booking Request</h2>
              <p className="text-neutral-600 mb-4 text-center">
                We couldn't process your booking due to missing information.
              </p>
              <Button 
                className="w-full" 
                onClick={() => setLocation("/hotels")}
              >
                Return to Hotels
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>Complete Your Booking - {hotel.name} - IndiaStay</title>
        <meta name="description" content={`Complete your booking at ${hotel.name}. Select payment method and confirm your reservation.`} />
      </Helmet>
      
      <div className="pt-24 md:pt-20 pb-12">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 text-center">Complete Your Booking</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <div className="bg-neutral-50 p-4 rounded-lg mb-6">
                  <h3 className="font-bold mb-3">Booking Summary</h3>
                  <div className="flex items-start mb-4">
                    <img 
                      src={Array.isArray(hotel.images) ? hotel.images[0] : ''} 
                      alt={hotel.name} 
                      className="w-20 h-20 object-cover rounded mr-4"
                    />
                    <div>
                      <h4 className="font-bold">{hotel.name}</h4>
                      <p className="text-sm text-neutral-600">{hotel.cityName}, {hotel.stateName}</p>
                      <p className="text-sm text-neutral-600 mt-1">
                        <span className="font-semibold">Check-in:</span> {checkInDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                      <p className="text-sm text-neutral-600">
                        <span className="font-semibold">Check-out:</span> {checkOutDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="border-t pt-3">
                    <div className="flex justify-between mb-2 text-sm">
                      <span>Room Price ({numberOfNights} {numberOfNights === 1 ? 'night' : 'nights'})</span>
                      <span>{formatCurrency(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between mb-2 text-sm">
                      <span>Taxes & fees (18%)</span>
                      <span>{formatCurrency(taxAmount)}</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>Total Amount</span>
                      <span>{formatCurrency(totalWithTax)}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-bold mb-3">Guest Details</h3>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="guestName">Full Name</Label>
                      <Input 
                        id="guestName" 
                        type="text" 
                        placeholder="Enter your full name" 
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="guestEmail">Email Address</Label>
                      <Input 
                        id="guestEmail" 
                        type="email" 
                        placeholder="Enter your email" 
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="guestPhone">Phone Number</Label>
                      <Input 
                        id="guestPhone" 
                        type="tel" 
                        placeholder="Enter your phone number" 
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
                      <Textarea 
                        id="specialRequests" 
                        placeholder="Any special requests for your stay?" 
                        className="h-24"
                        value={specialRequests}
                        onChange={(e) => setSpecialRequests(e.target.value)}
                      />
                    </div>
                  </form>
                </div>
              </div>
              
              <div>
                <h3 className="font-bold mb-3">Payment Method</h3>
                <form onSubmit={handleSubmit}>
                  <RadioGroup 
                    value={paymentMethod} 
                    onValueChange={setPaymentMethod}
                    className="space-y-4"
                  >
                    <div className="border rounded-md p-4">
                      <div className="flex items-center">
                        <RadioGroupItem value="upi" id="upi" />
                        <Label htmlFor="upi" className="ml-2 font-semibold">UPI</Label>
                      </div>
                      {paymentMethod === "upi" && (
                        <>
                          <div className="mt-3">
                            <Input 
                              type="text" 
                              placeholder="Enter UPI ID (e.g. name@upi)" 
                              value={upiId}
                              onChange={(e) => setUpiId(e.target.value)}
                            />
                          </div>
                          <div className="mt-3 flex justify-center">
                            <div className="border-2 border-neutral-200 rounded-md p-4 inline-block">
                              <div className="text-center mb-2 text-sm font-medium">Scan with any UPI app</div>
                              <div className="w-40 h-40 bg-white p-1">
                                {generateQRCode.isPending ? (
                                  <Skeleton className="w-full h-full" />
                                ) : qrCode ? (
                                  <img src={qrCode} alt="QR Code" className="w-full h-full" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-neutral-100 text-neutral-400 text-sm text-center">
                                    QR Code will appear here
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                    
                    <div className="border rounded-md p-4">
                      <div className="flex items-center">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="ml-2 font-semibold">Credit/Debit Card</Label>
                      </div>
                      {paymentMethod === "card" && (
                        <div className="mt-3 space-y-3">
                          <div>
                            <Label htmlFor="cardNumber">Card Number</Label>
                            <Input id="cardNumber" type="text" placeholder="1234 5678 9012 3456" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="expiryDate">Expiry Date</Label>
                              <Input id="expiryDate" type="text" placeholder="MM/YY" />
                            </div>
                            <div>
                              <Label htmlFor="cvv">CVV</Label>
                              <Input id="cvv" type="text" placeholder="123" />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="border rounded-md p-4">
                      <div className="flex items-center">
                        <RadioGroupItem value="netbanking" id="netbanking" />
                        <Label htmlFor="netbanking" className="ml-2 font-semibold">Netbanking</Label>
                      </div>
                      {paymentMethod === "netbanking" && (
                        <div className="mt-3 grid grid-cols-3 gap-2">
                          <button className="border rounded-md p-2 text-center flex flex-col items-center justify-center h-20">
                            <img src="https://companieslogo.com/img/orig/SBIN.NS-bb401167.png?t=1596839673" alt="SBI" className="w-10 h-10 object-contain mb-1" />
                            <span className="text-xs">SBI</span>
                          </button>
                          <button className="border rounded-md p-2 text-center flex flex-col items-center justify-center h-20">
                            <img src="https://companieslogo.com/img/orig/HDFC.NS_BIG-1b514a42.png?t=1596830341" alt="HDFC" className="w-10 h-10 object-contain mb-1" />
                            <span className="text-xs">HDFC</span>
                          </button>
                          <button className="border rounded-md p-2 text-center flex flex-col items-center justify-center h-20">
                            <img src="https://companieslogo.com/img/orig/IBN_BIG-9ec166e1.png?t=1596830464" alt="ICICI" className="w-10 h-10 object-contain mb-1" />
                            <span className="text-xs">ICICI</span>
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <div className="border rounded-md p-4">
                      <div className="flex items-center">
                        <RadioGroupItem value="wallet" id="wallet" />
                        <Label htmlFor="wallet" className="ml-2 font-semibold">Wallet</Label>
                      </div>
                      {paymentMethod === "wallet" && (
                        <div className="mt-3 grid grid-cols-2 gap-2">
                          <button className="border rounded-md p-2 text-center flex flex-col items-center justify-center h-16">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Paytm_Logo_%28standalone%29.svg/2560px-Paytm_Logo_%28standalone%29.svg.png" alt="Paytm" className="h-8 object-contain" />
                          </button>
                          <button className="border rounded-md p-2 text-center flex flex-col items-center justify-center h-16">
                            <img src="https://upload.wikimedia.org/wikipedia/en/thumb/f/f2/PhonePe_Logo.svg/1200px-PhonePe_Logo.svg.png" alt="PhonePe" className="h-8 object-contain" />
                          </button>
                        </div>
                      )}
                    </div>
                  </RadioGroup>
                  
                  <div className="mt-6">
                    <Button 
                      type="submit"
                      className="w-full bg-primary hover:bg-blue-600 text-white font-bold py-3 px-4 rounded transition"
                    >
                      Pay {formatCurrency(totalWithTax)}
                    </Button>
                    <p className="text-xs text-center mt-2 text-neutral-600">
                      By clicking above, you agree to our <a href="#" className="text-primary">Terms & Conditions</a>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {showPaymentProcessing && <LoadingOverlay text="Processing payment..." />}
    </>
  );
};

export default PaymentPage;

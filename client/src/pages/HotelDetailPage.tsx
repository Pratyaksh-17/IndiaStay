import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { HotelWithLocation } from "@/utils/types";
import { MapPin, Wifi, Droplets, Utensils, Bath, BellRing, ParkingCircle, Dumbbell, GlassWater, Heart, Share, ArrowLeft, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { formatCurrency, calculateTax, calculateTotalWithTax } from "@/utils/formatCurrency";
import DatePicker from "@/components/DatePicker";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

const HotelDetailPage = () => {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [match, params] = useRoute("/hotels/:id");
  const hotelId = match ? parseInt(params.id) : 0;
  
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectingCheckIn, setSelectingCheckIn] = useState(true);
  const [numberOfNights, setNumberOfNights] = useState(0);
  
  // Fetch hotel data
  const { data: hotel, isLoading } = useQuery<HotelWithLocation>({
    queryKey: [`/api/hotels/${hotelId}`],
    queryFn: async () => {
      const res = await fetch(`/api/hotels/${hotelId}`);
      if (!res.ok) throw new Error("Failed to fetch hotel details");
      return res.json();
    },
    enabled: hotelId > 0,
  });

  // Calculate number of nights when dates change
  useEffect(() => {
    if (checkInDate && checkOutDate) {
      const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setNumberOfNights(diffDays);
    } else {
      setNumberOfNights(0);
    }
  }, [checkInDate, checkOutDate]);

  const handleGoBack = () => {
    setLocation("/hotels");
  };

  const handleDateSelect = (date: Date) => {
    if (selectingCheckIn) {
      setCheckInDate(date);
      setSelectingCheckIn(false);
    } else {
      // Ensure checkout date is after checkin date
      if (checkInDate && date > checkInDate) {
        setCheckOutDate(date);
        setShowDatePicker(false);
      } else {
        toast({
          title: "Invalid date selection",
          description: "Check-out date must be after check-in date",
          variant: "destructive",
        });
      }
    }
  };

  const handleProceedToPayment = () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to continue with your booking",
        variant: "destructive",
      });
      setLocation("/auth");
      return;
    }

    if (!checkInDate || !checkOutDate) {
      toast({
        title: "Date selection required",
        description: "Please select both check-in and check-out dates",
        variant: "destructive",
      });
      return;
    }

    // Navigate to payment page with hotel id and dates
    setLocation(`/payment/${hotelId}?checkIn=${checkInDate.toISOString()}&checkOut=${checkOutDate.toISOString()}`);
  };

  // Format image paths from the API
  const getFormattedImages = (images: string[]) => {
    return images.slice(0, 5);
  };

  // Map amenity icons
  const amenityIcons = {
    "Free Wifi": <Wifi className="text-primary mr-3" size={18} />,
    "Swimming Pool": <Droplets className="text-primary mr-3" size={18} />,
    "Restaurant": <Utensils className="text-primary mr-3" size={18} />,
    "Bath": <Bath className="text-primary mr-3" size={18} />,
    "Room Service": <BellRing className="text-primary mr-3" size={18} />,
    "Free Parking": <ParkingCircle className="text-primary mr-3" size={18} />,
    "Fitness Center": <Dumbbell className="text-primary mr-3" size={18} />,
    "Bar/Lounge": <GlassWater className="text-primary mr-3" size={18} />,
    // Default icon if the amenity doesn't match
    "default": <Wifi className="text-primary mr-3" size={18} />
  };

  // Calculate total price
  const calculateTotalPrice = () => {
    if (!hotel || !numberOfNights) return 0;
    return hotel.price * numberOfNights;
  };

  const totalPrice = calculateTotalPrice();

  if (isLoading) {
    return (
      <div className="pt-24 md:pt-20 pb-12">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="relative">
              <Skeleton className="h-64 md:h-80 w-full" />
            </div>
            <div className="p-6">
              <Skeleton className="h-8 w-2/3 mb-2" />
              <Skeleton className="h-4 w-1/3 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <div className="grid grid-cols-4 gap-2 mb-6">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
              <Skeleton className="h-6 w-1/4 mb-3" />
              <Skeleton className="h-20 w-full mb-4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="pt-24 md:pt-20 pb-12">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <h2 className="text-2xl font-bold mb-2">Hotel Not Found</h2>
            <p className="text-neutral-600 mb-4">The hotel you're looking for doesn't exist or has been removed.</p>
            <Button onClick={handleGoBack}>
              Return to Hotels
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{hotel.name} - IndiaStay</title>
        <meta name="description" content={hotel.description} />
      </Helmet>

      <div className="pt-24 md:pt-20 pb-12">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Hotel Header */}
            <div className="relative">
              <div 
                className="h-64 md:h-80 bg-cover bg-center" 
                style={{ backgroundImage: `url('${Array.isArray(hotel.images) ? hotel.images[0] : ''}')` }}
              ></div>
              <div className="absolute top-4 left-4">
                <Button 
                  onClick={handleGoBack}
                  variant="secondary" 
                  size="icon" 
                  className="rounded-full shadow hover:bg-neutral-100"
                >
                  <ArrowLeft className="h-5 w-5 text-neutral-700" />
                </Button>
              </div>
              <div className="absolute top-4 right-4 flex space-x-2">
                <Button 
                  variant="secondary" 
                  size="icon" 
                  className="rounded-full shadow hover:bg-neutral-100"
                >
                  <Heart className="h-5 w-5 text-neutral-700" />
                </Button>
                <Button 
                  variant="secondary" 
                  size="icon" 
                  className="rounded-full shadow hover:bg-neutral-100"
                >
                  <Share className="h-5 w-5 text-neutral-700" />
                </Button>
              </div>
            </div>
            
            {/* Hotel Info */}
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-2">{hotel.name}</h1>
                  <div className="flex items-center mb-2">
                    <div className="flex text-yellow-500">
                      {Array(hotel.rating).fill(0).map((_, index) => (
                        <svg key={index} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-2 text-neutral-600">({Math.floor(Math.random() * 500) + 100} reviews)</span>
                  </div>
                  <p className="text-neutral-700 mb-2">
                    <MapPin className="inline-block text-red-500 mr-1" size={16} />
                    {hotel.cityName}, {hotel.stateName}, India
                  </p>
                </div>
                <div className="mt-4 md:mt-0 text-right">
                  <div className="text-2xl font-bold text-green-600 price-tag">{formatCurrency(hotel.price)}</div>
                  <div className="text-neutral-600">per night</div>
                  <div className="text-sm text-neutral-500">+{formatCurrency(calculateTax(hotel.price))} taxes & fees</div>
                </div>
              </div>
              
              {/* Hotel Gallery */}
              {Array.isArray(hotel.images) && hotel.images.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mb-6">
                  <div className="col-span-2 row-span-2">
                    <img src={hotel.images[0]} alt={`${hotel.name} Main`} className="w-full h-full object-cover rounded" />
                  </div>
                  {getFormattedImages(hotel.images).slice(1).map((image, index) => (
                    <div key={index}>
                      <img src={image} alt={`${hotel.name} Image ${index + 2}`} className="w-full h-full object-cover rounded" />
                    </div>
                  ))}
                </div>
              )}
              
              {/* Hotel Description */}
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-3">About the Property</h2>
                <p className="text-neutral-700 mb-4">
                  {hotel.description}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {Array.isArray(hotel.amenities) && hotel.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center">
                      {amenityIcons[amenity as keyof typeof amenityIcons] || amenityIcons.default}
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Booking Calendar */}
              <div className="border rounded-lg p-4 mb-6">
                <h2 className="text-xl font-bold mb-4">Book Your Stay</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-neutral-700 mb-2">Check-in Date</label>
                    <div className="relative">
                      <div 
                        className="w-full p-3 border rounded-md pl-10 cursor-pointer"
                        onClick={() => {
                          setSelectingCheckIn(true);
                          setShowDatePicker(!showDatePicker);
                        }}
                      >
                        {checkInDate 
                          ? checkInDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
                          : 'Select date'
                        }
                      </div>
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" size={18} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-neutral-700 mb-2">Check-out Date</label>
                    <div className="relative">
                      <div 
                        className="w-full p-3 border rounded-md pl-10 cursor-pointer"
                        onClick={() => {
                          if (!checkInDate) {
                            toast({
                              title: "Select check-in date first",
                              description: "Please select a check-in date before selecting check-out date",
                              variant: "destructive",
                            });
                            return;
                          }
                          setSelectingCheckIn(false);
                          setShowDatePicker(!showDatePicker);
                        }}
                      >
                        {checkOutDate 
                          ? checkOutDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
                          : 'Select date'
                        }
                      </div>
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" size={18} />
                    </div>
                  </div>
                </div>
                
                {/* Date Picker */}
                {showDatePicker && (
                  <div className="mb-4 p-4 border rounded-md">
                    <DatePicker 
                      selectedDate={selectingCheckIn ? checkInDate : checkOutDate}
                      minDate={selectingCheckIn ? new Date() : checkInDate || new Date()}
                      onDateSelect={handleDateSelect}
                      highlightRange={checkInDate !== null && !selectingCheckIn}
                      rangeStart={checkInDate}
                    />
                  </div>
                )}
                
                {numberOfNights > 0 && (
                  <div className="bg-neutral-50 p-4 rounded-md mb-4">
                    <div className="flex justify-between mb-3">
                      <span>{formatCurrency(hotel.price)} x {numberOfNights} {numberOfNights === 1 ? 'night' : 'nights'}</span>
                      <span>{formatCurrency(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between mb-3">
                      <span>Taxes & fees (18%)</span>
                      <span>{formatCurrency(calculateTax(totalPrice))}</span>
                    </div>
                    <div className="border-t pt-3 flex justify-between font-bold">
                      <span>Total</span>
                      <span>{formatCurrency(calculateTotalWithTax(totalPrice))}</span>
                    </div>
                  </div>
                )}
                
                <Button 
                  className="w-full bg-primary hover:bg-blue-600 text-white font-bold py-3 px-4 rounded transition"
                  onClick={handleProceedToPayment}
                  disabled={!checkInDate || !checkOutDate}
                >
                  Proceed to Payment
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HotelDetailPage;

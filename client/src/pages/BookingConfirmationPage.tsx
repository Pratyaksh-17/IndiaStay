import { useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { useAuth } from "@/hooks/use-auth";
import { BookingWithHotel } from "@/utils/types";
import { formatCurrency } from "@/utils/formatCurrency";
import { FileText, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SuccessCheckmark } from "@/components/ui/success-checkmark";

const BookingConfirmationPage = () => {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [match, params] = useRoute("/booking-confirmation/:bookingId");
  const bookingId = match ? parseInt(params.bookingId) : 0;
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      setLocation("/auth");
    }
  }, [user, setLocation]);
  
  // Fetch booking details
  const { data: bookings, isLoading } = useQuery<BookingWithHotel[]>({
    queryKey: ["/api/bookings"],
    queryFn: async () => {
      const res = await fetch("/api/bookings");
      if (!res.ok) throw new Error("Failed to fetch bookings");
      return res.json();
    },
    enabled: !!user,
  });
  
  // Find the specific booking
  const booking = bookings?.find(b => b.id === bookingId);
  
  // Format dates
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };
  
  // Generate booking ID
  const formattedBookingId = booking ? `IND${booking.id.toString().padStart(8, '0')}` : '';
  
  // Calculate number of nights
  const calculateNights = (checkIn: string, checkOut: string) => {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };
  
  const handleDownloadInvoice = () => {
    // In a real app, this would generate and download a PDF invoice
    alert("Invoice download functionality would be implemented here");
  };
  
  const handleEmailConfirmation = () => {
    // In a real app, this would send an email with booking confirmation
    alert("Email confirmation would be sent here");
  };
  
  if (isLoading) {
    return (
      <div className="pt-24 md:pt-20 pb-12">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
            <Skeleton className="w-20 h-20 rounded-full mx-auto mb-6" />
            <Skeleton className="h-8 w-64 mx-auto mb-2" />
            <Skeleton className="h-5 w-72 mx-auto mb-6" />
            <Skeleton className="h-40 w-full mb-6" />
            <div className="flex flex-col md:flex-row justify-center gap-4 mb-6">
              <Skeleton className="h-10 w-full md:w-40" />
              <Skeleton className="h-10 w-full md:w-40" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!booking) {
    return (
      <div className="pt-24 md:pt-20 pb-12">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Booking Not Found</h2>
            <p className="text-neutral-600 mb-6">We couldn't find the booking you're looking for.</p>
            <Button onClick={() => setLocation("/hotels")}>
              Browse Hotels
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>Booking Confirmed - IndiaStay</title>
        <meta name="description" content="Your hotel booking has been confirmed. View your booking details and get ready for your stay." />
      </Helmet>
      
      <div className="pt-24 md:pt-20 pb-12">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto text-center">
            <SuccessCheckmark size="lg" className="mb-6" />
            
            <h2 className="text-2xl font-bold mb-2 text-center text-green-600">Booking Confirmed!</h2>
            <p className="text-neutral-600 mb-6">
              Your reservation at {booking.hotel?.name} has been confirmed. Check your email for details.
            </p>
            
            <div className="bg-neutral-50 p-4 rounded-lg mb-6 text-left">
              <h3 className="font-bold mb-4 text-center">Booking Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-neutral-700"><span className="font-semibold">Booking ID:</span> {formattedBookingId}</p>
                  <p className="text-sm text-neutral-700"><span className="font-semibold">Hotel:</span> {booking.hotel?.name}</p>
                  <p className="text-sm text-neutral-700"><span className="font-semibold">Location:</span> {booking.hotel?.cityName}, {booking.hotel?.stateName}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-700">
                    <span className="font-semibold">Check-in:</span> {formatDate(booking.checkInDate)}, 2:00 PM
                  </p>
                  <p className="text-sm text-neutral-700">
                    <span className="font-semibold">Check-out:</span> {formatDate(booking.checkOutDate)}, 12:00 PM
                  </p>
                  <p className="text-sm text-neutral-700">
                    <span className="font-semibold">Guests:</span> {calculateNights(booking.checkInDate, booking.checkOutDate)} {calculateNights(booking.checkInDate, booking.checkOutDate) === 1 ? 'Night' : 'Nights'}
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-neutral-700 text-center">
                  <span className="font-semibold">Total Amount Paid:</span> {formatCurrency(booking.totalPrice)}
                </p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row justify-center gap-4 mb-6">
              <Button 
                className="bg-primary hover:bg-blue-600 text-white font-bold py-3 px-6 rounded transition flex items-center justify-center"
                onClick={handleDownloadInvoice}
              >
                <FileText className="mr-2" size={18} /> Download Invoice
              </Button>
              <Button 
                variant="outline"
                className="bg-white border border-primary hover:bg-neutral-50 text-primary font-bold py-3 px-6 rounded transition flex items-center justify-center"
                onClick={handleEmailConfirmation}
              >
                <Mail className="mr-2" size={18} /> Email Confirmation
              </Button>
            </div>
            
            <div className="text-center">
              <Button 
                variant="link" 
                onClick={() => setLocation("/")}
                className="text-primary hover:underline"
              >
                Return to Homepage
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookingConfirmationPage;

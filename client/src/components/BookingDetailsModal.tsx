import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { BookingWithHotel } from '@/utils/types';
import { formatCurrency } from '@/utils/formatCurrency';
import { CalendarDays, MapPin, Clock, User, Phone, Mail, CreditCard, AlertTriangle } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface BookingDetailsModalProps {
  booking: BookingWithHotel | null;
  isOpen: boolean;
  onClose: () => void;
  onCancelSuccess?: () => void;
}

const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({
  booking,
  isOpen,
  onClose,
  onCancelSuccess
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const cancelBookingMutation = useMutation({
    mutationFn: async (bookingId: number) => {
      const res = await apiRequest('POST', `/api/bookings/${bookingId}/cancel`);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Booking cancelled',
        description: 'Your booking has been successfully cancelled.',
        variant: 'default',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/bookings'] });
      if (onCancelSuccess) onCancelSuccess();
      onClose();
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to cancel booking',
        description: error.message || 'An error occurred. Please try again.',
        variant: 'destructive',
      });
    },
  });
  
  if (!booking) return null;
  
  const handleCancelBooking = () => {
    if (window.confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
      cancelBookingMutation.mutate(booking.id);
    }
  };
  
  const checkInDate = new Date(booking.checkInDate);
  const checkOutDate = new Date(booking.checkOutDate);
  const bookingDate = new Date(booking.createdAt || Date.now());
  
  // Calculate nights
  const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // Format dates for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Booking Details</DialogTitle>
          <DialogDescription>
            Booking Reference: #{booking.id}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {/* Hotel Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Hotel Information</h3>
            <div className="bg-muted rounded-lg p-4">
              <h4 className="text-xl font-bold">{booking.hotel?.name || 'Hotel'}</h4>
              <div className="flex items-center text-muted-foreground mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{booking.hotel ? `${booking.hotel.stateName}, ${booking.hotel.cityName}` : 'Location not available'}</span>
              </div>
              
              {booking.hotel?.images && (
                <div className="mt-3">
                  <img 
                    src={Array.isArray(booking.hotel.images) && booking.hotel.images.length > 0 
                      ? booking.hotel.images[0].toString()
                      : 'https://via.placeholder.com/400x300?text=Hotel+Image'} 
                    alt={booking.hotel.name} 
                    className="w-full h-48 object-cover rounded-md"
                  />
                </div>
              )}
              
              {booking.hotel?.amenities && (
                <div className="mt-3">
                  <h5 className="font-medium mb-1">Amenities</h5>
                  <div className="flex flex-wrap gap-1">
                    {Array.isArray(booking.hotel.amenities) && booking.hotel.amenities.length > 0 
                      ? booking.hotel.amenities.map((amenity, index) => (
                          <span key={index} className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                            {amenity}
                          </span>
                        ))
                      : <span className="text-muted-foreground">No amenities listed</span>
                    }
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Booking Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Booking Information</h3>
            <div className="bg-muted rounded-lg p-4 space-y-3">
              <div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <CalendarDays className="h-4 w-4 mr-2 text-primary" />
                    <span className="font-medium">Stay Duration</span>
                  </div>
                  <span className="font-bold">{nights} {nights === 1 ? 'Night' : 'Nights'}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                <div className="flex items-center">
                  <CalendarDays className="h-4 w-4 mr-2 text-primary" />
                  <span className="font-medium mr-2">Check-in:</span>
                  <span>{formatDate(checkInDate)}</span>
                </div>
                <div className="flex items-center">
                  <CalendarDays className="h-4 w-4 mr-2 text-primary" />
                  <span className="font-medium mr-2">Check-out:</span>
                  <span>{formatDate(checkOutDate)}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-primary" />
                  <span className="font-medium mr-2">Booked on:</span>
                  <span>{formatDate(bookingDate)}</span>
                </div>
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-primary" />
                  <span className="font-medium mr-2">Guest Name:</span>
                  <span>{booking.guestName || 'Not specified'}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-primary" />
                  <span className="font-medium mr-2">Contact:</span>
                  <span>{booking.guestPhone || 'Not specified'}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-primary" />
                  <span className="font-medium mr-2">Email:</span>
                  <span>{booking.guestEmail || 'Not specified'}</span>
                </div>
                <div className="flex items-center">
                  <CreditCard className="h-4 w-4 mr-2 text-primary" />
                  <span className="font-medium mr-2">Payment Method:</span>
                  <span className="capitalize">{booking.paymentMethod || 'Not specified'}</span>
                </div>
              </div>
            </div>
            
            {/* Pricing */}
            <div className="bg-muted rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">Payment Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Room Charges</span>
                  <span>{formatCurrency(booking.totalPrice * 0.82)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes & Fees (18%)</span>
                  <span>{formatCurrency(booking.totalPrice * 0.18)}</span>
                </div>
                <div className="border-t pt-2 mt-2 flex justify-between font-bold">
                  <span>Total Amount</span>
                  <span>{formatCurrency(booking.totalPrice)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Special Requests */}
        {booking.specialRequests && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Special Requests</h3>
            <div className="bg-muted rounded-lg p-4">
              <p className="italic">{booking.specialRequests}</p>
            </div>
          </div>
        )}
        
        {/* Booking Status */}
        <div className="mt-6 bg-muted rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="font-medium mr-2">Status:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium 
                ${booking.status === 'cancelled' 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-green-100 text-green-800'}`}>
                {booking.status || 'Confirmed'}
              </span>
            </div>
            
            {booking.status !== 'cancelled' && (
              <div className="flex items-center text-amber-600">
                <AlertTriangle className="h-4 w-4 mr-1" />
                <span className="text-sm">Cancellation may be subject to charges</span>
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter className="mt-6 gap-2">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Close
          </Button>
          {booking.status !== 'cancelled' && (
            <Button
              variant="destructive"
              onClick={handleCancelBooking}
              disabled={cancelBookingMutation.isPending}
            >
              {cancelBookingMutation.isPending ? 'Cancelling...' : 'Cancel Booking'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDetailsModal;
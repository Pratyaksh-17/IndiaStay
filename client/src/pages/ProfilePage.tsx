import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { useLocation } from 'wouter';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, User, Calendar, MapPin, Mail, Phone, Edit, Book, Clock } from 'lucide-react';
import { formatCurrency } from '@/utils/formatCurrency';
import { BookingWithHotel } from '@/utils/types';

export default function ProfilePage() {
  const [location, setLocation] = useLocation();
  const { user } = useAuth();
  
  // Query bookings for the logged-in user
  const { data: bookings, isLoading: isLoadingBookings } = useQuery<BookingWithHotel[]>({
    queryKey: ['/api/bookings'],
    enabled: !!user,
  });
  
  // If user is not logged in, redirect to login page
  React.useEffect(() => {
    if (!user) {
      setLocation('/auth');
    }
  }, [user, setLocation]);
  
  if (!user) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-16 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-2">
          <TabsTrigger value="profile" className="text-sm md:text-base">
            <User className="mr-2 h-4 w-4" />
            Profile Details
          </TabsTrigger>
          <TabsTrigger value="bookings" className="text-sm md:text-base">
            <Book className="mr-2 h-4 w-4" />
            Your Bookings
          </TabsTrigger>
        </TabsList>
        
        {/* Profile Tab Content */}
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" /> 
                Personal Information
              </CardTitle>
              <CardDescription>
                Your personal details and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                    <div className="text-lg font-medium">{user.name}</div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                    <div className="flex items-center">
                      <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{user.email}</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                    <div className="flex items-center">
                      <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Not provided</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Address</label>
                    <div className="flex items-center">
                      <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Not provided</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Member Since</label>
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{new Date().toLocaleDateString('en-IN', { 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric'
                      })}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button className="mt-4">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage your account preferences and settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="justify-start">
                  Change Password
                </Button>
                <Button variant="outline" className="justify-start">
                  Notification Preferences
                </Button>
                <Button variant="outline" className="justify-start">
                  Payment Methods
                </Button>
                <Button variant="outline" className="justify-start">
                  Travel Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Bookings Tab Content */}
        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Book className="mr-2 h-5 w-5" />
                Your Bookings
              </CardTitle>
              <CardDescription>
                View and manage your current and past hotel bookings
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingBookings ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : bookings && bookings.length > 0 ? (
                <div className="space-y-6">
                  {bookings.map((booking) => (
                    <Card key={booking.id} className="overflow-hidden">
                      <div className="md:flex">
                        <div className="md:w-1/3">
                          <img 
                            src={(booking.hotel?.images as string[])?.[0] || 'https://via.placeholder.com/400x300?text=Hotel+Image'} 
                            alt={booking.hotel?.name || 'Hotel'} 
                            className="h-48 w-full object-cover md:h-full"
                          />
                        </div>
                        <div className="p-4 md:p-6 md:w-2/3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-bold">
                                {booking.hotel?.name || 'Hotel Booking'}
                              </h3>
                              <p className="text-muted-foreground">
                                <MapPin className="inline-block mr-1 h-4 w-4" />
                                {booking.hotel ? `${booking.hotel.stateName}, ${booking.hotel.cityName}` : 'Location not available'}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold">
                                {formatCurrency(booking.totalPrice)}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Booking ID: {booking.id}
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                              <div className="flex items-center text-sm">
                                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                                <span>Check-in: </span>
                                <span className="font-medium ml-1">
                                  {new Date(booking.checkInDate).toLocaleDateString('en-IN')}
                                </span>
                              </div>
                              <div className="flex items-center text-sm mt-1">
                                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                                <span>Check-out: </span>
                                <span className="font-medium ml-1">
                                  {new Date(booking.checkOutDate).toLocaleDateString('en-IN')}
                                </span>
                              </div>
                            </div>
                            <div>
                              <div className="flex items-center text-sm">
                                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                                <span>Booking Date: </span>
                                <span className="font-medium ml-1">
                                  {new Date(booking.createdAt || Date.now()).toLocaleDateString('en-IN')}
                                </span>
                              </div>
                              <div className="flex items-center text-sm mt-1">
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  {booking.status || 'Confirmed'}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex justify-end mt-4 space-x-2">
                            <Button variant="outline" size="sm">View Details</Button>
                            <Button variant="destructive" size="sm">Cancel Booking</Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Book className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
                  <h3 className="mt-4 text-lg font-medium">No bookings found</h3>
                  <p className="text-muted-foreground mt-2">
                    You haven't made any hotel bookings yet.
                  </p>
                  <Button className="mt-4" onClick={() => setLocation('/hotels')}>
                    Explore Hotels
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
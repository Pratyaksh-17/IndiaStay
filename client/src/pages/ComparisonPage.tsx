import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation, useRoute, Link } from 'wouter';
import { Loader2, ArrowLeft } from 'lucide-react';
import HotelComparisonTable from '@/components/HotelComparisonTable';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { HotelWithLocation } from '@/utils/types';
import { type State, type Hotel, type City } from '@shared/schema';

export default function ComparisonPage() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute('/compare/:stateId');
  const stateId = match ? parseInt(params?.stateId || '0') : 0;
  
  const [hotelsToCompare, setHotelsToCompare] = useState<HotelWithLocation[]>([]);
  
  // Get state name for the header
  const { data: states } = useQuery<State[]>({
    queryKey: ['/api/states'],
  });
  
  const stateName = states?.find((state: State) => state.id === stateId)?.name || '';
  
  // Get all cities for location display
  const { data: allCities } = useQuery<City[]>({
    queryKey: ['/api/cities'],
  });
  
  // Fetch hotels for this state
  const { data: hotelsInState, isLoading } = useQuery<Hotel[]>({
    queryKey: [`/api/hotels/byState/${stateId}`],
    enabled: stateId > 0,
  });

  useEffect(() => {
    // Reset comparison when stateId changes
    setHotelsToCompare([]);
  }, [stateId]);

  const handleCompareHotel = (hotel: HotelWithLocation) => {
    if (!hotelsToCompare.some(h => h.id === hotel.id)) {
      setHotelsToCompare(prev => [...prev, hotel]);
    }
  };

  const handleRemoveHotel = (hotelId: number) => {
    setHotelsToCompare(prev => prev.filter(hotel => hotel.id !== hotelId));
  };

  if (!match) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Hotel Comparison</CardTitle>
            <CardDescription>
              Select a state first to compare hotels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {states?.map((state: State) => (
                <Button 
                  key={state.id} 
                  onClick={() => setLocation(`/compare/${state.id}`)}
                  className="text-lg py-6"
                >
                  {state.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => setLocation('/compare')} className="mr-2">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to States
        </Button>
        <h1 className="text-3xl font-bold">Hotels in {stateName}</h1>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center my-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <>
          {hotelsToCompare.length > 0 ? (
            <div className="mb-8">
              <Card>
                <CardHeader className="bg-muted/50">
                  <CardTitle>Comparing {hotelsToCompare.length} Hotels</CardTitle>
                  <CardDescription>
                    Compare prices, ratings, and amenities to find the best hotel for your stay
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <HotelComparisonTable 
                    hotels={hotelsToCompare} 
                    onRemove={handleRemoveHotel} 
                  />
                </CardContent>
              </Card>
            </div>
          ) : (
            <Alert className="mb-6">
              <AlertDescription>
                Select at least two hotels to compare their features and prices.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotelsInState?.map((hotel) => {
              const isSelected = hotelsToCompare.some(h => h.id === hotel.id);
              
              // Get city and state info to create location string
              const cityName = allCities?.find((city: City) => city.id === hotel.cityId)?.name || '';
              const location = cityName ? `${cityName}, ${stateName}` : stateName;
              
              // Some hotels may have image_url as a field or might have images array
              const imageUrl = Array.isArray(hotel.images) && hotel.images.length > 0 
                ? hotel.images[0] 
                : '';
                  
              return (
                <Card key={hotel.id} className={isSelected ? "border-primary" : ""}>
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={imageUrl} 
                      alt={hotel.name} 
                      className="w-full h-full object-cover"
                    />
                    {isSelected && (
                      <div className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded-md">
                        Selected for comparison
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl">{hotel.name}</CardTitle>
                    <CardDescription>{location}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <Button
                        variant={isSelected ? "outline" : "default"}
                        onClick={() => {
                          if (isSelected) {
                            handleRemoveHotel(hotel.id);
                          } else {
                            const cityName = location.split(', ')[0] || '';
                            handleCompareHotel({
                              ...hotel,
                              stateName,
                              cityName
                            });
                          }
                        }}
                        className="w-full mr-2"
                      >
                        {isSelected ? "Remove from comparison" : "Add to comparison"}
                      </Button>
                      <Link href={`/hotels/${hotel.id}`}>
                        <Button variant="outline" className="flex-shrink-0">View</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
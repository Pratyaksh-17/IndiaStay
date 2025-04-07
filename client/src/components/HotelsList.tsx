import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Hotel, State } from "@shared/schema";
import HotelCard from "./HotelCard";
import { formatCurrency } from "@/utils/formatCurrency";

interface HotelsListProps {
  stateId?: number;
  cityId?: number;
  searchQuery?: string;
}

const HotelsList = ({ stateId, cityId, searchQuery }: HotelsListProps) => {
  // State for filters
  const [priceRange, setPriceRange] = useState<[number, number]>([1000, 20000]);
  const [selectedStates, setSelectedStates] = useState<number[]>(stateId ? [stateId] : []);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  
  // Get all states
  const { data: states, isLoading: statesLoading } = useQuery<State[]>({
    queryKey: ['/api/states'],
    queryFn: async () => {
      const res = await fetch('/api/states');
      if (!res.ok) throw new Error('Failed to fetch states');
      return res.json();
    }
  });
  
  // Build query URL based on filters
  const getQueryUrl = () => {
    let url = '/api/hotels';
    const params = new URLSearchParams();
    
    if (stateId) {
      params.append('stateId', stateId.toString());
    } else if (cityId) {
      params.append('cityId', cityId.toString());
    } else if (searchQuery) {
      params.append('query', searchQuery);
    } else if (selectedStates.length > 0) {
      // This is simplified; in a real app you might make multiple calls or add support for array params
      params.append('stateId', selectedStates[0].toString());
    }
    
    const queryString = params.toString();
    return queryString ? `${url}?${queryString}` : url;
  };

  // Get hotels with filters
  const { data: hotels, isLoading: hotelsLoading } = useQuery<Hotel[]>({
    queryKey: [getQueryUrl()],
    queryFn: async () => {
      const res = await fetch(getQueryUrl());
      if (!res.ok) throw new Error('Failed to fetch hotels');
      return res.json();
    }
  });
  
  // Filter hotels based on UI filters (we do this client-side)
  const filteredHotels = hotels?.filter(hotel => {
    // Filter by price
    if (hotel.price < priceRange[0] || hotel.price > priceRange[1]) return false;
    
    // Filter by rating
    if (selectedRating !== null && hotel.rating !== selectedRating) return false;
    
    // Filter by amenities
    if (selectedAmenities.length > 0) {
      const hotelAmenities = hotel.amenities as string[];
      if (!selectedAmenities.every(amenity => hotelAmenities.includes(amenity))) return false;
    }
    
    return true;
  });
  
  // Handle filter changes
  const handleStateChange = (stateId: number) => {
    setSelectedStates(prev => 
      prev.includes(stateId) 
        ? prev.filter(id => id !== stateId)
        : [...prev, stateId]
    );
  };
  
  const handleRatingChange = (rating: number) => {
    setSelectedRating(prev => prev === rating ? null : rating);
  };
  
  const handleAmenityChange = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };
  
  const resetFilters = () => {
    setPriceRange([1000, 20000]);
    setSelectedStates(stateId ? [stateId] : []);
    setSelectedRating(null);
    setSelectedAmenities([]);
  };
  
  const isLoading = statesLoading || hotelsLoading;
  
  return (
    <section className="container mx-auto px-4 py-8">
      <h2 className="text-2xl md:text-3xl font-bold mb-4 font-heading">Hotels Across India</h2>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters Sidebar */}
        <div className="lg:w-1/4">
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-lg">Filters</h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={resetFilters}
              >
                Reset
              </Button>
            </div>
            
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Price Range</h4>
              <div className="px-2">
                <Slider
                  defaultValue={[1000, 20000]}
                  min={1000}
                  max={20000}
                  step={500}
                  value={priceRange}
                  onValueChange={(value) => setPriceRange(value as [number, number])}
                />
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-sm">{formatCurrency(priceRange[0])}</span>
                <span className="text-sm">{formatCurrency(priceRange[1])}</span>
              </div>
            </div>
            
            <div className="mb-4">
              <h4 className="font-semibold mb-2">States</h4>
              {isLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-6 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {states?.map((state) => (
                    <div key={state.id} className="flex items-center">
                      <Checkbox
                        id={`state-${state.id}`}
                        checked={selectedStates.includes(state.id)}
                        onCheckedChange={() => handleStateChange(state.id)}
                      />
                      <label htmlFor={`state-${state.id}`} className="ml-2 text-sm">
                        {state.name}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Hotel Rating</h4>
              <div className="flex items-center space-x-2">
                <Button
                  variant={selectedRating === null ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => setSelectedRating(null)}
                >
                  All
                </Button>
                {[5, 4, 3].map((rating) => (
                  <Button
                    key={rating}
                    variant={selectedRating === rating ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => handleRatingChange(rating)}
                    className="flex items-center"
                  >
                    <i className="fas fa-star text-yellow-500 mr-1"></i>
                    <span>{rating}{rating === 5 ? "" : "+"}</span>
                  </Button>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Amenities</h4>
              <div className="space-y-2">
                {["Free Wifi", "Swimming Pool", "Spa", "Restaurant", "Gym"].map((amenity) => (
                  <div key={amenity} className="flex items-center">
                    <Checkbox
                      id={`amenity-${amenity}`}
                      checked={selectedAmenities.includes(amenity)}
                      onCheckedChange={() => handleAmenityChange(amenity)}
                    />
                    <label htmlFor={`amenity-${amenity}`} className="ml-2 text-sm">
                      {amenity}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Hotel List */}
        <div className="lg:w-3/4">
          {isLoading ? (
            // Loading skeletons
            <>
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-md mb-4 overflow-hidden">
                  <div className="md:flex">
                    <div className="md:w-1/3">
                      <Skeleton className="w-full h-48 md:h-full" />
                    </div>
                    <div className="p-4 md:p-6 md:w-2/3">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2 mb-2" />
                      <Skeleton className="h-4 w-2/3 mb-3" />
                      <div className="flex flex-wrap gap-2 mb-4">
                        {[1, 2, 3, 4].map((j) => (
                          <Skeleton key={j} className="h-6 w-20" />
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-10 w-28" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : filteredHotels && filteredHotels.length > 0 ? (
            // Hotel list
            <>
              {filteredHotels.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))}
            </>
          ) : (
            // No hotels found
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <h3 className="text-xl font-semibold mb-2">No hotels found</h3>
              <p className="text-neutral-600">Try adjusting your filters or search criteria.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HotelsList;

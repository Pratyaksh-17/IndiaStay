import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { State } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

const destinations = [
  {
    name: "New Delhi",
    image: "https://images.unsplash.com/photo-1591271315871-81ab4f8b5487?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    state: "Delhi"
  },
  {
    name: "Mumbai",
    image: "https://images.unsplash.com/photo-1566552881560-0be862a7c445?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    state: "Maharashtra"
  },
  {
    name: "Jaipur",
    image: "https://images.unsplash.com/photo-1587922546307-776227941871?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    state: "Rajasthan"
  },
  {
    name: "Goa",
    image: "https://images.unsplash.com/photo-1596703631159-c2081033ae6e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    state: "Goa"
  }
];

const PopularDestinations = () => {
  const [, setLocation] = useLocation();
  
  // Get all states to determine state IDs
  const { data: states, isLoading } = useQuery<State[]>({
    queryKey: ['/api/states'],
    queryFn: async () => {
      const res = await fetch('/api/states');
      if (!res.ok) throw new Error('Failed to fetch states');
      return res.json();
    }
  });

  // Get hotels count for each state
  const { data: hotels } = useQuery({
    queryKey: ['/api/hotels'],
    queryFn: async () => {
      const res = await fetch('/api/hotels');
      if (!res.ok) throw new Error('Failed to fetch hotels');
      return res.json();
    }
  });

  const getHotelCount = (stateName: string): number => {
    if (!hotels || !states) return 0;
    
    const stateId = states.find(state => state.name === stateName)?.id;
    if (!stateId) return 0;
    
    return hotels.filter((hotel: any) => hotel.stateId === stateId).length;
  };

  const handleDestinationClick = (destination: typeof destinations[0]) => {
    const state = states?.find(s => s.name === destination.state);
    if (state) {
      setLocation(`/hotels?stateId=${state.id}`);
    }
  };

  return (
    <section className="container mx-auto px-4 py-12">
      <h2 className="text-2xl md:text-3xl font-bold mb-8 font-heading">Popular Destinations in India</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {destinations.map((destination, index) => (
          <Card 
            key={index} 
            className="rounded-lg overflow-hidden shadow-md relative group cursor-pointer"
            onClick={() => handleDestinationClick(destination)}
          >
            <div className="relative">
              <img 
                src={destination.image} 
                alt={destination.name} 
                className="w-full h-40 object-cover group-hover:scale-105 transition duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <CardContent className="absolute bottom-0 left-0 p-4">
                <h3 className="text-white font-bold">{destination.name}</h3>
                <p className="text-white text-sm">
                  {isLoading ? (
                    <Skeleton className="h-4 w-16 bg-white/20" />
                  ) : (
                    `${getHotelCount(destination.state)} hotels`
                  )}
                </p>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default PopularDestinations;

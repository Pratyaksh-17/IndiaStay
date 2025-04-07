import { Helmet } from "react-helmet";
import { useLocation } from "wouter";
import HotelsList from "@/components/HotelsList";
import SearchBar from "@/components/SearchBar";

const HotelsPage = () => {
  const [location, setLocation] = useLocation();
  
  // Parse query parameters
  const params = new URLSearchParams(location.split('?')[1]);
  const stateId = params.get('stateId') ? parseInt(params.get('stateId')!) : undefined;
  const cityId = params.get('cityId') ? parseInt(params.get('cityId')!) : undefined;
  const searchQuery = params.get('query') || undefined;
  
  const handleSearch = (query: string) => {
    setLocation(`/hotels?query=${encodeURIComponent(query)}`);
  };
  
  return (
    <>
      <Helmet>
        <title>Hotels Across India - IndiaStay</title>
        <meta name="description" content="Browse and book from a wide selection of hotels across different states in India." />
      </Helmet>
      
      <div className="pt-24 md:pt-20 pb-12">
        <div className="container mx-auto px-4 mb-8">
          <SearchBar 
            onSearch={handleSearch} 
            initialValue={searchQuery}
          />
        </div>
        
        <HotelsList 
          stateId={stateId} 
          cityId={cityId}
          searchQuery={searchQuery}
        />
      </div>
    </>
  );
};

export default HotelsPage;

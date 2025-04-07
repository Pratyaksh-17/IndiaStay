import { useState } from "react";
import { useLocation } from "wouter";
import SearchBar from "./SearchBar";

const Hero = () => {
  const [, setLocation] = useLocation();
  
  const handleSearch = (query: string) => {
    // Navigate to hotels page with search query
    setLocation(`/hotels?query=${encodeURIComponent(query)}`);
  };
  
  return (
    <div className="relative">
      <div 
        className="w-full h-80 md:h-96 bg-cover bg-center" 
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1598804163174-fe97efe39ec0?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')" 
        }}
      >
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
          <h1 className="text-white text-3xl md:text-5xl font-bold mb-4 font-heading">Discover Incredible India</h1>
          <p className="text-white text-xl md:text-2xl mb-8">Find your perfect stay across the country</p>
        </div>
      </div>
      
      {/* Search Box */}
      <div className="container mx-auto px-4 relative -mt-10">
        <SearchBar onSearch={handleSearch} />
      </div>
    </div>
  );
};

export default Hero;

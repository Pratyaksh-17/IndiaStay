import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Hotel } from "@shared/schema";
import { Search, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import DatePicker from "./DatePicker";

interface SearchBarProps {
  onSearch: (query: string) => void;
  initialValue?: string;
}

const SearchBar = ({ onSearch, initialValue = "" }: SearchBarProps) => {
  const [searchValue, setSearchValue] = useState(initialValue);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectingCheckIn, setSelectingCheckIn] = useState(true);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const datePickerRef = useRef<HTMLDivElement>(null);
  
  // Fetch hotel suggestions based on search query
  const { data: suggestions = [] } = useQuery<Hotel[]>({
    queryKey: ['/api/hotels/search', searchValue],
    queryFn: async () => {
      if (!searchValue || searchValue.length < 2) return [];
      const res = await fetch(`/api/hotels/search/${encodeURIComponent(searchValue)}`);
      if (!res.ok) throw new Error('Failed to fetch suggestions');
      return res.json();
    },
    enabled: searchValue.length >= 2,
  });
  
  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node) && 
          searchInputRef.current && !searchInputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
      
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setShowDatePicker(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = () => {
    if (searchValue.trim()) {
      onSearch(searchValue);
      setShowSuggestions(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  const handleSuggestionClick = (suggestion: Hotel) => {
    setSearchValue(suggestion.name);
    setShowSuggestions(false);
    onSearch(suggestion.name);
  };
  
  const handleCheckInClick = () => {
    setSelectingCheckIn(true);
    setShowDatePicker(prev => !prev);
  };
  
  const handleCheckOutClick = () => {
    setSelectingCheckIn(false);
    setShowDatePicker(prev => !prev);
  };
  
  const handleDateSelect = (date: Date) => {
    if (selectingCheckIn) {
      setCheckInDate(date);
      setSelectingCheckIn(false);
    } else {
      setCheckOutDate(date);
      setShowDatePicker(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="md:flex space-y-4 md:space-y-0 md:space-x-4">
        <div className="relative flex-grow">
          <div className="flex items-center border rounded-md overflow-hidden">
            <div className="bg-neutral-100 p-3">
              <Search className="text-neutral-600" />
            </div>
            <input 
              type="text" 
              ref={searchInputRef}
              placeholder="Search for hotels, cities, or states" 
              className="py-3 px-4 w-full focus:outline-none" 
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={handleKeyDown}
            />
          </div>
          
          {/* Search Suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <div 
              ref={suggestionsRef}
              className="absolute z-50 left-0 right-0 mt-1 bg-white rounded-md border max-h-60 overflow-y-auto shadow-md"
            >
              {suggestions.map((suggestion) => (
                <div 
                  key={suggestion.id} 
                  className="p-3 border-b hover:bg-neutral-100 cursor-pointer"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <div className="font-semibold">{suggestion.name}</div>
                  <div className="text-sm text-neutral-600">
                    {suggestion.cityName}, {suggestion.stateName}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="md:w-1/3 flex space-x-2">
          <div className="relative flex-1">
            <div 
              className="border rounded-md p-3 cursor-pointer h-full flex flex-col"
              onClick={handleCheckInClick}
            >
              <div className="text-sm text-neutral-600">Check-in</div>
              <div className="font-semibold">
                {checkInDate ? checkInDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Select date'}
              </div>
            </div>
          </div>
          
          <div className="relative flex-1">
            <div 
              className="border rounded-md p-3 cursor-pointer h-full flex flex-col"
              onClick={handleCheckOutClick}
            >
              <div className="text-sm text-neutral-600">Check-out</div>
              <div className="font-semibold">
                {checkOutDate ? checkOutDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Select date'}
              </div>
            </div>
          </div>
          
          {/* Date Picker Popover */}
          {showDatePicker && (
            <div 
              ref={datePickerRef}
              className="absolute top-full mt-1 left-0 z-40 bg-white rounded-lg shadow-lg p-4"
            >
              <DatePicker 
                selectedDate={selectingCheckIn ? checkInDate : checkOutDate}
                minDate={selectingCheckIn ? new Date() : checkInDate || new Date()}
                onDateSelect={handleDateSelect}
                highlightRange={checkInDate && !selectingCheckIn}
                rangeStart={checkInDate}
              />
            </div>
          )}
        </div>
        
        <Button 
          className="bg-primary hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-md transition"
          onClick={handleSearch}
        >
          Search Hotels
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;

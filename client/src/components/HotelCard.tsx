import { Link } from "wouter";
import { formatCurrency } from "@/utils/formatCurrency";
import { Star, MapPin } from "lucide-react";
import { HotelWithLocation } from "@/utils/types";

interface HotelCardProps {
  hotel: HotelWithLocation;
}

const HotelCard = ({ hotel }: HotelCardProps) => {
  const { id, name, cityName, stateName, price, rating, amenities, images, availability } = hotel;
  
  // Generate star rating UI
  const stars = [];
  for (let i = 0; i < rating; i++) {
    stars.push(<Star key={i} className="fill-yellow-500 text-yellow-500" size={16} />);
  }
  
  // Get primary image
  const primaryImage = Array.isArray(images) && images.length > 0 ? images[0] : "";
  
  // Format price with rupee symbol
  const formattedPrice = formatCurrency(price);
  
  // Calculate taxes (18%)
  const taxes = price * 0.18;
  const formattedTaxes = formatCurrency(taxes);
  
  return (
    <div className="bg-white rounded-lg shadow-md mb-4 overflow-hidden hover:shadow-lg transition">
      <div className="md:flex">
        <div className="md:w-1/3">
          <img 
            src={primaryImage} 
            alt={name} 
            className="w-full h-48 md:h-full object-cover"
          />
        </div>
        <div className="p-4 md:p-6 md:w-2/3">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold mb-1">{name}</h3>
              <div className="flex items-center mb-2">
                <div className="flex text-yellow-500">
                  {stars}
                </div>
                <span className="ml-2 text-sm text-neutral-600">{rating}-star hotel</span>
              </div>
              <p className="text-neutral-600 mb-3">
                <MapPin className="inline-block text-red-500 mr-1" size={16} />
                {cityName}, {stateName}
              </p>
            </div>
            <div className="text-right">
              <div className="text-green-600 font-bold price-tag">
                {formattedPrice}
              </div>
              <div className="text-xs text-neutral-500">per night</div>
              <div className="text-xs text-neutral-500">+{formattedTaxes} taxes & fees</div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {Array.isArray(amenities) && amenities.map((amenity, index) => (
              <span key={index} className="bg-neutral-100 text-neutral-800 text-xs px-2 py-1 rounded">
                {amenity}
              </span>
            ))}
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              {availability ? (
                <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">Available</span>
              ) : (
                <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded">Limited Rooms</span>
              )}
            </div>
            <Link href={`/hotels/${id}`}>
              <a className="bg-primary hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded transition">
                View Details
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;

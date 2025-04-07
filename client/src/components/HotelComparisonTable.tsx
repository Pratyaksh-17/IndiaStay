import React from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Star, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from '@/utils/formatCurrency';
import type { HotelWithLocation } from '@/utils/types';
import { Link } from "wouter";

interface HotelComparisonTableProps {
  hotels: HotelWithLocation[];
  onRemove: (hotelId: number) => void;
}

const HotelComparisonTable: React.FC<HotelComparisonTableProps> = ({ hotels, onRemove }) => {
  // Find all unique amenities across all hotels
  const allAmenities = new Set<string>();
  hotels.forEach(hotel => {
    if (Array.isArray(hotel.amenities)) {
      hotel.amenities.forEach((amenity: string) => {
        allAmenities.add(amenity);
      });
    }
  });

  // Sort hotels by price (ascending)
  const sortedByPrice = [...hotels].sort((a, b) => a.price - b.price);
  
  // Sort hotels by rating (descending)
  const sortedByRating = [...hotels].sort((a, b) => b.rating - a.rating);
  
  // Find the best value (highest rating to price ratio)
  const bestValue = [...hotels].sort((a, b) => (b.rating / b.price) - (a.rating / a.price))[0];

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableCaption>Comparison of {hotels.length} hotels in {hotels[0]?.stateName}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Features</TableHead>
            {hotels.map(hotel => (
              <TableHead key={hotel.id} className="text-center">
                {hotel.id === bestValue?.id && (
                  <Badge className="mb-2 bg-gradient-to-r from-green-500 to-emerald-600">Best Value</Badge>
                )}
                <div className="font-bold text-lg">{hotel.name}</div>
                <div className="text-sm text-muted-foreground">{hotel.cityName}</div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mt-1 text-red-500 hover:text-red-700"
                  onClick={() => onRemove(hotel.id)}
                >
                  Remove
                </Button>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-bold">Price</TableCell>
            {hotels.map(hotel => (
              <TableCell key={hotel.id} className="text-center">
                {formatCurrency(hotel.price)}
                {hotel.id === sortedByPrice[0]?.id && (
                  <Badge variant="secondary" className="ml-2">Lowest</Badge>
                )}
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell className="font-bold">Rating</TableCell>
            {hotels.map(hotel => (
              <TableCell key={hotel.id} className="text-center">
                <div className="flex items-center justify-center">
                  {Array.from({ length: hotel.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  {hotel.id === sortedByRating[0]?.id && (
                    <Badge variant="secondary" className="ml-2">Highest</Badge>
                  )}
                </div>
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell className="font-bold">View Details</TableCell>
            {hotels.map(hotel => (
              <TableCell key={hotel.id} className="text-center">
                <Link href={`/hotels/${hotel.id}`}>
                  <Button size="sm">View Hotel</Button>
                </Link>
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell className="font-bold" colSpan={hotels.length + 1}>
              <div className="text-lg font-semibold mt-4">Amenities</div>
            </TableCell>
          </TableRow>
          {Array.from(allAmenities).sort().map(amenity => (
            <TableRow key={amenity}>
              <TableCell>{amenity}</TableCell>
              {hotels.map(hotel => (
                <TableCell key={hotel.id} className="text-center">
                  {Array.isArray(hotel.amenities) && hotel.amenities.includes(amenity) ? (
                    <Check className="h-5 w-5 text-green-500 mx-auto" />
                  ) : (
                    <X className="h-5 w-5 text-red-500 mx-auto" />
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default HotelComparisonTable;
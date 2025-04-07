import { Hotel, Booking, Package, Offer, User } from "@shared/schema";

// Extended hotel type with state and city names
export interface HotelWithLocation extends Hotel {
  stateName?: string;
  cityName?: string;
}

// Extended booking type with hotel information
export interface BookingWithHotel extends Booking {
  hotel?: HotelWithLocation;
}

// Booking details for the booking form
export interface BookingFormData {
  hotelId: number;
  checkInDate: Date;
  checkOutDate: Date;
  totalPrice: number;
  paymentMethod: PaymentMethod;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  specialRequests?: string;
}

// Payment method types
export type PaymentMethod = "upi" | "card" | "netbanking" | "wallet";

// Search form data
export interface SearchFormData {
  query: string;
  checkInDate?: Date;
  checkOutDate?: Date;
}

// Filter options for hotels
export interface HotelFilters {
  stateIds?: number[];
  priceRange?: [number, number];
  rating?: number;
  amenities?: string[];
}

// QR code response
export interface QRCodeResponse {
  qrCode: string;
}

// Payment information
export interface PaymentInfo {
  bookingId: string;
  amount: number;
  customerName: string;
  hotelName: string;
  dateTime: string;
}

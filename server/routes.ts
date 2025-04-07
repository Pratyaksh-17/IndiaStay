import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { generateQRCode } from "./qrCodeGenerator";
import { z } from "zod";
import { insertBookingSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);
  
  // Get all states
  app.get("/api/states", async (_req, res) => {
    try {
      const states = await storage.getStates();
      res.json(states);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch states" });
    }
  });
  
  // Get cities by state
  app.get("/api/states/:stateId/cities", async (req, res) => {
    try {
      const stateId = parseInt(req.params.stateId);
      if (isNaN(stateId)) {
        return res.status(400).json({ message: "Invalid state ID" });
      }
      
      const cities = await storage.getCitiesByState(stateId);
      res.json(cities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cities" });
    }
  });
  
  // Get all hotels
  app.get("/api/hotels", async (req, res) => {
    try {
      const { stateId, cityId, query } = req.query;
      
      let hotels;
      
      if (stateId) {
        const id = parseInt(stateId as string);
        if (isNaN(id)) {
          return res.status(400).json({ message: "Invalid state ID" });
        }
        hotels = await storage.getHotelsByState(id);
      } else if (cityId) {
        const id = parseInt(cityId as string);
        if (isNaN(id)) {
          return res.status(400).json({ message: "Invalid city ID" });
        }
        hotels = await storage.getHotelsByCity(id);
      } else if (query) {
        hotels = await storage.searchHotels(query as string);
      } else {
        hotels = await storage.getHotels();
      }
      
      // Join with state and city data
      const states = await storage.getStates();
      const cities = await storage.getCities();
      
      const stateMap = new Map(states.map(state => [state.id, state]));
      const cityMap = new Map(cities.map(city => [city.id, city]));
      
      const hotelsWithDetails = hotels.map(hotel => ({
        ...hotel,
        stateName: stateMap.get(hotel.stateId)?.name,
        cityName: cityMap.get(hotel.cityId)?.name,
      }));
      
      res.json(hotelsWithDetails);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch hotels" });
    }
  });
  
  // Get hotel by ID
  app.get("/api/hotels/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid hotel ID" });
      }
      
      const hotel = await storage.getHotel(id);
      if (!hotel) {
        return res.status(404).json({ message: "Hotel not found" });
      }
      
      // Get state and city name
      const state = await storage.getState(hotel.stateId);
      const city = await storage.getCity(hotel.cityId);
      
      res.json({
        ...hotel,
        stateName: state?.name,
        cityName: city?.name,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch hotel" });
    }
  });
  
  // Search hotels
  app.get("/api/hotels/search/:query", async (req, res) => {
    try {
      const { query } = req.params;
      const hotels = await storage.searchHotels(query);
      
      // Join with state and city data
      const states = await storage.getStates();
      const cities = await storage.getCities();
      
      const stateMap = new Map(states.map(state => [state.id, state]));
      const cityMap = new Map(cities.map(city => [city.id, city]));
      
      const hotelsWithDetails = hotels.map(hotel => ({
        ...hotel,
        stateName: stateMap.get(hotel.stateId)?.name,
        cityName: cityMap.get(hotel.cityId)?.name,
      }));
      
      res.json(hotelsWithDetails);
    } catch (error) {
      res.status(500).json({ message: "Failed to search hotels" });
    }
  });
  
  // Get all packages
  app.get("/api/packages", async (_req, res) => {
    try {
      const packages = await storage.getPackages();
      res.json(packages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch packages" });
    }
  });
  
  // Get all offers
  app.get("/api/offers", async (_req, res) => {
    try {
      const offers = await storage.getOffers();
      res.json(offers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch offers" });
    }
  });
  
  // Create a booking
  app.post("/api/bookings", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to create a booking" });
      }
      
      const bookingData = insertBookingSchema.parse(req.body);
      
      const booking = await storage.createBooking({
        ...bookingData,
        userId: req.user!.id,
      });
      
      res.status(201).json(booking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid booking data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create booking" });
    }
  });
  
  // Get bookings for current user
  app.get("/api/bookings", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to view bookings" });
      }
      
      const bookings = await storage.getBookingsByUser(req.user!.id);
      
      // Join with hotel data
      const hotels = await storage.getHotels();
      const hotelMap = new Map(hotels.map(hotel => [hotel.id, hotel]));
      
      const bookingsWithHotelInfo = await Promise.all(
        bookings.map(async (booking) => {
          const hotel = hotelMap.get(booking.hotelId);
          let hotelInfo = null;
          
          if (hotel) {
            const state = await storage.getState(hotel.stateId);
            const city = await storage.getCity(hotel.cityId);
            
            hotelInfo = {
              ...hotel,
              stateName: state?.name,
              cityName: city?.name,
            };
          }
          
          return {
            ...booking,
            hotel: hotelInfo,
          };
        })
      );
      
      res.json(bookingsWithHotelInfo);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });
  
  // Generate a QR code for payment
  app.post("/api/generate-qr-code", async (req, res) => {
    try {
      const { paymentInfo } = req.body;
      
      if (!paymentInfo) {
        return res.status(400).json({ message: "Payment info is required" });
      }
      
      const qrCodeDataUrl = await generateQRCode(JSON.stringify(paymentInfo));
      res.json({ qrCode: qrCodeDataUrl });
    } catch (error) {
      res.status(500).json({ message: "Failed to generate QR code" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

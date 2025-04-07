import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { generateQRCode } from "./qrCodeGenerator";
import { z } from "zod";
import { insertBookingSchema, insertHotelSchema, insertStateSchema, insertCitySchema, insertPackageSchema, insertOfferSchema } from "@shared/schema";

// Data initialization helper function
async function initializeData() {
  try {
    // Always create packages and offers regardless of other data
    try {
      console.log("Initializing packages and offers data...");
      
      // First clear existing data
      await storage.clearPackages();
      await storage.clearOffers();
      
      // Create offers
      const offers = [
        {
          code: "WELCOME20",
          description: "20% off on your first booking",
          discount_percentage: 20,
          valid_from: new Date(),
          valid_until: new Date(new Date().setMonth(new Date().getMonth() + 1)),
          min_booking_amount: 5000
        },
        {
          code: "SUMMER25",
          description: "25% off on all summer bookings",
          discount_percentage: 25,
          valid_from: new Date(),
          valid_until: new Date(new Date().setMonth(new Date().getMonth() + 3)),
          min_booking_amount: 8000
        },
        {
          code: "FESTIVE30",
          description: "30% off for festival season bookings",
          discount_percentage: 30,
          valid_from: new Date(),
          valid_until: new Date(new Date().setMonth(new Date().getMonth() + 2)),
          min_booking_amount: 10000
        },
        {
          code: "WEEKEND15",
          description: "15% off on weekend stays",
          discount_percentage: 15,
          valid_from: new Date(),
          valid_until: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
          min_booking_amount: 3000
        }
      ];
  
      for (const offer of offers) {
        const validatedOffer = insertOfferSchema.parse(offer);
        await storage.createOffer(validatedOffer);
      }
  
      // Create packages
      const packages = [
        {
          title: "Goa Beach Escape",
          description: "Enjoy 3 nights at a premium resort in Goa with beach activities and meals included",
          price: 15999,
          duration: 3,
          inclusions: ["Hotel Stay", "Breakfast", "Airport Transfer", "Sightseeing"],
          image_url: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        },
        {
          title: "Kerala Backwaters Tour",
          description: "Experience the serene backwaters of Kerala with houseboat stay and Ayurvedic spa treatments",
          price: 24999,
          duration: 5,
          inclusions: ["Hotel Stay", "Houseboat Experience", "All Meals", "Ayurvedic Massage", "Sightseeing"],
          image_url: "https://images.unsplash.com/photo-1600256697404-560fd5d73845?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        },
        {
          title: "Royal Rajasthan Tour",
          description: "Explore the royal heritage of Rajasthan with luxury accommodations in palaces and forts",
          price: 32999,
          duration: 7,
          inclusions: ["Luxury Accommodations", "All Meals", "Private Guide", "Heritage Site Entries", "Cultural Performances"],
          image_url: "https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        },
        {
          title: "Himalayan Adventure",
          description: "Trekking, camping, and adventure sports in the breathtaking Himalayan mountains",
          price: 18999,
          duration: 6,
          inclusions: ["Accommodations", "Meals", "Guided Treks", "Adventure Activities", "Safety Equipment"],
          image_url: "https://images.unsplash.com/photo-1543992321-e643659ba886?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        }
      ];
  
      for (const pkg of packages) {
        const validatedPackage = insertPackageSchema.parse(pkg);
        await storage.createPackage(validatedPackage);
      }
      
      console.log("Packages and offers initialization complete");
    } catch (error) {
      console.error("Failed to initialize packages and offers:", error);
    }
    
    // For other data, check if it already exists
    const existingStates = await storage.getStates();
    if (existingStates.length > 0) {
      console.log("States data already initialized, skipping that part");
    } else {
      console.log("Initializing states, cities and hotels data...");

      // Create Indian states
      const states = [
        { name: "Delhi" },
        { name: "Maharashtra" },
        { name: "Rajasthan" },
        { name: "Kerala" },
        { name: "Tamil Nadu" },
        { name: "Karnataka" },
        { name: "Goa" },
        { name: "Himachal Pradesh" }
      ];

      const stateMap = new Map<string, number>();
      
      for (const state of states) {
        const validatedState = insertStateSchema.parse(state);
        const newState = await storage.createState(validatedState);
        stateMap.set(state.name, newState.id);
      }

      // Create cities
      const cities = [
        { name: "New Delhi", stateId: stateMap.get("Delhi")! },
        { name: "Mumbai", stateId: stateMap.get("Maharashtra")! },
        { name: "Pune", stateId: stateMap.get("Maharashtra")! },
        { name: "Jaipur", stateId: stateMap.get("Rajasthan")! },
        { name: "Udaipur", stateId: stateMap.get("Rajasthan")! },
        { name: "Kochi", stateId: stateMap.get("Kerala")! },
        { name: "Thiruvananthapuram", stateId: stateMap.get("Kerala")! },
        { name: "Chennai", stateId: stateMap.get("Tamil Nadu")! },
        { name: "Bengaluru", stateId: stateMap.get("Karnataka")! },
        { name: "Panaji", stateId: stateMap.get("Goa")! },
        { name: "Manali", stateId: stateMap.get("Himachal Pradesh")! }
      ];

      const cityMap = new Map<string, number>();
      
      for (const city of cities) {
        const validatedCity = insertCitySchema.parse(city);
        const newCity = await storage.createCity(validatedCity);
        cityMap.set(city.name, newCity.id);
      }

      // Create hotels
      const hotels = [
        {
          name: "The Imperial New Delhi",
          description: "A historic luxury hotel located in the heart of New Delhi, offering elegant accommodations and world-class amenities.",
          cityId: cityMap.get("New Delhi")!,
          stateId: stateMap.get("Delhi")!,
          price: 12499,
          rating: 5,
          images: [
            "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
          ],
          amenities: ["Free Wifi", "Swimming Pool", "Spa", "Restaurant"],
          availability: true
        },
        {
          name: "Taj Lake Palace",
          description: "Built in 1746, the Taj Lake Palace is a heritage luxury hotel located on a natural island in Lake Pichola, Udaipur, offering breathtaking views of the surrounding mountains and city palace.",
          cityId: cityMap.get("Udaipur")!,
          stateId: stateMap.get("Rajasthan")!,
          price: 16999,
          rating: 5,
          images: [
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
          ],
          amenities: ["Free Wifi", "Swimming Pool", "Spa", "Restaurant", "Lake View"],
          availability: true
        },
        {
          name: "Taj Mahal Palace",
          description: "One of India's most iconic luxury hotels, overlooking the Gateway of India and Arabian Sea. Features Indo-Saracenic architecture and lavish interiors.",
          cityId: cityMap.get("Mumbai")!,
          stateId: stateMap.get("Maharashtra")!,
          price: 14999,
          rating: 5,
          images: [
            "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
          ],
          amenities: ["Free Wifi", "Swimming Pool", "Spa", "Restaurant"],
          availability: true
        },
        {
          name: "The Leela Palace",
          description: "A luxury hotel that blends traditional royal Indian architecture with modern amenities. Features lush gardens and opulent decor.",
          cityId: cityMap.get("Bengaluru")!,
          stateId: stateMap.get("Karnataka")!,
          price: 10999,
          rating: 5,
          images: [
            "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
          ],
          amenities: ["Free Wifi", "Swimming Pool", "Spa", "Restaurant", "Gym"],
          availability: true
        },
        {
          name: "Coconut Lagoon",
          description: "An eco-friendly resort set on the backwaters of Kumarakom. Traditional Kerala architecture with modern amenities.",
          cityId: cityMap.get("Kochi")!,
          stateId: stateMap.get("Kerala")!,
          price: 8999,
          rating: 4,
          images: [
            "https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
          ],
          amenities: ["Free Wifi", "Swimming Pool", "Ayurvedic Spa", "Restaurant", "Backwater Views"],
          availability: true
        },
        {
          name: "Wildflower Hall",
          description: "A luxury mountain retreat set in the cedar forests of the Himalayas with breathtaking views of snow-capped peaks.",
          cityId: cityMap.get("Manali")!,
          stateId: stateMap.get("Himachal Pradesh")!,
          price: 13999,
          rating: 5,
          images: [
            "https://images.unsplash.com/photo-1470010762743-1fa2363f65ca?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
          ],
          amenities: ["Free Wifi", "Spa", "Restaurant", "Indoor Pool", "Mountain Views"],
          availability: true
        }
      ];

      for (const hotel of hotels) {
        const validatedHotel = insertHotelSchema.parse(hotel);
        await storage.createHotel(validatedHotel);
      }

      console.log("States, cities and hotels initialization complete");
    }
  } catch (error) {
    console.error("Failed to initialize data:", error);
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);
  
  // Initialize database with demo data
  await initializeData();
  
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
      
      // Parse dates from ISO strings to Date objects before validation
      const bookingData = {
        ...req.body,
        checkInDate: req.body.checkInDate ? new Date(req.body.checkInDate) : undefined,
        checkOutDate: req.body.checkOutDate ? new Date(req.body.checkOutDate) : undefined
      };
      
      const validatedData = insertBookingSchema.parse(bookingData);
      
      const booking = await storage.createBooking({
        ...validatedData,
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
          
          // Ensure dates are formatted as ISO strings
          return {
            ...booking,
            checkInDate: booking.checkInDate.toISOString(),
            checkOutDate: booking.checkOutDate.toISOString(),
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

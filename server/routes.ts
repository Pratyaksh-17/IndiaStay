import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { generateQRCode } from "./qrCodeGenerator";
import { addAdditionalHotels } from "./additionalHotels";
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
        // Welcome Offers
        {
          code: "WELCOME20",
          description: "20% off on your first booking. Valid for new users only.",
          discount_percentage: 20,
          valid_from: new Date(),
          valid_until: new Date(new Date().setMonth(new Date().getMonth() + 1)),
          min_booking_amount: 5000
        },
        {
          code: "FIRSTTRIP",
          description: "Flat ₹2000 off on your first booking with us. No minimum booking amount required.",
          discount_percentage: 10,
          valid_from: new Date(),
          valid_until: new Date(new Date().setMonth(new Date().getMonth() + 3)),
          min_booking_amount: 0
        },
        
        // Seasonal Offers
        {
          code: "SUMMER25",
          description: "25% off on all summer bookings. Beat the heat with cool discounts!",
          discount_percentage: 25,
          valid_from: new Date(),
          valid_until: new Date(new Date().setMonth(new Date().getMonth() + 3)),
          min_booking_amount: 8000
        },
        {
          code: "MONSOON20",
          description: "20% off on monsoon special packages. Enjoy the rains with special discounts!",
          discount_percentage: 20,
          valid_from: new Date(),
          valid_until: new Date(new Date().setMonth(new Date().getMonth() + 4)),
          min_booking_amount: 7000
        },
        {
          code: "WINTER15",
          description: "15% off on winter destinations. Embrace the chill with warm discounts!",
          discount_percentage: 15,
          valid_from: new Date(),
          valid_until: new Date(new Date().setMonth(new Date().getMonth() + 5)),
          min_booking_amount: 6000
        },
        
        // Holiday & Festival Offers
        {
          code: "FESTIVE30",
          description: "30% off for festival season bookings. Celebrate with special travel deals!",
          discount_percentage: 30,
          valid_from: new Date(),
          valid_until: new Date(new Date().setMonth(new Date().getMonth() + 2)),
          min_booking_amount: 10000
        },
        {
          code: "HOLIDAY25",
          description: "25% off on all holiday packages. Make your holidays special!",
          discount_percentage: 25,
          valid_from: new Date(),
          valid_until: new Date(new Date().setMonth(new Date().getMonth() + 2)),
          min_booking_amount: 9000
        },
        
        // Weekend Offers
        {
          code: "WEEKEND15",
          description: "15% off on weekend stays. Make your weekends extraordinary!",
          discount_percentage: 15,
          valid_from: new Date(),
          valid_until: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
          min_booking_amount: 3000
        },
        {
          code: "WEEKDAY10",
          description: "10% off on weekday bookings. Enjoy less crowded destinations!",
          discount_percentage: 10,
          valid_from: new Date(),
          valid_until: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
          min_booking_amount: 2000
        },
        
        // Destination Specific Offers
        {
          code: "GOAFUN25",
          description: "25% off on Goa packages. Experience the beach paradise!",
          discount_percentage: 25,
          valid_from: new Date(),
          valid_until: new Date(new Date().setMonth(new Date().getMonth() + 6)),
          min_booking_amount: 8000
        },
        {
          code: "KERALA20",
          description: "20% off on Kerala packages. Experience God's own country!",
          discount_percentage: 20,
          valid_from: new Date(),
          valid_until: new Date(new Date().setMonth(new Date().getMonth() + 6)),
          min_booking_amount: 7500
        },
        {
          code: "HILLSTATION15",
          description: "15% off on hill station packages. Escape to the mountains!",
          discount_percentage: 15,
          valid_from: new Date(),
          valid_until: new Date(new Date().setMonth(new Date().getMonth() + 4)),
          min_booking_amount: 6000
        },
        
        // Special Occasion Offers
        {
          code: "HONEYMOON30",
          description: "30% off on honeymoon packages. Start your journey together with special discounts!",
          discount_percentage: 30,
          valid_from: new Date(),
          valid_until: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
          min_booking_amount: 15000
        },
        {
          code: "ANNIVERSARY25",
          description: "25% off on anniversary celebration packages. Make your anniversary memorable!",
          discount_percentage: 25,
          valid_from: new Date(),
          valid_until: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
          min_booking_amount: 12000
        },
        
        // Payment Method Offers
        {
          code: "UPIEXTRA5",
          description: "Extra 5% off on payments made via UPI. Quick and easy payments!",
          discount_percentage: 5,
          valid_from: new Date(),
          valid_until: new Date(new Date().setMonth(new Date().getMonth() + 12)),
          min_booking_amount: 1000
        },
        {
          code: "CARDEXTRA7",
          description: "Extra 7% off on credit card payments. Secure and convenient!",
          discount_percentage: 7,
          valid_from: new Date(),
          valid_until: new Date(new Date().setMonth(new Date().getMonth() + 6)),
          min_booking_amount: 2000
        }
      ];
  
      for (const offer of offers) {
        const validatedOffer = insertOfferSchema.parse(offer);
        await storage.createOffer(validatedOffer);
      }
  
      // Create packages
      const packages = [
        // Beach Packages
        {
          title: "Goa Beach Escape",
          description: "Enjoy 3 nights at a premium resort in Goa with beach activities and meals included. Experience the vibrant nightlife and beautiful sandy beaches.",
          price: 15999,
          duration: 3,
          inclusions: ["Hotel Stay", "Breakfast", "Airport Transfer", "Sightseeing", "Beach Activities", "Welcome Drink"],
          image_url: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        },
        {
          title: "Goa Luxury Retreat",
          description: "A 5-night luxury stay at W Goa with premium dining experiences, spa treatments and exclusive beach access. Perfect for couples and honeymooners.",
          price: 35999,
          duration: 5,
          inclusions: ["5-Star Accommodation", "All Meals", "Airport Transfer", "Private Beach Access", "Couple Spa Treatment", "Sunset Cruise"],
          image_url: "https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        },
        
        // Backwater Packages
        {
          title: "Kerala Backwaters Tour",
          description: "Experience the serene backwaters of Kerala with houseboat stay and Ayurvedic spa treatments. Explore the lush greenery and traditional villages.",
          price: 24999,
          duration: 5,
          inclusions: ["Hotel Stay", "Houseboat Experience", "All Meals", "Ayurvedic Massage", "Sightseeing", "Cultural Show"],
          image_url: "https://images.unsplash.com/photo-1600256697404-560fd5d73845?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        },
        {
          title: "Kerala Complete Experience",
          description: "A comprehensive 8-day tour covering the hills of Munnar, backwaters of Alleppey, and beaches of Kovalam with premium accommodations.",
          price: 45999,
          duration: 8,
          inclusions: ["Premium Accommodations", "All Meals", "Private Car", "Spice Plantation Tour", "Houseboat Stay", "Ayurvedic Treatments", "Beach Activities"],
          image_url: "https://images.unsplash.com/photo-1602215450037-648d927a205c?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        },
        
        // Heritage Packages
        {
          title: "Royal Rajasthan Tour",
          description: "Explore the royal heritage of Rajasthan with luxury accommodations in palaces and forts. Visit Jaipur, Udaipur, Jodhpur, and Jaisalmer.",
          price: 32999,
          duration: 7,
          inclusions: ["Luxury Accommodations", "All Meals", "Private Guide", "Heritage Site Entries", "Cultural Performances", "Desert Safari"],
          image_url: "https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        },
        {
          title: "Golden Triangle Deluxe",
          description: "Visit Delhi, Agra, and Jaipur with 5-star accommodations and private transfers. Includes guided tours of the Taj Mahal, Red Fort, and Amber Fort.",
          price: 28999,
          duration: 6,
          inclusions: ["5-Star Accommodations", "Breakfast & Dinner", "Private Car", "Expert Guide", "Monument Entries", "Airport Transfers"],
          image_url: "https://images.unsplash.com/photo-1548013146-72479768bada?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        },
        
        // Adventure Packages
        {
          title: "Himalayan Adventure",
          description: "Trekking, camping, and adventure sports in the breathtaking Himalayan mountains. Explore Manali, Solang Valley, and Rohtang Pass.",
          price: 18999,
          duration: 6,
          inclusions: ["Accommodations", "Meals", "Guided Treks", "Adventure Activities", "Safety Equipment", "Transport"],
          image_url: "https://images.unsplash.com/photo-1543992321-e643659ba886?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        },
        {
          title: "Rishikesh Adventure Package",
          description: "Experience white water rafting, bungee jumping, and cliff diving in the adventure capital of India. Includes yoga sessions by the Ganges.",
          price: 16999,
          duration: 4,
          inclusions: ["Riverside Camp Stay", "All Activities", "Meals", "Equipment", "Yoga Sessions", "Transport from Delhi"],
          image_url: "https://images.unsplash.com/photo-1544551763-92ab472cad5d?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        },
        
        // Wildlife Packages
        {
          title: "Wildlife Safari Expedition",
          description: "Explore India's top tiger reserves including Ranthambore, Bandhavgarh, and Kanha with expert naturalists and luxury jungle lodges.",
          price: 42999,
          duration: 10,
          inclusions: ["Jungle Lodge Accommodations", "All Meals", "Safari Rides", "Expert Naturalist", "Park Fees", "Transport"],
          image_url: "https://images.unsplash.com/photo-1581337574132-977c767ec3b4?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        },
        
        // Hill Station Packages
        {
          title: "Shimla-Manali Twin Escape",
          description: "Enjoy the colonial charm of Shimla and the alpine beauty of Manali with scenic drives, mall road walks, and adventure activities.",
          price: 21999,
          duration: 7,
          inclusions: ["Deluxe Accommodations", "Breakfast & Dinner", "Sightseeing", "Adventure Activities", "Transport", "Local Guide"],
          image_url: "https://images.unsplash.com/photo-1626621331169-5f36c829626f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        },
        
        // Spiritual Packages
        {
          title: "Spiritual Varanasi & Rishikesh Journey",
          description: "Immerse yourself in the spiritual essence of India with a visit to the holy cities of Varanasi and Rishikesh. Experience Ganga Aarti and yoga retreats.",
          price: 19999,
          duration: 5,
          inclusions: ["Heritage Hotel Stay", "Vegetarian Meals", "Boat Ride", "Yoga Sessions", "Temple Visits", "Spiritual Guide"],
          image_url: "https://images.unsplash.com/photo-1561361058-c24cecb1e9a4?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
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
    const existingHotels = await storage.getHotels();
    console.log(`Found ${existingStates.length} states and ${existingHotels.length} hotels`);
    
    if (existingStates.length > 0) {
      console.log("States data already initialized, skipping state initialization");
      
      // Build state and city maps for additionalHotels
      const stateNameToIdMap = new Map<string, number>();
      for (const state of existingStates) {
        stateNameToIdMap.set(state.name, state.id);
      }
      
      const cities = await storage.getCities();
      const cityNameToIdMap = new Map<string, number>();
      for (const city of cities) {
        cityNameToIdMap.set(city.name, city.id);
      }
      
      // Add additional hotels even if states exist
      console.log("Adding additional hotels...");
      await addAdditionalHotels(stateNameToIdMap, cityNameToIdMap);
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
        { name: "Himachal Pradesh" },
        { name: "Gujarat" },
        { name: "Uttarakhand" },
        { name: "West Bengal" },
        { name: "Andhra Pradesh" },
        { name: "Telangana" },
        { name: "Madhya Pradesh" },
        { name: "Odisha" }
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
        { name: "Nagpur", stateId: stateMap.get("Maharashtra")! },
        { name: "Aurangabad", stateId: stateMap.get("Maharashtra")! },
        { name: "Jaipur", stateId: stateMap.get("Rajasthan")! },
        { name: "Udaipur", stateId: stateMap.get("Rajasthan")! },
        { name: "Jodhpur", stateId: stateMap.get("Rajasthan")! },
        { name: "Jaisalmer", stateId: stateMap.get("Rajasthan")! },
        { name: "Kochi", stateId: stateMap.get("Kerala")! },
        { name: "Thiruvananthapuram", stateId: stateMap.get("Kerala")! },
        { name: "Munnar", stateId: stateMap.get("Kerala")! },
        { name: "Alleppey", stateId: stateMap.get("Kerala")! },
        { name: "Chennai", stateId: stateMap.get("Tamil Nadu")! },
        { name: "Madurai", stateId: stateMap.get("Tamil Nadu")! },
        { name: "Coimbatore", stateId: stateMap.get("Tamil Nadu")! },
        { name: "Ooty", stateId: stateMap.get("Tamil Nadu")! },
        { name: "Bengaluru", stateId: stateMap.get("Karnataka")! },
        { name: "Mysuru", stateId: stateMap.get("Karnataka")! },
        { name: "Hampi", stateId: stateMap.get("Karnataka")! },
        { name: "Coorg", stateId: stateMap.get("Karnataka")! },
        { name: "Panaji", stateId: stateMap.get("Goa")! },
        { name: "Calangute", stateId: stateMap.get("Goa")! },
        { name: "Manali", stateId: stateMap.get("Himachal Pradesh")! },
        { name: "Shimla", stateId: stateMap.get("Himachal Pradesh")! },
        { name: "Dharamshala", stateId: stateMap.get("Himachal Pradesh")! },
        { name: "Ahmedabad", stateId: stateMap.get("Gujarat")! },
        { name: "Vadodara", stateId: stateMap.get("Gujarat")! },
        { name: "Rishikesh", stateId: stateMap.get("Uttarakhand")! },
        { name: "Nainital", stateId: stateMap.get("Uttarakhand")! },
        { name: "Kolkata", stateId: stateMap.get("West Bengal")! },
        { name: "Darjeeling", stateId: stateMap.get("West Bengal")! },
        { name: "Hyderabad", stateId: stateMap.get("Telangana")! },
        { name: "Warangal", stateId: stateMap.get("Telangana")! },
        { name: "Visakhapatnam", stateId: stateMap.get("Andhra Pradesh")! },
        { name: "Tirupati", stateId: stateMap.get("Andhra Pradesh")! },
        { name: "Bhopal", stateId: stateMap.get("Madhya Pradesh")! },
        { name: "Indore", stateId: stateMap.get("Madhya Pradesh")! },
        { name: "Khajuraho", stateId: stateMap.get("Madhya Pradesh")! },
        { name: "Puri", stateId: stateMap.get("Odisha")! },
        { name: "Bhubaneswar", stateId: stateMap.get("Odisha")! }
      ];

      const cityMap = new Map<string, number>();
      
      for (const city of cities) {
        const validatedCity = insertCitySchema.parse(city);
        const newCity = await storage.createCity(validatedCity);
        cityMap.set(city.name, newCity.id);
      }

      // Create hotels
      const hotels = [
        // Delhi
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
          amenities: ["Free Wifi", "Swimming Pool", "Spa", "Restaurant", "Fitness Center", "Business Center"],
          availability: true
        },
        {
          name: "The Lodhi",
          description: "Contemporary luxury hotel with spacious rooms featuring private plunge pools and balconies. Located near Delhi's cultural district.",
          cityId: cityMap.get("New Delhi")!,
          stateId: stateMap.get("Delhi")!,
          price: 14000,
          rating: 5,
          images: [
            "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1611892441796-ae6af0ec2cc8?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1562778612-e1e0cda9915c?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
          ],
          amenities: ["Free Wifi", "Private Plunge Pool", "Spa", "Restaurant", "Tennis Court", "Fitness Center"],
          availability: true
        },
        
        // Rajasthan
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
          amenities: ["Free Wifi", "Swimming Pool", "Spa", "Restaurant", "Lake View", "Heritage Tours"],
          availability: true
        },
        {
          name: "The Oberoi Udaivilas",
          description: "Luxury resort on the banks of Lake Pichola, featuring traditional Rajasthani architecture and stunning lake views.",
          cityId: cityMap.get("Udaipur")!,
          stateId: stateMap.get("Rajasthan")!,
          price: 17500,
          rating: 5,
          images: [
            "https://images.unsplash.com/photo-1573048324949-8f891e9d3bb5?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1573649601361-3cb5c1beba28?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
          ],
          amenities: ["Free Wifi", "Swimming Pool", "Spa", "Restaurant", "Lake View", "Private Butler"],
          availability: true
        },
        {
          name: "Umaid Bhawan Palace",
          description: "Part-palace, part-hotel, this magnificent property is one of the world's largest private residences and offers an unparalleled royal experience.",
          cityId: cityMap.get("Jodhpur")!,
          stateId: stateMap.get("Rajasthan")!,
          price: 21500,
          rating: 5,
          images: [
            "https://images.unsplash.com/photo-1600011689032-8b628b8a8747?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1566552881560-0be862a7c445?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
          ],
          amenities: ["Free Wifi", "Swimming Pool", "Spa", "Restaurant", "Museum", "Private Butler", "Heritage Tours"],
          availability: true
        },
        {
          name: "Suryagarh Jaisalmer",
          description: "A luxurious desert fortress that combines modern amenities with traditional Rajasthani heritage and architecture.",
          cityId: cityMap.get("Jaisalmer")!,
          stateId: stateMap.get("Rajasthan")!,
          price: 12500,
          rating: 5,
          images: [
            "https://images.unsplash.com/photo-1544984243-ec57ea16fe25?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1523544933235-80758e3056e4?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1518792528501-352f829886dc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
          ],
          amenities: ["Free Wifi", "Swimming Pool", "Spa", "Restaurant", "Desert Safari", "Cultural Performances"],
          availability: true
        },
        
        // Maharashtra
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
          amenities: ["Free Wifi", "Swimming Pool", "Spa", "Restaurant", "Ocean View", "Heritage Tours"],
          availability: true
        },
        {
          name: "The Oberoi Mumbai",
          description: "Contemporary luxury hotel with stunning views of the Arabian Sea, located in Mumbai's business district.",
          cityId: cityMap.get("Mumbai")!,
          stateId: stateMap.get("Maharashtra")!,
          price: 13500,
          rating: 5,
          images: [
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1582719508461-905c673771fd?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
          ],
          amenities: ["Free Wifi", "Swimming Pool", "Spa", "Restaurant", "Ocean View", "Business Center"],
          availability: true
        },
        
        // Karnataka
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
          amenities: ["Free Wifi", "Swimming Pool", "Spa", "Restaurant", "Gym", "Business Center"],
          availability: true
        },
        {
          name: "Orange County Kabini",
          description: "A wildlife resort on the banks of the Kabini River, offering cottage accommodations and safari experiences.",
          cityId: cityMap.get("Mysuru")!,
          stateId: stateMap.get("Karnataka")!,
          price: 8999,
          rating: 4,
          images: [
            "https://images.unsplash.com/photo-1567636788276-40a47795ba4b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1523592121529-f6dde35f079e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
          ],
          amenities: ["Free Wifi", "Swimming Pool", "Spa", "Restaurant", "Wildlife Safari", "River Cruise"],
          availability: true
        },
        
        // Kerala
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
          amenities: ["Free Wifi", "Swimming Pool", "Ayurvedic Spa", "Restaurant", "Backwater Views", "Houseboat Cruise"],
          availability: true
        },
        {
          name: "Kumarakom Lake Resort",
          description: "A luxury heritage resort featuring villas with private pools and traditional Kerala architecture on the shores of Vembanad Lake.",
          cityId: cityMap.get("Alleppey")!,
          stateId: stateMap.get("Kerala")!,
          price: 12500,
          rating: 5,
          images: [
            "https://images.unsplash.com/photo-1580137197581-df2bb346a786?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1580274455191-1c62238fa333?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1583754848381-45e69ae5bd8c?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
          ],
          amenities: ["Free Wifi", "Private Pool", "Ayurvedic Spa", "Restaurant", "Houseboat Cruise", "Cultural Performances"],
          availability: true
        },
        {
          name: "The Windflower Resort & Spa Wayanad",
          description: "Located amidst lush green plantations in Wayanad, this resort offers a perfect blend of luxury and nature.",
          cityId: cityMap.get("Munnar")!,
          stateId: stateMap.get("Kerala")!,
          price: 7500,
          rating: 4,
          images: [
            "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1540541338287-41700207dee6?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1540541338287-41700207dee6?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
          ],
          amenities: ["Free Wifi", "Swimming Pool", "Ayurvedic Spa", "Restaurant", "Coffee Plantation Tour", "Nature Trails"],
          availability: true
        },
        
        // Himachal Pradesh
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
          amenities: ["Free Wifi", "Spa", "Restaurant", "Indoor Pool", "Mountain Views", "Hiking Trails"],
          availability: true
        },
        {
          name: "The Oberoi Cecil",
          description: "A heritage hotel in Shimla with colonial charm, offering spectacular views of the Himalayas and cedar forests.",
          cityId: cityMap.get("Shimla")!,
          stateId: stateMap.get("Himachal Pradesh")!,
          price: 10999,
          rating: 5,
          images: [
            "https://images.unsplash.com/photo-1534447677768-be436bb09401?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1534447677768-be436bb09401?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1494137319847-a9592a0e73ed?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
          ],
          amenities: ["Free Wifi", "Spa", "Restaurant", "Indoor Pool", "Mountain Views", "Heritage Tours"],
          availability: true
        },
        
        // Goa
        {
          name: "Taj Exotica Goa",
          description: "Mediterranean-style luxury beach resort spread across 56 acres of landscaped gardens along the southwest coast of Goa.",
          cityId: cityMap.get("Panaji")!,
          stateId: stateMap.get("Goa")!,
          price: 15000,
          rating: 5,
          images: [
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1544124499-58912cbddaad?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
          ],
          amenities: ["Free Wifi", "Swimming Pool", "Spa", "Restaurant", "Beach Access", "Water Sports"],
          availability: true
        },
        {
          name: "W Goa",
          description: "Contemporary beachfront resort with unique architecture and design-forward interiors, offering a vibrant nightlife and dining scene.",
          cityId: cityMap.get("Calangute")!,
          stateId: stateMap.get("Goa")!,
          price: 13500,
          rating: 5,
          images: [
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1582719508461-905c673771fd?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
          ],
          amenities: ["Free Wifi", "Swimming Pool", "Spa", "Restaurant", "Beach Access", "Nightclub", "Water Sports"],
          availability: true
        }
      ];

      for (const hotel of hotels) {
        const validatedHotel = insertHotelSchema.parse(hotel);
        await storage.createHotel(validatedHotel);
      }
      
      // Add at least 6 hotels for each state
      await addAdditionalHotels(stateMap, cityMap);

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
  app.get("/api/hotels/byState/:stateId", async (req, res) => {
    try {
      const stateId = parseInt(req.params.stateId);
      if (isNaN(stateId)) {
        return res.status(400).json({ message: "Invalid state ID" });
      }
      
      const hotels = await storage.getHotelsByState(stateId);
      
      // Join with state and city data
      const states = await storage.getStates();
      const cities = await storage.getCities();
      
      const stateMap = new Map(states.map(state => [state.id, state]));
      const cityMap = new Map(cities.map(city => [city.id, city]));
      
      const hotelsWithLocation = hotels.map(hotel => ({
        ...hotel,
        stateName: stateMap.get(hotel.stateId)?.name,
        cityName: cityMap.get(hotel.cityId)?.name
      }));
      
      res.json(hotelsWithLocation);
    } catch (error) {
      console.error(`Error fetching hotels for state ${req.params.stateId}:`, error);
      res.status(500).json({ message: "Failed to fetch hotels for state" });
    }
  });

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
  
  // Cancel a booking
  app.post("/api/bookings/:id/cancel", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to cancel a booking" });
      }
      
      const bookingId = parseInt(req.params.id);
      if (isNaN(bookingId)) {
        return res.status(400).json({ message: "Invalid booking ID" });
      }
      
      // Fetch the booking
      const booking = await storage.getBooking(bookingId);
      
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      // Check if the booking belongs to the current user
      if (booking.userId !== req.user!.id) {
        return res.status(403).json({ message: "You are not authorized to cancel this booking" });
      }
      
      // Check if the booking is already cancelled
      if (booking.status === 'cancelled') {
        return res.status(400).json({ message: "This booking is already cancelled" });
      }
      
      // Cancel the booking
      const updatedBooking = await storage.updateBookingStatus(bookingId, 'cancelled');
      
      res.json(updatedBooking);
    } catch (error) {
      console.error('Error cancelling booking:', error);
      res.status(500).json({ message: "Failed to cancel booking" });
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

import { insertHotelSchema, type InsertHotel } from "@shared/schema";
import { storage } from "./storage";

export async function addAdditionalHotels(
  stateMap: Map<string, number>, 
  cityMap: Map<string, number>
) {
  console.log("Adding additional hotels for each state...");
  
  const additionalHotels: Omit<InsertHotel, "id">[] = [
    // Delhi (add 4 more hotels to reach 6)
    {
      name: "Taj Palace New Delhi",
      description: "Luxury hotel in Delhi's diplomatic enclave featuring elegant rooms, fine dining restaurants and expansive lawns.",
      cityId: cityMap.get("New Delhi")!,
      stateId: stateMap.get("Delhi")!,
      price: 11000,
      rating: 5,
      images: [
        "https://images.unsplash.com/photo-1606046604972-77cc76aee944?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
      ],
      amenities: ["Free Wifi", "Swimming Pool", "Spa", "Restaurant", "Fitness Center", "Banquet Halls"],
      availability: true
    },
    {
      name: "The Claridges New Delhi",
      description: "Colonial-style luxury hotel in the heart of Lutyens' Delhi with elegant rooms and renowned dining options.",
      cityId: cityMap.get("New Delhi")!,
      stateId: stateMap.get("Delhi")!,
      price: 9500,
      rating: 4,
      images: [
        "https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1582719508461-905c673771fd?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
      ],
      amenities: ["Free Wifi", "Swimming Pool", "Restaurant", "Fitness Center", "Conference Rooms", "Concierge"],
      availability: true
    },
    {
      name: "The Leela Palace New Delhi",
      description: "Opulent palace-style hotel with richly decorated rooms, world-class dining and a spectacular rooftop infinity pool.",
      cityId: cityMap.get("New Delhi")!,
      stateId: stateMap.get("Delhi")!,
      price: 16000,
      rating: 5,
      images: [
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
      ],
      amenities: ["Free Wifi", "Rooftop Infinity Pool", "Spa", "Restaurant", "Butler Service", "Luxury Car Service"],
      availability: true
    },
    {
      name: "Shangri-La Eros New Delhi",
      description: "Contemporary luxury hotel in central Delhi with spacious rooms, multiple dining options and a relaxing spa.",
      cityId: cityMap.get("New Delhi")!,
      stateId: stateMap.get("Delhi")!,
      price: 12000,
      rating: 5,
      images: [
        "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1540541338287-41700207dee6?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
      ],
      amenities: ["Free Wifi", "Swimming Pool", "Spa", "Restaurant", "Fitness Center", "Business Center"],
      availability: true
    },
    
    // Maharashtra (add 4 more hotels to reach 6)
    {
      name: "JW Marriott Mumbai Juhu",
      description: "Beachfront luxury hotel with elegant rooms, multiple swimming pools and spa facilities.",
      cityId: cityMap.get("Mumbai")!,
      stateId: stateMap.get("Maharashtra")!,
      price: 13000,
      rating: 5,
      images: [
        "https://images.unsplash.com/photo-1561501878-aabd62634e1d?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
      ],
      amenities: ["Free Wifi", "Swimming Pool", "Spa", "Restaurant", "Beach Access", "Fitness Center"],
      availability: true
    },
    {
      name: "The St. Regis Mumbai",
      description: "Luxury high-rise hotel in Lower Parel with sophisticated rooms, butler service and panoramic city views.",
      cityId: cityMap.get("Mumbai")!,
      stateId: stateMap.get("Maharashtra")!,
      price: 15000,
      rating: 5,
      images: [
        "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1562778612-e1e0cda9915c?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1579183457173-d3a3bea3cc53?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
      ],
      amenities: ["Free Wifi", "Swimming Pool", "Spa", "Restaurant", "Butler Service", "Fitness Center"],
      availability: true
    },
    {
      name: "Conrad Pune",
      description: "Contemporary luxury hotel in Pune's business district with stylish interiors and sophisticated amenities.",
      cityId: cityMap.get("Pune")!,
      stateId: stateMap.get("Maharashtra")!,
      price: 9000,
      rating: 5,
      images: [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1545067043-4a68b5ba9640?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
      ],
      amenities: ["Free Wifi", "Swimming Pool", "Spa", "Restaurant", "Business Center", "Fitness Center"],
      availability: true
    },
    {
      name: "Radisson Blu Resort & Spa Alibaug",
      description: "Sprawling resort near Mumbai with villas, multiple swimming pools and beach access.",
      cityId: cityMap.get("Mumbai")!,
      stateId: stateMap.get("Maharashtra")!,
      price: 11000,
      rating: 4,
      images: [
        "https://images.unsplash.com/photo-1580137197581-df2bb346a786?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1580274455191-1c62238fa333?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1523544933235-80758e3056e4?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
      ],
      amenities: ["Free Wifi", "Swimming Pool", "Spa", "Restaurant", "Beach Access", "Water Sports"],
      availability: true
    },
    
    // Rajasthan (add 3 more hotels to reach 6)
    {
      name: "Fairmont Jaipur",
      description: "Palace-style luxury hotel combining Rajput and Mughal architecture with elegant rooms and opulent amenities.",
      cityId: cityMap.get("Jaipur")!,
      stateId: stateMap.get("Rajasthan")!,
      price: 12000,
      rating: 5,
      images: [
        "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
      ],
      amenities: ["Free Wifi", "Swimming Pool", "Spa", "Restaurant", "Heritage Tours", "Cultural Performances"],
      availability: true
    },
    {
      name: "Rambagh Palace",
      description: "A former royal residence converted into a luxury heritage hotel with grand architecture and magnificent gardens.",
      cityId: cityMap.get("Jaipur")!,
      stateId: stateMap.get("Rajasthan")!,
      price: 18000,
      rating: 5,
      images: [
        "https://images.unsplash.com/photo-1600011689032-8b628b8a8747?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1566552881560-0be862a7c445?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
      ],
      amenities: ["Free Wifi", "Swimming Pool", "Spa", "Restaurant", "Heritage Tours", "Palace Gardens"],
      availability: true
    },
    {
      name: "RAAS Jodhpur",
      description: "Modern boutique hotel within the ancient walls of Jodhpur, offering stunning views of Mehrangarh Fort.",
      cityId: cityMap.get("Jodhpur")!,
      stateId: stateMap.get("Rajasthan")!,
      price: 11000,
      rating: 4,
      images: [
        "https://images.unsplash.com/photo-1523544933235-80758e3056e4?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1582719508461-905c673771fd?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
      ],
      amenities: ["Free Wifi", "Swimming Pool", "Spa", "Restaurant", "Fort Views", "Cultural Tours"],
      availability: true
    },
    
    // Kerala (add 3 more hotels to reach 6)
    {
      name: "Niraamaya Retreats Surya Samudra",
      description: "Clifftop luxury retreat offering traditional Keralan cottages with sea views and Ayurvedic treatments.",
      cityId: cityMap.get("Thiruvananthapuram")!,
      stateId: stateMap.get("Kerala")!,
      price: 14000,
      rating: 5,
      images: [
        "https://images.unsplash.com/photo-1580137197581-df2bb346a786?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
      ],
      amenities: ["Free Wifi", "Infinity Pool", "Ayurvedic Spa", "Restaurant", "Sea View", "Yoga Classes"],
      availability: true
    },
    {
      name: "The Leela Kovalam",
      description: "Cliff-top beach resort offering rooms with sea views, infinity pools and authentic Kerala cuisine.",
      cityId: cityMap.get("Thiruvananthapuram")!,
      stateId: stateMap.get("Kerala")!,
      price: 13000,
      rating: 5,
      images: [
        "https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1567636788276-40a47795ba4b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1582719508461-905c673771fd?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
      ],
      amenities: ["Free Wifi", "Infinity Pool", "Ayurvedic Spa", "Restaurant", "Beach Access", "Water Sports"],
      availability: true
    },
    {
      name: "Taj Bekal Resort & Spa",
      description: "Luxury resort with Kerala-style villas featuring private plunge pools and garden views.",
      cityId: cityMap.get("Kochi")!,
      stateId: stateMap.get("Kerala")!,
      price: 15500,
      rating: 5,
      images: [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1566552881560-0be862a7c445?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
      ],
      amenities: ["Free Wifi", "Private Plunge Pool", "Ayurvedic Spa", "Restaurant", "River Cruise", "Yoga Classes"],
      availability: true
    },
    
    // Tamil Nadu (add 6 hotels to reach 6)
    {
      name: "Taj Coromandel Chennai",
      description: "Luxury hotel in central Chennai with elegant rooms and suites, offering fine dining and modern amenities.",
      cityId: cityMap.get("Chennai")!,
      stateId: stateMap.get("Tamil Nadu")!,
      price: 10000,
      rating: 5,
      images: [
        "https://images.unsplash.com/photo-1606046604972-77cc76aee944?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
      ],
      amenities: ["Free Wifi", "Swimming Pool", "Spa", "Restaurant", "Business Center", "Fitness Center"],
      availability: true
    },
    {
      name: "ITC Grand Chola Chennai",
      description: "Opulent luxury hotel inspired by Chola dynasty architecture, featuring palatial rooms and world-class restaurants.",
      cityId: cityMap.get("Chennai")!,
      stateId: stateMap.get("Tamil Nadu")!,
      price: 13000,
      rating: 5,
      images: [
        "https://images.unsplash.com/photo-1573048324949-8f891e9d3bb5?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1573649601361-3cb5c1beba28?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1611892441796-ae6af0ec2cc8?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
      ],
      amenities: ["Free Wifi", "Swimming Pool", "Spa", "Restaurant", "Banquet Halls", "Fitness Center"],
      availability: true
    },
    {
      name: "Taj Fisherman's Cove Resort & Spa",
      description: "Beachfront resort near Chennai built on the ramparts of an 18th-century Dutch fort.",
      cityId: cityMap.get("Chennai")!,
      stateId: stateMap.get("Tamil Nadu")!,
      price: 12000,
      rating: 5,
      images: [
        "https://images.unsplash.com/photo-1580137197581-df2bb346a786?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1544124499-58912cbddaad?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
      ],
      amenities: ["Free Wifi", "Swimming Pool", "Spa", "Restaurant", "Beach Access", "Water Sports"],
      availability: true
    },
    {
      name: "Heritage Madurai",
      description: "A heritage property designed by Geoffrey Bawa, featuring traditional Tamil architecture with modern amenities.",
      cityId: cityMap.get("Madurai")!,
      stateId: stateMap.get("Tamil Nadu")!,
      price: 8500,
      rating: 4,
      images: [
        "https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1547043688-32b236694094?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
      ],
      amenities: ["Free Wifi", "Olympic-sized Pool", "Spa", "Restaurant", "Heritage Architecture", "Temple Tours"],
      availability: true
    },
    {
      name: "Taj Gateway Coonoor",
      description: "Colonial-style hotel in the Nilgiri hills offering charming rooms with mountain views and English gardens.",
      cityId: cityMap.get("Ooty")!,
      stateId: stateMap.get("Tamil Nadu")!,
      price: 9500,
      rating: 4,
      images: [
        "https://images.unsplash.com/photo-1470010762743-1fa2363f65ca?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1534447677768-be436bb09401?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
      ],
      amenities: ["Free Wifi", "Restaurant", "Tea Garden Tours", "Mountain Views", "Heritage Building", "Guided Hikes"],
      availability: true
    },
    {
      name: "Svatma Thanjavur",
      description: "Boutique heritage hotel celebrating Tamil art and culture with traditional architecture and Carnatic music performances.",
      cityId: cityMap.get("Madurai")!,
      stateId: stateMap.get("Tamil Nadu")!,
      price: 9000,
      rating: 4,
      images: [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1582719508461-905c673771fd?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1540541338287-41700207dee6?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
      ],
      amenities: ["Free Wifi", "Swimming Pool", "Ayurvedic Spa", "Restaurant", "Music Performances", "Art Gallery"],
      availability: true
    },
    
    // Karnataka (add 4 more hotels to reach 6)
    {
      name: "Taj West End Bangalore",
      description: "Historic luxury hotel set in a tropical garden with heritage rooms and suites dating back to the 1800s.",
      cityId: cityMap.get("Bengaluru")!,
      stateId: stateMap.get("Karnataka")!,
      price: 12000,
      rating: 5,
      images: [
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1582719508461-905c673771fd?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
      ],
      amenities: ["Free Wifi", "Swimming Pool", "Spa", "Restaurant", "Heritage Building", "Lush Gardens"],
      availability: true
    },
    {
      name: "ITC Windsor Bangalore",
      description: "Luxury hotel with British colonial architecture and elegant interiors, located near Bangalore Palace.",
      cityId: cityMap.get("Bengaluru")!,
      stateId: stateMap.get("Karnataka")!,
      price: 11000,
      rating: 5,
      images: [
        "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
      ],
      amenities: ["Free Wifi", "Swimming Pool", "Spa", "Restaurant", "Business Center", "Fitness Center"],
      availability: true
    },
    {
      name: "Evolve Back Coorg",
      description: "Luxury resort inspired by local Kodava architecture, set amidst a 300-acre coffee plantation.",
      cityId: cityMap.get("Coorg")!,
      stateId: stateMap.get("Karnataka")!,
      price: 16000,
      rating: 5,
      images: [
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1540541338287-41700207dee6?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1567636788276-40a47795ba4b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
      ],
      amenities: ["Free Wifi", "Private Pool", "Spa", "Restaurant", "Coffee Plantation Tours", "Nature Trails"],
      availability: true
    },
    {
      name: "Royal Orchid Metropole Mysore",
      description: "Heritage hotel originally built for the royal guests of the Mysore Maharaja, featuring colonial architecture.",
      cityId: cityMap.get("Mysuru")!,
      stateId: stateMap.get("Karnataka")!,
      price: 8500,
      rating: 4,
      images: [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
      ],
      amenities: ["Free Wifi", "Swimming Pool", "Restaurant", "Heritage Building", "Palace Tours", "Cultural Shows"],
      availability: true
    },
    
    // Goa (add 4 more hotels to reach 6)
    {
      name: "The Leela Goa",
      description: "Luxury beachfront resort with Portuguese-influenced architecture, lagoon views and world-class amenities.",
      cityId: cityMap.get("Calangute")!,
      stateId: stateMap.get("Goa")!,
      price: 16500,
      rating: 5,
      images: [
        "https://images.unsplash.com/photo-1580137197581-df2bb346a786?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1580274455191-1c62238fa333?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
      ],
      amenities: ["Free Wifi", "Swimming Pool", "Spa", "Restaurant", "Beach Access", "Golf Course", "Water Sports"],
      availability: true
    },
    {
      name: "Alila Diwa Goa",
      description: "Contemporary resort with Goan-Portuguese style architecture surrounded by lush paddy fields.",
      cityId: cityMap.get("Panaji")!,
      stateId: stateMap.get("Goa")!,
      price: 12000,
      rating: 5,
      images: [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1582719508461-905c673771fd?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
      ],
      amenities: ["Free Wifi", "Infinity Pool", "Spa", "Restaurant", "Beach Shuttle", "Kids Club"],
      availability: true
    },
    {
      name: "ITC Grand Goa Resort & Spa",
      description: "Luxury beachfront resort designed like a Goan village, with Indo-Portuguese architecture and tropical gardens.",
      cityId: cityMap.get("Calangute")!,
      stateId: stateMap.get("Goa")!,
      price: 14500,
      rating: 5,
      images: [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1582719508461-905c673771fd?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
      ],
      amenities: ["Free Wifi", "Swimming Pool", "Spa", "Restaurant", "Beach Access", "Water Sports"],
      availability: true
    },
    {
      name: "Taj Fort Aguada Resort & Spa",
      description: "Historic luxury resort built on the ramparts of a 16th-century Portuguese fortress overlooking the Arabian Sea.",
      cityId: cityMap.get("Calangute")!,
      stateId: stateMap.get("Goa")!,
      price: 13500,
      rating: 5,
      images: [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1566552881560-0be862a7c445?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
      ],
      amenities: ["Free Wifi", "Swimming Pool", "Spa", "Restaurant", "Beach Access", "Heritage Tours", "Water Sports"],
      availability: true
    },
    
    // Himachal Pradesh (add 4 more hotels to reach 6)
    {
      name: "The Himalayan",
      description: "Gothic revival-style castle hotel in Manali with mountain views and Victorian-inspired interiors.",
      cityId: cityMap.get("Manali")!,
      stateId: stateMap.get("Himachal Pradesh")!,
      price: 9500,
      rating: 4,
      images: [
        "https://images.unsplash.com/photo-1470010762743-1fa2363f65ca?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1534447677768-be436bb09401?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1598986646512-9330bcc4c0dc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
      ],
      amenities: ["Free Wifi", "Restaurant", "Spa", "Mountain Views", "Adventure Activities", "Library"],
      availability: true
    },
    {
      name: "Span Resort & Spa",
      description: "Riverside resort in Manali offering cottages with private balconies and mountain views.",
      cityId: cityMap.get("Manali")!,
      stateId: stateMap.get("Himachal Pradesh")!,
      price: 8500,
      rating: 4,
      images: [
        "https://images.unsplash.com/photo-1543992321-e643659ba886?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
      ],
      amenities: ["Free Wifi", "Spa", "Restaurant", "River View", "Mountain View", "Adventure Activities"],
      availability: true
    },
    {
      name: "Radisson Blu Dharamshala",
      description: "Contemporary hotel with panoramic views of the Dhauladhar mountains and the Kangra Valley.",
      cityId: cityMap.get("Dharamshala")!,
      stateId: stateMap.get("Himachal Pradesh")!,
      price: 10000,
      rating: 5,
      images: [
        "https://images.unsplash.com/photo-1470010762743-1fa2363f65ca?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
      ],
      amenities: ["Free Wifi", "Swimming Pool", "Spa", "Restaurant", "Mountain Views", "Yoga Classes"],
      availability: true
    },
    {
      name: "The Chalets Naldehra",
      description: "Luxury wooden chalets in a pine forest offering scenic valley views and colonial charm.",
      cityId: cityMap.get("Shimla")!,
      stateId: stateMap.get("Himachal Pradesh")!,
      price: 9000,
      rating: 4,
      images: [
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1470010762743-1fa2363f65ca?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
      ],
      amenities: ["Free Wifi", "Restaurant", "Mountain Views", "Hiking Trails", "Bonfire", "Horse Riding"],
      availability: true
    },
  ];
  
  let hotelCounter = 0;
  for (const hotel of additionalHotels) {
    try {
      const validatedHotel = insertHotelSchema.parse(hotel);
      await storage.createHotel(validatedHotel);
      hotelCounter++;
    } catch (error) {
      console.error(`Failed to add hotel ${hotel.name}:`, error);
    }
  }
  
  console.log(`Successfully added ${hotelCounter} additional hotels.`);
}
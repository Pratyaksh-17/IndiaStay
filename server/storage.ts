import { 
  User, InsertUser, 
  Hotel, InsertHotel, 
  State, InsertState, 
  City, InsertCity, 
  Booking, InsertBooking, 
  Package, InsertPackage, 
  Offer, InsertOffer
} from "@shared/schema";
import createMemoryStore from "memorystore";
import session from "express-session";

// Memory store for session
const MemoryStore = createMemoryStore(session);

// Interface for storage operations
export interface IStorage {
  // Session store
  sessionStore: session.SessionStore;
  
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // State operations
  getStates(): Promise<State[]>;
  getState(id: number): Promise<State | undefined>;
  getStateByName(name: string): Promise<State | undefined>;
  createState(state: InsertState): Promise<State>;
  
  // City operations
  getCities(): Promise<City[]>;
  getCitiesByState(stateId: number): Promise<City[]>;
  getCity(id: number): Promise<City | undefined>;
  getCityByName(name: string): Promise<City | undefined>;
  createCity(city: InsertCity): Promise<City>;
  
  // Hotel operations
  getHotels(): Promise<Hotel[]>;
  getHotelsByState(stateId: number): Promise<Hotel[]>;
  getHotelsByCity(cityId: number): Promise<Hotel[]>;
  getHotel(id: number): Promise<Hotel | undefined>;
  createHotel(hotel: InsertHotel): Promise<Hotel>;
  searchHotels(query: string): Promise<Hotel[]>;
  
  // Booking operations
  getBookings(): Promise<Booking[]>;
  getBookingsByUser(userId: number): Promise<Booking[]>;
  getBooking(id: number): Promise<Booking | undefined>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  
  // Package operations
  getPackages(): Promise<Package[]>;
  getPackage(id: number): Promise<Package | undefined>;
  createPackage(pkg: InsertPackage): Promise<Package>;
  
  // Offer operations
  getOffers(): Promise<Offer[]>;
  getOffer(id: number): Promise<Offer | undefined>;
  getOfferByCode(code: string): Promise<Offer | undefined>;
  createOffer(offer: InsertOffer): Promise<Offer>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private states: Map<number, State>;
  private cities: Map<number, City>;
  private hotels: Map<number, Hotel>;
  private bookings: Map<number, Booking>;
  private packages: Map<number, Package>;
  private offers: Map<number, Offer>;
  
  public sessionStore: session.SessionStore;
  
  private userIdCounter: number;
  private stateIdCounter: number;
  private cityIdCounter: number;
  private hotelIdCounter: number;
  private bookingIdCounter: number;
  private packageIdCounter: number;
  private offerIdCounter: number;

  constructor() {
    this.users = new Map();
    this.states = new Map();
    this.cities = new Map();
    this.hotels = new Map();
    this.bookings = new Map();
    this.packages = new Map();
    this.offers = new Map();
    
    this.userIdCounter = 1;
    this.stateIdCounter = 1;
    this.cityIdCounter = 1;
    this.hotelIdCounter = 1;
    this.bookingIdCounter = 1;
    this.packageIdCounter = 1;
    this.offerIdCounter = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // 24 hours
    });
    
    // Initialize with demo data
    this.initializeDemoData();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const createdAt = new Date();
    const user: User = { id, ...insertUser, createdAt };
    this.users.set(id, user);
    return user;
  }

  // State methods
  async getStates(): Promise<State[]> {
    return Array.from(this.states.values());
  }

  async getState(id: number): Promise<State | undefined> {
    return this.states.get(id);
  }

  async getStateByName(name: string): Promise<State | undefined> {
    return Array.from(this.states.values()).find(state => 
      state.name.toLowerCase() === name.toLowerCase()
    );
  }

  async createState(state: InsertState): Promise<State> {
    const id = this.stateIdCounter++;
    const newState: State = { id, ...state };
    this.states.set(id, newState);
    return newState;
  }

  // City methods
  async getCities(): Promise<City[]> {
    return Array.from(this.cities.values());
  }

  async getCitiesByState(stateId: number): Promise<City[]> {
    return Array.from(this.cities.values()).filter(city => city.stateId === stateId);
  }

  async getCity(id: number): Promise<City | undefined> {
    return this.cities.get(id);
  }

  async getCityByName(name: string): Promise<City | undefined> {
    return Array.from(this.cities.values()).find(city => 
      city.name.toLowerCase() === name.toLowerCase()
    );
  }

  async createCity(city: InsertCity): Promise<City> {
    const id = this.cityIdCounter++;
    const newCity: City = { id, ...city };
    this.cities.set(id, newCity);
    return newCity;
  }

  // Hotel methods
  async getHotels(): Promise<Hotel[]> {
    return Array.from(this.hotels.values());
  }

  async getHotelsByState(stateId: number): Promise<Hotel[]> {
    return Array.from(this.hotels.values()).filter(hotel => hotel.stateId === stateId);
  }

  async getHotelsByCity(cityId: number): Promise<Hotel[]> {
    return Array.from(this.hotels.values()).filter(hotel => hotel.cityId === cityId);
  }

  async getHotel(id: number): Promise<Hotel | undefined> {
    return this.hotels.get(id);
  }

  async createHotel(hotel: InsertHotel): Promise<Hotel> {
    const id = this.hotelIdCounter++;
    const newHotel: Hotel = { id, ...hotel };
    this.hotels.set(id, newHotel);
    return newHotel;
  }

  async searchHotels(query: string): Promise<Hotel[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.hotels.values()).filter(hotel => {
      // Search by hotel name
      if (hotel.name.toLowerCase().includes(lowercaseQuery)) return true;
      
      // Search by state
      const state = this.states.get(hotel.stateId);
      if (state && state.name.toLowerCase().includes(lowercaseQuery)) return true;
      
      // Search by city
      const city = this.cities.get(hotel.cityId);
      if (city && city.name.toLowerCase().includes(lowercaseQuery)) return true;
      
      return false;
    });
  }

  // Booking methods
  async getBookings(): Promise<Booking[]> {
    return Array.from(this.bookings.values());
  }

  async getBookingsByUser(userId: number): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(booking => booking.userId === userId);
  }

  async getBooking(id: number): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async createBooking(booking: InsertBooking): Promise<Booking> {
    const id = this.bookingIdCounter++;
    const createdAt = new Date();
    const newBooking: Booking = { id, ...booking, createdAt };
    this.bookings.set(id, newBooking);
    return newBooking;
  }

  // Package methods
  async getPackages(): Promise<Package[]> {
    return Array.from(this.packages.values());
  }

  async getPackage(id: number): Promise<Package | undefined> {
    return this.packages.get(id);
  }

  async createPackage(pkg: InsertPackage): Promise<Package> {
    const id = this.packageIdCounter++;
    const newPackage: Package = { id, ...pkg };
    this.packages.set(id, newPackage);
    return newPackage;
  }

  // Offer methods
  async getOffers(): Promise<Offer[]> {
    return Array.from(this.offers.values());
  }

  async getOffer(id: number): Promise<Offer | undefined> {
    return this.offers.get(id);
  }

  async getOfferByCode(code: string): Promise<Offer | undefined> {
    return Array.from(this.offers.values()).find(offer => offer.code === code);
  }

  async createOffer(offer: InsertOffer): Promise<Offer> {
    const id = this.offerIdCounter++;
    const newOffer: Offer = { id, ...offer };
    this.offers.set(id, newOffer);
    return newOffer;
  }

  // Initialize demo data for the application
  private async initializeDemoData() {
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
      const newState = await this.createState(state);
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
      const newCity = await this.createCity(city);
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
        name: "Taj Falaknuma Palace",
        description: "A former palace of the Nizam of Hyderabad, now a luxury hotel. Perched on a hill with panoramic views of the city.",
        cityId: cityMap.get("Jaipur")!,
        stateId: stateMap.get("Rajasthan")!,
        price: 18999,
        rating: 5,
        images: [
          "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
          "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
        ],
        amenities: ["Free Wifi", "Swimming Pool", "Spa", "Restaurant", "Heritage Tours"],
        availability: true
      },
      {
        name: "The Oberoi Grand",
        description: "A heritage luxury hotel known as the 'Grande Dame of Calcutta'. Features neo-classical facade and elegant interiors.",
        cityId: cityMap.get("Chennai")!,
        stateId: stateMap.get("Tamil Nadu")!,
        price: 9999,
        rating: 5,
        images: [
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
          "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
        ],
        amenities: ["Free Wifi", "Swimming Pool", "Spa", "Restaurant", "Business Center"],
        availability: true
      },
      {
        name: "Wildflower Hall",
        description: "A luxury mountain resort set amidst 22 acres of cedar and pine forests with views of the Himalayas.",
        cityId: cityMap.get("Manali")!,
        stateId: stateMap.get("Himachal Pradesh")!,
        price: 15999,
        rating: 5,
        images: [
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
          "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
        ],
        amenities: ["Free Wifi", "Swimming Pool", "Spa", "Restaurant", "Mountain View"],
        availability: true
      }
    ];

    for (const hotel of hotels) {
      await this.createHotel(hotel);
    }

    // Create packages
    const packages = [
      {
        title: "Goa Beach Escape",
        description: "Enjoy a luxurious 5-night stay at premium beach resort with daily breakfast, one dinner, and exciting water sports activities included.",
        location: "Goa",
        price: 45000,
        discountedPrice: 31500,
        image: "https://images.unsplash.com/photo-1548013146-72479768bada?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        nights: 5,
        features: ["5 Nights", "All Meals", "Activities"]
      },
      {
        title: "Manali Hill Adventure",
        description: "Explore the beautiful hills of Manali with a 4-night package including stays at premium hotels, guided tours, and adventure activities.",
        location: "Himachal Pradesh",
        price: 28000,
        discountedPrice: 23800,
        image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        nights: 4,
        features: ["4 Nights", "Breakfast", "Trekking"]
      },
      {
        title: "Kerala Backwaters",
        description: "Experience the serene backwaters of Kerala with a 6-night package including houseboat stay, Ayurvedic spa treatments, and cultural tours.",
        location: "Kerala",
        price: 52000,
        discountedPrice: 41600,
        image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        nights: 6,
        features: ["6 Nights", "All Meals", "Houseboat"]
      }
    ];

    for (const pkg of packages) {
      await this.createPackage(pkg);
    }

    // Create offers
    const offers = [
      {
        title: "Diwali Sale 30% Off",
        code: "DIWALI30",
        description: "Celebrate Diwali with special discounts on all hotel bookings. Valid for stays between Oct 15-Nov 15, 2023.",
        validUntil: new Date(2023, 10, 5), // November 5, 2023
        discount: 30,
        type: "percentage",
        color: "secondary"
      },
      {
        title: "Weekend Getaway 20% Off",
        code: "WEEKEND20",
        description: "Plan your weekend trips with 20% off on all hotel bookings for Friday to Sunday stays.",
        validUntil: new Date(2023, 11, 31), // December 31, 2023
        discount: 20,
        type: "percentage",
        color: "primary"
      },
      {
        title: "Stay 3, Pay for 2",
        code: "STAY3PAY2",
        description: "Book 3 nights at select luxury hotels and pay for only 2 nights. Perfect for extended stays.",
        validUntil: new Date(2023, 10, 30), // November 30, 2023
        discount: 33,
        type: "percentage",
        color: "green"
      },
      {
        title: "Early Bird 15% Off",
        code: "EARLY15",
        description: "Plan ahead and save! Get 15% off when you book at least 30 days in advance.",
        validUntil: new Date(2024, 11, 31), // December 31, 2024
        discount: 15,
        type: "percentage",
        color: "purple"
      }
    ];

    for (const offer of offers) {
      await this.createOffer(offer);
    }
  }
}

export const storage = new MemStorage();

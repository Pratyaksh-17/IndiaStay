import { 
  User, InsertUser, 
  Hotel, InsertHotel, 
  State, InsertState, 
  City, InsertCity, 
  Booking, InsertBooking, 
  Package, InsertPackage, 
  Offer, InsertOffer,
  users, states, cities, hotels, bookings, packages, offers
} from "@shared/schema";
import { db } from "./db";
import { eq, like, and, or, desc } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import pg from "pg";

// Connect the session store to PostgreSQL
const PostgresSessionStore = connectPg(session);
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL
});

// Interface for storage operations
export interface IStorage {
  // Session store
  sessionStore: session.Store;
  
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
  updateBookingStatus(id: number, status: string): Promise<Booking>;
  
  // Package operations
  getPackages(): Promise<Package[]>;
  getPackage(id: number): Promise<Package | undefined>;
  createPackage(pkg: InsertPackage): Promise<Package>;
  clearPackages(): Promise<void>;
  
  // Offer operations
  getOffers(): Promise<Offer[]>;
  getOffer(id: number): Promise<Offer | undefined>;
  getOfferByCode(code: string): Promise<Offer | undefined>;
  createOffer(offer: InsertOffer): Promise<Offer>;
  clearOffers(): Promise<void>;
}

// Database storage implementation
export class DatabaseStorage implements IStorage {
  public sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // State methods
  async getStates(): Promise<State[]> {
    return await db.select().from(states);
  }

  async getState(id: number): Promise<State | undefined> {
    const [state] = await db.select().from(states).where(eq(states.id, id));
    return state;
  }

  async getStateByName(name: string): Promise<State | undefined> {
    const [state] = await db.select().from(states).where(eq(states.name, name));
    return state;
  }

  async createState(state: InsertState): Promise<State> {
    const [newState] = await db.insert(states).values(state).returning();
    return newState;
  }

  // City methods
  async getCities(): Promise<City[]> {
    return await db.select().from(cities);
  }

  async getCitiesByState(stateId: number): Promise<City[]> {
    return await db.select().from(cities).where(eq(cities.stateId, stateId));
  }

  async getCity(id: number): Promise<City | undefined> {
    const [city] = await db.select().from(cities).where(eq(cities.id, id));
    return city;
  }

  async getCityByName(name: string): Promise<City | undefined> {
    const [city] = await db.select().from(cities).where(eq(cities.name, name));
    return city;
  }

  async createCity(city: InsertCity): Promise<City> {
    const [newCity] = await db.insert(cities).values(city).returning();
    return newCity;
  }

  // Hotel methods
  async getHotels(): Promise<Hotel[]> {
    return await db.select().from(hotels);
  }

  async getHotelsByState(stateId: number): Promise<Hotel[]> {
    return await db.select().from(hotels).where(eq(hotels.stateId, stateId));
  }

  async getHotelsByCity(cityId: number): Promise<Hotel[]> {
    return await db.select().from(hotels).where(eq(hotels.cityId, cityId));
  }

  async getHotel(id: number): Promise<Hotel | undefined> {
    const [hotel] = await db.select().from(hotels).where(eq(hotels.id, id));
    return hotel;
  }

  async createHotel(hotel: InsertHotel): Promise<Hotel> {
    const [newHotel] = await db.insert(hotels).values(hotel).returning();
    return newHotel;
  }

  async searchHotels(query: string): Promise<Hotel[]> {
    // First, find states and cities that match the query
    const matchingStates = await db
      .select()
      .from(states)
      .where(like(states.name, `%${query}%`));
    
    const matchingCities = await db
      .select()
      .from(cities)
      .where(like(cities.name, `%${query}%`));
    
    const stateIds = matchingStates.map(state => state.id);
    const cityIds = matchingCities.map(city => city.id);
    
    // Search for hotels by name or matching state/city IDs
    return await db
      .select()
      .from(hotels)
      .where(
        or(
          like(hotels.name, `%${query}%`),
          stateIds.length > 0 ? eq(hotels.stateId, stateIds[0]) : undefined,
          cityIds.length > 0 ? eq(hotels.cityId, cityIds[0]) : undefined
        )
      );
  }

  // Booking methods
  async getBookings(): Promise<Booking[]> {
    return await db.select().from(bookings);
  }

  async getBookingsByUser(userId: number): Promise<Booking[]> {
    return await db
      .select()
      .from(bookings)
      .where(eq(bookings.userId, userId))
      .orderBy(desc(bookings.createdAt));
  }

  async getBooking(id: number): Promise<Booking | undefined> {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
    return booking;
  }

  async createBooking(booking: InsertBooking): Promise<Booking> {
    const [newBooking] = await db.insert(bookings).values(booking).returning();
    return newBooking;
  }
  
  async updateBookingStatus(id: number, status: string): Promise<Booking> {
    const [updatedBooking] = await db
      .update(bookings)
      .set({ status })
      .where(eq(bookings.id, id))
      .returning();
    return updatedBooking;
  }

  // Package methods
  async getPackages(): Promise<Package[]> {
    return await db.select().from(packages);
  }

  async getPackage(id: number): Promise<Package | undefined> {
    const [pkg] = await db.select().from(packages).where(eq(packages.id, id));
    return pkg;
  }

  async createPackage(pkg: InsertPackage): Promise<Package> {
    const [newPackage] = await db.insert(packages).values(pkg).returning();
    return newPackage;
  }
  
  async clearPackages(): Promise<void> {
    await db.delete(packages);
  }

  // Offer methods
  async getOffers(): Promise<Offer[]> {
    return await db.select().from(offers);
  }

  async getOffer(id: number): Promise<Offer | undefined> {
    const [offer] = await db.select().from(offers).where(eq(offers.id, id));
    return offer;
  }

  async getOfferByCode(code: string): Promise<Offer | undefined> {
    const [offer] = await db.select().from(offers).where(eq(offers.code, code));
    return offer;
  }

  async createOffer(offer: InsertOffer): Promise<Offer> {
    const [newOffer] = await db.insert(offers).values(offer).returning();
    return newOffer;
  }
  
  async clearOffers(): Promise<void> {
    await db.delete(offers);
  }

  // Initialize demo data for the application
  async initializeDemoData() {
    // This would be used to seed the database with initial data
    // But we'll handle it with db:push instead
  }
}

// Use the database storage implementation
export const storage = new DatabaseStorage();

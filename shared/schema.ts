import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User Schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

// States Schema
export const states = pgTable("states", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
});

export const insertStateSchema = createInsertSchema(states).omit({
  id: true,
});

// Cities Schema
export const cities = pgTable("cities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  stateId: integer("state_id").notNull(),
});

export const insertCitySchema = createInsertSchema(cities).omit({
  id: true,
});

// Hotels Schema
export const hotels = pgTable("hotels", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  cityId: integer("city_id").notNull(),
  stateId: integer("state_id").notNull(),
  price: integer("price").notNull(), // price in INR
  rating: integer("rating").notNull(),
  images: json("images").notNull(),
  amenities: json("amenities").notNull(),
  availability: boolean("availability").notNull().default(true),
});

export const insertHotelSchema = createInsertSchema(hotels).omit({
  id: true,
});

// Bookings Schema
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  hotelId: integer("hotel_id").notNull(),
  checkInDate: timestamp("check_in_date").notNull(),
  checkOutDate: timestamp("check_out_date").notNull(),
  totalPrice: integer("total_price").notNull(),
  status: text("status").notNull().default("confirmed"),
  paymentMethod: text("payment_method").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
});

// Packages Schema
export const packages = pgTable("packages", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  price: integer("price").notNull(),
  discountedPrice: integer("discounted_price"),
  image: text("image").notNull(),
  nights: integer("nights").notNull(),
  features: json("features").notNull(),
});

export const insertPackageSchema = createInsertSchema(packages).omit({
  id: true,
});

// Offers Schema
export const offers = pgTable("offers", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  code: text("code").notNull().unique(),
  description: text("description").notNull(),
  validUntil: timestamp("valid_until").notNull(),
  discount: integer("discount").notNull(),
  type: text("type").notNull(), // percentage or fixed
  color: text("color").notNull(),
});

export const insertOfferSchema = createInsertSchema(offers).omit({
  id: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type State = typeof states.$inferSelect;
export type InsertState = z.infer<typeof insertStateSchema>;

export type City = typeof cities.$inferSelect;
export type InsertCity = z.infer<typeof insertCitySchema>;

export type Hotel = typeof hotels.$inferSelect;
export type InsertHotel = z.infer<typeof insertHotelSchema>;

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;

export type Package = typeof packages.$inferSelect;
export type InsertPackage = z.infer<typeof insertPackageSchema>;

export type Offer = typeof offers.$inferSelect;
export type InsertOffer = z.infer<typeof insertOfferSchema>;

import { pgTable, serial, text, varchar, boolean, timestamp, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

/**
 * Core user table backing auth flow.
 */
export const users = pgTable("windhoek_na_26_users", {
  id: serial("id").primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: varchar("role", { length: 20 }).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Tourism categories (Tour Operators, Campsites, Shuttles, etc.)
 */
export const categories = pgTable("windhoek_na_26_categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  icon: varchar("icon", { length: 100 }),
  displayOrder: integer("displayOrder").default(0).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;

/**
 * Tourism service listings (individual tour operators, campsites, etc.)
 */
export const listings = pgTable("windhoek_na_26_listings", {
  id: serial("id").primaryKey(),
  categoryId: integer("categoryId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  shortDescription: varchar("shortDescription", { length: 500 }),
  location: varchar("location", { length: 255 }),
  region: varchar("region", { length: 100 }),
  contactEmail: varchar("contactEmail", { length: 320 }),
  contactPhone: varchar("contactPhone", { length: 50 }),
  website: varchar("website", { length: 500 }),
  address: text("address"),
  latitude: varchar("latitude", { length: 50 }),
  longitude: varchar("longitude", { length: 50 }),
  priceRange: varchar("priceRange", { length: 50 }),
  features: text("features"),
  metadata: text("metadata"),
  ntbRegNo: varchar("ntbRegNo", { length: 50 }),
  isVerified: boolean("isVerified").default(false).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  isFeatured: boolean("isFeatured").default(false).notNull(),
  viewCount: integer("viewCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Listing = typeof listings.$inferSelect;
export type InsertListing = typeof listings.$inferInsert;

/**
 * Media assets (photos, videos, VR content)
 */
export const media = pgTable("windhoek_na_26_media", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }),
  description: text("description"),
  mediaType: varchar("mediaType", { length: 20 }).notNull(),
  fileUrl: varchar("fileUrl", { length: 1000 }).notNull(),
  thumbnailUrl: varchar("thumbnailUrl", { length: 1000 }),
  fileKey: varchar("fileKey", { length: 500 }).notNull(),
  mimeType: varchar("mimeType", { length: 100 }),
  fileSize: integer("fileSize"),
  width: integer("width"),
  height: integer("height"),
  duration: integer("duration"),
  altText: varchar("altText", { length: 500 }),
  caption: text("caption"),
  uploadedBy: integer("uploadedBy"),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Media = typeof media.$inferSelect;
export type InsertMedia = typeof media.$inferInsert;

/**
 * Many-to-many relationship between listings and media
 */
export const listingMedia = pgTable("windhoek_na_26_listing_media", {
  id: serial("id").primaryKey(),
  listingId: integer("listingId").notNull(),
  mediaId: integer("mediaId").notNull(),
  displayOrder: integer("displayOrder").default(0).notNull(),
  isPrimary: boolean("isPrimary").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ListingMedia = typeof listingMedia.$inferSelect;
export type InsertListingMedia = typeof listingMedia.$inferInsert;

/**
 * AI Chatbot conversation history
 */
export const chatConversations = pgTable("windhoek_na_26_chat_conversations", {
  id: serial("id").primaryKey(),
  sessionId: varchar("sessionId", { length: 255 }).notNull(),
  userId: integer("userId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type ChatConversation = typeof chatConversations.$inferSelect;
export type InsertChatConversation = typeof chatConversations.$inferInsert;

/**
 * Individual chat messages
 */
export const chatMessages = pgTable("windhoek_na_26_chat_messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversationId").notNull(),
  role: varchar("role", { length: 20 }).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = typeof chatMessages.$inferInsert;

// Relations
export const categoriesRelations = relations(categories, ({ many }) => ({
  listings: many(listings),
}));

export const listingsRelations = relations(listings, ({ one, many }) => ({
  category: one(categories, {
    fields: [listings.categoryId],
    references: [categories.id],
  }),
  listingMedia: many(listingMedia),
}));

export const mediaRelations = relations(media, ({ many }) => ({
  listingMedia: many(listingMedia),
}));

export const listingMediaRelations = relations(listingMedia, ({ one }) => ({
  listing: one(listings, {
    fields: [listingMedia.listingId],
    references: [listings.id],
  }),
  media: one(media, {
    fields: [listingMedia.mediaId],
    references: [media.id],
  }),
}));

export const chatConversationsRelations = relations(chatConversations, ({ many }) => ({
  messages: many(chatMessages),
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  conversation: one(chatConversations, {
    fields: [chatMessages.conversationId],
    references: [chatConversations.id],
  }),
}));

/**
 * User trip plans/itineraries
 */
export const trips = pgTable("windhoek_na_26_trips", {
  id: serial("id").primaryKey(),
  userId: integer("userId"),
  sessionId: varchar("sessionId", { length: 255 }),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  startDate: timestamp("startDate"),
  endDate: timestamp("endDate"),
  coverImage: varchar("coverImage", { length: 1000 }),
  isPublic: boolean("isPublic").default(false).notNull(),
  shareCode: varchar("shareCode", { length: 50 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Trip = typeof trips.$inferSelect;
export type InsertTrip = typeof trips.$inferInsert;

/**
 * Trip days (itinerary days)
 */
export const tripDays = pgTable("windhoek_na_26_trip_days", {
  id: serial("id").primaryKey(),
  tripId: integer("tripId").notNull(),
  dayNumber: integer("dayNumber").notNull(),
  date: timestamp("date"),
  title: varchar("title", { length: 255 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type TripDay = typeof tripDays.$inferSelect;
export type InsertTripDay = typeof tripDays.$inferInsert;

/**
 * Trip items (listings added to a trip day)
 */
export const tripItems = pgTable("windhoek_na_26_trip_items", {
  id: serial("id").primaryKey(),
  tripDayId: integer("tripDayId").notNull(),
  listingId: integer("listingId").notNull(),
  displayOrder: integer("displayOrder").default(0).notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type TripItem = typeof tripItems.$inferSelect;
export type InsertTripItem = typeof tripItems.$inferInsert;

/**
 * User favorites/wishlist
 */
export const favorites = pgTable("windhoek_na_26_favorites", {
  id: serial("id").primaryKey(),
  userId: integer("userId"),
  sessionId: varchar("sessionId", { length: 255 }),
  listingId: integer("listingId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Favorite = typeof favorites.$inferSelect;
export type InsertFavorite = typeof favorites.$inferInsert;

// Trip relations
export const tripsRelations = relations(trips, ({ one, many }) => ({
  user: one(users, {
    fields: [trips.userId],
    references: [users.id],
  }),
  days: many(tripDays),
}));

export const tripDaysRelations = relations(tripDays, ({ one, many }) => ({
  trip: one(trips, {
    fields: [tripDays.tripId],
    references: [trips.id],
  }),
  items: many(tripItems),
}));

export const tripItemsRelations = relations(tripItems, ({ one }) => ({
  tripDay: one(tripDays, {
    fields: [tripItems.tripDayId],
    references: [tripDays.id],
  }),
  listing: one(listings, {
    fields: [tripItems.listingId],
    references: [listings.id],
  }),
}));

export const favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(users, {
    fields: [favorites.userId],
    references: [users.id],
  }),
  listing: one(listings, {
    fields: [favorites.listingId],
    references: [listings.id],
  }),
}));

/**
 * Pre-curated travel routes/itineraries
 */
export const routes = pgTable("windhoek_na_26_routes", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  shortDescription: varchar("shortDescription", { length: 500 }),
  duration: integer("duration").notNull(),
  difficulty: varchar("difficulty", { length: 20 }).default("moderate").notNull(),
  distance: integer("distance"),
  highlights: text("highlights"),
  bestTimeToVisit: varchar("bestTimeToVisit", { length: 255 }),
  coverImage: varchar("coverImage", { length: 1000 }),
  videoUrl: varchar("videoUrl", { length: 1000 }),
  seasonalInfo: text("seasonalInfo"),
  mapData: text("mapData"),
  startLocation: varchar("startLocation", { length: 255 }),
  endLocation: varchar("endLocation", { length: 255 }),
  regions: text("regions"),
  isFeatured: boolean("isFeatured").default(false).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  viewCount: integer("viewCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Route = typeof routes.$inferSelect;
export type InsertRoute = typeof routes.$inferInsert;

/**
 * Stops along a route
 */
export const routeStops = pgTable("windhoek_na_26_route_stops", {
  id: serial("id").primaryKey(),
  routeId: integer("routeId").notNull(),
  dayNumber: integer("dayNumber").notNull(),
  stopOrder: integer("stopOrder").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  latitude: varchar("latitude", { length: 50 }),
  longitude: varchar("longitude", { length: 50 }),
  duration: varchar("duration", { length: 100 }),
  activities: text("activities"),
  tips: text("tips"),
  image: varchar("image", { length: 1000 }),
  listingId: integer("listingId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type RouteStop = typeof routeStops.$inferSelect;
export type InsertRouteStop = typeof routeStops.$inferInsert;

// Route relations
export const routesRelations = relations(routes, ({ many }) => ({
  stops: many(routeStops),
}));

export const routeStopsRelations = relations(routeStops, ({ one }) => ({
  route: one(routes, {
    fields: [routeStops.routeId],
    references: [routes.id],
  }),
  listing: one(listings, {
    fields: [routeStops.listingId],
    references: [listings.id],
  }),
}));

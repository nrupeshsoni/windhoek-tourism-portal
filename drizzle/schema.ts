import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("windhoek_na_26_users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Tourism categories (Tour Operators, Campsites, Shuttles, etc.)
 */
export const categories = mysqlTable("windhoek_na_26_categories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  icon: varchar("icon", { length: 100 }), // Icon name or emoji
  displayOrder: int("displayOrder").default(0).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;

/**
 * Tourism service listings (individual tour operators, campsites, etc.)
 */
export const listings = mysqlTable("windhoek_na_26_listings", {
  id: int("id").autoincrement().primaryKey(),
  categoryId: int("categoryId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  shortDescription: varchar("shortDescription", { length: 500 }),
  location: varchar("location", { length: 255 }),
  region: varchar("region", { length: 100 }), // e.g., "Sossusvlei", "Etosha", "Skeleton Coast"
  contactEmail: varchar("contactEmail", { length: 320 }),
  contactPhone: varchar("contactPhone", { length: 50 }),
  website: varchar("website", { length: 500 }),
  address: text("address"),
  latitude: varchar("latitude", { length: 50 }),
  longitude: varchar("longitude", { length: 50 }),
  priceRange: varchar("priceRange", { length: 50 }), // e.g., "$", "$$", "$$$"
  features: text("features"), // JSON array of features/amenities
  metadata: text("metadata"), // JSON object for category-specific fields (cuisine, hours, amenities, etc.)
  ntbRegNo: varchar("ntbRegNo", { length: 50 }), // NTB registration number
  isVerified: boolean("isVerified").default(false).notNull(), // NTB verified status
  isActive: boolean("isActive").default(true).notNull(),
  isFeatured: boolean("isFeatured").default(false).notNull(),
  viewCount: int("viewCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Listing = typeof listings.$inferSelect;
export type InsertListing = typeof listings.$inferInsert;

/**
 * Media assets (photos, videos, VR content)
 */
export const media = mysqlTable("windhoek_na_26_media", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }),
  description: text("description"),
  mediaType: mysqlEnum("mediaType", ["photo", "video", "vr"]).notNull(),
  fileUrl: varchar("fileUrl", { length: 1000 }).notNull(),
  thumbnailUrl: varchar("thumbnailUrl", { length: 1000 }),
  fileKey: varchar("fileKey", { length: 500 }).notNull(), // S3 key
  mimeType: varchar("mimeType", { length: 100 }),
  fileSize: int("fileSize"), // in bytes
  width: int("width"),
  height: int("height"),
  duration: int("duration"), // for videos, in seconds
  altText: varchar("altText", { length: 500 }),
  caption: text("caption"),
  uploadedBy: int("uploadedBy"), // user ID
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Media = typeof media.$inferSelect;
export type InsertMedia = typeof media.$inferInsert;

/**
 * Many-to-many relationship between listings and media
 */
export const listingMedia = mysqlTable("windhoek_na_26_listing_media", {
  id: int("id").autoincrement().primaryKey(),
  listingId: int("listingId").notNull(),
  mediaId: int("mediaId").notNull(),
  displayOrder: int("displayOrder").default(0).notNull(),
  isPrimary: boolean("isPrimary").default(false).notNull(), // Primary/hero image
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ListingMedia = typeof listingMedia.$inferSelect;
export type InsertListingMedia = typeof listingMedia.$inferInsert;

/**
 * AI Chatbot conversation history
 */
export const chatConversations = mysqlTable("windhoek_na_26_chat_conversations", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: varchar("sessionId", { length: 255 }).notNull(),
  userId: int("userId"), // Optional, for logged-in users
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ChatConversation = typeof chatConversations.$inferSelect;
export type InsertChatConversation = typeof chatConversations.$inferInsert;

/**
 * Individual chat messages
 */
export const chatMessages = mysqlTable("windhoek_na_26_chat_messages", {
  id: int("id").autoincrement().primaryKey(),
  conversationId: int("conversationId").notNull(),
  role: mysqlEnum("role", ["user", "assistant"]).notNull(),
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
export const trips = mysqlTable("windhoek_na_26_trips", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"), // Optional for guest users
  sessionId: varchar("sessionId", { length: 255 }), // For guest users
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  startDate: timestamp("startDate"),
  endDate: timestamp("endDate"),
  coverImage: varchar("coverImage", { length: 1000 }),
  isPublic: boolean("isPublic").default(false).notNull(),
  shareCode: varchar("shareCode", { length: 50 }), // Unique share code
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Trip = typeof trips.$inferSelect;
export type InsertTrip = typeof trips.$inferInsert;

/**
 * Trip days (itinerary days)
 */
export const tripDays = mysqlTable("windhoek_na_26_trip_days", {
  id: int("id").autoincrement().primaryKey(),
  tripId: int("tripId").notNull(),
  dayNumber: int("dayNumber").notNull(),
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
export const tripItems = mysqlTable("windhoek_na_26_trip_items", {
  id: int("id").autoincrement().primaryKey(),
  tripDayId: int("tripDayId").notNull(),
  listingId: int("listingId").notNull(),
  displayOrder: int("displayOrder").default(0).notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type TripItem = typeof tripItems.$inferSelect;
export type InsertTripItem = typeof tripItems.$inferInsert;

/**
 * User favorites/wishlist
 */
export const favorites = mysqlTable("windhoek_na_26_favorites", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"), // Optional for guest users
  sessionId: varchar("sessionId", { length: 255 }), // For guest users
  listingId: int("listingId").notNull(),
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
export const routes = mysqlTable("windhoek_na_26_routes", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  shortDescription: varchar("shortDescription", { length: 500 }),
  duration: int("duration").notNull(), // Duration in days (1-30)
  difficulty: mysqlEnum("difficulty", ["easy", "moderate", "challenging"]).default("moderate").notNull(),
  distance: int("distance"), // Total distance in km
  highlights: text("highlights"), // JSON array of highlight strings
  bestTimeToVisit: varchar("bestTimeToVisit", { length: 255 }),
  coverImage: varchar("coverImage", { length: 1000 }),
  videoUrl: varchar("videoUrl", { length: 1000 }), // Video background URL
  seasonalInfo: text("seasonalInfo"), // JSON with best seasons and recommendations
  mapData: text("mapData"), // JSON for map coordinates/polyline
  startLocation: varchar("startLocation", { length: 255 }),
  endLocation: varchar("endLocation", { length: 255 }),
  regions: text("regions"), // JSON array of region IDs covered
  isFeatured: boolean("isFeatured").default(false).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  viewCount: int("viewCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Route = typeof routes.$inferSelect;
export type InsertRoute = typeof routes.$inferInsert;

/**
 * Stops along a route
 */
export const routeStops = mysqlTable("windhoek_na_26_route_stops", {
  id: int("id").autoincrement().primaryKey(),
  routeId: int("routeId").notNull(),
  dayNumber: int("dayNumber").notNull(), // Which day of the route
  stopOrder: int("stopOrder").notNull(), // Order within the day
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  latitude: varchar("latitude", { length: 50 }),
  longitude: varchar("longitude", { length: 50 }),
  duration: varchar("duration", { length: 100 }), // e.g., "2-3 hours", "overnight"
  activities: text("activities"), // JSON array of activities
  tips: text("tips"),
  image: varchar("image", { length: 1000 }),
  listingId: int("listingId"), // Optional link to a listing
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

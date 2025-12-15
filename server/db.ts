import { eq, desc, like, and, sql, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { 
  InsertUser, 
  users, 
  categories, 
  listings, 
  media, 
  listingMedia,
  routes,
  routeStops,
  InsertCategory,
  InsertListing,
  InsertMedia,
  InsertListingMedia,
  InsertRoute,
  InsertRouteStop
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;
let _client: ReturnType<typeof postgres> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _client = postgres(process.env.DATABASE_URL, { ssl: 'require' });
      _db = drizzle(_client);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    // PostgreSQL upsert using ON CONFLICT
    await db.insert(users).values(values).onConflictDoUpdate({
      target: users.openId,
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Categories
export async function getAllCategories() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(categories).orderBy(categories.displayOrder);
}

export async function getActiveCategories() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(categories)
    .where(eq(categories.isActive, true))
    .orderBy(categories.displayOrder);
}

export async function getCategoryById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
  return result[0];
}

export async function getCategoryBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
  return result[0];
}

export async function createCategory(category: InsertCategory) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(categories).values(category).returning();
  return result[0];
}

export async function updateCategory(id: number, category: Partial<InsertCategory>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(categories).set(category).where(eq(categories.id, id));
}

export async function deleteCategory(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(categories).where(eq(categories.id, id));
}

// Listings
export async function getAllListings(categoryId?: number) {
  const db = await getDb();
  if (!db) return [];
  
  if (categoryId) {
    return await db.select().from(listings)
      .where(eq(listings.categoryId, categoryId))
      .orderBy(desc(listings.createdAt));
  }
  
  return await db.select().from(listings).orderBy(desc(listings.createdAt));
}

export async function getActiveListings(categoryId?: number, region?: string, featured?: boolean) {
  const db = await getDb();
  if (!db) return [];
  
  const conditions = [eq(listings.isActive, true)];
  if (categoryId) {
    conditions.push(eq(listings.categoryId, categoryId));
  }
  if (region) {
    conditions.push(eq(listings.region, region));
  }
  if (featured) {
    conditions.push(eq(listings.isFeatured, true));
  }
  
  return await db.select().from(listings)
    .where(and(...conditions))
    .orderBy(desc(listings.isFeatured), desc(listings.createdAt));
}

export async function getListingById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(listings).where(eq(listings.id, id)).limit(1);
  return result[0];
}

export async function getListingBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(listings).where(eq(listings.slug, slug)).limit(1);
  return result[0];
}

export async function searchListings(query: string, categoryId?: number, region?: string) {
  const db = await getDb();
  if (!db) return [];
  
  const searchPattern = `%${query}%`;
  const conditions = [
    eq(listings.isActive, true),
    or(
      sql`${listings.name} ILIKE ${searchPattern}`,
      sql`${listings.description} ILIKE ${searchPattern}`
    )
  ];
  
  if (categoryId) {
    conditions.push(eq(listings.categoryId, categoryId));
  }
  if (region) {
    conditions.push(eq(listings.region, region));
  }
  
  return await db.select().from(listings)
    .where(and(...conditions))
    .orderBy(desc(listings.isFeatured), desc(listings.createdAt));
}

export async function createListing(listing: InsertListing) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(listings).values(listing).returning();
  return result[0];
}

export async function updateListing(id: number, listing: Partial<InsertListing>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(listings).set(listing).where(eq(listings.id, id));
}

export async function deleteListing(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(listings).where(eq(listings.id, id));
}

export async function incrementListingViews(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(listings)
    .set({ viewCount: sql`${listings.viewCount} + 1` })
    .where(eq(listings.id, id));
}

// Media
export async function getAllMedia() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(media).orderBy(desc(media.createdAt));
}

export async function getMediaById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(media).where(eq(media.id, id)).limit(1);
  return result[0];
}

export async function getMediaByListing(listingId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select({
      id: media.id,
      title: media.title,
      description: media.description,
      mediaType: media.mediaType,
      fileUrl: media.fileUrl,
      thumbnailUrl: media.thumbnailUrl,
      fileKey: media.fileKey,
      mimeType: media.mimeType,
      fileSize: media.fileSize,
      width: media.width,
      height: media.height,
      duration: media.duration,
      altText: media.altText,
      caption: media.caption,
      displayOrder: listingMedia.displayOrder,
      isPrimary: listingMedia.isPrimary,
    })
    .from(listingMedia)
    .innerJoin(media, eq(listingMedia.mediaId, media.id))
    .where(eq(listingMedia.listingId, listingId))
    .orderBy(listingMedia.displayOrder);
}

export async function createMedia(mediaData: InsertMedia) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(media).values(mediaData).returning();
  return result[0];
}

export async function updateMedia(id: number, mediaData: Partial<InsertMedia>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(media).set(mediaData).where(eq(media.id, id));
}

export async function deleteMedia(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(media).where(eq(media.id, id));
}

// Listing Media associations
export async function addMediaToListing(data: InsertListingMedia) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(listingMedia).values(data);
}

export async function removeMediaFromListing(listingId: number, mediaId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(listingMedia)
    .where(and(
      eq(listingMedia.listingId, listingId),
      eq(listingMedia.mediaId, mediaId)
    ));
}

export async function updateListingMediaOrder(listingId: number, mediaId: number, displayOrder: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(listingMedia)
    .set({ displayOrder })
    .where(and(
      eq(listingMedia.listingId, listingId),
      eq(listingMedia.mediaId, mediaId)
    ));
}

export async function setPrimaryMedia(listingId: number, mediaId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // First, unset all primary flags for this listing
  await db.update(listingMedia)
    .set({ isPrimary: false })
    .where(eq(listingMedia.listingId, listingId));
  
  // Then set the new primary
  await db.update(listingMedia)
    .set({ isPrimary: true })
    .where(and(
      eq(listingMedia.listingId, listingId),
      eq(listingMedia.mediaId, mediaId)
    ));
}

// Routes
export async function getAllRoutes() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(routes).orderBy(desc(routes.createdAt));
}

export async function getActiveRoutes(featured?: boolean) {
  const db = await getDb();
  if (!db) return [];
  
  const conditions = [eq(routes.isActive, true)];
  if (featured) {
    conditions.push(eq(routes.isFeatured, true));
  }
  
  return await db.select().from(routes)
    .where(and(...conditions))
    .orderBy(desc(routes.isFeatured), desc(routes.createdAt));
}

export async function getRouteById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(routes).where(eq(routes.id, id)).limit(1);
  return result[0];
}

export async function getRouteBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(routes).where(eq(routes.slug, slug)).limit(1);
  return result[0];
}

export async function createRoute(route: InsertRoute) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(routes).values(route).returning();
  return result[0];
}

export async function updateRoute(id: number, route: Partial<InsertRoute>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(routes).set(route).where(eq(routes.id, id));
}

export async function deleteRoute(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(routes).where(eq(routes.id, id));
}

export async function incrementRouteViews(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(routes)
    .set({ viewCount: sql`${routes.viewCount} + 1` })
    .where(eq(routes.id, id));
}

// Route Stops
export async function getRouteStops(routeId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(routeStops)
    .where(eq(routeStops.routeId, routeId))
    .orderBy(routeStops.dayNumber, routeStops.stopOrder);
}

export async function createRouteStop(stop: InsertRouteStop) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(routeStops).values(stop).returning();
  return result[0];
}

export async function updateRouteStop(id: number, stop: Partial<InsertRouteStop>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(routeStops).set(stop).where(eq(routeStops.id, id));
}

export async function deleteRouteStop(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(routeStops).where(eq(routeStops.id, id));
}

// Alias for getRoutes (used by routers.ts)
export async function getRoutes(filters?: { featured?: boolean; difficulty?: string; duration?: number }) {
  const db = await getDb();
  if (!db) return [];
  
  const conditions = [eq(routes.isActive, true)];
  if (filters?.featured) {
    conditions.push(eq(routes.isFeatured, true));
  }
  if (filters?.difficulty) {
    conditions.push(eq(routes.difficulty, filters.difficulty));
  }
  if (filters?.duration) {
    conditions.push(eq(routes.duration, filters.duration));
  }
  
  return await db.select().from(routes)
    .where(and(...conditions))
    .orderBy(desc(routes.isFeatured), desc(routes.createdAt));
}

// Get available durations for filtering
export async function getAvailableDurations() {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.selectDistinct({ duration: routes.duration })
    .from(routes)
    .where(eq(routes.isActive, true))
    .orderBy(routes.duration);
  
  return result.map(r => r.duration);
}

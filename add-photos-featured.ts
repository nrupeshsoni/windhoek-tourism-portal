/**
 * Add sample photos to key listings and mark top businesses as featured
 */

import { drizzle } from "drizzle-orm/mysql2";
import { listings, media, listingMedia, categories } from "./drizzle/schema";
import { eq, sql, desc, and } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL!);

// Sample images available in public folder
const sampleImages = [
  { path: "/images/hero-sossusvlei.jpg", alt: "Sossusvlei red dunes at sunrise", type: "photo" as const },
  { path: "/images/hero-deadvlei.jpg", alt: "Deadvlei ancient camelthorn trees", type: "photo" as const },
  { path: "/images/hero-etosha.jpg", alt: "Etosha National Park wildlife", type: "photo" as const },
  { path: "/images/hero-wildlife.jpg", alt: "Namibian wildlife safari", type: "photo" as const },
  { path: "/images/hero-dunes.jpg", alt: "Namib Desert sand dunes", type: "photo" as const },
  { path: "/images/hero-canyon.jpg", alt: "Fish River Canyon vista", type: "photo" as const },
  { path: "/images/lodge-1.jpg", alt: "Luxury safari lodge", type: "photo" as const },
  { path: "/images/lodge-2.jpg", alt: "Desert lodge accommodation", type: "photo" as const },
  { path: "/images/lodge-3.jpg", alt: "Tented camp experience", type: "photo" as const },
  { path: "/images/campsite-1.jpg", alt: "Namibian campsite under stars", type: "photo" as const },
  { path: "/images/campsite-2.jpg", alt: "Bush camping experience", type: "photo" as const },
  { path: "/images/tour-operator-1.jpg", alt: "Safari game drive", type: "photo" as const },
];

async function addPhotosAndFeature() {
  console.log("\n📸 Adding sample photos and featuring top listings...\n");
  
  // Get categories for targeting
  const cats = await db.select().from(categories);
  const categoryMap = new Map(cats.map(c => [c.slug, c.id]));
  
  // Categories to feature (top listings from each)
  const categoriesToFeature = [
    "lodges",
    "hotels", 
    "guest-houses",
    "campsites",
    "tour-operators",
    "safari-experiences",
    "adventure-activities",
    "self-catering",
    "vehicle-rentals",
    "shuttles-transfers",
  ];
  
  let photosAdded = 0;
  let listingsFeatured = 0;
  
  // First, create media entries for our sample images
  console.log("📷 Creating media entries...\n");
  
  const mediaIds: number[] = [];
  
  for (const img of sampleImages) {
    try {
      const result = await db.insert(media).values({
        type: img.type,
        url: img.path,
        thumbnailUrl: img.path,
        title: img.alt,
        altText: img.alt,
        isPublic: true,
      });
      mediaIds.push(Number((result as any).insertId));
      console.log(`   ✅ Created media: ${img.alt}`);
    } catch (error) {
      console.log(`   ⏭️ Media may already exist: ${img.alt}`);
    }
  }
  
  console.log(`\n🌟 Featuring top listings from each category...\n`);
  
  for (const catSlug of categoriesToFeature) {
    const categoryId = categoryMap.get(catSlug);
    if (!categoryId) {
      console.log(`   ⚠️ Category not found: ${catSlug}`);
      continue;
    }
    
    // Get top 5 listings from this category (by name alphabetically for consistency)
    const topListings = await db
      .select()
      .from(listings)
      .where(and(
        eq(listings.categoryId, categoryId),
        eq(listings.isActive, true)
      ))
      .orderBy(listings.name)
      .limit(5);
    
    for (const listing of topListings) {
      try {
        // Mark as featured
        await db
          .update(listings)
          .set({ isFeatured: true })
          .where(eq(listings.id, listing.id));
        listingsFeatured++;
        
        // Add a random photo to this listing
        if (mediaIds.length > 0) {
          const randomMediaId = mediaIds[Math.floor(Math.random() * mediaIds.length)];
          
          // Check if already has media
          const existingMedia = await db
            .select()
            .from(listingMedia)
            .where(eq(listingMedia.listingId, listing.id))
            .limit(1);
          
          if (existingMedia.length === 0) {
            await db.insert(listingMedia).values({
              listingId: listing.id,
              mediaId: randomMediaId,
              sortOrder: 0,
              isPrimary: true,
            });
            photosAdded++;
          }
        }
      } catch (error) {
        // Ignore duplicate errors
      }
    }
    
    console.log(`   ✅ Featured ${topListings.length} listings from ${catSlug}`);
  }
  
  // Also feature some well-known Namibian establishments by name
  const famousNames = [
    "Sossusvlei",
    "Etosha",
    "Skeleton Coast",
    "Swakopmund",
    "Windhoek",
    "Fish River",
    "Namib",
    "Damaraland",
    "Caprivi",
    "Kaokoland",
  ];
  
  console.log(`\n🏆 Featuring well-known establishments...\n`);
  
  for (const name of famousNames) {
    const matchingListings = await db
      .select()
      .from(listings)
      .where(sql`${listings.name} LIKE ${`%${name}%`}`)
      .limit(3);
    
    for (const listing of matchingListings) {
      await db
        .update(listings)
        .set({ isFeatured: true })
        .where(eq(listings.id, listing.id));
      listingsFeatured++;
    }
    
    if (matchingListings.length > 0) {
      console.log(`   ✅ Featured ${matchingListings.length} listings matching "${name}"`);
    }
  }
  
  console.log(`\n${"=".repeat(50)}`);
  console.log(`📊 SUMMARY`);
  console.log(`${"=".repeat(50)}`);
  console.log(`   📷 Media entries created: ${mediaIds.length}`);
  console.log(`   🖼️ Photos added to listings: ${photosAdded}`);
  console.log(`   🌟 Listings featured: ${listingsFeatured}`);
  console.log(`\n✅ Complete!`);
  
  process.exit(0);
}

addPhotosAndFeature().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});

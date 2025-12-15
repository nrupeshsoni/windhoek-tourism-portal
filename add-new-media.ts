/**
 * Add new media entries for downloaded images and link to relevant listings
 */

import { drizzle } from "drizzle-orm/mysql2";
import { listings, media, listingMedia, categories } from "./drizzle/schema";
import { eq, like, sql, and } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL!);

// New images to add
const newImages = [
  { path: "/images/sossusvlei-dune-1.jpg", title: "Sossusvlei Dune 45", alt: "Iconic red sand dune at Sossusvlei", keywords: ["sossusvlei", "dune", "desert"] },
  { path: "/images/sossusvlei-dune-2.jpg", title: "Sossusvlei Sand Dunes", alt: "Tourists climbing the famous red dunes", keywords: ["sossusvlei", "dune", "desert"] },
  { path: "/images/sossusvlei-aerial.jpg", title: "Sossusvlei Aerial View", alt: "Aerial view of Sossusvlei dunes and salt pan", keywords: ["sossusvlei", "aerial", "desert"] },
  { path: "/images/etosha-wildlife-1.jpg", title: "Etosha Wildlife", alt: "Diverse wildlife at Etosha waterhole", keywords: ["etosha", "wildlife", "safari"] },
  { path: "/images/etosha-waterhole.jpg", title: "Etosha Waterhole", alt: "Elephants at Etosha National Park waterhole", keywords: ["etosha", "elephant", "waterhole"] },
  { path: "/images/etosha-safari.jpg", title: "Etosha Safari", alt: "Safari game drive in Etosha", keywords: ["etosha", "safari", "game drive"] },
  { path: "/images/luxury-lodge-1.jpg", title: "Namibia Luxury Lodge", alt: "Stunning luxury lodge in Namibia", keywords: ["lodge", "luxury", "accommodation"] },
  { path: "/images/luxury-lodge-2.jpg", title: "Desert Lodge Interior", alt: "Luxury lodge with desert views", keywords: ["lodge", "luxury", "interior"] },
  { path: "/images/spitzkoppe-camping.jpg", title: "Spitzkoppe Camping", alt: "Camping under the stars at Spitzkoppe", keywords: ["camping", "spitzkoppe", "stars"] },
  { path: "/images/camping-stars.jpg", title: "Namibia Stargazing", alt: "Milky Way over Namibian campsite", keywords: ["camping", "stars", "milky way"] },
  { path: "/images/star-trails.jpg", title: "Star Trails Namibia", alt: "Star trail photography in Namibian desert", keywords: ["stars", "night", "desert"] },
  { path: "/images/swakopmund-quad.jpg", title: "Swakopmund Quad Biking", alt: "Quad biking adventure in Swakopmund dunes", keywords: ["swakopmund", "quad", "adventure"] },
  { path: "/images/sandboarding.jpg", title: "Sandboarding Namibia", alt: "Sandboarding down Namibian dunes", keywords: ["sandboarding", "adventure", "dunes"] },
  { path: "/images/skeleton-coast-1.jpg", title: "Skeleton Coast", alt: "Dramatic Skeleton Coast landscape", keywords: ["skeleton coast", "coast", "desert"] },
  { path: "/images/skeleton-coast-2.jpg", title: "Skeleton Coast Aerial", alt: "Where desert meets ocean at Skeleton Coast", keywords: ["skeleton coast", "aerial", "ocean"] },
];

async function addNewMedia() {
  console.log("\n📸 Adding new media entries...\n");
  
  const mediaIds: number[] = [];
  
  for (const img of newImages) {
    try {
      const result = await db.insert(media).values({
        mediaType: "photo",
        fileUrl: img.path,
        thumbnailUrl: img.path,
        fileKey: img.path, // Using path as key for local files
        title: img.title,
        altText: img.alt,
        isActive: true,
      });
      const insertId = Number((result as any).insertId);
      mediaIds.push(insertId);
      console.log(`   ✅ Added: ${img.title} (ID: ${insertId})`);
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        console.log(`   ⏭️ Already exists: ${img.title}`);
      } else {
        console.error(`   ❌ Error: ${img.title}`, error.message);
      }
    }
  }
  
  console.log(`\n🔗 Linking media to relevant listings...\n`);
  
  // Link images to listings based on keywords
  let linked = 0;
  
  for (let i = 0; i < newImages.length; i++) {
    const img = newImages[i];
    const mediaId = mediaIds[i];
    
    if (!mediaId) continue;
    
    for (const keyword of img.keywords) {
      // Find listings matching keyword
      const matchingListings = await db
        .select()
        .from(listings)
        .where(sql`${listings.name} LIKE ${`%${keyword}%`}`)
        .limit(5);
      
      for (const listing of matchingListings) {
        try {
          // Check if already linked
          const existing = await db
            .select()
            .from(listingMedia)
            .where(and(
              eq(listingMedia.listingId, listing.id),
              eq(listingMedia.mediaId, mediaId)
            ))
            .limit(1);
          
          if (existing.length === 0) {
            await db.insert(listingMedia).values({
              listingId: listing.id,
              mediaId: mediaId,
              sortOrder: 0,
              isPrimary: false,
            });
            linked++;
          }
        } catch (error) {
          // Ignore duplicates
        }
      }
    }
  }
  
  console.log(`\n${"=".repeat(50)}`);
  console.log(`📊 SUMMARY`);
  console.log(`${"=".repeat(50)}`);
  console.log(`   📷 New media added: ${mediaIds.length}`);
  console.log(`   🔗 New links created: ${linked}`);
  console.log(`\n✅ Complete!`);
  
  process.exit(0);
}

addNewMedia().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});

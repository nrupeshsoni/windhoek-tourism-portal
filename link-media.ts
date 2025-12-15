/**
 * Link existing media to featured listings
 */

import { drizzle } from "drizzle-orm/mysql2";
import { listings, media, listingMedia } from "./drizzle/schema";
import { eq, and } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL!);

async function linkMedia() {
  console.log("\n🔗 Linking media to featured listings...\n");
  
  // Get all media
  const allMedia = await db.select().from(media);
  console.log(`📷 Found ${allMedia.length} media entries\n`);
  
  if (allMedia.length === 0) {
    console.log("No media found. Exiting.");
    process.exit(0);
  }
  
  // Get featured listings without media
  const featuredListings = await db
    .select()
    .from(listings)
    .where(eq(listings.isFeatured, true))
    .limit(100);
  
  console.log(`🌟 Found ${featuredListings.length} featured listings\n`);
  
  let linked = 0;
  
  for (const listing of featuredListings) {
    // Check if listing already has media
    const existingLink = await db
      .select()
      .from(listingMedia)
      .where(eq(listingMedia.listingId, listing.id))
      .limit(1);
    
    if (existingLink.length > 0) {
      continue; // Already has media
    }
    
    // Assign a random media
    const randomMedia = allMedia[Math.floor(Math.random() * allMedia.length)];
    
    try {
      await db.insert(listingMedia).values({
        listingId: listing.id,
        mediaId: randomMedia.id,
        sortOrder: 0,
        isPrimary: true,
      });
      linked++;
      console.log(`   ✅ Linked media to: ${listing.name}`);
    } catch (error) {
      // Ignore duplicates
    }
  }
  
  console.log(`\n${"=".repeat(50)}`);
  console.log(`📊 SUMMARY`);
  console.log(`${"=".repeat(50)}`);
  console.log(`   🔗 Media linked: ${linked}`);
  console.log(`\n✅ Complete!`);
  
  process.exit(0);
}

linkMedia().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});

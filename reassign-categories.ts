/**
 * Reassign NTB businesses to correct categories
 * Updates existing listings with proper category assignments
 */

import { drizzle } from "drizzle-orm/mysql2";
import { listings, categories } from "./drizzle/schema";
import { eq, like, sql } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL!);

// NTB category text to platform category slug mapping
const categoryMapping: Record<string, string> = {
  // Hotels
  "hotel": "hotels",
  "pension hotel": "hotels",
  
  // Lodges
  "lodge": "lodges",
  "tented lodge": "lodges",
  "tented lodge with campsite": "lodges",
  
  // Guest Houses & B&B
  "guest house": "guest-houses",
  "bed and breakfast": "guest-houses",
  "b&b": "guest-houses",
  
  // Guest Farms
  "guest farm": "guest-farms",
  
  // Self-Catering
  "self catering": "self-catering",
  "self-catering": "self-catering",
  
  // Campsites
  "camp site": "campsites",
  "campsite": "campsites",
  "camping & caravan": "campsites",
  "caravan park": "campsites",
  
  // Backpackers
  "backpackers": "backpackers",
  "backpackers hostel": "backpackers",
  
  // Rest Camps
  "rest camp": "rest-camps",
  
  // Tented Camps
  "tented camp": "tented-camps",
  "permanent tented": "tented-camps",
  "permenant tented": "tented-camps",
  
  // Resorts
  "resort": "resorts",
  
  // Tour Operators
  "tour and safari operator": "tour-operators",
  "tour operator": "tour-operators",
  "safari operator": "tour-operators",
  
  // Tour Facilitators
  "tour facilitator": "tour-facilitators",
  
  // Foreign Tour Operators
  "foreign tour operator": "foreign-tour-operators",
  
  // Booking Agents
  "booking agent": "booking-agents",
  
  // Activity Operators
  "activity operator": "activity-operators",
  
  // Trophy Hunting
  "trophy hunt": "trophy-hunting",
  
  // Shuttles & Transfers
  "shuttle": "shuttles-transfers",
  "transport": "shuttles-transfers",
  
  // Vehicle Rentals
  "vehicle rental": "vehicle-rentals",
  "car rental": "vehicle-rentals",
  
  // Air Charters
  "air charter": "air-charters",
  
  // Conference Centers
  "conference": "conference-centers",
};

async function reassignCategories() {
  console.log("\n🔄 Reassigning businesses to correct categories...\n");
  
  // Get all platform categories
  const platformCategories = await db.select().from(categories);
  const categoryMap = new Map(platformCategories.map(c => [c.slug, c.id]));
  
  console.log(`📁 Found ${platformCategories.length} platform categories\n`);
  
  // Get all listings with their short descriptions
  const allListings = await db
    .select({
      id: listings.id,
      name: listings.name,
      shortDescription: listings.shortDescription,
      categoryId: listings.categoryId,
    })
    .from(listings);
  
  console.log(`📊 Found ${allListings.length} listings to process\n`);
  
  let updated = 0;
  let unchanged = 0;
  let errors = 0;
  
  for (const listing of allListings) {
    try {
      const desc = (listing.shortDescription || "").toLowerCase();
      
      // Find matching category
      let newCategorySlug: string | null = null;
      
      for (const [keyword, slug] of Object.entries(categoryMapping)) {
        if (desc.includes(keyword)) {
          newCategorySlug = slug;
          break;
        }
      }
      
      if (!newCategorySlug) {
        unchanged++;
        continue;
      }
      
      const newCategoryId = categoryMap.get(newCategorySlug);
      
      if (!newCategoryId) {
        console.log(`⚠️ Category not found: ${newCategorySlug}`);
        unchanged++;
        continue;
      }
      
      // Only update if category changed
      if (listing.categoryId !== newCategoryId) {
        await db
          .update(listings)
          .set({ categoryId: newCategoryId })
          .where(eq(listings.id, listing.id));
        updated++;
        
        if (updated % 500 === 0) {
          console.log(`   ✅ Updated ${updated} listings...`);
        }
      } else {
        unchanged++;
      }
    } catch (error) {
      errors++;
      if (errors <= 5) {
        console.error(`❌ Error updating listing ${listing.id}:`, error);
      }
    }
  }
  
  console.log(`\n${"=".repeat(50)}`);
  console.log(`📊 REASSIGNMENT SUMMARY`);
  console.log(`${"=".repeat(50)}`);
  console.log(`   ✅ Updated: ${updated}`);
  console.log(`   ⏭️ Unchanged: ${unchanged}`);
  console.log(`   ❌ Errors: ${errors}`);
  console.log(`\n✅ Category reassignment complete!`);
  
  // Show category distribution
  console.log(`\n📊 New category distribution:\n`);
  
  const distribution = await db
    .select({
      categoryName: categories.name,
      count: sql<number>`COUNT(${listings.id})`,
    })
    .from(listings)
    .innerJoin(categories, eq(listings.categoryId, categories.id))
    .groupBy(categories.id, categories.name)
    .orderBy(sql`COUNT(${listings.id}) DESC`);
  
  for (const row of distribution) {
    console.log(`   ${row.categoryName}: ${row.count}`);
  }
  
  process.exit(0);
}

reassignCategories().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});

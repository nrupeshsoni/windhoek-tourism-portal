/**
 * Comprehensive Category Seed Script
 * Creates all 30 NTB categories plus 3 additional custom categories
 */

import { drizzle } from "drizzle-orm/mysql2";
import { categories } from "./drizzle/schema";
import { eq } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL!);

// All categories to create - combining NTB categories with platform-friendly names
const allCategories = [
  // Accommodation Categories (from NTB)
  { name: "Hotels", slug: "hotels", description: "Hotels and pension hotels offering full-service accommodation", icon: "Building2" },
  { name: "Lodges", slug: "lodges", description: "Safari lodges and tented lodges in scenic locations", icon: "Home" },
  { name: "Guest Houses", slug: "guest-houses", description: "Guest houses, B&Bs, and bed & breakfast accommodation", icon: "House" },
  { name: "Guest Farms", slug: "guest-farms", description: "Working farms offering guest accommodation and farm experiences", icon: "Warehouse" },
  { name: "Self-Catering", slug: "self-catering", description: "Self-catering apartments, cottages, and holiday homes", icon: "ChefHat" },
  { name: "Campsites", slug: "campsites", description: "Campsites, caravan parks, and camping facilities", icon: "Tent" },
  { name: "Backpackers", slug: "backpackers", description: "Backpackers hostels and budget accommodation", icon: "Backpack" },
  { name: "Rest Camps", slug: "rest-camps", description: "Rest camps in national parks and conservation areas", icon: "TreePine" },
  { name: "Tented Camps", slug: "tented-camps", description: "Permanent tented camps and luxury safari tents", icon: "Tent" },
  { name: "Resorts", slug: "resorts", description: "Full-service resorts with amenities and activities", icon: "Palmtree" },
  
  // Tour & Safari Categories (from NTB)
  { name: "Tour Operators", slug: "tour-operators", description: "Tour and safari operators offering guided experiences", icon: "Map" },
  { name: "Tour Facilitators", slug: "tour-facilitators", description: "Tour facilitators and travel coordinators", icon: "Users" },
  { name: "Foreign Tour Operators", slug: "foreign-tour-operators", description: "International tour operators serving Namibia", icon: "Globe" },
  { name: "Booking Agents", slug: "booking-agents", description: "Travel agents and booking services", icon: "CalendarCheck" },
  
  // Activity Categories (from NTB)
  { name: "Activity Operators", slug: "activity-operators", description: "Adventure and activity operators (motorised and non-motorised)", icon: "Compass" },
  { name: "Trophy Hunting", slug: "trophy-hunting", description: "Trophy hunting operators with and without accommodation", icon: "Target" },
  
  // Transport Categories (from NTB)
  { name: "Shuttles & Transfers", slug: "shuttles-transfers", description: "Shuttle services and airport transfers", icon: "Bus" },
  { name: "Vehicle Rentals", slug: "vehicle-rentals", description: "Car rental and vehicle hire services", icon: "Car" },
  { name: "Air Charters", slug: "air-charters", description: "Air charter and scenic flight operators", icon: "Plane" },
  
  // Events & Conferences (from NTB)
  { name: "Conference Centers", slug: "conference-centers", description: "Conference and event venues", icon: "Presentation" },
  
  // Additional Platform Categories (user's original 25 categories)
  { name: "Safari Experiences", slug: "safari-experiences", description: "Wildlife safaris and game viewing experiences", icon: "Binoculars" },
  { name: "Adventure Activities", slug: "adventure-activities", description: "Sandboarding, skydiving, quad biking, and more", icon: "Mountain" },
  { name: "Cultural Tours", slug: "cultural-tours", description: "Himba villages, San experiences, and heritage tours", icon: "Users" },
  { name: "Tour Guides", slug: "tour-guides", description: "Professional tour guides and local experts", icon: "UserCheck" },
  { name: "Restaurants & Dining", slug: "restaurants-dining", description: "Restaurants, cafes, and dining experiences", icon: "UtensilsCrossed" },
  { name: "Shopping & Crafts", slug: "shopping-crafts", description: "Curio shops, craft markets, and souvenirs", icon: "ShoppingBag" },
  { name: "Photography Tours", slug: "photography-tours", description: "Specialized photography safaris and workshops", icon: "Camera" },
  { name: "Wellness & Spas", slug: "wellness-spas", description: "Spas, wellness retreats, and relaxation services", icon: "Sparkles" },
  { name: "Desert Experiences", slug: "desert-experiences", description: "Namib Desert tours, dune experiences, and stargazing", icon: "Sun" },
  { name: "Marine & Coastal", slug: "marine-coastal", description: "Dolphin cruises, seal kayaking, and coastal activities", icon: "Waves" },
  { name: "Fishing", slug: "fishing", description: "Deep sea fishing, fly fishing, and angling charters", icon: "Fish" },
  { name: "Birding", slug: "birding", description: "Birdwatching tours and ornithology experiences", icon: "Bird" },
  { name: "4x4 & Off-Road", slug: "4x4-offroad", description: "4x4 trails, off-road adventures, and self-drive routes", icon: "Truck" },
];

async function seedCategories() {
  console.log("\n🌱 Seeding comprehensive category list...\n");
  
  let created = 0;
  let existing = 0;
  
  for (const cat of allCategories) {
    try {
      // Check if category exists
      const [existingCat] = await db
        .select()
        .from(categories)
        .where(eq(categories.slug, cat.slug))
        .limit(1);
      
      if (existingCat) {
        console.log(`   ⏭️ ${cat.name} (already exists)`);
        existing++;
      } else {
        await db.insert(categories).values({
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          icon: cat.icon,
          isActive: true,
        });
        console.log(`   ✅ ${cat.name}`);
        created++;
      }
    } catch (error) {
      console.error(`   ❌ Error creating ${cat.name}:`, error);
    }
  }
  
  console.log(`\n${"=".repeat(50)}`);
  console.log(`📊 CATEGORY SEED SUMMARY`);
  console.log(`${"=".repeat(50)}`);
  console.log(`   ✅ Created: ${created}`);
  console.log(`   ⏭️ Already existed: ${existing}`);
  console.log(`   📁 Total categories: ${allCategories.length}`);
  console.log(`\n✅ Category seeding complete!`);
  
  process.exit(0);
}

seedCategories().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});

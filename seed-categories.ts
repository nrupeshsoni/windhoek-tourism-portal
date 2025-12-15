import { drizzle } from "drizzle-orm/mysql2";
import { categories } from "./drizzle/schema";

const db = drizzle(process.env.DATABASE_URL!);

const tourismCategories = [
  { name: "Tour Operators", slug: "tour-operators", description: "Professional tour companies offering guided experiences across Namibia", icon: "🚐", displayOrder: 1 },
  { name: "Campsites", slug: "campsites", description: "Camping facilities from basic to luxury in stunning natural settings", icon: "⛺", displayOrder: 2 },
  { name: "Shuttles & Transfers", slug: "shuttles-transfers", description: "Airport transfers and shuttle services between destinations", icon: "🚌", displayOrder: 3 },
  { name: "Tour Guides", slug: "tour-guides", description: "Licensed and experienced tour guides for personalized experiences", icon: "👨‍🏫", displayOrder: 4 },
  { name: "Lodges & Hotels", slug: "lodges-hotels", description: "Accommodation from boutique lodges to luxury hotels", icon: "🏨", displayOrder: 5 },
  { name: "Guest Houses", slug: "guest-houses", description: "Comfortable and affordable guest house accommodation", icon: "🏠", displayOrder: 6 },
  { name: "Safari Experiences", slug: "safari-experiences", description: "Wildlife viewing and safari adventures in national parks", icon: "🦁", displayOrder: 7 },
  { name: "Adventure Activities", slug: "adventure-activities", description: "Sandboarding, skydiving, quad biking and extreme sports", icon: "🪂", displayOrder: 8 },
  { name: "Car Rentals", slug: "car-rentals", description: "4x4 and vehicle rental services for self-drive adventures", icon: "🚗", displayOrder: 9 },
  { name: "Restaurants & Dining", slug: "restaurants-dining", description: "Local cuisine and international dining experiences", icon: "🍽️", displayOrder: 10 },
  { name: "Cultural Experiences", slug: "cultural-experiences", description: "Traditional village visits and cultural immersion programs", icon: "🎭", displayOrder: 11 },
  { name: "National Parks", slug: "national-parks", description: "Protected areas showcasing Namibia's diverse ecosystems", icon: "🏞️", displayOrder: 12 },
  { name: "Desert Experiences", slug: "desert-experiences", description: "Sossusvlei, Namib Desert and dune exploration", icon: "🏜️", displayOrder: 13 },
  { name: "Coastal Attractions", slug: "coastal-attractions", description: "Skeleton Coast, Swakopmund and Atlantic Ocean experiences", icon: "🌊", displayOrder: 14 },
  { name: "Wildlife Sanctuaries", slug: "wildlife-sanctuaries", description: "Conservation centers and animal rehabilitation facilities", icon: "🐆", displayOrder: 15 },
  { name: "Photography Tours", slug: "photography-tours", description: "Specialized photography expeditions and workshops", icon: "📷", displayOrder: 16 },
  { name: "Hiking & Trekking", slug: "hiking-trekking", description: "Guided and self-guided hiking trails and mountain treks", icon: "🥾", displayOrder: 17 },
  { name: "Hot Air Ballooning", slug: "hot-air-ballooning", description: "Scenic balloon flights over desert landscapes", icon: "🎈", displayOrder: 18 },
  { name: "Fishing Charters", slug: "fishing-charters", description: "Deep sea and river fishing expeditions", icon: "🎣", displayOrder: 19 },
  { name: "Spa & Wellness", slug: "spa-wellness", description: "Relaxation and wellness retreats in natural settings", icon: "💆", displayOrder: 20 },
  { name: "Shopping & Crafts", slug: "shopping-crafts", description: "Local markets, crafts and souvenir shopping", icon: "🛍️", displayOrder: 21 },
  { name: "Museums & Heritage", slug: "museums-heritage", description: "Historical sites and cultural museums", icon: "🏛️", displayOrder: 22 },
  { name: "Astronomy & Stargazing", slug: "astronomy-stargazing", description: "Dark sky experiences and astronomical observations", icon: "🔭", displayOrder: 23 },
  { name: "Horseback Riding", slug: "horseback-riding", description: "Equestrian tours through scenic landscapes", icon: "🐴", displayOrder: 24 },
  { name: "Wine & Beverage Tours", slug: "wine-beverage-tours", description: "Local breweries, wineries and tasting experiences", icon: "🍷", displayOrder: 25 },
  { name: "Medical Tourism", slug: "medical-tourism", description: "Healthcare and wellness medical services", icon: "⚕️", displayOrder: 26 },
  { name: "Conference & Events", slug: "conference-events", description: "Business conference facilities and event venues", icon: "🎪", displayOrder: 27 },
];

async function seedCategories() {
  console.log("Starting category seeding...");
  
  try {
    for (const category of tourismCategories) {
      await db.insert(categories).values(category).onDuplicateKeyUpdate({
        set: {
          name: category.name,
          description: category.description,
          icon: category.icon,
          displayOrder: category.displayOrder,
        }
      });
      console.log(`✓ Seeded: ${category.name}`);
    }
    
    console.log(`\n✅ Successfully seeded ${tourismCategories.length} categories`);
  } catch (error) {
    console.error("❌ Error seeding categories:", error);
    process.exit(1);
  }
  
  process.exit(0);
}

seedCategories();

import { drizzle } from "drizzle-orm/mysql2";
import { routes, routeStops } from "./drizzle/schema";

const db = drizzle(process.env.DATABASE_URL!);

// Real Namibia routes with accurate coordinates
const realRoutes = [
  // 1-DAY TOURS
  {
    name: "Windhoek City Discovery",
    slug: "windhoek-city-discovery-1day",
    description: "Explore Namibia's vibrant capital in a day. Visit historic landmarks, colorful markets, and experience the unique blend of German colonial and African cultures.",
    duration: 1,
    difficulty: "easy",
    distance: 25,
    highlights: ["Christuskirche", "Independence Memorial Museum", "Craft Markets", "Joe's Beerhouse", "Alte Feste"],
    bestSeason: "year-round",
    seasonNotes: "Windhoek is pleasant year-round. Winter (May-Sep) is cooler and drier.",
    imageUrl: "/images/placeholder-route-windhoek-city.jpg",
    stops: [
      { name: "Hosea Kutako International Airport", lat: -22.4799, lng: 17.4709, order: 1, description: "Arrive at Namibia's main international airport", activities: ["Airport pickup", "Car rental"], duration: 60 },
      { name: "Christuskirche", lat: -22.5700, lng: 17.0836, order: 2, description: "Iconic Lutheran church built in 1907, blending Art Nouveau and Neo-Gothic styles", activities: ["Photography", "Historical tour"], duration: 45 },
      { name: "Independence Memorial Museum", lat: -22.5692, lng: 17.0833, order: 3, description: "Modern museum showcasing Namibia's struggle for independence", activities: ["Museum tour", "Panoramic city views"], duration: 90 },
      { name: "Alte Feste", lat: -22.5697, lng: 17.0828, order: 4, description: "Historic fort and oldest building in Windhoek, now a museum", activities: ["Historical exploration"], duration: 45 },
      { name: "Post Street Mall & Craft Market", lat: -22.5609, lng: 17.0658, order: 5, description: "Pedestrian shopping area with local crafts and souvenirs", activities: ["Shopping", "Local crafts"], duration: 60 },
      { name: "Joe's Beerhouse", lat: -22.5567, lng: 17.0789, order: 6, description: "Famous restaurant with quirky decor and Namibian cuisine", activities: ["Dinner", "Local cuisine"], duration: 120 }
    ]
  },
  {
    name: "Sossusvlei Day Adventure",
    slug: "sossusvlei-day-adventure-1day",
    description: "Experience the world's highest sand dunes in a single unforgettable day. Witness the iconic red dunes of Sossusvlei and the haunting beauty of Deadvlei.",
    duration: 1,
    difficulty: "moderate",
    distance: 130,
    highlights: ["Dune 45 Sunrise", "Sossusvlei Pan", "Deadvlei", "Big Daddy Dune", "Sesriem Canyon"],
    bestSeason: "dry",
    seasonNotes: "Best April-October. Avoid summer (Nov-Mar) due to extreme heat. Early morning essential.",
    imageUrl: "/images/placeholder-route-sossusvlei-day.jpg",
    stops: [
      { name: "Sesriem Gate", lat: -24.4833, lng: 15.8333, order: 1, description: "Enter Namib-Naukluft National Park at sunrise (gates open at sunrise)", activities: ["Park entry", "Early start essential"], duration: 15 },
      { name: "Dune 45", lat: -24.7275, lng: 15.4667, order: 2, description: "Most photographed dune in Namibia, perfect for sunrise climb", activities: ["Dune climbing", "Sunrise photography"], duration: 90 },
      { name: "Sossusvlei Parking", lat: -24.7500, lng: 15.2833, order: 3, description: "End of the road, transfer to 4x4 shuttle or walk 5km to vlei", activities: ["4x4 shuttle", "Walking"], duration: 30 },
      { name: "Sossusvlei Pan", lat: -24.7275, lng: 15.2993, order: 4, description: "Iconic white clay pan surrounded by towering red dunes", activities: ["Photography", "Dune exploration"], duration: 60 },
      { name: "Deadvlei", lat: -24.7639, lng: 15.2928, order: 5, description: "Ancient clay pan with 900-year-old dead camel thorn trees", activities: ["Photography", "Big Daddy climb"], duration: 120 },
      { name: "Sesriem Canyon", lat: -24.4833, lng: 15.8000, order: 6, description: "30-meter deep canyon carved by the Tsauchab River", activities: ["Canyon walk", "Geology"], duration: 60 }
    ]
  },
  {
    name: "Swakopmund Adventure Day",
    slug: "swakopmund-adventure-day-1day",
    description: "Action-packed day in Namibia's adventure capital. From sandboarding to quad biking, experience the thrill of the Namib Desert meeting the Atlantic Ocean.",
    duration: 1,
    difficulty: "moderate",
    distance: 80,
    highlights: ["Sandboarding", "Quad Biking", "German Architecture", "Jetty Sunset", "Fresh Oysters"],
    bestSeason: "year-round",
    seasonNotes: "Coastal fog common in mornings. Afternoons usually clear. Winter can be chilly.",
    imageUrl: "/images/placeholder-route-swakopmund-adventure.jpg",
    stops: [
      { name: "Swakopmund Town Center", lat: -22.6792, lng: 14.5266, order: 1, description: "Start in the charming German colonial town center", activities: ["Breakfast", "Town orientation"], duration: 60 },
      { name: "Dune 7 Area", lat: -22.9167, lng: 14.5833, order: 2, description: "Highest dune in the area, perfect for sandboarding", activities: ["Sandboarding", "Quad biking"], duration: 180 },
      { name: "Walvis Bay Lagoon", lat: -22.9576, lng: 14.5053, order: 3, description: "RAMSAR wetland with flamingos and pelicans", activities: ["Bird watching", "Photography"], duration: 60 },
      { name: "Oyster Farm", lat: -22.9400, lng: 14.5100, order: 4, description: "Fresh Namibian oysters straight from the Atlantic", activities: ["Oyster tasting", "Lunch"], duration: 90 },
      { name: "Swakopmund Jetty", lat: -22.6833, lng: 14.5167, order: 5, description: "Historic wooden jetty, perfect for sunset views", activities: ["Sunset viewing", "Photography"], duration: 60 },
      { name: "The Tug Restaurant", lat: -22.6850, lng: 14.5180, order: 6, description: "Iconic restaurant on the beach serving fresh seafood", activities: ["Dinner", "Seafood"], duration: 120 }
    ]
  },

  // 3-DAY TOURS
  {
    name: "Sossusvlei Express",
    slug: "sossusvlei-express-3day",
    description: "The perfect short escape to Namibia's most iconic landscape. Three days of desert magic, from towering red dunes to star-filled skies.",
    duration: 3,
    difficulty: "moderate",
    distance: 700,
    highlights: ["Sossusvlei Dunes", "Deadvlei", "Dune 45 Sunrise", "Sesriem Canyon", "Desert Stargazing"],
    bestSeason: "dry",
    seasonNotes: "Best April-October for comfortable temperatures. Book accommodation in advance for peak season.",
    imageUrl: "/images/placeholder-route-sossusvlei-express.jpg",
    stops: [
      { name: "Windhoek", lat: -22.5609, lng: 17.0658, order: 1, description: "Day 1: Depart early morning from Namibia's capital", activities: ["Early departure", "Scenic drive"], duration: 60 },
      { name: "Solitaire", lat: -23.8833, lng: 15.9167, order: 2, description: "Quirky desert outpost famous for apple pie", activities: ["Apple pie stop", "Photography"], duration: 45 },
      { name: "Sesriem", lat: -24.4833, lng: 15.8333, order: 3, description: "Day 1 evening: Base camp near Sossusvlei", activities: ["Check-in", "Sesriem Canyon walk"], duration: 120 },
      { name: "Dune 45", lat: -24.7275, lng: 15.4667, order: 4, description: "Day 2: Pre-dawn climb for spectacular sunrise", activities: ["Sunrise climb", "Photography"], duration: 120 },
      { name: "Sossusvlei & Deadvlei", lat: -24.7639, lng: 15.2928, order: 5, description: "Day 2: Full exploration of the iconic dunes and pans", activities: ["Dune climbing", "Photography", "Big Daddy"], duration: 300 },
      { name: "NamibRand Nature Reserve", lat: -25.0000, lng: 15.9500, order: 6, description: "Day 2 evening: Stargazing in Africa's first Dark Sky Reserve", activities: ["Stargazing", "Night photography"], duration: 120 },
      { name: "Return to Windhoek", lat: -22.5609, lng: 17.0658, order: 7, description: "Day 3: Scenic return via different route", activities: ["Scenic drive", "Photo stops"], duration: 300 }
    ]
  },
  {
    name: "Etosha Quick Safari",
    slug: "etosha-quick-safari-3day",
    description: "Immerse yourself in Africa's premier wildlife destination. Three days of incredible game viewing around Etosha's legendary waterholes.",
    duration: 3,
    difficulty: "easy",
    distance: 900,
    highlights: ["Big Five", "Etosha Pan", "Waterhole Game Viewing", "Okaukuejo", "Halali"],
    bestSeason: "dry",
    seasonNotes: "Best May-October when animals concentrate at waterholes. Green season (Nov-Apr) offers lush landscapes and baby animals.",
    imageUrl: "/images/placeholder-route-etosha-quick.jpg",
    stops: [
      { name: "Windhoek", lat: -22.5609, lng: 17.0658, order: 1, description: "Day 1: Early departure north", activities: ["Early start"], duration: 30 },
      { name: "Okahandja Craft Market", lat: -21.9833, lng: 16.9167, order: 2, description: "Largest wood carving market in Namibia", activities: ["Shopping", "Crafts"], duration: 45 },
      { name: "Anderson Gate (Etosha South)", lat: -19.0500, lng: 15.9000, order: 3, description: "Day 1: Enter Etosha National Park", activities: ["Park entry", "First game drive"], duration: 30 },
      { name: "Okaukuejo Camp", lat: -19.1833, lng: 15.9167, order: 4, description: "Day 1-2: Famous floodlit waterhole with rhino sightings", activities: ["Night waterhole viewing", "Accommodation"], duration: 720 },
      { name: "Etosha Pan Viewpoint", lat: -18.8000, lng: 16.2500, order: 5, description: "Day 2: Vast salt pan stretching to the horizon", activities: ["Photography", "Wildlife viewing"], duration: 60 },
      { name: "Halali Camp", lat: -19.0333, lng: 16.4667, order: 6, description: "Day 2: Central camp with excellent waterhole", activities: ["Game drives", "Waterhole viewing"], duration: 480 },
      { name: "Von Lindequist Gate (East)", lat: -18.8167, lng: 17.0500, order: 7, description: "Day 3: Exit via eastern gate", activities: ["Morning game drive", "Exit"], duration: 180 },
      { name: "Return to Windhoek", lat: -22.5609, lng: 17.0658, order: 8, description: "Day 3: Return via Tsumeb or direct route", activities: ["Scenic drive"], duration: 240 }
    ]
  },

  // 5-DAY TOURS
  {
    name: "Southern Namibia Explorer",
    slug: "southern-namibia-explorer-5day",
    description: "Discover the dramatic landscapes of southern Namibia, from the world's second-largest canyon to ghost towns and the wild Atlantic coast.",
    duration: 5,
    difficulty: "moderate",
    distance: 1400,
    highlights: ["Fish River Canyon", "Kolmanskop Ghost Town", "Lüderitz", "Quiver Tree Forest", "Wild Horses"],
    bestSeason: "dry",
    seasonNotes: "Best March-October. Summer extremely hot in canyon area. Fish River hiking only May-September.",
    imageUrl: "/images/placeholder-route-southern-namibia.jpg",
    stops: [
      { name: "Windhoek", lat: -22.5609, lng: 17.0658, order: 1, description: "Day 1: Depart south through the highlands", activities: ["Early departure"], duration: 30 },
      { name: "Keetmanshoop", lat: -26.5833, lng: 18.1333, order: 2, description: "Day 1: Gateway to the south", activities: ["Lunch stop", "Supplies"], duration: 60 },
      { name: "Quiver Tree Forest", lat: -26.5000, lng: 18.2333, order: 3, description: "Day 1: Ancient aloe trees and Giant's Playground rock formations", activities: ["Photography", "Sunset"], duration: 120 },
      { name: "Fish River Canyon", lat: -27.5500, lng: 17.5833, order: 4, description: "Day 2: World's second-largest canyon, 160km long, 550m deep", activities: ["Viewpoints", "Photography", "Short hikes"], duration: 240 },
      { name: "Ai-Ais Hot Springs", lat: -27.9167, lng: 17.4833, order: 5, description: "Day 2: Natural hot springs at canyon's end", activities: ["Hot springs", "Relaxation"], duration: 180 },
      { name: "Lüderitz", lat: -26.6481, lng: 15.1594, order: 6, description: "Day 3: German colonial town on wild Atlantic coast", activities: ["Town tour", "Seafood"], duration: 240 },
      { name: "Kolmanskop", lat: -26.7000, lng: 15.2333, order: 7, description: "Day 3: Abandoned diamond mining town being reclaimed by desert", activities: ["Ghost town tour", "Photography"], duration: 120 },
      { name: "Wild Horses of Aus", lat: -26.6667, lng: 16.2500, order: 8, description: "Day 4: Feral horses surviving in the desert since WWI", activities: ["Wildlife viewing", "Photography"], duration: 90 },
      { name: "Sossusvlei", lat: -24.7275, lng: 15.2993, order: 9, description: "Day 4-5: Iconic red dunes", activities: ["Dune climbing", "Deadvlei"], duration: 480 },
      { name: "Return to Windhoek", lat: -22.5609, lng: 17.0658, order: 10, description: "Day 5: Return via scenic route", activities: ["Scenic drive"], duration: 300 }
    ]
  },

  // 7-DAY TOURS
  {
    name: "Classic Namibia Highlights",
    slug: "classic-namibia-highlights-7day",
    description: "The essential Namibia experience covering the country's most iconic destinations. Perfect for first-time visitors wanting to see the best of Namibia.",
    duration: 7,
    difficulty: "moderate",
    distance: 1800,
    highlights: ["Sossusvlei", "Swakopmund", "Damaraland", "Etosha", "Desert Elephants"],
    bestSeason: "dry",
    seasonNotes: "Best May-October. Book accommodation 3-6 months ahead for peak season (July-August).",
    imageUrl: "/images/placeholder-route-classic-7day.jpg",
    stops: [
      { name: "Windhoek", lat: -22.5609, lng: 17.0658, order: 1, description: "Day 1: Explore capital, prepare for adventure", activities: ["City tour", "Supplies"], duration: 180 },
      { name: "Sossusvlei", lat: -24.7275, lng: 15.2993, order: 2, description: "Day 2-3: World's highest sand dunes", activities: ["Dune 45 sunrise", "Deadvlei", "Big Daddy"], duration: 960 },
      { name: "Swakopmund", lat: -22.6792, lng: 14.5266, order: 3, description: "Day 4: Coastal adventure town", activities: ["Adventure activities", "German architecture", "Seafood"], duration: 480 },
      { name: "Cape Cross", lat: -21.7833, lng: 13.9500, order: 4, description: "Day 5: Largest Cape fur seal colony", activities: ["Seal colony", "Photography"], duration: 90 },
      { name: "Twyfelfontein", lat: -20.5833, lng: 14.3667, order: 5, description: "Day 5: UNESCO World Heritage rock engravings", activities: ["Rock art tour", "Organ Pipes"], duration: 180 },
      { name: "Damaraland", lat: -20.4167, lng: 14.5000, order: 6, description: "Day 5: Desert-adapted elephant tracking", activities: ["Elephant tracking", "Scenic landscapes"], duration: 240 },
      { name: "Etosha National Park", lat: -19.1833, lng: 15.9167, order: 7, description: "Day 6-7: Premier wildlife destination", activities: ["Game drives", "Waterhole viewing", "Big Five"], duration: 960 },
      { name: "Return to Windhoek", lat: -22.5609, lng: 17.0658, order: 8, description: "Day 7: Return via scenic route", activities: ["Final game drive", "Return journey"], duration: 240 }
    ]
  },

  // 10-DAY TOURS
  {
    name: "Complete Namibia Experience",
    slug: "complete-namibia-experience-10day",
    description: "The definitive Namibia road trip covering all major highlights with time to truly experience each destination. The most popular itinerary for good reason.",
    duration: 10,
    difficulty: "moderate",
    distance: 2500,
    highlights: ["Sossusvlei", "Swakopmund", "Skeleton Coast", "Damaraland", "Etosha", "Waterberg"],
    bestSeason: "dry",
    seasonNotes: "Best May-October. This is the classic route - book well in advance for peak season.",
    imageUrl: "/images/placeholder-route-complete-10day.jpg",
    stops: [
      { name: "Windhoek", lat: -22.5609, lng: 17.0658, order: 1, description: "Day 1: Arrive and explore the capital", activities: ["City orientation", "Craft markets"], duration: 180 },
      { name: "Sossusvlei/Sesriem", lat: -24.4833, lng: 15.8333, order: 2, description: "Day 2-3: Iconic red dunes of the Namib", activities: ["Dune 45", "Deadvlei", "Sesriem Canyon"], duration: 960 },
      { name: "Swakopmund", lat: -22.6792, lng: 14.5266, order: 3, description: "Day 4-5: Adventure capital on the coast", activities: ["Sandboarding", "Quad biking", "Town exploration"], duration: 960 },
      { name: "Cape Cross", lat: -21.7833, lng: 13.9500, order: 4, description: "Day 6: Massive seal colony", activities: ["Seal viewing", "Photography"], duration: 90 },
      { name: "Skeleton Coast", lat: -19.8333, lng: 12.9500, order: 5, description: "Day 6: Shipwrecks and desolate beauty", activities: ["Scenic drive", "Shipwreck viewing"], duration: 180 },
      { name: "Twyfelfontein", lat: -20.5833, lng: 14.3667, order: 6, description: "Day 6: Ancient rock engravings", activities: ["UNESCO site tour"], duration: 120 },
      { name: "Damaraland", lat: -20.4167, lng: 14.5000, order: 7, description: "Day 7: Desert elephants and dramatic landscapes", activities: ["Elephant tracking", "Scenic drives"], duration: 480 },
      { name: "Etosha (Okaukuejo)", lat: -19.1833, lng: 15.9167, order: 8, description: "Day 8: Western Etosha, famous waterhole", activities: ["Game drives", "Night waterhole"], duration: 480 },
      { name: "Etosha (Halali/Namutoni)", lat: -18.8167, lng: 17.0500, order: 9, description: "Day 9: Eastern Etosha exploration", activities: ["Full day safari", "Pan viewpoints"], duration: 480 },
      { name: "Waterberg Plateau", lat: -20.4167, lng: 17.2333, order: 10, description: "Day 10: Table mountain with rare species", activities: ["Hiking", "Rhino tracking"], duration: 240 },
      { name: "Return to Windhoek", lat: -22.5609, lng: 17.0658, order: 11, description: "Day 10: Final stretch home", activities: ["Scenic drive", "Departure"], duration: 180 }
    ]
  },

  // 14-DAY TOURS
  {
    name: "Ultimate Namibia Adventure",
    slug: "ultimate-namibia-adventure-14day",
    description: "Two weeks of extraordinary experiences across Namibia's diverse landscapes. From the world's oldest desert to abundant wildlife, this is Namibia at its finest.",
    duration: 14,
    difficulty: "moderate",
    distance: 3200,
    highlights: ["Fish River Canyon", "Sossusvlei", "Skeleton Coast", "Damaraland", "Etosha", "Himba Villages"],
    bestSeason: "dry",
    seasonNotes: "Best May-October. Allows for relaxed pace and deeper exploration of each region.",
    imageUrl: "/images/placeholder-route-ultimate-14day.jpg",
    stops: [
      { name: "Windhoek", lat: -22.5609, lng: 17.0658, order: 1, description: "Day 1: Capital city exploration", activities: ["City tour", "Museums"], duration: 240 },
      { name: "Kalahari Desert", lat: -24.0000, lng: 18.5000, order: 2, description: "Day 2: Red dunes and wildlife", activities: ["Game drive", "Sundowner"], duration: 480 },
      { name: "Fish River Canyon", lat: -27.5500, lng: 17.5833, order: 3, description: "Day 3-4: Second largest canyon on Earth", activities: ["Viewpoints", "Hiking", "Hot springs"], duration: 720 },
      { name: "Lüderitz & Kolmanskop", lat: -26.6481, lng: 15.1594, order: 4, description: "Day 5: Ghost town and coastal charm", activities: ["Ghost town tour", "Seafood"], duration: 480 },
      { name: "Sossusvlei", lat: -24.7275, lng: 15.2993, order: 5, description: "Day 6-7: Iconic Namib dunes", activities: ["Sunrise climbs", "Deadvlei", "Stargazing"], duration: 720 },
      { name: "Swakopmund", lat: -22.6792, lng: 14.5266, order: 6, description: "Day 8-9: Adventure and relaxation", activities: ["Activities", "Rest day option"], duration: 720 },
      { name: "Skeleton Coast", lat: -19.8333, lng: 12.9500, order: 7, description: "Day 10: Shipwrecks and seals", activities: ["Scenic drive", "Cape Cross"], duration: 360 },
      { name: "Damaraland", lat: -20.4167, lng: 14.5000, order: 8, description: "Day 10-11: Desert elephants, rock art", activities: ["Twyfelfontein", "Elephant tracking"], duration: 480 },
      { name: "Himba Village", lat: -18.0500, lng: 13.8333, order: 9, description: "Day 11: Cultural encounter with Himba people", activities: ["Cultural visit", "Photography"], duration: 180 },
      { name: "Etosha National Park", lat: -19.1833, lng: 15.9167, order: 10, description: "Day 12-14: Extended safari experience", activities: ["Game drives", "All camps", "Night viewing"], duration: 1200 },
      { name: "Return to Windhoek", lat: -22.5609, lng: 17.0658, order: 11, description: "Day 14: Final journey home", activities: ["Scenic return"], duration: 240 }
    ]
  },

  // 21-DAY TOURS
  {
    name: "Grand Namibia Discovery",
    slug: "grand-namibia-discovery-21day",
    description: "Three weeks to discover every corner of Namibia, including the remote Caprivi Strip and Kaokoland. For those who want to see it all.",
    duration: 21,
    difficulty: "challenging",
    distance: 4500,
    highlights: ["All Major Destinations", "Caprivi Strip", "Kaokoland", "Epupa Falls", "Victoria Falls Option"],
    bestSeason: "dry",
    seasonNotes: "Best May-September. Caprivi best in dry season. Some roads require 4x4.",
    imageUrl: "/images/placeholder-route-grand-21day.jpg",
    stops: [
      { name: "Windhoek", lat: -22.5609, lng: 17.0658, order: 1, description: "Day 1: Start your grand adventure", activities: ["Preparation", "City tour"], duration: 240 },
      { name: "Kalahari", lat: -24.0000, lng: 18.5000, order: 2, description: "Day 2: Red Kalahari dunes", activities: ["Game drive", "Bushman experience"], duration: 480 },
      { name: "Fish River Canyon", lat: -27.5500, lng: 17.5833, order: 3, description: "Day 3-4: Canyon exploration", activities: ["Hiking", "Photography"], duration: 720 },
      { name: "Lüderitz", lat: -26.6481, lng: 15.1594, order: 4, description: "Day 5: Coastal town and ghost town", activities: ["Kolmanskop", "Penguins"], duration: 480 },
      { name: "Sossusvlei", lat: -24.7275, lng: 15.2993, order: 5, description: "Day 6-7: Namib Desert highlights", activities: ["All dune experiences"], duration: 720 },
      { name: "Swakopmund", lat: -22.6792, lng: 14.5266, order: 6, description: "Day 8-9: Coast and adventure", activities: ["Activities", "Relaxation"], duration: 720 },
      { name: "Skeleton Coast", lat: -19.8333, lng: 12.9500, order: 7, description: "Day 10: Remote coastline", activities: ["Shipwrecks", "Seals"], duration: 360 },
      { name: "Damaraland", lat: -20.4167, lng: 14.5000, order: 8, description: "Day 11: Rock art and elephants", activities: ["Twyfelfontein", "Tracking"], duration: 480 },
      { name: "Kaokoland", lat: -18.0000, lng: 13.5000, order: 9, description: "Day 12-13: Remote wilderness", activities: ["4x4 adventure", "Himba culture"], duration: 720 },
      { name: "Epupa Falls", lat: -17.0000, lng: 13.2500, order: 10, description: "Day 14: Stunning waterfalls on Kunene River", activities: ["Waterfalls", "Crocodiles"], duration: 480 },
      { name: "Etosha West", lat: -19.1833, lng: 15.9167, order: 11, description: "Day 15-16: Western Etosha safari", activities: ["Game drives"], duration: 720 },
      { name: "Etosha East", lat: -18.8167, lng: 17.0500, order: 12, description: "Day 17: Eastern Etosha", activities: ["Different ecosystems"], duration: 480 },
      { name: "Caprivi Strip", lat: -18.0000, lng: 21.0000, order: 13, description: "Day 18-19: Tropical Namibia", activities: ["River safaris", "Birdwatching"], duration: 720 },
      { name: "Waterberg", lat: -20.4167, lng: 17.2333, order: 14, description: "Day 20: Plateau hiking", activities: ["Hiking", "Rhinos"], duration: 360 },
      { name: "Return to Windhoek", lat: -22.5609, lng: 17.0658, order: 15, description: "Day 21: Journey's end", activities: ["Final drive", "Departure"], duration: 240 }
    ]
  }
];

async function seedRealRoutes() {
  console.log("Seeding real Namibia routes...");
  
  // Clear existing routes
  await db.delete(routeStops);
  await db.delete(routes);
  console.log("Cleared existing routes");

  for (const route of realRoutes) {
    // Insert route
    const [result] = await db.insert(routes).values({
      name: route.name,
      slug: route.slug,
      description: route.description,
      duration: route.duration,
      difficulty: route.difficulty as "easy" | "moderate" | "challenging",
      distance: route.distance,
      highlights: JSON.stringify(route.highlights),
      bestSeason: route.bestSeason as "year-round" | "dry" | "wet",
      seasonNotes: route.seasonNotes,
      imageUrl: route.imageUrl,
      isActive: true,
      isFeatured: route.duration <= 7
    });

    const routeId = result.insertId;
    console.log(`Created route: ${route.name} (ID: ${routeId})`);

    // Insert stops
    for (const stop of route.stops) {
      await db.insert(routeStops).values({
        routeId: Number(routeId),
        name: stop.name,
        description: stop.description,
        latitude: stop.lat.toString(),
        longitude: stop.lng.toString(),
        dayNumber: stop.order, // Use order as day number for simplicity
        stopOrder: stop.order,
        activities: JSON.stringify(stop.activities),
        duration: stop.duration
      });
    }
    console.log(`  Added ${route.stops.length} stops`);
  }

  console.log(`\\nSeeded ${realRoutes.length} routes with detailed stops and coordinates`);
  process.exit(0);
}

seedRealRoutes().catch(console.error);

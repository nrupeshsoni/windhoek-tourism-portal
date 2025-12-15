import { drizzle } from "drizzle-orm/mysql2";
import { routes, routeStops } from "./drizzle/schema";

const db = drizzle(process.env.DATABASE_URL!);

const curatedRoutes = [
  // 1-Day Routes
  {
    name: "Windhoek City Discovery",
    slug: "windhoek-city-discovery",
    duration: 1,
    difficulty: "easy",
    shortDescription: "Explore Namibia's vibrant capital in a day",
    description: "Discover the charm of Windhoek, from the historic Christuskirche to the bustling craft markets. This easy day tour takes you through the city's German colonial architecture, local breweries, and cultural highlights.",
    startLocation: "Windhoek",
    endLocation: "Windhoek",
    distance: 25,
    highlights: JSON.stringify(["Christuskirche", "Independence Memorial Museum", "Craft Centre", "Joe's Beerhouse"]),
    bestTimeToVisit: "Year-round, best April-October",
    coverImage: "/images/namibia-desert.jpg",
    isFeatured: true,
    isActive: true,
    stops: [
      { name: "Christuskirche", dayNumber: 1, stopOrder: 1, latitude: "-22.5700", longitude: "17.0836", duration: "1 hour", description: "Iconic Lutheran church built in 1910, blending neo-Gothic and Art Nouveau styles", activities: JSON.stringify(["Photography", "Historical tour"]) },
      { name: "Independence Memorial Museum", dayNumber: 1, stopOrder: 2, latitude: "-22.5692", longitude: "17.0825", duration: "2 hours", description: "Learn about Namibia's struggle for independence", activities: JSON.stringify(["Museum tour", "Historical exhibits"]) },
      { name: "Namibia Craft Centre", dayNumber: 1, stopOrder: 3, latitude: "-22.5588", longitude: "17.0722", duration: "1.5 hours", description: "Browse authentic Namibian crafts and souvenirs", activities: JSON.stringify(["Shopping", "Local crafts"]) },
      { name: "Joe's Beerhouse", dayNumber: 1, stopOrder: 4, latitude: "-22.5647", longitude: "17.0789", duration: "2 hours", description: "Famous restaurant with game meat and local cuisine", activities: JSON.stringify(["Dinner", "Local cuisine", "Live music"]) },
    ]
  },
  {
    name: "Swakopmund Adventure Day",
    slug: "swakopmund-adventure-day",
    duration: 1,
    difficulty: "moderate",
    shortDescription: "Adrenaline-packed day in the adventure capital",
    description: "Experience the thrill of Swakopmund with sandboarding on massive dunes, quad biking through the desert, and ending with a sunset dolphin cruise.",
    startLocation: "Swakopmund",
    endLocation: "Swakopmund",
    distance: 80,
    highlights: JSON.stringify(["Sandboarding", "Quad Biking", "Dolphin Cruise", "German Architecture"]),
    bestTimeToVisit: "Year-round",
    coverImage: "/images/namibia-adventure.jpg",
    isFeatured: true,
    isActive: true,
    stops: [
      { name: "Dune 7 Sandboarding", dayNumber: 1, stopOrder: 1, latitude: "-22.8833", longitude: "14.5167", duration: "3 hours", description: "Sandboard down the famous Dune 7, one of the highest dunes in the area", activities: JSON.stringify(["Sandboarding", "Photography", "Dune climbing"]) },
      { name: "Quad Bike Desert Tour", dayNumber: 1, stopOrder: 2, latitude: "-22.6833", longitude: "14.5333", duration: "2 hours", description: "Explore the Namib Desert on quad bikes", activities: JSON.stringify(["Quad biking", "Desert exploration"]) },
      { name: "Walvis Bay Dolphin Cruise", dayNumber: 1, stopOrder: 3, latitude: "-22.9575", longitude: "14.5053", duration: "3 hours", description: "Sunset cruise with dolphins, seals, and pelicans", activities: JSON.stringify(["Dolphin watching", "Seal colony", "Oyster tasting", "Sunset views"]) },
    ]
  },
  // 3-Day Routes
  {
    name: "Sossusvlei Desert Explorer",
    slug: "sossusvlei-desert-explorer",
    duration: 3,
    difficulty: "moderate",
    shortDescription: "Iconic red dunes and desert landscapes",
    description: "Journey into the heart of the Namib Desert to witness the world's tallest sand dunes at Sossusvlei. Climb Big Daddy, explore Deadvlei's ancient camelthorn trees, and experience the magic of Sesriem Canyon.",
    startLocation: "Windhoek",
    endLocation: "Windhoek",
    distance: 700,
    highlights: JSON.stringify(["Sossusvlei", "Deadvlei", "Big Daddy Dune", "Sesriem Canyon", "Stargazing"]),
    bestTimeToVisit: "April-October (dry season)",
    coverImage: "/images/namibia-dunes.jpg",
    isFeatured: true,
    isActive: true,
    stops: [
      { name: "Windhoek Departure", dayNumber: 1, stopOrder: 1, latitude: "-22.5609", longitude: "17.0658", duration: "30 min", description: "Start your journey from Namibia's capital", activities: JSON.stringify(["Departure"]) },
      { name: "Solitaire", dayNumber: 1, stopOrder: 2, latitude: "-23.8917", longitude: "16.0083", duration: "1 hour", description: "Famous desert outpost with legendary apple pie", activities: JSON.stringify(["Apple pie", "Photography", "Fuel stop"]) },
      { name: "Sesriem Lodge", dayNumber: 1, stopOrder: 3, latitude: "-24.4833", longitude: "15.8333", duration: "Overnight", description: "Rest at the gateway to Sossusvlei", activities: JSON.stringify(["Check-in", "Sunset views", "Stargazing"]) },
      { name: "Sossusvlei", dayNumber: 2, stopOrder: 4, latitude: "-24.7333", longitude: "15.2833", duration: "4 hours", description: "Explore the iconic red dunes at sunrise", activities: JSON.stringify(["Dune climbing", "Photography", "Sunrise views"]) },
      { name: "Deadvlei", dayNumber: 2, stopOrder: 5, latitude: "-24.7500", longitude: "15.2917", duration: "2 hours", description: "Walk among ancient camelthorn trees in a white clay pan", activities: JSON.stringify(["Photography", "Walking", "Nature"]) },
      { name: "Big Daddy Dune", dayNumber: 2, stopOrder: 6, latitude: "-24.7583", longitude: "15.2833", duration: "3 hours", description: "Climb one of the world's tallest dunes (325m)", activities: JSON.stringify(["Dune climbing", "Panoramic views", "Photography"]) },
      { name: "Sesriem Canyon", dayNumber: 3, stopOrder: 7, latitude: "-24.4833", longitude: "15.8167", duration: "1.5 hours", description: "Explore the 30-meter deep canyon carved by the Tsauchab River", activities: JSON.stringify(["Canyon walk", "Geology", "Photography"]) },
      { name: "Return to Windhoek", dayNumber: 3, stopOrder: 8, latitude: "-22.5609", longitude: "17.0658", duration: "5 hours", description: "Scenic drive back through the Khomas Hochland", activities: JSON.stringify(["Scenic drive", "Wildlife spotting"]) },
    ]
  },
  // 5-Day Routes
  {
    name: "Etosha Wildlife Safari",
    slug: "etosha-wildlife-safari",
    duration: 5,
    difficulty: "easy",
    shortDescription: "Ultimate wildlife experience in Etosha National Park",
    description: "Immerse yourself in one of Africa's greatest wildlife sanctuaries. Etosha's vast salt pan and surrounding waterholes attract incredible concentrations of elephants, lions, rhinos, and countless other species.",
    startLocation: "Windhoek",
    endLocation: "Windhoek",
    distance: 900,
    highlights: JSON.stringify(["Big Five", "Etosha Pan", "Waterhole Game Viewing", "Okaukuejo", "Halali"]),
    bestTimeToVisit: "May-October (dry season for best wildlife viewing)",
    coverImage: "/images/namibia-etosha.jpg",
    isFeatured: true,
    isActive: true,
    stops: [
      { name: "Windhoek to Okahandja", dayNumber: 1, stopOrder: 1, latitude: "-21.9833", longitude: "16.9167", duration: "1 hour", description: "Stop at the famous woodcarvers market", activities: JSON.stringify(["Craft shopping", "Wood carvings"]) },
      { name: "Otjiwarongo", dayNumber: 1, stopOrder: 2, latitude: "-20.4639", longitude: "16.6478", duration: "1 hour", description: "Lunch stop in the heart of cattle country", activities: JSON.stringify(["Lunch", "Fuel"]) },
      { name: "Etosha - Anderson Gate", dayNumber: 1, stopOrder: 3, latitude: "-19.1667", longitude: "15.9167", duration: "30 min", description: "Enter Etosha National Park", activities: JSON.stringify(["Park entry", "Wildlife spotting begins"]) },
      { name: "Okaukuejo Camp", dayNumber: 1, stopOrder: 4, latitude: "-19.1833", longitude: "15.9167", duration: "Overnight", description: "Famous for its floodlit waterhole visited by rhinos at night", activities: JSON.stringify(["Check-in", "Waterhole viewing", "Night game viewing"]) },
      { name: "Okaukuejo to Halali", dayNumber: 2, stopOrder: 5, latitude: "-19.0333", longitude: "16.4667", duration: "Full day", description: "Game drive through central Etosha with multiple waterhole stops", activities: JSON.stringify(["Game drives", "Lion spotting", "Elephant herds", "Photography"]) },
      { name: "Halali Camp", dayNumber: 2, stopOrder: 6, latitude: "-19.0333", longitude: "16.4667", duration: "Overnight", description: "Scenic camp with excellent waterhole", activities: JSON.stringify(["Waterhole viewing", "Sunset", "Night sounds"]) },
      { name: "Halali to Namutoni", dayNumber: 3, stopOrder: 7, latitude: "-18.8167", longitude: "16.9333", duration: "Full day", description: "Eastern Etosha game drives, known for cheetah sightings", activities: JSON.stringify(["Game drives", "Cheetah spotting", "Bird watching"]) },
      { name: "Namutoni Fort", dayNumber: 3, stopOrder: 8, latitude: "-18.8167", longitude: "16.9333", duration: "Overnight", description: "Historic German fort turned rest camp", activities: JSON.stringify(["Fort tour", "Waterhole", "History"]) },
      { name: "Full Day Etosha Exploration", dayNumber: 4, stopOrder: 9, latitude: "-18.9000", longitude: "16.5000", duration: "Full day", description: "Extended game drives to remote waterholes", activities: JSON.stringify(["Game drives", "Etosha Pan viewpoint", "Wildlife photography"]) },
      { name: "Return to Windhoek", dayNumber: 5, stopOrder: 10, latitude: "-22.5609", longitude: "17.0658", duration: "5 hours", description: "Scenic return journey with stops", activities: JSON.stringify(["Scenic drive", "Craft stops"]) },
    ]
  },
  // 7-Day Routes
  {
    name: "Classic Namibia Circuit",
    slug: "classic-namibia-circuit",
    duration: 7,
    difficulty: "moderate",
    shortDescription: "The essential Namibia experience",
    description: "This iconic route combines Namibia's greatest highlights: the towering dunes of Sossusvlei, the adventure capital Swakopmund, and the wildlife paradise of Etosha. Perfect for first-time visitors wanting to experience the best of Namibia.",
    startLocation: "Windhoek",
    endLocation: "Windhoek",
    distance: 1800,
    highlights: JSON.stringify(["Sossusvlei", "Swakopmund", "Etosha", "Skeleton Coast", "Twyfelfontein"]),
    bestTimeToVisit: "May-October",
    coverImage: "/images/namibia-sossusvlei.jpg",
    isFeatured: true,
    isActive: true,
    stops: [
      { name: "Windhoek", dayNumber: 1, stopOrder: 1, latitude: "-22.5609", longitude: "17.0658", duration: "Morning", description: "Depart the capital city", activities: JSON.stringify(["Departure"]) },
      { name: "Sossusvlei", dayNumber: 1, stopOrder: 2, latitude: "-24.7333", longitude: "15.2833", duration: "2 nights", description: "Explore the world's highest sand dunes", activities: JSON.stringify(["Dune climbing", "Deadvlei", "Sunrise photography"]) },
      { name: "Swakopmund", dayNumber: 3, stopOrder: 3, latitude: "-22.6833", longitude: "14.5333", duration: "2 nights", description: "Adventure activities and German colonial charm", activities: JSON.stringify(["Sandboarding", "Quad biking", "Dolphin cruise", "Town exploration"]) },
      { name: "Twyfelfontein", dayNumber: 5, stopOrder: 4, latitude: "-20.5917", longitude: "14.3750", duration: "1 night", description: "UNESCO World Heritage rock engravings", activities: JSON.stringify(["Rock art tour", "Petrified forest", "Organ pipes"]) },
      { name: "Etosha National Park", dayNumber: 6, stopOrder: 5, latitude: "-19.1833", longitude: "15.9167", duration: "2 nights", description: "Wildlife safari in Namibia's premier game park", activities: JSON.stringify(["Game drives", "Waterhole viewing", "Big Five"]) },
      { name: "Return to Windhoek", dayNumber: 7, stopOrder: 6, latitude: "-22.5609", longitude: "17.0658", duration: "Afternoon", description: "Return journey to the capital", activities: JSON.stringify(["Scenic drive", "Departure"]) },
    ]
  },
  // 10-Day Routes
  {
    name: "Northern Namibia Explorer",
    slug: "northern-namibia-explorer",
    duration: 10,
    difficulty: "moderate",
    shortDescription: "Discover the wild north including Kaokoland",
    description: "Venture into Namibia's remote northern regions, home to the Himba people and desert-adapted elephants. This route combines Etosha's wildlife with the rugged beauty of Damaraland and Kaokoland.",
    startLocation: "Windhoek",
    endLocation: "Windhoek",
    distance: 2200,
    highlights: JSON.stringify(["Himba Villages", "Desert Elephants", "Epupa Falls", "Etosha", "Damaraland"]),
    bestTimeToVisit: "May-October",
    coverImage: "/images/namibia-wildlife.jpg",
    isFeatured: true,
    isActive: true,
    stops: [
      { name: "Windhoek to Etosha", dayNumber: 1, stopOrder: 1, latitude: "-19.1833", longitude: "15.9167", duration: "1 night", description: "Drive north to Etosha", activities: JSON.stringify(["Scenic drive", "Evening game drive"]) },
      { name: "Etosha Safari", dayNumber: 2, stopOrder: 2, latitude: "-19.0333", longitude: "16.4667", duration: "2 nights", description: "Full safari experience", activities: JSON.stringify(["Game drives", "Waterhole viewing"]) },
      { name: "Damaraland", dayNumber: 4, stopOrder: 3, latitude: "-20.5917", longitude: "14.3750", duration: "2 nights", description: "Desert-adapted wildlife and rock art", activities: JSON.stringify(["Desert elephants", "Twyfelfontein", "Organ Pipes"]) },
      { name: "Kaokoland", dayNumber: 6, stopOrder: 4, latitude: "-17.0000", longitude: "13.2500", duration: "2 nights", description: "Remote wilderness and Himba culture", activities: JSON.stringify(["Himba village visit", "4x4 adventure", "Remote camping"]) },
      { name: "Epupa Falls", dayNumber: 8, stopOrder: 5, latitude: "-17.0000", longitude: "13.2500", duration: "1 night", description: "Stunning waterfalls on the Kunene River", activities: JSON.stringify(["Waterfall viewing", "Swimming", "Sunset"]) },
      { name: "Return via Ruacana", dayNumber: 9, stopOrder: 6, latitude: "-17.4000", longitude: "14.2167", duration: "Transit", description: "Journey south through Owamboland", activities: JSON.stringify(["Cultural stops", "Local markets"]) },
      { name: "Windhoek", dayNumber: 10, stopOrder: 7, latitude: "-22.5609", longitude: "17.0658", duration: "Arrival", description: "Return to the capital", activities: JSON.stringify(["Departure"]) },
    ]
  },
  // 14-Day Routes
  {
    name: "Ultimate Namibia Adventure",
    slug: "ultimate-namibia-adventure",
    duration: 14,
    difficulty: "challenging",
    shortDescription: "The complete Namibia experience from coast to desert",
    description: "This comprehensive journey covers all of Namibia's iconic destinations plus hidden gems. From the Skeleton Coast's shipwrecks to the Fish River Canyon's depths, experience the full diversity of this remarkable country.",
    startLocation: "Windhoek",
    endLocation: "Windhoek",
    distance: 3500,
    highlights: JSON.stringify(["Sossusvlei", "Skeleton Coast", "Etosha", "Fish River Canyon", "Lüderitz", "Kolmanskop"]),
    bestTimeToVisit: "April-October",
    coverImage: "/images/namibia-skeleton-coast.jpg",
    isFeatured: true,
    isActive: true,
    stops: [
      { name: "Windhoek", dayNumber: 1, stopOrder: 1, latitude: "-22.5609", longitude: "17.0658", duration: "Night", description: "Explore the capital", activities: JSON.stringify(["City tour", "Craft markets"]) },
      { name: "Kalahari Desert", dayNumber: 2, stopOrder: 2, latitude: "-24.0000", longitude: "18.0000", duration: "1 night", description: "Red dunes and Kalahari wildlife", activities: JSON.stringify(["Sundowner drive", "Stargazing"]) },
      { name: "Fish River Canyon", dayNumber: 3, stopOrder: 3, latitude: "-27.5500", longitude: "17.5500", duration: "2 nights", description: "Second largest canyon in the world", activities: JSON.stringify(["Canyon viewpoints", "Hiking", "Sunrise"]) },
      { name: "Lüderitz & Kolmanskop", dayNumber: 5, stopOrder: 4, latitude: "-26.6500", longitude: "15.1500", duration: "2 nights", description: "Ghost town and coastal charm", activities: JSON.stringify(["Ghost town tour", "Penguin colony", "German architecture"]) },
      { name: "Sossusvlei", dayNumber: 7, stopOrder: 5, latitude: "-24.7333", longitude: "15.2833", duration: "2 nights", description: "Iconic red dunes", activities: JSON.stringify(["Big Daddy climb", "Deadvlei", "Hot air balloon"]) },
      { name: "Swakopmund", dayNumber: 9, stopOrder: 6, latitude: "-22.6833", longitude: "14.5333", duration: "2 nights", description: "Adventure capital", activities: JSON.stringify(["Activities", "Town exploration"]) },
      { name: "Skeleton Coast", dayNumber: 11, stopOrder: 7, latitude: "-20.0000", longitude: "13.0000", duration: "1 night", description: "Shipwrecks and seal colonies", activities: JSON.stringify(["Seal colony", "Shipwreck viewing"]) },
      { name: "Etosha", dayNumber: 12, stopOrder: 8, latitude: "-19.1833", longitude: "15.9167", duration: "2 nights", description: "Premier wildlife destination", activities: JSON.stringify(["Game drives", "Waterhole viewing"]) },
      { name: "Windhoek", dayNumber: 14, stopOrder: 9, latitude: "-22.5609", longitude: "17.0658", duration: "Departure", description: "Return and departure", activities: JSON.stringify(["Departure"]) },
    ]
  },
  // 21-Day Route
  {
    name: "Grand Namibia Expedition",
    slug: "grand-namibia-expedition",
    duration: 21,
    difficulty: "challenging",
    shortDescription: "The definitive three-week Namibia journey",
    description: "For those with time to truly explore, this expedition covers every major region of Namibia. From the Caprivi Strip's waterways to the Skeleton Coast's desolation, experience the country's incredible diversity at a relaxed pace.",
    startLocation: "Windhoek",
    endLocation: "Windhoek",
    distance: 5000,
    highlights: JSON.stringify(["All Major Destinations", "Caprivi Strip", "Waterberg", "Spitzkoppe", "Remote Wilderness"]),
    bestTimeToVisit: "May-September",
    coverImage: "/images/namibia-landscape.jpg",
    isFeatured: true,
    isActive: true,
    stops: [
      { name: "Windhoek", dayNumber: 1, stopOrder: 1, latitude: "-22.5609", longitude: "17.0658", duration: "1 night", description: "Capital city exploration", activities: JSON.stringify(["City tour"]) },
      { name: "Waterberg Plateau", dayNumber: 2, stopOrder: 2, latitude: "-20.4167", longitude: "17.2500", duration: "2 nights", description: "Unique tabletop mountain ecosystem", activities: JSON.stringify(["Hiking", "Rhino tracking", "History"]) },
      { name: "Etosha (Western)", dayNumber: 4, stopOrder: 3, latitude: "-19.1833", longitude: "15.9167", duration: "3 nights", description: "Comprehensive Etosha safari", activities: JSON.stringify(["Game drives", "All camps"]) },
      { name: "Damaraland", dayNumber: 7, stopOrder: 4, latitude: "-20.5917", longitude: "14.3750", duration: "2 nights", description: "Desert elephants and rock art", activities: JSON.stringify(["Twyfelfontein", "Desert elephants"]) },
      { name: "Skeleton Coast", dayNumber: 9, stopOrder: 5, latitude: "-20.0000", longitude: "13.0000", duration: "2 nights", description: "Remote coastal wilderness", activities: JSON.stringify(["Shipwrecks", "Seals", "Fishing"]) },
      { name: "Swakopmund", dayNumber: 11, stopOrder: 6, latitude: "-22.6833", longitude: "14.5333", duration: "3 nights", description: "Rest and adventure", activities: JSON.stringify(["Activities", "Relaxation"]) },
      { name: "Sossusvlei", dayNumber: 14, stopOrder: 7, latitude: "-24.7333", longitude: "15.2833", duration: "3 nights", description: "Extended dune exploration", activities: JSON.stringify(["Multiple dune visits", "Balloon safari"]) },
      { name: "Fish River Canyon", dayNumber: 17, stopOrder: 8, latitude: "-27.5500", longitude: "17.5500", duration: "2 nights", description: "Canyon exploration", activities: JSON.stringify(["Hiking", "Viewpoints"]) },
      { name: "Kalahari", dayNumber: 19, stopOrder: 9, latitude: "-24.0000", longitude: "18.0000", duration: "2 nights", description: "Red dune finale", activities: JSON.stringify(["Bushman experience", "Wildlife"]) },
      { name: "Windhoek", dayNumber: 21, stopOrder: 10, latitude: "-22.5609", longitude: "17.0658", duration: "Departure", description: "Journey's end", activities: JSON.stringify(["Departure"]) },
    ]
  },
];

async function seedRoutes() {
  console.log("Seeding curated routes...\n");

  for (const routeData of curatedRoutes) {
    const { stops: routeStopsData, ...routeInfo } = routeData;

    try {
      // Insert route
      const [result] = await db.insert(routes).values(routeInfo);
      const routeId = (result as any).insertId;
      console.log(`✓ Created route: ${routeInfo.name} (${routeInfo.duration} days)`);

      // Insert stops
      for (const stop of routeStopsData) {
        await db.insert(routeStops).values({
          ...stop,
          routeId,
        });
      }
      console.log(`  → Added ${routeStopsData.length} stops`);
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        console.log(`⊘ Route already exists: ${routeInfo.name}`);
      } else {
        console.error(`✗ Error creating route ${routeInfo.name}:`, error.message);
      }
    }
  }

  console.log("\n✓ Route seeding complete!");
  process.exit(0);
}

seedRoutes();

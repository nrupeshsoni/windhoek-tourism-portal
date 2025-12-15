import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { routes, routeStops } from "./drizzle/schema";

const pool = mysql.createPool(process.env.DATABASE_URL!);
const db = drizzle(pool);

// Additional routes to reach 100 total (need 64 more)
const additionalRoutes = [
  // More 1-day tours (4 more to make 14 total)
  {
    name: "Rundu Cultural Experience",
    slug: "rundu-cultural-experience-1day",
    description: "Discover the vibrant Kavango culture along the Okavango River with traditional villages and craft markets.",
    duration: 1, difficulty: "easy", startLocation: "Rundu", endLocation: "Rundu",
    highlights: ["Kavango culture", "River views", "Craft markets", "Traditional villages"],
    bestTimeToVisit: "Year-round", seasonalInfo: "Green season offers lush landscapes.",
    imageUrl: "/images/placeholder-rundu.jpg",
    stops: [
      { name: "Rundu Town", lat: -17.9333, lng: 19.7667, description: "Start in Rundu", activities: ["Market visit", "Craft shopping"], dayNumber: 1, order: 1 },
      { name: "Kavango Village", lat: -17.9500, lng: 19.8000, description: "Traditional village visit", activities: ["Cultural experience", "Traditional dance"], dayNumber: 1, order: 2 },
      { name: "Okavango River", lat: -17.9167, lng: 19.7500, description: "River sunset cruise", activities: ["Boat cruise", "Bird watching"], dayNumber: 1, order: 3 },
    ]
  },
  {
    name: "Opuwo Himba Discovery",
    slug: "opuwo-himba-discovery-1day",
    description: "Meet the iconic Himba people near Opuwo and learn about their traditional way of life.",
    duration: 1, difficulty: "easy", startLocation: "Opuwo", endLocation: "Opuwo",
    highlights: ["Himba culture", "Traditional dress", "Photography", "Local market"],
    bestTimeToVisit: "Year-round", seasonalInfo: "Dry season offers easier road access.",
    imageUrl: "/images/placeholder-opuwo.jpg",
    stops: [
      { name: "Opuwo Market", lat: -18.0500, lng: 13.8333, description: "Local market experience", activities: ["Market visit", "Local interaction"], dayNumber: 1, order: 1 },
      { name: "Himba Village", lat: -18.0333, lng: 13.8167, description: "Traditional Himba village", activities: ["Cultural tour", "Photography"], dayNumber: 1, order: 2 },
    ]
  },
  {
    name: "Walvis Bay Flamingo Lagoon",
    slug: "walvis-bay-flamingo-lagoon-1day",
    description: "Bird watching paradise at Walvis Bay lagoon with thousands of flamingos and diverse shorebirds.",
    duration: 1, difficulty: "easy", startLocation: "Walvis Bay", endLocation: "Walvis Bay",
    highlights: ["Flamingos", "Bird watching", "Lagoon walk", "Photography"],
    bestTimeToVisit: "Year-round", seasonalInfo: "Peak flamingo numbers October-March.",
    imageUrl: "/images/placeholder-walvis-flamingos.jpg",
    stops: [
      { name: "Walvis Bay Lagoon", lat: -22.9575, lng: 14.5053, description: "Main lagoon viewing", activities: ["Flamingo watching", "Photography"], dayNumber: 1, order: 1 },
      { name: "Salt Works", lat: -22.9700, lng: 14.5200, description: "Salt pans and birds", activities: ["Bird watching", "Scenic views"], dayNumber: 1, order: 2 },
      { name: "Kuiseb River Mouth", lat: -23.0000, lng: 14.4833, description: "River delta ecosystem", activities: ["Nature walk", "Bird watching"], dayNumber: 1, order: 3 },
    ]
  },
  {
    name: "Daan Viljoen Day Safari",
    slug: "daan-viljoen-day-safari-1day",
    description: "Easy day trip from Windhoek to Daan Viljoen Game Park for hiking and wildlife viewing.",
    duration: 1, difficulty: "easy", startLocation: "Windhoek", endLocation: "Windhoek",
    highlights: ["Game viewing", "Hiking trails", "Picnic spots", "Close to Windhoek"],
    bestTimeToVisit: "Year-round", seasonalInfo: "Green season offers beautiful vegetation.",
    imageUrl: "/images/placeholder-daan-viljoen.jpg",
    stops: [
      { name: "Daan Viljoen Gate", lat: -22.5000, lng: 17.0000, description: "Park entrance", activities: ["Check-in", "Trail selection"], dayNumber: 1, order: 1 },
      { name: "Hiking Trails", lat: -22.5167, lng: 16.9833, description: "Various trail options", activities: ["Hiking", "Wildlife spotting"], dayNumber: 1, order: 2 },
      { name: "Picnic Area", lat: -22.5083, lng: 16.9917, description: "Scenic lunch spot", activities: ["Picnic", "Bird watching"], dayNumber: 1, order: 3 },
    ]
  },

  // More 2-day tours (4 more to make 14 total)
  {
    name: "Ai-Ais Hot Springs Retreat",
    slug: "ai-ais-hot-springs-retreat-2day",
    description: "Relax at the natural hot springs of Ai-Ais at the southern end of Fish River Canyon.",
    duration: 2, difficulty: "easy", startLocation: "Ai-Ais", endLocation: "Ai-Ais",
    highlights: ["Hot springs", "Canyon views", "Relaxation", "Stargazing"],
    bestTimeToVisit: "April-October", seasonalInfo: "Resort closed December-March.",
    imageUrl: "/images/placeholder-ai-ais.jpg",
    stops: [
      { name: "Ai-Ais Resort", lat: -27.9167, lng: 17.5000, description: "Hot springs resort", activities: ["Hot springs", "Swimming"], dayNumber: 1, order: 1 },
      { name: "Canyon Viewpoint", lat: -27.8833, lng: 17.5167, description: "Southern canyon views", activities: ["Photography", "Short walks"], dayNumber: 1, order: 2 },
      { name: "Nature Trails", lat: -27.9000, lng: 17.4833, description: "Surrounding trails", activities: ["Hiking", "Bird watching"], dayNumber: 2, order: 3 },
    ]
  },
  {
    name: "Cape Cross & Skeleton Coast",
    slug: "cape-cross-skeleton-coast-2day",
    description: "Visit the massive Cape Cross seal colony and explore the mysterious Skeleton Coast.",
    duration: 2, difficulty: "moderate", startLocation: "Swakopmund", endLocation: "Swakopmund",
    highlights: ["Seal colony", "Shipwrecks", "Coastal scenery", "Photography"],
    bestTimeToVisit: "Year-round", seasonalInfo: "Fog common. Seals present year-round.",
    imageUrl: "/images/placeholder-cape-cross.jpg",
    stops: [
      { name: "Cape Cross", lat: -21.7833, lng: 13.9500, description: "Seal colony", activities: ["Seal viewing", "Photography"], dayNumber: 1, order: 1 },
      { name: "Skeleton Coast Gate", lat: -21.0000, lng: 13.5000, description: "Park entrance", activities: ["Shipwreck viewing", "Coastal drive"], dayNumber: 1, order: 2 },
      { name: "Mile 108", lat: -21.5000, lng: 13.7500, description: "Fishing spot", activities: ["Beach walk", "Fishing optional"], dayNumber: 2, order: 3 },
    ]
  },
  {
    name: "Erongo Mountains Escape",
    slug: "erongo-mountains-escape-2day",
    description: "Explore the ancient granite formations and San rock art of the Erongo Mountains.",
    duration: 2, difficulty: "moderate", startLocation: "Omaruru", endLocation: "Omaruru",
    highlights: ["Rock formations", "San rock art", "Wildlife", "Scenic views"],
    bestTimeToVisit: "Year-round", seasonalInfo: "Cooler months best for hiking.",
    imageUrl: "/images/placeholder-erongo.jpg",
    stops: [
      { name: "Erongo Lodge", lat: -21.6667, lng: 15.6667, description: "Mountain lodge", activities: ["Check-in", "Sundowner"], dayNumber: 1, order: 1 },
      { name: "Bull's Party", lat: -21.6833, lng: 15.6500, description: "Rock formation", activities: ["Photography", "Hiking"], dayNumber: 1, order: 2 },
      { name: "San Rock Art", lat: -21.6500, lng: 15.6833, description: "Ancient paintings", activities: ["Rock art tour", "History"], dayNumber: 2, order: 3 },
    ]
  },
  {
    name: "Naukluft Mountains Hiking",
    slug: "naukluft-mountains-hiking-2day",
    description: "Challenging hiking in the dramatic Naukluft Mountains with stunning canyon scenery.",
    duration: 2, difficulty: "challenging", startLocation: "Naukluft", endLocation: "Naukluft",
    highlights: ["Mountain hiking", "Canyon views", "Natural pools", "Wildlife"],
    bestTimeToVisit: "April-October", seasonalInfo: "Avoid summer heat. Water in pools varies.",
    imageUrl: "/images/placeholder-naukluft.jpg",
    stops: [
      { name: "Naukluft Camp", lat: -24.2667, lng: 16.2333, description: "Base camp", activities: ["Check-in", "Trail briefing"], dayNumber: 1, order: 1 },
      { name: "Waterkloof Trail", lat: -24.2833, lng: 16.2500, description: "Day hike", activities: ["Hiking", "Natural pools"], dayNumber: 1, order: 2 },
      { name: "Olive Trail", lat: -24.2500, lng: 16.2167, description: "Second day hike", activities: ["Hiking", "Wildlife"], dayNumber: 2, order: 3 },
    ]
  },

  // More 3-day tours (4 more to make 14 total)
  {
    name: "Zambezi Region Safari",
    slug: "zambezi-region-safari-3day",
    description: "Explore the lush Zambezi Region (Caprivi Strip) with its rivers, wildlife, and Victoria Falls access.",
    duration: 3, difficulty: "easy", startLocation: "Katima Mulilo", endLocation: "Katima Mulilo",
    highlights: ["River safaris", "Victoria Falls", "Bird watching", "Wetlands"],
    bestTimeToVisit: "May-October", seasonalInfo: "Dry season for wildlife. Green season for birds.",
    imageUrl: "/images/placeholder-zambezi.jpg",
    stops: [
      { name: "Katima Mulilo", lat: -17.5000, lng: 24.2667, description: "Starting point", activities: ["Orientation", "River cruise"], dayNumber: 1, order: 1 },
      { name: "Nkasa Rupara", lat: -18.4167, lng: 23.6667, description: "Wetland park", activities: ["Game drive", "Boat safari"], dayNumber: 2, order: 2 },
      { name: "Impalila Island", lat: -17.7833, lng: 25.2667, description: "Four rivers confluence", activities: ["Boat trip", "Bird watching"], dayNumber: 3, order: 3 },
    ]
  },
  {
    name: "Namib Desert Immersion",
    slug: "namib-desert-immersion-3day",
    description: "Deep immersion into the Namib Desert with desert camping and exploration.",
    duration: 3, difficulty: "moderate", startLocation: "Sesriem", endLocation: "Sesriem",
    highlights: ["Desert camping", "Dune exploration", "Stargazing", "Wildlife"],
    bestTimeToVisit: "Year-round", seasonalInfo: "Cooler months best. Hot summers.",
    imageUrl: "/images/placeholder-namib-immersion.jpg",
    stops: [
      { name: "Sesriem", lat: -24.4833, lng: 15.8333, description: "Base camp", activities: ["Setup", "Sunset drive"], dayNumber: 1, order: 1 },
      { name: "Sossusvlei", lat: -24.7333, lng: 15.2833, description: "Dune exploration", activities: ["Full day dunes", "Photography"], dayNumber: 2, order: 2 },
      { name: "NamibRand", lat: -25.0000, lng: 15.8333, description: "Private reserve", activities: ["Nature drive", "Stargazing"], dayNumber: 3, order: 3 },
    ]
  },
  {
    name: "Etosha & Waterberg Combo",
    slug: "etosha-waterberg-combo-3day",
    description: "Combine Etosha safari with the unique Waterberg Plateau ecosystem.",
    duration: 3, difficulty: "easy", startLocation: "Etosha", endLocation: "Waterberg",
    highlights: ["Big game", "Rare species", "Plateau hiking", "Bird watching"],
    bestTimeToVisit: "May-October", seasonalInfo: "Dry season for Etosha wildlife.",
    imageUrl: "/images/placeholder-etosha-waterberg.jpg",
    stops: [
      { name: "Etosha", lat: -19.1833, lng: 15.9167, description: "Safari", activities: ["Game drives", "Waterholes"], dayNumber: 1, order: 1 },
      { name: "Otjiwarongo", lat: -20.4667, lng: 16.6500, description: "Transit", activities: ["Lunch", "Shopping"], dayNumber: 2, order: 2 },
      { name: "Waterberg", lat: -20.4167, lng: 17.2500, description: "Plateau", activities: ["Game drive", "Hiking"], dayNumber: 3, order: 3 },
    ]
  },
  {
    name: "Kunene River Adventure",
    slug: "kunene-river-adventure-3day",
    description: "Adventure along the Kunene River with Epupa Falls and remote wilderness.",
    duration: 3, difficulty: "challenging", startLocation: "Opuwo", endLocation: "Opuwo",
    highlights: ["Epupa Falls", "Remote wilderness", "Himba culture", "River scenery"],
    bestTimeToVisit: "April-October", seasonalInfo: "Dry season for road access. 4x4 essential.",
    imageUrl: "/images/placeholder-kunene.jpg",
    stops: [
      { name: "Opuwo", lat: -18.0500, lng: 13.8333, description: "Starting point", activities: ["Supplies", "Himba visit"], dayNumber: 1, order: 1 },
      { name: "Epupa Falls", lat: -17.0000, lng: 13.2500, description: "Waterfall", activities: ["Falls viewing", "Swimming"], dayNumber: 2, order: 2 },
      { name: "Kunene River Camp", lat: -17.2500, lng: 13.1000, description: "River camp", activities: ["Rafting optional", "Bird watching"], dayNumber: 3, order: 3 },
    ]
  },

  // More 5-day tours (4 more to make 5 total)
  {
    name: "Southern Namibia Circuit",
    slug: "southern-namibia-circuit-5day",
    description: "Explore the dramatic landscapes of southern Namibia from Fish River Canyon to Lüderitz.",
    duration: 5, difficulty: "moderate", startLocation: "Windhoek", endLocation: "Windhoek",
    highlights: ["Fish River Canyon", "Kolmanskop", "Wild horses", "Quiver trees"],
    bestTimeToVisit: "April-October", seasonalInfo: "Cooler months best for canyon.",
    imageUrl: "/images/placeholder-southern-5day.jpg",
    stops: [
      { name: "Windhoek", lat: -22.5609, lng: 17.0836, description: "Start", activities: ["Departure"], dayNumber: 1, order: 1 },
      { name: "Keetmanshoop", lat: -26.5833, lng: 18.1333, description: "Quiver trees", activities: ["Quiver Tree Forest", "Giant's Playground"], dayNumber: 1, order: 2 },
      { name: "Fish River Canyon", lat: -27.5500, lng: 17.5500, description: "Canyon", activities: ["Viewpoints", "Photography"], dayNumber: 2, order: 3 },
      { name: "Lüderitz", lat: -26.6481, lng: 15.1591, description: "Coast", activities: ["Kolmanskop", "Town tour"], dayNumber: 3, order: 4 },
      { name: "Aus", lat: -26.6667, lng: 16.2500, description: "Wild horses", activities: ["Horse viewing"], dayNumber: 4, order: 5 },
      { name: "Windhoek", lat: -22.5609, lng: 17.0836, description: "Return", activities: ["End"], dayNumber: 5, order: 6 },
    ]
  },
  {
    name: "Northern Namibia Explorer",
    slug: "northern-namibia-explorer-5day",
    description: "Discover the cultural richness and wildlife of northern Namibia.",
    duration: 5, difficulty: "moderate", startLocation: "Windhoek", endLocation: "Windhoek",
    highlights: ["Etosha", "Himba culture", "Damaraland", "Rock art"],
    bestTimeToVisit: "May-October", seasonalInfo: "Dry season for wildlife and road access.",
    imageUrl: "/images/placeholder-northern-5day.jpg",
    stops: [
      { name: "Windhoek", lat: -22.5609, lng: 17.0836, description: "Start", activities: ["Departure"], dayNumber: 1, order: 1 },
      { name: "Etosha", lat: -19.1833, lng: 15.9167, description: "Safari", activities: ["Game drives"], dayNumber: 2, order: 2 },
      { name: "Damaraland", lat: -20.5833, lng: 14.3667, description: "Rock art", activities: ["Twyfelfontein", "Elephants"], dayNumber: 3, order: 3 },
      { name: "Kaokoland", lat: -18.0500, lng: 13.8333, description: "Himba", activities: ["Cultural visit"], dayNumber: 4, order: 4 },
      { name: "Windhoek", lat: -22.5609, lng: 17.0836, description: "Return", activities: ["End"], dayNumber: 5, order: 5 },
    ]
  },
  {
    name: "Coastal & Desert Adventure",
    slug: "coastal-desert-adventure-5day",
    description: "From the Atlantic coast to the Namib Desert - the best of both worlds.",
    duration: 5, difficulty: "moderate", startLocation: "Windhoek", endLocation: "Windhoek",
    highlights: ["Swakopmund", "Sossusvlei", "Marine life", "Desert dunes"],
    bestTimeToVisit: "Year-round", seasonalInfo: "Whale season July-November.",
    imageUrl: "/images/placeholder-coastal-desert-5day.jpg",
    stops: [
      { name: "Windhoek", lat: -22.5609, lng: 17.0836, description: "Start", activities: ["Departure"], dayNumber: 1, order: 1 },
      { name: "Swakopmund", lat: -22.6792, lng: 14.5266, description: "Coast", activities: ["Marine cruise", "Activities"], dayNumber: 2, order: 2 },
      { name: "Walvis Bay", lat: -22.9575, lng: 14.5053, description: "Lagoon", activities: ["Sandwich Harbour"], dayNumber: 3, order: 3 },
      { name: "Sossusvlei", lat: -24.7333, lng: 15.2833, description: "Dunes", activities: ["Dune climbing", "Deadvlei"], dayNumber: 4, order: 4 },
      { name: "Windhoek", lat: -22.5609, lng: 17.0836, description: "Return", activities: ["End"], dayNumber: 5, order: 5 },
    ]
  },
  {
    name: "Wildlife & Culture Safari",
    slug: "wildlife-culture-safari-5day",
    description: "Combine wildlife viewing with cultural experiences across central Namibia.",
    duration: 5, difficulty: "easy", startLocation: "Windhoek", endLocation: "Windhoek",
    highlights: ["Etosha", "Okonjima", "San culture", "Cheetah conservation"],
    bestTimeToVisit: "May-October", seasonalInfo: "Dry season for wildlife.",
    imageUrl: "/images/placeholder-wildlife-culture-5day.jpg",
    stops: [
      { name: "Windhoek", lat: -22.5609, lng: 17.0836, description: "Start", activities: ["Departure"], dayNumber: 1, order: 1 },
      { name: "Okonjima", lat: -21.0000, lng: 16.7167, description: "AfriCat", activities: ["Cheetah tracking", "Leopard viewing"], dayNumber: 2, order: 2 },
      { name: "Etosha", lat: -19.1833, lng: 15.9167, description: "Safari", activities: ["Game drives"], dayNumber: 3, order: 3 },
      { name: "Kalahari", lat: -24.6333, lng: 17.9667, description: "San culture", activities: ["Bush walk", "Traditional skills"], dayNumber: 4, order: 4 },
      { name: "Windhoek", lat: -22.5609, lng: 17.0836, description: "Return", activities: ["End"], dayNumber: 5, order: 5 },
    ]
  },

  // More 7-day tours (4 more to make 5 total)
  {
    name: "Namibia Highlights Extended",
    slug: "namibia-highlights-extended-7day",
    description: "Extended version of the classic highlights with more time at each destination.",
    duration: 7, difficulty: "moderate", startLocation: "Windhoek", endLocation: "Windhoek",
    highlights: ["Sossusvlei", "Swakopmund", "Damaraland", "Etosha"],
    bestTimeToVisit: "May-October", seasonalInfo: "Dry season for best experience.",
    imageUrl: "/images/placeholder-highlights-7day.jpg",
    stops: [
      { name: "Windhoek", lat: -22.5609, lng: 17.0836, description: "Start", activities: ["City tour"], dayNumber: 1, order: 1 },
      { name: "Sossusvlei", lat: -24.7333, lng: 15.2833, description: "Dunes", activities: ["2 days exploration"], dayNumber: 2, order: 2 },
      { name: "Swakopmund", lat: -22.6792, lng: 14.5266, description: "Coast", activities: ["Activities", "Marine cruise"], dayNumber: 4, order: 3 },
      { name: "Damaraland", lat: -20.5833, lng: 14.3667, description: "Rock art", activities: ["Twyfelfontein", "Elephants"], dayNumber: 5, order: 4 },
      { name: "Etosha", lat: -19.1833, lng: 15.9167, description: "Safari", activities: ["2 days safari"], dayNumber: 6, order: 5 },
      { name: "Windhoek", lat: -22.5609, lng: 17.0836, description: "Return", activities: ["End"], dayNumber: 7, order: 6 },
    ]
  },
  {
    name: "Namibia Photography Tour",
    slug: "namibia-photography-tour-7day",
    description: "Designed for photographers with optimal timing at each iconic location.",
    duration: 7, difficulty: "moderate", startLocation: "Windhoek", endLocation: "Windhoek",
    highlights: ["Golden hour shoots", "Iconic landscapes", "Wildlife", "Night skies"],
    bestTimeToVisit: "May-September", seasonalInfo: "Clear skies and good light.",
    imageUrl: "/images/placeholder-photography-7day.jpg",
    stops: [
      { name: "Windhoek", lat: -22.5609, lng: 17.0836, description: "Start", activities: ["Preparation"], dayNumber: 1, order: 1 },
      { name: "Sossusvlei", lat: -24.7333, lng: 15.2833, description: "Dunes", activities: ["Sunrise shoots", "Deadvlei"], dayNumber: 2, order: 2 },
      { name: "Swakopmund", lat: -22.6792, lng: 14.5266, description: "Coast", activities: ["Coastal photography"], dayNumber: 4, order: 3 },
      { name: "Spitzkoppe", lat: -21.8333, lng: 15.2000, description: "Granite peaks", activities: ["Rock arch", "Milky Way"], dayNumber: 5, order: 4 },
      { name: "Etosha", lat: -19.1833, lng: 15.9167, description: "Wildlife", activities: ["Wildlife photography"], dayNumber: 6, order: 5 },
      { name: "Windhoek", lat: -22.5609, lng: 17.0836, description: "Return", activities: ["End"], dayNumber: 7, order: 6 },
    ]
  },
  {
    name: "Family Safari Adventure",
    slug: "family-safari-adventure-7day",
    description: "Family-friendly itinerary with activities suitable for all ages.",
    duration: 7, difficulty: "easy", startLocation: "Windhoek", endLocation: "Windhoek",
    highlights: ["Family activities", "Wildlife", "Beach time", "Educational"],
    bestTimeToVisit: "April-October", seasonalInfo: "School holidays popular. Book early.",
    imageUrl: "/images/placeholder-family-7day.jpg",
    stops: [
      { name: "Windhoek", lat: -22.5609, lng: 17.0836, description: "Start", activities: ["City exploration"], dayNumber: 1, order: 1 },
      { name: "Okonjima", lat: -21.0000, lng: 16.7167, description: "Cats", activities: ["Cheetah viewing", "Education"], dayNumber: 2, order: 2 },
      { name: "Etosha", lat: -19.1833, lng: 15.9167, description: "Safari", activities: ["Family game drives"], dayNumber: 3, order: 3 },
      { name: "Swakopmund", lat: -22.6792, lng: 14.5266, description: "Beach", activities: ["Beach activities", "Aquarium"], dayNumber: 5, order: 4 },
      { name: "Sossusvlei", lat: -24.7333, lng: 15.2833, description: "Dunes", activities: ["Dune fun", "Stargazing"], dayNumber: 6, order: 5 },
      { name: "Windhoek", lat: -22.5609, lng: 17.0836, description: "Return", activities: ["End"], dayNumber: 7, order: 6 },
    ]
  },
  {
    name: "Namibia Self-Drive Classic",
    slug: "namibia-self-drive-classic-7day",
    description: "Perfect self-drive route with manageable distances and well-maintained roads.",
    duration: 7, difficulty: "moderate", startLocation: "Windhoek", endLocation: "Windhoek",
    highlights: ["Self-drive freedom", "Scenic routes", "Flexible timing", "All highlights"],
    bestTimeToVisit: "Year-round", seasonalInfo: "Dry season for easier driving.",
    imageUrl: "/images/placeholder-self-drive-7day.jpg",
    stops: [
      { name: "Windhoek", lat: -22.5609, lng: 17.0836, description: "Start", activities: ["Car pickup"], dayNumber: 1, order: 1 },
      { name: "Sossusvlei", lat: -24.7333, lng: 15.2833, description: "Dunes", activities: ["Self-exploration"], dayNumber: 2, order: 2 },
      { name: "Swakopmund", lat: -22.6792, lng: 14.5266, description: "Coast", activities: ["Free time"], dayNumber: 4, order: 3 },
      { name: "Damaraland", lat: -20.5833, lng: 14.3667, description: "Rock art", activities: ["Self-guided"], dayNumber: 5, order: 4 },
      { name: "Etosha", lat: -19.1833, lng: 15.9167, description: "Safari", activities: ["Self-drive safari"], dayNumber: 6, order: 5 },
      { name: "Windhoek", lat: -22.5609, lng: 17.0836, description: "Return", activities: ["Car return"], dayNumber: 7, order: 6 },
    ]
  },

  // More 10-day tours (4 more to make 5 total)
  {
    name: "Namibia In-Depth",
    slug: "namibia-in-depth-10day",
    description: "Comprehensive 10-day journey with time to truly experience each destination.",
    duration: 10, difficulty: "moderate", startLocation: "Windhoek", endLocation: "Windhoek",
    highlights: ["All major attractions", "Cultural experiences", "Wildlife", "Landscapes"],
    bestTimeToVisit: "May-October", seasonalInfo: "Dry season for best overall experience.",
    imageUrl: "/images/placeholder-in-depth-10day.jpg",
    stops: [
      { name: "Windhoek", lat: -22.5609, lng: 17.0836, description: "Start", activities: ["Orientation"], dayNumber: 1, order: 1 },
      { name: "Kalahari", lat: -24.6333, lng: 17.9667, description: "Desert", activities: ["San culture"], dayNumber: 2, order: 2 },
      { name: "Fish River Canyon", lat: -27.5500, lng: 17.5500, description: "Canyon", activities: ["Viewpoints"], dayNumber: 3, order: 3 },
      { name: "Sossusvlei", lat: -24.7333, lng: 15.2833, description: "Dunes", activities: ["Full exploration"], dayNumber: 5, order: 4 },
      { name: "Swakopmund", lat: -22.6792, lng: 14.5266, description: "Coast", activities: ["Activities"], dayNumber: 7, order: 5 },
      { name: "Damaraland", lat: -20.5833, lng: 14.3667, description: "Rock art", activities: ["Twyfelfontein"], dayNumber: 8, order: 6 },
      { name: "Etosha", lat: -19.1833, lng: 15.9167, description: "Safari", activities: ["Game drives"], dayNumber: 9, order: 7 },
      { name: "Windhoek", lat: -22.5609, lng: 17.0836, description: "End", activities: ["Departure"], dayNumber: 10, order: 8 },
    ]
  },
  {
    name: "Namibia Luxury Safari",
    slug: "namibia-luxury-safari-10day",
    description: "Premium accommodations and exclusive experiences across Namibia.",
    duration: 10, difficulty: "easy", startLocation: "Windhoek", endLocation: "Windhoek",
    highlights: ["Luxury lodges", "Private experiences", "Fine dining", "Exclusive access"],
    bestTimeToVisit: "May-October", seasonalInfo: "Peak season. Book well in advance.",
    imageUrl: "/images/placeholder-luxury-10day.jpg",
    stops: [
      { name: "Windhoek", lat: -22.5609, lng: 17.0836, description: "Start", activities: ["Luxury hotel"], dayNumber: 1, order: 1 },
      { name: "Sossusvlei", lat: -24.7333, lng: 15.2833, description: "Dunes", activities: ["Private dune experience", "Balloon"], dayNumber: 2, order: 2 },
      { name: "Swakopmund", lat: -22.6792, lng: 14.5266, description: "Coast", activities: ["Luxury activities"], dayNumber: 4, order: 3 },
      { name: "Damaraland", lat: -20.5833, lng: 14.3667, description: "Wilderness", activities: ["Exclusive camp"], dayNumber: 6, order: 4 },
      { name: "Etosha", lat: -19.1833, lng: 15.9167, description: "Safari", activities: ["Private safari"], dayNumber: 8, order: 5 },
      { name: "Windhoek", lat: -22.5609, lng: 17.0836, description: "End", activities: ["Departure"], dayNumber: 10, order: 6 },
    ]
  },
  {
    name: "Namibia Adventure Expedition",
    slug: "namibia-adventure-expedition-10day",
    description: "Action-packed adventure with hiking, kayaking, and adrenaline activities.",
    duration: 10, difficulty: "challenging", startLocation: "Windhoek", endLocation: "Windhoek",
    highlights: ["Adventure activities", "Hiking", "Kayaking", "Skydiving optional"],
    bestTimeToVisit: "April-October", seasonalInfo: "Cooler months for physical activities.",
    imageUrl: "/images/placeholder-adventure-10day.jpg",
    stops: [
      { name: "Windhoek", lat: -22.5609, lng: 17.0836, description: "Start", activities: ["Preparation"], dayNumber: 1, order: 1 },
      { name: "Naukluft", lat: -24.2667, lng: 16.2333, description: "Hiking", activities: ["Mountain hiking"], dayNumber: 2, order: 2 },
      { name: "Sossusvlei", lat: -24.7333, lng: 15.2833, description: "Dunes", activities: ["Dune climbing"], dayNumber: 4, order: 3 },
      { name: "Swakopmund", lat: -22.6792, lng: 14.5266, description: "Adventure", activities: ["Skydiving", "Quad biking"], dayNumber: 6, order: 4 },
      { name: "Walvis Bay", lat: -22.9575, lng: 14.5053, description: "Water", activities: ["Kayaking with seals"], dayNumber: 7, order: 5 },
      { name: "Spitzkoppe", lat: -21.8333, lng: 15.2000, description: "Climbing", activities: ["Rock climbing"], dayNumber: 8, order: 6 },
      { name: "Etosha", lat: -19.1833, lng: 15.9167, description: "Safari", activities: ["Game drives"], dayNumber: 9, order: 7 },
      { name: "Windhoek", lat: -22.5609, lng: 17.0836, description: "End", activities: ["Departure"], dayNumber: 10, order: 8 },
    ]
  },
  {
    name: "Namibia Birding Safari",
    slug: "namibia-birding-safari-10day",
    description: "Specialized birding tour covering Namibia's diverse habitats and 650+ species.",
    duration: 10, difficulty: "easy", startLocation: "Windhoek", endLocation: "Windhoek",
    highlights: ["650+ bird species", "Diverse habitats", "Expert guides", "Endemic species"],
    bestTimeToVisit: "November-March", seasonalInfo: "Summer for migrants. Year-round for residents.",
    imageUrl: "/images/placeholder-birding-10day.jpg",
    stops: [
      { name: "Windhoek", lat: -22.5609, lng: 17.0836, description: "Start", activities: ["Avis Dam birding"], dayNumber: 1, order: 1 },
      { name: "Walvis Bay", lat: -22.9575, lng: 14.5053, description: "Wetlands", activities: ["Flamingos", "Shorebirds"], dayNumber: 2, order: 2 },
      { name: "Etosha", lat: -19.1833, lng: 15.9167, description: "Savanna", activities: ["Raptors", "Waterbirds"], dayNumber: 4, order: 3 },
      { name: "Waterberg", lat: -20.4167, lng: 17.2500, description: "Woodland", activities: ["Forest species"], dayNumber: 6, order: 4 },
      { name: "Caprivi", lat: -18.1167, lng: 21.5500, description: "Rivers", activities: ["400+ species"], dayNumber: 8, order: 5 },
      { name: "Windhoek", lat: -22.5609, lng: 17.0836, description: "End", activities: ["Departure"], dayNumber: 10, order: 6 },
    ]
  },

  // More 14-day tours (4 more to make 5 total)
  {
    name: "Namibia Complete Safari",
    slug: "namibia-complete-safari-14day",
    description: "The most comprehensive safari covering all of Namibia's wildlife areas.",
    duration: 14, difficulty: "moderate", startLocation: "Windhoek", endLocation: "Windhoek",
    highlights: ["All wildlife areas", "Big Five", "Rare species", "Diverse ecosystems"],
    bestTimeToVisit: "May-October", seasonalInfo: "Dry season essential for wildlife.",
    imageUrl: "/images/placeholder-complete-safari-14day.jpg",
    stops: [
      { name: "Windhoek", lat: -22.5609, lng: 17.0836, description: "Start", activities: ["Orientation"], dayNumber: 1, order: 1 },
      { name: "Okonjima", lat: -21.0000, lng: 16.7167, description: "Carnivores", activities: ["Big cats"], dayNumber: 2, order: 2 },
      { name: "Etosha", lat: -19.1833, lng: 15.9167, description: "Safari", activities: ["Full exploration"], dayNumber: 3, order: 3 },
      { name: "Damaraland", lat: -20.5833, lng: 14.3667, description: "Elephants", activities: ["Desert elephants"], dayNumber: 6, order: 4 },
      { name: "Skeleton Coast", lat: -21.0000, lng: 13.5000, description: "Seals", activities: ["Cape Cross"], dayNumber: 8, order: 5 },
      { name: "Sossusvlei", lat: -24.7333, lng: 15.2833, description: "Desert", activities: ["Oryx", "Springbok"], dayNumber: 10, order: 6 },
      { name: "NamibRand", lat: -25.0000, lng: 15.8333, description: "Private", activities: ["Night drives"], dayNumber: 12, order: 7 },
      { name: "Windhoek", lat: -22.5609, lng: 17.0836, description: "End", activities: ["Departure"], dayNumber: 14, order: 8 },
    ]
  },
  {
    name: "Namibia Cultural Journey",
    slug: "namibia-cultural-journey-14day",
    description: "Deep dive into Namibia's diverse cultures from Himba to San to Herero.",
    duration: 14, difficulty: "moderate", startLocation: "Windhoek", endLocation: "Windhoek",
    highlights: ["Himba culture", "San Bushmen", "Herero traditions", "German heritage"],
    bestTimeToVisit: "Year-round", seasonalInfo: "Dry season for remote areas.",
    imageUrl: "/images/placeholder-cultural-14day.jpg",
    stops: [
      { name: "Windhoek", lat: -22.5609, lng: 17.0836, description: "Start", activities: ["City culture"], dayNumber: 1, order: 1 },
      { name: "Okahandja", lat: -21.9833, lng: 16.9167, description: "Herero", activities: ["Herero culture"], dayNumber: 2, order: 2 },
      { name: "Damaraland", lat: -20.5833, lng: 14.3667, description: "Damara", activities: ["Living museum"], dayNumber: 4, order: 3 },
      { name: "Kaokoland", lat: -18.0500, lng: 13.8333, description: "Himba", activities: ["Village stays"], dayNumber: 6, order: 4 },
      { name: "Etosha", lat: -19.1833, lng: 15.9167, description: "Wildlife", activities: ["Safari break"], dayNumber: 9, order: 5 },
      { name: "Kalahari", lat: -24.6333, lng: 17.9667, description: "San", activities: ["Bush walks"], dayNumber: 11, order: 6 },
      { name: "Lüderitz", lat: -26.6481, lng: 15.1591, description: "German", activities: ["Colonial heritage"], dayNumber: 13, order: 7 },
      { name: "Windhoek", lat: -22.5609, lng: 17.0836, description: "End", activities: ["Departure"], dayNumber: 14, order: 8 },
    ]
  },
  {
    name: "Namibia Honeymoon Special",
    slug: "namibia-honeymoon-special-14day",
    description: "Romantic two-week journey through Namibia's most beautiful destinations.",
    duration: 14, difficulty: "easy", startLocation: "Windhoek", endLocation: "Windhoek",
    highlights: ["Romantic lodges", "Private experiences", "Scenic beauty", "Memorable moments"],
    bestTimeToVisit: "May-October", seasonalInfo: "Dry season for best weather.",
    imageUrl: "/images/placeholder-honeymoon-14day.jpg",
    stops: [
      { name: "Windhoek", lat: -22.5609, lng: 17.0836, description: "Start", activities: ["Romantic dinner"], dayNumber: 1, order: 1 },
      { name: "Sossusvlei", lat: -24.7333, lng: 15.2833, description: "Dunes", activities: ["Private sunrise", "Balloon"], dayNumber: 2, order: 2 },
      { name: "Swakopmund", lat: -22.6792, lng: 14.5266, description: "Coast", activities: ["Spa", "Cruise"], dayNumber: 5, order: 3 },
      { name: "Damaraland", lat: -20.5833, lng: 14.3667, description: "Wilderness", activities: ["Starlit dinner"], dayNumber: 8, order: 4 },
      { name: "Etosha", lat: -19.1833, lng: 15.9167, description: "Safari", activities: ["Private safari"], dayNumber: 10, order: 5 },
      { name: "Waterberg", lat: -20.4167, lng: 17.2500, description: "Plateau", activities: ["Spa retreat"], dayNumber: 13, order: 6 },
      { name: "Windhoek", lat: -22.5609, lng: 17.0836, description: "End", activities: ["Farewell"], dayNumber: 14, order: 7 },
    ]
  },
  {
    name: "Namibia Geology Tour",
    slug: "namibia-geology-tour-14day",
    description: "Explore Namibia's fascinating geological history from ancient rocks to recent formations.",
    duration: 14, difficulty: "moderate", startLocation: "Windhoek", endLocation: "Windhoek",
    highlights: ["Ancient geology", "Rock formations", "Fossils", "Volcanic landscapes"],
    bestTimeToVisit: "Year-round", seasonalInfo: "Cooler months for hiking.",
    imageUrl: "/images/placeholder-geology-14day.jpg",
    stops: [
      { name: "Windhoek", lat: -22.5609, lng: 17.0836, description: "Start", activities: ["Museum visit"], dayNumber: 1, order: 1 },
      { name: "Fish River Canyon", lat: -27.5500, lng: 17.5500, description: "Canyon", activities: ["Geology tour"], dayNumber: 2, order: 2 },
      { name: "Sossusvlei", lat: -24.7333, lng: 15.2833, description: "Dunes", activities: ["Sand formation"], dayNumber: 5, order: 3 },
      { name: "Damaraland", lat: -20.5833, lng: 14.3667, description: "Formations", activities: ["Organ Pipes", "Burnt Mountain"], dayNumber: 8, order: 4 },
      { name: "Petrified Forest", lat: -20.4167, lng: 14.5500, description: "Fossils", activities: ["Fossil viewing"], dayNumber: 10, order: 5 },
      { name: "Brandberg", lat: -21.1333, lng: 14.7333, description: "Mountain", activities: ["Granite geology"], dayNumber: 12, order: 6 },
      { name: "Windhoek", lat: -22.5609, lng: 17.0836, description: "End", activities: ["Departure"], dayNumber: 14, order: 7 },
    ]
  },

  // More 21-day tours (4 more to make 5 total)
  {
    name: "Namibia Ultimate Adventure",
    slug: "namibia-ultimate-adventure-21day",
    description: "Three weeks of adventure covering every corner of Namibia.",
    duration: 21, difficulty: "challenging", startLocation: "Windhoek", endLocation: "Windhoek",
    highlights: ["Complete coverage", "Adventure activities", "Remote areas", "All wildlife"],
    bestTimeToVisit: "May-September", seasonalInfo: "Dry season for remote access.",
    imageUrl: "/images/placeholder-ultimate-adventure-21day.jpg",
    stops: [
      { name: "Windhoek", lat: -22.5609, lng: 17.0836, description: "Start", activities: ["Preparation"], dayNumber: 1, order: 1 },
      { name: "Kalahari", lat: -24.6333, lng: 17.9667, description: "Desert", activities: ["San culture"], dayNumber: 2, order: 2 },
      { name: "Fish River Canyon", lat: -27.5500, lng: 17.5500, description: "Canyon", activities: ["Hiking"], dayNumber: 4, order: 3 },
      { name: "Lüderitz", lat: -26.6481, lng: 15.1591, description: "Coast", activities: ["Exploration"], dayNumber: 6, order: 4 },
      { name: "Sossusvlei", lat: -24.7333, lng: 15.2833, description: "Dunes", activities: ["Full exploration"], dayNumber: 8, order: 5 },
      { name: "Swakopmund", lat: -22.6792, lng: 14.5266, description: "Adventure", activities: ["Activities"], dayNumber: 11, order: 6 },
      { name: "Skeleton Coast", lat: -21.0000, lng: 13.5000, description: "Wild coast", activities: ["Exploration"], dayNumber: 13, order: 7 },
      { name: "Kaokoland", lat: -18.0500, lng: 13.8333, description: "Remote", activities: ["Himba", "Epupa"], dayNumber: 15, order: 8 },
      { name: "Etosha", lat: -19.1833, lng: 15.9167, description: "Safari", activities: ["Full safari"], dayNumber: 18, order: 9 },
      { name: "Windhoek", lat: -22.5609, lng: 17.0836, description: "End", activities: ["Departure"], dayNumber: 21, order: 10 },
    ]
  },
  {
    name: "Namibia Photography Masterclass",
    slug: "namibia-photography-masterclass-21day",
    description: "Professional photography tour with workshops at Namibia's most photogenic locations.",
    duration: 21, difficulty: "moderate", startLocation: "Windhoek", endLocation: "Windhoek",
    highlights: ["Pro workshops", "All iconic locations", "Night photography", "Wildlife shots"],
    bestTimeToVisit: "May-September", seasonalInfo: "Clear skies and good light.",
    imageUrl: "/images/placeholder-photo-masterclass-21day.jpg",
    stops: [
      { name: "Windhoek", lat: -22.5609, lng: 17.0836, description: "Start", activities: ["Workshop intro"], dayNumber: 1, order: 1 },
      { name: "Sossusvlei", lat: -24.7333, lng: 15.2833, description: "Dunes", activities: ["Multiple shoots"], dayNumber: 2, order: 2 },
      { name: "NamibRand", lat: -25.0000, lng: 15.8333, description: "Dark skies", activities: ["Astrophotography"], dayNumber: 5, order: 3 },
      { name: "Swakopmund", lat: -22.6792, lng: 14.5266, description: "Coast", activities: ["Coastal shoots"], dayNumber: 8, order: 4 },
      { name: "Spitzkoppe", lat: -21.8333, lng: 15.2000, description: "Granite", activities: ["Rock arch shots"], dayNumber: 11, order: 5 },
      { name: "Damaraland", lat: -20.5833, lng: 14.3667, description: "Landscapes", activities: ["Elephant tracking"], dayNumber: 13, order: 6 },
      { name: "Etosha", lat: -19.1833, lng: 15.9167, description: "Wildlife", activities: ["Wildlife photography"], dayNumber: 16, order: 7 },
      { name: "Windhoek", lat: -22.5609, lng: 17.0836, description: "End", activities: ["Final review"], dayNumber: 21, order: 8 },
    ]
  },
  {
    name: "Namibia Family Grand Tour",
    slug: "namibia-family-grand-tour-21day",
    description: "Extended family adventure with educational experiences and fun activities.",
    duration: 21, difficulty: "easy", startLocation: "Windhoek", endLocation: "Windhoek",
    highlights: ["Family activities", "Educational", "Wildlife", "Beach time"],
    bestTimeToVisit: "April-October", seasonalInfo: "School holidays. Book early.",
    imageUrl: "/images/placeholder-family-grand-21day.jpg",
    stops: [
      { name: "Windhoek", lat: -22.5609, lng: 17.0836, description: "Start", activities: ["City exploration"], dayNumber: 1, order: 1 },
      { name: "Okonjima", lat: -21.0000, lng: 16.7167, description: "Cats", activities: ["Education center"], dayNumber: 2, order: 2 },
      { name: "Etosha", lat: -19.1833, lng: 15.9167, description: "Safari", activities: ["Family safari"], dayNumber: 4, order: 3 },
      { name: "Damaraland", lat: -20.5833, lng: 14.3667, description: "Culture", activities: ["Living museum"], dayNumber: 8, order: 4 },
      { name: "Swakopmund", lat: -22.6792, lng: 14.5266, description: "Beach", activities: ["Beach activities"], dayNumber: 11, order: 5 },
      { name: "Sossusvlei", lat: -24.7333, lng: 15.2833, description: "Dunes", activities: ["Dune fun"], dayNumber: 15, order: 6 },
      { name: "Kalahari", lat: -24.6333, lng: 17.9667, description: "San", activities: ["Bush skills"], dayNumber: 18, order: 7 },
      { name: "Windhoek", lat: -22.5609, lng: 17.0836, description: "End", activities: ["Farewell"], dayNumber: 21, order: 8 },
    ]
  },
  {
    name: "Namibia Conservation Safari",
    slug: "namibia-conservation-safari-21day",
    description: "Focus on Namibia's conservation success stories and community projects.",
    duration: 21, difficulty: "moderate", startLocation: "Windhoek", endLocation: "Windhoek",
    highlights: ["Conservation projects", "Community tourism", "Wildlife protection", "Sustainable travel"],
    bestTimeToVisit: "Year-round", seasonalInfo: "Projects active year-round.",
    imageUrl: "/images/placeholder-conservation-21day.jpg",
    stops: [
      { name: "Windhoek", lat: -22.5609, lng: 17.0836, description: "Start", activities: ["Briefing"], dayNumber: 1, order: 1 },
      { name: "Okonjima", lat: -21.0000, lng: 16.7167, description: "AfriCat", activities: ["Conservation work"], dayNumber: 2, order: 2 },
      { name: "Etosha", lat: -19.1833, lng: 15.9167, description: "Park", activities: ["Conservation tour"], dayNumber: 5, order: 3 },
      { name: "Damaraland", lat: -20.5833, lng: 14.3667, description: "Elephants", activities: ["Elephant project"], dayNumber: 9, order: 4 },
      { name: "Skeleton Coast", lat: -21.0000, lng: 13.5000, description: "Seals", activities: ["Marine conservation"], dayNumber: 12, order: 5 },
      { name: "NamibRand", lat: -25.0000, lng: 15.8333, description: "Private", activities: ["Reserve management"], dayNumber: 15, order: 6 },
      { name: "Caprivi", lat: -18.1167, lng: 21.5500, description: "Community", activities: ["Community projects"], dayNumber: 18, order: 7 },
      { name: "Windhoek", lat: -22.5609, lng: 17.0836, description: "End", activities: ["Wrap-up"], dayNumber: 21, order: 8 },
    ]
  },

  // More 30-day tours (4 more to make 5 total)
  {
    name: "Namibia Complete Discovery",
    slug: "namibia-complete-discovery-30day",
    description: "The definitive month-long exploration of every region and highlight in Namibia.",
    duration: 30, difficulty: "challenging", startLocation: "Windhoek", endLocation: "Windhoek",
    highlights: ["Every region", "All highlights", "Deep immersion", "Complete experience"],
    bestTimeToVisit: "May-September", seasonalInfo: "Dry season for full access.",
    imageUrl: "/images/placeholder-complete-discovery-30day.jpg",
    stops: [
      { name: "Windhoek", lat: -22.5609, lng: 17.0836, description: "Start", activities: ["Full preparation"], dayNumber: 1, order: 1 },
      { name: "Kalahari", lat: -24.6333, lng: 17.9667, description: "Desert", activities: ["San immersion"], dayNumber: 3, order: 2 },
      { name: "Fish River Canyon", lat: -27.5500, lng: 17.5500, description: "Canyon", activities: ["Full exploration"], dayNumber: 6, order: 3 },
      { name: "Lüderitz", lat: -26.6481, lng: 15.1591, description: "Coast", activities: ["Complete area"], dayNumber: 9, order: 4 },
      { name: "Sossusvlei", lat: -24.7333, lng: 15.2833, description: "Dunes", activities: ["Multiple days"], dayNumber: 12, order: 5 },
      { name: "Swakopmund", lat: -22.6792, lng: 14.5266, description: "Coast", activities: ["All activities"], dayNumber: 15, order: 6 },
      { name: "Skeleton Coast", lat: -21.0000, lng: 13.5000, description: "Wild coast", activities: ["Full exploration"], dayNumber: 18, order: 7 },
      { name: "Kaokoland", lat: -18.0500, lng: 13.8333, description: "Remote", activities: ["Complete region"], dayNumber: 21, order: 8 },
      { name: "Etosha", lat: -19.1833, lng: 15.9167, description: "Safari", activities: ["Comprehensive"], dayNumber: 24, order: 9 },
      { name: "Caprivi", lat: -18.1167, lng: 21.5500, description: "Rivers", activities: ["Full exploration"], dayNumber: 27, order: 10 },
      { name: "Windhoek", lat: -22.5609, lng: 17.0836, description: "End", activities: ["Farewell"], dayNumber: 30, order: 11 },
    ]
  },
  {
    name: "Namibia Ultimate Photography",
    slug: "namibia-ultimate-photography-30day",
    description: "Month-long photography expedition covering every photogenic location in Namibia.",
    duration: 30, difficulty: "moderate", startLocation: "Windhoek", endLocation: "Windhoek",
    highlights: ["All photo locations", "Multiple shoots", "Night skies", "Wildlife"],
    bestTimeToVisit: "May-September", seasonalInfo: "Clear skies throughout.",
    imageUrl: "/images/placeholder-ultimate-photo-30day.jpg",
    stops: [
      { name: "Windhoek", lat: -22.5609, lng: 17.0836, description: "Start", activities: ["Preparation"], dayNumber: 1, order: 1 },
      { name: "Sossusvlei", lat: -24.7333, lng: 15.2833, description: "Dunes", activities: ["Multiple sessions"], dayNumber: 3, order: 2 },
      { name: "NamibRand", lat: -25.0000, lng: 15.8333, description: "Dark skies", activities: ["Astrophotography"], dayNumber: 7, order: 3 },
      { name: "Fish River Canyon", lat: -27.5500, lng: 17.5500, description: "Canyon", activities: ["Landscape shots"], dayNumber: 10, order: 4 },
      { name: "Swakopmund", lat: -22.6792, lng: 14.5266, description: "Coast", activities: ["Coastal photography"], dayNumber: 14, order: 5 },
      { name: "Spitzkoppe", lat: -21.8333, lng: 15.2000, description: "Granite", activities: ["Rock formations"], dayNumber: 17, order: 6 },
      { name: "Damaraland", lat: -20.5833, lng: 14.3667, description: "Landscapes", activities: ["Elephant shots"], dayNumber: 20, order: 7 },
      { name: "Etosha", lat: -19.1833, lng: 15.9167, description: "Wildlife", activities: ["Wildlife photography"], dayNumber: 24, order: 8 },
      { name: "Kaokoland", lat: -18.0500, lng: 13.8333, description: "Culture", activities: ["Portrait photography"], dayNumber: 27, order: 9 },
      { name: "Windhoek", lat: -22.5609, lng: 17.0836, description: "End", activities: ["Final review"], dayNumber: 30, order: 10 },
    ]
  },
  {
    name: "Namibia Overland Expedition",
    slug: "namibia-overland-expedition-30day",
    description: "Epic overland journey covering Namibia's most remote and spectacular regions.",
    duration: 30, difficulty: "challenging", startLocation: "Windhoek", endLocation: "Windhoek",
    highlights: ["Remote areas", "4x4 adventure", "Camping", "Wilderness"],
    bestTimeToVisit: "May-September", seasonalInfo: "Dry season essential for remote roads.",
    imageUrl: "/images/placeholder-overland-30day.jpg",
    stops: [
      { name: "Windhoek", lat: -22.5609, lng: 17.0836, description: "Start", activities: ["Vehicle prep"], dayNumber: 1, order: 1 },
      { name: "Kalahari", lat: -24.6333, lng: 17.9667, description: "Desert", activities: ["Desert camping"], dayNumber: 3, order: 2 },
      { name: "Fish River Canyon", lat: -27.5500, lng: 17.5500, description: "Canyon", activities: ["Rim camping"], dayNumber: 6, order: 3 },
      { name: "Sossusvlei", lat: -24.7333, lng: 15.2833, description: "Dunes", activities: ["Desert camp"], dayNumber: 10, order: 4 },
      { name: "Skeleton Coast", lat: -21.0000, lng: 13.5000, description: "Coast", activities: ["Beach camping"], dayNumber: 14, order: 5 },
      { name: "Kaokoland", lat: -18.0500, lng: 13.8333, description: "Remote", activities: ["Bush camping"], dayNumber: 18, order: 6 },
      { name: "Etosha", lat: -19.1833, lng: 15.9167, description: "Safari", activities: ["Camp safari"], dayNumber: 23, order: 7 },
      { name: "Caprivi", lat: -18.1167, lng: 21.5500, description: "Rivers", activities: ["River camping"], dayNumber: 27, order: 8 },
      { name: "Windhoek", lat: -22.5609, lng: 17.0836, description: "End", activities: ["Return"], dayNumber: 30, order: 9 },
    ]
  },
  {
    name: "Namibia Research Expedition",
    slug: "namibia-research-expedition-30day",
    description: "Scientific exploration focusing on Namibia's unique ecosystems and wildlife.",
    duration: 30, difficulty: "moderate", startLocation: "Windhoek", endLocation: "Windhoek",
    highlights: ["Research stations", "Unique ecosystems", "Wildlife studies", "Conservation"],
    bestTimeToVisit: "Year-round", seasonalInfo: "Different research focus each season.",
    imageUrl: "/images/placeholder-research-30day.jpg",
    stops: [
      { name: "Windhoek", lat: -22.5609, lng: 17.0836, description: "Start", activities: ["Research briefing"], dayNumber: 1, order: 1 },
      { name: "Gobabeb", lat: -23.5500, lng: 15.0333, description: "Research", activities: ["Desert research"], dayNumber: 3, order: 2 },
      { name: "Sossusvlei", lat: -24.7333, lng: 15.2833, description: "Dunes", activities: ["Dune ecology"], dayNumber: 7, order: 3 },
      { name: "Walvis Bay", lat: -22.9575, lng: 14.5053, description: "Wetlands", activities: ["Marine research"], dayNumber: 11, order: 4 },
      { name: "Damaraland", lat: -20.5833, lng: 14.3667, description: "Elephants", activities: ["Elephant research"], dayNumber: 15, order: 5 },
      { name: "Etosha", lat: -19.1833, lng: 15.9167, description: "Wildlife", activities: ["Wildlife studies"], dayNumber: 19, order: 6 },
      { name: "Waterberg", lat: -20.4167, lng: 17.2500, description: "Plateau", activities: ["Rare species"], dayNumber: 24, order: 7 },
      { name: "Caprivi", lat: -18.1167, lng: 21.5500, description: "Wetlands", activities: ["River ecology"], dayNumber: 27, order: 8 },
      { name: "Windhoek", lat: -22.5609, lng: 17.0836, description: "End", activities: ["Research summary"], dayNumber: 30, order: 9 },
    ]
  },
];

async function seedAdditionalRoutes() {
  console.log("Starting additional routes seeding...");
  
  let routeCount = 0;
  let stopCount = 0;

  for (const route of additionalRoutes) {
    try {
      const [result] = await db.insert(routes).values({
        name: route.name,
        slug: route.slug,
        description: route.description,
        duration: route.duration,
        difficulty: route.difficulty as "easy" | "moderate" | "challenging",
        startLocation: route.startLocation,
        endLocation: route.endLocation,
        highlights: JSON.stringify(route.highlights),
        bestTimeToVisit: route.bestTimeToVisit,
        seasonalInfo: route.seasonalInfo,
        coverImage: route.imageUrl,
        isActive: true,
      });

      const routeId = (result as any).insertId;
      routeCount++;

      for (const stop of route.stops) {
        await db.insert(routeStops).values({
          routeId,
          name: stop.name,
          description: stop.description,
          latitude: stop.lat.toString(),
          longitude: stop.lng.toString(),
          activities: JSON.stringify(stop.activities),
          dayNumber: stop.dayNumber,
          stopOrder: stop.order,
        });
        stopCount++;
      }

      console.log(`✓ Created route: ${route.name} (${route.duration} days)`);
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        console.log(`⊘ Route already exists: ${route.name}`);
      } else {
        console.error(`✗ Failed to create route: ${route.name}`, error.message);
      }
    }
  }

  console.log(`\n✓ Additional seeding complete: ${routeCount} new routes with ${stopCount} stops`);
  await pool.end();
  process.exit(0);
}

seedAdditionalRoutes().catch(console.error);

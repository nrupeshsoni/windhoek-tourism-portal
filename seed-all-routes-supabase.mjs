import pg from 'pg';

const client = new pg.Client('postgresql://postgres.fykchaqksvuwweuzgkxt:hUX347Rcy%25Pu_.q@aws-0-eu-central-1.pooler.supabase.com:6543/postgres');

// Comprehensive routes covering all durations and starting locations
const routes = [
  // === 1-DAY TOURS ===
  { name: "Sossusvlei Sunrise Adventure", duration: 1, difficulty: "moderate", start: "Sesriem", end: "Sesriem", highlights: "Dune 45, Deadvlei, Big Daddy Dune", season: "April-October", distance: 120 },
  { name: "Swakopmund Desert Explorer", duration: 1, difficulty: "easy", start: "Swakopmund", end: "Swakopmund", highlights: "Moon Landscape, Welwitschia Plains, Dune 7", season: "Year-round", distance: 80 },
  { name: "Etosha Wildlife Safari", duration: 1, difficulty: "easy", start: "Okaukuejo", end: "Okaukuejo", highlights: "Okaukuejo Waterhole, Halali, Fischer's Pan", season: "May-October", distance: 150 },
  { name: "Walvis Bay Lagoon Tour", duration: 1, difficulty: "easy", start: "Walvis Bay", end: "Walvis Bay", highlights: "Flamingo Lagoon, Pelican Point, Sandwich Harbour", season: "Year-round", distance: 60 },
  { name: "Windhoek City Discovery", duration: 1, difficulty: "easy", start: "Windhoek", end: "Windhoek", highlights: "Christuskirche, Independence Memorial, Craft Markets", season: "Year-round", distance: 30 },
  { name: "Lüderitz Coastal Heritage", duration: 1, difficulty: "easy", start: "Lüderitz", end: "Lüderitz", highlights: "Kolmanskop Ghost Town, Diaz Point, Penguin Island", season: "Year-round", distance: 50 },
  { name: "Opuwo Himba Cultural Experience", duration: 1, difficulty: "moderate", start: "Opuwo", end: "Opuwo", highlights: "Himba Village Visit, Epupa Falls View, Local Markets", season: "Year-round", distance: 40 },
  { name: "Rundu River Adventure", duration: 1, difficulty: "easy", start: "Rundu", end: "Rundu", highlights: "Kavango River Cruise, Mbunza Living Museum, Craft Markets", season: "Year-round", distance: 35 },
  { name: "Katima Mulilo Wetlands", duration: 1, difficulty: "easy", start: "Katima Mulilo", end: "Katima Mulilo", highlights: "Zambezi River, Impalila Island, Bird Watching", season: "May-October", distance: 45 },
  { name: "Mariental Kalahari Sunset", duration: 1, difficulty: "easy", start: "Mariental", end: "Mariental", highlights: "Hardap Dam, Kalahari Dunes, Stargazing", season: "Year-round", distance: 70 },
  { name: "Otjiwarongo Cheetah Experience", duration: 1, difficulty: "easy", start: "Otjiwarongo", end: "Otjiwarongo", highlights: "Cheetah Conservation Fund, Crocodile Farm", season: "Year-round", distance: 40 },
  { name: "Keetmanshoop Quiver Tree Forest", duration: 1, difficulty: "easy", start: "Keetmanshoop", end: "Keetmanshoop", highlights: "Quiver Tree Forest, Giant's Playground, Mesosaurus Fossils", season: "Year-round", distance: 50 },
  
  // === 2-DAY TOURS ===
  { name: "Sossusvlei Complete Experience", duration: 2, difficulty: "moderate", start: "Windhoek", end: "Windhoek", highlights: "Dune 45, Deadvlei, Sesriem Canyon, Hot Air Balloon", season: "April-October", distance: 700 },
  { name: "Swakopmund Adventure Weekend", duration: 2, difficulty: "moderate", start: "Windhoek", end: "Swakopmund", highlights: "Sandboarding, Quad Biking, Dolphin Cruise", season: "Year-round", distance: 400 },
  { name: "Etosha Safari Weekend", duration: 2, difficulty: "easy", start: "Windhoek", end: "Windhoek", highlights: "Game Drives, Waterhole Viewing, Night Safari", season: "May-October", distance: 900 },
  { name: "Fish River Canyon Explorer", duration: 2, difficulty: "challenging", start: "Keetmanshoop", end: "Keetmanshoop", highlights: "Canyon Viewpoints, Ai-Ais Hot Springs", season: "April-September", distance: 300 },
  { name: "Skeleton Coast Discovery", duration: 2, difficulty: "moderate", start: "Swakopmund", end: "Swakopmund", highlights: "Cape Cross Seals, Shipwrecks, Desert Lions", season: "Year-round", distance: 350 },
  { name: "Damaraland Rock Art Trail", duration: 2, difficulty: "moderate", start: "Swakopmund", end: "Swakopmund", highlights: "Twyfelfontein, Petrified Forest, Organ Pipes", season: "Year-round", distance: 400 },
  { name: "Caprivi Waterways", duration: 2, difficulty: "easy", start: "Katima Mulilo", end: "Katima Mulilo", highlights: "Zambezi River, Chobe Day Trip, Fishing", season: "May-October", distance: 200 },
  { name: "Kalahari Desert Escape", duration: 2, difficulty: "easy", start: "Windhoek", end: "Windhoek", highlights: "Red Dunes, San Bushmen, Stargazing", season: "Year-round", distance: 350 },
  { name: "Waterberg Plateau Safari", duration: 2, difficulty: "moderate", start: "Windhoek", end: "Windhoek", highlights: "Rhino Tracking, Hiking Trails, History Museum", season: "Year-round", distance: 550 },
  { name: "Erongo Mountain Retreat", duration: 2, difficulty: "moderate", start: "Windhoek", end: "Windhoek", highlights: "Rock Formations, San Rock Art, Wildlife", season: "Year-round", distance: 300 },
  
  // === 3-DAY TOURS ===
  { name: "Sossusvlei & Swakopmund Combo", duration: 3, difficulty: "moderate", start: "Windhoek", end: "Windhoek", highlights: "Dunes, Coast, Adventure Sports", season: "Year-round", distance: 1100 },
  { name: "Etosha Complete Safari", duration: 3, difficulty: "easy", start: "Windhoek", end: "Windhoek", highlights: "All Three Camps, Big Five, Night Drives", season: "May-October", distance: 1000 },
  { name: "Damaraland Cultural Journey", duration: 3, difficulty: "moderate", start: "Windhoek", end: "Windhoek", highlights: "Twyfelfontein, Desert Elephants, Damara Village", season: "Year-round", distance: 900 },
  { name: "Skeleton Coast Adventure", duration: 3, difficulty: "moderate", start: "Swakopmund", end: "Terrace Bay", highlights: "Shipwrecks, Seals, Desert Lions, Fishing", season: "Year-round", distance: 500 },
  { name: "Southern Namibia Heritage", duration: 3, difficulty: "moderate", start: "Windhoek", end: "Windhoek", highlights: "Fish River Canyon, Kolmanskop, Wild Horses", season: "April-September", distance: 1200 },
  { name: "Kaokoland Expedition", duration: 3, difficulty: "challenging", start: "Opuwo", end: "Opuwo", highlights: "Himba Culture, Epupa Falls, Remote Wilderness", season: "April-November", distance: 400 },
  { name: "Caprivi Wildlife Trail", duration: 3, difficulty: "easy", start: "Rundu", end: "Katima Mulilo", highlights: "Bwabwata NP, Mahango, Mudumu, Boat Safaris", season: "May-October", distance: 500 },
  { name: "Central Namibia Explorer", duration: 3, difficulty: "moderate", start: "Windhoek", end: "Windhoek", highlights: "Waterberg, Otjiwarongo, Erongo Mountains", season: "Year-round", distance: 600 },
  { name: "Namib Desert Immersion", duration: 3, difficulty: "moderate", start: "Swakopmund", end: "Sesriem", highlights: "NamibRand Reserve, Sossusvlei, Desert Wildlife", season: "Year-round", distance: 400 },
  { name: "Coastal Adventure Trail", duration: 3, difficulty: "moderate", start: "Walvis Bay", end: "Lüderitz", highlights: "Sandwich Harbour, Coastal Towns, Penguins", season: "Year-round", distance: 450 },
  
  // === 5-DAY TOURS ===
  { name: "Namibia Highlights", duration: 5, difficulty: "moderate", start: "Windhoek", end: "Windhoek", highlights: "Sossusvlei, Swakopmund, Damaraland, Etosha", season: "Year-round", distance: 1800 },
  { name: "Southern Circuit", duration: 5, difficulty: "moderate", start: "Windhoek", end: "Windhoek", highlights: "Kalahari, Fish River, Lüderitz, Sossusvlei", season: "April-October", distance: 2000 },
  { name: "Northern Safari", duration: 5, difficulty: "moderate", start: "Windhoek", end: "Windhoek", highlights: "Etosha, Damaraland, Skeleton Coast", season: "May-October", distance: 1600 },
  { name: "Caprivi & Victoria Falls", duration: 5, difficulty: "easy", start: "Windhoek", end: "Victoria Falls", highlights: "Caprivi Strip, Chobe, Victoria Falls", season: "May-October", distance: 1400 },
  { name: "Desert & Coast Adventure", duration: 5, difficulty: "moderate", start: "Windhoek", end: "Windhoek", highlights: "Namib Desert, Swakopmund, Skeleton Coast", season: "Year-round", distance: 1200 },
  
  // === 7-DAY TOURS ===
  { name: "Ultimate Namibia Circuit", duration: 7, difficulty: "moderate", start: "Windhoek", end: "Windhoek", highlights: "Sossusvlei, Swakopmund, Etosha, Damaraland", season: "April-November", distance: 2000 },
  { name: "Complete Safari Experience", duration: 7, difficulty: "moderate", start: "Windhoek", end: "Windhoek", highlights: "Etosha, Waterberg, Damaraland, Coast", season: "May-October", distance: 2200 },
  { name: "Photographer's Paradise", duration: 7, difficulty: "moderate", start: "Windhoek", end: "Windhoek", highlights: "Best Photo Locations, Golden Hour Shoots", season: "April-October", distance: 1800 },
  { name: "Family Adventure", duration: 7, difficulty: "easy", start: "Windhoek", end: "Windhoek", highlights: "Kid-Friendly Activities, Wildlife, Beach", season: "Year-round", distance: 1600 },
  { name: "Luxury Safari", duration: 7, difficulty: "easy", start: "Windhoek", end: "Windhoek", highlights: "Premium Lodges, Private Game Drives", season: "Year-round", distance: 1500 },
  
  // === 10-DAY TOURS ===
  { name: "Namibia In-Depth", duration: 10, difficulty: "moderate", start: "Windhoek", end: "Windhoek", highlights: "All Major Attractions, Hidden Gems", season: "April-November", distance: 3000 },
  { name: "Self-Drive Adventure", duration: 10, difficulty: "moderate", start: "Windhoek", end: "Windhoek", highlights: "Flexible Itinerary, 4x4 Trails", season: "Year-round", distance: 2800 },
  { name: "Wildlife & Culture", duration: 10, difficulty: "moderate", start: "Windhoek", end: "Windhoek", highlights: "Safaris, Tribal Visits, Conservation", season: "Year-round", distance: 2500 },
  { name: "North to South Traverse", duration: 10, difficulty: "moderate", start: "Katima Mulilo", end: "Lüderitz", highlights: "Caprivi to Fish River Canyon", season: "May-October", distance: 2200 },
  { name: "Birding Expedition", duration: 10, difficulty: "easy", start: "Windhoek", end: "Windhoek", highlights: "600+ Bird Species, Wetlands, Desert Birds", season: "November-April", distance: 2000 },
  
  // === 14-DAY TOURS ===
  { name: "Grand Namibia Explorer", duration: 14, difficulty: "moderate", start: "Windhoek", end: "Windhoek", highlights: "All Major Attractions, Caprivi, Fish River", season: "April-November", distance: 4500 },
  { name: "Complete Country Tour", duration: 14, difficulty: "moderate", start: "Windhoek", end: "Windhoek", highlights: "Every Region, Cultural Immersion", season: "Year-round", distance: 4000 },
  { name: "Photography Masterclass", duration: 14, difficulty: "moderate", start: "Windhoek", end: "Windhoek", highlights: "All Iconic Locations, Night Sky", season: "April-October", distance: 3500 },
  { name: "Honeymoon Special", duration: 14, difficulty: "easy", start: "Windhoek", end: "Windhoek", highlights: "Romantic Lodges, Private Experiences", season: "Year-round", distance: 3000 },
  { name: "Conservation Journey", duration: 14, difficulty: "moderate", start: "Windhoek", end: "Windhoek", highlights: "Rhino Tracking, Cheetah Projects, Community", season: "Year-round", distance: 3200 },
  
  // === 21-DAY TOURS ===
  { name: "Namibia Ultimate Experience", duration: 21, difficulty: "moderate", start: "Windhoek", end: "Windhoek", highlights: "Complete Country, Off-the-Beaten-Path", season: "April-November", distance: 5500 },
  { name: "Southern Africa Combo", duration: 21, difficulty: "moderate", start: "Windhoek", end: "Cape Town", highlights: "Namibia, Botswana, South Africa", season: "May-October", distance: 4000 },
  { name: "Overlander's Dream", duration: 21, difficulty: "challenging", start: "Windhoek", end: "Windhoek", highlights: "Remote Areas, Camping, 4x4 Adventure", season: "April-October", distance: 5000 },
  { name: "Cultural Immersion", duration: 21, difficulty: "moderate", start: "Windhoek", end: "Windhoek", highlights: "All Tribal Groups, Traditional Stays", season: "Year-round", distance: 4500 },
  { name: "Wildlife Photography Safari", duration: 21, difficulty: "moderate", start: "Windhoek", end: "Windhoek", highlights: "Big Five, Desert Species, Birds", season: "May-October", distance: 4800 },
  
  // === 30-DAY TOURS ===
  { name: "Complete Namibia Discovery", duration: 30, difficulty: "moderate", start: "Windhoek", end: "Windhoek", highlights: "Every Corner of Namibia", season: "April-November", distance: 7000 },
  { name: "Trans-Namibia Expedition", duration: 30, difficulty: "challenging", start: "Windhoek", end: "Windhoek", highlights: "Remote Wilderness, 4x4 Required", season: "April-October", distance: 6500 },
  { name: "Slow Travel Experience", duration: 30, difficulty: "easy", start: "Windhoek", end: "Windhoek", highlights: "Extended Stays, Deep Exploration", season: "Year-round", distance: 5000 },
  { name: "Research & Conservation", duration: 30, difficulty: "moderate", start: "Windhoek", end: "Windhoek", highlights: "Volunteer Work, Wildlife Monitoring", season: "Year-round", distance: 4500 },
  { name: "Ultimate African Adventure", duration: 30, difficulty: "moderate", start: "Windhoek", end: "Victoria Falls", highlights: "Namibia, Botswana, Zimbabwe", season: "May-October", distance: 5500 },
  
  // Additional routes for variety
  { name: "Brandberg Mountain Trek", duration: 2, difficulty: "challenging", start: "Swakopmund", end: "Swakopmund", highlights: "White Lady Rock Art, Highest Peak", season: "April-October", distance: 300 },
  { name: "Spitzkoppe Camping", duration: 2, difficulty: "moderate", start: "Swakopmund", end: "Swakopmund", highlights: "Granite Peaks, Rock Climbing, Stargazing", season: "Year-round", distance: 200 },
  { name: "Namib-Naukluft Traverse", duration: 4, difficulty: "challenging", start: "Sesriem", end: "Swakopmund", highlights: "Desert Crossing, Kuiseb Canyon", season: "April-October", distance: 350 },
  { name: "Bushmanland Experience", duration: 3, difficulty: "moderate", start: "Rundu", end: "Rundu", highlights: "San Culture, Traditional Hunting, Crafts", season: "Year-round", distance: 250 },
  { name: "Zambezi Region Safari", duration: 4, difficulty: "easy", start: "Katima Mulilo", end: "Katima Mulilo", highlights: "Four National Parks, River Safaris", season: "May-October", distance: 400 },
  { name: "Aus & Wild Horses", duration: 2, difficulty: "easy", start: "Lüderitz", end: "Lüderitz", highlights: "Wild Desert Horses, Ghost Towns", season: "Year-round", distance: 150 },
  { name: "Okonjima AfriCat", duration: 2, difficulty: "easy", start: "Windhoek", end: "Windhoek", highlights: "Big Cat Conservation, Tracking", season: "Year-round", distance: 300 },
];

// Route stops data
const routeStops = {
  "Sossusvlei Sunrise Adventure": [
    { name: "Dune 45", desc: "Iconic red dune perfect for sunrise climbing", lat: "-24.7297", lng: "15.4744", duration: "2 hours", activities: "Dune climbing, Photography" },
    { name: "Sossusvlei Pan", desc: "White clay pan surrounded by towering dunes", lat: "-24.7333", lng: "15.2833", duration: "2 hours", activities: "Walking, Photography" },
    { name: "Deadvlei", desc: "Ancient camel thorn trees in white clay pan", lat: "-24.7600", lng: "15.2928", duration: "2 hours", activities: "Photography, Walking" }
  ],
  "Swakopmund Desert Explorer": [
    { name: "Moon Landscape", desc: "Eroded valleys resembling lunar surface", lat: "-22.8167", lng: "14.9333", duration: "2 hours", activities: "Photography, Walking" },
    { name: "Welwitschia Plains", desc: "Ancient plants over 1000 years old", lat: "-22.8500", lng: "14.8833", duration: "1 hour", activities: "Nature walks, Photography" },
    { name: "Dune 7", desc: "One of the highest dunes in the area", lat: "-22.9167", lng: "14.5167", duration: "2 hours", activities: "Sandboarding, Dune climbing" }
  ],
  "Etosha Wildlife Safari": [
    { name: "Okaukuejo Waterhole", desc: "Famous floodlit waterhole for night viewing", lat: "-18.9167", lng: "16.0833", duration: "3 hours", activities: "Game viewing, Photography" },
    { name: "Halali Camp", desc: "Central camp with waterhole", lat: "-18.8500", lng: "16.4667", duration: "2 hours", activities: "Game viewing, Lunch break" },
    { name: "Fischer's Pan", desc: "Large pan attracting flamingos", lat: "-18.8000", lng: "16.6000", duration: "2 hours", activities: "Bird watching, Photography" }
  ],
  "Ultimate Namibia Circuit": [
    { name: "Sossusvlei", desc: "Iconic red dunes of the Namib", lat: "-24.7333", lng: "15.2833", duration: "Full day", activities: "Dune climbing, Photography, Hot air balloon" },
    { name: "Swakopmund", desc: "Coastal adventure town", lat: "-22.6833", lng: "14.5333", duration: "Full day", activities: "Adventure sports, Beach, Shopping" },
    { name: "Damaraland", desc: "Desert-adapted wildlife and rock art", lat: "-20.5833", lng: "14.3667", duration: "Full day", activities: "Wildlife tracking, Rock art tours" },
    { name: "Etosha National Park", desc: "Premier wildlife destination", lat: "-18.9167", lng: "16.0833", duration: "2 days", activities: "Game drives, Waterhole viewing" }
  ],
  "Grand Namibia Explorer": [
    { name: "Kalahari Desert", desc: "Red sand dunes and Bushman culture", lat: "-24.0000", lng: "18.0000", duration: "Full day", activities: "Nature walks, Cultural tours" },
    { name: "Fish River Canyon", desc: "Second largest canyon in the world", lat: "-27.5833", lng: "17.5833", duration: "Full day", activities: "Hiking, Photography" },
    { name: "Lüderitz", desc: "German colonial town on the coast", lat: "-26.6500", lng: "15.1500", duration: "Full day", activities: "Ghost town tours, Penguin viewing" },
    { name: "Sossusvlei", desc: "Iconic red dunes", lat: "-24.7333", lng: "15.2833", duration: "2 days", activities: "Dune climbing, Hot air balloon" },
    { name: "Swakopmund", desc: "Adventure capital", lat: "-22.6833", lng: "14.5333", duration: "2 days", activities: "Adventure sports, Dolphin cruises" },
    { name: "Etosha", desc: "Wildlife paradise", lat: "-18.9167", lng: "16.0833", duration: "3 days", activities: "Game drives, Night drives" },
    { name: "Caprivi Strip", desc: "Waterways and wildlife", lat: "-18.0000", lng: "21.0000", duration: "2 days", activities: "Boat safaris, Fishing" }
  ]
};

async function seedRoutes() {
  await client.connect();
  console.log('Connected to Supabase');
  
  // Clear existing routes first
  await client.query('DELETE FROM namibia_na_26_route_stops');
  await client.query('DELETE FROM namibia_na_26_routes');
  console.log('Cleared existing routes');
  
  let routeCount = 0;
  let stopCount = 0;
  
  for (const route of routes) {
    const slug = route.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    try {
      // Insert route
      const routeRes = await client.query(`
        INSERT INTO namibia_na_26_routes (name, slug, description, short_description, duration, difficulty, distance, highlights, best_time_to_visit, start_location, end_location, is_featured, is_active, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, true, NOW(), NOW())
        RETURNING id
      `, [
        route.name, 
        slug, 
        `Explore ${route.name} - a ${route.duration}-day adventure through Namibia's most spectacular landscapes. Starting from ${route.start}, this journey takes you through ${route.highlights}.`,
        route.highlights, 
        route.duration, 
        route.difficulty, 
        route.distance, 
        route.highlights, 
        route.season, 
        route.start, 
        route.end,
        route.duration >= 7 // Feature longer routes
      ]);
      
      const routeId = routeRes.rows[0].id;
      routeCount++;
      
      // Add stops if available
      const stops = routeStops[route.name];
      if (stops) {
        for (let i = 0; i < stops.length; i++) {
          const stop = stops[i];
          await client.query(`
            INSERT INTO namibia_na_26_route_stops (route_id, day_number, stop_order, name, description, latitude, longitude, duration, activities, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
          `, [routeId, Math.ceil((i + 1) / 3), i + 1, stop.name, stop.desc, stop.lat, stop.lng, stop.duration, stop.activities]);
          stopCount++;
        }
      }
      
      if (routeCount % 10 === 0) {
        console.log(`Progress: ${routeCount} routes created...`);
      }
    } catch (err) {
      console.log('Error:', route.name, err.message);
    }
  }
  
  console.log(`\n=== Seeding Complete ===`);
  console.log(`Routes created: ${routeCount}`);
  console.log(`Stops created: ${stopCount}`);
  
  await client.end();
}

seedRoutes().catch(console.error);

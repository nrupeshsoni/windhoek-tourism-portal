import pg from 'pg';

const client = new pg.Client('postgresql://postgres.fykchaqksvuwweuzgkxt:hUX347Rcy%25Pu_.q@aws-0-eu-central-1.pooler.supabase.com:6543/postgres');

const routes = [
  // 1-Day Tours
  { name: "Sossusvlei Sunrise Adventure", duration: 1, difficulty: "moderate", start: "Sesriem", end: "Sesriem", highlights: "Dune 45, Deadvlei, Big Daddy Dune", season: "April-October", distance: 120, stops: [
    { name: "Dune 45", desc: "Iconic red dune perfect for sunrise climbing", lat: "-24.7297", lng: "15.4744", duration: "2 hours", activities: "Dune climbing, Photography" },
    { name: "Sossusvlei Pan", desc: "White clay pan surrounded by towering dunes", lat: "-24.7333", lng: "15.2833", duration: "2 hours", activities: "Walking, Photography" },
    { name: "Deadvlei", desc: "Ancient camel thorn trees in white clay pan", lat: "-24.7600", lng: "15.2928", duration: "2 hours", activities: "Photography, Walking" }
  ]},
  { name: "Swakopmund Desert Explorer", duration: 1, difficulty: "easy", start: "Swakopmund", end: "Swakopmund", highlights: "Moon Landscape, Welwitschia Plains, Dune 7", season: "Year-round", distance: 80, stops: [
    { name: "Moon Landscape", desc: "Eroded valleys resembling lunar surface", lat: "-22.8167", lng: "14.9333", duration: "2 hours", activities: "Photography, Walking" },
    { name: "Welwitschia Plains", desc: "Ancient plants over 1000 years old", lat: "-22.8500", lng: "14.8833", duration: "1 hour", activities: "Nature walks, Photography" },
    { name: "Dune 7", desc: "One of the highest dunes in the area", lat: "-22.9167", lng: "14.5167", duration: "2 hours", activities: "Sandboarding, Dune climbing" }
  ]},
  { name: "Etosha Wildlife Safari", duration: 1, difficulty: "easy", start: "Okaukuejo", end: "Okaukuejo", highlights: "Okaukuejo Waterhole, Halali, Namutoni", season: "May-October", distance: 150, stops: [
    { name: "Okaukuejo Waterhole", desc: "Famous floodlit waterhole for night viewing", lat: "-18.9167", lng: "16.0833", duration: "3 hours", activities: "Game viewing, Photography" },
    { name: "Halali Camp", desc: "Central camp with waterhole", lat: "-18.8500", lng: "16.4667", duration: "2 hours", activities: "Game viewing, Lunch break" },
    { name: "Fischer's Pan", desc: "Large pan attracting flamingos", lat: "-18.8000", lng: "16.6000", duration: "2 hours", activities: "Bird watching, Photography" }
  ]},
  // 3-Day Tours
  { name: "Skeleton Coast Adventure", duration: 3, difficulty: "moderate", start: "Swakopmund", end: "Terrace Bay", highlights: "Shipwrecks, Cape Cross Seals, Desert Lions", season: "Year-round", distance: 400, stops: [
    { name: "Cape Cross Seal Colony", desc: "Largest seal colony in Southern Africa", lat: "-21.7833", lng: "13.9500", duration: "2 hours", activities: "Wildlife viewing, Photography" },
    { name: "Skeleton Coast Gate", desc: "Entrance to the Skeleton Coast Park", lat: "-21.0000", lng: "13.5000", duration: "1 hour", activities: "Scenic drive, Photography" },
    { name: "Terrace Bay", desc: "Remote fishing camp on the coast", lat: "-19.9833", lng: "13.0333", duration: "Overnight", activities: "Fishing, Beach walks, Stargazing" }
  ]},
  { name: "Damaraland Cultural Journey", duration: 3, difficulty: "moderate", start: "Windhoek", end: "Twyfelfontein", highlights: "Twyfelfontein Rock Art, Desert Elephants, Petrified Forest", season: "Year-round", distance: 450, stops: [
    { name: "Petrified Forest", desc: "Ancient fossilized trees", lat: "-20.0167", lng: "14.4333", duration: "2 hours", activities: "Walking, Photography" },
    { name: "Twyfelfontein", desc: "UNESCO World Heritage rock engravings", lat: "-20.5833", lng: "14.3667", duration: "3 hours", activities: "Guided tours, Photography" },
    { name: "Damara Living Museum", desc: "Traditional Damara culture experience", lat: "-20.4333", lng: "14.4167", duration: "2 hours", activities: "Cultural tours, Craft shopping" }
  ]},
  // 7-Day Tours
  { name: "Ultimate Namibia Circuit", duration: 7, difficulty: "moderate", start: "Windhoek", end: "Windhoek", highlights: "Sossusvlei, Swakopmund, Etosha, Damaraland", season: "April-November", distance: 2000, stops: [
    { name: "Sossusvlei", desc: "Iconic red dunes of the Namib", lat: "-24.7333", lng: "15.2833", duration: "Full day", activities: "Dune climbing, Photography, Hot air balloon" },
    { name: "Swakopmund", desc: "Coastal adventure town", lat: "-22.6833", lng: "14.5333", duration: "Full day", activities: "Adventure sports, Beach, Shopping" },
    { name: "Damaraland", desc: "Desert-adapted wildlife and rock art", lat: "-20.5833", lng: "14.3667", duration: "Full day", activities: "Wildlife tracking, Rock art tours" },
    { name: "Etosha National Park", desc: "Premier wildlife destination", lat: "-18.9167", lng: "16.0833", duration: "2 days", activities: "Game drives, Waterhole viewing" }
  ]},
  // 14-Day Tours
  { name: "Grand Namibia Explorer", duration: 14, difficulty: "moderate", start: "Windhoek", end: "Windhoek", highlights: "All major attractions, Caprivi Strip, Fish River Canyon", season: "April-November", distance: 4500, stops: [
    { name: "Kalahari Desert", desc: "Red sand dunes and Bushman culture", lat: "-24.0000", lng: "18.0000", duration: "Full day", activities: "Nature walks, Cultural tours" },
    { name: "Fish River Canyon", desc: "Second largest canyon in the world", lat: "-27.5833", lng: "17.5833", duration: "Full day", activities: "Hiking, Photography" },
    { name: "Lüderitz", desc: "German colonial town on the coast", lat: "-26.6500", lng: "15.1500", duration: "Full day", activities: "Ghost town tours, Penguin viewing" },
    { name: "Sossusvlei", desc: "Iconic red dunes", lat: "-24.7333", lng: "15.2833", duration: "2 days", activities: "Dune climbing, Hot air balloon" },
    { name: "Swakopmund", desc: "Adventure capital", lat: "-22.6833", lng: "14.5333", duration: "2 days", activities: "Adventure sports, Dolphin cruises" },
    { name: "Etosha", desc: "Wildlife paradise", lat: "-18.9167", lng: "16.0833", duration: "3 days", activities: "Game drives, Night drives" },
    { name: "Caprivi Strip", desc: "Waterways and wildlife", lat: "-18.0000", lng: "21.0000", duration: "2 days", activities: "Boat safaris, Fishing" }
  ]}
];

async function seedRoutes() {
  await client.connect();
  console.log('Connected to Supabase');
  
  for (const route of routes) {
    const slug = route.name.toLowerCase().replace(/\s+/g, '-');
    try {
      // Insert route
      const routeRes = await client.query(`
        INSERT INTO namibia_na_26_routes (name, slug, description, short_description, duration, difficulty, distance, highlights, best_time_to_visit, start_location, end_location, is_featured, is_active, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, true, true, NOW(), NOW())
        RETURNING id
      `, [route.name, slug, `Explore ${route.name} - a ${route.duration}-day adventure through Namibia's most spectacular landscapes.`, route.highlights, route.duration, route.difficulty, route.distance, route.highlights, route.season, route.start, route.end]);
      
      const routeId = routeRes.rows[0].id;
      console.log('Created route:', route.name, '(ID:', routeId, ')');
      
      // Add stops
      for (let i = 0; i < route.stops.length; i++) {
        const stop = route.stops[i];
        await client.query(`
          INSERT INTO namibia_na_26_route_stops (route_id, day_number, stop_order, name, description, latitude, longitude, duration, activities, created_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
        `, [routeId, Math.ceil((i + 1) / 3), i + 1, stop.name, stop.desc, stop.lat, stop.lng, stop.duration, stop.activities]);
      }
      console.log('  Added', route.stops.length, 'stops');
    } catch (err) {
      console.log('Error:', route.name, err.message);
    }
  }
  
  // Check final counts
  const routeCount = await client.query('SELECT COUNT(*) FROM namibia_na_26_routes');
  const stopCount = await client.query('SELECT COUNT(*) FROM namibia_na_26_route_stops');
  console.log('\\nFinal counts:');
  console.log('  Routes:', routeCount.rows[0].count);
  console.log('  Stops:', stopCount.rows[0].count);
  
  await client.end();
  console.log('Done!');
}

seedRoutes().catch(console.error);

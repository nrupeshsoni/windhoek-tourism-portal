import { drizzle } from "drizzle-orm/mysql2";
import { routes } from "./drizzle/schema";
import { eq } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL!);

// Seasonal information for Namibia routes
const seasonalData: Record<string, {
  bestSeasons: string[];
  seasonalTips: string;
  wildlife: string;
  weather: string;
}> = {
  // Wildlife routes - best in dry season
  "etosha-quick-safari": {
    bestSeasons: ["May", "June", "July", "August", "September", "October"],
    seasonalTips: "Dry season (May-Oct) offers best wildlife viewing as animals gather at waterholes. June-August can be cold at night.",
    wildlife: "Peak wildlife concentration at waterholes. Lions, elephants, rhinos, and large herds of zebra and wildebeest easily spotted.",
    weather: "Dry and sunny days, cold nights (can drop to 5°C). Minimal rainfall."
  },
  "complete-namibia-experience": {
    bestSeasons: ["May", "June", "July", "August", "September"],
    seasonalTips: "Best visited during dry season for optimal wildlife viewing in Etosha and comfortable desert temperatures.",
    wildlife: "Excellent game viewing in Etosha. Desert-adapted wildlife in Damaraland year-round.",
    weather: "Pleasant temperatures for desert activities. Clear skies ideal for stargazing."
  },
  "ultimate-namibia-adventure": {
    bestSeasons: ["April", "May", "June", "July", "August", "September", "October"],
    seasonalTips: "Extended dry season window allows flexibility. April and October offer shoulder season benefits with fewer crowds.",
    wildlife: "Best wildlife viewing May-September. Green season (Nov-Mar) offers lush landscapes and bird watching.",
    weather: "Variable across regions. Pack layers for desert nights and warm days."
  },
  "grand-namibia-discovery": {
    bestSeasons: ["May", "June", "July", "August", "September"],
    seasonalTips: "Comprehensive route best in dry season. Fish River Canyon hiking only open May-September due to heat.",
    wildlife: "Diverse wildlife across multiple ecosystems. Seal colony at Cape Cross year-round.",
    weather: "Ideal conditions for hiking and outdoor activities. Coastal areas cooler year-round."
  },
  // Desert routes - avoid extreme summer heat
  "sossusvlei-express": {
    bestSeasons: ["March", "April", "May", "June", "July", "August", "September", "October"],
    seasonalTips: "Avoid Dec-Feb when temperatures exceed 40°C. Early morning visits essential for photography and comfortable walking.",
    wildlife: "Oryx, springbok, and ostriches common. Desert-adapted species active early morning.",
    weather: "Hot days year-round. Winter (Jun-Aug) offers pleasant hiking temperatures."
  },
  "sossusvlei-day-adventure": {
    bestSeasons: ["April", "May", "June", "July", "August", "September", "October"],
    seasonalTips: "Start before sunrise for best light and cooler temperatures. Summer months extremely hot.",
    wildlife: "Desert wildlife most active at dawn. Look for tracks in the dunes.",
    weather: "Clear skies ideal for photography. Winter mornings can be cold."
  },
  "southern-namibia-explorer": {
    bestSeasons: ["April", "May", "June", "July", "August", "September"],
    seasonalTips: "Fish River Canyon hiking trail only open May 1 - September 15. Kolmanskop best visited morning for light.",
    wildlife: "Wild horses near Aus. Desert wildlife along canyon rim.",
    weather: "Extreme heat in summer makes hiking dangerous. Winter ideal for outdoor activities."
  },
  // Coastal routes - year-round but foggy in winter
  "swakopmund-adventure-day": {
    bestSeasons: ["September", "October", "November", "December", "January", "February", "March"],
    seasonalTips: "Coastal fog common May-August but creates unique atmosphere. Summer offers clearer skies for activities.",
    wildlife: "Cape fur seals year-round. Dolphins and whales seasonal (Jul-Nov).",
    weather: "Cool and foggy in winter, warm and sunny in summer. Always cooler than inland."
  },
  // City routes - year-round
  "windhoek-city-discovery": {
    bestSeasons: ["All year"],
    seasonalTips: "Pleasant year-round. Summer (Oct-Apr) brings afternoon thunderstorms. Winter (May-Sep) dry and sunny.",
    wildlife: "Urban wildlife in parks. Nearby game reserves accessible year-round.",
    weather: "Mild climate at 1,700m elevation. Summer highs around 30°C, winter nights can be cold."
  },
  // Classic route - dry season best
  "classic-namibia-highlights": {
    bestSeasons: ["May", "June", "July", "August", "September", "October"],
    seasonalTips: "Dry season offers best overall experience. Wildlife viewing peaks June-September.",
    wildlife: "Excellent game viewing in Etosha. Desert wildlife in Sossusvlei area.",
    weather: "Comfortable temperatures for all activities. Pack layers for desert temperature swings."
  }
};

async function addSeasonalInfo() {
  console.log("Adding seasonal information to routes...\n");

  for (const [slug, info] of Object.entries(seasonalData)) {
    const seasonalInfo = JSON.stringify({
      bestSeasons: info.bestSeasons,
      seasonalTips: info.seasonalTips,
      wildlife: info.wildlife,
      weather: info.weather
    });

    try {
      await db.update(routes)
        .set({ 
          seasonalInfo,
          bestTimeToVisit: info.bestSeasons.length === 1 && info.bestSeasons[0] === "All year" 
            ? "Year-round destination" 
            : `Best: ${info.bestSeasons.slice(0, 3).join(", ")}${info.bestSeasons.length > 3 ? "..." : ""}`
        })
        .where(eq(routes.slug, slug));
      
      console.log(`✓ Updated: ${slug}`);
    } catch (error) {
      console.log(`✗ Failed: ${slug} - ${error}`);
    }
  }

  console.log("\nSeasonal information added successfully!");
  process.exit(0);
}

addSeasonalInfo();

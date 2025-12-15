/**
 * Script to assign regions to existing listings based on city/location
 */
import { drizzle } from "drizzle-orm/mysql2";
import { listings } from "./drizzle/schema";
import { eq, isNull, or, sql } from "drizzle-orm";
import dotenv from "dotenv";

dotenv.config();

const LOCATION_TO_REGION: Record<string, string> = {
  // Erongo
  "swakopmund": "erongo",
  "walvis bay": "erongo",
  "walvis": "erongo",
  "spitzkoppe": "erongo",
  "henties bay": "erongo",
  "skeleton coast": "erongo",
  "usakos": "erongo",
  "karibib": "erongo",
  "omaruru": "erongo",
  "cape cross": "erongo",
  
  // Hardap
  "mariental": "hardap",
  "fish river": "hardap",
  "maltahohe": "hardap",
  "stampriet": "hardap",
  "rehoboth": "hardap",
  "sossusvlei": "hardap",
  "sesriem": "hardap",
  "namib-naukluft": "hardap",
  "naukluft": "hardap",
  "solitaire": "hardap",
  
  // //Karas
  "keetmanshoop": "karas",
  "luderitz": "karas",
  "lüderitz": "karas",
  "kolmanskop": "karas",
  "ai-ais": "karas",
  "aus": "karas",
  "karasburg": "karas",
  "oranjemund": "karas",
  "grünau": "karas",
  "grunau": "karas",
  
  // Kavango East
  "rundu": "kavango-east",
  "divundu": "kavango-east",
  "popa falls": "kavango-east",
  
  // Kavango West
  "nkurenkuru": "kavango-west",
  
  // Khomas
  "windhoek": "khomas",
  "daan viljoen": "khomas",
  "hosea kutako": "khomas",
  
  // Kunene
  "opuwo": "kunene",
  "epupa": "kunene",
  "damaraland": "kunene",
  "khorixas": "kunene",
  "sesfontein": "kunene",
  "palmwag": "kunene",
  "twyfelfontein": "kunene",
  "kamanjab": "kunene",
  
  // Ohangwena
  "eenhana": "ohangwena",
  "ondangwa": "ohangwena",
  "helao nafidi": "ohangwena",
  
  // Omaheke
  "gobabis": "omaheke",
  "buitepos": "omaheke",
  "leonardville": "omaheke",
  
  // Omusati
  "outapi": "omusati",
  "ruacana": "omusati",
  "oshikuku": "omusati",
  
  // Oshana
  "oshakati": "oshana",
  
  // Oshikoto
  "tsumeb": "oshikoto",
  "etosha": "oshikoto",
  "otjikoto": "oshikoto",
  "namutoni": "oshikoto",
  "okaukuejo": "oshikoto",
  "halali": "oshikoto",
  
  // Otjozondjupa
  "otjiwarongo": "otjozondjupa",
  "waterberg": "otjozondjupa",
  "okonjima": "otjozondjupa",
  "grootfontein": "otjozondjupa",
  "okahandja": "otjozondjupa",
  "outjo": "otjozondjupa",
  
  // Zambezi (Caprivi)
  "katima mulilo": "zambezi",
  "katima": "zambezi",
  "caprivi": "zambezi",
  "zambezi": "zambezi",
  "kongola": "zambezi",
  "kasane": "zambezi",
};

async function assignRegions() {
  const db = drizzle(process.env.DATABASE_URL!);
  
  console.log("🗺️ Assigning regions to listings...\n");
  
  // Get all listings without a region
  const allListings = await db.select().from(listings);
  
  let updated = 0;
  let skipped = 0;
  
  for (const listing of allListings) {
    if (listing.region) {
      skipped++;
      continue;
    }
    
    // Try to determine region from city
    const city = (listing.city || "").toLowerCase().trim();
    const name = (listing.name || "").toLowerCase();
    
    let regionId: string | undefined;
    
    // Check city first
    for (const [location, region] of Object.entries(LOCATION_TO_REGION)) {
      if (city.includes(location) || location.includes(city)) {
        regionId = region;
        break;
      }
    }
    
    // If no match from city, check name
    if (!regionId) {
      for (const [location, region] of Object.entries(LOCATION_TO_REGION)) {
        if (name.includes(location)) {
          regionId = region;
          break;
        }
      }
    }
    
    // Default to khomas (Windhoek) if no match
    if (!regionId) {
      regionId = "khomas";
    }
    
    // Update the listing
    await db.update(listings)
      .set({ region: regionId })
      .where(eq(listings.id, listing.id));
    
    updated++;
    
    if (updated % 500 === 0) {
      console.log(`   ✅ Updated ${updated} listings...`);
    }
  }
  
  console.log("\n==================================================");
  console.log("📊 SUMMARY");
  console.log("==================================================");
  console.log(`   🗺️ Listings updated: ${updated}`);
  console.log(`   ⏭️ Already had region: ${skipped}`);
  console.log("✅ Complete!");
  
  process.exit(0);
}

assignRegions().catch(console.error);

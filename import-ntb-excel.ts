/**
 * NTB Excel Data Import Script
 * 
 * This script imports business data from the Namibia Tourism Board registry Excel file.
 * 
 * Usage:
 *   npx tsx import-ntb-excel.ts
 */

import { drizzle } from "drizzle-orm/mysql2";
import { listings, categories } from "./drizzle/schema";
import { eq } from "drizzle-orm";
import XLSX from "xlsx";

const db = drizzle(process.env.DATABASE_URL!);

// NTB category to platform category mapping
const categoryMapping: Record<string, string> = {
  // Accommodation
  "Hotel": "lodges-hotels",
  "Pension Hotel": "lodges-hotels",
  "Lodge": "lodges-hotels",
  "Tented Lodge": "lodges-hotels",
  "Tented Lodge With Campsite": "lodges-hotels",
  "Permanent Tented Camp": "lodges-hotels",
  "Resorts": "lodges-hotels",
  "Resort": "lodges-hotels",
  "Conference Center": "conference-events",
  "Conference Centre": "conference-events",
  "Guest House": "guest-houses",
  "Guesthouse": "guest-houses",
  "B&B": "guest-houses",
  "Bed & Breakfast": "guest-houses",
  "Guest Farm": "guest-houses",
  "Rest Camp": "guest-houses",
  "Backpackers Hostel": "guest-houses",
  "Backpackers": "guest-houses",
  "Self Catering Accommodation": "guest-houses",
  "Self-Catering": "guest-houses",
  "Campsites & Caravan Parks": "campsites",
  "Campsite": "campsites",
  "Caravan Park": "campsites",
  
  // Tour Operations
  "Tour and Safari Operator": "tour-operators",
  "Tour And Safari Operator": "tour-operators",
  "Tour & Safari Operator": "tour-operators",
  "Tour Operator": "tour-operators",
  "Safari Operator": "tour-operators",
  "Tour Facilitator": "tour-operators",
  "Foreign Tour Operator": "tour-operators",
  "Inbound Tour Operator": "tour-operators",
  "Tour Guide": "tour-guides",
  "Tourist Guide": "tour-guides",
  
  // Activities
  "Activity Operator": "adventure-activities",
  "Activity Operator (motorised)": "adventure-activities",
  "Activity Operator (non-motorised)": "adventure-activities",
  "Activity Operator (Motorised)": "adventure-activities",
  "Activity Operator (Non-Motorised)": "adventure-activities",
  
  // Hunting
  "Trophy Hunting With Accommodation": "safari-experiences",
  "Trophy Hunting without Accommodation": "safari-experiences",
  "Trophy Hunter without accommodation": "safari-experiences",
  "Hunting Farm": "safari-experiences",
  "Hunting Safari": "safari-experiences",
  
  // Transport
  "Shuttle And Transport": "shuttles-transfers",
  "Shuttle & Transport": "shuttles-transfers",
  "Shuttle Service": "shuttles-transfers",
  "Transport Service": "shuttles-transfers",
  "Vehicle Rental Operators": "car-rentals",
  "Vehicle Rental": "car-rentals",
  "Car Rental": "car-rentals",
  "Air Charter": "shuttles-transfers",
  
  // Other
  "Booking Agent": "tour-operators",
  "Travel Agent": "tour-operators",
  "Restaurant": "restaurants-dining",
  "Souvenir Shop": "shopping-crafts",
  "Gift Shop": "shopping-crafts",
  "Curio Shop": "shopping-crafts",
};

// Generate slug from business name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 200);
}

// Clean and standardize region names
function cleanRegion(region: string | undefined): string {
  if (!region) return "Unknown";
  
  const regionMap: Record<string, string> = {
    "KHOMAS": "Khomas",
    "khomas": "Khomas",
    "Khomas": "Khomas",
    "ERONGO": "Erongo",
    "erongo": "Erongo",
    "Erongo": "Erongo",
    "OTJOZONDJUPA": "Otjozondjupa",
    "otjozondjupa": "Otjozondjupa",
    "Otjozondjupa": "Otjozondjupa",
    "OSHANA": "Oshana",
    "Oshana": "Oshana",
    "OSHIKOTO": "Oshikoto",
    "Oshikoto": "Oshikoto",
    "OMUSATI": "Omusati",
    "Omusati": "Omusati",
    "OHANGWENA": "Ohangwena",
    "Ohangwena": "Ohangwena",
    "KUNENE": "Kunene",
    "Kunene": "Kunene",
    "KAVANGO EAST": "Kavango East",
    "Kavango East": "Kavango East",
    "KAVANGO WEST": "Kavango West",
    "Kavango West": "Kavango West",
    "ZAMBEZI": "Zambezi",
    "Zambezi": "Zambezi",
    "HARDAP": "Hardap",
    "Hardap": "Hardap",
    "KARAS": "Karas",
    "Karas": "Karas",
    "//KARAS": "Karas",
    "!Karas": "Karas",
    "OMAHEKE": "Omaheke",
    "Omaheke": "Omaheke",
  };
  
  const trimmed = region.trim();
  return regionMap[trimmed] || regionMap[trimmed.toUpperCase()] || trimmed;
}

// Clean city names
function cleanCity(city: string | undefined): string {
  if (!city) return "";
  
  const cityMap: Record<string, string> = {
    "Walvisbay": "Walvis Bay",
    "walvis bay": "Walvis Bay",
    "WALVIS BAY": "Walvis Bay",
    "Walvis bay": "Walvis Bay",
    "windhoek": "Windhoek",
    "WINDHOEK": "Windhoek",
    "swakopmund": "Swakopmund",
    "SWAKOPMUND": "Swakopmund",
  };
  
  const trimmed = city.trim();
  return cityMap[trimmed] || cityMap[trimmed.toLowerCase()] || trimmed;
}

// Find best matching column name
function findColumn(row: Record<string, any>, possibleNames: string[]): string {
  for (const name of possibleNames) {
    if (row[name] !== undefined) return row[name]?.toString() || '';
  }
  return '';
}

async function importNTBData() {
  const filePath = "/home/ubuntu/upload/RegisteredBusinessesUpdated02.06.2025(1).xlsx";
  
  console.log(`\n📂 Reading Excel file: ${filePath}\n`);
  
  // Read Excel file
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(sheet) as Record<string, any>[];
  
  console.log(`📊 Found ${data.length} records in sheet "${sheetName}"\n`);
  
  // Log first row to understand column names
  if (data.length > 0) {
    console.log("📋 Detected columns:", Object.keys(data[0]).join(", "));
    console.log("");
  }
  
  // Get all platform categories
  const platformCategories = await db.select().from(categories);
  const categoryMap = new Map(platformCategories.map(c => [c.slug, c.id]));
  
  console.log(`📁 Platform has ${platformCategories.length} categories\n`);
  
  let imported = 0;
  let skipped = 0;
  let errors = 0;
  let unmappedCategories = new Set<string>();
  const slugsUsed = new Set<string>();
  
  for (const row of data) {
    try {
      // Extract fields with flexible column name matching
      const ntbRegNo = findColumn(row, ['NTB Reg No_', 'NTB Reg No', 'Registration Number', 'Reg No', 'RegNo']);
      const businessName = findColumn(row, ['Business Trading Name', 'Business Name', 'Trading Name', 'Name', 'Company Name']);
      const ntbCategory = findColumn(row, ['Business Category', 'Category', 'Type', 'Business Type']);
      const phone = findColumn(row, ['Telephone No #', 'Telephone No', 'Phone', 'Telephone', 'Tel', 'Contact Number']);
      const email = findColumn(row, ['Email Address', 'Email', 'E-mail']);
      const city = findColumn(row, ['City', 'Town', 'Location']);
      const region = findColumn(row, ['Region', 'Province', 'Area']);
      
      if (!businessName || businessName.length < 2) {
        skipped++;
        continue;
      }
      
      // Map NTB category to platform category
      let platformCategorySlug = categoryMapping[ntbCategory];
      
      if (!platformCategorySlug) {
        // Try partial matching
        const lowerCategory = ntbCategory.toLowerCase();
        if (lowerCategory.includes('lodge') || lowerCategory.includes('hotel')) {
          platformCategorySlug = 'lodges-hotels';
        } else if (lowerCategory.includes('guest') || lowerCategory.includes('b&b')) {
          platformCategorySlug = 'guest-houses';
        } else if (lowerCategory.includes('camp')) {
          platformCategorySlug = 'campsites';
        } else if (lowerCategory.includes('tour') || lowerCategory.includes('safari')) {
          platformCategorySlug = 'tour-operators';
        } else if (lowerCategory.includes('guide')) {
          platformCategorySlug = 'tour-guides';
        } else if (lowerCategory.includes('activity')) {
          platformCategorySlug = 'adventure-activities';
        } else if (lowerCategory.includes('hunt')) {
          platformCategorySlug = 'safari-experiences';
        } else if (lowerCategory.includes('shuttle') || lowerCategory.includes('transport')) {
          platformCategorySlug = 'shuttles-transfers';
        } else if (lowerCategory.includes('rental') || lowerCategory.includes('car')) {
          platformCategorySlug = 'car-rentals';
        } else if (lowerCategory.includes('restaurant') || lowerCategory.includes('dining')) {
          platformCategorySlug = 'restaurants-dining';
        } else {
          // Default to tour operators for unmapped
          platformCategorySlug = 'tour-operators';
          unmappedCategories.add(ntbCategory);
        }
      }
      
      const categoryId = categoryMap.get(platformCategorySlug);
      
      if (!categoryId) {
        console.log(`⚠️ Platform category not found: ${platformCategorySlug}`);
        skipped++;
        continue;
      }
      
      // Generate unique slug
      let baseSlug = generateSlug(businessName);
      let slug = baseSlug;
      let slugSuffix = 0;
      
      while (slugsUsed.has(slug)) {
        slugSuffix++;
        slug = `${baseSlug}-${slugSuffix}`;
      }
      slugsUsed.add(slug);
      
      // Check if already exists in database
      const [existing] = await db
        .select()
        .from(listings)
        .where(eq(listings.ntbRegNo, ntbRegNo))
        .limit(1);
      
      if (existing) {
        skipped++;
        continue;
      }
      
      // Insert listing
      await db.insert(listings).values({
        categoryId,
        name: businessName,
        slug,
        description: `${businessName} is a registered ${ntbCategory.toLowerCase()} in ${cleanCity(city) || cleanRegion(region) || 'Namibia'}.`,
        shortDescription: `NTB-registered ${ntbCategory.toLowerCase()} in ${cleanRegion(region)}`,
        location: cleanCity(city) || null,
        region: cleanRegion(region),
        contactEmail: email || null,
        contactPhone: phone || null,
        ntbRegNo: ntbRegNo || null,
        isVerified: true,
        isActive: true,
        isFeatured: false,
      });
      
      imported++;
      
      if (imported % 500 === 0) {
        console.log(`✅ Imported ${imported} businesses...`);
      }
    } catch (error) {
      errors++;
      if (errors <= 10) {
        console.error(`❌ Error importing row:`, error);
      }
    }
  }
  
  console.log(`\n${"=".repeat(60)}`);
  console.log(`📊 IMPORT SUMMARY`);
  console.log(`${"=".repeat(60)}`);
  console.log(`   ✅ Imported: ${imported}`);
  console.log(`   ⏭️ Skipped: ${skipped}`);
  console.log(`   ❌ Errors: ${errors}`);
  console.log(`   📁 Total records: ${data.length}`);
  
  if (unmappedCategories.size > 0) {
    console.log(`\n⚠️ Unmapped NTB categories (defaulted to tour-operators):`);
    unmappedCategories.forEach(cat => console.log(`   - ${cat}`));
  }
  
  console.log(`\n✅ Import complete!`);
  process.exit(0);
}

importNTBData().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});

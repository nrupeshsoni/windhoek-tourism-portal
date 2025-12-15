/**
 * NTB Data Import Script
 * 
 * This script imports business data from the Namibia Tourism Board registry.
 * It handles Excel (.xlsx) or CSV files and maps NTB categories to platform categories.
 * 
 * Usage:
 *   npx tsx import-ntb-data.ts <path-to-file>
 * 
 * Expected columns in the file:
 *   - NTB Reg No_ (or similar): Registration number
 *   - Business Trading Name: Business name
 *   - Business Category: NTB category
 *   - Telephone No #: Phone number
 *   - Email Address: Email
 *   - City: City/town
 *   - Region: Region/province
 */

import { drizzle } from "drizzle-orm/mysql2";
import { listings, categories } from "./drizzle/schema";
import { eq } from "drizzle-orm";
import * as fs from "fs";
import * as path from "path";

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
  "Conference Center": "conference-events",
  "Guest House": "guest-houses",
  "B&B": "guest-houses",
  "Guest Farm": "guest-houses",
  "Rest Camp": "guest-houses",
  "Backpackers Hostel": "guest-houses",
  "Self Catering Accommodation": "guest-houses",
  "Campsites & Caravan Parks": "campsites",
  
  // Tour Operations
  "Tour and Safari Operator": "tour-operators",
  "Tour And Safari Operator": "tour-operators",
  "Tour Facilitator": "tour-operators",
  "Foreign Tour Operator": "tour-operators",
  "Tour Guide": "tour-guides",
  
  // Activities
  "Activity Operator": "adventure-activities",
  "Activity Operator (motorised)": "adventure-activities",
  "Activity Operator (non-motorised)": "adventure-activities",
  
  // Hunting
  "Trophy Hunting With Accommodation": "safari-experiences",
  "Trophy Hunter without accommodation": "safari-experiences",
  
  // Transport
  "Shuttle And Transport": "shuttles-transfers",
  "Vehicle Rental Operators": "car-rentals",
  "Air Charter": "shuttles-transfers",
  
  // Other
  "Booking Agent": "tour-operators",
  "Restaurant": "restaurants-dining",
  "Souvenir Shop": "shopping-crafts",
  "Gift Shop": "shopping-crafts",
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
    "ERONGO": "Erongo",
    "erongo": "Erongo",
    "OTJOZONDJUPA": "Otjozondjupa",
    "otjozondjupa": "Otjozondjupa",
    "OSHANA": "Oshana",
    "OSHIKOTO": "Oshikoto",
    "OMUSATI": "Omusati",
    "OHANGWENA": "Ohangwena",
    "KUNENE": "Kunene",
    "KAVANGO EAST": "Kavango East",
    "KAVANGO WEST": "Kavango West",
    "ZAMBEZI": "Zambezi",
    "HARDAP": "Hardap",
    "KARAS": "Karas",
    "//KARAS": "Karas",
    "OMAHEKE": "Omaheke",
  };
  
  const upper = region.toUpperCase().trim();
  return regionMap[upper] || region.trim();
}

// Clean city names
function cleanCity(city: string | undefined): string {
  if (!city) return "";
  
  const cityMap: Record<string, string> = {
    "Walvisbay": "Walvis Bay",
    "walvis bay": "Walvis Bay",
    "WALVIS BAY": "Walvis Bay",
  };
  
  return cityMap[city] || city.trim();
}

// Parse CSV content
function parseCSV(content: string): Record<string, string>[] {
  const lines = content.split('\n');
  if (lines.length < 2) return [];
  
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  const data: Record<string, string>[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Simple CSV parsing (doesn't handle all edge cases)
    const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
    const row: Record<string, string> = {};
    
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    
    data.push(row);
  }
  
  return data;
}

// Main import function
async function importNTBData(filePath: string) {
  console.log(`\n📂 Reading file: ${filePath}\n`);
  
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`);
    console.log("\nTo import NTB data, please provide the Excel or CSV file.");
    console.log("Expected file: Registered-Businesses-Updated-02.06.2025-1.xlsx");
    process.exit(1);
  }
  
  const ext = path.extname(filePath).toLowerCase();
  let data: Record<string, string>[] = [];
  
  if (ext === '.csv') {
    const content = fs.readFileSync(filePath, 'utf-8');
    data = parseCSV(content);
  } else if (ext === '.xlsx') {
    console.log("📊 For Excel files, please install xlsx package:");
    console.log("   pnpm add xlsx");
    console.log("\nOr convert the Excel file to CSV and run again.");
    process.exit(1);
  } else {
    console.error(`❌ Unsupported file format: ${ext}`);
    process.exit(1);
  }
  
  console.log(`📊 Found ${data.length} records to import\n`);
  
  // Get all platform categories
  const platformCategories = await db.select().from(categories);
  const categoryMap = new Map(platformCategories.map(c => [c.slug, c.id]));
  
  let imported = 0;
  let skipped = 0;
  let errors = 0;
  
  for (const row of data) {
    try {
      // Extract fields (handle different column name variations)
      const ntbRegNo = row['NTB Reg No_'] || row['NTB Reg No'] || row['Registration Number'] || '';
      const businessName = row['Business Trading Name'] || row['Business Name'] || row['Name'] || '';
      const ntbCategory = row['Business Category'] || row['Category'] || '';
      const phone = row['Telephone No #'] || row['Phone'] || row['Telephone'] || '';
      const email = row['Email Address'] || row['Email'] || '';
      const city = row['City'] || '';
      const region = row['Region'] || '';
      
      if (!businessName) {
        skipped++;
        continue;
      }
      
      // Map NTB category to platform category
      const platformCategorySlug = categoryMapping[ntbCategory] || 'tour-operators';
      const categoryId = categoryMap.get(platformCategorySlug);
      
      if (!categoryId) {
        console.log(`⚠️ Category not found: ${ntbCategory} -> ${platformCategorySlug}`);
        skipped++;
        continue;
      }
      
      // Generate unique slug
      let slug = generateSlug(businessName);
      let slugSuffix = 0;
      
      // Check for existing slug
      while (true) {
        const testSlug = slugSuffix > 0 ? `${slug}-${slugSuffix}` : slug;
        const [existing] = await db
          .select()
          .from(listings)
          .where(eq(listings.slug, testSlug))
          .limit(1);
        
        if (!existing) {
          slug = testSlug;
          break;
        }
        slugSuffix++;
      }
      
      // Insert listing
      await db.insert(listings).values({
        categoryId,
        name: businessName,
        slug,
        description: `${businessName} is a registered ${ntbCategory.toLowerCase()} in ${cleanCity(city) || cleanRegion(region)}, Namibia.`,
        shortDescription: `NTB-registered ${ntbCategory.toLowerCase()} in ${cleanRegion(region)}`,
        location: cleanCity(city),
        region: cleanRegion(region),
        contactEmail: email || null,
        contactPhone: phone || null,
        ntbRegNo: ntbRegNo || null,
        isVerified: true,
        isActive: true,
        isFeatured: false,
      });
      
      imported++;
      
      if (imported % 100 === 0) {
        console.log(`✅ Imported ${imported} businesses...`);
      }
    } catch (error) {
      errors++;
      if (errors <= 5) {
        console.error(`❌ Error importing row:`, error);
      }
    }
  }
  
  console.log(`\n📊 Import Summary:`);
  console.log(`   ✅ Imported: ${imported}`);
  console.log(`   ⏭️ Skipped: ${skipped}`);
  console.log(`   ❌ Errors: ${errors}`);
  console.log(`   📁 Total: ${data.length}`);
  
  process.exit(0);
}

// Get file path from command line args
const filePath = process.argv[2];

if (!filePath) {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║           NTB Data Import Script for Namibia Portal          ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  This script imports business data from the Namibia Tourism  ║
║  Board registry into the platform database.                  ║
║                                                              ║
║  Usage:                                                      ║
║    npx tsx import-ntb-data.ts <path-to-file>                 ║
║                                                              ║
║  Supported formats:                                          ║
║    - CSV (.csv)                                              ║
║    - Excel (.xlsx) - requires xlsx package                   ║
║                                                              ║
║  Expected columns:                                           ║
║    - NTB Reg No_ (registration number)                       ║
║    - Business Trading Name                                   ║
║    - Business Category                                       ║
║    - Telephone No #                                          ║
║    - Email Address                                           ║
║    - City                                                    ║
║    - Region                                                  ║
║                                                              ║
║  The script will:                                            ║
║    ✓ Map NTB categories to platform categories               ║
║    ✓ Clean and standardize region/city names                 ║
║    ✓ Generate unique slugs for each business                 ║
║    ✓ Mark imported businesses as NTB-verified                ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
  `);
  process.exit(0);
}

importNTBData(filePath).catch(console.error);

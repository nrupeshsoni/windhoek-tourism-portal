/**
 * Extract unique NTB categories from Excel file
 */

import XLSX from "xlsx";

const filePath = "/home/ubuntu/upload/RegisteredBusinessesUpdated02.06.2025(1).xlsx";

console.log(`\n📂 Reading Excel file: ${filePath}\n`);

const workbook = XLSX.readFile(filePath);
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(sheet) as Record<string, any>[];

console.log(`📊 Found ${data.length} records\n`);

// Extract unique categories
const categories = new Set<string>();

for (const row of data) {
  const category = row['Business Category'] || row['Category'] || row['Type'] || row['Business Type'];
  if (category && typeof category === 'string' && category.trim()) {
    categories.add(category.trim());
  }
}

console.log(`\n📁 Found ${categories.size} unique NTB categories:\n`);
const sortedCategories = Array.from(categories).sort();
sortedCategories.forEach((cat, i) => {
  console.log(`${i + 1}. ${cat}`);
});

// Count per category
console.log(`\n📊 Category distribution:\n`);
const categoryCount: Record<string, number> = {};
for (const row of data) {
  const category = row['Business Category'] || row['Category'] || row['Type'] || row['Business Type'];
  if (category && typeof category === 'string' && category.trim()) {
    const cat = category.trim();
    categoryCount[cat] = (categoryCount[cat] || 0) + 1;
  }
}

Object.entries(categoryCount)
  .sort((a, b) => b[1] - a[1])
  .forEach(([cat, count]) => {
    console.log(`   ${cat}: ${count}`);
  });

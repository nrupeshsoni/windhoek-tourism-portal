import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { routes } from "./drizzle/schema";
import { eq } from "drizzle-orm";

async function checkRoutes() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL || "");
  const db = drizzle(connection);
  
  console.log("Checking routes...");
  
  // Get all routes
  const allRoutes = await db.select().from(routes);
  console.log(`Total routes: ${allRoutes.length}`);
  
  // Get active routes
  const activeRoutes = await db.select().from(routes).where(eq(routes.isActive, true));
  console.log(`Active routes: ${activeRoutes.length}`);
  
  // Sample first 5
  console.log("\nFirst 5 routes:");
  allRoutes.slice(0, 5).forEach(r => {
    console.log(`  - ${r.id}: ${r.name} (isActive: ${r.isActive}, duration: ${r.duration})`);
  });
  
  await connection.end();
}

checkRoutes().catch(console.error);

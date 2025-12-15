import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { eq, sql } from "drizzle-orm";
import * as schema from "./drizzle/schema";

async function main() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL!);
  const db = drizzle(connection, { schema, mode: "default" });

  // Check current state
  const countResult = await db.execute(sql`SELECT COUNT(*) as total, SUM(isActive) as active FROM cnrtp_routes`);
  console.log("Current state:", countResult[0]);

  // Update all routes to be active
  const updateResult = await db.execute(sql`UPDATE cnrtp_routes SET isActive = 1 WHERE isActive = 0 OR isActive IS NULL`);
  console.log("Updated rows:", updateResult);

  // Verify
  const verifyResult = await db.execute(sql`SELECT COUNT(*) as total, SUM(isActive) as active FROM cnrtp_routes`);
  console.log("After update:", verifyResult[0]);

  await connection.end();
}

main().catch(console.error);

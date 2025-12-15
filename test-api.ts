// Test the tRPC routes endpoint directly
import * as db from "./server/db";

async function testRoutes() {
  console.log("Testing routes.list...");
  
  const routes = await db.getRoutes({});
  console.log(`Routes returned: ${routes.length}`);
  
  if (routes.length > 0) {
    console.log("First route:", routes[0]);
  } else {
    console.log("No routes returned!");
  }
}

testRoutes().catch(console.error);

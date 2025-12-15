import { describe, expect, it, beforeAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock context for public procedures
function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

// Mock context for admin procedures
function createAdminContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "admin-user",
      email: "admin@example.com",
      name: "Admin User",
      loginMethod: "manus",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("categories.list", () => {
  it("returns a list of categories", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.categories.list();

    expect(Array.isArray(result)).toBe(true);
    // We seeded 27 categories
    expect(result.length).toBeGreaterThanOrEqual(27);
    
    // Check category structure
    if (result.length > 0) {
      const category = result[0];
      expect(category).toHaveProperty("id");
      expect(category).toHaveProperty("name");
      expect(category).toHaveProperty("slug");
      expect(category).toHaveProperty("icon");
    }
  });
});

describe("categories.getBySlug", () => {
  it("returns a category by slug", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.categories.getBySlug({ slug: "tour-operators" });

    expect(result).not.toBeNull();
    expect(result?.name).toBe("Tour Operators");
    expect(result?.slug).toBe("tour-operators");
  });

  it("returns null for non-existent slug", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.categories.getBySlug({ slug: "non-existent-category" });

    expect(result).toBeUndefined();
  });
});

describe("listings.list", () => {
  it("returns a list of listings", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.listings.list({});

    expect(Array.isArray(result)).toBe(true);
  });

  it("filters listings by category", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    // Get first category
    const categories = await caller.categories.list();
    if (categories.length > 0) {
      const result = await caller.listings.list({ categoryId: categories[0].id });
      expect(Array.isArray(result)).toBe(true);
    }
  });
});

describe("admin.categories.list", () => {
  it("returns categories for admin users", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.admin.categories.list();

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThanOrEqual(27);
  });

  it("throws error for non-admin users", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.admin.categories.list()).rejects.toThrow();
  });
});

describe("admin.listings.list", () => {
  it("returns listings for admin users", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.admin.listings.list({});

    expect(Array.isArray(result)).toBe(true);
  });
});

describe("admin.media.list", () => {
  it("returns media for admin users", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.admin.media.list();

    expect(Array.isArray(result)).toBe(true);
  });
});

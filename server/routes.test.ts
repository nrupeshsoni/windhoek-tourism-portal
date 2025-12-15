import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

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

describe("routes", () => {
  describe("routes.list", () => {
    it("returns a list of routes", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.routes.list({});

      expect(Array.isArray(result)).toBe(true);
      // Should have seeded routes
      expect(result.length).toBeGreaterThan(0);
    });

    it("filters routes by duration", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.routes.list({ duration: 1 });

      expect(Array.isArray(result)).toBe(true);
      // All returned routes should have duration of 1
      result.forEach(route => {
        expect(route.duration).toBe(1);
      });
    });

    it("filters routes by featured status", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.routes.list({ featured: true });

      expect(Array.isArray(result)).toBe(true);
      // All returned routes should be featured
      result.forEach(route => {
        expect(route.isFeatured).toBe(true);
      });
    });
  });

  describe("routes.getBySlug", () => {
    it("returns a route when given valid slug", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      // First get a route to find a valid slug
      const routes = await caller.routes.list({});
      if (routes.length > 0) {
        const route = await caller.routes.getBySlug({ slug: routes[0].slug });

        expect(route).toBeDefined();
        expect(route?.name).toBe(routes[0].name);
        expect(route?.slug).toBe(routes[0].slug);
      }
    });

    it("returns undefined for non-existent slug", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.routes.getBySlug({ slug: "non-existent-route-slug-12345" });

      expect(result).toBeUndefined();
    });
  });
});

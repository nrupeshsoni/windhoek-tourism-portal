import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import * as db from "./db";
import { storagePut } from "./storage";
import { nanoid } from "nanoid";
import { chatbotRouter } from "./chatbot";

// Admin-only procedure
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  chatbot: chatbotRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // Public category browsing
  categories: router({
    list: publicProcedure.query(async () => {
      return await db.getActiveCategories();
    }),
    
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return await db.getCategoryBySlug(input.slug);
      }),
  }),

  // Public listing browsing
  listings: router({
    list: publicProcedure
      .input(z.object({ 
        categoryId: z.number().optional(),
        search: z.string().optional(),
        region: z.string().optional(),
        featured: z.boolean().optional(),
      }))
      .query(async ({ input }) => {
        if (input.search) {
          return await db.searchListings(input.search, input.categoryId, input.region);
        }
        return await db.getActiveListings(input.categoryId, input.region, input.featured);
      }),
    
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const listing = await db.getListingBySlug(input.slug);
        if (listing) {
          await db.incrementListingViews(listing.id);
        }
        return listing;
      }),
    
    getMedia: publicProcedure
      .input(z.object({ listingId: z.number() }))
      .query(async ({ input }) => {
        return await db.getMediaByListing(input.listingId);
      }),
  }),

  // Public routes browsing
  routes: router({
    list: publicProcedure
      .input(z.object({
        duration: z.number().optional(), // Filter by exact duration
        minDuration: z.number().optional(),
        maxDuration: z.number().optional(),
        difficulty: z.enum(["easy", "moderate", "challenging"]).optional(),
        region: z.string().optional(),
        featured: z.boolean().optional(),
      }))
      .query(async ({ input }) => {
        return await db.getRoutes(input);
      }),
    
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const route = await db.getRouteBySlug(input.slug);
        if (route) {
          await db.incrementRouteViews(route.id);
        }
        return route;
      }),
    
    getStops: publicProcedure
      .input(z.object({ routeId: z.number() }))
      .query(async ({ input }) => {
        return await db.getRouteStops(input.routeId);
      }),
    
    getDurations: publicProcedure.query(async () => {
      return await db.getAvailableDurations();
    }),
  }),

  // Admin: Category management
  admin: router({
    categories: router({
      list: adminProcedure.query(async () => {
        return await db.getAllCategories();
      }),
      
      create: adminProcedure
        .input(z.object({
          name: z.string(),
          slug: z.string(),
          description: z.string().optional(),
          icon: z.string().optional(),
          displayOrder: z.number().default(0),
        }))
        .mutation(async ({ input }) => {
          await db.createCategory(input);
          return { success: true };
        }),
      
      update: adminProcedure
        .input(z.object({
          id: z.number(),
          name: z.string().optional(),
          slug: z.string().optional(),
          description: z.string().optional(),
          icon: z.string().optional(),
          displayOrder: z.number().optional(),
          isActive: z.boolean().optional(),
        }))
        .mutation(async ({ input }) => {
          const { id, ...data } = input;
          await db.updateCategory(id, data);
          return { success: true };
        }),
      
      delete: adminProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input }) => {
          await db.deleteCategory(input.id);
          return { success: true };
        }),
    }),

    // Listing management
    listings: router({
      list: adminProcedure
        .input(z.object({ categoryId: z.number().optional() }))
        .query(async ({ input }) => {
          return await db.getAllListings(input.categoryId);
        }),
      
      getById: adminProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ input }) => {
          return await db.getListingById(input.id);
        }),
      
      create: adminProcedure
        .input(z.object({
          categoryId: z.number(),
          name: z.string(),
          slug: z.string(),
          description: z.string().optional(),
          shortDescription: z.string().optional(),
          location: z.string().optional(),
          region: z.string().optional(),
          contactEmail: z.string().optional(),
          contactPhone: z.string().optional(),
          website: z.string().optional(),
          address: z.string().optional(),
          latitude: z.string().optional(),
          longitude: z.string().optional(),
          priceRange: z.string().optional(),
          features: z.string().optional(),
          isFeatured: z.boolean().default(false),
        }))
        .mutation(async ({ input }) => {
          await db.createListing(input);
          return { success: true };
        }),
      
      update: adminProcedure
        .input(z.object({
          id: z.number(),
          categoryId: z.number().optional(),
          name: z.string().optional(),
          slug: z.string().optional(),
          description: z.string().optional(),
          shortDescription: z.string().optional(),
          location: z.string().optional(),
          region: z.string().optional(),
          contactEmail: z.string().optional(),
          contactPhone: z.string().optional(),
          website: z.string().optional(),
          address: z.string().optional(),
          latitude: z.string().optional(),
          longitude: z.string().optional(),
          priceRange: z.string().optional(),
          features: z.string().optional(),
          isActive: z.boolean().optional(),
          isFeatured: z.boolean().optional(),
        }))
        .mutation(async ({ input }) => {
          const { id, ...data } = input;
          await db.updateListing(id, data);
          return { success: true };
        }),
      
      delete: adminProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input }) => {
          await db.deleteListing(input.id);
          return { success: true };
        }),
    }),

    // Media management
    media: router({
      list: adminProcedure.query(async () => {
        return await db.getAllMedia();
      }),
      
      upload: adminProcedure
        .input(z.object({
          title: z.string().optional(),
          description: z.string().optional(),
          mediaType: z.enum(["photo", "video", "vr"]),
          fileData: z.string(), // base64 encoded
          fileName: z.string(),
          mimeType: z.string(),
        }))
        .mutation(async ({ input, ctx }) => {
          // Decode base64 file data
          const buffer = Buffer.from(input.fileData, 'base64');
          
          // Generate unique file key
          const fileKey = `media/${nanoid()}-${input.fileName}`;
          
          // Upload to S3
          const { url } = await storagePut(fileKey, buffer, input.mimeType);
          
          // Save to database
          await db.createMedia({
            title: input.title,
            description: input.description,
            mediaType: input.mediaType,
            fileUrl: url,
            fileKey,
            mimeType: input.mimeType,
            fileSize: buffer.length,
            uploadedBy: ctx.user.id,
          });
          
          return { success: true, url };
        }),
      
      update: adminProcedure
        .input(z.object({
          id: z.number(),
          title: z.string().optional(),
          description: z.string().optional(),
          altText: z.string().optional(),
          caption: z.string().optional(),
          isActive: z.boolean().optional(),
        }))
        .mutation(async ({ input }) => {
          const { id, ...data } = input;
          await db.updateMedia(id, data);
          return { success: true };
        }),
      
      delete: adminProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input }) => {
          await db.deleteMedia(input.id);
          return { success: true };
        }),
      
      addToListing: adminProcedure
        .input(z.object({
          listingId: z.number(),
          mediaId: z.number(),
          displayOrder: z.number().default(0),
          isPrimary: z.boolean().default(false),
        }))
        .mutation(async ({ input }) => {
          await db.addMediaToListing(input);
          return { success: true };
        }),
      
      removeFromListing: adminProcedure
        .input(z.object({
          listingId: z.number(),
          mediaId: z.number(),
        }))
        .mutation(async ({ input }) => {
          await db.removeMediaFromListing(input.listingId, input.mediaId);
          return { success: true };
        }),
      
      setPrimary: adminProcedure
        .input(z.object({
          listingId: z.number(),
          mediaId: z.number(),
        }))
        .mutation(async ({ input }) => {
          await db.setPrimaryMedia(input.listingId, input.mediaId);
          return { success: true };
        }),
    }),
  }),
});

export type AppRouter = typeof appRouter;

import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import type { Express, Request, Response } from "express";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { createSessionToken, verifySupabaseToken } from "./supabaseAuth";

/**
 * Register Supabase OAuth routes
 * These routes handle the OAuth callback from Supabase Auth
 */
export function registerSupabaseAuthRoutes(app: Express) {
  // Handle Supabase OAuth callback
  // The frontend redirects here after successful Supabase auth
  app.post("/api/auth/callback", async (req: Request, res: Response) => {
    const { access_token } = req.body;

    if (!access_token) {
      res.status(400).json({ error: "access_token is required" });
      return;
    }

    try {
      // Verify the Supabase access token
      const userInfo = await verifySupabaseToken(access_token);

      // Upsert user in our database
      await db.upsertUser({
        openId: userInfo.id, // Use Supabase user ID as openId
        name: userInfo.name || null,
        email: userInfo.email || null,
        loginMethod: 'supabase',
        lastSignedIn: new Date(),
      });

      // Create our own session token
      const sessionToken = await createSessionToken(
        userInfo.id,
        userInfo.email,
        userInfo.name,
        { expiresInMs: ONE_YEAR_MS }
      );

      // Set session cookie
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

      res.json({ success: true, user: { id: userInfo.id, email: userInfo.email, name: userInfo.name } });
    } catch (error) {
      console.error("[Auth] Callback failed", error);
      res.status(500).json({ error: "Authentication failed" });
    }
  });

  // Logout endpoint
  app.post("/api/auth/logout", (req: Request, res: Response) => {
    const cookieOptions = getSessionCookieOptions(req);
    res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
    res.json({ success: true });
  });

  // Get current session
  app.get("/api/auth/session", async (req: Request, res: Response) => {
    try {
      const cookies = parseCookies(req.headers.cookie);
      const sessionCookie = cookies.get(COOKIE_NAME);
      
      if (!sessionCookie) {
        res.json({ user: null });
        return;
      }

      // Import verifySession here to avoid circular dependency
      const { verifySession } = await import("./supabaseAuth");
      const session = await verifySession(sessionCookie);

      if (!session) {
        res.json({ user: null });
        return;
      }

      const user = await db.getUserByOpenId(session.sub);
      res.json({ user: user || null });
    } catch (error) {
      console.error("[Auth] Session check failed", error);
      res.json({ user: null });
    }
  });
}

function parseCookies(cookieHeader: string | undefined): Map<string, string> {
  if (!cookieHeader) {
    return new Map<string, string>();
  }

  const cookies = new Map<string, string>();
  cookieHeader.split(';').forEach(cookie => {
    const [name, ...rest] = cookie.trim().split('=');
    if (name && rest.length > 0) {
      cookies.set(name, rest.join('='));
    }
  });
  return cookies;
}

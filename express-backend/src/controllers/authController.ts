import { Request, Response } from "express";
import { supabase } from "../lib/supabase";
import { signToken, verifyToken, mapSupabaseUserToIUser } from "../lib/jwt";
import { IUser } from "shared-backend";

// POST /auth/magic-link
export const sendMagicLink = async (req: Request, res: Response) => {
  const { email, redirectUrl } = req.body;
  if (!email || !redirectUrl) return res.status(400).json({ error: "Missing email or redirectUrl" });

  try {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectUrl },
    });

    if (error) return res.status(400).json({ error: error.message });
    res.json({ error: null });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET /auth/me
export const getUser = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.json({ user: null });

  const token = authHeader.replace("Bearer ", "");
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return res.json({ user: null });
  const user: IUser = mapSupabaseUserToIUser(data.user);
  res.json(user);
};

// POST /auth/logout
export const signOut = (_req: Request, res: Response) => {
  // Stateless: client just deletes the token
  res.json({ success: true });
};

// Optional: if you want a /auth/callback endpoint (not strictly needed with ExpressAuthService)
export const consumeMagicLink = async (req: Request, res: Response) => {
  const { access_token, refresh_token, user } = req.body;
  if (!access_token || !refresh_token || !user)
    return res.status(400).json({ error: "Missing tokens or user" });

  // Just return what frontend needs
  res.json({ access_token, refresh_token, user });
};

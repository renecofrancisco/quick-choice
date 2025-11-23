import { Request, Response } from "express";
import { supabase } from "../lib/supabase";
import { signToken, verifyToken, mapSupabaseUserToIUser } from "../lib/jwt";
import { IUser } from "shared-backend";

// POST /auth/signin
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
    res.status(500).json({ error: "Internal server error" });
  }
};

// POST /auth/callback
export const consumeMagicLink = async (req: Request, res: Response) => {
  const { access_token } = req.body;
  console.log("Received access token:", access_token);
  if (!access_token) return res.status(400).json({ error: "Missing access token" });

  try {
    console.log("Verifying access token with Supabase", access_token);
    const { data, error } = await supabase.auth.getUser(access_token);
    if (error || !data.user) return res.status(400).json({ error: error?.message || "User not found" });

    console.log("Supabase user data retrieved:", data.user.email);
    const user: IUser = mapSupabaseUserToIUser(data.user);

    // Sign JWT with user info
    const token = signToken(user);
    console.log("Generated JWT for user:", user.email);
    // Return JWT instead of session
    res.json({ token, user });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET /auth/user
export const getUser = (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.json({ user: null });

  const token = authHeader.replace("Bearer ", "");
  const user = verifyToken(token);
  res.json({ user });
};


// POST /auth/signout
export const signOut = (_req: Request, res: Response) => {
  // Stateless: client can just delete the JWT
  res.json({ success: true });
};

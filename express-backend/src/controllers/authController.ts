import { Request, Response } from "express";
import { supabase } from "../lib/supabase";

// POST /auth/signin
export const sendMagicLink = async (req: Request, res: Response) => {
  const { email, redirectUrl } = req.body;
  console.log("[DEBUG] /signin called", { email, redirectUrl });

  if (!email || !redirectUrl) return res.status(400).json({ error: "Missing email or redirectUrl" });

  try {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectUrl },
    });

    console.log("[DEBUG] Supabase signInWithOtp result", { error });

    if (error) return res.status(400).json({ error: error.message });
    console.log("[DEBUG] Magic link requested successfully for", email);
    res.json({ error: null });
  } catch (err: any) {
    console.error("[ERROR] Exception in /signin:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// POST /auth/callback
export const consumeMagicLink = async (req: Request, res: Response) => {
  const { access_token } = req.body;
  if (!access_token) return res.status(400).json({ error: "Missing access token" });

  try {
    const { data, error } = await supabase.auth.getUser(access_token);
    if (error) return res.status(400).json({ error: error.message });

    // store user in Express session
    req.session.user = data.user;
    res.json({ user: data.user });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET /auth/user
export const getUser = (req: Request, res: Response) => {
  const user = req.session?.user ?? null;
  res.json({ user });
};

// POST /auth/signout
export const signOut = (req: Request, res: Response) => {
  req.session.destroy(err => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to sign out" });
    }
    res.clearCookie("connect.sid"); // adjust to your session cookie name
    res.json({ success: true });
  });
};

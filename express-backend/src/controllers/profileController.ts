import { Request, Response } from "express";
import { supabase } from "../lib/supabase";

// GET /profiles/:userId
export const getUserProfile = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) return res.status(500).json({ error: error.message });

  res.json(data || null);
};

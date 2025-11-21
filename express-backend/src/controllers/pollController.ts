import { Request, Response } from "express";
import { supabase } from "../lib/supabase";

// GET /polls/next?userId=...
export const getNextPoll = async (req: Request, res: Response) => {
  const userId = req.query.userId as string;
  if (!userId) return res.status(400).json({ error: "Missing userId" });

  try {
    const { data, error } = await supabase.rpc("get_next_poll", { p_user_id: userId });

    if (error) throw error;

    res.json(data?.[0] || null);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// GET /polls?userId=...
export const getUserPolls = async (req: Request, res: Response) => {
  const userId = req.query.userId as string;
  if (!userId) return res.status(400).json({ error: "Missing userId" });

  const { data, error } = await supabase.rpc("get_user_polls", { p_user_id: userId });

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
};

// GET /polls/:pollId
export const getPollById = async (req: Request, res: Response) => {
  const pollId = req.params.pollId;

  const { data, error } = await supabase.rpc("get_poll_by_id", { p_poll_id: pollId });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0] || null);
};

// POST /polls
export const createPoll = async (req: Request, res: Response) => {
  const { userId, optionA, optionB } = req.body;

  const { data, error } = await supabase.rpc("create_poll", {
    p_user_id: userId,
    p_option_a: optionA,
    p_option_b: optionB,
  });

  if (error) return res.status(500).json({ error: error.message });

  res.json({ pollId: data });
};

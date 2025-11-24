import { Request, Response } from "express";
import { supabase } from "../lib/supabase";

// POST /votes
export const submitVote = async (req: Request, res: Response) => {
  const { userId, pollId, choice } = req.body;
  if (!userId || !pollId || !choice) return res.status(400).json({ error: "Missing fields" });

  try {
    const { error: voteError } = await supabase
      .from("votes")
      .insert({ user_id: userId, poll_id: pollId, choice });

    if (voteError) throw voteError;

    const { error: creditError } = await supabase.rpc("change_credits", {
      user_uuid: userId,
      change: 1,
    });

    if (creditError) throw creditError;

    res.json({ success: true });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// POST /votes/fake
export const triggerFakeVotes = async (req: Request, res: Response) => {
  const { pollId } = req.body;
  if (!pollId) return res.status(400).json({ error: "Missing pollId" });

  try {
    const resFake = await fetch(process.env.FAKE_VOTES_FUNCTION_URL!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pollId }),
    });

    if (!resFake.ok) {
      const text = await resFake.text();
      throw new Error(`Failed to trigger fake votes: ${text}`);
    }

    res.json({ success: true });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

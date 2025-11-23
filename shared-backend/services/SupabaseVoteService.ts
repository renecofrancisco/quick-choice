// shared-backend/services/SupabaseVoteService.ts
import { IVoteService } from "../interfaces/IVoteService";
import { IPoll } from "../models/IPoll";
import type { SupabaseClient } from "@supabase/supabase-js";

export class SupabaseVoteService implements IVoteService {
  constructor(private supabase: SupabaseClient) { }

  async getNextPoll(userId: string): Promise<IPoll | null> {
    const { data, error } = await this.supabase.rpc("get_next_poll", { p_user_id: userId });
    if (error) throw new Error(error.message);
    if (!data || data.length === 0) return null;
    return data[0] as IPoll;
  }

  async vote(userId: string, pollId: string, choice: "A" | "B" | "skip"): Promise<void> {
    const { error: voteError } = await this.supabase.from("votes").insert({
      poll_id: pollId,
      user_id: userId,
      choice,
    });
    if (voteError) throw new Error(voteError.message);

    const { error: creditError } = await this.supabase.rpc("change_credits", {
      user_uuid: userId,
      change: 1,
    });
    if (creditError) console.error("Error adding credit:", creditError);
  }

  async triggerFakeVotes(pollId: string): Promise<void> {
    const res = await fetch("/api/fakeVotes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pollId }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Failed to trigger fake votes: ${text}`);
    }
  }
}

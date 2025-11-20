// shared-backend/services/SupabasePollService.ts
import { IPollService } from "../interfaces/IPollService";
import { IPoll } from "../models/IPoll";
import { supabase } from "@/lib/supabase";

export class SupabasePollService implements IPollService {
  async getUserPolls(userId: string): Promise<IPoll[]> {
    const { data, error } = await supabase.rpc("get_user_polls", { p_user_id: userId });
    if (error) throw new Error(error.message);
    return (data || []) as IPoll[];
  }

  async getPollById(pollId: string): Promise<IPoll | null> {
    const { data, error } = await supabase.rpc("get_poll_by_id", { p_poll_id: pollId });
    if (error) throw new Error(error.message);
    if (!data || data.length === 0) return null;
    return data[0] as IPoll;
  }

  async createPoll(userId: string, optionA: string, optionB: string): Promise<string> {
    const { data, error } = await supabase.rpc("create_poll", {
      p_user_id: userId,
      p_option_a: optionA,
      p_option_b: optionB,
    });
    if (error) throw new Error(error.message);
    return data as string; // new poll_id
  }
}

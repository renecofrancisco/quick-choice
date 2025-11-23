import { IVoteService } from "../interfaces/IVoteService";
import { IPoll } from "../models/IPoll";
import type { SupabaseClient } from "@supabase/supabase-js";
export declare class SupabaseVoteService implements IVoteService {
    private supabase;
    constructor(supabase: SupabaseClient);
    getNextPoll(userId: string): Promise<IPoll | null>;
    vote(userId: string, pollId: string, choice: "A" | "B" | "skip"): Promise<void>;
    triggerFakeVotes(pollId: string): Promise<void>;
}

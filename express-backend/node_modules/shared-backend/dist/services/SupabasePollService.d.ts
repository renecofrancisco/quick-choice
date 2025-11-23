import { IPollService } from "../interfaces/IPollService";
import { IPoll } from "../models/IPoll";
import type { SupabaseClient } from "@supabase/supabase-js";
export declare class SupabasePollService implements IPollService {
    private supabase;
    constructor(supabase: SupabaseClient);
    getUserPolls(userId: string): Promise<IPoll[]>;
    getPollById(pollId: string): Promise<IPoll | null>;
    createPoll(userId: string, optionA: string, optionB: string): Promise<string>;
}

import { IProfileService } from "../interfaces/IProfileService";
import { IUserProfile } from "../models/IUserProfile";
import type { SupabaseClient } from "@supabase/supabase-js";
export declare class SupabaseProfileService implements IProfileService {
    private supabase;
    constructor(supabase: SupabaseClient);
    getUserProfile(userId: string): Promise<IUserProfile | null>;
}

// shared-backend/services/SupabaseProfileService.ts
import { IProfileService } from "../interfaces/IProfileService";
import { IUserProfile } from "../models/IUserProfile";
import type { SupabaseClient } from "@supabase/supabase-js";

export class SupabaseProfileService implements IProfileService {
  constructor(private supabase: SupabaseClient) { }

  async getUserProfile(userId: string): Promise<IUserProfile | null> {
    const { data, error } = await this.supabase
      .from("user_profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) throw new Error(error.message);

    return data as IUserProfile;
  }
}

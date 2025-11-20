// shared-backend/services/SupabaseProfileService.ts
import { IProfileService } from "../interfaces/IProfileService";
import { IUserProfile } from "../models/IUserProfile";
import { supabase } from "@/lib/supabase";

export class SupabaseProfileService implements IProfileService {
  async getUserProfile(userId: string): Promise<IUserProfile | null> {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) throw new Error(error.message);

    return data as IUserProfile;
  }
}

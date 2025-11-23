"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseProfileService = void 0;
class SupabaseProfileService {
    constructor(supabase) {
        this.supabase = supabase;
    }
    async getUserProfile(userId) {
        const { data, error } = await this.supabase
            .from("user_profiles")
            .select("*")
            .eq("user_id", userId)
            .single();
        if (error)
            throw new Error(error.message);
        return data;
    }
}
exports.SupabaseProfileService = SupabaseProfileService;

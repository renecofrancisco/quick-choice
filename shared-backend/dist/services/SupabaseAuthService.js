"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseAuthService = void 0;
class SupabaseAuthService {
    constructor(supabase) {
        this.supabase = supabase;
    }
    async sendMagicLink(email, redirectUrl) {
        const { error } = await this.supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: redirectUrl,
            },
        });
        if (error)
            throw error;
    }
    async signOut() {
        const { error } = await this.supabase.auth.signOut();
        if (error)
            throw error;
    }
    async getUser() {
        const access_token = localStorage.getItem("session_token");
        const refresh_token = localStorage.getItem("refresh_token") ?? "";
        if (access_token && refresh_token) {
            await this.supabase.auth.setSession({ access_token, refresh_token });
        }
        try {
            const { data, error } = await this.supabase.auth.getSession();
            if (error || !data.session?.user)
                return null;
            const u = data.session.user;
            return { id: u.id, email: u.email ?? "" };
        }
        catch {
            return null;
        }
    }
}
exports.SupabaseAuthService = SupabaseAuthService;

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
        localStorage.removeItem("session_token");
        localStorage.removeItem("refresh_token");
    }
    async getUser() {
        const access_token = localStorage.getItem("session_token");
        const refresh_token = localStorage.getItem("refresh_token") ?? "";
        if (access_token && refresh_token) {
            await this.supabase.auth.setSession({ access_token, refresh_token });
        }
        try {
            const { data, error } = await this.supabase.auth.getSession();
            if (error || !data.session?.user) {
                localStorage.removeItem("session_token");
                localStorage.removeItem("refresh_token");
                return null;
            }
            const u = data.session.user;
            return { id: u.id, email: u.email ?? "" };
        }
        catch {
            return null;
        }
    }
    async restoreFromUrlTokens(hash) {
        const params = new URLSearchParams(hash.replace(/^#/, ""));
        const access_token = params.get("access_token") ?? undefined;
        const refresh_token = params.get("refresh_token") ?? undefined;
        if (access_token && refresh_token) {
            localStorage.setItem("session_token", access_token);
            localStorage.setItem("refresh_token", refresh_token);
            await this.supabase.auth.setSession({ access_token, refresh_token });
        }
    }
}
exports.SupabaseAuthService = SupabaseAuthService;

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
            options: { emailRedirectTo: redirectUrl },
        });
        if (error)
            throw new Error(error.message);
    }
    async getUser() {
        const { data, error } = await this.supabase.auth.getUser();
        if (error)
            return { user: null };
        if (!data.user)
            return { user: null };
        const { id, email, ...rest } = data.user;
        if (!email)
            throw new Error("User email is missing");
        return { user: { id, email, ...rest } };
    }
    async getSession() {
        const { data } = await this.supabase.auth.getSession();
        if (!data?.session)
            return null;
        const { access_token, refresh_token, user } = data.session;
        return { access_token, refresh_token, user };
    }
    async signOut() {
        await this.supabase.auth.signOut();
    }
}
exports.SupabaseAuthService = SupabaseAuthService;

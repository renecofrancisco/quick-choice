import { IAuthService } from "../interfaces/IAuthService";
import type { SupabaseClient } from "@supabase/supabase-js";
import { IUser } from "../models/IUser";

export class SupabaseAuthService implements IAuthService {
  constructor(private supabase: SupabaseClient) { }

  async sendMagicLink(email: string, redirectUrl: string) {
    const { error } = await this.supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectUrl },
    });
    if (error) throw new Error(error.message);
  }

  async getUser(): Promise<{ user: IUser | null }> {
    const { data, error } = await this.supabase.auth.getUser();
    if (error) return { user: null };
    if (!data.user) return { user: null };
    const { id, email, ...rest } = data.user;
    if (!email) throw new Error("User email is missing");
    return { user: { id, email, ...rest } };
  }

  async getSession() {
    const { data } = await this.supabase.auth.getSession();
    if (!data?.session) return null;
    const { access_token, refresh_token, user } = data.session;
    return { access_token, refresh_token, user };
  }

  async signOut(): Promise<void> {
    await this.supabase.auth.signOut();
  }
}

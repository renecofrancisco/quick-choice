import type { SupabaseClient } from "@supabase/supabase-js";
import { IAuthService } from "../interfaces/IAuthService";
import { IUser } from "../models/IUser";

export class SupabaseAuthService implements IAuthService {
  constructor(private supabase: SupabaseClient) { }

  async sendMagicLink(email: string, redirectUrl: string): Promise<void> {
    const { error } = await this.supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });

    if (error) throw error;
  }

  async signOut(): Promise<void> {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
  }

  async getUser(): Promise<IUser | null> {
    const access_token = localStorage.getItem("session_token");
    const refresh_token = localStorage.getItem("refresh_token") ?? "";

    if (access_token && refresh_token) {
      await this.supabase.auth.setSession({ access_token, refresh_token });
    }

    try {
      const { data, error } = await this.supabase.auth.getSession();
      if (error || !data.session?.user) return null;

      const u = data.session.user;
      return { id: u.id, email: u.email ?? "" };
    } catch {
      return null;
    }
  }
}

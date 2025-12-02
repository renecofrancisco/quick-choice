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
    localStorage.removeItem("session_token");
    localStorage.removeItem("refresh_token");
  }

  async getUser(): Promise<IUser | null> {
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
    } catch {
      return null;
    }
  }

  async restoreFromUrlTokens(hash: string): Promise<void> {
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

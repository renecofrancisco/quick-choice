import { IAuthService } from "../interfaces/IAuthService";
import { supabase } from "@/lib/supabase";
import { IUser } from "../models/IUser";

export class SupabaseAuthService implements IAuthService {
  async exchangeCodeForSession(callbackUrl: string): Promise<void> {
    await supabase.auth.exchangeCodeForSession(callbackUrl);
  }

  async getUser(): Promise<{ user: IUser | null }> {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw new Error(error.message);
    if (!data.user) return { user: null };
    const { id, email, ...rest } = data.user;
    if (!email) throw new Error("User email is missing");
    return { user: { id, email, ...rest } };
  }

  onAuthStateChange(callback: (event: string, session: { user: IUser } | null) => void) {
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const { id, email, ...rest } = session.user;
        if (!email) throw new Error("User email is missing");
        callback(_event, { user: { id, email, ...rest } });
      } else {
        callback(_event, null);
      }
    });
    return { unsubscribe: () => listener.subscription.unsubscribe() };
  }

  async signInWithOtp(email: string, redirectUrl: string): Promise<{ error: string | null }> {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectUrl },
    });
    return { error: error ? error.message : null };
  }

  async signOut(): Promise<void> {
    await supabase.auth.signOut();
}
}

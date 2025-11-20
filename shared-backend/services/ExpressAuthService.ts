import { IAuthService } from "../interfaces/IAuthService";
import { IUser } from "../models/IUser";

interface IAuthResponse {
  user: IUser | null;
}

export class ExpressAuthService implements IAuthService {
  baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl; // e.g. "https://my-express-api.com"
  }

  async exchangeCodeForSession(callbackUrl: string): Promise<void> {
    await fetch(`${this.baseUrl}/auth/exchange-code`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ callbackUrl }),
    });
  }

  async getUser(): Promise<{ user: IUser | null }> {
    const res = await fetch(`${this.baseUrl}/auth/user`, {
      credentials: "include", // if your Express API uses cookies
    });

    if (!res.ok) throw new Error("Failed to fetch user from Express API");
    const data: IAuthResponse = await res.json();
    return { user: data.user };
  }

  onAuthStateChange(callback: (event: string, session: { user: IUser } | null) => void) {
    // For Express, we don’t have a real-time listener like Supabase.
    // You could implement polling or websockets, but for now, this is a no-op:
    return { unsubscribe: () => {} };
  }

  async signInWithOtp(email: string, redirectUrl: string): Promise<{ error: string | null }> {
    const res = await fetch(`${this.baseUrl}/auth/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, redirectUrl }),
    });

    const data = await res.json();
    return { error: data.error ?? null };
  }

  async signOut(): Promise<void> {
    await fetch(`${this.baseUrl}/auth/signout`, {
      method: "POST",
      credentials: "include",
    });
  }
}

// shared-backend/services/ExpressAuthService.ts
import { IAuthService } from "../interfaces/IAuthService";
import { IUser } from "../models/IUser";

export class ExpressAuthService implements IAuthService {
  constructor(private apiBase: string) { }

  async sendMagicLink(email: string, redirectUrl: string): Promise<void> {
    const res = await fetch(`${this.apiBase}/auth/magic-link`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, redirectUrl }),
      credentials: "include",
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || "Failed to send magic link");
    }
  }

  async signOut(): Promise<void> {
    const res = await fetch(`${this.apiBase}/auth/signout`, {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || "Failed to sign out");
    }
  }

  async getUser(): Promise<IUser | null> {
    const res = await fetch(`${this.apiBase}/auth/me`, {
      method: "GET",
      credentials: "include",
    });

    if (res.status === 401) return null;
    if (!res.ok) return null;

    // 👇 IMPORTANT: return IUser, NOT { user: IUser }
    const user = (await res.json()) as IUser;

    if (!user || !user.id) return null;

    return user;
  }

  async restoreFromUrlTokens(hash: string): Promise<void> {
    const params = new URLSearchParams(hash.replace(/^#/, ""));
    const access_token = params.get("access_token") ?? undefined;

    if (access_token) {
      localStorage.setItem("session_token", access_token);
    }
  }
}

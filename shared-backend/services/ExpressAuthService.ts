import { IAuthService } from "../interfaces/IAuthService";
import { IUser } from "../models/IUser";

export class ExpressAuthService implements IAuthService {
  constructor(private apiBaseUrl: string) { }

  // Send magic link
  async sendMagicLink(email: string, redirectUrl: string): Promise<void> {
    const res = await fetch(`${this.apiBaseUrl}/auth/magic-link`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, redirectUrl }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Magic link request failed: ${text}`);
    }
  }

  // Restore tokens from URL hash (used in callback page)
  async restoreFromUrlTokens(hash: string): Promise<void> {
    const params = new URLSearchParams(hash.replace(/^#/, ""));
    const access_token = params.get("access_token") ?? undefined;

    if (access_token) {
      localStorage.setItem("session_token", access_token);
    }
  }

  // Get current user by sending token to serverless Express endpoint
  async getUser(): Promise<IUser | null> {
    const token = localStorage.getItem("session_token");
    if (!token) return null;

    try {
      const res = await fetch(`${this.apiBaseUrl}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      return data as IUser;
    } catch (err) {
      return null;
    }
  }

  // Logout: call serverless endpoint and clear localStorage
  async signOut(): Promise<void> {
    localStorage.removeItem("session_token");
    await fetch(`${this.apiBaseUrl}/auth/logout`, { method: "POST" });
  }
}

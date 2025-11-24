"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressAuthService = void 0;
class ExpressAuthService {
    constructor(apiBaseUrl) {
        this.apiBaseUrl = apiBaseUrl;
    }
    // Send magic link
    async sendMagicLink(email, redirectUrl) {
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
    async restoreFromUrlTokens(hash) {
        const params = new URLSearchParams(hash.replace(/^#/, ""));
        const access_token = params.get("access_token") ?? undefined;
        if (access_token) {
            localStorage.setItem("session_token", access_token);
        }
    }
    // Get current user by sending token to serverless Express endpoint
    async getUser() {
        const token = localStorage.getItem("session_token");
        if (!token)
            return null;
        try {
            const res = await fetch(`${this.apiBaseUrl}/auth/me`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            return data;
        }
        catch (err) {
            return null;
        }
    }
    // Logout: call serverless endpoint and clear localStorage
    async signOut() {
        localStorage.removeItem("session_token");
        await fetch(`${this.apiBaseUrl}/auth/logout`, { method: "POST" });
    }
}
exports.ExpressAuthService = ExpressAuthService;

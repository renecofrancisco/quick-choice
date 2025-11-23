"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressAuthService = void 0;
class ExpressAuthService {
    constructor(expressApiUrl) {
        this.expressApiUrl = expressApiUrl;
        this.baseUrl = `${this.expressApiUrl}/auth`;
    }
    async sendMagicLink(email, redirectUrl) {
        const res = await fetch(`${this.baseUrl}/signin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, redirectUrl }),
        });
        const data = await res.json();
        if (!res.ok)
            throw new Error(data.error ?? "Failed to send magic link");
    }
    async getSession() {
        // **Automatically consume magic link if URL has access_token**
        if (typeof window !== "undefined") {
            const hash = window.location.hash;
            const params = new URLSearchParams(hash.replace(/^#/, ""));
            const access_token = params.get("access_token");
            if (access_token) {
                // POST to /callback once
                await fetch(`${this.baseUrl}/callback`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ access_token }),
                    credentials: "include",
                });
                // remove hash from URL so this runs only once
                window.history.replaceState(null, "", window.location.pathname);
            }
        }
        // Fetch session user from backend
        const res = await fetch(`${this.baseUrl}/user`, { credentials: "include" });
        if (!res.ok)
            return null;
        const data = await res.json();
        if (!data.user)
            return null;
        return { access_token: null, refresh_token: null, user: data.user };
    }
    async getUser() {
        const session = await this.getSession();
        return { user: session?.user ?? null };
    }
    async signOut() {
        const res = await fetch(`${this.baseUrl}/signout`, {
            method: "POST",
            credentials: "include",
        });
        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error ?? "Failed to sign out");
        }
    }
}
exports.ExpressAuthService = ExpressAuthService;

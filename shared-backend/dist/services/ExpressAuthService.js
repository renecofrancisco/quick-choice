"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressAuthService = void 0;
class ExpressAuthService {
    constructor(apiBase) {
        this.apiBase = apiBase;
    }
    async sendMagicLink(email, redirectUrl) {
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
    async signOut() {
        const res = await fetch(`${this.apiBase}/auth/signout`, {
            method: "POST",
            credentials: "include",
        });
        if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            throw new Error(data.error || "Failed to sign out");
        }
    }
    async getUser() {
        const res = await fetch(`${this.apiBase}/auth/me`, {
            method: "GET",
            credentials: "include",
        });
        if (res.status === 401)
            return null;
        if (!res.ok)
            return null;
        // 👇 IMPORTANT: return IUser, NOT { user: IUser }
        const user = (await res.json());
        if (!user || !user.id)
            return null;
        return user;
    }
}
exports.ExpressAuthService = ExpressAuthService;

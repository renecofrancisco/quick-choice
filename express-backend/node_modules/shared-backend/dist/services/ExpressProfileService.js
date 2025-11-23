"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressProfileService = void 0;
class ExpressProfileService {
    constructor(expressApiUrl) {
        this.expressApiUrl = expressApiUrl;
        this.baseUrl = `${this.expressApiUrl}/profiles`;
    }
    async getUserProfile(userId) {
        const res = await fetch(`${this.baseUrl}/${userId}`);
        if (!res.ok)
            throw new Error("Failed to fetch user profile from Express API");
        const data = await res.json();
        return data || null;
    }
}
exports.ExpressProfileService = ExpressProfileService;

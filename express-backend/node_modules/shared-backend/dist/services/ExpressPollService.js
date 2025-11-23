"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressPollService = void 0;
class ExpressPollService {
    constructor(expressApiUrl) {
        this.expressApiUrl = expressApiUrl;
        this.baseUrl = `${this.expressApiUrl}/polls`;
    }
    async getUserPolls(userId) {
        const res = await fetch(`${this.baseUrl}?userId=${userId}`);
        if (!res.ok)
            throw new Error("Failed to fetch user polls from Express API");
        const data = await res.json();
        return data;
    }
    async getPollById(pollId) {
        const res = await fetch(`${this.baseUrl}/${pollId}`);
        if (!res.ok)
            throw new Error("Failed to fetch poll from Express API");
        const data = await res.json();
        return data || null;
    }
    async createPoll(userId, optionA, optionB) {
        const res = await fetch(`${this.baseUrl}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, optionA, optionB }),
        });
        if (!res.ok)
            throw new Error("Failed to create poll via Express API");
        const data = await res.json();
        return data.pollId; // return new poll id
    }
}
exports.ExpressPollService = ExpressPollService;

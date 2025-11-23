"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressVoteService = void 0;
class ExpressVoteService {
    constructor(expressApiUrl) {
        this.expressApiUrl = expressApiUrl;
        this.baseUrl = `${this.expressApiUrl}`;
    }
    async getNextPoll(userId) {
        const res = await fetch(`${this.baseUrl}/polls/next?userId=${userId}`);
        if (!res.ok)
            throw new Error("Failed to fetch next poll");
        const poll = await res.json();
        return poll || null;
    }
    async vote(userId, pollId, choice) {
        const res = await fetch(`${this.baseUrl}/votes`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, pollId, choice }),
        });
        if (!res.ok)
            throw new Error("Failed to submit vote");
    }
    async triggerFakeVotes(pollId) {
        console.log("Triggering fake votes for pollId:", pollId);
        const res = await fetch(`${this.baseUrl}/votes/fake`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ pollId }),
        });
        if (!res.ok) {
            const text = await res.text();
            throw new Error(`Failed to trigger fake votes: ${text}`);
        }
    }
}
exports.ExpressVoteService = ExpressVoteService;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseVoteService = void 0;
class SupabaseVoteService {
    constructor(supabase) {
        this.supabase = supabase;
    }
    async getNextPoll(userId) {
        const { data, error } = await this.supabase.rpc("get_next_poll", { p_user_id: userId });
        if (error)
            throw new Error(error.message);
        if (!data || data.length === 0)
            return null;
        return data[0];
    }
    async vote(userId, pollId, choice) {
        const { error: voteError } = await this.supabase.from("votes").insert({
            poll_id: pollId,
            user_id: userId,
            choice,
        });
        if (voteError)
            throw new Error(voteError.message);
        const { error: creditError } = await this.supabase.rpc("change_credits", {
            user_uuid: userId,
            change: 1,
        });
        if (creditError)
            console.error("Error adding credit:", creditError);
    }
    async triggerFakeVotes(pollId) {
        const res = await fetch("/api/fakeVotes", {
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
exports.SupabaseVoteService = SupabaseVoteService;

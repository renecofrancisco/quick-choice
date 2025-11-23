"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabasePollService = void 0;
class SupabasePollService {
    constructor(supabase) {
        this.supabase = supabase;
    }
    async getUserPolls(userId) {
        const { data, error } = await this.supabase.rpc("get_user_polls", { p_user_id: userId });
        if (error)
            throw new Error(error.message);
        return (data || []);
    }
    async getPollById(pollId) {
        const { data, error } = await this.supabase.rpc("get_poll_by_id", { p_poll_id: pollId });
        if (error)
            throw new Error(error.message);
        if (!data || data.length === 0)
            return null;
        return data[0];
    }
    async createPoll(userId, optionA, optionB) {
        const { data, error } = await this.supabase.rpc("create_poll", {
            p_user_id: userId,
            p_option_a: optionA,
            p_option_b: optionB,
        });
        if (error)
            throw new Error(error.message);
        return data; // new poll_id
    }
}
exports.SupabasePollService = SupabasePollService;

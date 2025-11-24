"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.triggerFakeVotes = exports.submitVote = void 0;
const supabase_1 = require("../lib/supabase");
// POST /votes
const submitVote = async (req, res) => {
    const { userId, pollId, choice } = req.body;
    if (!userId || !pollId || !choice)
        return res.status(400).json({ error: "Missing fields" });
    try {
        const { error: voteError } = await supabase_1.supabase
            .from("votes")
            .insert({ user_id: userId, poll_id: pollId, choice });
        if (voteError)
            throw voteError;
        const { error: creditError } = await supabase_1.supabase.rpc("change_credits", {
            user_uuid: userId,
            change: 1,
        });
        if (creditError)
            throw creditError;
        res.json({ success: true });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};
exports.submitVote = submitVote;
// POST /votes/fake
const triggerFakeVotes = async (req, res) => {
    const { pollId } = req.body;
    if (!pollId)
        return res.status(400).json({ error: "Missing pollId" });
    try {
        const resFake = await fetch(process.env.FAKE_VOTES_FUNCTION_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ pollId }),
        });
        if (!resFake.ok) {
            const text = await resFake.text();
            throw new Error(`Failed to trigger fake votes: ${text}`);
        }
        res.json({ success: true });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};
exports.triggerFakeVotes = triggerFakeVotes;

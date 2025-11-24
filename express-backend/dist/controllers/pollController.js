"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPoll = exports.getPollById = exports.getUserPolls = exports.getNextPoll = void 0;
const supabase_1 = require("../lib/supabase");
// GET /polls/next?userId=...
const getNextPoll = async (req, res) => {
    const userId = req.query.userId;
    if (!userId)
        return res.status(400).json({ error: "Missing userId" });
    try {
        const { data, error } = await supabase_1.supabase.rpc("get_next_poll", { p_user_id: userId });
        if (error)
            throw error;
        res.json(data?.[0] || null);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};
exports.getNextPoll = getNextPoll;
// GET /polls?userId=...
const getUserPolls = async (req, res) => {
    const userId = req.query.userId;
    if (!userId)
        return res.status(400).json({ error: "Missing userId" });
    const { data, error } = await supabase_1.supabase.rpc("get_user_polls", { p_user_id: userId });
    if (error)
        return res.status(500).json({ error: error.message });
    res.json(data);
};
exports.getUserPolls = getUserPolls;
// GET /polls/:pollId
const getPollById = async (req, res) => {
    const pollId = req.params.pollId;
    const { data, error } = await supabase_1.supabase.rpc("get_poll_by_id", { p_poll_id: pollId });
    if (error)
        return res.status(500).json({ error: error.message });
    res.json(data[0] || null);
};
exports.getPollById = getPollById;
// POST /polls
const createPoll = async (req, res) => {
    const { userId, optionA, optionB } = req.body;
    const { data, error } = await supabase_1.supabase.rpc("create_poll", {
        p_user_id: userId,
        p_option_a: optionA,
        p_option_b: optionB,
    });
    if (error)
        return res.status(500).json({ error: error.message });
    res.json({ pollId: data });
};
exports.createPoll = createPoll;

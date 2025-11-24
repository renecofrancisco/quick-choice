"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserProfile = void 0;
const supabase_1 = require("../lib/supabase");
// GET /profiles/:userId
const getUserProfile = async (req, res) => {
    const userId = req.params.userId;
    const { data, error } = await supabase_1.supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", userId)
        .single();
    if (error)
        return res.status(500).json({ error: error.message });
    res.json(data || null);
};
exports.getUserProfile = getUserProfile;

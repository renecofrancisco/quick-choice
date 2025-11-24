"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.consumeMagicLink = exports.signOut = exports.getUser = exports.sendMagicLink = void 0;
const supabase_1 = require("../lib/supabase");
const mapper_1 = require("../lib/mapper");
// POST /auth/magic-link
const sendMagicLink = async (req, res) => {
    const { email, redirectUrl } = req.body;
    if (!email || !redirectUrl)
        return res.status(400).json({ error: "Missing email or redirectUrl" });
    try {
        const { error } = await supabase_1.supabase.auth.signInWithOtp({
            email,
            options: { emailRedirectTo: redirectUrl },
        });
        if (error)
            return res.status(400).json({ error: error.message });
        res.json({ error: null });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.sendMagicLink = sendMagicLink;
// GET /auth/me
const getUser = async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader)
        return res.json({ user: null });
    const token = authHeader.replace("Bearer ", "");
    const { data, error } = await supabase_1.supabase.auth.getUser(token);
    if (error || !data.user)
        return res.json({ user: null });
    const user = (0, mapper_1.mapSupabaseUserToIUser)(data.user);
    res.json(user);
};
exports.getUser = getUser;
// POST /auth/logout
const signOut = (_req, res) => {
    // Stateless: client just deletes the token
    res.json({ success: true });
};
exports.signOut = signOut;
// Optional: if you want a /auth/callback endpoint (not strictly needed with ExpressAuthService)
const consumeMagicLink = async (req, res) => {
    const { access_token, refresh_token, user } = req.body;
    if (!access_token || !refresh_token || !user)
        return res.status(400).json({ error: "Missing tokens or user" });
    // Just return what frontend needs
    res.json({ access_token, refresh_token, user });
};
exports.consumeMagicLink = consumeMagicLink;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapSupabaseUserToIUser = mapSupabaseUserToIUser;
function mapSupabaseUserToIUser(user) {
    if (!user.email)
        throw new Error("Supabase user has no email");
    return {
        id: user.id,
        email: user.email,
    };
}

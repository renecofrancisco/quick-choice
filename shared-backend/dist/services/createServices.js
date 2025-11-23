"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSupabaseServices = createSupabaseServices;
exports.createExpressServices = createExpressServices;
const SupabaseAuthService_1 = require("./SupabaseAuthService");
const SupabasePollService_1 = require("./SupabasePollService");
const SupabaseProfileService_1 = require("./SupabaseProfileService");
const SupabaseVoteService_1 = require("./SupabaseVoteService");
const ExpressAuthService_1 = require("./ExpressAuthService");
const ExpressPollService_1 = require("./ExpressPollService");
const ExpressProfileService_1 = require("./ExpressProfileService");
const ExpressVoteService_1 = require("./ExpressVoteService");
const supabase_js_1 = require("@supabase/supabase-js");
function createSupabaseServices(supabaseUrl, supabaseAnonKey) {
    const supabaseClient = (0, supabase_js_1.createClient)(supabaseUrl, supabaseAnonKey);
    return {
        authService: new SupabaseAuthService_1.SupabaseAuthService(supabaseClient),
        pollService: new SupabasePollService_1.SupabasePollService(supabaseClient),
        profileService: new SupabaseProfileService_1.SupabaseProfileService(supabaseClient),
        voteService: new SupabaseVoteService_1.SupabaseVoteService(supabaseClient),
    };
}
function createExpressServices(expressApiUrl) {
    return {
        authService: new ExpressAuthService_1.ExpressAuthService(expressApiUrl),
        pollService: new ExpressPollService_1.ExpressPollService(expressApiUrl),
        profileService: new ExpressProfileService_1.ExpressProfileService(expressApiUrl),
        voteService: new ExpressVoteService_1.ExpressVoteService(expressApiUrl),
    };
}

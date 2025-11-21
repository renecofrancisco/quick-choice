import { IAuthService } from "../interfaces/IAuthService";
import { IPollService } from "../interfaces/IPollService";
import { IProfileService } from "../interfaces/IProfileService";
import { IVoteService } from "../interfaces/IVoteService";

import { SupabaseAuthService } from "./SupabaseAuthService";
import { SupabasePollService } from "./SupabasePollService";
import { SupabaseProfileService } from "./SupabaseProfileService";
import { SupabaseVoteService } from "./SupabaseVoteService";

import { ExpressAuthService } from "./ExpressAuthService";
import { ExpressPollService } from "./ExpressPollService";
import { ExpressProfileService } from "./ExpressProfileService";
import { ExpressVoteService } from "./ExpressVoteService";

import { SupabaseClient } from "@supabase/supabase-js";

export interface ServiceContextValue {
  authService: IAuthService;
  pollService: IPollService;
  profileService: IProfileService;
  voteService: IVoteService;
}

export function createSupabaseServices(supabaseClient: SupabaseClient): ServiceContextValue {
  return {
    authService: new SupabaseAuthService(supabaseClient),
    pollService: new SupabasePollService(supabaseClient),
    profileService: new SupabaseProfileService(supabaseClient),
    voteService: new SupabaseVoteService(supabaseClient),
  };
}

export function createExpressServices(expressApiUrl: string): ServiceContextValue {
  return {
    authService: new ExpressAuthService(expressApiUrl),
    pollService: new ExpressPollService(expressApiUrl),
    profileService: new ExpressProfileService(expressApiUrl),
    voteService: new ExpressVoteService(expressApiUrl),
  };
}



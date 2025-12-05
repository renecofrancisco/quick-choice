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

import { GraphQLAuthService } from "./GraphQLAuthService";
import { GraphQLPollService } from "./GraphQLPollService";
import { GraphQLProfileService } from "./GraphQLProfileService";
import { GraphQLVoteService } from "./GraphQLVoteService";

import { createClient } from "@supabase/supabase-js";

export interface ServiceContextValue {
  authService: IAuthService;
  pollService: IPollService;
  profileService: IProfileService;
  voteService: IVoteService;
}

export function createSupabaseServices(supabaseUrl: string, supabaseAnonKey: string): ServiceContextValue {
  const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

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

export function createGraphQLServices(graphqlApiUrl: string): ServiceContextValue {
  return {
    authService: new GraphQLAuthService(graphqlApiUrl),
    pollService: new GraphQLPollService(graphqlApiUrl),
    profileService: new GraphQLProfileService(graphqlApiUrl),
    voteService: new GraphQLVoteService(graphqlApiUrl),
  };
}



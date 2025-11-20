import { IAuthService } from "../interfaces/IAuthService";
import { IPollService } from "../interfaces/IPollService";
import { IProfileService } from "../interfaces/IProfileService";
import { IVoteService } from "../interfaces/IVoteService";

import { SupabaseAuthService } from "./SupabaseAuthService";
import { SupabasePollService } from "./SupabasePollService";
import { SupabaseProfileService } from "./SupabaseProfileService";
import { SupabaseVoteService } from "./SupabaseVoteService";

export interface ServiceContextValue {
  authService: IAuthService;
  pollService: IPollService;
  profileService: IProfileService;
  voteService: IVoteService;
}

export function createServices(): ServiceContextValue {
  return {
    authService: new SupabaseAuthService(),
    pollService: new SupabasePollService(),
    profileService: new SupabaseProfileService(),
    voteService: new SupabaseVoteService(),
  };
}

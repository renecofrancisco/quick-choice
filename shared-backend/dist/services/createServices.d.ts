import { IAuthService } from "../interfaces/IAuthService";
import { IPollService } from "../interfaces/IPollService";
import { IProfileService } from "../interfaces/IProfileService";
import { IVoteService } from "../interfaces/IVoteService";
export interface ServiceContextValue {
    authService: IAuthService;
    pollService: IPollService;
    profileService: IProfileService;
    voteService: IVoteService;
}
export declare function createSupabaseServices(supabaseUrl: string, supabaseAnonKey: string): ServiceContextValue;
export declare function createExpressServices(expressApiUrl: string): ServiceContextValue;

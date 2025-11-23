import { IProfileService } from "../interfaces/IProfileService";
import { IUserProfile } from "../models/IUserProfile";
export declare class ExpressProfileService implements IProfileService {
    private expressApiUrl;
    constructor(expressApiUrl: string);
    private baseUrl;
    getUserProfile(userId: string): Promise<IUserProfile | null>;
}

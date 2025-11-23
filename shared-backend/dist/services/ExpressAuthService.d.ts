import { IAuthService } from "../interfaces/IAuthService";
import { IUser } from "../models/IUser";
export declare class ExpressAuthService implements IAuthService {
    private expressApiUrl;
    constructor(expressApiUrl: string);
    private baseUrl;
    sendMagicLink(email: string, redirectUrl: string): Promise<void>;
    getSession(): Promise<{
        access_token: string | null;
        refresh_token: string | null;
        user: IUser;
    } | null>;
    getUser(): Promise<{
        user: IUser | null;
    }>;
    signOut(): Promise<void>;
}

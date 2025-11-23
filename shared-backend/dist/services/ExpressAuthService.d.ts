import { IAuthService } from "../interfaces/IAuthService";
import { IUser } from "../models/IUser";
export declare class ExpressAuthService implements IAuthService {
    private apiBaseUrl;
    constructor(apiBaseUrl: string);
    sendMagicLink(email: string, redirectUrl: string): Promise<void>;
    restoreFromUrlTokens(hash: string): Promise<void>;
    getUser(): Promise<IUser | null>;
    signOut(): Promise<void>;
}

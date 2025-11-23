import { IAuthService } from "../interfaces/IAuthService";
import { IUser } from "../models/IUser";
export declare class ExpressAuthService implements IAuthService {
    private apiBase;
    constructor(apiBase: string);
    sendMagicLink(email: string, redirectUrl: string): Promise<void>;
    signOut(): Promise<void>;
    getUser(): Promise<IUser | null>;
    restoreFromUrlTokens(hash: string): Promise<void>;
}

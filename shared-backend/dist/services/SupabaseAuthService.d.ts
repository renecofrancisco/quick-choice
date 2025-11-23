import type { SupabaseClient } from "@supabase/supabase-js";
import { IAuthService } from "../interfaces/IAuthService";
import { IUser } from "../models/IUser";
export declare class SupabaseAuthService implements IAuthService {
    private supabase;
    constructor(supabase: SupabaseClient);
    sendMagicLink(email: string, redirectUrl: string): Promise<void>;
    signOut(): Promise<void>;
    getUser(): Promise<IUser | null>;
}

import { IAuthService } from "../interfaces/IAuthService";
import type { SupabaseClient } from "@supabase/supabase-js";
import { IUser } from "../models/IUser";
export declare class SupabaseAuthService implements IAuthService {
    private supabase;
    constructor(supabase: SupabaseClient);
    sendMagicLink(email: string, redirectUrl: string): Promise<void>;
    getUser(): Promise<{
        user: IUser | null;
    }>;
    getSession(): Promise<{
        access_token: string;
        refresh_token: string;
        user: import("@supabase/supabase-js").AuthUser;
    } | null>;
    signOut(): Promise<void>;
}

import { IUser } from "shared-backend";
import { User as SupabaseUser } from "@supabase/supabase-js";
export declare function mapSupabaseUserToIUser(user: SupabaseUser): IUser;

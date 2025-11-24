import { IUser } from "shared-backend";
import { User as SupabaseUser } from "@supabase/supabase-js";

export function mapSupabaseUserToIUser(user: SupabaseUser): IUser {
  if (!user.email) throw new Error("Supabase user has no email");

  return {
    id: user.id,
    email: user.email,
  };
}
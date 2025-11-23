import jwt from "jsonwebtoken";
import { IUser } from "shared-backend";
import { User as SupabaseUser } from "@supabase/supabase-js";


const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";
const EXPIRATION = "7d"; // token expires in 7 days

export function signToken(user: IUser) {
  return jwt.sign({ user }, JWT_SECRET, { expiresIn: EXPIRATION });
}

export function verifyToken(token: string): IUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { user: IUser };
    return decoded.user;
  } catch (err) {
    return null;
  }
}

export function mapSupabaseUserToIUser(user: SupabaseUser): IUser {
  if (!user.email) throw new Error("Supabase user has no email");

  return {
    id: user.id,
    email: user.email,
  };
}

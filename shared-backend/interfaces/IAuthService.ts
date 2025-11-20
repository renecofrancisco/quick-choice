import { IUser } from "../models/IUser";

export interface IAuthService {
  getUser(): Promise<{ user: IUser | null }>;
  onAuthStateChange(callback: (event: string, session: { user: IUser } | null) => void): { unsubscribe(): void };
  signInWithOtp(email: string, redirectUrl: string): Promise<{ error: string | null }>;
  exchangeCodeForSession(callbackUrl: string): Promise<void>;
  signOut(): Promise<void>;
}

import { IUser } from "../models/IUser";

export interface IAuthService {
  sendMagicLink(email: string, redirectUrl: string): Promise<void>;
  signOut(): Promise<void>;
  getUser(): Promise<IUser | null>;
  restoreFromUrlTokens(hash: string): Promise<void>;
}

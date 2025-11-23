import { IUser } from "../models/IUser";

export interface IAuthService {
  getUser(): Promise<{ user: IUser | null }>;
  sendMagicLink(email: string, redirectUrl: string): Promise<void>;
  getSession(): Promise<{ access_token: string | null; refresh_token?: string | null; user?: any } | null>;
  signOut(): Promise<void>;
}

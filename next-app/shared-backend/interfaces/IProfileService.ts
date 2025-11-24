import { IUserProfile } from "../models/IUserProfile";

export interface IProfileService {
  getUserProfile(userId: string): Promise<IUserProfile | null>;
}

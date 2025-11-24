// shared-backend/services/ExpressProfileService.ts
import { IProfileService } from "../interfaces/IProfileService";
import { IUserProfile } from "../models/IUserProfile";

export class ExpressProfileService implements IProfileService {
  constructor(private apiBaseUrl: string) { }

  async getUserProfile(userId: string): Promise<IUserProfile | null> {
    const res = await fetch(`${this.apiBaseUrl}/profiles/${userId}`);
    if (!res.ok) throw new Error("Failed to fetch user profile from Express API");
    const data = await res.json();
    return data || null;
  }
}

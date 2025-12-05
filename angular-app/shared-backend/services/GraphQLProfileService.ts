// shared-backend/services/GraphQLProfileService.ts
import { IProfileService } from "../interfaces/IProfileService";
import { IUserProfile } from "../models/IUserProfile";
import { GraphQLBaseService } from "./GraphQLBaseService";

export class GraphQLProfileService extends GraphQLBaseService implements IProfileService {
  constructor(apiBaseUrl: string) {
    super(apiBaseUrl);
  }

  async getUserProfile(userId: string): Promise<IUserProfile | null> {
    const query = `
      query GetUserProfile($userId: String!) {
        get_user_profile(user_id: $userId) {
          user_id
          credits
        }
      }
    `;
    const res = await this.graphql(query, { userId });
    if (res.errors) throw new Error(res.errors[0].message);
    return res.data.get_user_profile as IUserProfile | null;
  }
}

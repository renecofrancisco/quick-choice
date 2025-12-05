import { IAuthService } from "../interfaces/IAuthService";
import { IUser } from "../models/IUser";
import { GraphQLBaseService } from "./GraphQLBaseService";

export class GraphQLAuthService extends GraphQLBaseService implements IAuthService {
  constructor(apiBaseUrl: string) {
    super(apiBaseUrl);
  }

  async sendMagicLink(email: string, redirectUrl: string): Promise<void> {
    const query = `
      mutation SendMagicLink($email: String!, $redirectUrl: String!) {
        sendMagicLink(email: $email, redirectUrl: $redirectUrl)
      }
    `;
    const res = await this.graphql(query, { email, redirectUrl });
    if (res.errors) throw new Error(res.errors[0].message);
  }

  async restoreFromUrlTokens(hash: string): Promise<void> {
    const params = new URLSearchParams(hash.replace(/^#/, ""));
    const access_token = params.get("access_token");

    if (access_token) {
      localStorage.setItem("session_token", access_token);
    }
  }

  async getUser(): Promise<IUser | null> {
    const token = localStorage.getItem("session_token");
    if (!token) return null;

    const query = `
      query Me($token: String!) {
        me(token: $token) {
          id
          email
        }
      }
    `;
    const res = await this.graphql(query, { token });

    if (res.errors) return null;

    return res.data.me as IUser;
  }

  async signOut(): Promise<void> {
    const query = `mutation { logout }`;
    await this.graphql(query);
    localStorage.removeItem("session_token");
  }
}

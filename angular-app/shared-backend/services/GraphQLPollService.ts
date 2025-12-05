// shared-backend/services/GraphQLPollService.ts
import { IPollService } from "../interfaces/IPollService";
import { IPoll } from "../models/IPoll";
import { GraphQLBaseService } from "./GraphQLBaseService";

export class GraphQLPollService extends GraphQLBaseService implements IPollService {
  constructor(graphqlUrl: string) {
    super(graphqlUrl);
  }

  async getUserPolls(userId: string): Promise<IPoll[]> {
    const query = `
      query GetUserPolls($userId: String!) {
        get_user_polls(user_id: $userId) {
          poll_id
          option_a
          option_b
          votes_a
          votes_b,
          votes_skip
        }
      }
    `;
    const res = await this.graphql(query, { userId });
    return res.data.get_user_polls as IPoll[];
  }

  async getPollById(pollId: string): Promise<IPoll | null> {
    const query = `
      query GetPollById($pollId: String!) {
        get_poll_by_id(poll_id: $pollId) {
          poll_id
          option_a
          option_b
          votes_a
          votes_b,
          votes_skip
        }
      }
    `;
    const res = await this.graphql(query, { pollId });
    return res.data.get_poll_by_id as IPoll | null;
  }

  async createPoll(userId: string, optionA: string, optionB: string): Promise<string> {
    const mutation = `
      mutation CreatePoll($userId: String!, $optionA: String!, $optionB: String!) {
        create_poll(user_id: $userId, option_a: $optionA, option_b: $optionB)
      }
    `;
    const res = await this.graphql(mutation, { userId, optionA, optionB });
    return res.data.create_poll as string;
  }
}

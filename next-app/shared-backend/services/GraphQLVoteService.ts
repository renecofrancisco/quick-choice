// shared-backend/services/GraphQLVoteService.ts
import { IVoteService } from "../interfaces/IVoteService";
import { IPoll } from "../models/IPoll";
import { GraphQLBaseService } from "./GraphQLBaseService";

export class GraphQLVoteService extends GraphQLBaseService implements IVoteService {
  constructor(apiBaseUrl: string) {
    super(apiBaseUrl);
  }

  async getNextPoll(userId: string): Promise<IPoll | null> {
    const query = `
      query NextPoll($userId: String!) {
        get_next_poll(user_id: $userId) {
          poll_id
          option_a
          option_b
          votes_a
          votes_b
        }
      }
    `;
    const res = await this.graphql(query, { userId });
    if (res.errors) throw new Error(res.errors[0].message);
    return res.data.get_next_poll as IPoll | null;
  }

  async vote(userId: string, pollId: string, choice: "A" | "B" | "skip"): Promise<void> {
    const mutation = `
      mutation Vote($userId: String!, $pollId: String!, $choice: String!) {
        vote(user_id: $userId, poll_id: $pollId, choice: $choice)
      }
    `;
    const res = await this.graphql(mutation, { userId, pollId, choice });
    if (res.errors) throw new Error(res.errors[0].message);
  }

  async triggerFakeVotes(pollId: string): Promise<void> {
    const mutation = `
      mutation TriggerFakeVotes($pollId: String!) {
        trigger_fake_votes(poll_id: $pollId)
      }
    `;
    const res = await this.graphql(mutation, { pollId });
    console.log("TriggerFakeVotes GraphQL response:", res);
    if (res.errors) throw new Error(res.errors[0].message);
  }
}

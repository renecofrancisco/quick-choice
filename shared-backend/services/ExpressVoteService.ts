// shared-backend/services/ExpressVoteService.ts
import { IVoteService } from "../interfaces/IVoteService";
import { IPoll } from "../models/IPoll";

export class ExpressVoteService implements IVoteService {
  constructor(private expressApiUrl: string) { }
  private baseUrl = `${this.expressApiUrl!}`;

  async getNextPoll(userId: string): Promise<IPoll | null> {
    const res = await fetch(`${this.baseUrl}/polls/next?userId=${userId}`);
    if (!res.ok) throw new Error("Failed to fetch next poll");
    const poll = await res.json();
    return poll || null;
  }

  async vote(userId: string, pollId: string, choice: "A" | "B" | "skip"): Promise<void> {
    const res = await fetch(`${this.baseUrl}/votes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, pollId, choice }),
    });
    if (!res.ok) throw new Error("Failed to submit vote");
  }

  async triggerFakeVotes(pollId: string): Promise<void> {
    console.log("Triggering fake votes for pollId:", pollId);

    const res = await fetch(`${this.baseUrl}/votes/fake`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pollId }),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Failed to trigger fake votes: ${text}`);
    }
  }
}

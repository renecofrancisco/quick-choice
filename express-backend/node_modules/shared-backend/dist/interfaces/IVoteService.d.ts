import { IPoll } from "../models/IPoll";
export interface IVoteService {
    getNextPoll(userId: string): Promise<IPoll | null>;
    vote(userId: string, pollId: string, choice: "A" | "B" | "skip"): Promise<void>;
    triggerFakeVotes(pollId: string): Promise<void>;
}

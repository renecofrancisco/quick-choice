import { IVoteService } from "../interfaces/IVoteService";
import { IPoll } from "../models/IPoll";
export declare class ExpressVoteService implements IVoteService {
    private expressApiUrl;
    constructor(expressApiUrl: string);
    private baseUrl;
    getNextPoll(userId: string): Promise<IPoll | null>;
    vote(userId: string, pollId: string, choice: "A" | "B" | "skip"): Promise<void>;
    triggerFakeVotes(pollId: string): Promise<void>;
}

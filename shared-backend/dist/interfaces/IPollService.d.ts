import { IPoll } from "../models/IPoll";
export interface IPollService {
    getUserPolls(userId: string): Promise<IPoll[]>;
    getPollById(pollId: string): Promise<IPoll | null>;
    createPoll(userId: string, optionA: string, optionB: string): Promise<string>;
}

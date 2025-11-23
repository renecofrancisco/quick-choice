import { IPollService } from "../interfaces/IPollService";
import { IPoll } from "../models/IPoll";
export declare class ExpressPollService implements IPollService {
    private expressApiUrl;
    constructor(expressApiUrl: string);
    private baseUrl;
    getUserPolls(userId: string): Promise<IPoll[]>;
    getPollById(pollId: string): Promise<IPoll | null>;
    createPoll(userId: string, optionA: string, optionB: string): Promise<string>;
}

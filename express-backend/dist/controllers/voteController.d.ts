import { Request, Response } from "express";
export declare const submitVote: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const triggerFakeVotes: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;

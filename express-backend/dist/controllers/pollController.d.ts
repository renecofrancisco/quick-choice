import { Request, Response } from "express";
export declare const getNextPoll: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getUserPolls: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getPollById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createPoll: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;

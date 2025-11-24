import { Request, Response } from "express";
export declare const sendMagicLink: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const signOut: (_req: Request, res: Response) => void;
export declare const consumeMagicLink: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;

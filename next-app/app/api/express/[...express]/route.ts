import { NextRequest } from "next/server";
import serverless from "serverless-http";
import app from "express-backend";

const handler = serverless(app);

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  return handler(req as any, {} as any);
}

export async function POST(req: NextRequest) {
  return handler(req as any, {} as any);
}

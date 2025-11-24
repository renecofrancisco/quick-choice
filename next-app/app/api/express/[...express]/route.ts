import { NextRequest, NextResponse } from "next/server";
import serverless from "serverless-http";
import app from "express-backend";

// Tell TypeScript what serverless-http returns
type ServerlessResult = {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
};

const handler = serverless(app);

async function runExpress(req: NextRequest): Promise<NextResponse> {
  const res = (await handler(req as any, {} as any)) as ServerlessResult;

  return new NextResponse(res.body, {
    status: res.statusCode,
    headers: res.headers,
  });
}

export async function GET(req: NextRequest) {
  return runExpress(req);
}

export async function POST(req: NextRequest) {
  return runExpress(req);
}


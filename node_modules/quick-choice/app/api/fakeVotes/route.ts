import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { pollId } = await req.json();

  const res = await fetch(
    process.env.NEXT_PUBLIC_FAKE_VOTES_FUNCTION_URL!,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pollId }),
    }
  );

  const text = await res.text();
  return new NextResponse(text, {
    headers: { "Content-Type": "text/plain" },
  });
}

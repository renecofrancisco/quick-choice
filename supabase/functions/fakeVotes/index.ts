// supabase/functions/fakeVotes/index.ts

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.34.0/dist/module/index.js";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SERVICE_ROLE_KEY")!
);

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const runtime = "edge";

Deno.serve(async (req: Request) => {
  try {
    const { pollId } = await req.json();
    if (!pollId) return new Response("Missing pollId", { status: 400 });

    for (let i = 0; i < 100; i++) {
      const choice = ["a", "b", "skip"][Math.floor(Math.random() * 3)];

      await supabase.from("votes").insert({
        poll_id: pollId,
        user_id: crypto.randomUUID(),
        choice,
      });

      await sleep(Math.random() * 100);
    }

    return new Response(`Inserted 100 fake votes for poll ${pollId}`);
  } catch (err) {
    console.error(err);
    return new Response("Internal Server Error", { status: 500 });
  }
});

// supabase/functions/fakeVotes/index.ts

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const FAKE_USER_ID = "663b8890-63ad-4f4c-8464-c55b7b803efe";

export const runtime = "edge";

Deno.serve(async (req: Request) => {
  try {
    const { pollId } = await req.json();
    if (!pollId) return new Response("Missing pollId", { status: 400 });

    for (let i = 0; i < 100; i++) {
      const choice = ["A", "B"][Math.floor(Math.random() * 2)];

      const { error } = await supabase.from("votes").insert({
        poll_id: pollId,
        user_id: FAKE_USER_ID,
        choice,
      });

      if (error) {
        console.log("Insert error:", error);
      }

      await sleep(Math.random() * 100);
    }

    return new Response(`Inserted 100 fake votes for poll ${pollId}`);
  } catch (err) {
    console.error(err);
    return new Response("Internal Server Error", { status: 500 });
  }
});

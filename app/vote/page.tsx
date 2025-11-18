"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function VotePage() {
  const [poll, setPoll] = useState<any>(null);
  const [message, setMessage] = useState("");

  // Fetch next poll using RPC
  async function fetchNextPoll() {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return;

    const { data, error } = await supabase.rpc("get_next_poll", {
      p_user_id: user.id,
    });

    if (error) {
      console.error("Error fetching poll:", error);
      setMessage("Error loading poll.");
      return;
    }

    if (!data || data.length === 0) {
      setPoll(null);
      setMessage("No more polls available.");
      return;
    }

    setPoll(data[0]);
    setMessage("");
  }

  // Vote or skip
  async function vote(choice: "A" | "B" | "skip") {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user || !poll) return;

    // Insert vote
    const { error } = await supabase.from("votes").insert({
      poll_id: poll.id,
      user_id: user.id,
      choice,
    });

    if (error) {
      console.error("Error submitting vote:", error);
      setMessage("Error submitting vote.");
      return;
    }

    // Add 1 credit for voting
    const { error: creditError } = await supabase.rpc("change_credits", {
      user_uuid: user.id,
      change: 1,
    });

    if (creditError) {
      console.error("Error adding credit:", creditError);
    }

    // Fetch next poll
    fetchNextPoll();
  }

  useEffect(() => {
    fetchNextPoll();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 space-y-6">

  {poll ? (
    <>
      {/* Options container */}
      <div className="flex flex-col items-center space-y-4">
        <button
          onClick={() => vote("A")}
          className="bg-blue-600 text-white text-2xl font-bold p-6 rounded-lg w-64 max-w-full hover:bg-blue-700 transition"
        >
          {poll.option_a}
        </button>

        <span className="text-gray-500 font-semibold text-lg">OR</span>

        <button
          onClick={() => vote("B")}
          className="bg-green-600 text-white text-2xl font-bold p-6 rounded-lg w-64 max-w-full hover:bg-green-700 transition"
        >
          {poll.option_b}
        </button>
      </div>

      {/* Skip button: detached */}
      <button
  onClick={() => vote("skip")}
  className="mt-8 bg-gray-200 text-gray-500 text-sm p-2 rounded w-40"
>
  Skip
</button>
    </>
  ) : (
    <p className="text-gray-600">{message || "Loading poll..."}</p>
  )}
</div>


  );
}

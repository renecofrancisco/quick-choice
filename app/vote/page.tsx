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
    <div className="flex flex-col items-center justify-center h-screen p-6 space-y-4">
      {poll ? (
        <>
          <h1 className="text-2xl font-bold">Vote</h1>
          <button
            onClick={() => vote("A")}
            className="bg-blue-600 text-white p-3 rounded w-full"
          >
            {poll.option_a}
          </button>
          <button
            onClick={() => vote("B")}
            className="bg-green-600 text-white p-3 rounded w-full"
          >
            {poll.option_b}
          </button>
          <button
            onClick={() => vote("skip")}
            className="bg-gray-400 text-white p-2 rounded w-full"
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

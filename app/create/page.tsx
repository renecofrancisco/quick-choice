"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function CreatePollPage() {
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(""); // reset message

    // Get current user
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return;

    const userId = user.id;

    // Get user credits
    const { data: profile, error } = await supabase
      .from("user_profiles")
      .select("credits")
      .eq("user_id", userId)
      .single();

    if (error) {
      setMessage("Error fetching profile.");
      return;
    }

    if ((profile?.credits || 0) < 1) {
      setMessage("Not enough credits to post a poll.");
      return;
    }

    // Insert the new poll
    const { error: pollError } = await supabase.from("polls").insert({
      option_a: optionA,
      option_b: optionB,
      created_by: userId,
    });

    if (pollError) {
      setMessage("Error creating poll.");
      return;
    }

    // Deduct 1 credit using RPC
    const { error: rpcError } = await supabase.rpc("change_credits", {
      user_uuid: userId,
      change: -1,
    });

    if (rpcError) {
      setMessage("Error updating credits.");
      return;
    }

    // Reset form
    setOptionA("");
    setOptionB("");
    setMessage("Poll posted successfully!");
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen p-6 space-y-4">
      <h1 className="text-2xl font-bold">Create a Poll</h1>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-2 w-full max-w-sm">
        <input
          type="text"
          placeholder="Option A"
          value={optionA}
          onChange={(e) => setOptionA(e.target.value)}
          maxLength={20}
          required
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Option B"
          value={optionB}
          onChange={(e) => setOptionB(e.target.value)}
          maxLength={20}
          required
          className="border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
        >
          Post Poll (-1 credit)
        </button>
      </form>
      {message && <p className="text-green-600">{message}</p>}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useServices } from "../../contexts/ServiceContext";
import { IPoll } from "shared-backend";

export default function VotePage() {
  const { authService, voteService } = useServices();
  const [poll, setPoll] = useState<IPoll | null>(null);
  const [message, setMessage] = useState("");

  async function fetchNextPoll() {
    const user = await authService.getUser();
    if (!user) return;

    try {
      const nextPoll = await voteService.getNextPoll(user.id);
      if (!nextPoll) {
        setPoll(null);
        setMessage("No more polls available.");
      } else {
        setPoll(nextPoll);
        setMessage("");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error loading poll.");
    }
  }

  async function vote(choice: "A" | "B" | "skip") {
    const user = await authService.getUser();
    if (!user || !poll) return;

    try {
      await voteService.vote(user.id, poll.poll_id, choice);
      fetchNextPoll();
    } catch (err) {
      console.error(err);
      setMessage("Error submitting vote.");
    }
  }

  useEffect(() => {
    fetchNextPoll();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center flex-1 px-6">
      {poll ? (
        <>
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

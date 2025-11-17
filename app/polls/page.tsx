"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Poll {
  poll_id: string;
  option_a: string;
  option_b: string;
  votes_a: number;
  votes_b: number;
  votes_skip: number;
}

export default function MyPollsPage() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [message, setMessage] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserAndPolls = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);
      fetchPolls(user.id);
    };

    fetchUserAndPolls();
  }, []);

  const fetchPolls = async (uid: string) => {
    const { data, error } = await supabase.rpc("get_user_polls", {
      p_user_id: uid,
    });

    if (error) {
      console.error(error);
      setMessage("Error fetching your polls.");
    } else if (!data || data.length === 0) {
      setMessage("You haven't created any polls yet.");
      setPolls([]);
    } else {
      setMessage("");
      setPolls(data as Poll[]);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    const { error } = await supabase.rpc("create_poll", {
      p_option_a: optionA,
      p_option_b: optionB,
    });

    if (error) {
      setMessage("Error creating poll.");
    } else {
      setMessage("Poll created successfully!");
      setOptionA("");
      setOptionB("");
      fetchPolls(userId);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      {/* Create New Poll */}
      <div className="border p-4 rounded space-y-2">
        <h2 className="text-xl font-bold">Create New Poll</h2>
        <form onSubmit={handleCreate} className="flex flex-col space-y-2">
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
            className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Post Poll (-1 credit)
          </button>
        </form>
      </div>

      {/* My Last 5 Polls */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">My Last 5 Polls</h2>
        {message && <p>{message}</p>}
        {polls.map((poll) => {
          const totalVotes = poll.votes_a + poll.votes_b + poll.votes_skip;
          return (
            <div key={poll.poll_id} className="border p-4 rounded">
              <p className="font-semibold">
                {poll.option_a} vs {poll.option_b}
              </p>
              <div className="text-sm mt-2">
                <p>
                  Option A: {poll.votes_a} (
                  {totalVotes ? ((poll.votes_a / totalVotes) * 100).toFixed(1) : 0}%)
                </p>
                <p>
                  Option B: {poll.votes_b} (
                  {totalVotes ? ((poll.votes_b / totalVotes) * 100).toFixed(1) : 0}%)
                </p>
                <p>
                  Skipped: {poll.votes_skip} (
                  {totalVotes ? ((poll.votes_skip / totalVotes) * 100).toFixed(1) : 0}%)
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

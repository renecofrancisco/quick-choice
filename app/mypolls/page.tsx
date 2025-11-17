"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function MyPollsPage() {
  const [polls, setPolls] = useState<any[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchMyPolls() {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) return;

      const { data, error } = await supabase.rpc("get_user_polls", {
        p_user_id: user.id,
      });

      if (error) {
        console.error(error);
        setMessage("Error fetching your polls.");
      } else if (!data || data.length === 0) {
        setMessage("You haven't created any polls yet.");
      } else {
        setPolls(data);
      }
    }

    fetchMyPolls();
  }, []);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Polls</h1>
      {message && <p>{message}</p>}
      {polls.map((poll) => {
        const totalVotes = poll.votes_a + poll.votes_b + poll.votes_skip;
        return (
          <div key={poll.poll_id} className="border p-4 rounded mb-4">
            <p className="font-semibold">{poll.option_a} vs {poll.option_b}</p>
            <div className="text-sm mt-2">
              <p>Option A: {poll.votes_a} ({totalVotes ? ((poll.votes_a/totalVotes)*100).toFixed(1) : 0}%)</p>
              <p>Option B: {poll.votes_b} ({totalVotes ? ((poll.votes_b/totalVotes)*100).toFixed(1) : 0}%)</p>
              <p>Skipped: {poll.votes_skip} ({totalVotes ? ((poll.votes_skip/totalVotes)*100).toFixed(1) : 0}%)</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";

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

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [selectedPoll, setSelectedPoll] = useState<Poll | null>(null);

  const COLORS = ["#4f46e5", "#16a34a", "#facc15"]; // blue, green, yellow

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);
      fetchPolls(user.id);
    };
    load();
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

  const fetchPollById = async (pollId: string) => {
    if (!userId) return null;

    const { data, error } = await supabase.rpc("get_poll_by_id", {
      p_poll_id: pollId,
    });

    if (error) {
      console.error('Error fetching poll:', error);
      return null;
    }

    if (!data || data.length === 0) return null;

    const latestPoll = data[0] as Poll;

    setPolls((prevPolls) =>
      prevPolls.map((p) => (p.poll_id === pollId ? latestPoll : p))
    );

    return latestPoll;
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    const { data, error } = await supabase.rpc("create_poll", {
      p_user_id: userId,
      p_option_a: optionA,
      p_option_b: optionB,
    });

    const newPollId = data as string;

    if (error) {
      setMessage("Error creating poll.");
    } else {
      setOptionA("");
      setOptionB("");
      setShowCreateModal(false);
      fetchPolls(userId);
    }

    try {
      await fetch("/api/fakeVotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pollId: newPollId }),
      });
    } catch (err) {
      console.error("Failed to trigger fakeVotes function", err);
    }
  };

  const openResultModal = async (poll: Poll) => {
    const latestPoll = await fetchPollById(poll.poll_id); // fetch fresh data
    setSelectedPoll(latestPoll || poll); // fallback to old data if fetch fails
    setShowResultModal(true);
  };


  return (
    <div className="flex flex-col items-center justify-start h-full p-6 space-y-6">
      {message && <p>{message}</p>}

      {/* Poll List: only show choices */}
      <div className="space-y-4">
        {polls.map((poll) => (
          <button
            key={poll.poll_id}
            onClick={() => openResultModal(poll)}
            className="w-full text-left border p-4 rounded hover:bg-gray-50"
          >
            {poll.option_a} vs {poll.option_b}
          </button>
        ))}
      </div>

      {/* Floating + Button */}
      <button
        onClick={() => setShowCreateModal(true)}
        className="fixed bottom-20 right-6 bg-blue-600 text-white w-14 h-14 rounded-full text-3xl flex items-center justify-center shadow-lg hover:bg-blue-700"
      >
        +
      </button>


      {/* Create Poll Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Create New Poll</h2>
            <form onSubmit={handleCreate} className="space-y-3">
              <input
                type="text"
                placeholder="Option A"
                value={optionA}
                onChange={(e) => setOptionA(e.target.value)}
                maxLength={20}
                required
                className="border p-2 rounded w-full"
              />
              <input
                type="text"
                placeholder="Option B"
                value={optionB}
                onChange={(e) => setOptionB(e.target.value)}
                maxLength={20}
                required
                className="border p-2 rounded w-full"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Create (-1 credit)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Poll Result Modal */}
      {showResultModal && selectedPoll && (() => {
        const votesA = selectedPoll.votes_a;
        const votesB = selectedPoll.votes_b;
        const totalVotes = votesA + votesB || 1; // avoid division by zero
        const percentA = ((votesA / totalVotes) * 100).toFixed(1);
        const percentB = ((votesB / totalVotes) * 100).toFixed(1);

        // Determine winner
        const winner =
          votesA > votesB
            ? selectedPoll.option_a
            : votesB > votesA
            ? selectedPoll.option_b
            : selectedPoll.option_a; // tie → first option wins

        const winnerPercent =
          votesA > votesB ? percentA : votesB > votesA ? percentB : percentA;

        return (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <h2 className="text-lg font-bold mb-2">
                {selectedPoll.option_a} vs {selectedPoll.option_b}
              </h2>

              <p className="mb-4 text-center font-semibold text-blue-600">
                Winner: {winner} ({winnerPercent}%)
              </p>

              <PieChart width={300} height={300}>
                <Pie
                  data={[
                    { name: selectedPoll.option_a, value: votesA },
                    { name: selectedPoll.option_b, value: votesB },
                  ]}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) =>
                    `${name}: ${((percent ?? 0) * 100).toFixed(1)}%`
                  }
                >
                  <Cell key="A" fill="#4f46e5" /> {/* Option A = blue */}
                  <Cell key="B" fill="#16a34a" /> {/* Option B = green */}
                </Pie>
                <Tooltip formatter={(value: number) => `${value} votes`} />
                <Legend />
              </PieChart>

              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setShowResultModal(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        );
      })()}



    </div>
  );
}

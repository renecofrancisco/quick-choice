"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ProfilePage() {
  const [credits, setCredits] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  async function fetchCredits() {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return;

    const userId = user.id;

    const { data, error } = await supabase
      .from("user_profiles")
      .select("credits")
      .eq("user_id", userId)
      .single();

    if (error) {
      setMessage("Error fetching credits");
      return;
    }

    setCredits(data?.credits || 0);
  }

  useEffect(() => {
    fetchCredits();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen p-6 space-y-4">
      <h1 className="text-2xl font-bold">Your Credits</h1>
      {message && <p className="text-red-600">{message}</p>}
      <p className="text-xl">{credits !== null ? credits : "Loading..."}</p>
    </div>
  );
}

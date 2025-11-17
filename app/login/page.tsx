"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithOtp({
      email,
    });

    if (!error) {
      setSent(true);
    } else {
      alert(error.message);
    }
  }

  return (
    <div className="flex h-screen items-center justify-center p-6">
      <div className="max-w-sm w-full bg-white shadow p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">Quick Choice</h1>

        {sent ? (
          <div className="text-center text-green-600">
            Check your email for a login link.
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Your email"
              className="w-full border p-3 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
            >
              Send Magic Link
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

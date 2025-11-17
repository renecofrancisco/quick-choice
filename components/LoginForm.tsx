"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        router.replace("/"); // Redirect if already logged in
      } else {
        setLoading(false); // Show login form
      }
    };
    checkUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) router.replace("/");
    });

    return () => listener?.subscription.unsubscribe();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) setMessage(error.message);
    else setMessage("Check your email for the login link!");
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="flex flex-col items-center justify-center h-screen p-6 space-y-4">
      <h1 className="text-2xl font-bold">Login</h1>
      <form onSubmit={handleLogin} className="flex flex-col space-y-2 w-full max-w-sm">
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
        >
          Send Login Link
        </button>
      </form>
      {message && <p className="text-green-600">{message}</p>}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useServices } from "../contexts/ServiceContext";

export default function LoginPage() {
  const router = useRouter();
  const { authService } = useServices(); // use context services
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await authService.getUser();
        if (user) {
          router.replace("/"); // Redirect if logged in
        } else {
          setLoading(false); // Show login form
        }
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    checkUser();
  }, [router, authService]);

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("Sending magic link to:", email);
      console.log("Redirect url:", process.env.NEXT_PUBLIC_APP_URL);

      await authService.sendMagicLink(
        email,
        `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`
      );
      setMessage("Check your email for the login link!");
    } catch (err: any) {
      console.error(err);
      setMessage("An error occurred while sending login link.");
    }
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

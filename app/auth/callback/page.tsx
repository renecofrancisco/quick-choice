"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth
      .exchangeCodeForSession(location.href)
      .then(() => router.push("/"))
      .catch((err) => console.error("Error:", err));
  }, [router]);

  return <p>Signing you in…</p>;
}

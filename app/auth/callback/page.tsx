"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useServices } from "@/shared-backend/contexts/ServiceContext";

export default function AuthCallback() {
  const router = useRouter();
  const { authService } = useServices();

  useEffect(() => {
    authService
      .exchangeCodeForSession(location.href)
      .then(() => router.push("/"))
      .catch((err) => console.error("Error:", err));
  }, [router, authService]);

  return <p>Signing you in…</p>;
}

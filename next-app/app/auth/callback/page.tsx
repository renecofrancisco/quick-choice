"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useServices } from "../../../contexts/ServiceContext";
import { broadcastAuthStateChangeEvent } from "../../../utils/authEvents";

export default function CallbackPage() {
  const router = useRouter();
  const { authService } = useServices();

  useEffect(() => {
    async function run() {
      try {
        // 1. Extract tokens from URL hash
        const { access_token, refresh_token } = extractTokensFromUrl();
        if (access_token && refresh_token) {
          localStorage.setItem("session_token", access_token);
          localStorage.setItem("refresh_token", refresh_token);
        }

        // 2. Get user via authService
        const user = await authService.getUser();
        if (user) {
          broadcastAuthStateChangeEvent();
        }

        // 3. Redirect to home
        router.replace("/");
      } catch (err) {
        console.error(err);
        router.replace("/");
      }
    }

    run();
  }, [router, authService]);

  return <div>Signing you in…</div>;
}

// helper
function extractTokensFromUrl() {
  const hash = window.location.hash.substring(1);
  const params = new URLSearchParams(hash);
  return {
    access_token: params.get("access_token") ?? undefined,
    refresh_token: params.get("refresh_token") ?? undefined,
  };
}

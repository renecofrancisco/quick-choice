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
        const session = await authService.getSession();
        if (session?.user) {
          handleSession(session);
          return;
        }

        await new Promise((r) => setTimeout(r, 300));
        const retry = await authService.getSession();
        if (retry?.user) {
          handleSession(retry);
          return;
        }

        router.replace("/");
      } catch (err) {
        console.error(err);
        router.replace("/");
      }
    }

    function handleSession(session: any) {
      if (session?.access_token) {
        localStorage.setItem("session_token", session.access_token);
      }
      broadcastAuthStateChangeEvent();
      router.replace("/");
    }

    run();
  }, [router, authService]);

  return <div>Signing you in…</div>;
}

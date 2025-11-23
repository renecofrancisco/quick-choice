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
        await authService.restoreFromUrlTokens(window.location.hash);

        const user = await authService.getUser();
        if (user) broadcastAuthStateChangeEvent();

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

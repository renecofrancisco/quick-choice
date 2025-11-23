"use client";

import { useEffect, useState, ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useServices } from "../contexts/ServiceContext";
import LoginForm from "./LoginForm";
import Header from "./Header";
import Footer from "./Footer";
import { AUTH_STATE_CHANGED } from "../utils/authEvents";

interface Props {
  children: ReactNode;
}

export default function ProtectedLayout({ children }: Props) {
  const { authService } = useServices();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  const publicPaths = ["/auth/callback"];

  useEffect(() => {
    // Public pages skip auth check
    if (publicPaths.includes(pathname)) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      setLoading(true);
      try {
        const u = await authService.getUser();
        if (!u) {
          localStorage.removeItem("session_token");
          localStorage.removeItem("refresh_token");
        }
        setUser(u);
      } catch (err) {
        console.error(err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [authService, pathname]);

  // Listen for auth change events (login/logout through callback)
  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === AUTH_STATE_CHANGED) {
        window.location.reload();
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  if (loading) return <p>Loading...</p>;

  // Render public routes normally
  if (publicPaths.includes(pathname)) return <>{children}</>;

  // Not logged in → show LoginForm
  if (!user) return <LoginForm />;

  // Logged in → render app
  return (
    <>
      <Header />
      <main className="flex-1 overflow-y-auto">{children}</main>
      <Footer />
    </>
  );
}

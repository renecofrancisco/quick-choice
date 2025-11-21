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
    if (publicPaths.includes(pathname)) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      setLoading(true);
      try {
        const session = await authService.getSession();
        setUser(session?.user ?? null);
      } catch (err) {
        console.error(err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [authService, pathname]);

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
  if (publicPaths.includes(pathname)) return <>{children}</>;
  if (!user) return <LoginForm />;

  return (
    <>
      <Header />
      <main className="flex-1 overflow-y-auto">{children}</main>
      <Footer />
    </>
  );
}

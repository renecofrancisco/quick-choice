"use client";

import { useEffect, useState, ReactNode } from "react";
import { useServices } from "@/shared-backend/contexts/ServiceContext";
import LoginForm from "./LoginForm";
import Header from "./Header";
import Footer from "./Footer";

interface Props {
  children: ReactNode;
}

export default function ProtectedLayout({ children }: Props) {
  const { authService } = useServices();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { user } = await authService.getUser();
        setUser(user);
      } catch (err) {
        console.error(err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    const unsubscribe = authService.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => unsubscribe?.unsubscribe?.();
  }, [authService]);

  if (loading) return <p>Loading...</p>;

  if (!user) return <LoginForm />;

  return (
    <>
      <Header />
      <main className="flex-1 flex flex-col justify-center items-center">{children}</main>
      <Footer />
    </>
  );
}

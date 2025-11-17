"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";

export default function Header() {
  const [credits, setCredits] = useState<number | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch credits
  useEffect(() => {
    const fetchCredits = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("credits")
          .eq("user_id", user.id)
          .single();
        setCredits(profile?.credits ?? 0);
      }
    };
    fetchCredits();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setCredits(null);
      if (session?.user) fetchCredits();
    });

    return () => listener?.subscription.unsubscribe();
  }, []);

  // Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex justify-between items-center p-4 bg-white shadow-md fixed top-0 left-0 w-full z-10">
      {/* App name/logo */}
      <h1 className="text-xl font-bold">Quick Choice</h1>

      {/* Credits + Profile Icon container */}
      <div className="relative flex items-center space-x-4" ref={containerRef}>
        {/* Credits */}
        <span className="font-semibold">{credits ?? 0} 💎</span>

        {/* Profile Icon */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu((prev) => !prev)}
            className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
          >
            <span className="text-gray-700 font-bold">👤</span>
          </button>

          {/* Dropdown menu */}
          {showProfileMenu && (
            <div className="absolute right-0 top-full mt-2 w-32 bg-white border shadow-md rounded z-20">
              <button
                onClick={handleLogout}
                className="w-full text-left p-2 hover:bg-gray-100 rounded"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

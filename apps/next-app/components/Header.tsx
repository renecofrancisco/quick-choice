"use client";

import { useEffect, useState, useRef } from "react";
import { useServices } from "../contexts/ServiceContext";
import { broadcastAuthStateChangeEvent } from "../utils/authEvents";

export default function Header() {
  const { authService, profileService } = useServices();

  const [credits, setCredits] = useState<number | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchCredits = async () => {
    const { user } = await authService.getUser();
    if (!user) return;

    try {
      const profile = await profileService.getUserProfile(user.id);
      setCredits(profile?.credits ?? 0);
    } catch (err) {
      console.error("Error fetching credits:", err);
      setCredits(0);
    }
  };

  // Fetch credits
  useEffect(() => {
    fetchCredits();
  }, []);

  const handleLogout = async () => {
    await authService.signOut();
    broadcastAuthStateChangeEvent();
    window.location.href = "/";
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
    <header className="flex justify-between items-center p-4 bg-white shadow-md sticky top-0 left-0 w-full z-10">
      <h1 className="text-xl font-bold">Quick Choice</h1>

      <div className="relative flex items-center space-x-4" ref={containerRef}>
        <span className="font-semibold">{credits ?? 0} 💎</span>

        <div className="relative">
          <button
            onClick={() => setShowProfileMenu((prev) => !prev)}
            className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
          >
            <span className="text-gray-700 font-bold">👤</span>
          </button>

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

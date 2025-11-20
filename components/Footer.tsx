"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  const tabs = [
    { href: "/vote", label: "Vote" },
    { href: "/polls", label: "Polls" },
  ];

  return (
    <footer className="fixed bottom-0 left-0 w-full flex border-t shadow-md">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href || 
          (tab.href === "/vote" && pathname === "/");

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`
              flex-1 text-center py-3 font-semibold transition
              ${isActive ? "bg-blue-600 text-white" : "bg-white text-gray-500 hover:bg-gray-100"}
            `}
          >
            {tab.label}
          </Link>
        );
      })}
    </footer>
  );
}

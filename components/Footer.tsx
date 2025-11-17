"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 w-full flex justify-around bg-white p-2 border-t shadow-md">
      <Link href="/vote" className="text-blue-600 font-semibold hover:text-blue-800">
        Vote
      </Link>
      <Link href="/polls" className="text-blue-600 font-semibold hover:text-blue-800">
        Polls
      </Link>
    </footer>
  );
}

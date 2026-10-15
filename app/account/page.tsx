"use client";

import Link from "next/link";
import { useProfile } from "@/lib/profile";

export default function Page() {
  const { ready, complete } = useProfile();
  return (
    <div className="max-w-xl">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Account</h1>
      <Link
        href="/account/profile"
        className="mt-8 flex items-start justify-between gap-4 rounded-xl border border-bar p-5 hover:bg-bar"
      >
        <span>
          <span className="block text-lg font-semibold">Profile</span>
          <span className="block text-muted">Details needed to file your VAT return</span>
        </span>
        {ready && (
          <span
            className={`shrink-0 rounded-full px-3 py-1 text-sm font-semibold ${
              complete ? "bg-lime-soft text-forest" : "bg-amber-100 text-amber-900"
            }`}
          >
            {complete ? "Complete" : "Missing details"}
          </span>
        )}
      </Link>
    </div>
  );
}

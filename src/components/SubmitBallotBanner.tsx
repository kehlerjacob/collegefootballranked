"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function SubmitBallotBanner() {
  const pathname = usePathname();

  // Hide banner if user is already on the ballot builder page
  if (pathname === "/ballot") return null;

  return (
    <div className="w-full bg-gradient-to-r from-[#1c180e] via-[#241d0e] to-[#1c180e] border-b border-accent/35 shadow-xs relative z-10 overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute inset-0 bg-radial-gradient pointer-events-none opacity-20" />

      <div className="max-w-4xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="flex h-2.5 w-2.5 relative shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <div className="text-xs text-foreground/90 font-medium whitespace-nowrap">
            <span className="font-bold text-accent">Polling is Live</span>
            <span className="hidden sm:inline">: Submit your Top 25 ballot before the weekly deadline.</span>
          </div>
        </div>

        <Link
          href="/ballot"
          className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-accent text-background hover:bg-accent-glow transition-all duration-200 shadow-md active:scale-95 whitespace-nowrap shrink-0 flex items-center gap-1.5"
        >
          <span>Submit Ballot</span>
          <span className="text-sm leading-none">→</span>
        </Link>
      </div>
    </div>
  );
}

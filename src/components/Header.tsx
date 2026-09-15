"use client";

import Link from "next/link";
import { useAuth } from "./AuthProvider";
import { CFRLogo } from "./CFRLogo";
import { UserAccountMenu } from "./UserAccountMenu";

export function Header() {
  const { user, isLoading } = useAuth();

  return (
    <header className="sticky top-0 z-50 glass-card border-b border-border">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo / brand */}
        <Link href="/" className="flex items-center gap-2.5 group py-1">
          <div className="flex items-center gap-2.5">
            <CFRLogo height={28} className="group-hover:scale-105 transition-transform duration-200" />
            <span className="hidden sm:inline-block text-[9.5px] font-bold uppercase tracking-[0.16em] text-muted group-hover:text-accent/90 transition-colors duration-200 border-l border-border/80 pl-2.5 py-0.5 leading-tight">
              College Football Ranked
            </span>
          </div>
        </Link>

        {/* Nav actions */}
        <nav className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/ballot"
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-accent text-background hover:bg-accent-glow transition-all duration-200 animate-pulse-glow whitespace-nowrap"
          >
            Submit Ballot
          </Link>

          {!isLoading && user ? (
            <UserAccountMenu />
          ) : !isLoading ? (
            <Link
              href="/login"
              className="px-3.5 py-1.5 text-xs font-medium rounded-lg border border-border text-muted hover:text-foreground hover:border-border-light transition-all duration-200 whitespace-nowrap shrink-0"
            >
              Log in
            </Link>
          ) : null}
        </nav>
      </div>
    </header>
  );
}

"use client";

import Link from "next/link";
import { useAuth } from "./AuthProvider";

export function Header() {
  const { user, logout, isLoading } = useAuth();

  return (
    <header className="sticky top-0 z-50 glass-card border-b border-border">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo / brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex flex-col items-start leading-none">
            <span
              className="text-xl font-black tracking-[0.08em] uppercase text-foreground group-hover:text-accent transition-colors duration-200"
              style={{
                fontFamily: "var(--font-geist-sans), 'Impact', 'Arial Black', sans-serif",
                letterSpacing: "0.12em",
              }}
            >
              CFR
            </span>
            <span className="text-[8px] font-semibold uppercase tracking-[0.18em] text-muted group-hover:text-accent/70 transition-colors duration-200 mt-[-1px]">
              College Football Ranked
            </span>
          </div>
        </Link>

        {/* Nav actions */}
        <nav className="flex items-center gap-2">
          {!isLoading && user ? (
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-xs text-muted">
                Signed in as <strong className="text-foreground">{user.username}</strong>
              </span>
              <button
                onClick={logout}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-border text-muted hover:text-foreground hover:border-border-light transition-all duration-200"
              >
                Log out
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-border text-muted hover:text-foreground hover:border-border-light transition-all duration-200"
            >
              Log in
            </Link>
          )}

          <Link
            href="/ballot"
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-accent text-background hover:bg-accent-glow transition-all duration-200 animate-pulse-glow"
          >
            Submit Ballot
          </Link>
        </nav>
      </div>
    </header>
  );
}

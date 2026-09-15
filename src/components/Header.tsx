"use client";

import Link from "next/link";
import { useAuth } from "./AuthProvider";
import { CFRLogo } from "./CFRLogo";

export function Header() {
  const { user, logout, isLoading } = useAuth();

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
        <nav className="flex items-center gap-2">
          {!isLoading && user ? (
            <div className="flex items-center gap-2 sm:gap-3">
              {(user.role === "ADMIN" || user.email?.toLowerCase() === "kehlerjacob@gmail.com") && (
                <Link
                  href="/admin"
                  className="px-2.5 py-1 text-xs font-bold rounded-lg bg-amber-500/15 border border-amber-500/40 text-amber-400 hover:bg-amber-500/25 transition-all duration-200 flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>Admin</span>
                </Link>
              )}
              <span className="hidden sm:inline text-xs text-muted">
                Signed in as <strong className="text-foreground">{user.username}</strong>
              </span>
              <button
                onClick={logout}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-border text-muted hover:text-foreground hover:border-border-light transition-all duration-200 whitespace-nowrap shrink-0"
              >
                Log out
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-3.5 py-1.5 text-xs font-medium rounded-lg border border-border text-muted hover:text-foreground hover:border-border-light transition-all duration-200 whitespace-nowrap shrink-0"
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

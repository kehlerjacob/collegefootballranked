"use client";

import Link from "next/link";
import { useAuth } from "./AuthProvider";
import { CFRLogo } from "./CFRLogo";
import { UserAccountMenu } from "./UserAccountMenu";
import { NavigationMenu } from "./NavigationMenu";
import { SubmitBallotBanner } from "./SubmitBallotBanner";

interface HeaderProps {
  hideBanner?: boolean;
}

export function Header({ hideBanner = false }: HeaderProps) {
  const { user, isLoading } = useAuth();

  return (
    <div className="sticky top-0 z-50">
      <header className="glass-card border-b border-border bg-[#0e121a]/95 backdrop-blur-md relative z-20">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Logo / brand */}
          <Link href="/" className="flex items-center group py-1">
            <div className="flex items-center gap-2 sm:gap-2.5">
              <CFRLogo height={28} className="group-hover:scale-105 transition-transform duration-200 shrink-0" />
              <span className="flex flex-col text-[7.5px] sm:text-[8.5px] font-black uppercase tracking-[0.16em] sm:tracking-[0.18em] text-muted group-hover:text-accent/90 transition-colors duration-200 border-l border-border/80 pl-2 sm:pl-2.5 py-0.5 leading-[1.1] select-none">
                <span>College</span>
                <span>Football</span>
                <span>Ranked</span>
              </span>
            </div>
          </Link>

          {/* Nav actions */}
          <nav className="flex items-center gap-2 sm:gap-3">
            {/* Navigation Menu Button (Rankings, Ballot Builder, Admin, etc.) */}
            <NavigationMenu />

            {!isLoading && user ? (
              <UserAccountMenu />
            ) : !isLoading ? (
              <Link
                href="/login"
                className="px-3.5 py-1.5 text-xs font-medium rounded-xl border border-border text-muted hover:text-foreground hover:border-accent/40 transition-all duration-200 whitespace-nowrap shrink-0 bg-surface"
              >
                Log in
              </Link>
            ) : null}
          </nav>
        </div>
      </header>

      {/* Full-width banner below the header */}
      {!hideBanner && <SubmitBallotBanner />}
    </div>
  );
}

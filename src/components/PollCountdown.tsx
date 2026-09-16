"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface PollCountdownProps {
  weekTitle: string;
  totalBallots?: number;
  votingDeadline?: string | null;
}

function getTargetTime(votingDeadline?: string | null): number {
  const now = new Date();

  // If votingDeadline is provided and is in the future, use it
  if (votingDeadline) {
    const d = new Date(votingDeadline).getTime();
    if (!isNaN(d) && d > now.getTime()) {
      return d;
    }
  }

  // Otherwise calculate upcoming Wednesday at 12:00 PM (Noon)
  const target = new Date(now);
  const currentDay = now.getDay(); // 0: Sun, 1: Mon, 2: Tue, 3: Wed, 4: Thu, 5: Fri, 6: Sat
  let daysUntilWednesday = (3 - currentDay + 7) % 7;

  target.setDate(now.getDate() + daysUntilWednesday);
  target.setHours(12, 0, 0, 0);

  // If today is Wednesday and already at or past noon, target next Wednesday noon
  if (daysUntilWednesday === 0 && now.getTime() >= target.getTime()) {
    target.setDate(target.getDate() + 7);
    target.setHours(12, 0, 0, 0);
  }

  return target.getTime();
}

function calculateTimeLeft(votingDeadline?: string | null) {
  const targetTime = getTargetTime(votingDeadline);
  const now = Date.now();
  const diff = targetTime - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds, isPast: false };
}

export function PollCountdown({
  weekTitle,
  totalBallots = 0,
  votingDeadline,
}: PollCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPast: boolean;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false,
  });

  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);

    function tick() {
      setTimeLeft(calculateTimeLeft(votingDeadline));
    }

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [votingDeadline]);

  // If before mount, compute initial value so there is no delay
  const displayTime = hasMounted ? timeLeft : calculateTimeLeft(votingDeadline);

  return (
    <div className="glass-card rounded-2xl p-6 sm:p-8 text-center relative overflow-hidden border border-accent/40 shadow-[0_0_30px_rgba(201,168,76,0.12)]">
      {/* Background glow accent */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header status badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 border border-accent/30 text-accent text-xs font-bold mb-4">
        <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
        <span>{weekTitle} · Polling Currently Live</span>
      </div>

      <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
        Official Poll Drops Wednesday at 12:00 PM
      </h2>

      <p className="text-xs sm:text-sm text-muted max-w-md mx-auto mt-2 leading-relaxed">
        Ballots are actively being collected from fans nationwide. Submit your Top 25 before the voting window closes!
      </p>

      {/* Countdown Digits */}
      <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-sm sm:max-w-md mx-auto my-6">
        <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-surface-elevated border border-border">
          <span className="text-2xl sm:text-3xl font-black text-accent tabular-nums">
            {String(displayTime.days).padStart(2, "0")}
          </span>
          <span className="text-[10px] sm:text-xs font-semibold uppercase text-muted tracking-wider mt-1">
            Days
          </span>
        </div>

        <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-surface-elevated border border-border">
          <span className="text-2xl sm:text-3xl font-black text-accent tabular-nums">
            {String(displayTime.hours).padStart(2, "0")}
          </span>
          <span className="text-[10px] sm:text-xs font-semibold uppercase text-muted tracking-wider mt-1">
            Hours
          </span>
        </div>

        <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-surface-elevated border border-border">
          <span className="text-2xl sm:text-3xl font-black text-accent tabular-nums">
            {String(displayTime.minutes).padStart(2, "0")}
          </span>
          <span className="text-[10px] sm:text-xs font-semibold uppercase text-muted tracking-wider mt-1">
            Mins
          </span>
        </div>

        <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-surface-elevated border border-border">
          <span className="text-2xl sm:text-3xl font-black text-accent tabular-nums">
            {String(displayTime.seconds).padStart(2, "0")}
          </span>
          <span className="text-[10px] sm:text-xs font-semibold uppercase text-muted tracking-wider mt-1">
            Secs
          </span>
        </div>
      </div>

      {/* CTA button */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2">
        <Link
          href="/ballot"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-accent text-background font-bold text-sm hover:bg-accent-glow transition-all duration-200 shadow-[0_0_20px_rgba(201,168,76,0.3)] active:scale-95"
        >
          <span>Submit Official Ballot</span>
          <span>→</span>
        </Link>
      </div>

      {totalBallots > 0 && (
        <p className="text-[11px] text-muted mt-4 font-medium flex items-center justify-center gap-1.5">
          <svg className="w-3.5 h-3.5 text-accent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          <span><strong>{totalBallots}</strong> community ballots submitted so far for {weekTitle}</span>
        </p>
      )}
    </div>
  );
}

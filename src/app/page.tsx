"use client";

import { useState, useEffect } from "react";
import { RankingsTable, TeamData } from "@/components/RankingsTable";
import { Header } from "@/components/Header";
import { WeekSelector, WeekItem } from "@/components/WeekSelector";
import { StatsBar } from "@/components/StatsBar";
import { PollCountdown } from "@/components/PollCountdown";
import Link from "next/link";

export default function Home() {
  const [weeks, setWeeks] = useState<WeekItem[]>([]);
  const [selectedWeekNumber, setSelectedWeekNumber] = useState<number>(1);
  const [rankings, setRankings] = useState<TeamData[]>([]);
  const [stats, setStats] = useState({
    totalPointsAwarded: 0,
    totalBallots: 0,
    status: "PUBLISHED",
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load weeks list & default to latest published consensus poll
  useEffect(() => {
    async function loadWeeks() {
      try {
        const res = await fetch("/api/weeks");
        if (res.ok) {
          const data = await res.json();
          const loadedWeeks: WeekItem[] = data.weeks || [];
          setWeeks(loadedWeeks);

          // Default to the most recent published consensus poll (highest weekNumber with PUBLISHED status)
          const publishedWeeks = loadedWeeks.filter(
            (w) => w.status === "PUBLISHED"
          );

          if (publishedWeeks.length > 0) {
            const latestPublished = publishedWeeks.reduce((prev, curr) =>
              curr.weekNumber > prev.weekNumber ? curr : prev
            );
            setSelectedWeekNumber(latestPublished.weekNumber);
          } else if (loadedWeeks.length > 0) {
            setSelectedWeekNumber(loadedWeeks[0].weekNumber);
          }
        }
      } catch (e) {
        console.error("Failed to load weeks:", e);
      }
    }
    loadWeeks();
  }, []);

  // Load rankings for selected week
  useEffect(() => {
    if (selectedWeekNumber === undefined || selectedWeekNumber === null) return;

    async function loadRankings() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/rankings/${selectedWeekNumber}`);
        if (res.ok) {
          const data = await res.json();
          setRankings(data.rankings || []);
          setStats({
            totalPointsAwarded: data.week?.totalPointsAwarded || 0,
            totalBallots: data.week?.totalBallots || 0,
            status: data.week?.status || "PUBLISHED",
          });
        } else {
          setRankings([]);
          setStats({
            totalPointsAwarded: 0,
            totalBallots: 0,
            status: "UPCOMING",
          });
        }
      } catch (e) {
        console.error("Failed to load rankings:", e);
      } finally {
        setIsLoading(false);
      }
    }

    loadRankings();
  }, [selectedWeekNumber]);

  const selectedWeek = weeks.find((w) => w.weekNumber === selectedWeekNumber);
  const isOpenVotingWeek =
    selectedWeek?.status === "OPEN" || stats.status === "OPEN";

  return (
    <>
      <Header />
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 pb-8">
        {/* Hero blurb */}
        <section className="pt-6 pb-4 animate-fade-in-up">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Power Rankings
              </h1>
              <p className="mt-1 text-sm text-muted">
                Community-voted Top 25 · Updated weekly
              </p>
            </div>

            <Link
              href="/ballot"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-accent/15 border border-accent/40 text-accent hover:bg-accent hover:text-background text-xs font-bold transition-all duration-200"
            >
              <span>Vote This Week →</span>
            </Link>
          </div>
        </section>

        {/* Week selector + stats */}
        <div
          className="flex flex-col gap-3 mb-4 animate-fade-in-up"
          style={{ animationDelay: "0.1s" }}
        >
          <WeekSelector
            weeks={weeks}
            selectedWeekNumber={selectedWeekNumber}
            onSelectWeek={(num) => setSelectedWeekNumber(num)}
          />
          <StatsBar
            totalVotes={stats.totalPointsAwarded}
            totalBallots={stats.totalBallots}
            status={stats.status}
          />
        </div>

        {/* Main Content Area: Poll Countdown when voting is OPEN, or Rankings Table when published */}
        <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          {isOpenVotingWeek ? (
            <PollCountdown
              weekTitle={selectedWeek?.title || `Week ${selectedWeekNumber}`}
              totalBallots={stats.totalBallots}
              votingDeadline={selectedWeek?.votingDeadline}
            />
          ) : (
            <RankingsTable rankings={rankings} isLoading={isLoading} />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center text-xs text-muted">
        <p>
          © {new Date().getFullYear()} College Football Ranked. Powered by the community.
        </p>
      </footer>
    </>
  );
}

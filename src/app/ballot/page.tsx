"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { Header } from "@/components/Header";
import { TeamLogo } from "@/components/TeamLogo";
import Link from "next/link";

interface Team {
  id: string;
  name: string;
  shortName: string;
  mascot: string | null;
  conference: string;
  record: string;
  primaryColor: string | null;
  logoUrl?: string | null;
}

interface WeekInfo {
  id: string;
  weekNumber: number;
  title: string;
  status: string;
  votingDeadline: string | null;
}

export default function BallotPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  const [weeks, setWeeks] = useState<WeekInfo[]>([]);
  const [selectedWeek, setSelectedWeek] = useState<WeekInfo | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedConference, setSelectedConference] = useState("ALL");
  
  // Array of 25 team IDs (or null if empty)
  const [ballotRanks, setBallotRanks] = useState<(string | null)[]>(
    Array(25).fill(null)
  );

  const [existingBallotId, setExistingBallotId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Load weeks and teams
  useEffect(() => {
    async function loadInitialData() {
      try {
        const [weeksRes, teamsRes] = await Promise.all([
          fetch("/api/weeks"),
          fetch("/api/teams"),
        ]);

        const weeksData = await weeksRes.json();
        const teamsData = await teamsRes.json();

        setWeeks(weeksData.weeks || []);
        setTeams(teamsData.teams || []);

        // Pick the first OPEN week or upcoming week
        const openWeek =
          weeksData.weeks?.find((w: WeekInfo) => w.status === "OPEN") ||
          weeksData.weeks?.[0] ||
          null;

        setSelectedWeek(openWeek);
      } catch (err) {
        console.error(err);
        setErrorMsg("Failed to load ballot data");
      } finally {
        setIsLoading(false);
      }
    }
    loadInitialData();
  }, []);

  // Fetch user's existing ballot when selected week or user changes
  useEffect(() => {
    if (!selectedWeek || !user) return;

    async function loadUserBallot() {
      try {
        const res = await fetch(`/api/ballots?weekId=${selectedWeek?.id}`);
        if (res.ok) {
          const data = await res.json();
          if (data.ballot && data.ballot.items?.length > 0) {
            setExistingBallotId(data.ballot.id);
            const newRanks: (string | null)[] = Array(25).fill(null);
            data.ballot.items.forEach((item: { rank: number; teamId: string }) => {
              if (item.rank >= 1 && item.rank <= 25) {
                newRanks[item.rank - 1] = item.teamId;
              }
            });
            setBallotRanks(newRanks);
          } else {
            setExistingBallotId(null);
          }
        }
      } catch (e) {
        console.error("Could not load user ballot", e);
      }
    }

    loadUserBallot();
  }, [selectedWeek, user]);

  const teamById = (id: string | null) => {
    if (!id) return null;
    return teams.find((t) => t.id === id) || null;
  };

  const isTeamSelected = (teamId: string) => {
    return ballotRanks.includes(teamId);
  };

  // Add team to next available slot
  const handleSelectTeam = (teamId: string) => {
    if (isTeamSelected(teamId)) {
      // Remove from ballot
      setBallotRanks((prev) =>
        prev.map((id) => (id === teamId ? null : id))
      );
      return;
    }

    // Find first empty rank slot
    const emptyIndex = ballotRanks.findIndex((r) => r === null);
    if (emptyIndex === -1) {
      setErrorMsg("Your ballot already has 25 teams. Remove one before adding another.");
      return;
    }

    setErrorMsg("");
    setBallotRanks((prev) => {
      const next = [...prev];
      next[emptyIndex] = teamId;
      return next;
    });
  };

  const handleRemoveRank = (index: number) => {
    setBallotRanks((prev) => {
      const next = [...prev];
      next[index] = null;
      return next;
    });
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    setBallotRanks((prev) => {
      const next = [...prev];
      const temp = next[index];
      next[index] = next[index - 1];
      next[index - 1] = temp;
      return next;
    });
  };

  const handleMoveDown = (index: number) => {
    if (index === 24) return;
    setBallotRanks((prev) => {
      const next = [...prev];
      const temp = next[index];
      next[index] = next[index + 1];
      next[index + 1] = temp;
      return next;
    });
  };

  const handleFillTop25Defaults = async () => {
    try {
      const res = await fetch(`/api/rankings/2`); // Load Week 2 consensus as template
      if (res.ok) {
        const data = await res.json();
        if (data.rankings) {
          const filled = data.rankings.map((r: { name: string }) => {
            const match = teams.find((t) => t.name === r.name);
            return match ? match.id : null;
          });
          while (filled.length < 25) filled.push(null);
          setBallotRanks(filled.slice(0, 25));
          setErrorMsg("");
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmitBallot = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    setErrorMsg("");
    setSuccessMsg("");

    // Validate 25 teams
    const missingIndex = ballotRanks.findIndex((r) => r === null);
    if (missingIndex !== -1) {
      setErrorMsg(`Please fill all 25 ranks (missing rank #${missingIndex + 1})`);
      return;
    }

    if (!selectedWeek) {
      setErrorMsg("No week selected");
      return;
    }

    setIsSubmitting(true);

    try {
      const ranksPayload = ballotRanks.map((teamId, index) => ({
        rank: index + 1,
        teamId: teamId!,
      }));

      const res = await fetch("/api/ballots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weekId: selectedWeek.id,
          ranks: ranksPayload,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Failed to submit ballot");
        return;
      }

      setSuccessMsg(data.message || "Ballot submitted successfully!");
      setExistingBallotId(data.ballotId);

      // Redirect back to home after 1.5 seconds to see updated consensus
      setTimeout(() => {
        router.push(`/?week=${selectedWeek.weekNumber}`);
      }, 1500);
    } catch {
      setErrorMsg("An unexpected network error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtered teams list
  const filteredTeams = teams.filter((team) => {
    const matchesSearch =
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.shortName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (team.mascot && team.mascot.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesConf =
      selectedConference === "ALL" || team.conference === selectedConference;
    return matchesSearch && matchesConf;
  });

  const filledCount = ballotRanks.filter(Boolean).length;
  const conferences = ["ALL", "SEC", "Big Ten", "ACC", "Big 12", "Ind.", "Mountain West", "AAC", "Sun Belt", "C-USA"];

  if (authLoading || isLoading) {
    return (
      <>
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-12 text-center text-muted">
          Loading ballot system...
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border animate-fade-in-up">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Official Ballot Builder
            </h1>
            <p className="text-sm text-muted mt-0.5">
              Rank your Top 25 teams. Each member gets exactly 1 ballot per week.
            </p>
          </div>

          {/* Week Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted uppercase">Week:</span>
            <select
              value={selectedWeek?.id || ""}
              onChange={(e) => {
                const w = weeks.find((item) => item.id === e.target.value);
                if (w) setSelectedWeek(w);
              }}
              className="px-3 py-1.5 rounded-lg bg-surface border border-border text-foreground text-xs font-semibold focus:outline-none focus:border-accent"
            >
              {weeks.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.title} ({w.status})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Auth Notice if not logged in */}
        {!user && (
          <div className="mt-4 p-4 rounded-xl bg-accent-dim border border-accent/30 text-xs text-foreground flex items-center justify-between">
            <div>
              <span className="font-bold text-accent">Sign in required:</span> You must be logged in to submit your official ballot.
            </div>
            <Link
              href="/login"
              className="px-3 py-1.5 rounded-lg bg-accent text-background font-bold hover:bg-accent-glow transition-all"
            >
              Log In
            </Link>
          </div>
        )}

        {/* Existing Ballot Banner */}
        {user && existingBallotId && (
          <div className="mt-4 p-3.5 rounded-xl bg-surface border border-accent/40 flex items-center justify-between text-xs text-foreground">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-success"></span>
              <span>
                You have an active ballot for <strong>{selectedWeek?.title}</strong>. Changes will update your existing ballot.
              </span>
            </div>
            <span className="text-accent font-semibold">1 Ballot / Week Enforced</span>
          </div>
        )}

        {/* Status Alerts */}
        {errorMsg && (
          <div className="mt-4 p-3 rounded-lg bg-danger/10 border border-danger/30 text-danger text-xs font-medium">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mt-4 p-3 rounded-lg bg-success/10 border border-success/30 text-success text-xs font-medium">
            {successMsg}
          </div>
        )}

        {/* Two-Column Ballot Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          {/* Left Column: Current Top 25 Ballot (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-foreground">Your Top 25</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-surface border border-border text-accent">
                  {filledCount} / 25 Selected
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleFillTop25Defaults}
                  className="text-[11px] font-medium text-muted hover:text-accent transition-colors"
                >
                  ⚡ Auto-fill Consensus
                </button>
                <button
                  type="button"
                  onClick={() => setBallotRanks(Array(25).fill(null))}
                  className="text-[11px] font-medium text-muted hover:text-danger transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>

            {/* Ballot List */}
            <div className="glass-card rounded-2xl overflow-hidden divide-y divide-border/40">
              {ballotRanks.map((teamId, index) => {
                const team = teamById(teamId);
                const rankNum = index + 1;

                return (
                  <div
                    key={index}
                    className={`flex items-center justify-between px-3 py-2 text-xs transition-colors ${
                      team ? "hover:bg-surface-hover" : "bg-background/40"
                    }`}
                  >
                    {/* Rank Number */}
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-[11px] tabular-nums shrink-0 ${
                          rankNum === 1
                            ? "bg-rank-gold/20 text-rank-gold border border-rank-gold/40"
                            : rankNum === 2
                            ? "bg-rank-silver/20 text-rank-silver border border-rank-silver/40"
                            : rankNum === 3
                            ? "bg-rank-bronze/20 text-rank-bronze border border-rank-bronze/40"
                            : "bg-surface text-muted border border-border"
                        }`}
                      >
                        {rankNum}
                      </span>

                      {/* Team Name / Empty Slot */}
                      {team ? (
                        <div className="flex items-center gap-2.5 min-w-0">
                          <TeamLogo
                            logoUrl={team.logoUrl}
                            name={team.name}
                            shortName={team.shortName}
                            primaryColor={team.primaryColor}
                            size={28}
                          />
                          <span className="font-semibold text-foreground truncate">
                            {team.name}
                          </span>
                          <span className="text-[10px] text-muted shrink-0">
                            ({team.conference})
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted/50 italic text-[11px]">
                          Select team from right panel...
                        </span>
                      )}
                    </div>

                    {/* Action buttons */}
                    {team && (
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleMoveUp(index)}
                          disabled={index === 0}
                          className="p-1 text-muted hover:text-foreground disabled:opacity-20"
                          title="Move Up"
                        >
                          ▲
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveDown(index)}
                          disabled={index === 24}
                          className="p-1 text-muted hover:text-foreground disabled:opacity-20"
                          title="Move Down"
                        >
                          ▼
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveRank(index)}
                          className="p-1 text-muted hover:text-danger ml-1"
                          title="Remove Team"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Submit Action Bar */}
            <div className="mt-2 flex items-center justify-between p-4 glass-card rounded-xl">
              <div className="text-xs text-muted">
                {filledCount === 25 ? (
                  <span className="text-success font-semibold">✓ Ballot complete and ready</span>
                ) : (
                  <span>{25 - filledCount} slots remaining to rank</span>
                )}
              </div>

              <button
                type="button"
                disabled={filledCount !== 25 || isSubmitting || selectedWeek?.status !== "OPEN"}
                onClick={handleSubmitBallot}
                className="px-6 py-2.5 rounded-xl bg-accent text-background font-bold text-xs hover:bg-accent-glow transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(201,168,76,0.3)]"
              >
                {isSubmitting
                  ? "Submitting..."
                  : existingBallotId
                  ? "Update My Ballot"
                  : "Submit Official Ballot"}
              </button>
            </div>
          </div>

          {/* Right Column: Team Selector & Search (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            <h2 className="text-base font-bold text-foreground">Select Teams</h2>

            {/* Search Input */}
            <div className="flex flex-col gap-2">
              <input
                type="text"
                placeholder="Search team or mascot..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-foreground text-xs placeholder:text-muted/60 focus:outline-none focus:border-accent"
              />

              {/* Conference Pills Filter */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {conferences.map((conf) => (
                  <button
                    key={conf}
                    type="button"
                    onClick={() => setSelectedConference(conf)}
                    className={`shrink-0 px-2.5 py-1 rounded-lg text-[10px] font-semibold border transition-all ${
                      selectedConference === conf
                        ? "bg-accent/20 border-accent text-accent"
                        : "border-border text-muted hover:text-foreground"
                    }`}
                  >
                    {conf}
                  </button>
                ))}
              </div>
            </div>

            {/* Available Teams Grid / List */}
            <div className="glass-card rounded-2xl p-2 max-h-[620px] overflow-y-auto space-y-1">
              {filteredTeams.map((team) => {
                const selected = isTeamSelected(team.id);
                const rankIndex = ballotRanks.findIndex((id) => id === team.id);

                return (
                  <button
                    key={team.id}
                    type="button"
                    onClick={() => handleSelectTeam(team.id)}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all ${
                      selected
                        ? "bg-accent/15 border border-accent/40"
                        : "hover:bg-surface-hover border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <TeamLogo
                        logoUrl={team.logoUrl}
                        name={team.name}
                        shortName={team.shortName}
                        primaryColor={team.primaryColor}
                        size={32}
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-foreground truncate">
                          {team.name}
                        </p>
                        <p className="text-[10px] text-muted">
                          {team.conference} · {team.record}
                        </p>
                      </div>
                    </div>

                    {selected ? (
                      <span className="px-2 py-0.5 rounded-md bg-accent text-background font-bold text-[10px]">
                        #{rankIndex + 1}
                      </span>
                    ) : (
                      <span className="text-xs text-muted hover:text-accent font-bold px-2 py-0.5">
                        + Add
                      </span>
                    )}
                  </button>
                );
              })}

              {filteredTeams.length === 0 && (
                <div className="p-6 text-center text-xs text-muted">
                  No teams found matching &ldquo;{searchTerm}&rdquo;
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

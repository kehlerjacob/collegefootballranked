"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { Header } from "@/components/Header";
import { TeamLogo } from "@/components/TeamLogo";
import { BallotShareModal, RankedTeamInfo } from "@/components/BallotShareModal";
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
  secondaryLogoUrl?: string | null;
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
  const [apRanks, setApRanks] = useState<Map<string, number>>(new Map());
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedConference, setSelectedConference] = useState("ALL");

  // Inline slot typing & dropdown state
  const [editingSlotIndex, setEditingSlotIndex] = useState<number | null>(null);
  const [slotSearchQuery, setSlotSearchQuery] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Array of 25 team IDs (or null if empty)
  const [ballotRanks, setBallotRanks] = useState<(string | null)[]>(
    Array(25).fill(null)
  );

  // Quick fill dropdown & loading state
  const [isQuickFillOpen, setIsQuickFillOpen] = useState(false);
  const [quickFillLoading, setQuickFillLoading] = useState<string | null>(null);
  const quickFillRef = useRef<HTMLDivElement | null>(null);

  // Reorder swap animation state
  const [swappingState, setSwappingState] = useState<{
    activeIndex: number;
    targetIndex: number;
    direction: "up" | "down";
  } | null>(null);
  const [justSwapped, setJustSwapped] = useState<number[]>([]);

  const [existingBallotId, setExistingBallotId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Close quick fill on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        quickFillRef.current &&
        !quickFillRef.current.contains(event.target as Node)
      ) {
        setIsQuickFillOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Load weeks, teams, and most recent AP poll
  useEffect(() => {
    async function loadInitialData() {
      try {
        const [weeksRes, teamsRes, apRes] = await Promise.all([
          fetch("/api/weeks"),
          fetch("/api/teams"),
          fetch("/api/ap-poll").catch(() => null),
        ]);

        const weeksData = await weeksRes.json();
        const teamsData = await teamsRes.json();
        const loadedTeams: Team[] = teamsData.teams || [];

        setWeeks(weeksData.weeks || []);
        setTeams(loadedTeams);

        if (apRes && apRes.ok) {
          try {
            const apData = await apRes.json();
            if (apData?.ranks && Array.isArray(apData.ranks)) {
              const newApMap = new Map<string, number>();
              apData.ranks.forEach((r: { rank?: number; teamId?: string | null; teamName?: string; name?: string; shortName?: string }) => {
                let id = r.teamId;
                if (!id) {
                  const qName = (r.teamName || r.name || "").toLowerCase().trim();
                  const qShort = (r.shortName || "").toLowerCase().trim();
                  const found = loadedTeams.find(
                    (t) =>
                      t.name.toLowerCase().trim() === qName ||
                      t.shortName.toLowerCase().trim() === qShort ||
                      (qName === "miami" && t.name.includes("Miami"))
                  );
                  if (found) id = found.id;
                }
                if (id && typeof r.rank === "number") {
                  newApMap.set(id, r.rank);
                }
              });
              setApRanks(newApMap);
            }
          } catch (e) {
            console.error("Could not parse AP poll data:", e);
          }
        }

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

  // Fetch user's existing ballot when selected week changes
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
            data.ballot.items.forEach(
              (item: { rank: number; teamId: string }) => {
                if (item.rank >= 1 && item.rank <= 25) {
                  newRanks[item.rank - 1] = item.teamId;
                }
              }
            );
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

  // Focus input when a slot enters editing mode
  useEffect(() => {
    if (editingSlotIndex !== null && inputRefs.current[editingSlotIndex]) {
      inputRefs.current[editingSlotIndex]?.focus();
    }
  }, [editingSlotIndex]);

  const teamById = (id: string | null) => {
    if (!id) return null;
    return teams.find((t) => t.id === id) || null;
  };

  const isTeamSelected = (teamId: string) => {
    return ballotRanks.includes(teamId);
  };

  // Assign team to a specific rank slot (from inline search or panel)
  const handleAssignTeamToSlot = (slotIndex: number, teamId: string) => {
    setErrorMsg("");
    setBallotRanks((prev) => {
      const next = [...prev];
      // If team already ranked elsewhere, swap or clear old position
      const oldIndex = next.findIndex((id) => id === teamId);
      if (oldIndex !== -1 && oldIndex !== slotIndex) {
        next[oldIndex] = next[slotIndex]; // swap
      }
      next[slotIndex] = teamId;
      return next;
    });

    // Close editing for this slot, find next empty slot if any
    setSlotSearchQuery("");
    const nextEmptyIndex = ballotRanks.findIndex(
      (id, idx) => idx > slotIndex && id === null
    );

    if (nextEmptyIndex !== -1) {
      setEditingSlotIndex(nextEmptyIndex);
    } else {
      setEditingSlotIndex(null);
    }
  };

  // Add/remove team via the right panel
  const handleSelectTeamFromPanel = (teamId: string) => {
    if (isTeamSelected(teamId)) {
      setBallotRanks((prev) => prev.map((id) => (id === teamId ? null : id)));
      return;
    }

    const emptyIndex = ballotRanks.findIndex((r) => r === null);
    if (emptyIndex === -1) {
      setErrorMsg(
        "Your ballot already has 25 teams. Remove one or tap a slot to replace it."
      );
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
    if (index === 0 || swappingState !== null) return;

    // Trigger sliding animation: index moves UP (-100%), index - 1 moves DOWN (+100%)
    setSwappingState({
      activeIndex: index,
      targetIndex: index - 1,
      direction: "up",
    });

    setTimeout(() => {
      setBallotRanks((prev) => {
        const next = [...prev];
        const temp = next[index];
        next[index] = next[index - 1];
        next[index - 1] = temp;
        return next;
      });
      setSwappingState(null);
      setJustSwapped([index, index - 1]);
      setTimeout(() => setJustSwapped([]), 450);
    }, 280);
  };

  const handleMoveDown = (index: number) => {
    if (index === 24 || swappingState !== null) return;

    // Trigger sliding animation: index moves DOWN (+100%), index + 1 moves UP (-100%)
    setSwappingState({
      activeIndex: index,
      targetIndex: index + 1,
      direction: "down",
    });

    setTimeout(() => {
      setBallotRanks((prev) => {
        const next = [...prev];
        const temp = next[index];
        next[index] = next[index + 1];
        next[index + 1] = temp;
        return next;
      });
      setSwappingState(null);
      setJustSwapped([index, index + 1]);
      setTimeout(() => setJustSwapped([]), 450);
    }, 280);
  };

  // Helper to apply 25 team ranks cleanly with notification
  const applyRankings = (
    rankedList: {
      name?: string;
      shortName?: string;
      teamName?: string;
      teamId?: string | null;
    }[],
    sourceLabel: string
  ) => {
    const filled: (string | null)[] = Array(25).fill(null);
    rankedList.slice(0, 25).forEach((r, idx) => {
      if (r.teamId) {
        filled[idx] = r.teamId;
      } else {
        const queryName = (r.name || r.teamName || "").toLowerCase().trim();
        const queryShort = (r.shortName || "").toLowerCase().trim();
        const match = teams.find(
          (t) =>
            t.name.toLowerCase().trim() === queryName ||
            t.shortName.toLowerCase().trim() === queryShort ||
            (queryName === "miami" && t.name.includes("Miami"))
        );
        if (match) filled[idx] = match.id;
      }
    });

    setBallotRanks(filled);
    setSuccessMsg(`Auto-filled Top 25 from ${sourceLabel}!`);
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  // 1. Auto-fill Community Consensus
  const handleFillConsensus = async () => {
    setIsQuickFillOpen(false);
    setQuickFillLoading("consensus");
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const targetWeekNumber =
        selectedWeek && selectedWeek.weekNumber > 0
          ? selectedWeek.weekNumber - 1
          : 1;

      let res = await fetch(`/api/rankings/${targetWeekNumber}`);
      if (!res.ok) {
        // Fallback to Week 1
        res = await fetch(`/api/rankings/1`);
      }

      if (!res.ok) {
        setErrorMsg(`No consensus rankings found for Week ${targetWeekNumber}.`);
        return;
      }

      const data = await res.json();
      if (data.rankings && data.rankings.length > 0) {
        applyRankings(
          data.rankings,
          `Week ${data.week?.weekNumber ?? targetWeekNumber} Community Consensus`
        );
      } else {
        setErrorMsg(
          `No community consensus data available for Week ${targetWeekNumber}.`
        );
      }
    } catch (e) {
      console.error(e);
      setErrorMsg("Failed to load community consensus rankings.");
    } finally {
      setQuickFillLoading(null);
    }
  };

  // 2. Auto-fill User's Previous Poll Submission
  const handleFillPreviousSubmission = async () => {
    setIsQuickFillOpen(false);
    setErrorMsg("");
    setSuccessMsg("");

    if (!user) {
      setErrorMsg("Please sign in to auto-fill your previous week's ballot.");
      return;
    }

    setQuickFillLoading("previous");

    try {
      const targetWeekNumber =
        selectedWeek && selectedWeek.weekNumber > 0
          ? selectedWeek.weekNumber - 1
          : 1;

      const res = await fetch(`/api/ballots?weekNumber=${targetWeekNumber}`);
      if (!res.ok) {
        setErrorMsg(`No previous ballot found for Week ${targetWeekNumber}.`);
        return;
      }

      const data = await res.json();
      if (data.ballot && data.ballot.items?.length > 0) {
        const newRanks: (string | null)[] = Array(25).fill(null);
        data.ballot.items.forEach(
          (item: { rank: number; teamId: string }) => {
            if (item.rank >= 1 && item.rank <= 25) {
              newRanks[item.rank - 1] = item.teamId;
            }
          }
        );
        setBallotRanks(newRanks);
        setSuccessMsg(
          `Loaded your submitted ballot from Week ${targetWeekNumber}!`
        );
        setTimeout(() => setSuccessMsg(""), 4000);
      } else {
        setErrorMsg(
          `You have not submitted a ballot for Week ${targetWeekNumber}.`
        );
      }
    } catch (e) {
      console.error(e);
      setErrorMsg("Failed to fetch your previous ballot submission.");
    } finally {
      setQuickFillLoading(null);
    }
  };

  // 3. Auto-fill Most Recent AP Top 25 Poll
  const handleFillAPPoll = async () => {
    setIsQuickFillOpen(false);
    setQuickFillLoading("ap");
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/ap-poll");
      if (!res.ok) {
        setErrorMsg("Failed to fetch official AP Top 25 Poll.");
        return;
      }

      const data = await res.json();
      if (data.ranks && data.ranks.length > 0) {
        applyRankings(data.ranks, data.source || "AP Top 25 Poll");
      } else {
        setErrorMsg("AP Top 25 Poll data is currently unavailable.");
      }
    } catch (e) {
      console.error(e);
      setErrorMsg("Failed to load AP Top 25 Poll.");
    } finally {
      setQuickFillLoading(null);
    }
  };

  const handleSubmitBallot = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    setErrorMsg("");
    setSuccessMsg("");

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
      setIsShareModalOpen(true);
    } catch {
      setErrorMsg("An unexpected network error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Record parsing helper
  const parseRecord = (recordStr?: string | null) => {
    if (!recordStr) return { wins: 0, losses: 0, ties: 0, total: 0, pct: 0 };
    const parts = recordStr.split("-").map((n) => parseInt(n.trim(), 10) || 0);
    const wins = parts[0] || 0;
    const losses = parts[1] || 0;
    const ties = parts[2] || 0;
    const total = wins + losses + ties;
    const pct = total > 0 ? (wins + 0.5 * ties) / total : 0;
    return { wins, losses, ties, total, pct };
  };

  // Compare teams by:
  // 1. Most recent AP Poll rank (1 to 25)
  // 2. Remaining teams sorted by Win Percentage -> More Wins -> Fewer Losses -> Alphabetical
  const compareTeams = (a: Team, b: Team) => {
    const rankA = apRanks.get(a.id);
    const rankB = apRanks.get(b.id);

    // If both are ranked in AP poll, sort by AP rank (ascending: #1, #2, ...)
    if (rankA !== undefined && rankB !== undefined) {
      return rankA - rankB;
    }
    // If only 'a' is ranked in AP poll, 'a' comes first
    if (rankA !== undefined) {
      return -1;
    }
    // If only 'b' is ranked in AP poll, 'b' comes first
    if (rankB !== undefined) {
      return 1;
    }

    // Both are unranked in AP poll -> sort by win percentage
    const recA = parseRecord(a.record);
    const recB = parseRecord(b.record);

    if (recB.pct !== recA.pct) {
      return recB.pct - recA.pct;
    }
    if (recB.wins !== recA.wins) {
      return recB.wins - recA.wins;
    }
    if (recA.losses !== recB.losses) {
      return recA.losses - recB.losses;
    }
    return a.name.localeCompare(b.name);
  };

  // Filtered teams for right panel (sorted by AP Poll then win percentage)
  const filteredPanelTeams = teams
    .filter((team) => {
      const matchesSearch =
        team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.shortName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (team.mascot &&
          team.mascot.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesConf =
        selectedConference === "ALL" || team.conference === selectedConference;
      return matchesSearch && matchesConf;
    })
    .sort(compareTeams);

  // Filtered teams for inline slot search dropdown (sorted by AP Poll then win percentage)
  const inlineSlotSearchResults = teams
    .filter((team) => {
      const q = slotSearchQuery.toLowerCase().trim();
      if (!q) return true;
      return (
        team.name.toLowerCase().includes(q) ||
        team.shortName.toLowerCase().includes(q) ||
        (team.mascot && team.mascot.toLowerCase().includes(q)) ||
        team.conference.toLowerCase().includes(q)
      );
    })
    .sort(compareTeams)
    .slice(0, 8); // Top 8 matches for fast mobile dropdown

  const filledCount = ballotRanks.filter(Boolean).length;

  const rankedTeamsData: RankedTeamInfo[] = [];
  ballotRanks.forEach((teamId, index) => {
    const team = teamById(teamId);
    if (team) {
      rankedTeamsData.push({
        rank: index + 1,
        id: team.id,
        name: team.name,
        shortName: team.shortName,
        mascot: team.mascot,
        conference: team.conference,
        record: team.record,
        primaryColor: team.primaryColor,
        logoUrl: team.logoUrl,
        secondaryLogoUrl: team.secondaryLogoUrl,
      });
    }
  });

  const conferences = [
    "ALL",
    "SEC",
    "Big Ten",
    "ACC",
    "Big 12",
    "Ind.",
    "Mountain West",
    "AAC",
    "Sun Belt",
    "C-USA",
    "MAC",
    "Pac-12",
  ];

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
              Rank your Top 25 teams. Tap any rank to search and select a team.
            </p>
          </div>

          {/* Current Active Voting Week Badge */}
          <div className="flex items-center gap-2">
            <div className="px-3.5 py-1.5 rounded-md bg-surface border border-accent/40 flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="font-bold text-foreground">
                {selectedWeek?.title || "Current Week"}
              </span>
              <span className="text-[10px] text-accent font-semibold uppercase tracking-wider bg-accent/10 px-1.5 py-0.5 rounded border border-accent/20">
                {selectedWeek?.status === "OPEN"
                  ? "Voting Open"
                  : selectedWeek?.status || "Active"}
              </span>
            </div>
          </div>
        </div>

        {/* Auth Notice if not logged in */}
        {!user && (
          <div className="mt-4 p-3.5 sm:p-4 rounded-md bg-accent-dim border border-accent/30 text-xs text-foreground flex items-center justify-between gap-3">
            <div className="leading-relaxed">
              <span className="font-bold text-accent">Sign in required:</span>{" "}
              You must be logged in to submit your official ballot.
            </div>
            <Link
              href="/login"
              className="px-4 py-2 rounded-md bg-accent text-background font-bold hover:bg-accent-glow transition-all whitespace-nowrap shrink-0 text-center min-w-[5rem]"
            >
              Log In
            </Link>
          </div>
        )}

        {/* Existing Ballot Banner */}
        {user && existingBallotId && (
          <div className="mt-4 p-3.5 rounded-md bg-surface border border-accent/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-foreground">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-success shrink-0"></span>
              <span>
                You have an active ballot for{" "}
                <strong>{selectedWeek?.title}</strong>. Changes will update
                your existing ballot.
              </span>
            </div>
            {filledCount === 25 && (
              <button
                type="button"
                onClick={() => setIsShareModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-accent/15 border border-accent/40 text-accent hover:bg-accent hover:text-background font-bold text-xs transition-all active:scale-95 shrink-0 self-start sm:self-auto"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                <span>Share Picks</span>
              </button>
            )}
          </div>
        )}

        {/* Status Alerts */}
        {errorMsg && (
          <div className="mt-4 p-3 rounded-md bg-danger/10 border border-danger/30 text-danger text-xs font-medium">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mt-4 p-3 rounded-md bg-success/10 border border-success/30 text-success text-xs font-medium">
            {successMsg}
          </div>
        )}

        {/* Two-Column Ballot Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          {/* Left Column: Top 25 Ballot Slots (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-foreground">Your Top 25</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-surface border border-border text-accent">
                  {filledCount} / 25 Ranked
                </span>
              </div>

              <div className="relative" ref={quickFillRef}>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsQuickFillOpen(!isQuickFillOpen)}
                    disabled={quickFillLoading !== null}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-surface border border-accent/40 text-accent hover:bg-accent/10 hover:border-accent transition-all shadow-sm active:scale-95 disabled:opacity-50"
                  >
                    {quickFillLoading ? (
                      <span className="inline-block w-3 h-3 border-2 border-accent border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <svg className="w-3.5 h-3.5 text-accent" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                      </svg>
                    )}
                    <span>Auto-fill</span>
                    <svg
                      className={`w-3 h-3 transition-transform duration-200 ${
                        isQuickFillOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setBallotRanks(Array(25).fill(null));
                      setErrorMsg("");
                      setSuccessMsg("");
                    }}
                    className="text-xs font-medium text-muted hover:text-danger px-1.5 py-1 transition-colors"
                  >
                    Clear
                  </button>
                </div>

                {/* Dropdown Menu */}
                {isQuickFillOpen && (
                  <div className="absolute right-0 mt-2 w-72 rounded-lg bg-surface border border-border/80 shadow-2xl p-1.5 z-50 animate-fade-in-up backdrop-blur-xl">
                    <div className="px-3 py-2 border-b border-border/40">
                      <p className="text-[11px] font-bold text-foreground uppercase tracking-wider">
                        Auto-fill Options
                      </p>
                      <p className="text-[10px] text-muted">
                        Select an option to automatically populate your 25 ballot slots
                      </p>
                    </div>

                    <div className="py-1 space-y-1">
                      {/* Option 1: Community Consensus */}
                      <button
                        type="button"
                        onClick={handleFillConsensus}
                        className="w-full text-left p-2 rounded-md hover:bg-surface-elevated border border-transparent hover:border-border transition-all flex items-start gap-2.5 group"
                      >
                        <div className="w-7 h-7 rounded bg-accent-dim text-accent flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                          <svg className="w-3.5 h-3.5 text-accent" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                          </svg>
                        </div>
                        <div>
                          <div className="text-xs font-bold text-foreground group-hover:text-accent transition-colors flex items-center gap-1.5">
                            Community Consensus
                          </div>
                          <p className="text-[10px] text-muted leading-tight mt-0.5">
                            Auto-populate from previous week&apos;s community rankings
                          </p>
                        </div>
                      </button>

                      {/* Option 2: Previous Poll Submission */}
                      <button
                        type="button"
                        onClick={handleFillPreviousSubmission}
                        className="w-full text-left p-2 rounded-md hover:bg-surface-elevated border border-transparent hover:border-border transition-all flex items-start gap-2.5 group"
                      >
                        <div className="w-7 h-7 rounded bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                          <svg className="w-3.5 h-3.5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-xs font-bold text-foreground group-hover:text-purple-400 transition-colors flex items-center gap-1.5">
                            Previous Poll Submission
                          </div>
                          <p className="text-[10px] text-muted leading-tight mt-0.5">
                            Auto-fill your submitted ballot from last week
                          </p>
                        </div>
                      </button>

                      {/* Option 3: Most Recent AP Poll */}
                      <button
                        type="button"
                        onClick={handleFillAPPoll}
                        className="w-full text-left p-2 rounded-md hover:bg-surface-elevated border border-transparent hover:border-border transition-all flex items-start gap-2.5 group"
                      >
                        <div className="w-7 h-7 rounded bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                          <svg className="w-3.5 h-3.5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-xs font-bold text-foreground group-hover:text-amber-400 transition-colors flex items-center gap-1.5">
                            Most Recent AP Poll
                          </div>
                          <p className="text-[10px] text-muted leading-tight mt-0.5">
                            Auto-fill with the official ESPN AP Top 25 Poll
                          </p>
                        </div>
                      </button>
                    </div>

                    <div className="pt-1 mt-1 border-t border-border/40">
                      <button
                        type="button"
                        onClick={() => {
                          setBallotRanks(Array(25).fill(null));
                          setIsQuickFillOpen(false);
                          setErrorMsg("");
                          setSuccessMsg("");
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-danger/10 text-muted hover:text-danger transition-colors flex items-center gap-2 text-xs font-medium"
                      >
                        <svg className="w-3.5 h-3.5 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span>Clear all 25 slots</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <p className="text-[11px] text-muted -mt-1 hidden sm:flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-accent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Tip: Click or tap any row to type and search teams directly.</span>
            </p>

            {/* Ballot List with Inline Accordion Search Dropdowns */}
            <div className="glass-card rounded-lg overflow-hidden divide-y divide-border/40">
              {ballotRanks.map((teamId, index) => {
                const team = teamById(teamId);
                const rankNum = index + 1;
                const isEditing = editingSlotIndex === index;

                const isActiveSwap = swappingState?.activeIndex === index;
                const isTargetSwap = swappingState?.targetIndex === index;
                const isJustSwapped = justSwapped.includes(index);

                let transformStyle = "";
                let extraClasses = "";

                if (isActiveSwap) {
                  const yShift =
                    swappingState.direction === "up" ? "-100%" : "100%";
                  transformStyle = `translateY(${yShift}) scale(1.02)`;
                  extraClasses =
                    "z-30 relative shadow-[0_12px_28px_-4px_rgba(201,168,76,0.35),0_8px_10px_-6px_rgba(0,0,0,0.5)] border-accent/80 bg-surface-elevated ring-1 ring-accent/60 rounded-md";
                } else if (isTargetSwap) {
                  const yShift =
                    swappingState.direction === "up" ? "100%" : "-100%";
                  transformStyle = `translateY(${yShift}) scale(0.98)`;
                  extraClasses = "z-10 relative opacity-70 bg-surface/40";
                } else if (isEditing) {
                  extraClasses =
                    "bg-surface-hover/90 ring-1 ring-accent/60 z-30 rounded-md shadow-lg";
                } else if (isJustSwapped) {
                  extraClasses =
                    "ring-1 ring-accent/50 bg-accent/10 transition-colors duration-500 rounded-md";
                } else if (team) {
                  extraClasses = "hover:bg-surface-hover/60";
                } else {
                  extraClasses = "bg-background/40 hover:bg-surface-hover/30";
                }

                return (
                  <div
                    key={index}
                    style={{
                      transform: transformStyle || undefined,
                      transition: swappingState
                        ? "transform 280ms cubic-bezier(0.34, 1.35, 0.64, 1), opacity 280ms ease, box-shadow 280ms ease"
                        : "background-color 200ms ease, border-color 200ms ease",
                    }}
                    className={`relative text-xs ${extraClasses}`}
                  >
                    {/* Main Row Content */}
                    <div
                      onClick={() => {
                        if (!isEditing && !swappingState) {
                          setEditingSlotIndex(index);
                          setSlotSearchQuery("");
                        }
                      }}
                      className="flex items-center justify-between px-3 py-2 cursor-pointer"
                    >
                      {/* Left: Rank badge & Team or Search Input */}
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <span
                          className={`w-6 h-6 rounded flex items-center justify-center font-bold text-[11px] tabular-nums shrink-0 ${
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

                        {isEditing ? (
                          /* Inline Search Input */
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <input
                              ref={(el) => {
                                inputRefs.current[index] = el;
                              }}
                              type="text"
                              value={slotSearchQuery}
                              onChange={(e) =>
                                setSlotSearchQuery(e.target.value)
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Escape") {
                                  setEditingSlotIndex(null);
                                }
                                if (
                                  e.key === "Enter" &&
                                  inlineSlotSearchResults.length > 0
                                ) {
                                  handleAssignTeamToSlot(
                                    index,
                                    inlineSlotSearchResults[0].id
                                  );
                                }
                              }}
                              placeholder="Type team name (e.g. Georgia, OSU, Miami)..."
                              className="w-full bg-background border border-accent/50 rounded-md px-2.5 py-1 text-base sm:text-xs text-foreground placeholder:text-muted focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingSlotIndex(null);
                              }}
                              className="p-1 text-muted hover:text-foreground text-xs"
                              title="Cancel"
                            >
                              ✕
                            </button>
                          </div>
                        ) : team ? (
                          /* Render Ranked Team */
                          <div className="flex items-center gap-2.5 min-w-0">
                            <TeamLogo
                              logoUrl={team.logoUrl}
                              name={team.name}
                              shortName={team.shortName}
                              primaryColor={team.primaryColor}
                              size={28}
                            />
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="font-semibold text-foreground truncate">
                                {team.name}
                              </span>
                              <span className="px-1.5 py-0.5 rounded bg-surface border border-border text-[10px] font-bold text-accent shrink-0">
                                {team.record}
                              </span>
                              <span className="text-[10px] text-muted shrink-0 hidden sm:inline">
                                ({team.conference})
                              </span>
                            </div>
                          </div>
                        ) : (
                          /* Empty Slot Placeholder */
                          <span className="text-muted/60 italic text-[11px] flex items-center gap-1">
                            <span>+</span> Tap to type and rank #{rankNum}...
                          </span>
                        )}
                      </div>

                      {/* Right: Reorder & Remove Actions */}
                      {!isEditing && team && (
                        <div
                          className="flex items-center gap-1 shrink-0 ml-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() => handleMoveUp(index)}
                            disabled={index === 0 || swappingState !== null}
                            className="p-1 text-muted hover:text-accent hover:bg-accent/10 rounded active:scale-75 transition-all disabled:opacity-20 disabled:pointer-events-none"
                            title="Move Up"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveDown(index)}
                            disabled={index === 24 || swappingState !== null}
                            className="p-1 text-muted hover:text-accent hover:bg-accent/10 rounded active:scale-75 transition-all disabled:opacity-20 disabled:pointer-events-none"
                            title="Move Down"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveRank(index)}
                            disabled={swappingState !== null}
                            className="p-1 text-muted hover:text-danger hover:bg-danger/10 rounded active:scale-75 transition-all ml-0.5 disabled:opacity-20"
                            title="Remove Team"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Inline Expanded Dropdown Search Results (pushes subsequent positions down) */}
                    {isEditing && (
                      <div className="mt-2 mb-2 mx-2 p-1.5 glass-card bg-surface/95 border border-accent/40 rounded-md max-h-64 overflow-y-auto divide-y divide-border/30 animate-fade-in-up">
                        {inlineSlotSearchResults.length > 0 ? (
                          inlineSlotSearchResults.map((t) => {
                            const alreadyRankedAt = ballotRanks.findIndex(
                              (id) => id === t.id
                            );

                            return (
                              <button
                                key={t.id}
                                type="button"
                                onClick={() =>
                                  handleAssignTeamToSlot(index, t.id)
                                }
                                className="w-full flex items-center justify-between p-2 rounded-md hover:bg-accent/15 text-left transition-colors"
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <TeamLogo
                                    logoUrl={t.logoUrl}
                                    name={t.name}
                                    shortName={t.shortName}
                                    primaryColor={t.primaryColor}
                                    size={26}
                                  />
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-1.5">
                                      <p className="text-xs font-semibold text-foreground truncate">
                                        {t.name}
                                      </p>
                                      <span className="text-[10px] font-bold text-accent shrink-0">
                                        {t.record}
                                      </span>
                                    </div>
                                    <p className="text-[10px] text-muted">
                                      {t.conference}
                                    </p>
                                  </div>
                                </div>

                                {alreadyRankedAt !== -1 && (
                                  <span className="text-[10px] font-semibold text-accent bg-accent/10 px-1.5 py-0.5 rounded shrink-0">
                                    Currently #{alreadyRankedAt + 1}
                                  </span>
                                )}
                              </button>
                            );
                          })
                        ) : (
                          <div className="p-3 text-center text-xs text-muted">
                            No matching teams for &ldquo;{slotSearchQuery}&rdquo;
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Submit Action Bar */}
            <div className="mt-2 flex items-center justify-between p-4 glass-card rounded-lg">
              <div className="text-xs text-muted">
                {filledCount === 25 ? (
                  <span className="text-success font-semibold">
                    ✓ Ballot complete and ready
                  </span>
                ) : (
                  <span>{25 - filledCount} slots remaining to rank</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {filledCount === 25 && (
                  <button
                    type="button"
                    onClick={() => setIsShareModalOpen(true)}
                    className="px-4 py-2.5 rounded-md bg-surface-elevated border border-accent/40 text-accent font-bold text-xs hover:bg-accent/15 transition-all flex items-center gap-1.5 active:scale-95 shadow-sm"
                  >
                    <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    <span>Share Picks</span>
                  </button>
                )}

                <button
                  type="button"
                  disabled={
                    filledCount !== 25 ||
                    isSubmitting ||
                    selectedWeek?.status !== "OPEN"
                  }
                  onClick={handleSubmitBallot}
                  className="px-6 py-2.5 rounded-md bg-accent text-background font-bold text-xs hover:bg-accent-glow transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(201,168,76,0.3)] active:scale-95"
                >
                  {isSubmitting
                    ? "Submitting..."
                    : existingBallotId
                    ? "Update My Ballot"
                    : "Submit Official Ballot"}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: All Teams Reference Panel (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-foreground">
                Teams Directory
              </h2>
              <span className="text-[10px] font-semibold text-muted bg-surface px-2 py-0.5 rounded-md border border-border">
                Suggested Order
              </span>
            </div>

            {/* Search Input */}
            <div className="flex flex-col gap-2">
              <input
                type="text"
                placeholder="Filter directory..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-surface border border-border text-foreground text-base sm:text-xs placeholder:text-muted/60 focus:outline-none focus:border-accent"
              />

              {/* Conference Pills Filter */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {conferences.map((conf) => (
                  <button
                    key={conf}
                    type="button"
                    onClick={() => setSelectedConference(conf)}
                    className={`shrink-0 px-2.5 py-1 rounded-md text-[10px] font-semibold border transition-all ${
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
            <div className="glass-card rounded-lg p-2 max-h-[620px] overflow-y-auto space-y-1">
              {filteredPanelTeams.map((team) => {
                const selected = isTeamSelected(team.id);
                const rankIndex = ballotRanks.findIndex((id) => id === team.id);

                return (
                  <button
                    key={team.id}
                    type="button"
                    onClick={() => handleSelectTeamFromPanel(team.id)}
                    className={`w-full flex items-center justify-between p-2 rounded-md text-left transition-all ${
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
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-semibold text-foreground truncate">
                            {team.name}
                          </p>
                          <span className="text-[10px] font-bold text-accent shrink-0">
                            {team.record}
                          </span>
                        </div>
                        <p className="text-[10px] text-muted">
                          {team.conference}
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

              {filteredPanelTeams.length === 0 && (
                <div className="p-6 text-center text-xs text-muted">
                  No teams found matching &ldquo;{searchTerm}&rdquo;
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Shareable Ballot Graphic Modal */}
      <BallotShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        weekTitle={selectedWeek?.title || `Week ${selectedWeek?.weekNumber || 1}`}
        weekNumber={selectedWeek?.weekNumber || 1}
        username={user?.username || "Voter"}
        rankedTeams={rankedTeamsData}
        onContinueToRankings={() => {
          setIsShareModalOpen(false);
          router.push(`/?week=${selectedWeek?.weekNumber || 1}`);
        }}
      />
    </>
  );
}

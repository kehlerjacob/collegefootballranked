"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { Header } from "@/components/Header";
import { TeamLogo } from "@/components/TeamLogo";

interface TeamOption {
  id: string;
  name: string;
  shortName: string;
  mascot: string | null;
  conference: string;
  record?: string;
  logoUrl: string | null;
  primaryColor: string | null;
}

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [teams, setTeams] = useState<TeamOption[]>([]);
  const [apRanks, setApRanks] = useState<Map<string, number>>(new Map());
  const [loadingTeams, setLoadingTeams] = useState(true);

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    favoriteTeamId: "",
  });

  const [teamSearch, setTeamSearch] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load all FBS teams & AP poll data for identical sorting to ballot builder
  useEffect(() => {
    async function loadData() {
      try {
        const [teamsRes, apRes] = await Promise.all([
          fetch("/api/teams"),
          fetch("/api/ap-poll").catch(() => null),
        ]);

        let loadedTeams: TeamOption[] = [];
        if (teamsRes.ok) {
          const data = await teamsRes.json();
          loadedTeams = data.teams || [];
          setTeams(loadedTeams);
        }

        if (apRes && apRes.ok) {
          try {
            const apData = await apRes.json();
            if (apData?.ranks && Array.isArray(apData.ranks)) {
              const newApMap = new Map<string, number>();
              apData.ranks.forEach(
                (r: {
                  rank?: number;
                  teamId?: string | null;
                  teamName?: string;
                  name?: string;
                  shortName?: string;
                }) => {
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
                }
              );
              setApRanks(newApMap);
            }
          } catch (e) {
            console.error("Could not parse AP poll data:", e);
          }
        }
      } catch (e) {
        console.error("Failed to load teams:", e);
      } finally {
        setLoadingTeams(false);
      }
    }
    loadData();
  }, []);

  // Click outside to close team picker
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedTeam = teams.find((t) => t.id === formData.favoriteTeamId);

  // Parse win-loss record
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

  // Compare teams identically to ballot builder (AP rank -> Win % -> Alphabetical)
  const compareTeams = (a: TeamOption, b: TeamOption) => {
    const rankA = apRanks.get(a.id);
    const rankB = apRanks.get(b.id);

    if (rankA !== undefined && rankB !== undefined) return rankA - rankB;
    if (rankA !== undefined) return -1;
    if (rankB !== undefined) return 1;

    const recA = parseRecord(a.record);
    const recB = parseRecord(b.record);

    if (recB.pct !== recA.pct) return recB.pct - recA.pct;
    if (recB.wins !== recA.wins) return recB.wins - recA.wins;
    if (recA.losses !== recB.losses) return recA.losses - recB.losses;
    return a.name.localeCompare(b.name);
  };

  // Filter and sort teams for search results
  const searchResults = useMemo(() => {
    const q = teamSearch.toLowerCase().trim();
    return teams
      .filter((t) => {
        if (!q) return true;
        return (
          t.name.toLowerCase().includes(q) ||
          t.shortName.toLowerCase().includes(q) ||
          (t.mascot && t.mascot.toLowerCase().includes(q)) ||
          t.conference.toLowerCase().includes(q)
        );
      })
      .sort(compareTeams);
  }, [teams, teamSearch, apRanks]);

  const handleSelectTeam = (teamId: string) => {
    setFormData((prev) => ({ ...prev, favoriteTeamId: teamId }));
    setIsDropdownOpen(false);
    setTeamSearch("");
    setError("");
  };

  const handleClearSelectedTeam = () => {
    setFormData((prev) => ({ ...prev, favoriteTeamId: "" }));
    setTeamSearch("");
    setIsDropdownOpen(true);
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 50);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.favoriteTeamId) {
      setError("Please select your favorite college football team");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      login(data.user);
      router.push("/ballot");
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md glass-card rounded-lg p-6 sm:p-8 animate-fade-in-up">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Join CFR
            </h1>
            <p className="text-xs sm:text-sm text-muted mt-1">
              Create your account to submit weekly ballots, represent your favorite team, and shape consensus rankings
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-md bg-danger/10 border border-danger/30 text-danger text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="you@example.com"
                className="w-full px-3.5 py-2.5 rounded-md bg-surface border border-border text-foreground text-base sm:text-sm placeholder:text-muted/60 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                Username
              </label>
              <input
                type="text"
                required
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                placeholder="sec_fanatic"
                className="w-full px-3.5 py-2.5 rounded-md bg-surface border border-border text-foreground text-base sm:text-sm placeholder:text-muted/60 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="At least 6 characters"
                className="w-full px-3.5 py-2.5 rounded-md bg-surface border border-border text-foreground text-base sm:text-sm placeholder:text-muted/60 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
              />
            </div>

            {/* Favorite Team Search Selector (Works like Ballot Builder Search) */}
            <div className="relative" ref={containerRef}>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Favorite Team</span>
                <span className="text-[10px] text-accent font-semibold uppercase">Required</span>
              </label>

              {selectedTeam ? (
                /* Selected Team Card View */
                <div className="flex items-center justify-between p-2.5 px-3 rounded-md bg-surface-elevated border border-accent/60 ring-1 ring-accent/30 transition-all shadow-sm">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <TeamLogo
                      logoUrl={selectedTeam.logoUrl}
                      name={selectedTeam.name}
                      shortName={selectedTeam.shortName}
                      primaryColor={selectedTeam.primaryColor}
                      size={26}
                    />
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xs font-bold text-foreground truncate">
                        {selectedTeam.name}
                      </span>
                      {selectedTeam.record && (
                        <span className="px-1.5 py-0.5 rounded bg-surface border border-border text-[10px] font-bold text-accent shrink-0">
                          {selectedTeam.record}
                        </span>
                      )}
                      <span className="text-[10px] text-muted shrink-0">
                        ({selectedTeam.conference})
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleClearSelectedTeam}
                    className="p-1 px-2 rounded-md text-xs font-semibold text-muted hover:text-foreground hover:bg-surface border border-border/60 transition-colors ml-2 shrink-0"
                    title="Change Team"
                  >
                    Change
                  </button>
                </div>
              ) : (
                /* Search Input View */
                <div className="relative">
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={teamSearch}
                    onChange={(e) => {
                      setTeamSearch(e.target.value);
                      if (!isDropdownOpen) setIsDropdownOpen(true);
                    }}
                    onFocus={() => setIsDropdownOpen(true)}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") {
                        setIsDropdownOpen(false);
                      }
                      if (e.key === "Enter" && searchResults.length > 0) {
                        e.preventDefault();
                        handleSelectTeam(searchResults[0].id);
                      }
                    }}
                    placeholder={
                      loadingTeams
                        ? "Loading teams..."
                        : "Type team name (e.g. Georgia, OSU, Texas)..."
                    }
                    className="w-full px-3.5 py-2.5 rounded-md bg-surface border border-border text-foreground text-base sm:text-sm placeholder:text-muted/60 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                  />

                  {teamSearch && (
                    <button
                      type="button"
                      onClick={() => setTeamSearch("")}
                      className="absolute right-3 top-3 text-muted hover:text-foreground text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>
              )}

              {/* Suggestions Dropdown (Identical to Ballot Builder slot search) */}
              {!selectedTeam && isDropdownOpen && (
                <div className="absolute left-0 right-0 mt-1.5 rounded-lg bg-[#161a22] border border-accent/40 shadow-2xl z-50 p-1.5 max-h-64 overflow-y-auto divide-y divide-border/30 animate-fade-in backdrop-blur-xl">
                  {searchResults.length > 0 ? (
                    searchResults.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => handleSelectTeam(t.id)}
                        className="w-full flex items-center justify-between p-2 rounded-md hover:bg-accent/15 text-left transition-colors group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <TeamLogo
                            logoUrl={t.logoUrl}
                            name={t.name}
                            shortName={t.shortName}
                            primaryColor={t.primaryColor}
                            size={24}
                          />
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-xs font-bold text-foreground group-hover:text-accent transition-colors truncate">
                              {t.name}
                            </span>
                            {t.record && (
                              <span className="px-1.5 py-0.2 rounded bg-[#1c2029] border border-border text-[10px] font-bold text-accent shrink-0">
                                {t.record}
                              </span>
                            )}
                            <span className="text-[10px] text-muted shrink-0">
                              ({t.conference})
                            </span>
                          </div>
                        </div>

                        <span className="text-[10px] font-bold text-muted group-hover:text-accent shrink-0 ml-2">
                          Select →
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="p-4 text-center text-xs text-muted">
                      No teams found for &ldquo;{teamSearch}&rdquo;
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !formData.favoriteTeamId}
              className="w-full py-3 rounded-md bg-accent text-background font-bold text-sm hover:bg-accent-glow transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-muted">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-accent hover:underline font-semibold"
            >
              Sign in
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}

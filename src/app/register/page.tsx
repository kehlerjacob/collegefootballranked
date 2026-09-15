"use client";

import { useState, useEffect, useRef } from "react";
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
  logoUrl: string | null;
  primaryColor: string | null;
}

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [teams, setTeams] = useState<TeamOption[]>([]);
  const [loadingTeams, setLoadingTeams] = useState(true);

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    favoriteTeamId: "",
  });

  const [teamSearch, setTeamSearch] = useState("");
  const [isTeamPickerOpen, setIsTeamPickerOpen] = useState(false);
  const teamPickerRef = useRef<HTMLDivElement | null>(null);

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load all FBS teams
  useEffect(() => {
    async function loadTeams() {
      try {
        const res = await fetch("/api/teams");
        if (res.ok) {
          const data = await res.json();
          setTeams(data.teams || []);
        }
      } catch (e) {
        console.error("Failed to load teams:", e);
      } finally {
        setLoadingTeams(false);
      }
    }
    loadTeams();
  }, []);

  // Click outside to close team picker
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        teamPickerRef.current &&
        !teamPickerRef.current.contains(e.target as Node)
      ) {
        setIsTeamPickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedTeam = teams.find((t) => t.id === formData.favoriteTeamId);

  const filteredTeams = teams.filter((t) => {
    const q = teamSearch.toLowerCase().trim();
    if (!q) return true;
    return (
      t.name.toLowerCase().includes(q) ||
      t.shortName.toLowerCase().includes(q) ||
      (t.mascot && t.mascot.toLowerCase().includes(q)) ||
      t.conference.toLowerCase().includes(q)
    );
  });

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
        <div className="w-full max-w-md glass-card rounded-2xl p-6 sm:p-8 animate-fade-in-up">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Join CFR
            </h1>
            <p className="text-xs sm:text-sm text-muted mt-1">
              Create your account to submit weekly ballots, represent your favorite team, and shape consensus rankings
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-danger/10 border border-danger/30 text-danger text-xs font-medium">
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
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-foreground text-base sm:text-sm placeholder:text-muted/60 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
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
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-foreground text-base sm:text-sm placeholder:text-muted/60 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
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
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-foreground text-base sm:text-sm placeholder:text-muted/60 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
              />
            </div>

            {/* Favorite Team Picker */}
            <div className="relative" ref={teamPickerRef}>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Favorite Team</span>
                <span className="text-[10px] text-accent font-normal lowercase">Required</span>
              </label>

              {/* Picker Button */}
              <button
                type="button"
                onClick={() => setIsTeamPickerOpen(!isTeamPickerOpen)}
                className={`w-full px-3.5 py-2.5 rounded-xl bg-surface border transition-all text-left flex items-center justify-between ${
                  selectedTeam
                    ? "border-accent/60 bg-accent/5 ring-1 ring-accent/30"
                    : "border-border text-muted/70 hover:border-border-light"
                }`}
              >
                {selectedTeam ? (
                  <div className="flex items-center gap-2.5 min-w-0">
                    <TeamLogo
                      logoUrl={selectedTeam.logoUrl}
                      name={selectedTeam.name}
                      shortName={selectedTeam.shortName}
                      primaryColor={selectedTeam.primaryColor}
                      size={24}
                    />
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-foreground truncate">
                        {selectedTeam.name}
                      </span>
                      <span className="text-[10px] text-muted ml-1.5">
                        ({selectedTeam.conference})
                      </span>
                    </div>
                  </div>
                ) : (
                  <span className="text-xs text-muted/70">
                    {loadingTeams ? "Loading teams..." : "Select your favorite team..."}
                  </span>
                )}

                <svg
                  className={`w-4 h-4 text-muted transition-transform ${
                    isTeamPickerOpen ? "rotate-180" : ""
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

              {/* Searchable Teams Dropdown */}
              {isTeamPickerOpen && (
                <div className="absolute left-0 right-0 mt-1.5 rounded-2xl bg-surface-elevated border border-accent/40 shadow-2xl z-50 p-2 animate-fade-in-up backdrop-blur-xl">
                  {/* Search bar */}
                  <input
                    type="text"
                    autoFocus
                    value={teamSearch}
                    onChange={(e) => setTeamSearch(e.target.value)}
                    placeholder="Search teams (e.g. Georgia, Ohio State, Texas)..."
                    className="w-full px-3 py-1.5 rounded-xl bg-background border border-border text-foreground text-xs placeholder:text-muted/60 focus:outline-none focus:border-accent mb-2"
                  />

                  {/* Teams List */}
                  <div className="max-h-52 overflow-y-auto space-y-1 divide-y divide-border/20 pr-1">
                    {filteredTeams.map((team) => {
                      const isSelected = formData.favoriteTeamId === team.id;
                      return (
                        <button
                          key={team.id}
                          type="button"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              favoriteTeamId: team.id,
                            });
                            setIsTeamPickerOpen(false);
                            setTeamSearch("");
                          }}
                          className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors ${
                            isSelected
                              ? "bg-accent/20 border border-accent/40"
                              : "hover:bg-surface border border-transparent"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <TeamLogo
                              logoUrl={team.logoUrl}
                              name={team.name}
                              shortName={team.shortName}
                              primaryColor={team.primaryColor}
                              size={22}
                            />
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-foreground truncate">
                                {team.name}
                              </p>
                              <p className="text-[10px] text-muted">
                                {team.conference}
                              </p>
                            </div>
                          </div>

                          {isSelected && (
                            <span className="text-accent text-xs font-bold shrink-0">
                              ✓
                            </span>
                          )}
                        </button>
                      );
                    })}

                    {filteredTeams.length === 0 && (
                      <div className="p-4 text-center text-xs text-muted">
                        No teams found for &ldquo;{teamSearch}&rdquo;
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-xl bg-accent text-background font-bold text-sm hover:bg-accent-glow transition-all duration-200 disabled:opacity-50 shadow-[0_0_15px_rgba(201,168,76,0.25)]"
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

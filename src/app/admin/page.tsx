"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { TeamLogo } from "@/components/TeamLogo";
import Link from "next/link";

interface UserData {
  id: string;
  email: string;
  username: string;
  role: string;
  createdAt: string;
  favoriteTeam?: {
    id: string;
    name: string;
    shortName: string;
    logoUrl?: string | null;
    primaryColor?: string | null;
    conference?: string;
  } | null;
  _count: {
    ballots: number;
    comments: number;
    commentLikes: number;
  };
}

interface WeekData {
  id: string;
  title: string;
  weekNumber: number;
  status: string;
  votingDeadline?: string | null;
  _count: {
    ballots: number;
    comments: number;
  };
}

interface CommentData {
  id: string;
  content: string;
  parentId?: string | null;
  createdAt: string;
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
    favoriteTeam?: {
      id: string;
      name: string;
      shortName: string;
      logoUrl?: string | null;
      primaryColor?: string | null;
    } | null;
  };
  week: {
    id: string;
    title: string;
    weekNumber: number;
  };
  _count: {
    likes: number;
    replies: number;
  };
}

interface FavoriteTeamStat {
  id: string;
  name: string;
  shortName: string;
  logoUrl?: string | null;
  primaryColor?: string | null;
  conference: string;
  _count: {
    fans: number;
  };
}

interface AdminData {
  stats: {
    totalUsers: number;
    totalBallots: number;
    totalComments: number;
    totalLikes: number;
  };
  users: UserData[];
  weeks: WeekData[];
  comments: CommentData[];
  favoriteTeams: FavoriteTeamStat[];
}

export default function AdminDashboardPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"users" | "comments" | "weeks">("users");
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Search & filter states
  const [userSearch, setUserSearch] = useState("");
  const [commentSearch, setCommentSearch] = useState("");
  const [selectedWeekFilter, setSelectedWeekFilter] = useState("ALL");
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);

  // Sync records trigger
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const isAdmin =
    user &&
    (user.role === "ADMIN" || user.email?.toLowerCase() === "kehlerjacob@gmail.com");

  // Load Admin Data
  const loadAdminData = async () => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/admin/stats");
      if (res.status === 401 || res.status === 403) {
        setErrorMsg("Access Denied: You do not have administrator permissions.");
        return;
      }
      if (!res.ok) {
        throw new Error("Failed to load admin stats");
      }
      const data = await res.json();
      setAdminData(data);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to connect to the admin API.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthLoading) {
      if (!user) {
        router.push("/login?callbackUrl=/admin");
      } else if (!isAdmin) {
        setErrorMsg("Access Denied: You do not have administrator permissions.");
        setIsLoading(false);
      } else {
        loadAdminData();
      }
    }
  }, [isAuthLoading, user, isAdmin, router]);

  // Handle Comment Deletion
  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("Are you sure you want to permanently delete this comment?")) return;
    setDeletingCommentId(commentId);
    try {
      const res = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        // Remove from local admin data state
        setAdminData((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            comments: prev.comments.filter((c) => c.id !== commentId),
            stats: {
              ...prev.stats,
              totalComments: Math.max(0, prev.stats.totalComments - 1),
            },
          };
        });
      } else {
        alert("Failed to delete comment");
      }
    } catch (e) {
      console.error(e);
      alert("Network error deleting comment");
    } finally {
      setDeletingCommentId(null);
    }
  };

  // Handle ESPN sync trigger
  const handleSyncRecords = async () => {
    setIsSyncing(true);
    setSyncStatus(null);
    try {
      const res = await fetch("/api/admin/sync-records", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setSyncStatus(`Successfully synced: ${data.message}`);
      } else {
        setSyncStatus(`Sync error: ${data.error || "Unknown error"}`);
      }
    } catch {
      setSyncStatus("Failed to execute sync.");
    } finally {
      setIsSyncing(false);
    }
  };

  // Week Management Triggers
  const [weekActionLoading, setWeekActionLoading] = useState<string | null>(null);

  const handleUpdateWeekStatus = async (weekId: string, newStatus: string) => {
    setWeekActionLoading(weekId);
    try {
      const res = await fetch("/api/admin/weeks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ weekId, status: newStatus }),
      });
      if (res.ok) {
        await loadAdminData();
      } else {
        const d = await res.json();
        alert(`Error updating week: ${d.error || "Unknown error"}`);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to update week status");
    } finally {
      setWeekActionLoading(null);
    }
  };

  const handleRecalculateConsensus = async (weekId: string) => {
    setWeekActionLoading(weekId);
    try {
      const res = await fetch("/api/admin/weeks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ weekId, recalculate: true }),
      });
      if (res.ok) {
        await loadAdminData();
        alert("Consensus rankings recalculated successfully!");
      } else {
        const d = await res.json();
        alert(`Error: ${d.error || "Unknown error"}`);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to recalculate consensus");
    } finally {
      setWeekActionLoading(null);
    }
  };

  const handleAdvanceWeeks = async () => {
    setIsSyncing(true);
    setSyncStatus(null);
    try {
      const res = await fetch("/api/admin/weeks", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setSyncStatus(`Auto-advance completed: ${data.result?.transitionedCount || 0} week(s) transitioned.`);
        await loadAdminData();
      } else {
        setSyncStatus(`Advance error: ${data.error || "Unknown error"}`);
      }
    } catch {
      setSyncStatus("Failed to execute auto-advance.");
    } finally {
      setIsSyncing(false);
    }
  };

  // Filtered Users
  const filteredUsers = useMemo(() => {
    if (!adminData?.users) return [];
    if (!userSearch.trim()) return adminData.users;
    const query = userSearch.toLowerCase();
    return adminData.users.filter(
      (u) =>
        u.username.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query) ||
        u.favoriteTeam?.name.toLowerCase().includes(query) ||
        u.favoriteTeam?.shortName.toLowerCase().includes(query)
    );
  }, [adminData?.users, userSearch]);

  // Filtered Comments
  const filteredComments = useMemo(() => {
    if (!adminData?.comments) return [];
    return adminData.comments.filter((c) => {
      const matchesWeek =
        selectedWeekFilter === "ALL" || c.week.id === selectedWeekFilter;
      const query = commentSearch.toLowerCase();
      const matchesSearch =
        !query ||
        c.content.toLowerCase().includes(query) ||
        c.user.username.toLowerCase().includes(query) ||
        c.user.email.toLowerCase().includes(query);
      return matchesWeek && matchesSearch;
    });
  }, [adminData?.comments, selectedWeekFilter, commentSearch]);

  if (isAuthLoading || (isLoading && !errorMsg)) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-muted text-sm font-semibold">Loading Admin Dashboard...</p>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="glass-card max-w-md w-full p-8 rounded-2xl border border-danger/30 text-center">
          <div className="w-14 h-14 bg-danger/10 text-danger rounded-2xl flex items-center justify-center mx-auto mb-4 font-bold">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Admin Restricted Area</h2>
          <p className="text-sm text-muted mb-6 leading-relaxed">{errorMsg}</p>
          <Link
            href="/"
            className="inline-block px-5 py-2.5 rounded-xl bg-surface border border-border text-foreground text-sm font-bold hover:bg-surface-elevated transition-colors"
          >
            ← Back to Polls
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted mb-1">
            <Link href="/" className="hover:text-accent transition-colors">
              College Football Ranked
            </Link>
            <span>/</span>
            <span className="text-accent font-semibold">Admin Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground flex items-center gap-2.5">
            <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400 text-sm font-bold uppercase tracking-wider">
              Admin
            </span>
            <span>Platform Overview &amp; Moderation</span>
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadAdminData}
            disabled={isLoading}
            className="px-3.5 py-2 rounded-xl bg-surface border border-border text-xs font-semibold text-muted hover:text-foreground hover:bg-surface-elevated transition-all flex items-center gap-1.5"
          >
            <svg
              className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span>Refresh</span>
          </button>

          <Link
            href="/"
            className="px-3.5 py-2 rounded-xl bg-accent text-background text-xs font-bold hover:bg-accent-glow transition-all"
          >
            View Live Site →
          </Link>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
        <div className="glass-card p-5 rounded-2xl border border-border/80 shadow-md">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Users</span>
            <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div className="text-3xl font-black text-foreground tabular-nums">
            {adminData?.stats.totalUsers.toLocaleString() ?? 0}
          </div>
          <p className="text-[11px] text-muted/70 mt-1">Registered voter accounts</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-border/80 shadow-md">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Ballots Submitted</span>
            <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <div className="text-3xl font-black text-accent tabular-nums">
            {adminData?.stats.totalBallots.toLocaleString() ?? 0}
          </div>
          <p className="text-[11px] text-muted/70 mt-1">Total rankings cast</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-border/80 shadow-md">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Comments</span>
            <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div className="text-3xl font-black text-foreground tabular-nums">
            {adminData?.stats.totalComments.toLocaleString() ?? 0}
          </div>
          <p className="text-[11px] text-muted/70 mt-1">Total thread discussions</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-border/80 shadow-md">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Comment Likes</span>
            <svg className="w-4 h-4 text-rose-500 fill-rose-500" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          <div className="text-3xl font-black text-rose-500 tabular-nums">
            {adminData?.stats.totalLikes.toLocaleString() ?? 0}
          </div>
          <p className="text-[11px] text-muted/70 mt-1">Community reactions</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-border/60 pb-3 mb-6">
        <button
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === "users"
              ? "bg-accent text-background shadow-md shadow-accent/20"
              : "text-muted hover:text-foreground bg-surface border border-border"
          }`}
        >
          Users &amp; Fanbase ({adminData?.users.length ?? 0})
        </button>

        <button
          onClick={() => setActiveTab("comments")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === "comments"
              ? "bg-accent text-background shadow-md shadow-accent/20"
              : "text-muted hover:text-foreground bg-surface border border-border"
          }`}
        >
          Comment Moderation ({adminData?.comments.length ?? 0})
        </button>

        <button
          onClick={() => setActiveTab("weeks")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === "weeks"
              ? "bg-accent text-background shadow-md shadow-accent/20"
              : "text-muted hover:text-foreground bg-surface border border-border"
          }`}
        >
          Poll Weeks &amp; System Sync
        </button>
      </div>

      {/* TAB 1: USERS & FANBASE */}
      {activeTab === "users" && (
        <div className="space-y-6 animate-fade-in">
          {/* Top Favorite Teams Breakdown */}
          {adminData?.favoriteTeams && adminData.favoriteTeams.length > 0 && (
            <div className="glass-card p-5 sm:p-6 rounded-2xl border border-border/80">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                <span>Most Popular Favorite Teams</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {adminData.favoriteTeams.map((team, index) => {
                  const pct =
                    adminData.stats.totalUsers > 0
                      ? Math.round((team._count.fans / adminData.stats.totalUsers) * 100)
                      : 0;
                  return (
                    <div
                      key={team.id}
                      className="bg-surface p-3 rounded-xl border border-border flex items-center gap-3"
                    >
                      <div className="text-xs font-black text-muted/60 w-4">#{index + 1}</div>
                      <TeamLogo
                        logoUrl={team.logoUrl}
                        name={team.name}
                        shortName={team.shortName}
                        primaryColor={team.primaryColor}
                        size={28}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-foreground truncate">
                          {team.name}
                        </div>
                        <div className="text-[10px] text-muted">
                          {team._count.fans} {team._count.fans === 1 ? "fan" : "fans"} ({pct}%)
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Users Table */}
          <div className="glass-card rounded-2xl border border-border/80 overflow-hidden shadow-xl">
            <div className="p-4 sm:p-5 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface/50">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-foreground">Registered Users Directory</h3>
                <span className="px-2 py-0.5 rounded-full bg-accent/15 text-accent text-[10px] font-bold">
                  {filteredUsers.length} shown
                </span>
              </div>
              <div className="relative w-full sm:w-72">
                <input
                  type="text"
                  placeholder="Search by username, email, or team..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full px-3.5 py-1.5 rounded-xl bg-surface border border-border text-foreground text-xs placeholder:text-muted/60 focus:outline-none focus:border-accent"
                />
                {userSearch && (
                  <button
                    onClick={() => setUserSearch("")}
                    className="absolute right-2.5 top-2 text-muted hover:text-foreground text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border/80 bg-surface/80 text-muted font-semibold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Favorite Team</th>
                    <th className="py-3 px-4 text-center">Ballots</th>
                    <th className="py-3 px-4 text-center">Comments</th>
                    <th className="py-3 px-4 text-right">Joined Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-muted text-xs">
                        No users match your search query.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-surface/60 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-accent/20 border border-accent/40 text-accent flex items-center justify-center font-bold text-[11px] shrink-0">
                              {u.username.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-foreground flex items-center gap-1.5">
                                <span>@{u.username}</span>
                                {u.role === "ADMIN" && (
                                  <span className="px-1.5 py-0.2 rounded bg-amber-500/20 border border-amber-500/40 text-[9px] font-bold text-amber-400 uppercase">
                                    Admin
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-muted/70 font-mono">{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          {u.favoriteTeam ? (
                            <div className="flex items-center gap-2">
                              <TeamLogo
                                logoUrl={u.favoriteTeam.logoUrl}
                                name={u.favoriteTeam.name}
                                shortName={u.favoriteTeam.shortName}
                                primaryColor={u.favoriteTeam.primaryColor}
                                size={18}
                              />
                              <span className="font-medium text-foreground">
                                {u.favoriteTeam.name}
                              </span>
                              <span className="text-[10px] text-muted">
                                ({u.favoriteTeam.conference})
                              </span>
                            </div>
                          ) : (
                            <span className="text-muted/60 italic">None</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${
                              u._count.ballots > 0
                                ? "bg-accent/15 text-accent border border-accent/30"
                                : "text-muted"
                            }`}
                          >
                            {u._count.ballots}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${
                              u._count.comments > 0
                                ? "bg-surface-elevated text-foreground border border-border"
                                : "text-muted"
                            }`}
                          >
                            {u._count.comments}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right text-muted/80 font-mono text-[11px]">
                          {new Date(u.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: COMMENT MODERATION */}
      {activeTab === "comments" && (
        <div className="space-y-6 animate-fade-in">
          {/* Controls Bar */}
          <div className="glass-card p-4 rounded-2xl border border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface/50">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-muted">Filter by Week:</span>
              <select
                value={selectedWeekFilter}
                onChange={(e) => setSelectedWeekFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-surface border border-border text-foreground text-xs font-semibold focus:outline-none focus:border-accent"
              >
                <option value="ALL">All Weeks</option>
                {adminData?.weeks.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.title} ({w._count.comments} comments)
                  </option>
                ))}
              </select>
            </div>

            <div className="relative w-full sm:w-72">
              <input
                type="text"
                placeholder="Search comment content, user..."
                value={commentSearch}
                onChange={(e) => setCommentSearch(e.target.value)}
                className="w-full px-3.5 py-1.5 rounded-xl bg-surface border border-border text-foreground text-xs placeholder:text-muted/60 focus:outline-none focus:border-accent"
              />
              {commentSearch && (
                <button
                  onClick={() => setCommentSearch("")}
                  className="absolute right-2.5 top-2 text-muted hover:text-foreground text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Comments List */}
          <div className="glass-card rounded-2xl border border-border/80 overflow-hidden shadow-xl">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground">
                All Discussions &amp; Fan Replies ({filteredComments.length})
              </h3>
              <p className="text-[11px] text-muted">
                Admin moderation mode: Deleting here permanently removes the comment and any replies.
              </p>
            </div>

            <div className="divide-y divide-border/50">
              {filteredComments.length === 0 ? (
                <div className="p-10 text-center text-muted text-xs">
                  No comments match your search filter.
                </div>
              ) : (
                filteredComments.map((c) => (
                  <div
                    key={c.id}
                    className="p-4 sm:p-5 hover:bg-surface/40 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-4"
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="relative shrink-0">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white shadow-sm"
                          style={{
                            backgroundColor: c.user.favoriteTeam?.primaryColor || "#353b48",
                          }}
                        >
                          {c.user.username.slice(0, 2).toUpperCase()}
                        </div>
                        {c.user.favoriteTeam && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-background border border-border flex items-center justify-center shadow-xs overflow-hidden">
                            <TeamLogo
                              logoUrl={c.user.favoriteTeam.logoUrl}
                              name={c.user.favoriteTeam.name}
                              shortName={c.user.favoriteTeam.shortName}
                              primaryColor={c.user.favoriteTeam.primaryColor}
                              size={12}
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-foreground">
                            @{c.user.username}
                          </span>
                          <span className="text-[10px] text-muted font-mono">({c.user.email})</span>
                          {c.user.favoriteTeam && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-surface border border-border text-[10px] font-bold text-muted">
                              <TeamLogo
                                logoUrl={c.user.favoriteTeam.logoUrl}
                                name={c.user.favoriteTeam.name}
                                shortName={c.user.favoriteTeam.shortName}
                                primaryColor={c.user.favoriteTeam.primaryColor}
                                size={12}
                              />
                              {c.user.favoriteTeam.shortName}
                            </span>
                          )}
                          <span className="px-2 py-0.2 rounded-md bg-accent/10 border border-accent/20 text-accent font-bold text-[10px]">
                            {c.week.title}
                          </span>
                          {c.parentId && (
                            <span className="text-[10px] text-muted italic">↳ Reply</span>
                          )}
                          <span className="text-[10px] text-muted/60">
                            · {new Date(c.createdAt).toLocaleString()}
                          </span>
                        </div>

                        <p className="text-xs sm:text-sm text-foreground/90 mt-2 bg-surface/60 p-3 rounded-xl border border-border/50 break-words font-sans">
                          {c.content}
                        </p>

                        <div className="flex items-center gap-3 mt-2 text-[11px] text-muted font-semibold">
                          <span className="flex items-center gap-1">
                            <svg className="w-3 h-3 text-rose-500 fill-rose-500" viewBox="0 0 24 24">
                              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                            </svg>
                            <span>{c._count.likes} likes</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="w-3 h-3 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <span>{c._count.replies} replies</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
                      <button
                        onClick={() => handleDeleteComment(c.id)}
                        disabled={deletingCommentId === c.id}
                        className="px-3 py-1.5 rounded-lg bg-danger/15 border border-danger/30 text-danger hover:bg-danger/25 text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1.5"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span>{deletingCommentId === c.id ? "Deleting..." : "Delete Comment"}</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: WEEKS & SYSTEM CONTROLS */}
      {activeTab === "weeks" && (
        <div className="space-y-6 animate-fade-in">
          {/* Controls Bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* ESPN Sync Trigger Card */}
            <div className="glass-card p-5 rounded-2xl border border-border/80 flex flex-col justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Live ESPN Records Sync</span>
                </h3>
                <p className="text-xs text-muted mt-1">
                  Fetch official records and rankings from ESPN for all 138 FBS teams.
                </p>
              </div>

              <button
                onClick={handleSyncRecords}
                disabled={isSyncing}
                className="px-4 py-2.5 rounded-xl bg-accent text-background font-bold text-xs hover:bg-accent-glow transition-all disabled:opacity-50 shrink-0 self-start shadow-md"
              >
                {isSyncing ? "Syncing with ESPN..." : "Sync ESPN Records Now"}
              </button>
            </div>

            {/* Auto-Advance / Publish Check */}
            <div className="glass-card p-5 rounded-2xl border border-border/80 flex flex-col justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Auto-Advance Expired Polls</span>
                </h3>
                <p className="text-xs text-muted mt-1">
                  Check all deadlines and finalize consensus rankings for any voting window that has ended.
                </p>
              </div>

              <button
                onClick={handleAdvanceWeeks}
                disabled={isSyncing}
                className="px-4 py-2.5 rounded-xl bg-surface-elevated text-foreground hover:text-accent font-bold text-xs border border-border hover:border-accent/40 transition-all disabled:opacity-50 shrink-0 self-start shadow-md"
              >
                Check &amp; Advance Weeks
              </button>
            </div>
          </div>

          {syncStatus && (
            <div className="p-3.5 rounded-xl bg-accent/10 border border-accent/25 text-xs font-semibold text-accent flex items-center gap-2 animate-fade-in">
              <svg className="w-4 h-4 shrink-0 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>{syncStatus}</span>
            </div>
          )}

          {/* Weeks Table */}
          <div className="glass-card rounded-2xl border border-border/80 overflow-hidden shadow-xl">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground">Polling Season Schedule &amp; Activity</h3>
              <span className="text-[11px] text-muted font-mono">15 Weeks Scheduled</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border/80 bg-surface/80 text-muted font-semibold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Week Title</th>
                    <th className="py-3 px-4">Week #</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-center">Total Ballots</th>
                    <th className="py-3 px-4 text-center">Total Comments</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {adminData?.weeks.map((w) => (
                    <tr key={w.id} className="hover:bg-surface/60 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-foreground">{w.title}</td>
                      <td className="py-3.5 px-4 font-mono text-muted">{w.weekNumber}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            w.status === "PUBLISHED"
                              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                              : w.status === "OPEN"
                              ? "bg-accent/15 text-accent border border-accent/30 animate-pulse"
                              : "bg-surface text-muted border border-border"
                          }`}
                        >
                          {w.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold tabular-nums text-foreground">
                        {w._count.ballots}
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold tabular-nums text-foreground">
                        {w._count.comments}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {w.status !== "PUBLISHED" && (
                            <button
                              type="button"
                              onClick={() => handleUpdateWeekStatus(w.id, "PUBLISHED")}
                              disabled={weekActionLoading === w.id}
                              className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 border border-emerald-500/30 text-[10px] font-bold transition-all disabled:opacity-50"
                            >
                              Publish
                            </button>
                          )}
                          {w.status !== "OPEN" && (
                            <button
                              type="button"
                              onClick={() => handleUpdateWeekStatus(w.id, "OPEN")}
                              disabled={weekActionLoading === w.id}
                              className="px-2.5 py-1 rounded-lg bg-accent/15 text-accent hover:bg-accent/25 border border-accent/30 text-[10px] font-bold transition-all disabled:opacity-50"
                            >
                              Open
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRecalculateConsensus(w.id)}
                            disabled={weekActionLoading === w.id}
                            className="px-2.5 py-1 rounded-lg bg-surface text-muted hover:text-foreground border border-border text-[10px] font-semibold transition-all disabled:opacity-50"
                            title="Recalculate consensus scores from all submitted ballots"
                          >
                            Recalc
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

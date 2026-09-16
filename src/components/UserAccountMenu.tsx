"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "./AuthProvider";
import { TeamLogo } from "./TeamLogo";
import Link from "next/link";

interface TeamOption {
  id: string;
  name: string;
  shortName: string;
  conference: string;
  logoUrl?: string | null;
  primaryColor?: string | null;
}

// Generate consistent avatar gradient from username
function getAvatarGradient(username: string) {
  const gradients = [
    "from-amber-500 to-red-600",
    "from-purple-500 to-indigo-600",
    "from-emerald-500 to-teal-700",
    "from-blue-500 to-cyan-600",
    "from-pink-500 to-rose-600",
    "from-orange-500 to-amber-600",
  ];
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % gradients.length;
  return gradients[index];
}

export function UserAccountMenu() {
  const { user, logout, updateUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Modals state
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // Teams list for modal
  const [teams, setTeams] = useState<TeamOption[]>([]);
  const [teamSearch, setTeamSearch] = useState("");
  const [selectedConference, setSelectedConference] = useState("ALL");
  const [selectedTeamId, setSelectedTeamId] = useState<string>("");
  const [isSavingTeam, setIsSavingTeam] = useState(false);
  const [teamError, setTeamError] = useState("");
  const [teamSuccess, setTeamSuccess] = useState("");

  // Password modal state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
        setIsTeamModalOpen(false);
        setIsPasswordModalOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Fetch teams when team modal opens
  useEffect(() => {
    if (isTeamModalOpen && teams.length === 0) {
      fetch("/api/teams")
        .then((res) => res.json())
        .then((data) => {
          if (data.teams) {
            setTeams(data.teams);
          }
        })
        .catch(console.error);
    }
    if (isTeamModalOpen && user?.favoriteTeam) {
      setSelectedTeamId(user.favoriteTeam.id);
    }
  }, [isTeamModalOpen, teams.length, user?.favoriteTeam]);

  if (!user) return null;

  const isAdmin =
    user.role === "ADMIN" || user.email.toLowerCase() === "kehlerjacob@gmail.com";
  const initials = user.username.slice(0, 2).toUpperCase();
  const avatarGrad = getAvatarGradient(user.username);

  const hasTeamColor = !!user.favoriteTeam?.primaryColor;
  const avatarStyle = hasTeamColor ? { backgroundColor: user.favoriteTeam!.primaryColor! } : undefined;

  // Handle Save Team
  const handleSaveTeam = async () => {
    if (!selectedTeamId) return;
    setIsSavingTeam(true);
    setTeamError("");
    setTeamSuccess("");

    try {
      const res = await fetch("/api/auth/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "CHANGE_TEAM",
          favoriteTeamId: selectedTeamId,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setTeamError(data.error || "Failed to update team");
        return;
      }

      updateUser({ favoriteTeam: data.user.favoriteTeam });
      setTeamSuccess(data.message || "Favorite team updated!");
      setTimeout(() => {
        setIsTeamModalOpen(false);
        setTeamSuccess("");
      }, 1200);
    } catch {
      setTeamError("Network error updating favorite team");
    } finally {
      setIsSavingTeam(false);
    }
  };

  // Handle Save Password
  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      setPasswordError("All fields are required");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    setIsSavingPassword(true);
    setPasswordError("");
    setPasswordSuccess("");

    try {
      const res = await fetch("/api/auth/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "CHANGE_PASSWORD",
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setPasswordError(data.error || "Failed to update password");
        return;
      }

      setPasswordSuccess("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        setIsPasswordModalOpen(false);
        setPasswordSuccess("");
      }, 1500);
    } catch {
      setPasswordError("Network error changing password");
    } finally {
      setIsSavingPassword(false);
    }
  };

  // Unique conferences
  const conferences = ["ALL", ...Array.from(new Set(teams.map((t) => t.conference))).sort()];

  // Filtered teams for modal
  const filteredTeams = teams.filter((t) => {
    const matchesConf = selectedConference === "ALL" || t.conference === selectedConference;
    const query = teamSearch.toLowerCase();
    const matchesSearch =
      !query ||
      t.name.toLowerCase().includes(query) ||
      t.shortName.toLowerCase().includes(query);
    return matchesConf && matchesSearch;
  });

  return (
    <div className="relative" ref={menuRef}>
      {/* User Avatar Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full bg-surface border border-border hover:border-accent/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/30 group"
        aria-label="User Account Menu"
        aria-expanded={isOpen}
      >
        <div className="relative">
          {/* Avatar circle */}
          <div
            className={`w-7 h-7 rounded-full ${hasTeamColor ? '' : `bg-gradient-to-tr ${avatarGrad}`} flex items-center justify-center text-white text-xs font-black shrink-0 shadow-sm`}
            style={avatarStyle}
          >
            {initials}
          </div>

          {/* Micro team logo badge */}
          {user.favoriteTeam && (
            <div className="absolute -bottom-1.5 -right-1.5 w-5 h-5 rounded-full bg-background border border-border flex items-center justify-center shadow-xs overflow-hidden">
              <TeamLogo
                logoUrl={user.favoriteTeam.logoUrl}
                name={user.favoriteTeam.name}
                shortName={user.favoriteTeam.shortName}
                primaryColor={user.favoriteTeam.primaryColor}
                size={16}
              />
            </div>
          )}
        </div>

        {/* Username & Chevron */}
        <span className="hidden sm:inline text-xs font-bold text-foreground group-hover:text-accent transition-colors max-w-[100px] truncate">
          {user.username}
        </span>

        <svg
          className={`w-3.5 h-3.5 text-muted transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-[#141822] border border-[#2d3748] shadow-2xl shadow-black/80 p-2.5 z-50 animate-fade-in origin-top-right">
          {/* User Header Info Card */}
          <div className="p-3 rounded-xl bg-[#1c2230] border border-border/80 mb-2">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-9 h-9 rounded-full ${hasTeamColor ? '' : `bg-gradient-to-tr ${avatarGrad}`} flex items-center justify-center text-white text-sm font-black shrink-0 shadow-sm`}
                style={avatarStyle}
              >
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-bold text-foreground truncate">
                    @{user.username}
                  </span>
                  {isAdmin && (
                    <span className="px-1.5 py-0.2 rounded bg-amber-500/20 border border-amber-500/40 text-[9px] font-bold text-amber-400 uppercase">
                      Admin
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-muted truncate font-mono">{user.email}</div>
              </div>
            </div>

            {/* Current Favorite Team Pill */}
            {user.favoriteTeam && (
              <div className="mt-2.5 pt-2 border-t border-border/50 flex items-center justify-between text-[11px]">
                <span className="text-muted">Favorite Team:</span>
                <span className="inline-flex items-center gap-1 font-bold text-foreground">
                  <TeamLogo
                    logoUrl={user.favoriteTeam.logoUrl}
                    name={user.favoriteTeam.name}
                    shortName={user.favoriteTeam.shortName}
                    primaryColor={user.favoriteTeam.primaryColor}
                    size={14}
                  />
                  <span>{user.favoriteTeam.shortName}</span>
                </span>
              </div>
            )}
          </div>

          {/* Menu Items */}
          <div className="space-y-1 text-xs">
            {/* Admin Dashboard */}
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-amber-400 hover:bg-amber-500/10 font-bold transition-colors"
              >
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Admin Dashboard</span>
              </Link>
            )}

            {/* Change Favorite Team */}
            <button
              onClick={() => {
                setIsOpen(false);
                setIsTeamModalOpen(true);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-foreground hover:bg-surface-elevated hover:text-accent font-semibold transition-colors text-left"
            >
              <svg className="w-4 h-4 text-muted group-hover:text-accent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              <span>Change Favorite Team</span>
            </button>

            {/* Change Password */}
            <button
              onClick={() => {
                setIsOpen(false);
                setIsPasswordModalOpen(true);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-foreground hover:bg-surface-elevated hover:text-accent font-semibold transition-colors text-left"
            >
              <svg className="w-4 h-4 text-muted group-hover:text-accent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Change Password</span>
            </button>

            {/* Submit Ballot shortcut */}
            <Link
              href="/ballot"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-foreground hover:bg-surface-elevated hover:text-accent font-semibold transition-colors"
            >
              <svg className="w-4 h-4 text-muted group-hover:text-accent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              <span>My Ballot Builder</span>
            </Link>

            <div className="my-1 border-t border-border/60" />

            {/* Log Out */}
            <button
              onClick={() => {
                setIsOpen(false);
                logout();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-danger hover:bg-danger/10 font-bold transition-colors text-left"
            >
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Log Out</span>
            </button>
          </div>
        </div>
      )}

      {/* MODAL 1: CHANGE FAVORITE TEAM (Rendered in Portal directly on body) */}
      {mounted && isTeamModalOpen && createPortal(
        <div className="fixed inset-0 z-[9999] overflow-y-auto bg-black/80 backdrop-blur-md p-4 flex min-h-screen items-center justify-center animate-fade-in">
          {/* Backdrop overlay click to close */}
          <div className="fixed inset-0" onClick={() => setIsTeamModalOpen(false)} />

          <div className="relative bg-[#161a22] max-w-lg w-full max-h-[90vh] flex flex-col rounded-2xl border border-border shadow-2xl overflow-hidden animate-scale-up z-10 my-auto">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-border flex items-center justify-between shrink-0 bg-[#161a22]">
              <div>
                <h2 className="text-base font-bold text-foreground">
                  Change Favorite Team
                </h2>
                <p className="text-xs text-muted mt-0.5">
                  Select your primary FBS college football team to display next to your comments.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsTeamModalOpen(false)}
                className="p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-surface-elevated text-sm transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Filter / Search bar */}
            <div className="p-3 border-b border-border/60 bg-[#1c2029] space-y-2 shrink-0">
              <input
                type="text"
                placeholder="Search teams (e.g. Georgia, Michigan, Oregon)..."
                value={teamSearch}
                onChange={(e) => setTeamSearch(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#161a22] border border-border text-foreground text-xs placeholder:text-muted/60 focus:outline-none focus:border-accent"
                autoFocus
              />

              {/* Conference chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] no-scrollbar">
                {conferences.map((conf) => (
                  <button
                    key={conf}
                    type="button"
                    onClick={() => setSelectedConference(conf)}
                    className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition-all ${
                      selectedConference === conf
                        ? "bg-accent text-background"
                        : "bg-[#161a22] text-muted hover:text-foreground border border-border"
                    }`}
                  >
                    {conf}
                  </button>
                ))}
              </div>
            </div>

            {/* Teams Grid */}
            <div className="flex-1 overflow-y-auto p-3 min-h-[180px] max-h-[48vh] grid grid-cols-1 sm:grid-cols-2 gap-2 bg-[#12151c]">
              {filteredTeams.length === 0 ? (
                <div className="col-span-full py-8 text-center text-xs text-muted">
                  No FBS teams found matching &quot;{teamSearch}&quot;.
                </div>
              ) : (
                filteredTeams.map((t) => {
                  const isSelected = selectedTeamId === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setSelectedTeamId(t.id)}
                      className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? "bg-accent/15 border-accent text-foreground shadow-xs"
                          : "bg-[#161a22] border-border hover:border-accent/40 text-muted hover:text-foreground"
                      }`}
                    >
                      <TeamLogo
                        logoUrl={t.logoUrl}
                        name={t.name}
                        shortName={t.shortName}
                        primaryColor={t.primaryColor}
                        size={24}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold truncate text-foreground">{t.name}</div>
                        <div className="text-[10px] text-muted">{t.conference}</div>
                      </div>
                      {isSelected && (
                        <span className="text-accent text-xs font-bold shrink-0">✓</span>
                      )}
                    </button>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-border bg-[#161a22] flex items-center justify-between gap-3 shrink-0">
              <div>
                {teamError && <p className="text-xs text-danger font-medium">{teamError}</p>}
                {teamSuccess && <p className="text-xs text-success font-bold">{teamSuccess}</p>}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsTeamModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl border border-border text-muted hover:text-foreground text-xs font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveTeam}
                  disabled={!selectedTeamId || isSavingTeam}
                  className="px-4 py-1.5 rounded-xl bg-accent text-background font-bold text-xs hover:bg-accent-glow transition-all disabled:opacity-50"
                >
                  {isSavingTeam ? "Saving..." : "Save Favorite Team"}
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* MODAL 2: CHANGE PASSWORD (Rendered in Portal directly on body) */}
      {mounted && isPasswordModalOpen && createPortal(
        <div className="fixed inset-0 z-[9999] overflow-y-auto bg-black/80 backdrop-blur-md p-4 flex min-h-screen items-center justify-center animate-fade-in">
          {/* Backdrop overlay click to close */}
          <div className="fixed inset-0" onClick={() => setIsPasswordModalOpen(false)} />

          <div className="relative bg-[#161a22] max-w-md w-full max-h-[90vh] flex flex-col rounded-2xl border border-border shadow-2xl overflow-hidden animate-scale-up z-10 my-auto">
            <div className="p-4 sm:p-5 border-b border-border flex items-center justify-between shrink-0 bg-[#161a22]">
              <h2 className="text-base font-bold text-foreground">
                Change Password
              </h2>
              <button
                type="button"
                onClick={() => setIsPasswordModalOpen(false)}
                className="p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-surface-elevated text-sm transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePassword} className="p-4 sm:p-5 space-y-3.5 overflow-y-auto bg-[#161a22]">
              <div>
                <label className="block text-xs font-semibold text-muted mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter your current password"
                  required
                  className="w-full px-3.5 py-2 rounded-xl bg-[#1c2029] border border-border text-foreground text-xs placeholder:text-muted/60 focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted mb-1">
                  New Password (min 6 characters)
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  minLength={6}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#1c2029] border border-border text-foreground text-xs placeholder:text-muted/60 focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                  minLength={6}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#1c2029] border border-border text-foreground text-xs placeholder:text-muted/60 focus:outline-none focus:border-accent"
                />
              </div>

              {passwordError && (
                <p className="text-xs text-danger font-medium">{passwordError}</p>
              )}
              {passwordSuccess && (
                <p className="text-xs text-success font-bold">{passwordSuccess}</p>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl border border-border text-muted hover:text-foreground text-xs font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingPassword}
                  className="px-4 py-1.5 rounded-xl bg-accent text-background font-bold text-xs hover:bg-accent-glow transition-all disabled:opacity-50"
                >
                  {isSavingPassword ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

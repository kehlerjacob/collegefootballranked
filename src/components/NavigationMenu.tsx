"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "./AuthProvider";

export function NavigationMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { user } = useAuth();

  const isAdmin =
    user &&
    (user.role === "ADMIN" || user.email?.toLowerCase() === "kehlerjacob@gmail.com");

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown on escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const navItems = [
    {
      title: "Top 25 Rankings",
      description: "Official weekly consensus poll",
      href: "/",
      isActive: pathname === "/",
      badge: null,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      title: "Ballot Builder",
      description: "Create & submit your Top 25 ballot",
      href: "/ballot",
      isActive: pathname === "/ballot",
      badge: "LIVE",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
    },
  ];

  if (isAdmin) {
    navItems.push({
      title: "Admin Dashboard",
      description: "Manage poll weeks & users",
      href: "/admin",
      isActive: pathname === "/admin",
      badge: "ADMIN",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    });
  }

  return (
    <div className="relative" ref={menuRef}>
      {/* Menu Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all duration-200 ${
          isOpen
            ? "bg-accent/15 border-accent text-accent shadow-xs"
            : "bg-surface border-border hover:border-accent/40 text-foreground hover:text-accent"
        }`}
        aria-label="Navigation Menu"
        aria-expanded={isOpen}
      >
        <svg
          className="w-4 h-4 shrink-0 transition-transform duration-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
        <span>Menu</span>
        <svg
          className={`w-3 h-3 text-muted transition-transform duration-200 ${
            isOpen ? "rotate-180 text-accent" : ""
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
        <div className="absolute right-0 mt-2 w-64 sm:w-72 rounded-2xl bg-[#141822] border border-[#2d3748] shadow-2xl shadow-black/80 p-2 z-[100] animate-fade-in origin-top-right">
          <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-muted/70">
            Navigation
          </div>

          <div className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-start gap-3 p-2.5 rounded-xl transition-all duration-150 ${
                  item.isActive
                    ? "bg-accent/15 border border-accent/40 text-accent font-bold shadow-xs"
                    : "hover:bg-surface-elevated text-foreground hover:text-accent border border-transparent"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    item.isActive
                      ? "bg-accent text-background font-bold shadow-sm"
                      : "bg-surface text-muted"
                  }`}
                >
                  {item.icon}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-bold leading-tight truncate">
                      {item.title}
                    </span>
                    {item.badge && (
                      <span
                        className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase leading-none shrink-0 ${
                          item.badge === "LIVE"
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-muted leading-tight mt-0.5 truncate">
                    {item.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Quick Footer inside Dropdown */}
          <div className="mt-2 pt-2 border-t border-border/50 px-3 py-1 flex items-center justify-between text-[10px] text-muted/60 font-mono">
            <span>CollegeFootballRanked</span>
            <span>2026 Season</span>
          </div>
        </div>
      )}
    </div>
  );
}

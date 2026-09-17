"use client";

import { useState } from "react";

export function MethodologyDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-4 rounded-lg border border-border/70 bg-surface/40 backdrop-blur-xs overflow-hidden transition-all duration-200">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-surface-elevated/60 transition-colors cursor-pointer"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div>
            <span className="text-xs font-bold text-foreground block">
              Ranking Methodology & Point Calculation
            </span>
            <span className="text-[11px] text-muted block">
              How the community consensus Top 25 poll is tabulated
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-accent hidden sm:inline">
            {isOpen ? "Hide details" : "Learn how it works"}
          </span>
          <svg
            className={`w-4 h-4 text-muted transition-transform duration-200 ${
              isOpen ? "rotate-180 text-accent" : ""
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
        </div>
      </button>

      {isOpen && (
        <div className="px-4 pb-4 pt-2 border-t border-border/40 text-xs text-foreground/90 space-y-3.5 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3 rounded-md bg-surface/70 border border-border/50">
              <h4 className="font-bold text-accent mb-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                Standard AP Point Scale
              </h4>
              <p className="text-[11px] text-muted leading-relaxed">
                Rankings use the classic collegiate voting system: a <strong>#1 vote awards 25 points</strong>, #2 awards 24 points, down to <strong>#25 awarding 1 point</strong>.
              </p>
            </div>

            <div className="p-3 rounded-md bg-surface/70 border border-border/50">
              <h4 className="font-bold text-accent mb-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                Consensus Aggregation
              </h4>
              <p className="text-[11px] text-muted leading-relaxed">
                Every verified user ballot submitted before the weekly deadline is combined to generate the democratic consensus ranking.
              </p>
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <h4 className="font-bold text-foreground text-xs">Official Tie-Breaking Hierarchy</h4>
            <ol className="list-decimal list-inside text-[11px] text-muted space-y-1 pl-1">
              <li><strong>Total Points:</strong> Sum of all weighted points across all submitted ballots.</li>
              <li><strong>First-Place Votes:</strong> If points are tied, the team with more #1 rank selections wins the tiebreaker.</li>
              <li><strong>Ballot Appearances:</strong> If still tied, the team included on a greater total number of ballots ranks higher.</li>
            </ol>
          </div>

          <div className="p-2.5 rounded-md bg-accent/5 border border-accent/20 text-[11px] text-muted flex items-start gap-2">
            <svg className="w-4 h-4 text-accent shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>
              <strong>Weekly Voting Schedule:</strong> Polls open every Sunday after all Saturday games finish and lock every <strong>Wednesday at 12:00 PM EST</strong> when consensus results are finalized and published.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";

export interface FAQItem {
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: "How are the College Football Ranked consensus rankings calculated?",
    answer:
      "Our consensus poll utilizes the standard AP Poll scoring formula where rank 1 equals 25 points, rank 2 equals 24 points, down to rank 25 receiving 1 point. Every verified user ballot submitted before the weekly deadline is tabulated into a total aggregate point score. Teams are sorted primarily by total points, followed by first-place votes and total ballot appearances as official tie-breakers.",
  },
  {
    question: "When are new college football rankings released each week?",
    answer:
      "Community voting opens every Sunday morning following Saturday's slate of games. The voting window remains active until Wednesday at 12:00 PM EST (16:00 UTC), at which point the final consensus Top 25 poll is materialized, published, and archived for the week.",
  },
  {
    question: "How is this poll different from the AP Top 25 and Coaches Poll?",
    answer:
      "While traditional polls like the AP Top 25 rely on a select panel of 62 sports writers and the Coaches Poll relies on head coaches, College Football Ranked aggregates thousands of dedicated fans, analysts, and students across the country. This eliminates regional bias and provides an authentic, democratic pulse of who the top college football teams in the country truly are.",
  },
  {
    question: "How do I submit my own Top 25 ballot and vote for my team?",
    answer:
      "To vote, create a free account or sign in, navigate to the 'Submit Ballot' page, and select your Top 25 teams in order from #1 through #25 using our drag-and-drop or search selector. You can update and revise your ballot as many times as you like until the Wednesday deadline locks.",
  },
  {
    question: "What do the numbers in parentheses next to team names mean?",
    answer:
      "The number displayed in gold parentheses, such as (724), indicates the total number of official first-place (#1 rank) votes that team received across all submitted ballots for that specific week.",
  },
  {
    question: "Can I view previous weeks' historical college football rankings?",
    answer:
      "Yes! You can use the week selector pills at the top of the page to browse past weeks all the way back to Week 0 (Preseason). Each week features its archived Top 25 rankings, first-place vote counts, point totals, trend movements, and discussion comments.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section aria-labelledby="faq-heading" className="mt-10 mb-6">
      <div className="glass-card rounded-lg p-5 sm:p-6 border border-border/70 shadow-xl">
        <div className="flex items-center gap-2.5 pb-4 border-b border-border/50">
          <div className="w-7 h-7 rounded-md bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <h2 id="faq-heading" className="text-base sm:text-lg font-bold text-foreground">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-muted">
              Everything you need to know about our college football rankings and voting
            </p>
          </div>
        </div>

        <div className="divide-y divide-border/40 mt-2">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index} className="py-3.5 first:pt-2 last:pb-0">
                <button
                  type="button"
                  onClick={() => toggleItem(index)}
                  className="w-full flex items-center justify-between gap-4 text-left group cursor-pointer focus:outline-hidden"
                  aria-expanded={isOpen}
                >
                  <span className="text-xs sm:text-sm font-semibold text-foreground/90 group-hover:text-accent transition-colors">
                    {item.question}
                  </span>
                  <div
                    className={`shrink-0 w-5 h-5 rounded-full border border-border/60 flex items-center justify-center text-muted group-hover:border-accent group-hover:text-accent transition-all ${
                      isOpen ? "rotate-180 bg-accent/10 border-accent text-accent" : ""
                    }`}
                  >
                    <svg
                      className="w-3 h-3"
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
                  <div className="mt-2 text-xs text-muted leading-relaxed pr-6 animate-fade-in">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

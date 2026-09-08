"use client";

import { useState } from "react";

const WEEKS = Array.from({ length: 15 }, (_, i) => `Week ${i + 1}`);

export function WeekSelector() {
  const [selected, setSelected] = useState(2);

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
      {WEEKS.slice(0, 6).map((week, i) => (
        <button
          key={week}
          onClick={() => setSelected(i)}
          className={`shrink-0 px-3 py-1.5 text-xs font-medium rounded-full border transition-all duration-200 ${
            selected === i
              ? "bg-accent text-background border-accent shadow-[0_0_12px_rgba(201,168,76,0.25)]"
              : "border-border text-muted hover:text-foreground hover:border-border-light"
          }`}
        >
          {week}
        </button>
      ))}
      <button className="shrink-0 px-3 py-1.5 text-xs font-medium rounded-full border border-border text-muted hover:text-foreground hover:border-border-light transition-all duration-200">
        All →
      </button>
    </div>
  );
}

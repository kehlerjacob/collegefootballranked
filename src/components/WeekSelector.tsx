"use client";

export interface WeekItem {
  id: string;
  weekNumber: number;
  title: string;
  status: string;
  votingDeadline?: string | null;
}

interface WeekSelectorProps {
  weeks: WeekItem[];
  selectedWeekNumber: number;
  onSelectWeek: (weekNumber: number) => void;
}

export function WeekSelector({
  weeks,
  selectedWeekNumber,
  onSelectWeek,
}: WeekSelectorProps) {
  const visibleWeeks = (weeks || []).filter((w) => w.status !== "UPCOMING");
  if (visibleWeeks.length === 0) return null;

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
      {visibleWeeks.map((week) => {
        const isSelected = selectedWeekNumber === week.weekNumber;
        return (
          <button
            key={week.id}
            onClick={() => onSelectWeek(week.weekNumber)}
            className={`shrink-0 px-3 py-1.5 text-xs font-medium rounded-full border transition-all duration-200 flex items-center gap-1.5 ${
              isSelected
                ? "bg-accent text-background border-accent shadow-[0_0_12px_rgba(201,168,76,0.25)] font-bold"
                : "border-border text-muted hover:text-foreground hover:border-border-light"
            }`}
          >
            <span>{week.title}</span>
            {week.status === "OPEN" && (
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isSelected ? "bg-background" : "bg-success"
                }`}
                title="Voting Open"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

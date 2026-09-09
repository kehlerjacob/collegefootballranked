import type { TeamData } from "./RankingsTable";
import { TeamLogo } from "./TeamLogo";

function RankBadge({ rank }: { rank: number }) {
  const colors: Record<number, string> = {
    1: "bg-rank-gold/15 text-rank-gold border border-rank-gold/30",
    2: "bg-rank-silver/15 text-rank-silver border border-rank-silver/30",
    3: "bg-rank-bronze/15 text-rank-bronze border border-rank-bronze/30",
  };

  return (
    <span
      className={`rank-badge ${
        colors[rank] ?? "bg-surface text-muted border border-border"
      }`}
    >
      {rank}
    </span>
  );
}

function TrendIndicator({
  trend,
  value,
}: {
  trend: TeamData["trend"];
  value?: number;
}) {
  if (trend === "same") {
    return (
      <span className="inline-flex items-center text-[10px] text-muted">—</span>
    );
  }

  if (trend === "new") {
    return (
      <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-accent">
        NEW
      </span>
    );
  }

  if (trend === "up") {
    return (
      <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-success">
        <svg
          width="8"
          height="8"
          viewBox="0 0 8 8"
          fill="none"
          className="shrink-0"
        >
          <path d="M4 1L7 5H1L4 1Z" fill="currentColor" />
        </svg>
        {value}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-danger">
      <svg
        width="8"
        height="8"
        viewBox="0 0 8 8"
        fill="none"
        className="shrink-0"
      >
        <path d="M4 7L1 3H7L4 7Z" fill="currentColor" />
      </svg>
      {value}
    </span>
  );
}

export function RankRow({ team, index }: { team: TeamData; index: number }) {
  const stagger = Math.min(index + 1, 10);
  const initials =
    team.shortName || team.name.slice(0, 3).toUpperCase();

  return (
    <div
      className={`group grid grid-cols-[2.5rem_1fr_3.5rem_4rem] sm:grid-cols-[2.5rem_1fr_4.5rem_3.5rem_4.5rem] items-center px-4 py-3 hover:bg-surface-hover transition-colors duration-150 animate-slide-in stagger-${stagger}`}
    >
      {/* Rank */}
      <div>
        <RankBadge rank={team.rank} />
      </div>

      {/* Team name + trend */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Team logo badge */}
        <TeamLogo
          logoUrl={team.logoUrl}
          name={team.name}
          shortName={team.shortName}
          primaryColor={team.primaryColor}
          size={36}
        />
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-sm font-semibold truncate group-hover:text-accent transition-colors duration-150">
              {team.name}
            </p>
            {team.firstPlaceVotes && team.firstPlaceVotes > 0 ? (
              <span className="text-[10px] font-bold text-rank-gold">
                ({team.firstPlaceVotes})
              </span>
            ) : null}
          </div>
          <div className="flex items-center gap-1.5 sm:hidden">
            <span className="text-[10px] text-muted">{team.conference}</span>
            <TrendIndicator trend={team.trend} value={team.trendValue} />
          </div>
        </div>
      </div>

      {/* Conference — desktop only */}
      <div className="hidden sm:flex items-center justify-center gap-1.5">
        <span className="text-xs text-muted">{team.conference}</span>
        <TrendIndicator trend={team.trend} value={team.trendValue} />
      </div>

      {/* Record */}
      <span className="text-xs text-center font-mono tabular-nums text-foreground/80">
        {team.record}
      </span>

      {/* Points */}
      <span className="text-xs text-right font-mono tabular-nums font-semibold text-foreground">
        {team.points.toLocaleString()}
      </span>
    </div>
  );
}

interface StatsBarProps {
  totalVotes: number;
  totalBallots: number;
  status: string;
}

export function StatsBar({
  totalVotes,
  totalBallots,
  status,
}: StatsBarProps) {
  const stats = [
    { label: "Total Points", value: totalVotes.toLocaleString() },
    { label: "Ballots Submitted", value: totalBallots.toLocaleString() },
    {
      label: "Poll Status",
      value:
        status === "PUBLISHED"
          ? "Official"
          : status === "OPEN"
          ? "Voting Open"
          : status,
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-2">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="glass-card rounded-xl px-3 py-2.5 text-center"
        >
          <p className="text-base font-bold text-foreground tabular-nums truncate">
            {stat.value}
          </p>
          <p className="text-[10px] text-muted uppercase tracking-wider mt-0.5 truncate">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}

export function StatsBar() {
  const stats = [
    { label: "Total Votes", value: "4,218" },
    { label: "Ballots", value: "312" },
    { label: "Last Updated", value: "2h ago" },
  ];

  return (
    <div className="grid grid-cols-3 gap-2">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="glass-card rounded-xl px-3 py-2.5 text-center"
        >
          <p className="text-base font-bold text-foreground tabular-nums">
            {stat.value}
          </p>
          <p className="text-[10px] text-muted uppercase tracking-wider mt-0.5">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}

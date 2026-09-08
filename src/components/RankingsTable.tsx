import { RankRow } from "./RankRow";

export type TeamData = {
  rank: number;
  name: string;
  conference: string;
  record: string;
  points: number;
  trend: "up" | "down" | "same" | "new";
  trendValue?: number;
};

const PLACEHOLDER_TEAMS: TeamData[] = [
  { rank: 1, name: "Georgia", conference: "SEC", record: "3-0", points: 1547, trend: "same" },
  { rank: 2, name: "Ohio State", conference: "Big Ten", record: "3-0", points: 1498, trend: "up", trendValue: 1 },
  { rank: 3, name: "Texas", conference: "SEC", record: "3-0", points: 1452, trend: "down", trendValue: 1 },
  { rank: 4, name: "Oregon", conference: "Big Ten", record: "3-0", points: 1389, trend: "up", trendValue: 2 },
  { rank: 5, name: "Alabama", conference: "SEC", record: "3-0", points: 1301, trend: "same" },
  { rank: 6, name: "Ole Miss", conference: "SEC", record: "3-0", points: 1256, trend: "up", trendValue: 3 },
  { rank: 7, name: "Michigan", conference: "Big Ten", record: "2-1", points: 1198, trend: "down", trendValue: 2 },
  { rank: 8, name: "Penn State", conference: "Big Ten", record: "3-0", points: 1134, trend: "up", trendValue: 1 },
  { rank: 9, name: "Florida State", conference: "ACC", record: "2-1", points: 1067, trend: "down", trendValue: 4 },
  { rank: 10, name: "USC", conference: "Big Ten", record: "3-0", points: 1012, trend: "up", trendValue: 2 },
  { rank: 11, name: "LSU", conference: "SEC", record: "2-1", points: 978, trend: "down", trendValue: 1 },
  { rank: 12, name: "Utah", conference: "Big 12", record: "3-0", points: 923, trend: "up", trendValue: 3 },
  { rank: 13, name: "Notre Dame", conference: "Ind.", record: "3-0", points: 889, trend: "same" },
  { rank: 14, name: "Tennessee", conference: "SEC", record: "3-0", points: 845, trend: "up", trendValue: 2 },
  { rank: 15, name: "Missouri", conference: "SEC", record: "3-0", points: 798, trend: "new" },
  { rank: 16, name: "Oklahoma", conference: "SEC", record: "2-1", points: 756, trend: "down", trendValue: 3 },
  { rank: 17, name: "Washington", conference: "Big Ten", record: "3-0", points: 712, trend: "up", trendValue: 1 },
  { rank: 18, name: "Kansas State", conference: "Big 12", record: "3-0", points: 667, trend: "up", trendValue: 4 },
  { rank: 19, name: "Clemson", conference: "ACC", record: "2-1", points: 623, trend: "down", trendValue: 2 },
  { rank: 20, name: "Miami (FL)", conference: "ACC", record: "3-0", points: 589, trend: "new" },
  { rank: 21, name: "Colorado", conference: "Big 12", record: "3-0", points: 534, trend: "up", trendValue: 5 },
  { rank: 22, name: "Arizona", conference: "Big 12", record: "2-1", points: 498, trend: "down", trendValue: 1 },
  { rank: 23, name: "NC State", conference: "ACC", record: "3-0", points: 456, trend: "up", trendValue: 2 },
  { rank: 24, name: "Iowa", conference: "Big Ten", record: "3-0", points: 412, trend: "same" },
  { rank: 25, name: "Louisville", conference: "ACC", record: "3-0", points: 378, trend: "new" },
];

export function RankingsTable() {
  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      {/* Table header */}
      <div className="grid grid-cols-[2.5rem_1fr_3.5rem_4rem] sm:grid-cols-[2.5rem_1fr_4.5rem_3.5rem_4.5rem] items-center px-4 py-2.5 border-b border-border text-[10px] uppercase tracking-wider text-muted font-semibold">
        <span>#</span>
        <span>Team</span>
        <span className="hidden sm:block text-center">Conf</span>
        <span className="text-center">Rec</span>
        <span className="text-right">Pts</span>
      </div>

      {/* Rows */}
      <div className="divide-y divide-border/50">
        {PLACEHOLDER_TEAMS.map((team, i) => (
          <RankRow key={team.rank} team={team} index={i} />
        ))}
      </div>
    </div>
  );
}

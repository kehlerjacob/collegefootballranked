import { RankRow } from "./RankRow";

export type TeamData = {
  rank: number;
  name: string;
  shortName?: string;
  conference: string;
  record: string;
  points: number;
  firstPlaceVotes?: number;
  trend: "up" | "down" | "same" | "new";
  trendValue?: number;
  primaryColor?: string | null;
  logoUrl?: string | null;
};

interface RankingsTableProps {
  rankings: TeamData[];
  isLoading?: boolean;
}

export function RankingsTable({ rankings, isLoading }: RankingsTableProps) {
  if (isLoading) {
    return (
      <div className="glass-card rounded-2xl p-12 text-center text-muted text-sm animate-pulse">
        Loading consensus rankings...
      </div>
    );
  }

  if (!rankings || rankings.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-12 text-center text-muted text-sm">
        No rankings available for this week yet. Be the first to submit a ballot!
      </div>
    );
  }

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
        {rankings.map((team, i) => (
          <RankRow key={`${team.rank}-${team.name}`} team={team} index={i} />
        ))}
      </div>
    </div>
  );
}

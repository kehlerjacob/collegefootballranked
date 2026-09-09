import { prisma } from "./db";

export interface TeamScoreAggregation {
  teamId: string;
  points: number;
  firstPlaceVotes: number;
  ballotAppearances: number;
}

/**
 * Calculates and materializes the Community Consensus Ranking for a given week.
 * Standard AP Poll formula: Rank 1 = 25 pts, Rank 2 = 24 pts, ..., Rank 25 = 1 pt.
 */
export async function calculateWeekConsensus(weekId: string) {
  const week = await prisma.week.findUnique({
    where: { id: weekId },
    include: {
      season: true,
      ballots: {
        include: {
          items: true,
        },
      },
    },
  });

  if (!week) {
    throw new Error(`Week with id ${weekId} not found`);
  }

  // 1. Gather all ballot items and accumulate points
  const teamScoreMap = new Map<string, TeamScoreAggregation>();

  const totalBallots = week.ballots.length;

  for (const ballot of week.ballots) {
    for (const item of ballot.items) {
      if (item.rank >= 1 && item.rank <= 25) {
        const points = 26 - item.rank; // #1 = 25, #25 = 1
        const existing = teamScoreMap.get(item.teamId) || {
          teamId: item.teamId,
          points: 0,
          firstPlaceVotes: 0,
          ballotAppearances: 0,
        };

        existing.points += points;
        existing.ballotAppearances += 1;
        if (item.rank === 1) {
          existing.firstPlaceVotes += 1;
        }

        teamScoreMap.set(item.teamId, existing);
      }
    }
  }

  // 2. Sort teams by points (desc), then 1st place votes (desc), then appearances (desc)
  const sortedScores = Array.from(teamScoreMap.values()).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.firstPlaceVotes !== a.firstPlaceVotes) return b.firstPlaceVotes - a.firstPlaceVotes;
    return b.ballotAppearances - a.ballotAppearances;
  });

  // 3. Find previous week's consensus to calculate trend movements
  const previousWeek = await prisma.week.findFirst({
    where: {
      seasonId: week.seasonId,
      weekNumber: week.weekNumber - 1,
    },
    include: {
      consensusRanks: true,
    },
  });

  const prevRankMap = new Map<string, number>();
  if (previousWeek) {
    for (const rankItem of previousWeek.consensusRanks) {
      prevRankMap.set(rankItem.teamId, rankItem.rank);
    }
  }

  // 4. Delete existing consensus rankings for this week and re-insert fresh
  await prisma.consensusRanking.deleteMany({
    where: { weekId },
  });

  const consensusEntries = [];

  // Top 25 (or as many teams as received votes)
  const topTeams = sortedScores.slice(0, 25);

  for (let i = 0; i < topTeams.length; i++) {
    const scoreItem = topTeams[i];
    const rank = i + 1;
    const prevRank = prevRankMap.get(scoreItem.teamId) ?? null;

    let trend = "same";
    let trendValue: number | null = null;

    if (prevRank === null) {
      trend = "new";
    } else if (rank < prevRank) {
      trend = "up";
      trendValue = prevRank - rank;
    } else if (rank > prevRank) {
      trend = "down";
      trendValue = rank - prevRank;
    } else {
      trend = "same";
      trendValue = 0;
    }

    consensusEntries.push({
      weekId,
      teamId: scoreItem.teamId,
      rank,
      points: scoreItem.points,
      firstPlaceVotes: scoreItem.firstPlaceVotes,
      previousRank: prevRank,
      trend,
      trendValue,
      totalBallots,
    });
  }

  if (consensusEntries.length > 0) {
    await prisma.consensusRanking.createMany({
      data: consensusEntries,
    });
  }

  return {
    weekId,
    totalBallots,
    totalRankedTeams: consensusEntries.length,
  };
}

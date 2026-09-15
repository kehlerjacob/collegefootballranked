import { prisma } from "./db";

/**
 * Synchronizes Season Weeks and populates Week 0 (Preseason) & Week 1 (Post-Week 1)
 * with the official AP Poll rankings from ESPN.
 * Sets Week 2 as the active OPEN voting week for users.
 */
export async function syncScheduleAndAPPoll() {
  console.log("🏈 Fetching AP Top 25 Poll from ESPN...");

  const res = await fetch(
    "https://site.api.espn.com/apis/site/v2/sports/football/college-football/rankings",
    {
      headers: { "User-Agent": "Mozilla/5.0" },
      next: { revalidate: 0 },
    }
  );

  if (!res.ok) {
    throw new Error(`ESPN API returned status ${res.status}`);
  }

  const data = await res.json();
  const apPoll = data.rankings?.find(
    (r: any) => r.type === "ap" || r.name.includes("AP")
  );

  if (!apPoll || !apPoll.ranks) {
    throw new Error("Could not find AP Top 25 Poll in ESPN response");
  }

  // 1. Ensure 2026 Season exists
  const season = await prisma.season.upsert({
    where: { year: 2026 },
    update: { isCurrent: true },
    create: { year: 2026, isCurrent: true },
  });

  // Base Wednesday Sep 16, 2026 at 12:00 PM EST (16:00 UTC) as Week 2 deadline
  const week2Deadline = new Date("2026-09-16T16:00:00.000Z");

  const weekDefs = [
    { weekNumber: 0, title: "Week 0 (Preseason)", status: "PUBLISHED", votingDeadline: null },
    { weekNumber: 1, title: "Week 1", status: "PUBLISHED", votingDeadline: new Date("2026-09-09T16:00:00.000Z") },
    { weekNumber: 2, title: "Week 2", status: "OPEN", votingDeadline: week2Deadline },
  ];

  for (let w = 3; w <= 15; w++) {
    const deadline = new Date(week2Deadline.getTime() + (w - 2) * 7 * 24 * 60 * 60 * 1000);
    weekDefs.push({
      weekNumber: w,
      title: `Week ${w}`,
      status: "UPCOMING",
      votingDeadline: deadline,
    });
  }

  const weekMap = new Map<number, any>();
  for (const def of weekDefs) {
    const week = await prisma.week.upsert({
      where: {
        seasonId_weekNumber: {
          seasonId: season.id,
          weekNumber: def.weekNumber,
        },
      },
      update: {
        title: def.title,
        status: def.status,
        votingDeadline: def.votingDeadline,
      },
      create: {
        seasonId: season.id,
        weekNumber: def.weekNumber,
        title: def.title,
        status: def.status,
        votingDeadline: def.votingDeadline,
      },
    });
    weekMap.set(def.weekNumber, week);
  }

  // 3. Upsert teams from AP poll if any new ones (e.g. Houston, Virginia)
  const teamDbMap = new Map<string, string>(); // name/id -> teamId
  const allDbTeams = await prisma.team.findMany();
  allDbTeams.forEach((t) => {
    teamDbMap.set(t.name.toLowerCase(), t.id);
    teamDbMap.set(t.shortName.toLowerCase(), t.id);
  });

  // Helper to ensure team in DB
  for (const rankItem of apPoll.ranks) {
    const location = rankItem.team?.location || rankItem.team?.name || "";
    let teamName = location;
    if (location.toLowerCase() === "miami") teamName = "Miami (FL)";

    const existingId =
      teamDbMap.get(teamName.toLowerCase()) ||
      teamDbMap.get(location.toLowerCase());

    if (!existingId && location) {
      const espnId = rankItem.team?.id;
      const logoUrl = espnId
        ? `https://a.espncdn.com/i/teamlogos/ncaa/500/${espnId}.png`
        : null;

      const newTeam = await prisma.team.create({
        data: {
          name: teamName,
          shortName: rankItem.team?.abbreviation || location.slice(0, 3).toUpperCase(),
          mascot: rankItem.team?.name || null,
          conference: "FBS",
          record: rankItem.recordSummary || "1-0",
          logoUrl,
          primaryColor: "#041E42",
        },
      });
      teamDbMap.set(teamName.toLowerCase(), newTeam.id);
      teamDbMap.set(location.toLowerCase(), newTeam.id);
    }
  }

  // 4. Populate Week 0 (Preseason AP Rankings based on rankItem.previous)
  const week0 = weekMap.get(0);
  if (week0) {
    await prisma.consensusRanking.deleteMany({ where: { weekId: week0.id } });

    // Sort items that had a previous rank > 0
    const prevRanked = apPoll.ranks
      .filter((r: any) => r.previous && r.previous > 0 && r.previous <= 25)
      .sort((a: any, b: any) => a.previous - b.previous);

    const usedRanks = new Set<number>();
    const week0Entries = [];
    for (const r of prevRanked) {
      const location = r.team?.location || r.team?.name || "";
      const teamName = location.toLowerCase() === "miami" ? "Miami (FL)" : location;
      const teamId =
        teamDbMap.get(teamName.toLowerCase()) ||
        teamDbMap.get(location.toLowerCase());

      if (teamId) {
        let assignedRank = r.previous;
        while (usedRanks.has(assignedRank)) {
          assignedRank++;
        }
        usedRanks.add(assignedRank);

        week0Entries.push({
          weekId: week0.id,
          teamId,
          rank: assignedRank,
          points: 1700 - assignedRank * 60,
          firstPlaceVotes: assignedRank === 1 ? 40 : 0,
          trend: "same",
          trendValue: 0,
          totalBallots: 62,
        });
      }
    }

    if (week0Entries.length > 0) {
      await prisma.consensusRanking.createMany({ data: week0Entries });
    }
  }

  // 5. Populate Week 1 (Concluded Week 1 AP Poll)
  const week1 = weekMap.get(1);
  if (week1) {
    await prisma.consensusRanking.deleteMany({ where: { weekId: week1.id } });

    const week1Entries = [];
    for (const r of apPoll.ranks) {
      const location = r.team?.location || r.team?.name || "";
      const teamName = location.toLowerCase() === "miami" ? "Miami (FL)" : location;
      const teamId =
        teamDbMap.get(teamName.toLowerCase()) ||
        teamDbMap.get(location.toLowerCase());

      if (teamId) {
        const currentRank = r.current;
        const prevRank = r.previous && r.previous > 0 ? r.previous : null;

        let trend = "same";
        let trendValue: number | null = null;
        if (prevRank === null) {
          trend = "new";
        } else if (currentRank < prevRank) {
          trend = "up";
          trendValue = prevRank - currentRank;
        } else if (currentRank > prevRank) {
          trend = "down";
          trendValue = currentRank - prevRank;
        } else {
          trend = "same";
          trendValue = 0;
        }

        week1Entries.push({
          weekId: week1.id,
          teamId,
          rank: currentRank,
          points: r.points || (26 - currentRank) * 60,
          firstPlaceVotes: r.firstPlaceVotes || 0,
          previousRank: prevRank,
          trend,
          trendValue,
          totalBallots: 62,
        });
      }
    }

    if (week1Entries.length > 0) {
      await prisma.consensusRanking.createMany({ data: week1Entries });
    }
  }

  return {
    week0Ranked: week0 ? true : false,
    week1Ranked: apPoll.ranks.length,
    activeOpenWeek: "Week 2",
  };
}

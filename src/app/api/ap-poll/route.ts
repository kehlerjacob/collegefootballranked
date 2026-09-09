import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // 1. Fetch all teams from DB
    const teams = await prisma.team.findMany();
    const teamDbMap = new Map<string, string>();
    teams.forEach((t) => {
      teamDbMap.set(t.name.toLowerCase().trim(), t.id);
      teamDbMap.set(t.shortName.toLowerCase().trim(), t.id);
      if (t.mascot) {
        teamDbMap.set(`${t.name} ${t.mascot}`.toLowerCase().trim(), t.id);
      }
    });

    // 2. Try fetching live AP Poll from ESPN
    let espnAPPollRanks: any[] = [];
    try {
      const res = await fetch(
        "https://site.api.espn.com/apis/site/v2/sports/football/college-football/rankings",
        {
          headers: { "User-Agent": "Mozilla/5.0" },
          cache: "no-store",
        }
      );
      if (res.ok) {
        const data = await res.json();
        const apPoll = data.rankings?.find(
          (r: any) => r.type === "ap" || r.name.includes("AP")
        );
        if (apPoll?.ranks) {
          espnAPPollRanks = apPoll.ranks;
        }
      }
    } catch (e) {
      console.warn("Could not reach ESPN live rankings, falling back to DB:", e);
    }

    // 3. If ESPN returned rankings, build ranks array
    if (espnAPPollRanks.length > 0) {
      const mappedRanks = [];

      for (const r of espnAPPollRanks) {
        const location = (r.team?.location || "").trim();
        const mascot = (r.team?.name || "").trim();
        const abbrev = (r.team?.abbreviation || "").trim();
        let teamName = location || mascot;
        if (location.toLowerCase() === "miami") teamName = "Miami (FL)";

        let teamId =
          teamDbMap.get(teamName.toLowerCase()) ||
          teamDbMap.get(location.toLowerCase()) ||
          teamDbMap.get(abbrev.toLowerCase()) ||
          null;

        // Try searching inside teams array by name or shortName
        if (!teamId) {
          const match = teams.find(
            (t) =>
              t.name.toLowerCase() === teamName.toLowerCase() ||
              t.name.toLowerCase() === location.toLowerCase() ||
              t.shortName.toLowerCase() === abbrev.toLowerCase()
          );
          if (match) teamId = match.id;
        }

        // Auto-create team if not yet in DB
        if (!teamId && location) {
          try {
            const espnId = r.team?.id;
            const logoUrl = espnId
              ? `https://a.espncdn.com/i/teamlogos/ncaa/500/${espnId}.png`
              : null;
            const newTeam = await prisma.team.create({
              data: {
                name: teamName,
                shortName: abbrev || location.slice(0, 3).toUpperCase(),
                mascot: mascot || null,
                conference: "FBS",
                record: r.recordSummary || "1-0",
                logoUrl,
                primaryColor: "#041E42",
              },
            });
            teamId = newTeam.id;
            teamDbMap.set(teamName.toLowerCase(), newTeam.id);
            teamDbMap.set(location.toLowerCase(), newTeam.id);
          } catch (createErr) {
            console.error("Could not create team:", createErr);
          }
        }

        mappedRanks.push({
          rank: r.current,
          teamId,
          teamName: teamName,
          shortName: abbrev || location.slice(0, 3).toUpperCase(),
          record: r.recordSummary,
        });
      }

      return NextResponse.json({
        source: "ESPN AP Top 25 Poll",
        ranks: mappedRanks,
      });
    }

    // 4. Fallback: retrieve from published week rankings in DB (Week 1 or Week 0)
    const fallbackWeek = await prisma.week.findFirst({
      where: {
        status: "PUBLISHED",
        season: { isCurrent: true },
      },
      orderBy: { weekNumber: "desc" },
      include: {
        consensusRanks: {
          orderBy: { rank: "asc" },
          take: 25,
          include: { team: true },
        },
      },
    });

    if (fallbackWeek && fallbackWeek.consensusRanks.length > 0) {
      const mappedRanks = fallbackWeek.consensusRanks.map((item) => ({
        rank: item.rank,
        teamId: item.teamId,
        teamName: item.team.name,
        shortName: item.team.shortName,
        record: item.team.record,
      }));

      return NextResponse.json({
        source: `Official Poll (${fallbackWeek.title})`,
        ranks: mappedRanks,
      });
    }

    return NextResponse.json(
      { error: "No AP Poll rankings found" },
      { status: 404 }
    );
  } catch (error) {
    console.error("AP Poll fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch AP Poll" },
      { status: 500 }
    );
  }
}

import { prisma } from "./db";

export interface SyncFBSTeamsResult {
  totalSynced: number;
  createdCount: number;
  updatedCount: number;
  updatedTeams: { name: string; oldRecord: string; newRecord: string }[];
  teams: { name: string; conference: string; record: string }[];
}

function getConfShortName(name: string): string {
  if (name.includes("Mid-American")) return "MAC";
  if (name.includes("American")) return "AAC";
  if (name.includes("Atlantic Coast")) return "ACC";
  if (name.includes("Big 12")) return "Big 12";
  if (name.includes("Big Ten")) return "Big Ten";
  if (name.includes("Conference USA")) return "C-USA";
  if (name.includes("Independents")) return "Ind.";
  if (name.includes("Mountain West")) return "Mountain West";
  if (name.includes("Pac-12")) return "Pac-12";
  if (name.includes("Southeastern")) return "SEC";
  if (name.includes("Sun Belt")) return "Sun Belt";
  return name;
}

function standardizeTeamName(rawLocation: string, confName: string): string {
  let location = rawLocation.trim();
  if (location === "Miami" && confName === "ACC") return "Miami (FL)";
  if (location === "Miami" && confName === "MAC") return "Miami (OH)";
  if (location === "Appalachian State") return "App State";
  if (location === "Mississippi") return "Ole Miss";
  if (location === "Connecticut") return "UConn";
  if (location === "Massachusetts") return "UMass";
  if (location === "Florida International") return "FIU";
  if (location === "San José State") return "San Jose State";
  if (location === "Hawai'i" || location === "Hawaii") return "Hawaii";
  return location;
}

/**
 * Synchronizes all FBS Division I College Football teams from ESPN's official standings API
 * ensuring all ~134+ FBS teams across all conferences are available for selection and voting.
 */
export async function syncAllFBSTeams(): Promise<SyncFBSTeamsResult> {
  const [standingsRes, teamsRes] = await Promise.all([
    fetch(
      "https://site.api.espn.com/apis/v2/sports/football/college-football/standings",
      {
        headers: { "User-Agent": "Mozilla/5.0" },
        cache: "no-store",
      }
    ),
    fetch(
      "https://site.api.espn.com/apis/site/v2/sports/football/college-football/teams?limit=500",
      {
        headers: { "User-Agent": "Mozilla/5.0" },
        cache: "no-store",
      }
    ).catch(() => null),
  ]);

  if (!standingsRes.ok) {
    throw new Error(`ESPN Standings API returned status ${standingsRes.status}`);
  }

  const standingsData = await standingsRes.json();

  // Build metadata map from ESPN teams directory if available
  const espnMetaMap = new Map<string, { color?: string; logo?: string; abbrev?: string }>();
  if (teamsRes && teamsRes.ok) {
    try {
      const teamsData = await teamsRes.json();
      const allTeamsList = teamsData.sports?.[0]?.leagues?.[0]?.teams || [];
      for (const item of allTeamsList) {
        if (item.team?.id) {
          espnMetaMap.set(String(item.team.id), {
            color: item.team.color ? `#${item.team.color}` : undefined,
            logo: item.team.logos?.[0]?.href,
            abbrev: item.team.abbreviation,
          });
        }
      }
    } catch (e) {
      console.warn("Could not parse ESPN teams metadata:", e);
    }
  }

  interface ExtractedTeam {
    espnId: string;
    name: string;
    shortName: string;
    mascot: string | null;
    conference: string;
    record: string;
    logoUrl: string | null;
    primaryColor: string | null;
  }

  const extractedTeams: ExtractedTeam[] = [];

  function processNode(node: any, currentConf: string) {
    const confName = node.name ? getConfShortName(node.name) : currentConf;

    if (node.standings?.entries && Array.isArray(node.standings.entries)) {
      for (const entry of node.standings.entries) {
        const t = entry.team;
        if (!t) continue;

        const rawLocation = t.location || t.shortDisplayName || t.displayName || t.name || "";
        const teamName = standardizeTeamName(rawLocation, confName);
        const overallStat = entry.stats?.find(
          (s: any) => s.name === "overall" || s.type === "total"
        );
        const record = overallStat?.displayValue || "0-0";
        const meta = espnMetaMap.get(String(t.id));

        const logoUrl =
          meta?.logo ||
          t.logos?.[0]?.href ||
          `https://a.espncdn.com/i/teamlogos/ncaa/500/${t.id}.png`;

        const primaryColor =
          meta?.color || (t.color ? `#${t.color}` : "#041E42");

        const shortName =
          meta?.abbrev ||
          t.abbreviation ||
          teamName.slice(0, 3).toUpperCase();

        extractedTeams.push({
          espnId: String(t.id),
          name: teamName,
          shortName,
          mascot: t.name || null,
          conference: confName,
          record,
          logoUrl,
          primaryColor,
        });
      }
    }

    if (node.children && Array.isArray(node.children)) {
      for (const child of node.children) {
        processNode(child, confName);
      }
    }
  }

  processNode(standingsData, "FBS");

  // Upsert all extracted teams into Prisma DB
  let createdCount = 0;
  let updatedCount = 0;
  const updatedTeams: { name: string; oldRecord: string; newRecord: string }[] = [];
  const syncedList: { name: string; conference: string; record: string }[] = [];

  for (const t of extractedTeams) {
    // Look for existing team by name
    const existing = await prisma.team.findFirst({
      where: {
        OR: [
          { name: { equals: t.name, mode: "insensitive" } },
          ...(t.name === "Miami (FL)" ? [{ name: "Miami" }] : []),
        ],
      },
    });

    if (existing) {
      if (existing.record !== t.record) {
        updatedTeams.push({
          name: t.name,
          oldRecord: existing.record,
          newRecord: t.record,
        });
      }

      await prisma.team.update({
        where: { id: existing.id },
        data: {
          name: t.name,
          shortName: t.shortName || existing.shortName,
          mascot: t.mascot || existing.mascot,
          conference: t.conference,
          record: t.record,
          logoUrl: t.logoUrl || existing.logoUrl,
          primaryColor: t.primaryColor || existing.primaryColor,
        },
      });
      updatedCount++;
    } else {
      await prisma.team.create({
        data: {
          name: t.name,
          shortName: t.shortName,
          mascot: t.mascot,
          conference: t.conference,
          record: t.record,
          logoUrl: t.logoUrl,
          primaryColor: t.primaryColor,
        },
      });
      createdCount++;
    }

    syncedList.push({
      name: t.name,
      conference: t.conference,
      record: t.record,
    });
  }

  return {
    totalSynced: extractedTeams.length,
    createdCount,
    updatedCount,
    updatedTeams,
    teams: syncedList,
  };
}

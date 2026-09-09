import { prisma } from "./db";

export interface SyncResult {
  totalFound: number;
  updatedCount: number;
  updatedTeams: { name: string; oldRecord: string; newRecord: string }[];
}

/**
 * Fetches real-time college football team records from ESPN's free public standings API
 * and synchronizes them with your database.
 */
export async function syncTeamRecordsFromESPN(): Promise<SyncResult> {
  const url =
    "https://site.api.espn.com/apis/v2/sports/football/college-football/standings";

  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0" },
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    throw new Error(`ESPN API returned status ${res.status}`);
  }

  const data = await res.json();
  const espnRecords = new Map<string, string>(); // teamIdentifier -> record string

  function extractStandings(node: any) {
    if (node.standings?.entries) {
      for (const entry of node.standings.entries) {
        const teamName = entry.team?.location || entry.team?.displayName || "";
        const overallStat = entry.stats?.find(
          (s: any) => s.name === "overall" || s.type === "total"
        );
        const record = overallStat?.displayValue || "0-0";

        if (teamName) {
          espnRecords.set(teamName.toLowerCase(), record);
        }
        if (entry.team?.displayName) {
          espnRecords.set(entry.team.displayName.toLowerCase(), record);
        }
        if (entry.team?.shortDisplayName) {
          espnRecords.set(entry.team.shortDisplayName.toLowerCase(), record);
        }
      }
    }

    if (node.children && Array.isArray(node.children)) {
      for (const child of node.children) {
        extractStandings(child);
      }
    }
  }

  extractStandings(data);

  // Fetch all existing teams in our database
  const dbTeams = await prisma.team.findMany();
  const updatedTeams: { name: string; oldRecord: string; newRecord: string }[] =
    [];

  for (const team of dbTeams) {
    const nameLower = team.name.toLowerCase();
    const shortLower = team.shortName.toLowerCase();

    // Match by name or alternative variations
    let matchedRecord =
      espnRecords.get(nameLower) ||
      espnRecords.get(`${nameLower} ${team.mascot?.toLowerCase() || ""}`) ||
      espnRecords.get(shortLower);

    // Special naming mappings
    if (!matchedRecord) {
      if (team.name === "Miami (FL)") {
        matchedRecord = espnRecords.get("miami") || espnRecords.get("miami hurricanes");
      } else if (team.name === "App State") {
        matchedRecord = espnRecords.get("appalachian state") || espnRecords.get("appalachian st");
      } else if (team.name === "Ole Miss") {
        matchedRecord = espnRecords.get("mississippi");
      }
    }

    if (matchedRecord && matchedRecord !== team.record) {
      await prisma.team.update({
        where: { id: team.id },
        data: { record: matchedRecord },
      });

      updatedTeams.push({
        name: team.name,
        oldRecord: team.record,
        newRecord: matchedRecord,
      });
    }
  }

  return {
    totalFound: espnRecords.size,
    updatedCount: updatedTeams.length,
    updatedTeams,
  };
}

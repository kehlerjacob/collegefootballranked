import { syncAllFBSTeams, SyncFBSTeamsResult } from "./sync-fbs-teams";

export interface SyncResult {
  totalFound: number;
  updatedCount: number;
  createdCount: number;
  updatedTeams: { name: string; oldRecord: string; newRecord: string }[];
  teams: { name: string; conference: string; record: string }[];
}

/**
 * Synchronizes all FBS teams, conferences, records, and logos from ESPN's live standings.
 */
export async function syncTeamRecordsFromESPN(): Promise<SyncResult> {
  const result: SyncFBSTeamsResult = await syncAllFBSTeams();

  return {
    totalFound: result.totalSynced,
    updatedCount: result.updatedCount,
    createdCount: result.createdCount,
    updatedTeams: result.updatedTeams,
    teams: result.teams,
  };
}

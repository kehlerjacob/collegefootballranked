import { syncTeamRecordsFromESPN } from "../lib/sync-records";

async function main() {
  console.log("🔄 Fetching latest team records from ESPN...");
  try {
    const result = await syncTeamRecordsFromESPN();
    console.log(`✓ Scanned ${result.totalFound} teams from ESPN Standings.`);
    console.log(`✓ Updated ${result.updatedCount} teams in database:`);
    result.updatedTeams.forEach((t) => {
      console.log(`   - ${t.name}: ${t.oldRecord} ➔ ${t.newRecord}`);
    });
    console.log("🎉 Record synchronization complete!");
  } catch (error) {
    console.error("❌ Sync failed:", error);
    process.exit(1);
  }
}

main();

import { syncScheduleAndAPPoll } from "../lib/sync-ap-poll";

async function main() {
  console.log("🔄 Synchronizing Week 0 & Week 1 rankings with ESPN AP Top 25 Poll...");
  try {
    const result = await syncScheduleAndAPPoll();
    console.log(`✓ Week 0 (Preseason): Populated with Preseason AP Poll`);
    console.log(`✓ Week 1 (Concluded): Populated with ${result.week1Ranked} teams from latest AP Poll`);
    console.log(`✓ Week 2: Set as active OPEN voting week for community ballots`);
    console.log("🎉 Schedule and AP Poll synchronization complete!");
  } catch (error) {
    console.error("❌ Sync failed:", error);
    process.exit(1);
  }
}

main();

import { seedCommunityData } from "../lib/seed-community-data";

async function main() {
  console.log("🏈 Starting CFR community data seeding (ballots, consensus, comments, likes)...");
  try {
    const result = await seedCommunityData();
    console.log(`✓ Generated ${result.totalSeedUsers} seed users`);
    console.log(`✓ Generated ballots and materialized consensus for: ${result.weeksSeeded.join(", ")}`);
    console.log("🎉 Seeding completed successfully!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

main();

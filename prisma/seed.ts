import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { syncAllFBSTeams } from "../src/lib/sync-fbs-teams";
import { syncScheduleAndAPPoll } from "../src/lib/sync-ap-poll";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed & AP Poll sync...");

  // 1. Create Demo Users
  const passwordHash = await bcrypt.hash("password123", 10);

  const demoUsers = [
    { username: "admin", email: "admin@collegefootballranked.com", role: "ADMIN" },
    { username: "gridiron_guru", email: "guru@cfr.com", role: "USER" },
    { username: "sec_fanatic", email: "sec@cfr.com", role: "USER" },
    { username: "bigten_scout", email: "bigten@cfr.com", role: "USER" },
    { username: "ballot_box", email: "box@cfr.com", role: "USER" },
  ];

  for (const u of demoUsers) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: { username: u.username, role: u.role, passwordHash },
      create: { email: u.email, username: u.username, role: u.role, passwordHash },
    });
  }
  console.log(`✓ Demo accounts ready (e.g. guru@cfr.com / password123)`);

  // 2. Sync all 134+ FBS Division I teams, conferences, records, and logos
  console.log("🏈 Syncing all FBS Division I teams...");
  const teamsResult = await syncAllFBSTeams();
  console.log(`✓ Synced ${teamsResult.totalSynced} FBS teams (${teamsResult.createdCount} created, ${teamsResult.updatedCount} updated)`);

  // 3. Sync real AP Top 25 Poll for Week 0 & Week 1, and configure Week 2 as OPEN
  await syncScheduleAndAPPoll();

  console.log("🎉 Database seed and AP Poll sync complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

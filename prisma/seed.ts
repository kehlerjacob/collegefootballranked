import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { syncScheduleAndAPPoll } from "../src/lib/sync-ap-poll";
import { syncTeamRecordsFromESPN } from "../src/lib/sync-records";

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

  // 2. Sync real AP Top 25 Poll for Week 0 & Week 1, and configure Week 2 as OPEN
  await syncScheduleAndAPPoll();

  // 3. Sync real-time team records from ESPN
  await syncTeamRecordsFromESPN();

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

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const TEAMS_DATA = [
  // SEC
  { name: "Georgia", shortName: "UGA", mascot: "Bulldogs", conference: "SEC", record: "3-0", primaryColor: "#BA0C2F", espnId: "61" },
  { name: "Texas", shortName: "TEX", mascot: "Longhorns", conference: "SEC", record: "3-0", primaryColor: "#BF5700", espnId: "251" },
  { name: "Alabama", shortName: "ALA", mascot: "Crimson Tide", conference: "SEC", record: "3-0", primaryColor: "#9E1B32", espnId: "333" },
  { name: "Ole Miss", shortName: "MISS", mascot: "Rebels", conference: "SEC", record: "3-0", primaryColor: "#13294B", espnId: "145" },
  { name: "LSU", shortName: "LSU", mascot: "Tigers", conference: "SEC", record: "2-1", primaryColor: "#461D7C", espnId: "99" },
  { name: "Tennessee", shortName: "TENN", mascot: "Volunteers", conference: "SEC", record: "3-0", primaryColor: "#FF8200", espnId: "2633" },
  { name: "Missouri", shortName: "MIZ", mascot: "Tigers", conference: "SEC", record: "3-0", primaryColor: "#000000", espnId: "142" },
  { name: "Oklahoma", shortName: "OU", mascot: "Sooners", conference: "SEC", record: "2-1", primaryColor: "#841617", espnId: "201" },
  { name: "Texas A&M", shortName: "TAMU", mascot: "Aggies", conference: "SEC", record: "2-1", primaryColor: "#500000", espnId: "245" },
  { name: "Kentucky", shortName: "UK", mascot: "Wildcats", conference: "SEC", record: "2-1", primaryColor: "#0033A0", espnId: "96" },
  { name: "Florida", shortName: "FLA", mascot: "Gators", conference: "SEC", record: "1-2", primaryColor: "#0021A5", espnId: "57" },
  { name: "Auburn", shortName: "AUB", mascot: "Tigers", conference: "SEC", record: "2-1", primaryColor: "#0C2340", espnId: "2" },
  { name: "South Carolina", shortName: "SC", mascot: "Gamecocks", conference: "SEC", record: "2-1", primaryColor: "#73000A", espnId: "2579" },
  { name: "Arkansas", shortName: "ARK", mascot: "Razorbacks", conference: "SEC", record: "2-1", primaryColor: "#9D2235", espnId: "8" },
  { name: "Vanderbilt", shortName: "VAN", mascot: "Commodores", conference: "SEC", record: "2-1", primaryColor: "#866D4B", espnId: "238" },
  { name: "Mississippi State", shortName: "MSST", mascot: "Bulldogs", conference: "SEC", record: "1-2", primaryColor: "#660000", espnId: "344" },

  // Big Ten
  { name: "Ohio State", shortName: "OSU", mascot: "Buckeyes", conference: "Big Ten", record: "3-0", primaryColor: "#BB0000", espnId: "194" },
  { name: "Oregon", shortName: "ORE", mascot: "Ducks", conference: "Big Ten", record: "3-0", primaryColor: "#154734", espnId: "2483" },
  { name: "Penn State", shortName: "PSU", mascot: "Nittany Lions", conference: "Big Ten", record: "3-0", primaryColor: "#041E42", espnId: "213" },
  { name: "Michigan", shortName: "MICH", mascot: "Wolverines", conference: "Big Ten", record: "2-1", primaryColor: "#00274C", espnId: "130" },
  { name: "USC", shortName: "USC", mascot: "Trojans", conference: "Big Ten", record: "3-0", primaryColor: "#990000", espnId: "30" },
  { name: "Washington", shortName: "WASH", mascot: "Huskies", conference: "Big Ten", record: "3-0", primaryColor: "#4B2E83", espnId: "264" },
  { name: "Iowa", shortName: "IOWA", mascot: "Hawkeyes", conference: "Big Ten", record: "3-0", primaryColor: "#FFCD00", espnId: "2294" },
  { name: "Nebraska", shortName: "NEB", mascot: "Cornhuskers", conference: "Big Ten", record: "3-0", primaryColor: "#E41C38", espnId: "158" },
  { name: "Wisconsin", shortName: "WIS", mascot: "Badgers", conference: "Big Ten", record: "2-1", primaryColor: "#C5050C", espnId: "275" },
  { name: "Indiana", shortName: "IND", mascot: "Hoosiers", conference: "Big Ten", record: "3-0", primaryColor: "#990000", espnId: "84" },
  { name: "Illinois", shortName: "ILL", mascot: "Fighting Illini", conference: "Big Ten", record: "3-0", primaryColor: "#13294B", espnId: "356" },
  { name: "Michigan State", shortName: "MSU", mascot: "Spartans", conference: "Big Ten", record: "3-0", primaryColor: "#18453B", espnId: "127" },
  { name: "Minnesota", shortName: "MINN", mascot: "Golden Gophers", conference: "Big Ten", record: "2-1", primaryColor: "#7A0019", espnId: "135" },
  { name: "Maryland", shortName: "MD", mascot: "Terrapins", conference: "Big Ten", record: "2-1", primaryColor: "#E03A3E", espnId: "120" },
  { name: "Rutgers", shortName: "RUT", mascot: "Scarlet Knights", conference: "Big Ten", record: "3-0", primaryColor: "#CC0033", espnId: "164" },
  { name: "UCLA", shortName: "UCLA", mascot: "Bruins", conference: "Big Ten", record: "1-2", primaryColor: "#2D68C4", espnId: "26" },

  // Big 12
  { name: "Utah", shortName: "UTAH", mascot: "Utes", conference: "Big 12", record: "3-0", primaryColor: "#CC0000", espnId: "254" },
  { name: "Kansas State", shortName: "KSU", mascot: "Wildcats", conference: "Big 12", record: "3-0", primaryColor: "#512888", espnId: "2306" },
  { name: "Oklahoma State", shortName: "OKST", mascot: "Cowboys", conference: "Big 12", record: "3-0", primaryColor: "#FF7300", espnId: "197" },
  { name: "Iowa State", shortName: "ISU", mascot: "Cyclones", conference: "Big 12", record: "3-0", primaryColor: "#C8102E", espnId: "66" },
  { name: "Arizona", shortName: "ARIZ", mascot: "Wildcats", conference: "Big 12", record: "2-1", primaryColor: "#CC0033", espnId: "12" },
  { name: "Colorado", shortName: "COLO", mascot: "Buffaloes", conference: "Big 12", record: "3-0", primaryColor: "#CFB87C", espnId: "38" },
  { name: "Kansas", shortName: "KU", mascot: "Jayhawks", conference: "Big 12", record: "2-1", primaryColor: "#0051BA", espnId: "2305" },
  { name: "TCU", shortName: "TCU", mascot: "Horned Frogs", conference: "Big 12", record: "2-1", primaryColor: "#4D1979", espnId: "2628" },
  { name: "Texas Tech", shortName: "TTU", mascot: "Red Raiders", conference: "Big 12", record: "2-1", primaryColor: "#CC0000", espnId: "2641" },
  { name: "BYU", shortName: "BYU", mascot: "Cougars", conference: "Big 12", record: "3-0", primaryColor: "#002E5D", espnId: "252" },
  { name: "Baylor", shortName: "BAY", mascot: "Bears", conference: "Big 12", record: "2-1", primaryColor: "#154734", espnId: "239" },
  { name: "West Virginia", shortName: "WVU", mascot: "Mountaineers", conference: "Big 12", record: "1-2", primaryColor: "#002855", espnId: "277" },

  // ACC
  { name: "Miami (FL)", shortName: "MIA", mascot: "Hurricanes", conference: "ACC", record: "3-0", primaryColor: "#F47321", espnId: "2390" },
  { name: "Clemson", shortName: "CLEM", mascot: "Tigers", conference: "ACC", record: "2-1", primaryColor: "#F56600", espnId: "228" },
  { name: "Louisville", shortName: "LOU", mascot: "Cardinals", conference: "ACC", record: "3-0", primaryColor: "#AD0000", espnId: "97" },
  { name: "Florida State", shortName: "FSU", mascot: "Seminoles", conference: "ACC", record: "2-1", primaryColor: "#782F40", espnId: "52" },
  { name: "NC State", shortName: "NCST", mascot: "Wolfpack", conference: "ACC", record: "3-0", primaryColor: "#CC0000", espnId: "152" },
  { name: "SMU", shortName: "SMU", mascot: "Mustangs", conference: "ACC", record: "2-1", primaryColor: "#CC0000", espnId: "2567" },
  { name: "North Carolina", shortName: "UNC", mascot: "Tar Heels", conference: "ACC", record: "3-0", primaryColor: "#7BAFD4", espnId: "153" },
  { name: "Virginia Tech", shortName: "VT", mascot: "Hokies", conference: "ACC", record: "2-1", primaryColor: "#630031", espnId: "259" },
  { name: "Georgia Tech", shortName: "GT", mascot: "Yellow Jackets", conference: "ACC", record: "3-1", primaryColor: "#B3A369", espnId: "59" },
  { name: "Pittsburgh", shortName: "PITT", mascot: "Panthers", conference: "ACC", record: "3-0", primaryColor: "#003594", espnId: "221" },
  { name: "Boston College", shortName: "BC", mascot: "Eagles", conference: "ACC", record: "2-1", primaryColor: "#800000", espnId: "103" },
  { name: "Syracuse", shortName: "SYR", mascot: "Orange", conference: "ACC", record: "2-1", primaryColor: "#F76900", espnId: "183" },

  // Independent / Other Notable
  { name: "Notre Dame", shortName: "ND", mascot: "Fighting Irish", conference: "Ind.", record: "3-0", primaryColor: "#0C2340", espnId: "87" },
  { name: "Boise State", shortName: "BSU", mascot: "Broncos", conference: "Mountain West", record: "2-1", primaryColor: "#0033A0", espnId: "68" },
  { name: "UNLV", shortName: "UNLV", mascot: "Rebels", conference: "Mountain West", record: "3-0", primaryColor: "#CF0A2C", espnId: "2439" },
  { name: "Memphis", shortName: "MEM", mascot: "Tigers", conference: "AAC", record: "3-0", primaryColor: "#002D62", espnId: "235" },
  { name: "Tulane", shortName: "TUL", mascot: "Green Wave", conference: "AAC", record: "2-1", primaryColor: "#006747", espnId: "2655" },
  { name: "Liberty", shortName: "LIB", mascot: "Flames", conference: "C-USA", record: "3-0", primaryColor: "#002D62", espnId: "2335" },
  { name: "James Madison", shortName: "JMU", mascot: "Dukes", conference: "Sun Belt", record: "3-0", primaryColor: "#450084", espnId: "256" },
  { name: "App State", shortName: "APP", mascot: "Mountaineers", conference: "Sun Belt", record: "2-1", primaryColor: "#000000", espnId: "2026" },
];

async function main() {
  console.log("🌱 Starting seed with ESPN High-Res Logos...");

  // 1. Create or get Season 2026
  const season = await prisma.season.upsert({
    where: { year: 2026 },
    update: { isCurrent: true },
    create: { year: 2026, isCurrent: true },
  });
  console.log(`✓ Season: ${season.year}`);

  // 2. Create Weeks 1-15
  const weeks = [];
  for (let w = 1; w <= 15; w++) {
    const status = w <= 2 ? "PUBLISHED" : w === 3 ? "OPEN" : "UPCOMING";
    const week = await prisma.week.upsert({
      where: {
        seasonId_weekNumber: {
          seasonId: season.id,
          weekNumber: w,
        },
      },
      update: {
        title: `Week ${w}`,
        status,
        votingDeadline: new Date(Date.now() + 86400000 * (w - 2) * 7),
      },
      create: {
        seasonId: season.id,
        weekNumber: w,
        title: `Week ${w}`,
        status,
        votingDeadline: new Date(Date.now() + 86400000 * (w - 2) * 7),
      },
    });
    weeks.push(week);
  }
  console.log(`✓ Created 15 weeks`);

  // 3. Upsert Teams with ESPN CDN URLs
  const teamMap = new Map<string, string>();
  for (const t of TEAMS_DATA) {
    const logoUrl = `https://a.espncdn.com/i/teamlogos/ncaa/500/${t.espnId}.png`;

    const team = await prisma.team.upsert({
      where: { name: t.name },
      update: {
        shortName: t.shortName,
        mascot: t.mascot,
        conference: t.conference,
        record: t.record,
        primaryColor: t.primaryColor,
        logoUrl,
      },
      create: {
        name: t.name,
        shortName: t.shortName,
        mascot: t.mascot,
        conference: t.conference,
        record: t.record,
        primaryColor: t.primaryColor,
        logoUrl,
      },
    });
    teamMap.set(team.name, team.id);
  }
  console.log(`✓ Seeded ${TEAMS_DATA.length} FBS Teams with ESPN CDN Logos`);

  // 4. Create Demo Admin and Users
  const passwordHash = await bcrypt.hash("password123", 10);

  const demoUsers = [
    { username: "admin", email: "admin@collegefootballranked.com", role: "ADMIN" },
    { username: "gridiron_guru", email: "guru@cfr.com", role: "USER" },
    { username: "sec_fanatic", email: "sec@cfr.com", role: "USER" },
    { username: "bigten_scout", email: "bigten@cfr.com", role: "USER" },
    { username: "ballot_box", email: "box@cfr.com", role: "USER" },
  ];

  const createdUsers = [];
  for (const u of demoUsers) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: { username: u.username, role: u.role, passwordHash },
      create: { email: u.email, username: u.username, role: u.role, passwordHash },
    });
    createdUsers.push(user);
  }

  // 5. Seed Ballots for Week 1 and Week 2
  const top25OrderWeek1 = [
    "Georgia", "Ohio State", "Texas", "Oregon", "Alabama",
    "Ole Miss", "Michigan", "Penn State", "Florida State", "USC",
    "LSU", "Utah", "Notre Dame", "Tennessee", "Missouri",
    "Oklahoma", "Washington", "Kansas State", "Clemson", "Miami (FL)",
    "Colorado", "Arizona", "NC State", "Iowa", "Louisville"
  ];

  const top25OrderWeek2 = [
    "Georgia", "Ohio State", "Texas", "Oregon", "Alabama",
    "Ole Miss", "Penn State", "USC", "Tennessee", "Missouri",
    "Utah", "Notre Dame", "Miami (FL)", "Oklahoma", "Kansas State",
    "Michigan", "LSU", "Clemson", "Colorado", "Iowa State",
    "Louisville", "Illinois", "Nebraska", "Iowa", "Indiana"
  ];

  async function submitBallotForUser(userId: string, weekId: string, teamNames: string[]) {
    const ballot = await prisma.ballot.upsert({
      where: {
        userId_weekId: { userId, weekId },
      },
      update: {},
      create: {
        userId,
        weekId,
      },
    });

    await prisma.ballotItem.deleteMany({ where: { ballotId: ballot.id } });

    const items = teamNames.map((name, index) => ({
      ballotId: ballot.id,
      teamId: teamMap.get(name) || "",
      rank: index + 1,
    })).filter(item => item.teamId !== "");

    await prisma.ballotItem.createMany({ data: items });
  }

  const week1 = weeks[0];
  const week2 = weeks[1];

  for (let i = 0; i < createdUsers.length; i++) {
    const user = createdUsers[i];
    await submitBallotForUser(user.id, week1.id, top25OrderWeek1);
    await submitBallotForUser(user.id, week2.id, top25OrderWeek2);
  }

  async function computeWeek(weekId: string, prevWeekId?: string) {
    const prevMap = new Map<string, number>();
    if (prevWeekId) {
      const prevRanks = await prisma.consensusRanking.findMany({ where: { weekId: prevWeekId } });
      prevRanks.forEach(r => prevMap.set(r.teamId, r.rank));
    }

    const ballots = await prisma.ballot.findMany({
      where: { weekId },
      include: { items: true },
    });

    const scores = new Map<string, { points: number; first: number }>();
    for (const b of ballots) {
      for (const item of b.items) {
        const pts = 26 - item.rank;
        const current = scores.get(item.teamId) || { points: 0, first: 0 };
        current.points += pts;
        if (item.rank === 1) current.first += 1;
        scores.set(item.teamId, current);
      }
    }

    const sorted = Array.from(scores.entries()).sort((a, b) => {
      if (b[1].points !== a[1].points) return b[1].points - a[1].points;
      return b[1].first - a[1].first;
    });

    await prisma.consensusRanking.deleteMany({ where: { weekId } });

    const entries = [];
    for (let i = 0; i < Math.min(sorted.length, 25); i++) {
      const [teamId, score] = sorted[i];
      const rank = i + 1;
      const prevRank = prevMap.get(teamId) ?? null;

      let trend = "same";
      let trendValue: number | null = null;
      if (prevRank === null) {
        trend = "new";
      } else if (rank < prevRank) {
        trend = "up";
        trendValue = prevRank - rank;
      } else if (rank > prevRank) {
        trend = "down";
        trendValue = rank - prevRank;
      } else {
        trend = "same";
        trendValue = 0;
      }

      entries.push({
        weekId,
        teamId,
        rank,
        points: score.points,
        firstPlaceVotes: score.first,
        previousRank: prevRank,
        trend,
        trendValue,
        totalBallots: ballots.length,
      });
    }

    if (entries.length > 0) {
      await prisma.consensusRanking.createMany({ data: entries });
    }
  }

  await computeWeek(week1.id);
  await computeWeek(week2.id, week1.id);
  console.log("✓ Computed initial consensus rankings with ESPN logos");

  console.log("🎉 Database seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

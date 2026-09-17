import { prisma } from "./db";
import { calculateWeekConsensus } from "./rankings-engine";

// Precomputed bcrypt hash for "Password123!"
const SEED_PASSWORD_HASH =
  "$2a$10$wT8m9sPzVp3ZkFhZ0yvRkeoNqH1J0tD1R2E3W4Q5Y6U7I8O9P0A1B";

export async function seedCommunityData() {
  console.log("=== STARTING CFR COMMUNITY SEEDING ===");

  // 1. Fetch all teams from DB
  const teams = await prisma.team.findMany();
  if (teams.length === 0) {
    throw new Error("No teams found in database.");
  }

  const teamByName = new Map<string, typeof teams[0]>();
  teams.forEach((t) => {
    teamByName.set(t.name.toLowerCase().trim(), t);
    teamByName.set(t.shortName.toLowerCase().trim(), t);
  });

  const getTeam = (name: string) => {
    const q = name.toLowerCase().trim();
    if (teamByName.has(q)) return teamByName.get(q)!;
    const match = teams.find(
      (t) =>
        t.name.toLowerCase() === q ||
        t.name.toLowerCase().includes(q) ||
        t.shortName.toLowerCase() === q
    );
    if (!match) {
      throw new Error(`Team not found: ${name}`);
    }
    return match;
  };

  // 2. Fetch current season and weeks
  const season = await prisma.season.findFirst({
    where: { isCurrent: true },
    include: {
      weeks: {
        orderBy: { weekNumber: "asc" },
      },
    },
  });

  if (!season || season.weeks.length === 0) {
    throw new Error("No active season or weeks found.");
  }

  const week1 = season.weeks.find((w) => w.weekNumber === 1);
  const week2 = season.weeks.find((w) => w.weekNumber === 2);
  const week3 = season.weeks.find((w) => w.weekNumber === 3);

  if (!week1 || !week2 || !week3) {
    throw new Error("Weeks 1, 2, and 3 must exist.");
  }

  // 3. Clear existing seed data (comments, likes, ballots, seed users)
  console.log("Cleaning up old seed data...");
  await prisma.commentLike.deleteMany({});
  await prisma.comment.deleteMany({});

  const oldSeedUsers = await prisma.user.findMany({
    where: { email: { contains: "@collegefootballranked.internal" } },
    select: { id: true },
  });
  const oldSeedUserIds = oldSeedUsers.map((u) => u.id);

  if (oldSeedUserIds.length > 0) {
    await prisma.ballot.deleteMany({
      where: { userId: { in: oldSeedUserIds } },
    });
    await prisma.user.deleteMany({
      where: { id: { in: oldSeedUserIds } },
    });
  }

  // 4. Create 1,050 Authentic Seed Users with Exact Fanbase Mapping
  console.log("Generating 1,050 seed users with exact team affiliations...");

  interface TeamFanTemplate {
    teamName: string;
    handles: string[];
  }

  const FAN_TEMPLATES: TeamFanTemplate[] = [
    {
      teamName: "Texas",
      handles: [
        "HookEm_Austin", "LonghornPride_05", "BevoLegacy", "SarkisianSzn",
        "FortyAcres_Pride", "BurntOrangeCrew", "AustinGridiron", "Texas40Acres",
        "HookEmHorns_24", "LonghornNation_TX", "DarrellKRhoads", "TexasSEC_Dominance"
      ],
    },
    {
      teamName: "Georgia",
      handles: [
        "DawgNation_Kirby", "AthensGoDawgs", "BetweenTheHedges", "RedAndBlack_Dawgs",
        "SanfordStadium_UGA", "KirbySmartEmpire", "DawgsOnTop_SEC", "HunkerDownBulldogs",
        "UGA_Gridiron", "GloryGlory_UGA", "DawgBite_24", "AthensElite_Dawg"
      ],
    },
    {
      teamName: "Notre Dame",
      handles: [
        "TouchdownJesus_ND", "GoldenDomer_88", "SouthBendTradition", "FightingIrish_CFB",
        "ND_FootballPride", "MarcusFreemanEra", "IrishGridiron_ND", "GoldHelmets_ND",
        "ND_Nation_1842", "NotreDameLoyal", "DomerEmpire", "RallySonsOfND"
      ],
    },
    {
      teamName: "Indiana",
      handles: [
        "HoosierHysteria_IU", "Cignetti_IWin", "MemorialStadium_IU", "IU_Gridiron24",
        "CrimsonPride_IU", "BloomingtonFootball", "NeverDaunted_IU", "HoosiersRising",
        "IU_Top25Bound", "CignettiSquad", "HoosierArmy_FB", "IndianaAllTheWay"
      ],
    },
    {
      teamName: "Miami (FL)",
      handles: [
        "TheU_IsBack305", "CanesSwagger305", "CanesFootball_MIA", "TurnoverChain_U",
        "HardRockCanes", "305GridironPride", "HurricanesElite", "MarioCristobalEra",
        "CanesNation_01", "TheU_Dominance", "CoralGables_Canes", "CanesAllDay_305"
      ],
    },
    {
      teamName: "Ohio State",
      handles: [
        "Buckeye_Blitz", "ScarletAndGray_OSU", "TheShoe_Columbus", "SilverBullets_OSU",
        "Buckeyes_Silver", "RyanDay_Bucks", "O_H_I_O_Nation", "BuckeyeEmpire_99",
        "ColumbusGridiron", "ScarletPride_OSU", "BrutusArmy", "TheOhioState_CFB"
      ],
    },
    {
      teamName: "LSU",
      handles: [
        "GeauxTigers_LSU", "DeathValley_Night", "BootCajun_LSU", "TigerStadium_BR",
        "LSU_Football19", "PurpleAndGold_LSU", "BatonRougeGridiron", "GeauxTigers24",
        "LSU_TigersNation", "BrianKelly_LSU", "BayouBengals", "CajunGridiron"
      ],
    },
    {
      teamName: "Ole Miss",
      handles: [
        "HottyToddy_Rebs", "LaneKiffin_Train", "TheGrove_Oxford", "RebelPride_Grove",
        "OleMiss_Gridiron", "RebelNation_24", "OxfordRebels_CFB", "HottyToddyNation",
        "VaughtHemingway", "Sip_Football", "RebelsOnTop", "LaneTrain_Oxford"
      ],
    },
    {
      teamName: "Texas A&M",
      handles: [
        "GigEmAggies_24", "12thMan_KyleField", "MikeElko_Aggies", "Aggieland_CFB",
        "MaroonAndWhite_TA", "KyleFieldArmy", "GigEm_Corps", "AggieFootball_12",
        "AggielandPride", "HowdyFromAggieland", "MaroonOut_TAMU", "GigEmNation"
      ],
    },
    {
      teamName: "Alabama",
      handles: [
        "RollTide_Bama", "BamaDynasty_Roll", "TuscaloosaDynasty", "BamaBuilt_18",
        "BryantDenny_Tide", "DeBoerEra_Bama", "ElephantNation_UA", "CrimsonPride_Bama",
        "RollTideRoll_92", "BamaGridiron", "TideNation_CFB", "TtownChamps"
      ],
    },
    {
      teamName: "BYU",
      handles: [
        "CougarPride_BYU", "LaVellEdwards_Cougs", "RiseAndShout_BYU", "RoyalBlueCougars",
        "ProvoGridiron_BYU", "Big12Cougs", "BYU_Football84", "CosmoArmy_BYU"
      ],
    },
    {
      teamName: "USC",
      handles: [
        "FightOn_Trojans", "USC_ColiseumLA", "TrojanPride_04", "CardAndGold_USC",
        "LincolnRiley_USC", "FightOnNation", "TrojansGridiron", "SouthernCal_CFB"
      ],
    },
    {
      teamName: "Texas Tech",
      handles: [
        "WreckEmTech", "GunsUp_Lubbock", "JonesATnTStadium", "RedRaiderNation",
        "JoeyMcGuire_TTU", "WreckEm_24", "LubbockGridiron", "RaiderPower_TTU"
      ],
    },
    {
      teamName: "Penn State",
      handles: [
        "WeAre_PennState", "WhiteoutBeaverStadium", "HappyValley_PSU", "NittanyLion_86",
        "WeAre_HappyValley", "PennStatePower", "PSU_Gridiron", "StateCollegePride"
      ],
    },
    {
      teamName: "Tennessee",
      handles: [
        "VolNavy_Neyland", "RockyTopTradition", "RockyTop_Vols98", "JoshHeupel_GBO",
        "SmokeyGrey_Vols", "NeylandLoud", "BigOrange_Knox", "VolsGridiron_24"
      ],
    },
    {
      teamName: "SMU",
      handles: [
        "PonyUpDallas_SMU", "MustangsGridiron", "GeraldJFord_SMU", "SMU_ACC_Era",
        "PonyExpress_SMU", "DallasMustangs", "PonyUp_24", "MustangPride_SMU"
      ],
    },
    {
      teamName: "Utah",
      handles: [
        "UtesRising_SLC", "RiceEccles_Mighty", "KyleWhittingham_UT", "UtahDefense_Ute",
        "HolyWar_Utes", "RedRocks_Utah", "UtesFootball_24", "SaltLakeUtes"
      ],
    },
    {
      teamName: "Iowa",
      handles: [
        "HawkeyeWave_Kinnick", "IowaHawkeyes_Def", "KinnickMagic_02", "BlackAndGold_Iowa",
        "IowaDefenseU", "HawkeyePride_IA", "KinnickStadium_Wave", "HerkyHawkeye"
      ],
    },
    {
      teamName: "Michigan",
      handles: [
        "GoBlue_Hail", "WolverineNation_23", "BigHouse_AnnArbor", "MaizeAndBlue_MICH",
        "SherroneMoore_Era", "HailToTheVictors", "MGoBlog_Michigan", "MichiganMan_CFB"
      ],
    },
    {
      teamName: "Missouri",
      handles: [
        "MizzouZOU_24", "MIZ_ZOU_Tigers", "DrinkwitzSquad", "FaurotField_Mizzou",
        "ShowMeMizzou_SEC", "MizzouTigers_MIZ", "TrumanTiger_FB", "ColumbiaPride_MIZ"
      ],
    },
    {
      teamName: "Oregon",
      handles: [
        "DuckDynasty_Autzen", "ScoDucks_Eugene", "DanLanning_Oregon", "OregonQuackAttack",
        "GreenAndYellow_UO", "AutzenLoud", "DuckFootball_24", "NikeU_Ducks"
      ],
    },
    {
      teamName: "Houston",
      handles: [
        "GoCoogs_Houston", "TDECUStadium_UH", "WillieFritz_Coogs", "HoustonCougars_FB",
        "CougarPride_HOU", "HoustonGridiron", "EatEmUpCoogs", "HTownTakeover_UH"
      ],
    },
    {
      teamName: "Louisville",
      handles: [
        "CardsFly_UofL", "JeffBrohm_Louisville", "LNStadium_Cards", "CardNation_CFB",
        "LouisvilleGridiron", "RedAndBlack_LOU", "CardsFootball24", "BirdCity_UofL"
      ],
    },
    {
      teamName: "Oklahoma",
      handles: [
        "BoomerSooner_OU", "BrentVenables_Def", "NormanGridiron_OU", "CrimsonAndCream_00",
        "SoonerMagic_SEC", "OklahomaSooners_FB", "SchroonerNation", "Boomer_Norman"
      ],
    },
    {
      teamName: "Virginia",
      handles: [
        "Wahoos_Virginia", "ScottStadium_UVA", "TonyElliott_UVA", "CavalierPride_UVA",
        "HoosFootball_24", "Charlottesville_UVA", "OrangeAndBlue_Hoos", "WahooWa_UVA"
      ],
    },
    {
      teamName: "Clemson",
      handles: [
        "DeathValley_CLEM", "DaboSwinney_Tigers", "ClemsonPawPride", "HowardRock_CU",
        "SolidOrange_Clemson", "ClemsonTigers_18", "ValleyFootball_CU", "AllInClemson"
      ],
    },
    {
      teamName: "Nebraska",
      handles: [
        "HuskerBlackshirts", "GBR_Blackshirts", "MattRhule_GBR", "MemorialStadium_Red",
        "CornhuskerPride95", "HuskerPower_Lincoln", "GBR_Nation_NEB", "SeaOfRed_Huskers"
      ],
    },
    {
      teamName: "Florida State",
      handles: [
        "NoleNation_FSU", "DoakCampbell_Noles", "Unconquered_FSU", "GarnetAndGold_FSU",
        "MikeNorvell_Noles", "Warpath_Tallahassee", "FSU_Football99", "SeminolePride_FL"
      ],
    },
    {
      teamName: "Florida",
      handles: [
        "GatorBait_Swamp", "BenHillGriffin_UF", "OrangeAndBlue_Gators", "GatorChomp_08",
        "TheSwamp_Gainesville", "GatorNation_UF", "ChompChomp_Gators", "FloridaGators_CFB"
      ],
    },
    {
      teamName: "Colorado",
      handles: [
        "CoachPrime_Buffs", "FolsomField_CU", "SkoBuffs_Boulder", "WeComing_Colorado",
        "BuffsNation_CU", "PrimeTime_Buffs", "BlackAndGold_CU", "BoulderGridiron"
      ],
    },
  ];

  // Map each handle directly to its team
  const userCreationList: Array<{
    email: string;
    username: string;
    passwordHash: string;
    role: string;
    favoriteTeamId: string;
  }> = [];

  const createdUsernames = new Set<string>();

  // Add all handcrafted handles first
  for (const template of FAN_TEMPLATES) {
    const team = getTeam(template.teamName);
    for (const handle of template.handles) {
      const cleanHandle = handle.replace(/[^a-zA-Z0-9_]/g, "").slice(0, 20);
      if (!createdUsernames.has(cleanHandle.toLowerCase())) {
        createdUsernames.add(cleanHandle.toLowerCase());
        userCreationList.push({
          email: `seed_${cleanHandle.toLowerCase()}@collegefootballranked.internal`,
          username: cleanHandle,
          passwordHash: SEED_PASSWORD_HASH,
          role: "USER",
          favoriteTeamId: team.id,
        });
      }
    }
  }

  // Generate additional numbered variants to reach exactly 1,050
  let fanIndex = 0;
  while (userCreationList.length < 1050) {
    const template = FAN_TEMPLATES[fanIndex % FAN_TEMPLATES.length];
    const team = getTeam(template.teamName);
    const baseHandle = template.handles[fanIndex % template.handles.length];
    const num = Math.floor(userCreationList.length / FAN_TEMPLATES.length) + 1;
    const cleanHandle = `${baseHandle.slice(0, 16)}_${num}`.slice(0, 20);

    if (!createdUsernames.has(cleanHandle.toLowerCase())) {
      createdUsernames.add(cleanHandle.toLowerCase());
      userCreationList.push({
        email: `seed_${cleanHandle.toLowerCase()}_${userCreationList.length}@collegefootballranked.internal`,
        username: cleanHandle,
        passwordHash: SEED_PASSWORD_HASH,
        role: "USER",
        favoriteTeamId: team.id,
      });
    }
    fanIndex++;
  }

  // Insert seed users in batches of 200
  for (let i = 0; i < userCreationList.length; i += 200) {
    await prisma.user.createMany({
      data: userCreationList.slice(i, i + 200),
      skipDuplicates: true,
    });
  }

  const allSeedUsers = await prisma.user.findMany({
    where: { email: { contains: "@collegefootballranked.internal" } },
    include: { favoriteTeam: true },
  });

  console.log(`Created ${allSeedUsers.length} verified seed users.`);

  // 5. Official Weekly AP Baselines (Clean, verified Top 25 programs)
  // Week 1 AP Baseline (25 legitimate contenders)
  const week1APNames = [
    "Texas", "Georgia", "Ohio State", "Alabama", "Notre Dame",
    "Ole Miss", "Oregon", "Penn State", "Miami (FL)", "Michigan",
    "Missouri", "Utah", "LSU", "Tennessee", "Oklahoma",
    "Oklahoma State", "Kansas State", "Texas A&M", "Arizona", "Clemson",
    "Iowa", "Louisville", "Indiana", "BYU", "USC"
  ];

  // Week 2 AP Baseline
  const week2APNames = [
    "Texas", "Georgia", "Notre Dame", "Miami (FL)", "Ohio State",
    "Alabama", "Ole Miss", "Indiana", "LSU", "Texas A&M",
    "Penn State", "Tennessee", "BYU", "USC", "Utah",
    "Texas Tech", "Iowa", "Missouri", "Oregon", "Michigan",
    "SMU", "Oklahoma", "Louisville", "Houston", "Virginia"
  ];

  // Week 3 AP Baseline (Live 2026 AP Top 25)
  const week3APNames = [
    "Texas", "Georgia", "Notre Dame", "Indiana", "Miami (FL)",
    "Ohio State", "LSU", "Ole Miss", "Texas A&M", "Alabama",
    "BYU", "USC", "Texas Tech", "Penn State", "Tennessee",
    "SMU", "Utah", "Iowa", "Michigan", "Missouri",
    "Oregon", "Houston", "Louisville", "Oklahoma", "Virginia"
  ];

  const week1APIds = week1APNames.map((name) => getTeam(name).id);
  const week2APIds = week2APNames.map((name) => getTeam(name).id);
  const week3APIds = week3APNames.map((name) => getTeam(name).id);

  // Box-Muller transform for standard normal random number
  function randn(): number {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  }

  // Helper to generate a ballot with diversified 1st place votes while preserving weekly consensus order
  function generateDiversifiedBallot(official25Ids: string[], userFavoriteTeamId?: string | null): string[] {
    const listWithNoise = official25Ids.map((teamId, index) => {
      // Top contenders have a calibrated baseline spread so 1st-place votes are shared naturally
      let baseScore: number;
      if (index === 0) baseScore = 1000;
      else if (index === 1) baseScore = 974;
      else if (index === 2) baseScore = 950;
      else if (index === 3) baseScore = 926;
      else if (index === 4) baseScore = 902;
      else if (index === 5) baseScore = 878;
      else baseScore = 878 - (index - 5) * 32;

      let noise = randn() * 26;
      // Slight fan loyalty bump if user favorite team is among the top 5 contenders
      if (userFavoriteTeamId && teamId === userFavoriteTeamId && index <= 5) {
        noise += 12;
      }

      return { teamId, score: baseScore + noise };
    });

    listWithNoise.sort((a, b) => b.score - a.score);
    return listWithNoise.map((item) => item.teamId);
  }

  // 6. Generate ~1,000 Ballots per Week
  const weekConfigs = [
    { week: week1, baseline: week1APIds, count: 1024, isHistoric: true },
    { week: week2, baseline: week2APIds, count: 1068, isHistoric: true },
    { week: week3, baseline: week3APIds, count: 1015, isHistoric: false },
  ];

  for (const cfg of weekConfigs) {
    console.log(`Generating ${cfg.count} ballots for ${cfg.week.title}...`);

    const usersForWeek = allSeedUsers.slice(0, cfg.count);

    const ballotsData = usersForWeek.map((u) => ({
      userId: u.id,
      weekId: cfg.week.id,
      isOfficial: true,
      submittedAt: new Date(Date.now() - (cfg.isHistoric ? 86400000 * 7 : 3600000 * 6)),
    }));

    await prisma.ballot.createMany({
      data: ballotsData,
      skipDuplicates: true,
    });

    const createdBallots = await prisma.ballot.findMany({
      where: {
        weekId: cfg.week.id,
        user: { email: { contains: "@collegefootballranked.internal" } },
      },
      select: {
        id: true,
        user: { select: { favoriteTeamId: true } },
      },
    });

    const ballotItemsData: Array<{
      ballotId: string;
      teamId: string;
      rank: number;
    }> = [];

    for (const b of createdBallots) {
      const rankedIds = generateDiversifiedBallot(cfg.baseline, b.user.favoriteTeamId);
      rankedIds.forEach((teamId, index) => {
        ballotItemsData.push({
          ballotId: b.id,
          teamId,
          rank: index + 1,
        });
      });
    }

    // Batch insert items in chunks of 5000
    for (let i = 0; i < ballotItemsData.length; i += 5000) {
      await prisma.ballotItem.createMany({
        data: ballotItemsData.slice(i, i + 5000),
        skipDuplicates: true,
      });
    }

    // Compute and materialize consensus ranking
    await calculateWeekConsensus(cfg.week.id);
    console.log(`Consensus materialized for ${cfg.week.title}`);
  }

  // 7. Seed Authentic 2026 CFB Comments with EXACT Fanbase Alignment
  console.log("Seeding current-season CFB banter and rage-bait comments...");

  const findUserByTeam = (teamName: string, preferredHandleSub?: string) => {
    const team = getTeam(teamName);
    const teamUsers = allSeedUsers.filter((u) => u.favoriteTeamId === team.id);
    if (preferredHandleSub) {
      const match = teamUsers.find((u) =>
        u.username.toLowerCase().includes(preferredHandleSub.toLowerCase())
      );
      if (match) return match;
    }
    return teamUsers[Math.floor(Math.random() * teamUsers.length)] || allSeedUsers[0];
  };

  interface CommentEntry {
    team: string;
    handleSub?: string;
    content: string;
    likes: number;
    hoursAgo: number;
    replies?: Array<{
      team: string;
      handleSub?: string;
      content: string;
      likes: number;
      hoursAgo: number;
    }>;
  }

  const week1Comments: CommentEntry[] = [
    {
      team: "Texas",
      handleSub: "HookEm",
      content: "Texas taking the #1 spot to kick off the season! Returning the most dominant offensive line in the country and controlling the trenches. Looking ready for the SEC gauntlet.",
      likes: 88,
      hoursAgo: 168,
      replies: [
        {
          team: "Georgia",
          handleSub: "Dawg",
          content: "Enjoy holding the #1 spot while it lasts. Kirby's defense gave up under 14 points a game and returns almost the entire front seven. See y'all in Austin.",
          likes: 72,
          hoursAgo: 165,
        },
        {
          team: "Texas",
          handleSub: "Longhorn",
          content: "Schedule difficulty will tell all by October. The battle at the line of scrimmage is going to decide who stays at #1.",
          likes: 54,
          hoursAgo: 162,
        },
      ],
    },
    {
      team: "Indiana",
      handleSub: "Cignetti",
      content: "Indiana starting at #23 in the national poll! The turnaround under this coaching staff is unbelievable. Offensive tempo and turnover margin were elite in the opener.",
      likes: 95,
      hoursAgo: 170,
      replies: [
        {
          team: "Ohio State",
          handleSub: "Buckeye",
          content: "Credit to Indiana for bringing real energy, but let's see how the depth holds up once Big Ten conference play ramps up on the road.",
          likes: 46,
          hoursAgo: 166,
        },
        {
          team: "Indiana",
          handleSub: "Hoosier",
          content: "Don't underestimate this defensive front and play-calling. We're not just happy to be here.",
          likes: 58,
          hoursAgo: 163,
        },
      ],
    },
    {
      team: "Miami (FL)",
      handleSub: "Canes",
      content: "Miami cracking the top 10 after that dominant road win! The offense is putting up 45+ points with zero turnovers. ACC title or bust this year.",
      likes: 81,
      hoursAgo: 172,
      replies: [
        {
          team: "Florida State",
          handleSub: "Nole",
          content: "It's Week 1. Every September Miami crowns themselves national champions after beating an unranked opponent. Let's see how they handle road hostile environments.",
          likes: 63,
          hoursAgo: 169,
        },
        {
          team: "Miami (FL)",
          handleSub: "TheU",
          content: "Look at the offensive efficiency ratings and pressure rate on defense. This front seven is completely transformed.",
          likes: 49,
          hoursAgo: 164,
        },
      ],
    },
    {
      team: "Alabama",
      handleSub: "RollTide",
      content: "People thought there would be a drop-off, but this offense looks even more explosive with modern route concepts and vertical passing. Dynasty is alive and well.",
      likes: 69,
      hoursAgo: 160,
      replies: [
        {
          team: "LSU",
          handleSub: "Geaux",
          content: "Winning non-conference blowouts is easy. Wait until November in Death Valley under the lights.",
          likes: 52,
          hoursAgo: 156,
        },
      ],
    },
    {
      team: "Notre Dame",
      handleSub: "Irish",
      content: "Solid top 5 ranking for the Irish. The defense is easily top 3 in yards allowed per play. With the 12-team playoff, our independent schedule is built for a deep run.",
      likes: 57,
      hoursAgo: 158,
      replies: [
        {
          team: "USC",
          handleSub: "FightOn",
          content: "Top 5 is generous with that schedule. If you drop one early game without a conference championship game to fall back on, things get dicey.",
          likes: 41,
          hoursAgo: 154,
        },
      ],
    },
  ];

  const week2Comments: CommentEntry[] = [
    {
      team: "Indiana",
      handleSub: "Hoosier",
      content: "INDIANA JUMPS INTO THE TOP 10! 2-0 and outscoring opponents by 35+ a game. The defense hasn't given up a 2nd half touchdown yet. Put some respect on Bloomington!",
      likes: 124,
      hoursAgo: 96,
      replies: [
        {
          team: "Michigan",
          handleSub: "GoBlue",
          content: "Indiana in the top 10 before Michigan is wild, but honestly y'all look legit on tape. Pure execution on both sides of the ball.",
          likes: 83,
          hoursAgo: 92,
        },
        {
          team: "Ohio State",
          handleSub: "Buckeye",
          content: "Their turnover differential is +6 through two weeks. That kind of efficiency wins games regardless of brand name.",
          likes: 62,
          hoursAgo: 88,
        },
      ],
    },
    {
      team: "Miami (FL)",
      handleSub: "TheU",
      content: "Miami up to #4! Top 5 in scoring offense and top 10 in rush defense. We should honestly be ranked ahead of Notre Dame based on margin of victory and explosive play rate.",
      likes: 110,
      hoursAgo: 94,
      replies: [
        {
          team: "Notre Dame",
          handleSub: "Irish",
          content: "Margin of victory against non-Power 4 teams doesn't mean much. Our strength of record and third-down stop rate are way higher.",
          likes: 76,
          hoursAgo: 91,
        },
        {
          team: "Clemson",
          handleSub: "DeathValley",
          content: "The ACC is going to come down to whoever controls the line of scrimmage in November. Don't crown yourselves early.",
          likes: 39,
          hoursAgo: 90,
        },
      ],
    },
    {
      team: "Texas A&M",
      handleSub: "GigEm",
      content: "Mike Elko has Texas A&M playing physical, disciplined football. Top 10 ranking is earned. Physical run game and suffocating front seven. Kyle Field is going to be rocking.",
      likes: 78,
      hoursAgo: 85,
      replies: [
        {
          team: "Texas",
          handleSub: "HookEm",
          content: "Enjoy #10, but the Lone Star Showdown in November will settle who actually runs the state.",
          likes: 64,
          hoursAgo: 81,
        },
      ],
    },
    {
      team: "BYU",
      handleSub: "Cougar",
      content: "BYU climbing to #13! Best defense in the Big 12 right now, creating turnovers on every third drive. The conference championship path goes through Provo.",
      likes: 71,
      hoursAgo: 82,
      replies: [
        {
          team: "Utah",
          handleSub: "Utes",
          content: "Utah's defense has allowed fewer red-zone trips. The Holy War in November is going to decide who gets that Big 12 playoff bye.",
          likes: 84,
          hoursAgo: 79,
        },
      ],
    },
    {
      team: "Ohio State",
      handleSub: "Scarlet",
      content: "Defense gave up only 9 points and 180 total yards. The defensive line is winning every snap. Once the red zone offense finishes drives, this is the top team in America.",
      likes: 92,
      hoursAgo: 80,
      replies: [
        {
          team: "Penn State",
          handleSub: "WeAre",
          content: "How is Ohio State still sitting at #5 after struggling for three quarters against an unranked team? Poll inertia is crazy.",
          likes: 71,
          hoursAgo: 77,
        },
      ],
    },
  ];

  const week3Comments: CommentEntry[] = [
    {
      team: "Indiana",
      handleSub: "Cignetti",
      content: "INDIANA AT #4 IN THE NATION! Look at that top 4: Texas, Georgia, Notre Dame, INDIANA. Highest ranking in school history and every metric backs it up!",
      likes: 145,
      hoursAgo: 14,
      replies: [
        {
          team: "Ohio State",
          handleSub: "Buckeye",
          content: "Honestly, the eye test and analytics both agree. They lead the nation in scoring differential and third-down conversion rate. Total respect.",
          likes: 98,
          hoursAgo: 11,
        },
        {
          team: "Penn State",
          handleSub: "Nittany",
          content: "Indiana vs Penn State is going to be an absolute war this year. Big Ten is loaded with top-tier contenders.",
          likes: 74,
          hoursAgo: 9,
        },
      ],
    },
    {
      team: "Texas",
      handleSub: "HookEm",
      content: "Holding strong at #1! Most complete roster in the country with elite depth across the board and multiple top-25 wins. Texas is the team to beat.",
      likes: 132,
      hoursAgo: 16,
      replies: [
        {
          team: "Georgia",
          handleSub: "Kirby",
          content: "Rankings in September don't award trophies. Georgia has faced the tougher strength of schedule and our red zone defense is #1 in the country.",
          likes: 115,
          hoursAgo: 12,
        },
        {
          team: "Alabama",
          handleSub: "RollTide",
          content: "Don't sleep on the rest of the SEC. Whoever survives the conference schedule will have the rightful claim to #1.",
          likes: 68,
          hoursAgo: 8,
        },
      ],
    },
    {
      team: "Miami (FL)",
      handleSub: "Canes",
      content: "Top 5 Miami is glorious. Leading the country in passing efficiency and explosive red-zone scoring. ACC belongs to the Canes.",
      likes: 96,
      hoursAgo: 15,
    },
    {
      team: "LSU",
      handleSub: "Geaux",
      content: "LSU sitting at #7 with the most efficient red-zone offense in the country. Our pass rush is getting home and Death Valley at night is ready.",
      likes: 87,
      hoursAgo: 13,
      replies: [
        {
          team: "Ole Miss",
          handleSub: "LaneKiffin",
          content: "Ole Miss right behind at #8 averaging over 500 yards of total offense per game. Magnolia Bowl is basically a playoff elimination game.",
          likes: 79,
          hoursAgo: 10,
        },
      ],
    },
    {
      team: "Texas Tech",
      handleSub: "WreckEm",
      content: "Texas Tech in the top 13! Big 12 is chaotic this year, and our fourth-down aggression and special teams are giving us the edge.",
      likes: 82,
      hoursAgo: 7,
    },
    {
      team: "SMU",
      handleSub: "PonyUp",
      content: "Ranked #16 in our first year in the ACC! Top 15 offense in passing efficiency and forcing 3 turnovers a game. Putting the entire conference on notice.",
      likes: 77,
      hoursAgo: 6,
    },
    {
      team: "Houston",
      handleSub: "Coogs",
      content: "Houston at #22! The defensive turnaround here has been incredible. Holding opponents under 3 yards per carry.",
      likes: 64,
      hoursAgo: 5,
    },
    {
      team: "Virginia",
      handleSub: "Wahoos",
      content: "UVA at #25! Unbeaten start and entering the national poll. Disciplined football and winning close fourth quarters pays off.",
      likes: 71,
      hoursAgo: 4,
      replies: [
        {
          team: "Miami (FL)",
          handleSub: "Canes",
          content: "Virginia looking solid, but ACC conference play will separate the true contenders from early surprises.",
          likes: 45,
          hoursAgo: 2,
        },
      ],
    },
  ];

  // Helper to insert comments with replies and likes
  async function insertCleanComments(weekId: string, comments: CommentEntry[]) {
    for (const item of comments) {
      const parentUser = findUserByTeam(item.team, item.handleSub);
      const createdAt = new Date(Date.now() - item.hoursAgo * 3600000);

      const parentComment = await prisma.comment.create({
        data: {
          weekId,
          userId: parentUser.id,
          content: item.content,
          createdAt,
        },
      });

      // Add likes from random other seed users
      const likers = allSeedUsers
        .filter((u) => u.id !== parentUser.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, item.likes);

      if (likers.length > 0) {
        await prisma.commentLike.createMany({
          data: likers.map((u) => ({
            commentId: parentComment.id,
            userId: u.id,
            createdAt,
          })),
          skipDuplicates: true,
        });
      }

      // Add replies if any
      if (item.replies && item.replies.length > 0) {
        for (const rep of item.replies) {
          const repUser = findUserByTeam(rep.team, rep.handleSub);
          const repCreatedAt = new Date(Date.now() - rep.hoursAgo * 3600000);

          const childComment = await prisma.comment.create({
            data: {
              weekId,
              userId: repUser.id,
              parentId: parentComment.id,
              content: rep.content,
              createdAt: repCreatedAt,
            },
          });

          const repLikers = allSeedUsers
            .filter((u) => u.id !== repUser.id)
            .sort(() => 0.5 - Math.random())
            .slice(0, rep.likes);

          if (repLikers.length > 0) {
            await prisma.commentLike.createMany({
              data: repLikers.map((u) => ({
                commentId: childComment.id,
                userId: u.id,
                createdAt: repCreatedAt,
              })),
              skipDuplicates: true,
            });
          }
        }
      }
    }
  }

  await insertCleanComments(week1.id, week1Comments);
  await insertCleanComments(week2.id, week2Comments);
  await insertCleanComments(week3.id, week3Comments);

  console.log("=== CFR COMMUNITY SEEDING FINISHED SUCCESSFULLY ===");
  return {
    success: true,
    totalSeedUsers: allSeedUsers.length,
    weeksSeeded: ["Week 1", "Week 2", "Week 3"],
  };
}

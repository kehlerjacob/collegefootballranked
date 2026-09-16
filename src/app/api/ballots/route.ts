import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { calculateWeekConsensus, autoAdvanceExpiredWeeks } from "@/lib/rankings-engine";
import { z } from "zod";

const ballotSubmissionSchema = z.object({
  weekId: z.string().min(1, "Week ID is required"),
  ranks: z
    .array(
      z.object({
        rank: z.number().int().min(1).max(25),
        teamId: z.string().min(1, "Team ID is required"),
      })
    )
    .length(25, "Ballot must rank exactly 25 teams"),
});

export async function GET(request: Request) {
  try {
    await autoAdvanceExpiredWeeks();
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const weekId = searchParams.get("weekId");
    const weekNumberStr = searchParams.get("weekNumber");

    let targetWeekId = weekId;

    if (!targetWeekId && weekNumberStr) {
      const weekNum = parseInt(weekNumberStr, 10);
      const week = await prisma.week.findFirst({
        where: {
          weekNumber: weekNum,
          season: { isCurrent: true },
        },
      });
      if (week) targetWeekId = week.id;
    }

    if (!targetWeekId) {
      return NextResponse.json(
        { error: "weekId or weekNumber is required" },
        { status: 400 }
      );
    }

    const ballot = await prisma.ballot.findUnique({
      where: {
        userId_weekId: {
          userId: user.userId,
          weekId: targetWeekId,
        },
      },
      include: {
        items: {
          orderBy: { rank: "asc" },
          include: {
            team: true,
          },
        },
        week: {
          select: {
            id: true,
            weekNumber: true,
            title: true,
            status: true,
            votingDeadline: true,
          },
        },
      },
    });

    return NextResponse.json({ ballot });
  } catch (error) {
    console.error("Fetch ballot error:", error);
    return NextResponse.json(
      { error: "Failed to fetch ballot" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "You must be logged in to submit a ballot" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const result = ballotSubmissionSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Invalid ballot format" },
        { status: 400 }
      );
    }

    const { weekId, ranks } = result.data;

    // Advance any expired weeks before checking this ballot
    await autoAdvanceExpiredWeeks();

    // Check week status and deadline
    const week = await prisma.week.findUnique({
      where: { id: weekId },
    });

    if (!week) {
      return NextResponse.json({ error: "Week not found" }, { status: 404 });
    }

    if (week.status !== "OPEN") {
      return NextResponse.json(
        { error: `Voting for ${week.title} is currently ${week.status.toLowerCase()}` },
        { status: 400 }
      );
    }

    if (week.votingDeadline && new Date() > week.votingDeadline) {
      return NextResponse.json(
        { error: `The voting deadline for ${week.title} has passed` },
        { status: 400 }
      );
    }

    // Validate unique ranks 1..25
    const rankSet = new Set(ranks.map((r) => r.rank));
    if (rankSet.size !== 25) {
      return NextResponse.json(
        { error: "Ballot must contain unique ranks from 1 to 25" },
        { status: 400 }
      );
    }

    // Validate unique team IDs
    const teamSet = new Set(ranks.map((r) => r.teamId));
    if (teamSet.size !== 25) {
      return NextResponse.json(
        { error: "Ballot cannot contain duplicate teams" },
        { status: 400 }
      );
    }

    // Verify all teams exist in database
    const teamCount = await prisma.team.count({
      where: {
        id: { in: Array.from(teamSet) },
      },
    });

    if (teamCount !== 25) {
      return NextResponse.json(
        { error: "One or more selected teams are invalid" },
        { status: 400 }
      );
    }

    // Upsert the single ballot per user per week
    const ballot = await prisma.ballot.upsert({
      where: {
        userId_weekId: {
          userId: user.userId,
          weekId: week.id,
        },
      },
      update: {
        updatedAt: new Date(),
      },
      create: {
        userId: user.userId,
        weekId: week.id,
      },
    });

    // Delete existing ballot items and recreate to ensure clean atomic save
    await prisma.ballotItem.deleteMany({
      where: { ballotId: ballot.id },
    });

    await prisma.ballotItem.createMany({
      data: ranks.map((r) => ({
        ballotId: ballot.id,
        rank: r.rank,
        teamId: r.teamId,
      })),
    });

    // Automatically recalculate consensus rankings for this week
    await calculateWeekConsensus(week.id);

    return NextResponse.json({
      success: true,
      message: `Your Top 25 ballot for ${week.title} has been submitted successfully!`,
      ballotId: ballot.id,
    });
  } catch (error) {
    console.error("Ballot submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit ballot" },
      { status: 500 }
    );
  }
}

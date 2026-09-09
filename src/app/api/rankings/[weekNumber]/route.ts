import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ weekNumber: string }> }
) {
  try {
    const { weekNumber: weekNumberParam } = await params;
    const weekNumber = parseInt(weekNumberParam, 10);

    if (isNaN(weekNumber)) {
      return NextResponse.json(
        { error: "Invalid week number" },
        { status: 400 }
      );
    }

    const week = await prisma.week.findFirst({
      where: {
        weekNumber,
        season: { isCurrent: true },
      },
      include: {
        consensusRanks: {
          orderBy: { rank: "asc" },
          include: {
            team: true,
          },
        },
        _count: {
          select: { ballots: true },
        },
      },
    });

    if (!week) {
      return NextResponse.json({ error: "Week not found" }, { status: 404 });
    }

    const totalVotes = week.consensusRanks.reduce(
      (sum, item) => sum + item.points,
      0
    );

    const rankings = week.consensusRanks.map((item) => ({
      rank: item.rank,
      name: item.team.name,
      shortName: item.team.shortName,
      conference: item.team.conference,
      record: item.team.record,
      points: item.points,
      firstPlaceVotes: item.firstPlaceVotes,
      trend: item.trend as "up" | "down" | "same" | "new",
      trendValue: item.trendValue ?? undefined,
      primaryColor: item.team.primaryColor,
      logoUrl: item.team.logoUrl,
    }));

    return NextResponse.json({
      week: {
        id: week.id,
        weekNumber: week.weekNumber,
        title: week.title,
        status: week.status,
        votingDeadline: week.votingDeadline,
        totalBallots: week._count.ballots,
        totalPointsAwarded: totalVotes,
      },
      rankings,
    });
  } catch (error) {
    console.error("Rankings fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch rankings" },
      { status: 500 }
    );
  }
}

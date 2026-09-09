import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const season = await prisma.season.findFirst({
      where: { isCurrent: true },
      include: {
        weeks: {
          orderBy: { weekNumber: "asc" },
          select: {
            id: true,
            weekNumber: true,
            title: true,
            status: true,
            votingDeadline: true,
            _count: {
              select: {
                ballots: true,
                consensusRanks: true,
              },
            },
          },
        },
      },
    });

    if (!season) {
      return NextResponse.json({ season: null, weeks: [] });
    }

    return NextResponse.json({
      seasonYear: season.year,
      weeks: season.weeks,
    });
  } catch (error) {
    console.error("Weeks fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch weeks" },
      { status: 500 }
    );
  }
}

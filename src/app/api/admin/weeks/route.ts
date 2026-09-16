import { NextResponse } from "next/server";
import { getCurrentUser, isUserAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { calculateWeekConsensus, autoAdvanceExpiredWeeks } from "@/lib/rankings-engine";

// PATCH /api/admin/weeks - Update a week's status or recalculate consensus
export async function PATCH(request: Request) {
  try {
    const sessionUser = await getCurrentUser();
    if (!sessionUser || !isUserAdmin(sessionUser.email, sessionUser.role)) {
      return NextResponse.json(
        { error: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { weekId, status, votingDeadline, recalculate } = body;

    if (!weekId) {
      return NextResponse.json(
        { error: "weekId is required" },
        { status: 400 }
      );
    }

    const week = await prisma.week.findUnique({
      where: { id: weekId },
    });

    if (!week) {
      return NextResponse.json({ error: "Week not found" }, { status: 404 });
    }

    const updateData: any = {};
    if (status) {
      updateData.status = status;
    }
    if (votingDeadline !== undefined) {
      updateData.votingDeadline = votingDeadline ? new Date(votingDeadline) : null;
    }

    if (Object.keys(updateData).length > 0) {
      await prisma.week.update({
        where: { id: weekId },
        data: updateData,
      });
    }

    let consensusResult = null;
    if (recalculate || status === "PUBLISHED") {
      consensusResult = await calculateWeekConsensus(weekId);
    }

    const updatedWeek = await prisma.week.findUnique({
      where: { id: weekId },
      include: {
        _count: {
          select: {
            ballots: true,
            consensusRanks: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      week: updatedWeek,
      consensusResult,
    });
  } catch (error) {
    console.error("Admin week update error:", error);
    return NextResponse.json(
      { error: "Internal server error updating week" },
      { status: 500 }
    );
  }
}

// POST /api/admin/weeks - Trigger automated week advance based on deadlines
export async function POST() {
  try {
    const sessionUser = await getCurrentUser();
    if (!sessionUser || !isUserAdmin(sessionUser.email, sessionUser.role)) {
      return NextResponse.json(
        { error: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    const result = await autoAdvanceExpiredWeeks();

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("Admin auto advance error:", error);
    return NextResponse.json(
      { error: "Internal server error auto-advancing weeks" },
      { status: 500 }
    );
  }
}

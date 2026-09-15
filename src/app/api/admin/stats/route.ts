import { NextResponse } from "next/server";
import { getCurrentUser, isUserAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const sessionUser = await getCurrentUser();
    if (!sessionUser || !isUserAdmin(sessionUser.email, sessionUser.role)) {
      return NextResponse.json(
        { error: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    // 1. Core Summary Metrics
    const [
      totalUsers,
      totalBallots,
      totalComments,
      totalLikes,
      users,
      weeksWithBallots,
      allComments,
      favoriteTeamStats,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.ballot.count(),
      prisma.comment.count(),
      prisma.commentLike.count(),
      // All users with activity stats
      prisma.user.findMany({
        select: {
          id: true,
          email: true,
          username: true,
          role: true,
          createdAt: true,
          favoriteTeam: {
            select: {
              id: true,
              name: true,
              shortName: true,
              logoUrl: true,
              primaryColor: true,
              conference: true,
            },
          },
          _count: {
            select: {
              ballots: true,
              comments: true,
              commentLikes: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      // Weeks with ballot counts
      prisma.week.findMany({
        select: {
          id: true,
          title: true,
          weekNumber: true,
          status: true,
          votingDeadline: true,
          _count: {
            select: {
              ballots: true,
              comments: true,
            },
          },
        },
        orderBy: { weekNumber: "asc" },
      }),
      // Recent comments for moderation table
      prisma.comment.findMany({
        take: 100,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          content: true,
          parentId: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              username: true,
              email: true,
              role: true,
              favoriteTeam: {
                select: {
                  id: true,
                  name: true,
                  shortName: true,
                  logoUrl: true,
                  primaryColor: true,
                },
              },
            },
          },
          week: {
            select: {
              id: true,
              title: true,
              weekNumber: true,
            },
          },
          _count: {
            select: {
              likes: true,
              replies: true,
            },
          },
        },
      }),
      // Favorite teams grouping
      prisma.team.findMany({
        where: {
          fans: {
            some: {},
          },
        },
        select: {
          id: true,
          name: true,
          shortName: true,
          logoUrl: true,
          primaryColor: true,
          conference: true,
          _count: {
            select: {
              fans: true,
            },
          },
        },
        orderBy: {
          fans: {
            _count: "desc",
          },
        },
        take: 15,
      }),
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        totalBallots,
        totalComments,
        totalLikes,
      },
      users,
      weeks: weeksWithBallots,
      comments: allComments,
      favoriteTeams: favoriteTeamStats,
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json(
      { error: "Internal server error fetching admin stats" },
      { status: 500 }
    );
  }
}

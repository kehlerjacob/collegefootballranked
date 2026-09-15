import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { z } from "zod";

const createCommentSchema = z.object({
  weekId: z.string().min(1, "Week ID is required"),
  content: z
    .string()
    .trim()
    .min(1, "Comment cannot be empty")
    .max(500, "Comment cannot exceed 500 characters"),
  parentId: z.string().optional().nullable(),
});

export async function GET(request: Request) {
  try {
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

    const currentUser = await getCurrentUser();
    const currentUserId = currentUser?.userId;

    // Fetch top-level comments with replies and like status
    const rawComments = await prisma.comment.findMany({
      where: {
        weekId: targetWeekId,
        parentId: null,
      },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { id: true, username: true, role: true },
        },
        _count: {
          select: { likes: true, replies: true },
        },
        likes: currentUserId
          ? {
              where: { userId: currentUserId },
              select: { id: true },
            }
          : false,
        replies: {
          orderBy: { createdAt: "asc" },
          include: {
            user: {
              select: { id: true, username: true, role: true },
            },
            _count: {
              select: { likes: true },
            },
            likes: currentUserId
              ? {
                  where: { userId: currentUserId },
                  select: { id: true },
                }
              : false,
          },
        },
      },
    });

    const comments = rawComments.map((c) => ({
      id: c.id,
      content: c.content,
      userId: c.userId,
      username: c.user.username,
      userRole: c.user.role,
      createdAt: c.createdAt.toISOString(),
      likeCount: c._count.likes,
      replyCount: c._count.replies,
      hasLiked: currentUserId ? (c.likes?.length ?? 0) > 0 : false,
      replies: c.replies.map((r) => ({
        id: r.id,
        content: r.content,
        userId: r.userId,
        username: r.user.username,
        userRole: r.user.role,
        parentId: c.id,
        createdAt: r.createdAt.toISOString(),
        likeCount: r._count.likes,
        hasLiked: currentUserId ? (r.likes?.length ?? 0) > 0 : false,
      })),
    }));

    const totalCount = await prisma.comment.count({
      where: { weekId: targetWeekId },
    });

    return NextResponse.json({ comments, totalCount });
  } catch (error) {
    console.error("Fetch comments error:", error);
    return NextResponse.json(
      { error: "Failed to load comments" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Please sign in to post a comment" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const result = createCommentSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Invalid comment format" },
        { status: 400 }
      );
    }

    const { weekId, content, parentId } = result.data;

    // Check week existence
    const week = await prisma.week.findUnique({
      where: { id: weekId },
    });

    if (!week) {
      return NextResponse.json({ error: "Week not found" }, { status: 404 });
    }

    // If parentId provided, ensure parent comment exists
    if (parentId) {
      const parent = await prisma.comment.findUnique({
        where: { id: parentId },
      });
      if (!parent || parent.weekId !== weekId) {
        return NextResponse.json(
          { error: "Parent comment not found" },
          { status: 404 }
        );
      }
    }

    const newComment = await prisma.comment.create({
      data: {
        content,
        userId: user.userId,
        weekId,
        parentId: parentId || null,
      },
      include: {
        user: {
          select: { id: true, username: true, role: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      comment: {
        id: newComment.id,
        content: newComment.content,
        userId: newComment.userId,
        username: newComment.user.username,
        userRole: newComment.user.role,
        parentId: newComment.parentId,
        createdAt: newComment.createdAt.toISOString(),
        likeCount: 0,
        replyCount: 0,
        hasLiked: false,
        replies: [],
      },
    });
  } catch (error) {
    console.error("Post comment error:", error);
    return NextResponse.json(
      { error: "Failed to post comment" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ commentId: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Please sign in to like comments" },
        { status: 401 }
      );
    }

    const { commentId } = await params;

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return NextResponse.json(
        { error: "Comment not found" },
        { status: 404 }
      );
    }

    // Check if like exists
    const existingLike = await prisma.commentLike.findUnique({
      where: {
        commentId_userId: {
          commentId,
          userId: user.userId,
        },
      },
    });

    let hasLiked: boolean;

    if (existingLike) {
      // Unlike
      await prisma.commentLike.delete({
        where: { id: existingLike.id },
      });
      hasLiked = false;
    } else {
      // Like
      await prisma.commentLike.create({
        data: {
          commentId,
          userId: user.userId,
        },
      });
      hasLiked = true;
    }

    const likeCount = await prisma.commentLike.count({
      where: { commentId },
    });

    return NextResponse.json({
      success: true,
      hasLiked,
      likeCount,
    });
  } catch (error) {
    console.error("Like comment error:", error);
    return NextResponse.json(
      { error: "Failed to toggle like" },
      { status: 500 }
    );
  }
}

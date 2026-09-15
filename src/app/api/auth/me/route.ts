import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const sessionUser = await getCurrentUser();
  if (!sessionUser) {
    return NextResponse.json({ user: null });
  }

  const user = await prisma.user.findUnique({
    where: { id: sessionUser.userId },
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
      ballots: {
        select: {
          weekId: true,
          submittedAt: true,
        },
      },
    },
  });

  return NextResponse.json({ user });
}

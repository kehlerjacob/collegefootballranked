import { NextResponse } from "next/server";
import { getCurrentUser, isUserAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const sessionUser = await getCurrentUser();
  if (!sessionUser) {
    return NextResponse.json({ user: null });
  }

  let user = await prisma.user.findUnique({
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

  if (user && isUserAdmin(user.email, user.role) && user.role !== "ADMIN") {
    await prisma.user.update({
      where: { id: user.id },
      data: { role: "ADMIN" },
    });
    user.role = "ADMIN";
  }

  return NextResponse.json({ user });
}

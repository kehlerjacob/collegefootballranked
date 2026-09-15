import { NextResponse } from "next/server";
import { getCurrentUser, hashPassword, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const updateTeamSchema = z.object({
  favoriteTeamId: z.string().min(1, "Please select a valid team"),
});

const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

export async function PATCH(request: Request) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { action } = body;

    if (action === "CHANGE_TEAM") {
      const parsed = updateTeamSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json(
          { error: parsed.error.issues[0]?.message || "Invalid team selection" },
          { status: 400 }
        );
      }

      const team = await prisma.team.findUnique({
        where: { id: parsed.data.favoriteTeamId },
      });

      if (!team) {
        return NextResponse.json({ error: "Team not found" }, { status: 404 });
      }

      const updatedUser = await prisma.user.update({
        where: { id: session.userId },
        data: { favoriteTeamId: team.id },
        select: {
          id: true,
          email: true,
          username: true,
          role: true,
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
        },
      });

      return NextResponse.json({
        success: true,
        message: `Favorite team updated to ${team.name}!`,
        user: updatedUser,
      });
    }

    if (action === "CHANGE_PASSWORD") {
      const parsed = updatePasswordSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json(
          { error: parsed.error.issues[0]?.message || "Invalid password input" },
          { status: 400 }
        );
      }

      const user = await prisma.user.findUnique({
        where: { id: session.userId },
      });

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      const isMatch = await verifyPassword(
        parsed.data.currentPassword,
        user.passwordHash
      );

      if (!isMatch) {
        return NextResponse.json(
          { error: "Incorrect current password" },
          { status: 400 }
        );
      }

      const newPasswordHash = await hashPassword(parsed.data.newPassword);

      await prisma.user.update({
        where: { id: user.id },
        data: { passwordHash: newPasswordHash },
      });

      return NextResponse.json({
        success: true,
        message: "Password changed successfully!",
      });
    }

    return NextResponse.json({ error: "Invalid action specified" }, { status: 400 });
  } catch (error) {
    console.error("Settings update error:", error);
    return NextResponse.json(
      { error: "Internal server error updating settings" },
      { status: 500 }
    );
  }
}

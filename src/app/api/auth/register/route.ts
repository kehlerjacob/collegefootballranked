import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword, createSessionToken, setSessionCookie } from "@/lib/auth";
import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  favoriteTeamId: z.string().min(1, "Please select your favorite team"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const { email, username, password, favoriteTeamId } = result.data;

    // Check if favorite team exists
    const team = await prisma.team.findUnique({
      where: { id: favoriteTeamId },
    });

    if (!team) {
      return NextResponse.json(
        { error: "Invalid favorite team selected" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email.toLowerCase() },
          { username: username.toLowerCase() },
        ],
      },
    });

    if (existingUser) {
      if (existingUser.email.toLowerCase() === email.toLowerCase()) {
        return NextResponse.json({ error: "Email is already in use" }, { status: 400 });
      }
      return NextResponse.json({ error: "Username is already taken" }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        username,
        passwordHash,
        role: "USER",
        favoriteTeamId: team.id,
      },
      include: {
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

    const token = await createSessionToken({
      userId: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    });

    await setSessionCookie(token);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        favoriteTeam: user.favoriteTeam,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

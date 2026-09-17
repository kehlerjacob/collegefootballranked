import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPassword, createSessionToken, setSessionCookie, isUserAdmin } from "@/lib/auth";
import { z } from "zod";

const loginSchema = z.object({
  login: z.string().min(1, "Email or username is required"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const { login, password } = result.data;
    const loginLower = login.toLowerCase();

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: loginLower },
          { username: login },
        ],
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

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const isMatch = await verifyPassword(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const isAdmin = isUserAdmin(user.email, user.role);
    let userRole = user.role;
    if (isAdmin && user.role !== "ADMIN") {
      await prisma.user.update({
        where: { id: user.id },
        data: { role: "ADMIN" },
      });
      userRole = "ADMIN";
    }

    const token = await createSessionToken({
      userId: user.id,
      email: user.email,
      username: user.username,
      role: userRole,
    });

    await setSessionCookie(token);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: userRole,
        favoriteTeam: user.favoriteTeam,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

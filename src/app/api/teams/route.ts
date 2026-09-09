import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("q") || "";
    const conference = searchParams.get("conf") || "";

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { shortName: { contains: search } },
        { mascot: { contains: search } },
      ];
    }
    if (conference) {
      where.conference = conference;
    }

    const teams = await prisma.team.findMany({
      where,
      orderBy: [{ conference: "asc" }, { name: "asc" }],
    });

    return NextResponse.json({ teams });
  } catch (error) {
    console.error("Teams fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch teams" },
      { status: 500 }
    );
  }
}

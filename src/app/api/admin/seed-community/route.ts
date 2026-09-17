import { NextResponse } from "next/server";
import { getCurrentUser, isUserAdmin } from "@/lib/auth";
import { seedCommunityData } from "@/lib/seed-community-data";

export const maxDuration = 60; // Allow longer timeout for bulk seeding

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    const authHeader = request.headers.get("authorization");
    const isCron =
      process.env.CRON_SECRET &&
      authHeader === `Bearer ${process.env.CRON_SECRET}`;

    if (!isCron && (!user || !isUserAdmin(user.email, user.role))) {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const result = await seedCommunityData();
    return NextResponse.json({
      success: true,
      message: "Community users, ~1000 ballots per week, and seed comments generated successfully!",
      result,
    });
  } catch (error: any) {
    console.error("Community seed error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to seed community data" },
      { status: 500 }
    );
  }
}

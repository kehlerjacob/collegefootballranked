import { NextResponse } from "next/server";
import { syncTeamRecordsFromESPN } from "@/lib/sync-records";

async function handleSync(request: Request) {
  // Optional security check: If CRON_SECRET is defined in env, verify authorization header
  const authHeader = request.headers.get("authorization");
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await syncTeamRecordsFromESPN();
    return NextResponse.json({
      success: true,
      message: `Updated records for ${result.updatedCount} teams`,
      result,
    });
  } catch (error) {
    console.error("ESPN sync records error:", error);
    return NextResponse.json(
      { error: "Failed to sync records from ESPN" },
      { status: 500 }
    );
  }
}

// Vercel Cron sends GET requests
export async function GET(request: Request) {
  return handleSync(request);
}

// Manual or admin script triggers can use POST
export async function POST(request: Request) {
  return handleSync(request);
}

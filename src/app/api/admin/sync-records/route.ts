import { NextResponse } from "next/server";
import { syncTeamRecordsFromESPN } from "@/lib/sync-records";

export async function POST() {
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

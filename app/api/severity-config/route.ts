import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/authOptions";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.access_token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "";
    const limit = searchParams.get("limit") || "";
    const keyWord = searchParams.get("keyWord") || "";
    const status = searchParams.get("status") || "2";
    const sort_key = searchParams.get("sort_key") || "";
    const sort_dir = searchParams.get("sort_dir") || "";

    const params = new URLSearchParams({
      page,
      limit,
      keyWord,
      status,
      sort_key,
      sort_dir,
    });

    const response = await fetch(`${process.env.EXTERNAL_BACKEND_URL}/api/severity-config?${params}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Severity config API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authOptions";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.access_token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const idsParam = searchParams.getAll("ids");
    
    if (!idsParam || idsParam.length === 0) {
      return NextResponse.json({ error: "Severity config IDs are required" }, { status: 400 });
    }

    // Build query params for backend
    const params = new URLSearchParams();
    idsParam.forEach(id => params.append("ids", id));

    const response = await fetch(`${process.env.EXTERNAL_BACKEND_URL}/api/severity-config/delete?${params}`, {
      method: "POST",
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
    console.error("Delete severity configs API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function GET(req: NextRequest) {
  const token = await getToken({ req });

  const { searchParams } = new URL(req.url);

  const page = searchParams.get("page") ?? "1";
  const limit = searchParams.get("limit") ?? "10";
  const keyWord = encodeURIComponent(searchParams.get("keyWord") ?? "");
  const sortKey = searchParams.get("sort_key") ?? "id";
  const sortDir = searchParams.get("sort_dir") ?? "desc";

  const BASE_URL = process.env.EXTERNAL_BACKEND_URL;
  if (!BASE_URL) {
    console.error("❌ Thiếu biến môi trường EXTERNAL_BACKEND_URL");
    return NextResponse.json({ error: "Missing EXTERNAL_BACKEND_URL" }, { status: 500 });
  }

  const backendUrl = `${BASE_URL}/api/users?page=${page}&limit=${limit}&keyWord=${keyWord}&sort_dir=${sortDir}&sort_key=${sortKey}`;

  try {
    const res = await fetch(backendUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token?.access_token
          ? { Authorization: `Bearer ${token.access_token}` }
          : {}),
      },
    });

    if (!res.ok) {
      console.error(`❌ Backend trả về lỗi HTTP ${res.status}`);
      return NextResponse.json({ error: "Backend error" }, { status: res.status });
    }

    const data = await res.json();
    // console.log("✅ Dữ liệu từ backend trả về:", data);

    return NextResponse.json(data);
  } catch (err) {
    // console.error("💥 Lỗi gọi fetch tới backend:", err);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}

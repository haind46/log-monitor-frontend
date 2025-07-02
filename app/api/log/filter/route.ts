import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { searchParams } = new URL(req.url);
  const token = req.headers.get("authorization");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/log/filter?page=${searchParams.get("page") ?? 1}&limit=${searchParams.get("limit") ?? 10}&keyWord=${encodeURIComponent(
      searchParams.get("keyWord") ?? ""
    )}&sort_dir=${searchParams.get("sort_dir") ?? "desc"}&sort_key=${
      searchParams.get("sort_key") ?? "id"
    }`,
    {
      method: "POST",
   headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: token } : {}),
      },      body: JSON.stringify(body),
    }
  );

  const data = await res.json();

  return NextResponse.json(data);
}
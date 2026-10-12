import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5050";

export async function POST(request: Request) {
  try {
    console.log("post");
    const cookieHeader = request.headers.get("cookie");
    if (!cookieHeader) {
      return NextResponse.json(
        { message: "No refresh cookie found" },
        { status: 401 },
      );
    }
    const backendResponse = await fetch(`${BACKEND_URL}/api/auth/refresh`, {
      method: "POST",
      headers: {
        Cookie: cookieHeader,
      },
      cache: "no-store",
    });
    if (!backendResponse.ok) {
      return NextResponse.json(
        { message: "Refresh failed" },
        { status: backendResponse.status },
      );
    }
    const data = await backendResponse.json();
    const response = NextResponse.json(data);
    const setCookies = backendResponse.headers.getSetCookie();
    for (const cookie of setCookies) {
      response.headers.append("Set-Cookie", cookie);
    }
    return response;
  } catch (error) {
    console.error("Refresh error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

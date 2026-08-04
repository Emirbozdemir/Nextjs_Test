import { NextResponse } from "next/server";

import {
  deleteCurrentSession,
  sessionCookieName,
  sessionCookieOptions,
} from "@/lib/auth";

export async function POST() {
  await deleteCurrentSession();
  const response = NextResponse.json({ success: true });
  response.cookies.set(sessionCookieName, "", {
    ...sessionCookieOptions(),
    maxAge: 0,
  });
  return response;
}

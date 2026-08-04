import { NextResponse } from "next/server";

import { createSession, sessionCookieName, sessionCookieOptions } from "@/lib/auth";
import { verifyPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  const email =
    typeof body === "object" && body !== null && "email" in body && typeof body.email === "string"
      ? body.email.trim().toLowerCase()
      : "";
  const password =
    typeof body === "object" && body !== null && "password" in body && typeof body.password === "string"
      ? body.password
      : "";

  if (!emailPattern.test(email) || !password || password.length > 256) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  const isValid =
    user?.status === "ACTIVE" &&
    Boolean(user.passwordHash) &&
    (await verifyPassword(password, user.passwordHash));

  if (!isValid || !user) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  const token = await createSession(user.id);
  const response = NextResponse.json({
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
  response.cookies.set(sessionCookieName, token, sessionCookieOptions());
  return response;
}

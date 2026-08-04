import { NextResponse } from "next/server";

import {
  createSession,
  sessionCookieName,
  sessionCookieOptions,
} from "@/lib/auth";
import { hashPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidPassword(password: string) {
  return (
    password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password)
  );
}

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  const value: Record<string, unknown> =
    typeof body === "object" && body !== null ? body : {};
  const name = typeof value.name === "string" ? value.name.trim() : "";
  const email =
    typeof value.email === "string" ? value.email.trim().toLowerCase() : "";
  const password = typeof value.password === "string" ? value.password : "";

  if (
    name.length < 2 ||
    name.length > 100 ||
    !emailPattern.test(email) ||
    !isValidPassword(password)
  ) {
    return NextResponse.json(
      {
        error:
          "Enter a name, a valid email, and a password with at least 8 characters including a letter and number.",
      },
      { status: 400 },
    );
  }

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: await hashPassword(password),
        role: "User",
        status: "ACTIVE",
      },
    });
    const token = await createSession(user.id);
    const response = NextResponse.json({ success: true }, { status: 201 });
    response.cookies.set(sessionCookieName, token, sessionCookieOptions());
    return response;
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 },
      );
    }
    throw error;
  }
}

import { NextResponse } from "next/server";

import { resetPassword } from "@/lib/auth";
import { hashPassword } from "@/lib/password";

function isValidPassword(password: string) {
  return (
    password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password)
  );
}

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  const token =
    typeof body === "object" &&
    body !== null &&
    "token" in body &&
    typeof body.token === "string"
      ? body.token
      : "";
  const password =
    typeof body === "object" &&
    body !== null &&
    "password" in body &&
    typeof body.password === "string"
      ? body.password
      : "";

  if (!token || !isValidPassword(password)) {
    return NextResponse.json(
      {
        error:
          "Use a valid reset link and a password with at least 8 characters including a letter and number.",
      },
      { status: 400 },
    );
  }

  const updated = await resetPassword(token, await hashPassword(password));
  if (!updated)
    return NextResponse.json(
      { error: "This reset link is invalid or has expired." },
      { status: 400 },
    );

  return NextResponse.json({ success: true });
}

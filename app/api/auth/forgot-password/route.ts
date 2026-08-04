import { NextResponse } from "next/server";

import { createPasswordResetToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  const email =
    typeof body === "object" &&
    body !== null &&
    "email" in body &&
    typeof body.email === "string"
      ? body.email.trim().toLowerCase()
      : "";

  if (!emailPattern.test(email)) {
    return NextResponse.json(
      { error: "Enter a valid email address." },
      { status: 400 },
    );
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, status: true },
  });
  const response: { success: true; resetToken?: string } = { success: true };

  if (user?.status === "ACTIVE") {
    const token = await createPasswordResetToken(user.id);
    if (process.env.NODE_ENV !== "production") response.resetToken = token;
  }

  return NextResponse.json(response);
}

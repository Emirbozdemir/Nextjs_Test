import { NextResponse } from "next/server";

import type { Prisma } from "@/generated/prisma/client";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const languages = new Set(["en", "tr", "ar", "fr", "ru"]);
const themes = new Set(["light", "dark"]);

export async function GET() {
  const user = await getCurrentUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const preferences = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      name: true,
      email: true,
      language: true,
      theme: true,
      timeZone: true,
      emailNotifications: true,
      orderNotifications: true,
      weeklyReports: true,
    },
  });
  return NextResponse.json(preferences);
}

export async function PATCH(request: Request) {
  const user = await getCurrentUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const body: unknown = await request.json().catch(() => null);
  const value: Record<string, unknown> =
    typeof body === "object" && body !== null ? body : {};
  const data: Prisma.UserUpdateInput = {};
  if (
    typeof value.name === "string" &&
    value.name.trim().length >= 2 &&
    value.name.trim().length <= 100
  )
    data.name = value.name.trim();
  if (
    typeof value.email === "string" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email.trim())
  )
    data.email = value.email.trim().toLowerCase();
  if (typeof value.language === "string" && languages.has(value.language))
    data.language = value.language;
  if (typeof value.theme === "string" && themes.has(value.theme))
    data.theme = value.theme;
  if (typeof value.timeZone === "string" && value.timeZone.length <= 100)
    data.timeZone = value.timeZone;
  for (const key of [
    "emailNotifications",
    "orderNotifications",
    "weeklyReports",
  ] as const)
    if (typeof value[key] === "boolean") data[key] = value[key];

  if (!Object.keys(data).length)
    return NextResponse.json(
      { error: "No valid preferences were provided." },
      { status: 400 },
    );
  try {
    const preferences = await prisma.user.update({
      where: { id: user.id },
      data,
      select: {
        name: true,
        email: true,
        language: true,
        theme: true,
        timeZone: true,
        emailNotifications: true,
        orderNotifications: true,
        weeklyReports: true,
      },
    });
    return NextResponse.json(preferences);
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    )
      return NextResponse.json(
        { error: "This email is already in use." },
        { status: 409 },
      );
    throw error;
  }
}

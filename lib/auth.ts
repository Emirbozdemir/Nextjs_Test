import "server-only";

import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";

export const sessionCookieName = "adminpro_session";
const sessionDurationInSeconds = 60 * 60 * 24 * 7;

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  role: string;
};

function hashSessionToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: sessionDurationInSeconds,
  };
}

export async function createSession(userId: number) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + sessionDurationInSeconds * 1000);

  await prisma.session.create({
    data: { userId, tokenHash: hashSessionToken(token), expiresAt },
  });

  return token;
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const token = (await cookies()).get(sessionCookieName)?.value;
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { tokenHash: hashSessionToken(token) },
    include: {
      user: {
        select: { id: true, name: true, email: true, role: true, status: true },
      },
    },
  });

  if (!session || session.expiresAt <= new Date() || session.user.status !== "ACTIVE") {
    return null;
  }

  return session.user;
}

export async function requireApiUser() {
  return getCurrentUser();
}

export async function deleteCurrentSession() {
  const token = (await cookies()).get(sessionCookieName)?.value;
  if (!token) return;

  await prisma.session.deleteMany({
    where: { tokenHash: hashSessionToken(token) },
  });
}

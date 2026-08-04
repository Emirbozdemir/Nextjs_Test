import { NextResponse } from "next/server";
import { UserStatus } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { requireApiUser } from "@/lib/auth";

const statuses: Record<string, UserStatus> = {
  Active: UserStatus.ACTIVE,
  Pending: UserStatus.PENDING,
  Inactive: UserStatus.INACTIVE,
};

function serializeUser(user: {
  id: number;
  name: string;
  email: string;
  role: string;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    ...user,
    status: user.status[0] + user.status.slice(1).toLowerCase(),
  };
}

export async function GET() {
  if (!(await requireApiUser())) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(users.map(serializeUser));
}

export async function POST(request: Request) {
  if (!(await requireApiUser())) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const body = await request.json();
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const role = typeof body.role === "string" ? body.role.trim() : "";
  const status = statuses[body.status] ?? UserStatus.ACTIVE;

  if (!name || !email || !role) return NextResponse.json({ error: "Name, email, and role are required." }, { status: 400 });

  try {
    const user = await prisma.user.create({
      data: { name, email, role, status },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return NextResponse.json(serializeUser(user), { status: 201 });
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "P2002") return NextResponse.json({ error: "A user with this email already exists." }, { status: 409 });
    throw error;
  }
}

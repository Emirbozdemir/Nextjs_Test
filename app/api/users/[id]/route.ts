import { NextResponse } from "next/server";

import { UserStatus } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { requireApiUser } from "@/lib/auth";

const statuses: Record<string, UserStatus> = {
  Active: UserStatus.ACTIVE,
  Pending: UserStatus.PENDING,
  Inactive: UserStatus.INACTIVE,
};

type RouteContext = { params: Promise<{ id: string }> };

function serializeUser(user: { id: number; name: string; email: string; role: string; status: UserStatus; createdAt: Date; updatedAt: Date }) {
  return { ...user, status: user.status[0] + user.status.slice(1).toLowerCase() };
}

export async function PATCH(request: Request, { params }: RouteContext) {
  if (!(await requireApiUser())) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const id = Number((await params).id);
  if (!Number.isInteger(id)) return NextResponse.json({ error: "Invalid user id." }, { status: 400 });

  const body = await request.json();
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const role = typeof body.role === "string" ? body.role.trim() : "";
  const status = statuses[body.status] ?? UserStatus.ACTIVE;

  if (!name || !email || !role) return NextResponse.json({ error: "Name, email, and role are required." }, { status: 400 });

  try {
    const user = await prisma.user.update({
      where: { id },
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
    return NextResponse.json(serializeUser(user));
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error) {
      if (error.code === "P2025") return NextResponse.json({ error: "User not found." }, { status: 404 });
      if (error.code === "P2002") return NextResponse.json({ error: "A user with this email already exists." }, { status: 409 });
    }
    throw error;
  }
}

export async function DELETE(_: Request, { params }: RouteContext) {
  if (!(await requireApiUser())) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const id = Number((await params).id);
  if (!Number.isInteger(id)) return NextResponse.json({ error: "Invalid user id." }, { status: 400 });

  try {
    await prisma.user.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "P2025") return NextResponse.json({ error: "User not found." }, { status: 404 });
    throw error;
  }
}

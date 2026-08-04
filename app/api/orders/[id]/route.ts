import { NextResponse } from "next/server";

import { OrderStatus } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { requireApiUser } from "@/lib/auth";

type RouteContext = { params: Promise<{ id: string }> };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

const statuses: Record<string, OrderStatus> = {
  Pending: OrderStatus.PENDING,
  Processing: OrderStatus.PROCESSING,
  Delivered: OrderStatus.DELIVERED,
  Cancelled: OrderStatus.CANCELLED,
};

function serializeOrder(order: {
  id: number;
  customer: string;
  email: string;
  items: number;
  total: { toNumber(): number };
  status: OrderStatus;
  createdAt: Date;
}) {
  return {
    id: order.id,
    customer: order.customer,
    email: order.email,
    items: order.items,
    total: order.total.toNumber(),
    date: order.createdAt.toISOString().slice(0, 10),
    status: order.status[0] + order.status.slice(1).toLowerCase(),
  };
}

export async function PATCH(request: Request, { params }: RouteContext) {
  if (!(await requireApiUser())) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const id = Number((await params).id);
  const body: unknown = await request.json().catch(() => null);
  if (!isRecord(body))
    return NextResponse.json(
      { error: "A valid JSON body is required." },
      { status: 400 },
    );
  const status =
    typeof body.status === "string" ? statuses[body.status] : undefined;

  if (!Number.isInteger(id) || !status)
    return NextResponse.json(
      { error: "Valid order id and status are required." },
      { status: 400 },
    );

  try {
    const existingOrder = await prisma.order.findUnique({ where: { id } });
    if (!existingOrder)
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    const order = await prisma.order.update({
      where: { id },
      data: { status },
    });
    return NextResponse.json(serializeOrder(order));
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2025"
    )
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    throw error;
  }
}

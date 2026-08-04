import { NextResponse } from "next/server";

import { OrderStatus } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { requireApiUser } from "@/lib/auth";

const statuses: Record<string, OrderStatus> = {
  Pending: OrderStatus.PENDING,
  Processing: OrderStatus.PROCESSING,
  Delivered: OrderStatus.DELIVERED,
  Cancelled: OrderStatus.CANCELLED,
};
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function numberValue(value: unknown) {
  return typeof value === "number" || typeof value === "string"
    ? Number(value)
    : Number.NaN;
}

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

export async function GET() {
  if (!(await requireApiUser())) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(orders.map(serializeOrder));
}

export async function POST(request: Request) {
  if (!(await requireApiUser())) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const body: unknown = await request.json().catch(() => null);
  if (!isRecord(body))
    return NextResponse.json(
      { error: "A valid JSON body is required." },
      { status: 400 },
    );

  const customer =
    typeof body.customer === "string" ? body.customer.trim() : "";
  const email =
    typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const items = numberValue(body.items);
  const total = numberValue(body.total);
  const providedStatus = body.status;
  const status =
    typeof providedStatus === "string" ? statuses[providedStatus] : undefined;

  if (
    !customer ||
    customer.length > 120 ||
    !emailPattern.test(email) ||
    email.length > 254 ||
    !Number.isInteger(items) ||
    items < 1 ||
    items > 1000 ||
    !Number.isFinite(total) ||
    total < 0 ||
    total > 1_000_000 ||
    (providedStatus !== undefined && !status)
  ) {
    return NextResponse.json(
      { error: "Valid customer, email, items, and total are required." },
      { status: 400 },
    );
  }

  const order = await prisma.order.create({
    data: {
      customer,
      email,
      items,
      total,
      status: status ?? OrderStatus.PENDING,
    },
  });
  return NextResponse.json(serializeOrder(order), { status: 201 });
}

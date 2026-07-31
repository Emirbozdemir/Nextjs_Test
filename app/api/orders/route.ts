import { NextResponse } from "next/server";

import { OrderStatus } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

const statuses: Record<string, OrderStatus> = {
  Pending: OrderStatus.PENDING,
  Processing: OrderStatus.PROCESSING,
  Delivered: OrderStatus.DELIVERED,
  Cancelled: OrderStatus.CANCELLED,
};

function serializeOrder(order: { id: number; customer: string; email: string; items: number; total: { toNumber(): number }; status: OrderStatus; createdAt: Date; updatedAt: Date }) {
  return { ...order, total: order.total.toNumber(), status: order.status[0] + order.status.slice(1).toLowerCase() };
}

export async function GET() {
  const orders = await prisma.order.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(orders.map(serializeOrder));
}

export async function POST(request: Request) {
  const body = await request.json();
  const customer = typeof body.customer === "string" ? body.customer.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const items = Number(body.items);
  const total = Number(body.total);
  const status = statuses[body.status] ?? OrderStatus.PENDING;

  if (!customer || !email || !Number.isInteger(items) || items < 1 || !Number.isFinite(total) || total < 0) {
    return NextResponse.json({ error: "Valid customer, email, items, and total are required." }, { status: 400 });
  }

  const order = await prisma.order.create({ data: { customer, email, items, total, status } });
  return NextResponse.json(serializeOrder(order), { status: 201 });
}

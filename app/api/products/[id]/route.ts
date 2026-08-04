import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireApiUser } from "@/lib/auth";

type RouteContext = { params: Promise<{ id: string }> };

function serializeProduct(product: { id: number; name: string; category: string; stock: number; price: { toNumber(): number }; createdAt: Date; updatedAt: Date }) {
  return { ...product, price: product.price.toNumber() };
}

export async function PATCH(request: Request, { params }: RouteContext) {
  if (!(await requireApiUser())) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const id = Number((await params).id);
  if (!Number.isInteger(id)) return NextResponse.json({ error: "Invalid product id." }, { status: 400 });

  const body = await request.json();
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const category = typeof body.category === "string" ? body.category.trim() : "";
  const stock = Number(body.stock);
  const price = Number(body.price);

  if (!name || !category || !Number.isInteger(stock) || stock < 0 || !Number.isFinite(price) || price < 0) {
    return NextResponse.json({ error: "Valid name, category, stock, and price are required." }, { status: 400 });
  }

  try {
    const product = await prisma.product.update({ where: { id }, data: { name, category, stock, price } });
    return NextResponse.json(serializeProduct(product));
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "P2025") return NextResponse.json({ error: "Product not found." }, { status: 404 });
    throw error;
  }
}

export async function DELETE(_: Request, { params }: RouteContext) {
  if (!(await requireApiUser())) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const id = Number((await params).id);
  if (!Number.isInteger(id)) return NextResponse.json({ error: "Invalid product id." }, { status: 400 });

  try {
    await prisma.product.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "P2025") return NextResponse.json({ error: "Product not found." }, { status: 404 });
    throw error;
  }
}

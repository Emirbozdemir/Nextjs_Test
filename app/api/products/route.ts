import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireApiUser } from "@/lib/auth";

function serializeProduct(product: { id: number; name: string; category: string; stock: number; price: { toNumber(): number }; createdAt: Date; updatedAt: Date }) {
  return { ...product, price: product.price.toNumber() };
}

export async function GET() {
  if (!(await requireApiUser())) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(products.map(serializeProduct));
}

export async function POST(request: Request) {
  if (!(await requireApiUser())) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const body = await request.json();
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const category = typeof body.category === "string" ? body.category.trim() : "";
  const stock = Number(body.stock);
  const price = Number(body.price);

  if (!name || !category || !Number.isInteger(stock) || stock < 0 || !Number.isFinite(price) || price < 0) {
    return NextResponse.json({ error: "Valid name, category, stock, and price are required." }, { status: 400 });
  }

  const product = await prisma.product.create({ data: { name, category, stock, price } });
  return NextResponse.json(serializeProduct(product), { status: 201 });
}

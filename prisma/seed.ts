import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, OrderStatus, UserStatus } from "../generated/prisma/client";
import { hashPassword } from "../lib/password";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is required to seed the database.");

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

async function main() {
  const adminPasswordHash = await hashPassword("Admin123!");
  await Promise.all([
    prisma.user.upsert({ where: { email: "admin@adminpro.local" }, update: { passwordHash: adminPasswordHash, status: UserStatus.ACTIVE }, create: { name: "Emir", email: "admin@adminpro.local", passwordHash: adminPasswordHash, role: "Administrator", status: UserStatus.ACTIVE } }),
    prisma.user.upsert({ where: { email: "john@example.com" }, update: {}, create: { name: "John Doe", email: "john@example.com", role: "Administrator", status: UserStatus.ACTIVE } }),
    prisma.user.upsert({ where: { email: "jane@example.com" }, update: {}, create: { name: "Jane Smith", email: "jane@example.com", role: "Manager", status: UserStatus.ACTIVE } }),
    prisma.user.upsert({ where: { email: "alex@example.com" }, update: {}, create: { name: "Alex Brown", email: "alex@example.com", role: "User", status: UserStatus.PENDING } }),
    prisma.product.upsert({ where: { name: "MacBook Pro M4" }, update: {}, create: { name: "MacBook Pro M4", category: "Laptop", stock: 24, price: 2499 } }),
    prisma.product.upsert({ where: { name: "iPhone 16 Pro" }, update: {}, create: { name: "iPhone 16 Pro", category: "Phone", stock: 15, price: 1399 } }),
    prisma.product.upsert({ where: { name: "Apple Watch Ultra" }, update: {}, create: { name: "Apple Watch Ultra", category: "Watch", stock: 7, price: 899 } }),
    prisma.product.upsert({ where: { name: "AirPods Pro" }, update: {}, create: { name: "AirPods Pro", category: "Audio", stock: 42, price: 249 } }),
  ]);

  await prisma.order.upsert({ where: { id: 1048 }, update: {}, create: { id: 1048, customer: "Olivia Martin", email: "olivia@example.com", items: 3, total: 2499, status: OrderStatus.DELIVERED } });
  await prisma.order.upsert({ where: { id: 1047 }, update: {}, create: { id: 1047, customer: "Jackson Lee", email: "jackson@example.com", items: 1, total: 899, status: OrderStatus.PROCESSING } });
}

main().then(() => prisma.$disconnect()).catch(async (error) => { console.error(error); await prisma.$disconnect(); process.exit(1); });

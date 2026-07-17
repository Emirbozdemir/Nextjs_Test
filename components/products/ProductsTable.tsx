"use client";

import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { Pencil, Trash2 } from "lucide-react";

const products = [
  {
    id: 1,
    name: "MacBook Pro M4",
    category: "Laptop",
    stock: 24,
    price: "$2,499",
  },
  {
    id: 2,
    name: "iPhone 16 Pro",
    category: "Phone",
    stock: 15,
    price: "$1,399",
  },
  {
    id: 3,
    name: "Apple Watch Ultra",
    category: "Watch",
    stock: 7,
    price: "$899",
  },
  {
    id: 4,
    name: "AirPods Pro",
    category: "Audio",
    stock: 42,
    price: "$249",
  },
];

export default function ProductsTable() {
  return (
    <Card>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            Products
          </h2>

          <p className="text-sm text-slate-500">
            {products.length} products
          </p>
        </div>

        <input
          placeholder="Search product..."
          className="w-80 rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
        />
      </div>

      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200 text-left">
            <th className="pb-4">Product</th>
            <th>Category</th>
            <th>Stock</th>
            <th>Price</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr
              key={product.id}
              className="border-b border-slate-100 transition hover:bg-slate-50"
            >
              <td className="py-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100 text-xl">
                    📦
                  </div>

                  <div>
                    <p className="font-semibold">
                      {product.name}
                    </p>

                    <p className="text-sm text-slate-500">
                      Product #{product.id}
                    </p>
                  </div>
                </div>
              </td>

              <td>
                <Badge color="blue">
                  {product.category}
                </Badge>
              </td>

              <td>
                <Badge
                  color={
                    product.stock > 20
                      ? "green"
                      : product.stock > 10
                      ? "yellow"
                      : "red"
                  }
                >
                  {product.stock} pcs
                </Badge>
              </td>

              <td className="font-semibold">
                {product.price}
              </td>

              <td className="text-right">
                <div className="flex justify-end gap-2">
                  <button className="rounded-lg bg-slate-100 p-2 hover:bg-slate-200">
                    <Pencil size={18} />
                  </button>

                  <button className="rounded-lg bg-red-100 p-2 text-red-600 hover:bg-red-200">
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
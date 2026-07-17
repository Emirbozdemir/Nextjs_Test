import ProductsTable from "@/components/products/ProductsTable";
import UserStatsCard from "@/components/users/UserStatsCard";

import {
  Package,
  Boxes,
  CircleDollarSign,
} from "lucide-react";

export default function ProductsPage() {
  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Products
          </h1>

          <p className="text-slate-500">
            Manage your inventory
          </p>
        </div>

        <button className="rounded-xl bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700">
          + Add Product
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <UserStatsCard
          title="Products"
          value="248"
          color="bg-blue-600"
          icon={Package}
        />

        <UserStatsCard
          title="In Stock"
          value="224"
          color="bg-green-600"
          icon={Boxes}
        />

        <UserStatsCard
          title="Revenue"
          value="$52K"
          color="bg-yellow-500"
          icon={CircleDollarSign}
        />
      </div>

      <ProductsTable />
    </section>
  );
}
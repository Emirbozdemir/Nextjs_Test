"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Search } from "lucide-react";

import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import { Order, OrderStatus } from "@/types/order";

type OrdersTableProps = {
  orders: Order[];
  onStatusChange: (id: number, status: OrderStatus) => void;
};
const statuses: OrderStatus[] = [
  "Pending",
  "Processing",
  "Delivered",
  "Cancelled",
];
const badgeColor: Record<OrderStatus, "yellow" | "blue" | "green" | "red"> = {
  Pending: "yellow",
  Processing: "blue",
  Delivered: "green",
  Cancelled: "red",
};

export default function OrdersTable({
  orders,
  onStatusChange,
}: OrdersTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | OrderStatus>("All");
  const visibleOrders = useMemo(() => {
    const query = search.trim().toLowerCase();
    return orders
      .filter(
        (order) => statusFilter === "All" || order.status === statusFilter,
      )
      .filter(
        (order) =>
          !query ||
          [order.customer, order.email, order.id.toString()].some((value) =>
            value.toLowerCase().includes(query),
          ),
      );
  }, [orders, search, statusFilter]);
  const money = (total: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(total);
  const date = (value: string) =>
    new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(`${value}T00:00:00`));

  return (
    <Card>
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Recent Orders
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {visibleOrders.length} of {orders.length} orders
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search order or customer..."
              className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-64"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as "All" | OrderStatus)
            }
            aria-label="Filter orders by status"
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-blue-500"
          >
            <option value="All">All statuses</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px]">
          <thead>
            <tr className="border-b border-slate-200 text-left text-sm font-semibold text-slate-500">
              <th className="pb-4">Order</th>
              <th className="pb-4">Date</th>
              <th className="pb-4">Items</th>
              <th className="pb-4">Total</th>
              <th className="pb-4">Status</th>
              <th className="pb-4 text-right">Update</th>
            </tr>
          </thead>
          <tbody>
            {visibleOrders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-slate-100 transition hover:bg-slate-50"
              >
                <td className="py-5">
                  <div className="flex items-center gap-3">
                    <Avatar name={order.customer} />
                    <div>
                      <p className="font-semibold text-slate-800">
                        {order.customer}
                      </p>
                      <p className="text-sm text-slate-500">
                        #{order.id} · {order.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="text-sm text-slate-600">{date(order.date)}</td>
                <td className="text-sm font-medium text-slate-700">
                  {order.items}
                </td>
                <td className="font-semibold text-slate-800">
                  {money(order.total)}
                </td>
                <td>
                  <Badge color={badgeColor[order.status]}>{order.status}</Badge>
                </td>
                <td className="text-right">
                  <div className="relative inline-flex">
                    <select
                      value={order.status}
                      onChange={(event) =>
                        onStatusChange(
                          order.id,
                          event.target.value as OrderStatus,
                        )
                      }
                      aria-label={`Update status for order ${order.id}`}
                      className="appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-3 pr-8 text-sm font-medium text-slate-700 outline-none transition hover:bg-slate-50 focus:border-blue-500"
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={15}
                      className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {visibleOrders.length === 0 && (
        <div className="py-14 text-center">
          <p className="font-semibold text-slate-700">No orders found</p>
          <p className="mt-1 text-sm text-slate-500">
            Try changing your search or status filter.
          </p>
        </div>
      )}
    </Card>
  );
}

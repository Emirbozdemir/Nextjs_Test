"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Download, Eye, Search } from "lucide-react";

import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import { Order, OrderStatus } from "@/types/order";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { languages } from "@/lib/languages";

type OrdersTableProps = {
  orders: Order[];
  onStatusChange: (id: number, status: OrderStatus) => Promise<boolean>;
  onBulkStatusChange: (ids: number[], status: OrderStatus) => Promise<void>;
  onView: (order: Order) => void;
};
type SortOption = "newest" | "oldest" | "totalHigh" | "totalLow";
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
const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
  Pending: ["Pending", "Processing", "Cancelled"],
  Processing: ["Processing", "Delivered", "Cancelled"],
  Delivered: ["Delivered"],
  Cancelled: ["Cancelled"],
};

export default function OrdersTable({
  orders,
  onStatusChange,
  onBulkStatusChange,
  onView,
}: OrdersTableProps) {
  const { language, t } = useLanguage();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | OrderStatus>("All");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [bulkStatus, setBulkStatus] = useState<OrderStatus | "">("");
  const [isBulkUpdating, setIsBulkUpdating] = useState(false);
  const visibleOrders = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filteredOrders = orders
      .filter(
        (order) => statusFilter === "All" || order.status === statusFilter,
      )
      .filter((order) => !fromDate || order.date >= fromDate)
      .filter((order) => !toDate || order.date <= toDate)
      .filter(
        (order) =>
          !query ||
          [order.customer, order.email, order.id.toString()].some((value) =>
            value.toLowerCase().includes(query),
          ),
      );
    return [...filteredOrders].sort((first, second) => {
      if (sortOption === "oldest") return first.date.localeCompare(second.date);
      if (sortOption === "totalHigh") return second.total - first.total;
      if (sortOption === "totalLow") return first.total - second.total;
      return second.date.localeCompare(first.date) || second.id - first.id;
    });
  }, [fromDate, orders, search, sortOption, statusFilter, toDate]);
  const totalPages = Math.max(1, Math.ceil(visibleOrders.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageOrders = visibleOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );
  const hasFilters = search || statusFilter !== "All" || fromDate || toDate;
  const allCurrentPageSelected =
    pageOrders.length > 0 &&
    pageOrders.every((order) => selectedIds.includes(order.id));
  const selectedOrders = orders.filter((order) =>
    selectedIds.includes(order.id),
  );
  const bulkStatuses = statuses.filter(
    (status) =>
      selectedOrders.some((order) => order.status !== status) &&
      selectedOrders.every((order) =>
        allowedTransitions[order.status].includes(status),
      ),
  );
  const toggleOrder = (id: number) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((selectedId) => selectedId !== id)
        : [...current, id],
    );
  };
  const toggleCurrentPage = () => {
    const pageIds = pageOrders.map((order) => order.id);
    setSelectedIds((current) =>
      allCurrentPageSelected
        ? current.filter((id) => !pageIds.includes(id))
        : [...new Set([...current, ...pageIds])],
    );
  };
  const applyBulkStatus = async () => {
    if (!bulkStatus || selectedIds.length === 0) return;
    setIsBulkUpdating(true);
    await onBulkStatusChange(selectedIds, bulkStatus);
    setSelectedIds([]);
    setBulkStatus("");
    setIsBulkUpdating(false);
  };
  const clearFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setFromDate("");
    setToDate("");
    setPage(1);
  };
  const money = (total: number) =>
    new Intl.NumberFormat(languages[language].locale, {
      style: "currency",
      currency: "USD",
    }).format(total);
  const date = (value: string) =>
    new Intl.DateTimeFormat(languages[language].locale, {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(`${value}T00:00:00`));
  const statusLabel = (status: OrderStatus) => t(`orderStatus${status}`);
  const exportOrders = () => {
    const header = [
      "Order ID",
      "Customer",
      "Email",
      "Date",
      "Items",
      "Total",
      "Status",
    ];
    const escape = (value: string | number) =>
      `"${String(value).replaceAll('"', '""')}"`;
    const rows = visibleOrders.map((order) =>
      [
        order.id,
        order.customer,
        order.email,
        order.date,
        order.items,
        order.total,
        statusLabel(order.status),
      ]
        .map(escape)
        .join(","),
    );
    const file = new Blob(
      [[header.map(escape).join(","), ...rows].join("\n")],
      {
        type: "text/csv;charset=utf-8",
      },
    );
    const url = URL.createObjectURL(file);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "orders.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            {t("recentOrders")}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {visibleOrders.length} / {orders.length}
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
              placeholder={t("searchOrders")}
              onInput={() => setPage(1)}
              className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-64"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value as "All" | OrderStatus);
              setPage(1);
            }}
            aria-label={t("status")}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-blue-500"
          >
            <option value="All">{t("allStatuses")}</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {statusLabel(status)}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={fromDate}
            onChange={(event) => {
              setFromDate(event.target.value);
              setPage(1);
            }}
            aria-label={t("fromDate")}
            className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-medium text-slate-700 outline-none focus:border-blue-500"
          />
          <input
            type="date"
            value={toDate}
            min={fromDate || undefined}
            onChange={(event) => {
              setToDate(event.target.value);
              setPage(1);
            }}
            aria-label={t("toDate")}
            className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-medium text-slate-700 outline-none focus:border-blue-500"
          />
          <select
            value={sortOption}
            onChange={(event) => {
              setSortOption(event.target.value as SortOption);
              setPage(1);
            }}
            aria-label={t("sortOrders")}
            className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-medium text-slate-700 outline-none focus:border-blue-500"
          >
            <option value="newest">{t("newestFirst")}</option>
            <option value="oldest">{t("oldestFirst")}</option>
            <option value="totalHigh">{t("totalHighToLow")}</option>
            <option value="totalLow">{t("totalLowToHigh")}</option>
          </select>
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="rounded-xl px-3 py-3 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
            >
              {t("clearFilters")}
            </button>
          )}
          <button
            type="button"
            onClick={exportOrders}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <Download size={17} />
            {t("exportCsv")}
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px]">
          <thead>
            <tr className="border-b border-slate-200 text-left text-sm font-semibold text-slate-500">
              <th className="w-10 pb-4">
                <input
                  type="checkbox"
                  checked={allCurrentPageSelected}
                  onChange={toggleCurrentPage}
                  aria-label={t("selectAllOrders")}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th className="pb-4">{t("order")}</th>
              <th className="pb-4">{t("date")}</th>
              <th className="pb-4">{t("items")}</th>
              <th className="pb-4">{t("total")}</th>
              <th className="pb-4">{t("status")}</th>
              <th className="pb-4 text-right">{t("action")}</th>
            </tr>
          </thead>
          <tbody>
            {pageOrders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-slate-100 transition hover:bg-slate-50"
              >
                <td className="py-5">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(order.id)}
                    onChange={() => toggleOrder(order.id)}
                    aria-label={`${t("selectOrder")} ${order.id}`}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                </td>
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
                  <Badge color={badgeColor[order.status]}>
                    {statusLabel(order.status)}
                  </Badge>
                </td>
                <td className="text-right">
                  <div className="inline-flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onView(order)}
                      aria-label={`${t("viewOrder")} ${order.id}`}
                      className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Eye size={17} />
                    </button>
                    <div className="relative inline-flex">
                      <select
                        value={order.status}
                        onChange={(event) =>
                          onStatusChange(
                            order.id,
                            event.target.value as OrderStatus,
                          )
                        }
                        aria-label={`${t("updateOrderStatus")} ${order.id}`}
                        disabled={allowedTransitions[order.status].length === 1}
                        className="appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-3 pr-8 text-sm font-medium text-slate-700 outline-none transition hover:bg-slate-50 focus:border-blue-500"
                      >
                        {allowedTransitions[order.status].map((status) => (
                          <option key={status} value={status}>
                            {statusLabel(status)}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={15}
                        className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedIds.length > 0 && (
        <div className="mt-5 flex flex-col gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold text-blue-800">
            {selectedIds.length} {t("ordersSelected")}
          </p>
          <div className="flex flex-wrap gap-2">
            <select
              value={bulkStatus}
              onChange={(event) =>
                setBulkStatus(event.target.value as OrderStatus)
              }
              aria-label={t("changeStatus")}
              className="rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none focus:border-blue-500"
            >
              <option value="">{t("changeStatus")}</option>
              {bulkStatuses.map((status) => (
                <option key={status} value={status}>
                  {statusLabel(status)}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={applyBulkStatus}
              disabled={!bulkStatus || isBulkUpdating}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isBulkUpdating ? t("updating") : t("apply")}
            </button>
          </div>
        </div>
      )}
      {visibleOrders.length > 0 && (
        <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            {currentPage} / {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <select
              value={pageSize}
              onChange={(event) => {
                setPageSize(Number(event.target.value));
                setPage(1);
              }}
              aria-label={t("rowsPerPage")}
              className="rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm text-slate-700 outline-none focus:border-blue-500"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="25">25</option>
            </select>
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={currentPage === 1}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {t("previous")}
            </button>
            <button
              type="button"
              onClick={() =>
                setPage((current) => Math.min(totalPages, current + 1))
              }
              disabled={currentPage === totalPages}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {t("next")}
            </button>
          </div>
        </div>
      )}
      {visibleOrders.length === 0 && (
        <div className="py-14 text-center">
          <p className="font-semibold text-slate-700">{t("noOrders")}</p>
          <p className="mt-1 text-sm text-slate-500">
            {t("adjustOrderFilters")}
          </p>
        </div>
      )}
    </Card>
  );
}

"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import Card from "@/components/ui/Card";
import DataState from "@/components/ui/DataState";
import { AnalyticsPeriod, getAnalyticsData } from "@/lib/analytics-data";

type AnalyticsChartsProps = { period: AnalyticsPeriod; isLoading?: boolean };
const money = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);

export default function AnalyticsCharts({
  period,
  isLoading = false,
}: AnalyticsChartsProps) {
  const { sales, categoryData } = getAnalyticsData(period);
  if (isLoading || sales.length === 0)
    return (
      <Card>
        <DataState
          isLoading={isLoading}
          title="No analytics data"
          description="Analytics will appear here when data becomes available."
        />
      </Card>
    );
  return (
    <>
      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="h-[380px] xl:col-span-2">
          <h2 className="text-lg font-semibold text-slate-900">
            Revenue Trend
          </h2>
          <p className="mb-5 text-sm text-slate-500">
            Revenue performance for the selected period
          </p>
          <ResponsiveContainer width="100%" height={275}>
            <AreaChart
              data={sales}
              margin={{ top: 5, right: 5, left: -15, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id="analyticsRevenue"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                stroke="#e2e8f0"
                strokeDasharray="3 3"
                vertical={false}
              />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
              />
              <YAxis
                tickFormatter={(value) => `$${value / 1000}k`}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
              />
              <Tooltip
                formatter={(value) => money(Number(value))}
                cursor={{ stroke: "#94a3b8", strokeDasharray: "3 3" }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#2563eb"
                strokeWidth={3}
                fill="url(#analyticsRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
        <Card className="h-[380px]">
          <h2 className="text-lg font-semibold text-slate-900">
            Sales by Category
          </h2>
          <p className="mb-2 text-sm text-slate-500">Revenue contribution</p>
          <ResponsiveContainer width="100%" height={285}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                innerRadius={65}
                outerRadius={95}
                paddingAngle={4}
              >
                {categoryData.map((item) => (
                  <Cell key={item.name} fill={item.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: 12 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
      <Card className="h-[360px]">
        <h2 className="text-lg font-semibold text-slate-900">Order Volume</h2>
        <p className="mb-5 text-sm text-slate-500">
          Number of orders completed in the selected period
        </p>
        <ResponsiveContainer width="100%" height={245}>
          <BarChart
            data={sales}
            margin={{ top: 5, right: 5, left: -15, bottom: 0 }}
          >
            <CartesianGrid
              stroke="#e2e8f0"
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 12 }}
            />
            <Tooltip cursor={{ fill: "#f8fafc" }} />
            <Bar
              dataKey="orders"
              name="Orders"
              fill="#0d9488"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </>
  );
}

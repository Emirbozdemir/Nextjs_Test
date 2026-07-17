"use client";

import Card from "@/components/ui/Card";
import { salesData } from "@/lib/dashboard-data";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function SalesOverview() {
  return (
    <Card className="h-[350px]">
      <h2 className="text-lg font-semibold text-slate-900">
        Sales Overview
      </h2>

      <p className="mb-6 text-sm text-slate-500">
        Monthly sales performance
      </p>

      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={salesData}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="month" />

          <YAxis />

          <Tooltip />

          <Area
            type="monotone"
            dataKey="sales"
            stroke="#2563eb"
            fill="#bfdbfe"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}
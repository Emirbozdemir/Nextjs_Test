export type AnalyticsPeriod = "7d" | "30d" | "90d";

const baseSalesData = [
  { label: "Mon", revenue: 4200, orders: 38 },
  { label: "Tue", revenue: 5600, orders: 46 },
  { label: "Wed", revenue: 4900, orders: 42 },
  { label: "Thu", revenue: 6800, orders: 55 },
  { label: "Fri", revenue: 7300, orders: 61 },
  { label: "Sat", revenue: 6100, orders: 48 },
  { label: "Sun", revenue: 8400, orders: 67 },
];

const categoryData = [
  { name: "Laptops", value: 42, color: "#2563eb" },
  { name: "Phones", value: 28, color: "#7c3aed" },
  { name: "Audio", value: 18, color: "#0d9488" },
  { name: "Wearables", value: 12, color: "#f59e0b" },
];

const periodMultiplier: Record<AnalyticsPeriod, number> = { "7d": 1, "30d": 4.4, "90d": 13.2 };
const periodLabels: Record<AnalyticsPeriod, string[]> = {
  "7d": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  "30d": ["Week 1", "Week 2", "Week 3", "Week 4"],
  "90d": ["May", "Jun", "Jul"],
};

export function getAnalyticsData(period: AnalyticsPeriod) {
  const multiplier = periodMultiplier[period];
  const labels = periodLabels[period];
  const source = period === "7d" ? baseSalesData : baseSalesData.slice(0, labels.length);
  const sales = source.map((item, index) => ({ ...item, label: labels[index], revenue: Math.round(item.revenue * multiplier / labels.length), orders: Math.round(item.orders * multiplier / labels.length) }));
  const totalRevenue = sales.reduce((sum, item) => sum + item.revenue, 0);
  const totalOrders = sales.reduce((sum, item) => sum + item.orders, 0);

  return { sales, categoryData, totalRevenue, totalOrders, conversionRate: 4.8, averageOrderValue: totalRevenue / totalOrders };
}

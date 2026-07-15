import Card from "@/components/ui/Card";

const orders = [
  {
    id: "#1001",
    customer: "John Doe",
    status: "Paid",
    total: "$240",
  },
  {
    id: "#1002",
    customer: "Jane Smith",
    status: "Pending",
    total: "$120",
  },
  {
    id: "#1003",
    customer: "Alex Brown",
    status: "Paid",
    total: "$510",
  },
];

export default function RecentOrders() {
  return (
    <Card>
      <h2 className="mb-6 text-lg font-semibold text-slate-900">
        Recent Orders
      </h2>

      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200 text-left">
            <th className="pb-3">Order</th>
            <th className="pb-3">Customer</th>
            <th className="pb-3">Status</th>
            <th className="pb-3 text-right">Total</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr
              key={order.id}
              className="border-b border-slate-100"
            >
              <td className="py-4">{order.id}</td>

              <td>{order.customer}</td>

              <td>
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                  {order.status}
                </span>
              </td>

              <td className="text-right font-semibold">
                {order.total}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
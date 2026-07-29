import { Order } from "@/types/order";

export const initialOrders: Order[] = [
  {
    id: 1048,
    customer: "Olivia Martin",
    email: "olivia@example.com",
    items: 3,
    total: 2499,
    date: "2026-07-26",
    status: "Delivered",
  },
  {
    id: 1047,
    customer: "Jackson Lee",
    email: "jackson@example.com",
    items: 1,
    total: 899,
    date: "2026-07-26",
    status: "Processing",
  },
  {
    id: 1046,
    customer: "Isabella Nguyen",
    email: "isabella@example.com",
    items: 2,
    total: 1648,
    date: "2026-07-25",
    status: "Pending",
  },
  {
    id: 1045,
    customer: "William Kim",
    email: "william@example.com",
    items: 4,
    total: 3297,
    date: "2026-07-24",
    status: "Delivered",
  },
  {
    id: 1044,
    customer: "Sophia Brown",
    email: "sophia@example.com",
    items: 1,
    total: 249,
    date: "2026-07-24",
    status: "Cancelled",
  },
];

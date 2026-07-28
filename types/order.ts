export type OrderStatus = "Pending" | "Processing" | "Delivered" | "Cancelled";

export interface Order {
  id: number;
  customer: string;
  email: string;
  items: number;
  total: number;
  date: string;
  status: OrderStatus;
}

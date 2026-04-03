export type OrderStatus = "Delivered" | "Processing" | "Shipped" | "Cancelled";

export type OrderItem = {
  name: string;
  quantity: number;
  size?: string;
  color?: string;
};

export type OrderCard = {
  id: string;
  date: string;
  status: OrderStatus;
  total: number;
  payment: string;
  address: string;
  eta?: string;
  items: OrderItem[];
};
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

export type CheckoutFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  discountCode: string;
  addressId: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
};

export type CheckoutLineItem = {
  productId: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  name: string;
};

export type CheckoutFormSectionProps = {
  initialValues: CheckoutFormValues;
  items: CheckoutLineItem[];
  subtotal: number;
  isAuthenticated: boolean;
  userId: string;
};

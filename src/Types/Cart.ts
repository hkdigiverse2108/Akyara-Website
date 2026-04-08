export type AddCartPayload = {
  productId: string;
  quantity?: number;
  size?: string;
  color?: string;
};

export type UpdateCartPayload = {
  cartId: string;
  quantity?: number;
};

export type CartRecord = {
  _id: string;
  productId: any;
  userId: string;
  quantity: number;
  size?: string;
  color?: string;
  isDeleted?: boolean;
};

export type CartApiResponse = {
  data: {
    cart_data?: CartRecord[];
  } | CartRecord[];
  message: string;
  status: number;
};

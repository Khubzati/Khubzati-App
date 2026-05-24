export type PaymentMethod = "ONLINE_CARD" | "CASH_ON_DELIVERY";

export type PaymentStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "CANCELLED"
  | "REFUNDED"
  | "COD_PENDING"
  | "COD_COLLECTED";

export interface CreateOrderItemInput {
  productId: string;
  quantity: number;
  specialInstructions?: string;
}

export interface CreateOrderRequest {
  bakeryId?: string;
  restaurantId?: string;
  orderType?: "pickup" | "delivery";
  deliveryAddressId?: string;
  paymentMethod: PaymentMethod;
  specialInstructions?: string;
  items: CreateOrderItemInput[];
}

export interface CreateOrderResponse {
  status: string;
  data: {
    order: {
      id: string;
      orderNumber: string;
      paymentMethod: string;
      paymentStatus: string;
      totalAmount: number;
      currency?: string;
    };
  };
}

export interface CreatePaymentSessionRequest {
  orderId: string;
}

export interface CreatePaymentSessionResponse {
  status: string;
  data: {
    orderId: string;
    orderNumber: string;
    checkoutUrl: string;
    provider: string;
    providerSessionId: string;
    providerPaymentId: string | null;
    amount: number;
    currency: string;
  };
}

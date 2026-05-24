"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest, API_BASE_URL } from "@/lib/api";
import type {
  CreateOrderRequest,
  CreateOrderResponse,
  CreatePaymentSessionResponse,
  PaymentMethod,
} from "@/types/payments";

const SAMPLE_ITEMS = JSON.stringify(
  [
    {
      productId: "PRODUCT_ID_HERE",
      quantity: 10,
      specialInstructions: "Deliver fresh bread before noon",
    },
  ],
  null,
  2,
);

export default function CheckoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [token, setToken] = useState("");
  const [bakeryId, setBakeryId] = useState("");
  const [restaurantId, setRestaurantId] = useState("");
  const [orderType, setOrderType] = useState<"pickup" | "delivery">("pickup");
  const [deliveryAddressId, setDeliveryAddressId] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("ONLINE_CARD");
  const [itemsJson, setItemsJson] = useState(SAMPLE_ITEMS);

  const selectedVendorLabel = useMemo(() => {
    if (bakeryId) return `Bakery: ${bakeryId}`;
    if (restaurantId) return `Restaurant: ${restaurantId}`;
    return "No vendor selected";
  }, [bakeryId, restaurantId]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!token.trim()) {
      setError("JWT token is required");
      return;
    }

    if (!bakeryId.trim() && !restaurantId.trim()) {
      setError("Provide bakeryId or restaurantId");
      return;
    }

    let items: CreateOrderRequest["items"];
    try {
      const parsed = JSON.parse(itemsJson);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        throw new Error("items must be a non-empty array");
      }
      items = parsed;
    } catch (parseError) {
      setError(parseError instanceof Error ? parseError.message : "Invalid items JSON payload");
      return;
    }

    const payload: CreateOrderRequest = {
      ...(bakeryId ? { bakeryId: bakeryId.trim() } : {}),
      ...(restaurantId ? { restaurantId: restaurantId.trim() } : {}),
      orderType,
      ...(orderType === "delivery" && deliveryAddressId.trim()
        ? { deliveryAddressId: deliveryAddressId.trim() }
        : {}),
      paymentMethod,
      specialInstructions: specialInstructions.trim() || undefined,
      items,
    };

    setLoading(true);

    try {
      const orderResponse = await apiRequest<CreateOrderResponse>("/orders", {
        method: "POST",
        token: token.trim(),
        body: payload,
      });

      const orderId = orderResponse?.data?.order?.id;
      if (!orderId) {
        throw new Error("Order created but orderId is missing in response");
      }

      if (paymentMethod === "CASH_ON_DELIVERY") {
        router.push(`/checkout/success?orderId=${encodeURIComponent(orderId)}&mode=cod`);
        return;
      }

      const paymentSession = await apiRequest<CreatePaymentSessionResponse>("/payments/create-session", {
        method: "POST",
        token: token.trim(),
        body: { orderId },
      });

      const checkoutUrl = paymentSession?.data?.checkoutUrl;
      if (!checkoutUrl) {
        throw new Error("Missing Stripe checkoutUrl from backend");
      }

      window.location.assign(checkoutUrl);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Failed to place order or create payment session",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="stack-lg">
      <section className="card stack">
        <h1>B2B Checkout</h1>
        <p className="muted">Create an order, then pay online using Stripe or submit cash-on-delivery.</p>
        <p className="muted">API Base URL: {API_BASE_URL}</p>
      </section>

      <form className="card stack" onSubmit={handleSubmit}>
        <label className="stack">
          <span>JWT Token</span>
          <textarea
            value={token}
            onChange={(e) => setToken(e.target.value)}
            rows={3}
            placeholder="Bearer token value"
            required
          />
        </label>

        <label className="stack">
          <span>Bakery ID (optional if Restaurant ID is provided)</span>
          <input value={bakeryId} onChange={(e) => setBakeryId(e.target.value)} placeholder="bakery uuid" />
        </label>

        <label className="stack">
          <span>Restaurant ID (optional if Bakery ID is provided)</span>
          <input
            value={restaurantId}
            onChange={(e) => setRestaurantId(e.target.value)}
            placeholder="restaurant uuid"
          />
        </label>

        <p className="muted">Selected vendor: {selectedVendorLabel}</p>

        <label className="stack">
          <span>Order Type</span>
          <select value={orderType} onChange={(e) => setOrderType(e.target.value as "pickup" | "delivery")}> 
            <option value="pickup">Pickup</option>
            <option value="delivery">Delivery</option>
          </select>
        </label>

        {orderType === "delivery" ? (
          <label className="stack">
            <span>Delivery Address ID</span>
            <input
              value={deliveryAddressId}
              onChange={(e) => setDeliveryAddressId(e.target.value)}
              placeholder="address uuid"
              required
            />
          </label>
        ) : null}

        <label className="stack">
          <span>Special Instructions</span>
          <input
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            placeholder="Optional order notes"
          />
        </label>

        <fieldset className="stack">
          <legend>Payment Method</legend>
          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="ONLINE_CARD"
              checked={paymentMethod === "ONLINE_CARD"}
              onChange={() => setPaymentMethod("ONLINE_CARD")}
            />
            Pay online (Stripe Checkout)
          </label>
          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="CASH_ON_DELIVERY"
              checked={paymentMethod === "CASH_ON_DELIVERY"}
              onChange={() => setPaymentMethod("CASH_ON_DELIVERY")}
            />
            Cash on delivery
          </label>
        </fieldset>

        <label className="stack">
          <span>Items JSON</span>
          <textarea value={itemsJson} onChange={(e) => setItemsJson(e.target.value)} rows={10} required />
        </label>

        {error ? <p style={{ color: "#b91c1c" }}>{error}</p> : null}

        <button className="button" type="submit" disabled={loading}>
          {loading ? "Processing..." : paymentMethod === "ONLINE_CARD" ? "Create Order & Pay" : "Create COD Order"}
        </button>
      </form>
    </div>
  );
}

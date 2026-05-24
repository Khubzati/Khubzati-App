interface SuccessPageProps {
  searchParams: {
    orderId?: string;
    session_id?: string;
    mode?: string;
  };
}

export default function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const orderId = searchParams.orderId || "-";
  const sessionId = searchParams.session_id || "-";
  const mode = searchParams.mode === "cod" ? "Cash on delivery" : "Online card";

  return (
    <div className="stack-lg">
      <section className="card stack">
        <h1>Order Submitted</h1>
        <p className="muted">Payment confirmation for online card orders is validated only by webhook events.</p>
      </section>

      <section className="card stack">
        <p><strong>Order ID:</strong> {orderId}</p>
        <p><strong>Checkout Session ID:</strong> {sessionId}</p>
        <p><strong>Payment Method:</strong> {mode}</p>
      </section>
    </div>
  );
}

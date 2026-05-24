export default function CheckoutCancelPage() {
  return (
    <div className="stack-lg">
      <section className="card stack">
        <h1>Payment Cancelled</h1>
        <p className="muted">
          Your Stripe checkout was cancelled. The order remains pending until you retry payment or switch to cash on delivery.
        </p>
      </section>
    </div>
  );
}

import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section card stack">
      <p className="eyebrow">404</p>
      <h1>Page not found</h1>
      <p className="muted">This route does not exist yet. You can continue from the store explorer.</p>
      <Link href="/stores" className="button">
        Go to Stores
      </Link>
    </section>
  );
}

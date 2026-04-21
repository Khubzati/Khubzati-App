import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer-wrap">
      <div className="site-footer container">
        <div>
          <p className="site-footer__title">Khubzati</p>
          <p className="muted">Routing fresh bakeries, restaurants, and neighborhood cafes to every table.</p>
        </div>

        <div className="site-footer__links">
          <Link href="/about">About</Link>
          <Link href="/stores">Stores</Link>
          <Link href="/app">App Routes</Link>
          <Link href="/contact">Partner</Link>
        </div>
      </div>
    </footer>
  );
}

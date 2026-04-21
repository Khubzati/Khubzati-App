"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Khubzati" },
  { href: "/stores", label: "Stores" },
  { href: "/app", label: "App Routes" },
  { href: "/contact", label: "Partner" }
];

export function SiteNav() {
  const pathname = usePathname();

  return (
    <header className="top-nav-wrap">
      <nav className="top-nav container" aria-label="Primary navigation">
        <Link href="/" className="brand">
          <span className="brand__mark" aria-hidden="true">
            KH
          </span>
          <span>
            Khubzati
            <small>Local Bread Network</small>
          </span>
        </Link>

        <div className="top-nav__links">
          {links.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));

            return (
              <Link
                key={link.href}
                href={link.href}
                className={isActive ? "top-nav__link is-active" : "top-nav__link"}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/i18n/language-context";

type NavLink = {
  href: string;
  key: "home" | "about" | "stores" | "appRoutes" | "partner";
};

const links: NavLink[] = [
  { href: "/", key: "home" },
  { href: "/about", key: "about" },
  { href: "/stores", key: "stores" },
  { href: "/app", key: "appRoutes" },
  { href: "/contact", key: "partner" }
];

export function SiteNav() {
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="top-nav-wrap">
      <nav className="top-nav container" aria-label="Primary navigation">
        <Link href="/" className="brand">
          <span className="brand__mark" aria-hidden="true">
            KH
          </span>
          <span>
            Khubzati
            <small>{t.nav.brandSubtitle}</small>
          </span>
        </Link>

        <div className="top-nav__actions">
          <div className="top-nav__links">
            {links.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={isActive ? "top-nav__link is-active" : "top-nav__link"}
                >
                  {t.nav[link.key]}
                </Link>
              );
            })}
          </div>

          <div className="lang-switch" aria-label={t.language.switchLabel}>
            <button
              type="button"
              onClick={() => setLanguage("ar")}
              className={language === "ar" ? "lang-switch__btn is-active" : "lang-switch__btn"}
            >
              {t.language.ar}
            </button>
            <button
              type="button"
              onClick={() => setLanguage("en")}
              className={language === "en" ? "lang-switch__btn is-active" : "lang-switch__btn"}
            >
              {t.language.en}
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}

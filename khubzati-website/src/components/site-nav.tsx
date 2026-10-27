"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/i18n/language-context";

type NavLink = {
  href: string;
  key: "home" | "about" | "stores" | "appRoutes" | "partner";
};

const links: NavLink[] = [
  { href: "/", key: "home" },
  { href: "/stores", key: "stores" },
  { href: "/app", key: "appRoutes" },
  { href: "/about", key: "about" }
];

export function SiteNav() {
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuToggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuToggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  return (
    <header className="top-nav-wrap">
      <nav className="top-nav container" aria-label={language === "ar" ? "التنقل الرئيسي" : "Primary navigation"}>
        <Link href="/" className="brand">
          <span className="brand__logo-wrap" aria-hidden="true">
            <Image
              src="/khubzati-logo.svg"
              alt=""
              width={52}
              height={32}
              className="brand__logo"
            />
          </span>
          <span className="brand__text">
            Khubzati
            <small>{t.nav.brandSubtitle}</small>
          </span>
        </Link>

        <button
          ref={menuToggleRef}
          type="button"
          className="nav-menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="primary-links"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="nav-menu-toggle__icon" aria-hidden="true"><span /><span /><span /></span>
          <span>{menuOpen ? (language === "ar" ? "إغلاق" : "Close") : (language === "ar" ? "القائمة" : "Menu")}</span>
        </button>

        <div className={menuOpen ? "top-nav__actions is-open" : "top-nav__actions"}>
          <div className="top-nav__links" id="primary-links">
            {links.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={isActive ? "top-nav__link is-active" : "top-nav__link"}
                  aria-current={pathname === link.href ? "page" : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  {t.nav[link.key]}
                </Link>
              );
            })}
          </div>

          <div className="lang-switch" role="group" aria-label={t.language.switchLabel}>
            <button
              type="button"
              onClick={() => setLanguage("ar")}
              aria-pressed={language === "ar"}
              className={language === "ar" ? "lang-switch__btn is-active" : "lang-switch__btn"}
            >
              {t.language.ar}
            </button>
            <button
              type="button"
              onClick={() => setLanguage("en")}
              aria-pressed={language === "en"}
              className={language === "en" ? "lang-switch__btn is-active" : "lang-switch__btn"}
            >
              {t.language.en}
            </button>
          </div>
          <Link href="/contact" className="button button--small nav-partner" onClick={() => setMenuOpen(false)}>{t.nav.partner}</Link>
        </div>
      </nav>
    </header>
  );
}

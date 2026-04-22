"use client";

import Link from "next/link";
import { useLanguage } from "@/i18n/language-context";

export function SiteFooter() {
  const { t } = useLanguage();

  return (
    <footer className="site-footer-wrap">
      <div className="site-footer container">
        <div>
          <p className="site-footer__title">Khubzati</p>
          <p className="muted">{t.footer.description}</p>
        </div>

        <div className="site-footer__links">
          <Link href="/about">{t.footer.about}</Link>
          <Link href="/stores">{t.footer.stores}</Link>
          <Link href="/app">{t.footer.appRoutes}</Link>
          <Link href="/contact">{t.footer.partner}</Link>
        </div>
      </div>
    </footer>
  );
}

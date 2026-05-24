"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/i18n/language-context";

export function SiteFooter() {
  const { t } = useLanguage();

  return (
    <footer className="site-footer-wrap">
      <div className="site-footer container">
        <div>
          <p className="site-footer__title">
            <span className="site-footer__brand">
              <span className="site-footer__logo-wrap" aria-hidden="true">
                <Image src="/khubzati-logo.svg" alt="" width={44} height={27} className="site-footer__logo" />
              </span>
              <span>Khubzati</span>
            </span>
          </p>
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

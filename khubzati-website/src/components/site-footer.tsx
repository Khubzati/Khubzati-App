"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/i18n/language-context";

export function SiteFooter() {
  const { language, t } = useLanguage();
  const ar = language === "ar";

  return (
    <footer className="site-footer-wrap">
      <div className="site-footer container">
        <div className="site-footer__intro">
          <Link href="/" className="site-footer__title">
            <Image src="/khubzati-logo.svg" alt="" width={44} height={27} className="site-footer__logo" />
            <span>Khubzati <span lang="ar" dir="rtl">خبزاتي</span></span>
          </Link>
          <p className="muted">{t.footer.description}</p>
        </div>
        <div className="site-footer__column">
          <h2>{ar ? "روابط مفيدة" : "Explore"}</h2>
          <Link href="/stores">{t.footer.stores}</Link>
          <Link href="/app">{ar ? "كيف يعمل خبزاتي" : "How Khubzati works"}</Link>
          <Link href="/about">{t.footer.about}</Link>
          <Link href="/contact">{t.footer.partner}</Link>
        </div>
        <div className="site-footer__column">
          <h2>{ar ? "تواصل معنا" : "Contact"}</h2>
          <a href="mailto:khubzati.dgh@gmail.com">khubzati.dgh@gmail.com</a>
          <a href="tel:+962798913567" dir="ltr">+962 79 891 3567</a>
        </div>
        <div className="site-footer__bottom">
          <span>© {new Date().getFullYear()} Khubzati</span>
          <span>{ar ? "طازج من متاجر حارتك" : "Fresh from your neighborhood"}</span>
        </div>
      </div>
    </footer>
  );
}

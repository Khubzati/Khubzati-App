import type { Metadata } from "next";
import { Cairo, Manrope, Playfair_Display } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { LanguageProvider } from "@/i18n/language-context";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body"
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading"
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-arabic"
});

export const metadata: Metadata = {
  metadataBase: new URL("https://khubzati.local"),
  title: {
    default: "Khubzati | Fresh local bread and food routing",
    template: "%s | Khubzati"
  },
  description:
    "Khubzati connects neighborhood bakeries, restaurants, and cafes with customers through smarter food routing and premium UX."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${manrope.variable} ${playfair.variable} ${cairo.variable}`}>
        <LanguageProvider>
          <div className="site-bg" aria-hidden="true" />
          <SiteNav />
          <main className="container page-content">{children}</main>
          <SiteFooter />
        </LanguageProvider>
      </body>
    </html>
  );
}

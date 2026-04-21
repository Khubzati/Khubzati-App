import type { Metadata } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body"
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading"
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
    <html lang="en">
      <body className={`${manrope.variable} ${playfair.variable}`}>
        <div className="site-bg" aria-hidden="true" />
        <SiteNav />
        <main className="container page-content">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}

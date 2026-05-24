import type { Metadata } from "next";
import localFont from "next/font/local";
import { Lato } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { LanguageProvider } from "@/i18n/language-context";
import { getSiteUrl } from "@/lib/seo";
import "./globals.css";

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-body"
});

const geDinarOne = localFont({
  src: "./fonts/ge-dinar-one-medium.otf",
  display: "swap",
  variable: "--font-arabic"
});

const siteUrl = getSiteUrl();
const defaultTitle = "Khubzati | Fresh local bread and food routing";
const defaultDescription =
  "Khubzati connects neighborhood bakeries, restaurants, and cafes with customers through smarter food routing and premium UX.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: "%s | Khubzati"
  },
  description: defaultDescription,
  applicationName: "Khubzati",
  category: "food delivery",
  keywords: [
    "Khubzati",
    "Jordan food delivery",
    "bakery delivery",
    "restaurant delivery",
    "cafe delivery",
    "local bakeries",
    "B2B food logistics"
  ],
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: defaultTitle,
    description: defaultDescription,
    siteName: "Khubzati",
    locale: "ar_JO",
    alternateLocale: ["en_US"],
    images: [
      {
        url: "/khubzati-logo.svg",
        width: 512,
        height: 512,
        alt: "Khubzati logo"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: ["/khubzati-logo.svg"]
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: ["/icon.svg"],
    apple: ["/icon.svg"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Khubzati",
    url: siteUrl,
    logo: `${siteUrl}/khubzati-logo.svg`,
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: "khubzati.dgh@gmail.com",
        telephone: "+962798913567",
        areaServed: "JO",
        availableLanguage: ["ar", "en"]
      }
    ]
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Khubzati",
    url: siteUrl,
    inLanguage: ["ar", "en"]
  };

  return (
    <html lang="ar" dir="rtl">
      <body className={`${lato.variable} ${geDinarOne.variable}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
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

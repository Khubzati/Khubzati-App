import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { SmoothScroll } from "@/components/smooth-scroll";
import { LanguageProvider } from "@/i18n/language-context";
import { getSiteUrl } from "@/lib/seo";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const lato = localFont({
  src: [
    { path: "../../public/fonts/Lato-Regular.ttf", weight: "400", style: "normal" },
    { path: "../../public/fonts/Lato-Bold.ttf", weight: "700", style: "normal" }
  ],
  display: "swap",
  variable: "--font-body"
});

const geDinarOne = localFont({
  src: "./fonts/ge-dinar-one-medium.otf",
  display: "swap",
  variable: "--font-arabic"
});

const siteUrl = getSiteUrl();
const defaultTitle = "خبزاتي | اكتشف المخابز والمطاعم المحلية";
const defaultDescription =
  "اكتشف المخابز والمطاعم المحلية على خبزاتي، وتعرّف على المتاجر المتاحة بالقرب منك.";

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#f5ecdf"
};

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
    "خبزاتي",
    "مخابز محلية",
    "خبز طازج",
    "مطاعم محلية",
    "Khubzati",
    "local bakeries"
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
        url: "/images/hero-bread.png",
        width: 640,
        height: 640,
        alt: "خبز طازج من مخبز محلي"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: ["/images/hero-bread.png"]
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
    "@id": `${siteUrl}/#organization`,
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
    "@id": `${siteUrl}/#website`,
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
          <SmoothScroll />
          <div className="site-bg" aria-hidden="true" />
          <SiteNav />
          <main className="container page-content">{children}</main>
          <SiteFooter />
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  );
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Secure checkout flow for Khubzati orders.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      "max-image-preview": "none",
      "max-snippet": 0,
      "max-video-preview": 0
    }
  }
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}

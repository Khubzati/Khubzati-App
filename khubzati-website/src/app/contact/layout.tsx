import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Khubzati for onboarding, partnerships, and support for bakery, restaurant, and cafe delivery workflows.",
  alternates: {
    canonical: "/contact"
  }
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}

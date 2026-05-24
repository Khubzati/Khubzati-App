import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn how Khubzati supports neighborhood bakeries, restaurants, and cafes with reliable food routing and delivery operations.",
  alternates: {
    canonical: "/about"
  }
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}

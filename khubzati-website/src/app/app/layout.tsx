import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "App Routes",
  description:
    "See the Khubzati customer and merchant journey, from store discovery and ordering to fulfillment and delivery operations.",
  alternates: {
    canonical: "/app"
  }
};

export default function AppRouteLayout({ children }: { children: React.ReactNode }) {
  return children;
}

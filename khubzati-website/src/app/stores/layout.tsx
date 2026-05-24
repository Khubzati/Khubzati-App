import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stores",
  description:
    "Explore verified bakeries, restaurants, and cafes available on Khubzati, with route-friendly delivery coverage across Jordan.",
  alternates: {
    canonical: "/stores"
  }
};

export default function StoresLayout({ children }: { children: React.ReactNode }) {
  return children;
}

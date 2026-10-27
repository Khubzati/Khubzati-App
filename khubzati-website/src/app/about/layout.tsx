import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "عن خبزاتي",
  description: "تعرف على خبزاتي، منصة محلية لاكتشاف المخابز والمطاعم القريبة ومعلوماتها.",
  alternates: {
    canonical: "/about"
  }
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}

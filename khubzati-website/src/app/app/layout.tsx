import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "كيف يعمل خبزاتي",
  description: "تعرف على مسارات استكشاف المتاجر وتجربة العميل والشريك عبر تطبيقات خبزاتي.",
  alternates: {
    canonical: "/app"
  }
};

export default function AppRouteLayout({ children }: { children: React.ReactNode }) {
  return children;
}

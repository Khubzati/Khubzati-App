import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "المخابز والمطاعم المحلية",
  description: "تصفح المخابز والمطاعم المنشورة حاليًا على خبزاتي وابحث حسب الاسم أو المدينة أو الفئة.",
  alternates: {
    canonical: "/stores"
  }
};

export default function StoresLayout({ children }: { children: React.ReactNode }) {
  return children;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "تواصل وشراكة",
  description: "تواصل مع فريق خبزاتي للاستفسار عن انضمام المخابز والمطاعم المحلية.",
  alternates: {
    canonical: "/contact"
  }
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}

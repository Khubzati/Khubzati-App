import { ReactNode } from "react";

type SectionTitleProps = {
  eyebrow: string;
  title: string;
  description: ReactNode;
};

export function SectionTitle({ eyebrow, title, description }: SectionTitleProps) {
  return (
    <header className="section-title">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      <p className="muted">{description}</p>
    </header>
  );
}

"use client";

import { CSSProperties, ElementType, ReactNode } from "react";
import "./StarBorder.css";

type StarBorderProps = {
  as?: ElementType;
  className?: string;
  /** Colour of the travelling star glow. */
  color?: string;
  /** Duration of one travel cycle, e.g. "6s". */
  speed?: string;
  thickness?: number;
  children?: ReactNode;
  style?: CSSProperties;
};

/**
 * React Bits "Star Border" — an animated glow that travels along the top and
 * bottom edges of an element, framing it with a soft moving star trail.
 * Pure CSS; the trail animation is paused under prefers-reduced-motion
 * (handled in StarBorder.css).
 */
export default function StarBorder({
  as: Tag = "span",
  className = "",
  color = "white",
  speed = "6s",
  thickness = 2,
  children,
  style,
}: StarBorderProps) {
  return (
    <Tag
      className={`star-border ${className}`}
      style={{ padding: `${thickness}px 0`, ...style }}
    >
      <span
        className="star-border__glow star-border__glow--bottom"
        style={{ background: `radial-gradient(circle, ${color}, transparent 10%)`, animationDuration: speed }}
        aria-hidden="true"
      />
      <span
        className="star-border__glow star-border__glow--top"
        style={{ background: `radial-gradient(circle, ${color}, transparent 10%)`, animationDuration: speed }}
        aria-hidden="true"
      />
      <span className="star-border__content">{children}</span>
    </Tag>
  );
}

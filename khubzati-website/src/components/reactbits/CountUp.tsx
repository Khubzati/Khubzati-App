"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/lib/use-reduced-motion";

type CountUpProps = {
  to: number;
  from?: number;
  duration?: number;
  className?: string;
  /** Formats the current value into the displayed string (e.g. zero-padding). */
  format?: (value: number) => string;
};

/**
 * React Bits "Count Up" — a number animates from `from` to `to` when it scrolls
 * into view. Adapted to GSAP + ScrollTrigger. The final rendered string is
 * identical to formatting `to`, so no displayed content changes. Honors
 * prefers-reduced-motion by showing the final value immediately.
 */
export default function CountUp({
  to,
  from = 0,
  duration = 1.4,
  className = "",
  format = (value) => String(Math.round(value)),
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (reduced) {
      el.textContent = format(to);
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    const counter = { value: from };
    el.textContent = format(from);

    const ctx = gsap.context(() => {
      gsap.to(counter, {
        value: to,
        duration,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          once: true,
        },
        onUpdate: () => {
          el.textContent = format(counter.value);
        },
      });
    }, el);

    return () => ctx.revert();
  }, [to, from, duration, reduced, format]);

  return <span ref={ref} className={className}>{format(to)}</span>;
}

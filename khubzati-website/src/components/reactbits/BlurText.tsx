"use client";

import { ElementType, Fragment, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { gsap } from "gsap";
import { useReducedMotion } from "@/lib/use-reduced-motion";

// Run before paint on the client to avoid a flash of the un-blurred title,
// but fall back to a no-op effect during SSR.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

type BlurTextProps = {
  text: string;
  /** Animate per "words" (default) or per "chars". */
  animateBy?: "words" | "chars";
  /** Direction the pieces travel in from. */
  direction?: "top" | "bottom";
  delay?: number;
  className?: string;
  /** The element to render as. Defaults to a paragraph. */
  as?: ElementType;
};

/**
 * React Bits "Blur Text" — text reveals piece by piece, each fading in from a
 * soft blur. Adapted to GSAP so it shares the project's single animation engine.
 * The full text is always present in the DOM (accessible + SEO-safe); only the
 * visual presentation animates. Honors prefers-reduced-motion.
 */
export default function BlurText({
  text,
  animateBy = "words",
  direction = "top",
  delay = 90,
  className = "",
  as: Tag = "p",
}: BlurTextProps) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const pieces = useMemo(
    () => (animateBy === "words" ? text.split(" ") : Array.from(text)),
    [text, animateBy]
  );

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const targets = el.querySelectorAll<HTMLElement>("[data-blur-piece]");
    if (!targets.length) return;

    if (reduced) {
      gsap.set(targets, { opacity: 1, filter: "blur(0px)", y: 0 });
      return;
    }

    const fromY = direction === "top" ? -14 : 14;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { opacity: 0, filter: "blur(10px)", y: fromY },
        {
          opacity: 1,
          filter: "blur(0px)",
          y: 0,
          duration: 0.7,
          ease: "power2.out",
          stagger: delay / 1000,
        }
      );
    }, el);

    return () => ctx.revert();
  }, [reduced, direction, delay, pieces]);

  return (
    <Tag ref={ref} className={className}>
      {pieces.map((piece, index) => (
        <Fragment key={`${piece}-${index}`}>
          <span
            data-blur-piece
            style={{ display: "inline-block", willChange: "transform, filter, opacity" }}
          >
            {piece === " " ? " " : piece}
          </span>
          {/* A real, breakable space lives in the parent's inline flow so the
              heading can still wrap, and spaces never collapse inside a piece. */}
          {animateBy === "words" && index < pieces.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Tag>
  );
}

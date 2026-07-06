"use client";

import {
  createContext,
  createElement,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";

/* CSS-driven scroll reveals. The hidden state lives in globals.css behind
   (prefers-reduced-motion: no-preference); this module only observes and
   adds .is-in. Content is therefore visible by default for reduced motion,
   print, no-JS, and headless renderers — the animation is an enhancement,
   never a gate. */

type RevealVariant = "wipe" | "wipe-right" | "slide" | "fade";

const VARIANT_CLASS: Record<RevealVariant, string> = {
  wipe: "reveal-wipe",
  "wipe-right": "reveal-wipe-right",
  slide: "reveal-slide",
  fade: "reveal-fade",
};

function useInViewOnce<T extends HTMLElement>(threshold: number) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      /* rootMargin pulls the trigger line up slightly so tall containers
         still fire; threshold stays low for the same reason. */
      { threshold, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return { ref, inView };
}

export function Reveal({
  children,
  className,
  variant = "wipe",
  delay = 0,
  as = "div",
  threshold = 0.15,
}: {
  children: React.ReactNode;
  className?: string;
  variant?: RevealVariant;
  delay?: number;
  as?: "div" | "h2" | "h3" | "p" | "li" | "span";
  threshold?: number;
}) {
  const { ref, inView } = useInViewOnce<HTMLElement>(threshold);
  return createElement(
    as,
    {
      ref,
      className: cn("reveal", VARIANT_CLASS[variant], inView && "is-in", className),
      style: delay ? { ["--reveal-delay" as string]: `${delay}ms` } : undefined,
    },
    children
  );
}

/* Group: one observer on the container; items stagger via CSS delay using
   an explicit index (render must stay pure — no counters). */
const GroupContext = createContext<{ inView: boolean; gap: number } | null>(null);

export function RevealGroup({
  children,
  className,
  gap = 80,
  threshold = 0.05,
}: {
  children: React.ReactNode;
  className?: string;
  gap?: number;
  threshold?: number;
}) {
  const { ref, inView } = useInViewOnce<HTMLDivElement>(threshold);
  return (
    <GroupContext.Provider value={{ inView, gap }}>
      <div ref={ref} className={className}>
        {children}
      </div>
    </GroupContext.Provider>
  );
}

export function RevealItem({
  children,
  className,
  variant = "wipe",
  index = 0,
}: {
  children: React.ReactNode;
  className?: string;
  variant?: RevealVariant;
  index?: number;
}) {
  const ctx = useContext(GroupContext);
  const inView = ctx?.inView ?? true;
  const delay = ctx ? index * ctx.gap : 0;
  return (
    <div
      className={cn("reveal", VARIANT_CLASS[variant], inView && "is-in", className)}
      style={delay ? { ["--reveal-delay" as string]: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}

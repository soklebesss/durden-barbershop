"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/site/magnetic";
import { StickerBadge, Tape } from "@/components/site/sticker";
import { useBooking } from "@/components/site/booking";
import { DUR, EASE } from "@/lib/motion";
import { SHOP } from "@/lib/data";

const LINES = ["FRESH", "FADES.", "NO MERCY."];

/* The 3D razor is client-only (Three.js touches window/WebGL) and heavy, so it
   loads after paint. Until it arrives, a concrete panel holds the space so the
   layout never jumps. */
const Hero3D = dynamic(
  () => import("@/components/site/hero-3d").then((m) => m.Hero3D),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 flex items-end justify-center bg-[radial-gradient(120%_90%_at_70%_20%,var(--ct-gray-850),transparent_60%)]">
        <span className="label-mono mb-10 text-fg-muted/60">RENDERING BLADE…</span>
      </div>
    ),
  }
);

export function Hero() {
  const { open } = useBooking();
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  /* Parallax collapses to 0 under reduced motion. */
  const portraitY = useTransform(scrollYProgress, [0, 1], ["0%", reduced ? "0%" : "12%"]);
  const headlineY = useTransform(scrollYProgress, [0, 1], ["0%", reduced ? "0%" : "-6%"]);

  /* Same targets always; durations collapse when reduced (hydration-safe). */
  const dur = (d: number) => (reduced ? 0 : d);
  const del = (d: number) => (reduced ? 0 : d);

  return (
    <section
      ref={ref}
      id="top"
      className="gutter relative flex min-h-dvh flex-col justify-end overflow-hidden pb-10 pt-36 sm:pt-40"
    >
      {/* backdrop wordmark ghost */}
      <span
        aria-hidden
        className="font-display pointer-events-none absolute -right-[4vw] top-24 select-none text-[24vw] leading-none text-transparent opacity-40 [-webkit-text-stroke:1px_var(--ct-gray-700)]"
      >
        DB
      </span>

      {/* floating 3D razor — occupies the right half, pivots to the mouse (≥md) */}
      <motion.div
        style={{ y: portraitY }}
        className="pointer-events-none absolute right-0 top-0 hidden h-full w-[56vw] md:block"
      >
        <Hero3D />
        <Tape className="absolute right-[7vw] top-[20vh] z-10" rotate={-8}>
          BY APPOINTMENT
        </Tape>
        <StickerBadge className="absolute bottom-[16vh] left-[6vw] w-28" />
      </motion.div>

      {/* kinetic headline */}
      <motion.div style={{ y: headlineY }} className="relative z-10">
        <p className="label-mono mb-4 text-accent">
          {SHOP.short} — ATHENS — EST. {SHOP.est}
        </p>
        <h1 className="font-display text-display-xl text-fg">
          {LINES.map((line, i) => (
            <span key={line} className="block overflow-hidden">
              <motion.span
                className={`group relative block whitespace-nowrap ${i === 2 ? "text-accent" : ""}`}
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{
                  duration: dur(DUR.reveal),
                  ease: EASE.blade,
                  delay: del(0.15 + i * 0.12),
                }}
              >
                <FlipText text={line} />
              </motion.span>
            </span>
          ))}
        </h1>

        {/* mobile 3D band — the blade must survive small screens too */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: del(0.6), duration: dur(DUR.standard) }}
          className="relative mt-8 h-[36vh] w-full border border-border-default md:hidden"
        >
          <Hero3D />
          <Tape className="absolute -top-3 right-4 z-10 text-[0.65rem]" rotate={3}>
            WALK-INS WELCOME
          </Tape>
        </motion.div>

        <div className="mt-8 flex max-w-3xl flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: del(0.7), duration: dur(DUR.standard) }}
            className="max-w-sm text-lg leading-relaxed text-fg-muted"
          >
            Clippers out. Excuses out. A chair, a blade, thirty minutes — and you
            leave better than you came.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: del(0.85), duration: dur(DUR.standard), ease: EASE.snap }}
          >
            <Magnetic>
              <Button size="lg" onClick={() => open()}>
                Book a chair
              </Button>
            </Magnetic>
          </motion.div>
        </div>
      </motion.div>

      {/* bottom meta strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: del(1.1), duration: dur(DUR.standard) }}
        className="label-mono mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-border-default pt-4 text-fg-muted"
      >
        <span>TUE–SAT · ONE CHAIR · SPYROS</span>
        <a href={SHOP.phoneHref} className="transition-colors hover:text-accent">
          {SHOP.phone}
        </a>
        <a href="#services" className="flex items-center gap-2 transition-colors hover:text-accent">
          SCROLL FOR THE MENU <ArrowDown className="size-4" aria-hidden />
        </a>
      </motion.div>
    </section>
  );
}

/* Per-letter flip on hover (adapted from the FlipLink pattern): the visible row
   slides up and out while a duplicate row slides up into its place, staggered
   letter-by-letter. The parent line carries `group relative` and the wrapper
   clips with `overflow-hidden`. Hover-only, so it always renders. */
function FlipText({ text }: { text: string }) {
  const chars = [...text];
  const cell = (c: string) => (c === " " ? " " : c);
  return (
    <>
      <span className="flex">
        {chars.map((c, i) => (
          <span
            key={i}
            className="inline-block transition-transform duration-300 ease-[var(--ease-blade)] group-hover:-translate-y-[110%]"
            style={{ transitionDelay: `${i * 25}ms` }}
          >
            {cell(c)}
          </span>
        ))}
      </span>
      <span aria-hidden className="absolute inset-0 flex">
        {chars.map((c, i) => (
          <span
            key={i}
            className="inline-block translate-y-[110%] transition-transform duration-300 ease-[var(--ease-blade)] group-hover:translate-y-0"
            style={{ transitionDelay: `${i * 25}ms` }}
          >
            {cell(c)}
          </span>
        ))}
      </span>
    </>
  );
}

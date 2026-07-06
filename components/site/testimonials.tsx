"use client";

/* Word of mouth as vertical auto-scrolling columns (adapted from the
   TestimonialsColumn pattern): each column loops its cards upward at its own
   pace; the stack is masked top and bottom so cards fade in and out. */

import React from "react";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/site/section-heading";
import { cn } from "@/lib/utils";
import { TESTIMONIALS, type Testimonial } from "@/lib/data";

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

export function Testimonials() {
  const col1 = TESTIMONIALS.slice(0, 3);
  const col2 = TESTIMONIALS.slice(3, 6);
  const col3 = [TESTIMONIALS[1], TESTIMONIALS[4], TESTIMONIALS[2]];

  return (
    <section id="word" className="section-pad relative overflow-hidden">
      <div className="gutter">
        <SectionHeading
          title="Don't take our word for it"
          tape="WORD ON THE STREET"
          tapeRotate={1.5}
        />

        <div className="relative mx-auto mt-12 flex h-[560px] max-w-5xl justify-center gap-6 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,#000_12%,#000_88%,transparent)] [-webkit-mask-image:linear-gradient(to_bottom,transparent,#000_12%,#000_88%,transparent)] md:h-[640px]">
          <Column items={col1} duration={19} />
          <Column items={col2} duration={25} className="hidden md:block" />
          <Column items={col3} duration={22} className="hidden lg:block" />
        </div>
      </div>
    </section>
  );
}

function Column({
  items,
  duration = 20,
  className,
}: {
  items: Testimonial[];
  duration?: number;
  className?: string;
}) {
  return (
    <div className={cn("w-full max-w-xs", className)}>
      <motion.div
        animate={{ translateY: "-50%" }}
        transition={{ duration, repeat: Infinity, ease: "linear", repeatType: "loop" }}
        className="flex flex-col gap-6 pb-6"
      >
        {[...Array(2)].map((_, dup) => (
          <React.Fragment key={dup}>
            {items.map((t, i) => (
              <TestimonialCard key={`${dup}-${i}`} {...t} />
            ))}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
}

function TestimonialCard({ quote, name, detail }: Testimonial) {
  return (
    <figure className="w-full border border-border-default bg-bg-raised p-7">
      <blockquote className="text-base leading-relaxed text-fg">
        &ldquo;{quote}&rdquo;
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-3">
        <span className="flex size-11 flex-none items-center justify-center border-2 border-accent bg-bg font-display text-lg leading-none text-accent">
          {initials(name)}
        </span>
        <span className="min-w-0">
          <span className="font-display block text-lg uppercase leading-none text-fg">
            {name}
          </span>
          <span className="label-mono mt-1 block text-fg-muted">{detail}</span>
        </span>
      </figcaption>
    </figure>
  );
}

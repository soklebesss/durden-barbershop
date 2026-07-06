"use client";

import { Phone } from "lucide-react";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/site/reveal";
import { EditorialImage } from "@/components/site/editorial-image";
import { Tape, StickerBadge } from "@/components/site/sticker";
import { useBooking } from "@/components/site/booking";
import { Button } from "@/components/ui/button";
import { BARBERS, SHOP } from "@/lib/data";

/* One chair, one barber. A single spotlight, not a roster grid — portrait on
   one side, the story and the booking CTA on the other. */
export function Barbers() {
  const { open } = useBooking();
  const spyros = BARBERS[0];

  return (
    <section id="barbers" className="section-pad gutter relative">
      <SectionHeading title="The barber" tape="ONE CHAIR. ALL IN." tapeRotate={2} />

      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[0.85fr_1fr] lg:gap-16">
        {/* portrait */}
        <Reveal>
          <div className="group relative rotate-1">
            <div className="relative aspect-[4/5] overflow-hidden border border-border-default transition-transform duration-300 ease-[var(--ease-snap)] group-hover:-rotate-1 motion-reduce:transition-none">
              <EditorialImage seed={spyros.seed} variant="portrait" label="SPYROS / 35MM / DB" accent />
              <Tape className="absolute right-4 top-4 z-10 text-[0.65rem]" rotate={3}>
                SOLE PROPRIETOR
              </Tape>
            </div>
            <StickerBadge className="absolute -bottom-8 -left-8 hidden w-24 sm:block" />
          </div>
        </Reveal>

        {/* story + CTA */}
        <Reveal>
          <p className="label-mono text-accent">EST. {SHOP.est} · AMPELOKIPI</p>
          <h3 className="font-display mt-3 text-display-lg leading-[0.9] text-fg">
            {spyros.name}
            <span className="text-accent">.</span>
          </h3>
          <p className="label-mono mt-2 text-fg-muted">&ldquo;{spyros.alias}&rdquo;</p>

          <div className="mt-6 max-w-xl space-y-4 text-lg leading-relaxed text-fg-muted">
            <p>
              Three years and a wall of five-star regulars later, Spyros opened his
              own chair two blocks from Ambelokipi station. One barber, one room,
              full attention on your head — no conveyor belt, no small talk you
              didn&apos;t start.
            </p>
            <p>
              He reads your hair type and face shape before a blade moves, then
              builds the cut around it. Fades, beards, buzz cuts, kids&apos; cuts,
              clean head shaves — done with attention down to the last line. Luna
              the dog handles morale.
            </p>
          </div>

          <ul className="label-mono mt-6 flex flex-wrap gap-x-6 gap-y-2 text-fg-muted">
            {spyros.specialty.split(" & ").flatMap((s) => s.split(", ")).map((tag) => (
              <li key={tag} className="flex items-center gap-2">
                <span className="text-accent">/</span>
                {tag.toUpperCase()}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button size="lg" onClick={() => open()}>
              Book with Spyros
            </Button>
            <a
              href={SHOP.phoneHref}
              className="label-mono flex items-center gap-2 text-fg-muted transition-colors hover:text-accent"
            >
              <Phone className="size-4" aria-hidden />
              {SHOP.phone}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

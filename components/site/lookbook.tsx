"use client";

/* Interactive selector (adapted from 21st.dev minhxthanh/interactive-selector).
   A row of image panels; the active one expands to reveal the photo + label,
   the rest collapse to strips. Hover to preview on desktop, tap on mobile.
   Panels stagger in on mount; reduced motion shows them at rest immediately. */

import { SectionHeading } from "@/components/site/section-heading";
import { HoverExpand_001 } from "@/components/ui/skiper-ui/skiper52";

const CUTS = [
  {
    src: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1000&q=80",
    alt: "Skin fade, blended clean",
    code: "FADES & TAPERS",
  },
  {
    src: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=1000&q=80",
    alt: "Beard sculpt, hot-towel finish",
    code: "BEARD SCULPT",
  },
  {
    src: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=1000&q=80",
    alt: "Buzz cut and line-up",
    code: "BUZZ & LINE-UP",
  },
  {
    src: "https://images.unsplash.com/photo-1596728325488-58c87691e9af?auto=format&fit=crop&w=1000&q=80",
    alt: "Head shave, clean to the skin",
    code: "HEAD SHAVE",
  },
  {
    src: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1000&q=80",
    alt: "Kids' cut",
    code: "KIDS' CUTS",
  },
];

export function Lookbook() {
  return (
    <section id="lookbook" className="section-pad gutter relative">
      <SectionHeading title="The lookbook" tape="RECEIPTS" tapeRotate={-4} />

      <div className="flex w-full justify-center overflow-x-auto">
        <HoverExpand_001 images={CUTS} className="mx-auto" />
      </div>

      <p className="label-mono mt-6 text-fg-muted">
        HOVER OR TAP A PANEL — REAL CUTS, REAL CHAIRS
      </p>
    </section>
  );
}

"use client";

/* The menu, as a FlowingMenu (GSAP marquee): each service row reveals an
   edge-aware sliding marquee of the name + photo on hover. Clicking a row
   opens the booking sheet for that service. */

import FlowingMenu from "@/components/FlowingMenu";
import { SectionHeading } from "@/components/site/section-heading";
import { useBooking } from "@/components/site/booking";
import { SERVICES } from "@/lib/data";

/* One barbershop photo per service (all URLs verified). */
const SERVICE_IMAGES: Record<string, string> = {
  "mens-cut": "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80",
  "kids-cut": "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&q=80",
  "cut-beard": "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=800&q=80",
  "head-shave": "https://images.unsplash.com/photo-1596728325488-58c87691e9af?w=800&q=80",
  "shave-beard": "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=800&q=80",
};

export function Services() {
  const { open } = useBooking();

  const items = SERVICES.map((s) => ({
    link: "#services",
    text: `${s.name} — €${s.price}`,
    image: SERVICE_IMAGES[s.id],
    onClick: open,
  }));

  return (
    <section id="services" className="section-pad gutter relative">
      <SectionHeading title="What we do" tape="THE MENU — PRICES FLAT" tapeRotate={-3} />

      <div className="h-[420px] border-y-2 border-border-default sm:h-[560px]">
        <FlowingMenu
          items={items}
          bgColor="var(--bg)"
          textColor="var(--fg)"
          marqueeBgColor="var(--accent)"
          marqueeTextColor="var(--on-accent)"
          borderColor="var(--border-strong)"
        />
      </div>

      <p className="label-mono mt-6 text-fg-muted">
        ALL PRICES FLAT. NO &ldquo;STARTING AT.&rdquo; NO ASTERISKS.
      </p>
    </section>
  );
}

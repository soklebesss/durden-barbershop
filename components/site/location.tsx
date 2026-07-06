"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/site/reveal";
import { useConsent } from "@/components/site/consent";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HOURS, HOUSE_RULES, SHOP } from "@/lib/data";

/* Inverted "Bone" section — the one intentional light break in the page.
   Map embed is third-party (OpenStreetMap) and only loads with cookie
   consent or an explicit click. */
export function Location() {
  const { consent } = useConsent();
  const [mapRequested, setMapRequested] = useState(false);
  const showMap = consent === "accepted" || mapRequested;

  /* Ampelokipoi, Athens — pin from the shared Google Maps place. */
  const bbox = "23.7544%2C37.9843%2C23.7644%2C37.9903";
  const marker = "37.9873%2C23.7594";

  return (
    <section id="location" className="bg-bg-inverted text-fg-inverted">
      <div className="hazard-stripes h-4" aria-hidden />
      <div className="section-pad gutter">
        <SectionHeading title="Find us" tape="AMPELOKIPOI, ATHENS" tapeRotate={-2.5} inverted />

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.2fr_1fr]">
          {/* map + address */}
          <Reveal className="flex flex-col gap-6">
            <div className="relative aspect-[4/3] w-full overflow-hidden border-2 border-fg-inverted bg-[#e5e2da]">
              {showMap ? (
                <iframe
                  title="Map — Durden Barbershop, Ampelokipoi, Athens"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${marker}`}
                  className="absolute inset-0 size-full grayscale contrast-110"
                  loading="lazy"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
                  <MapPin className="size-8 text-accent-ink" aria-hidden />
                  <p className="max-w-xs text-sm">
                    The map is a third-party embed (OpenStreetMap). We only load it
                    with your OK.
                  </p>
                  <Button variant="inverted" size="sm" onClick={() => setMapRequested(true)}>
                    Load the map
                  </Button>
                </div>
              )}
            </div>

            <address className="not-italic">
              <p className="font-display text-display-sm">{SHOP.address}</p>
              <p className="mt-2 flex flex-wrap gap-x-6 gap-y-1 font-mono text-sm">
                <a className="underline decoration-2 underline-offset-4 hover:text-accent-ink" href={SHOP.phoneHref}>
                  {SHOP.phone}
                </a>
                <a className="underline decoration-2 underline-offset-4 hover:text-accent-ink" href={`mailto:${SHOP.email}`}>
                  {SHOP.email}
                </a>
              </p>
            </address>
          </Reveal>

          {/* hours + house rules */}
          <div className="flex flex-col gap-10">
            <Reveal>
              <h3 className="label-mono mb-4 text-accent-ink">HOURS</h3>
              <table className="w-full border-collapse">
                <caption className="sr-only">Opening hours</caption>
                <tbody>
                  {HOURS.map((h) => (
                    <tr key={h.day} className="border-b border-[var(--border-inverted)]">
                      <th scope="row" className="py-3 pr-4 text-left font-display text-2xl uppercase">
                        {h.day}
                      </th>
                      <td className={`py-3 text-right font-mono text-sm ${h.open.startsWith("Closed") ? "text-accent-ink" : ""}`}>
                        {h.open}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Reveal>

            <Reveal>
              <h3 className="label-mono mb-2 text-accent-ink">HOUSE RULES</h3>
              <Accordion type="single" collapsible>
                {HOUSE_RULES.map((r, i) => (
                  <AccordionItem key={r.q} value={`rule-${i}`}>
                    <AccordionTrigger>{r.q}</AccordionTrigger>
                    <AccordionContent>{r.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Reveal>
          </div>
        </div>
      </div>
      <div className="hazard-stripes h-4" aria-hidden />
    </section>
  );
}

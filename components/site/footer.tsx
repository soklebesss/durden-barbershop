"use client";

import Link from "next/link";
import { Instagram } from "lucide-react";
import { Reveal } from "@/components/site/reveal";
import { useBooking } from "@/components/site/booking";
import { Magnetic } from "@/components/site/magnetic";
import { Button } from "@/components/ui/button";
import { SHOP } from "@/lib/data";

export function Footer() {
  const { open } = useBooking();
  const year = new Date().getFullYear();

  return (
    <footer className="gutter relative overflow-hidden border-t border-border-default pb-10 pt-20">
      <div className="mb-16 flex flex-col items-start justify-between gap-10 sm:flex-row sm:items-center">
        <Reveal>
          <p className="font-display text-display-md text-fg">
            Last call for good hair.
          </p>
          <p className="label-mono mt-2 text-fg-muted">STAY SHARP OR STAY HOME.</p>
        </Reveal>
        <Magnetic>
          <Button size="lg" onClick={() => open()}>
            Book a chair
          </Button>
        </Magnetic>
      </div>

      {/* giant wordmark */}
      <Reveal threshold={0.2}>
        <p
          aria-hidden
          className="font-display pointer-events-none select-none whitespace-nowrap text-[17.5vw] leading-[0.85] text-fg"
        >
          DURDEN<span className="text-accent">.</span>
        </p>
      </Reveal>

      <div className="mt-10 flex flex-col gap-6 border-t border-border-default pt-6 sm:flex-row sm:items-center sm:justify-between">
        <nav aria-label="Legal" className="label-mono flex flex-wrap gap-x-6 gap-y-2 text-fg-muted">
          <Link href="/privacy" className="transition-colors hover:text-accent">
            Privacy Policy
          </Link>
          <Link href="/terms" className="transition-colors hover:text-accent">
            Terms of Service
          </Link>
          <a href={SHOP.phoneHref} className="transition-colors hover:text-accent">
            {SHOP.phone}
          </a>
        </nav>

        <div className="flex items-center gap-5">
          <a
            href={SHOP.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="label-mono flex items-center gap-1.5 text-fg-muted transition-colors hover:text-accent"
          >
            <Instagram className="size-4" aria-hidden />
            INSTAGRAM
          </a>
          <a
            href={`https://maps.google.com/?q=${SHOP.mapsQuery}`}
            target="_blank"
            rel="noopener noreferrer"
            className="label-mono text-fg-muted transition-colors hover:text-accent"
          >
            GOOGLE MAPS
          </a>
        </div>
      </div>

      <p className="label-mono mt-6 text-fg-muted/60">
        © {year} {SHOP.name} · {SHOP.address} · UNOFFICIAL DEMO BUILD — CUT WITH CODE, NOT CLIPPERS
      </p>
    </footer>
  );
}

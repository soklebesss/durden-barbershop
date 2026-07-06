"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Marquee } from "@/components/site/marquee";
import { useBooking } from "@/components/site/booking";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
  SheetClose,
  SheetDescription,
} from "@/components/ui/sheet";
import { TICKER_ITEMS, SHOP } from "@/lib/data";

const LINKS = [
  { href: "#services", label: "Services" },
  { href: "#barbers", label: "Barbers" },
  { href: "#lookbook", label: "Lookbook" },
  { href: "#word", label: "Word" },
  { href: "#location", label: "Find us" },
];

export function Navbar() {
  const { open } = useBooking();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      {/* running ticker */}
      <div className="bg-[var(--ticker-bg)] text-[var(--ticker-fg)]">
        <Marquee duration={30}>
          {TICKER_ITEMS.map((item) => (
            <span key={item} className="label-mono flex items-center px-4 py-1.5 font-bold">
              {item}
              <span aria-hidden className="ml-8 select-none">
                //
              </span>
            </span>
          ))}
        </Marquee>
      </div>

      {/* nav bar */}
      <nav
        aria-label="Main"
        className="flex items-center justify-between gap-4 border-b border-border-default bg-[var(--nav-bg)] px-4 py-3 backdrop-blur-md sm:px-8"
      >
        <a href="#top" className="font-display text-xl leading-none text-fg sm:text-2xl">
          DURDEN<span className="text-accent">.</span>
        </a>

        <div className="hidden items-center gap-6 lg:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="label-mono text-fg-muted transition-colors duration-150 hover:text-accent"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Button size="sm" onClick={() => open()} className="hidden sm:inline-flex">
            Book a chair
          </Button>

          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu className="size-5" aria-hidden />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-bg">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <SheetDescription className="sr-only">Site navigation</SheetDescription>
              <nav aria-label="Mobile" className="mt-16 flex flex-col gap-2 px-6">
                {LINKS.map((l, i) => (
                  <SheetClose asChild key={l.href}>
                    <a
                      href={l.href}
                      className="group flex items-baseline gap-4 border-b border-border-default py-4 font-display text-display-sm text-fg transition-colors hover:text-accent"
                    >
                      <span className="label-mono text-fg-muted group-hover:text-accent">
                        0{i + 1}
                      </span>
                      {l.label}
                    </a>
                  </SheetClose>
                ))}
                <SheetClose asChild>
                  <Button
                    size="lg"
                    className="mt-6"
                    onClick={() => setTimeout(() => open(), 250)}
                  >
                    Book a chair
                  </Button>
                </SheetClose>
                <a href={SHOP.phoneHref} className="label-mono mt-4 text-fg-muted hover:text-accent">
                  {SHOP.phone}
                </a>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}

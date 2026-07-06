# CUTTHROAT — Locked Visual Direction

> Pipeline stage: /ui-ux-pro-max (stage 2 of 6)
> Base pattern from skill search: "Exaggerated Minimalism / type-as-hero" — adapted to brutalist-street, brand palette overrides applied.

## The One Direction: EDITORIAL BRUTALIST-STREET

Poster-wall energy, art-directed like a zine. Typography IS the interface. Dark-first, one page, one accent. Every section reads like a spread, not a "component."

**Litmus test for every screen:** if it could appear in a SaaS template marketplace, it's wrong.

## Non-negotiables

1. **Dark-first.** Asphalt `#0A0A0A` base. Light is the exception (inverted "Bone" blocks used as section breaks, e.g. Location).
2. **One accent.** Hazard Orange `#FF4D00`. Marks action + price + danger. Never decorative fills.
3. **Type as hero.** Anton display at `clamp(3rem, 10vw, 12rem)`, tracking -0.02em, uppercase. Body: Space Grotesk. Data/labels/tickers: JetBrains Mono.
4. **Sharp geometry.** Radius 0 on structural elements; 2px max on inputs. No pills except the sticker badges (which are circles by design, not "rounded UI").
5. **Asymmetry + overlap.** Off-grid rotations (−2°…2°) on stickers/tape, images breaking column bounds, headlines overlapping imagery. Intentional whitespace, not centered symmetry.
6. **Texture.** Film grain overlay (SVG turbulence, fixed, low opacity), halftone dots, hazard-stripe dividers, gaffer tape strips.

## Type scale (desktop → mobile via clamp)

| Token | Size | Font | Use |
|-------|------|------|-----|
| display-xl | clamp(4rem, 12vw, 13rem) | Anton | Hero headline, footer wordmark |
| display-lg | clamp(3rem, 8vw, 8rem) | Anton | Section titles |
| display-md | clamp(2rem, 5vw, 4.5rem) | Anton | Sub-headlines, service names |
| display-sm | clamp(1.5rem, 3vw, 2.5rem) | Anton | Card titles, barber names |
| body-lg | 1.25rem | Space Grotesk | Lede paragraphs |
| body | 1rem | Space Grotesk | Default |
| body-sm | 0.875rem | Space Grotesk | Secondary |
| label | 0.8125rem | JetBrains Mono | CAPS labels, tracking 0.08em |
| ticker | 0.875rem | JetBrains Mono | Marquee, prices |

## Spacing scale

4px base: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128 / 192. Section padding: `clamp(4rem, 10vh, 8rem)` vertical. Container: full-bleed sections with inner `max-w-[1600px]`, gutters `clamp(1rem, 4vw, 4rem)` — wide, editorial, not the usual `max-w-6xl` center column.

## Motion language

- **Signature move:** clip-path wipes (inset reveal, like a squeegee pull) + stagger. NOT fade-up-on-everything.
- Durations: micro 150ms / standard 300ms / reveal 600ms / hero intro 900ms.
- Easing: `cubic-bezier(0.83, 0, 0.17, 1)` ("blade") for wipes; `cubic-bezier(0.16, 1, 0.3, 1)` ("snap-out") for entrances.
- Magnetic buttons (cursor-pull ≤ 12px), custom cursor dot+ring on fine pointers only.
- Marquee ticker in nav; auto-scroll testimonials; parallax (subtle, ≤ 8%) on hero portrait + lookbook.
- ALL gated behind `prefers-reduced-motion` — reduced mode gets opacity-only, no parallax, paused marquees.

## Stack (locked)

Next.js 15 App Router + TypeScript + Tailwind CSS v4 + shadcn/ui (dialog/sheet, tabs, accordion, form primitives) + Framer Motion. Static export-friendly, no backend; booking form is client-side validated only.

## Anti-patterns (kill on sight)

- Centered hero + 3 feature cards + gradient
- Purple/blue tech gradients, glassmorphism, soft shadows
- Emoji bullets, lorem ipsum, "elevate your look" copy
- Uniform card grids with identical borders
- 8px+ border radius anywhere
- Fade-up scroll animation applied uniformly

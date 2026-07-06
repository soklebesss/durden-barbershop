# CUTTHROAT — Token Architecture

> Pipeline stage: /design-system (stage 3 of 6)
> Source of truth: [app/globals.css](../app/globals.css) — three layers as CSS variables, mapped into Tailwind v4 via `@theme inline`.

## Layer rules

1. **Primitive** (`--ct-*`) — raw values. Never referenced by components.
2. **Semantic** (`--bg`, `--fg`, `--accent`, …) — purpose aliases. Theme switching happens here (the inverted "Bone" sections re-map semantics locally).
3. **Component** (`--btn-*`, `--input-*`, `--ticker-*`, …) — per-component hooks consumed by shadcn/ui-style components.

## Color roles

| Semantic | Value | Used for |
|----------|-------|----------|
| `--bg` | Asphalt #0A0A0A | Page base (dark-first) |
| `--bg-raised` | Concrete #161616 | Cards, sheet, dialog |
| `--bg-inverted` | Bone #F2F0EB | Inverted section breaks, tape |
| `--fg` / `--fg-muted` | Bone / Smoke #8A8A8A | Text hierarchy |
| `--border` / `--border-strong` | Steel #262626 / #4A4A4A | Hairline dividers |
| `--accent` | Hazard #FF4D00 | CTA, prices, focus ring, hover — action + danger only |
| `--on-accent` | Asphalt | Text on hazard fills (≈5.6:1) |

Contrast floors verified: Bone/Asphalt ≈ 17:1, Hazard/Asphalt ≈ 5.9:1, Asphalt/Hazard ≈ 5.6:1.

## Type scale (fluid, `clamp`)

`display-xl` 4→13rem · `display-lg` 3→8rem · `display-md` 2→4.5rem · `display-sm` 1.5→2.5rem · body 1rem/1.6 · `label` 0.8125rem mono caps.

Fonts load via `next/font` and are exposed as `--font-anton`, `--font-grotesk`, `--font-jetbrains`, mapped to Tailwind `font-display` / `font-body` / `font-mono`.

## Spacing & radius

4px base scale; `--ct-section-y = clamp(4rem,10vh,8rem)`; `--ct-gutter = clamp(1rem,4vw,4rem)`. Radius: `none` (0) structural, `hairline` (2px) inputs only. No other rounding exists in the system — this is enforced by simply not defining larger radius tokens.

## Motion tokens

| Token | Value | Use |
|-------|-------|-----|
| `--ct-dur-micro` | 150ms | Hovers, presses |
| `--ct-dur-standard` | 300ms | State transitions |
| `--ct-dur-reveal` | 600ms | Clip-path wipes on scroll |
| `--ct-dur-intro` | 900ms | Page-load stamp |
| `--ct-ease-blade` | cubic-bezier(.83,0,.17,1) | Wipes (aggressive in-out) |
| `--ct-ease-snap` | cubic-bezier(.16,1,.3,1) | Entrances (fast out, soft settle) |

Framer Motion variants read these values from [lib/motion.ts](../lib/motion.ts) to keep JS and CSS motion in one rhythm. Everything respects `prefers-reduced-motion` (CSS media queries + `useReducedMotion()`).

## Texture utilities

`.grain` (fixed SVG-noise overlay), `.halftone` (radial dot field), `.hazard-stripes`, `.tape` (gaffer strip), `.img-duotone` (grayscale-crush default → hazard duotone on hover).

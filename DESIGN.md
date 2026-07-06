# Design

Visual system for CUTTHROAT BARBER CLUB. Source of truth for tokens: [app/globals.css](app/globals.css) (three-layer: primitive → semantic → component). Full rationale: [docs/design-direction.md](docs/design-direction.md).

## Theme

Editorial brutalist-street, dark-first. Asphalt near-black base, warm Bone text, one hazard-orange accent. Texture over flat: fixed film-grain overlay, halftone dot fields, hazard-stripe dividers, gaffer-tape strips, circular sticker stamps, ±2° off-grid rotations. One intentional inverted (light) section: Location.

## Color

| Role | Token | Value |
|------|-------|-------|
| Background | `--bg` | #0A0A0A |
| Raised surface | `--bg-raised` | #161616 |
| Inverted section | `--bg-inverted` | #F2F0EB |
| Text | `--fg` | #F2F0EB |
| Muted text | `--fg-muted` | #8A8A8A (large/label use only on #0A0A0A) |
| Border | `--border` | #262626 |
| Accent (only one) | `--accent` | #FF4D00 · pressed #C93D00 |
| On accent | `--on-accent` | #0A0A0A |

No gradients, no glass, no shadows except the tape's hard 2px drop.

## Typography

- **Display**: Anton, ALL CAPS, tracking −0.02em, fluid clamp scale (`display-xl` 4→13rem, `lg` 3→8rem, `md` 2→4.5rem, `sm` 1.5→2.5rem). Oversized-by-intent: the poster scale is the brand, deliberate exception to conservative display ceilings.
- **Body**: Space Grotesk 400/500, 1rem/1.6.
- **Labels/prices/tickers**: JetBrains Mono, CAPS, +0.08em tracking, bold for emphasis.

## Spacing & Geometry

4px base scale; section padding `clamp(4rem,10vh,8rem)`; gutters `clamp(1rem,4vw,4rem)`; wide editorial container (max 1600px), full-bleed textures. Radius: 0 structural, 2px inputs, circles only for sticker stamps.

## Motion

Tokens: 150/300/600/900ms; `--ease-blade` cubic-bezier(.83,0,.17,1) for clip-path wipes, `--ease-snap` cubic-bezier(.16,1,.3,1) for entrances. Signature: inset clip-path wipes with stagger; magnetic CTAs (≤12px pull); marquee tickers (pause on hover); subtle parallax (≤12%). All motion has a reduced-motion fallback (fade or none).

## Components

shadcn/ui-style primitives in `components/ui/` (button, sheet, dialog, tabs, accordion, input, select, label) consuming component tokens. Site organisms in `components/site/`. Images: seeded SVG editorial placeholders (`editorial-image.tsx`) — grayscale crush + noise + halftone + contact-sheet label, hazard duotone on hover; real photography must keep this treatment.

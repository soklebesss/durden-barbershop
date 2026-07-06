<<<<<<< HEAD
# CUTTHROAT BARBER CLUB

> STAY SHARP OR STAY HOME.

Editorial brutalist-street single-page site for a fictional Amsterdam barbershop.
Next.js App Router + TypeScript + Tailwind CSS v4 + shadcn/ui-style components + Framer Motion.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm start          # serve the production build
```

Requires Node 18.18+ (20+ recommended).

## What's in the box

- **One long scroll** (`/`): sticky nav with marquee ticker → kinetic hero → hover-reveal service menu → barber roster → promo banners → filterable masonry lookbook with lightbox → counter-scrolling testimonial tickers → inverted location/hours section with consent-gated map + house-rules accordion → giant-wordmark footer.
- **Legal routes**: `/privacy` and `/terms` — plausible template copy, clearly tagged for lawyer review.
- **Cookie consent**: branded banner on first load; choice persists in `localStorage`. The OpenStreetMap embed (the only third-party resource) does not load without consent or an explicit click.
- **Booking**: sheet with client-side validation only — deliberately no backend. Wire `components/site/booking.tsx` to your scheduling system.

## Design system

Three-layer tokens (primitive → semantic → component) live in [app/globals.css](app/globals.css), documented in [docs/design-tokens.md](docs/design-tokens.md). Brand guide: [docs/brand-guidelines.md](docs/brand-guidelines.md). Locked art direction: [docs/design-direction.md](docs/design-direction.md).

- Monochrome base (Asphalt `#0A0A0A` / Bone `#F2F0EB`) + one accent (Hazard `#FF4D00`).
- Anton (display) · Space Grotesk (body) · JetBrains Mono (labels/prices/tickers).
- Sharp radii (0 / 2px), clip-path wipe reveals, magnetic buttons, film grain overlay.

## Imagery

Every "photo" is a seeded SVG editorial placeholder (`components/site/editorial-image.tsx`) so the art direction stays consistent: crushed blacks, film noise, halftone, contact-sheet labels, hazard duotone on hover. To ship real photography, replace `EditorialImage` usages with `next/image` and keep the treatment: grayscale, high contrast, grain (`.img-duotone` class in globals.css).

## Accessibility & motion

- Focus rings everywhere (hazard, 3px), skip link, semantic landmarks, labelled forms with inline errors + `role="alert"`, keyboard-reachable hover reveals.
- `prefers-reduced-motion`: marquees stop, parallax and wipes fall back to plain fades, intro stamp is skipped, cursor decoration disabled.
- Contrast: Bone/Asphalt ≈ 17:1, Hazard/Asphalt ≈ 5.9:1, Asphalt-on-Hazard ≈ 5.6:1.

## Content

All copy, names, addresses, and phone numbers are fictional. The booking form sends nothing anywhere. Legal pages are templates — have them reviewed before real-world use.
=======
# Durden-barbershop
>>>>>>> f5f5e0a393631941d2bef13461fe305c7af56a41

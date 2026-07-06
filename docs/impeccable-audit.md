# /impeccable Audit — Final Pass (2026-07-03)

Run against the live dev build at 360 / 375 / 800 / 1920px, with `prefers-reduced-motion: reduce` active in the test browser (which surfaced the most serious findings). All findings were fixed in the same pass.

## Health Score (post-fix)

| # | Dimension | Score | Note |
|---|-----------|-------|------|
| 1 | Accessibility | 4/4 | AA contrast verified incl. accent-on-bone; focus rings; keyboard-reachable hover reveals; labelled form with `role="alert"` errors + focus management |
| 2 | Performance | 4/4 | Static prerender, 197 kB first load, CSS-driven reveals/marquees, transform/clip-path only |
| 3 | Responsive | 4/4 | 360px → 1920px, no horizontal overflow, tape header adapts, mobile hero imagery added |
| 4 | Theming | 4/4 | Three-layer tokens, no raw hex in components, custom text sizes registered with tailwind-merge |
| 5 | Anti-patterns | 4/4 | Numbered-eyebrow scaffolding removed; no gradients/glass/card-grid grammar |

## Fixed during the pass (severity-tagged)

- **[P0] Reduced-motion users saw a blank page.** Variants were swapped based on `useReducedMotion()` (null during SSR → hydration mismatch, and hidden clip-path/transform states were never reset by the opacity-only "visible" target). Rebuilt scroll reveals as CSS-driven (`.reveal` in globals.css): the hidden state exists only under `(prefers-reduced-motion: no-preference)`; JS (IntersectionObserver) merely adds `.is-in`. Content is visible by default for reduced motion, print, no-JS, and headless renderers.
- **[P0] Every "photo" rendered as an empty black box.** `EditorialImage` root had no intrinsic size inside aspect-ratio wrappers (all children absolute) → 0 height; composition was also dark-on-dark. Fixed sizing (`size-full`) and redesigned as high-contrast bone print panel + ink silhouette.
- **[P1] `text-display-*` silently dropped by tailwind-merge** (classified as a text color and merged away against `text-fg`). Registered the custom font-size group in `lib/utils.ts`.
- **[P1] Hydration mismatches**: hero (reduced-motion branch), lookbook parallax (reduced-branched range), RevealItem stagger (render-time counter, StrictMode-unsafe). All rebuilt hydration-safe (constant initial values, explicit `index` prop, durations — not property sets — vary with reduced motion).
- **[P1] Accent-on-bone contrast** was 4.48:1 (borderline AA) — added `--accent-ink` #B23500 (≈5.4:1) for text accents on the inverted section.
- **[P2] Numbered mono eyebrows on every section** ("01 — THE MENU") = AI scaffolding grammar. Replaced with the gaffer-tape paste-up system (varied copy/rotation per section, in flow on mobile, overlapping from `sm`).
- **[P2] Section tape overlapped the title at 375px** — now stacks above the heading on mobile.
- **[P2] Reduced-motion marquees trapped content** — now horizontally scrollable with the loop duplicate hidden; thin themed scrollbar.
- **[P2] Mobile hero had zero imagery** — added a portrait band under the headline (`md:hidden`).
- **[P3] ✂ dingbat in ticker** → mono `//`; arbitrary z-indexes → semantic ladder (nav 40 · modal 50 · consent 60 · grain 70 · cursor 80 · intro 90 · skip 100); date/select inputs get `[color-scheme:dark]`; barber silhouettes now guaranteed to differ per seed.

## Verified behaviors

Booking sheet: all six validation errors render inline with `role="alert"`, focus moves to first invalid field, Monday bookings rejected with on-brand copy, success state renders. Lookbook: tabs filter correctly (Radix mousedown activation), lightbox opens/closes. Consent: choice persists in localStorage; OpenStreetMap iframe loads only after accept or explicit click. Production build: clean, all routes static.

## Deliberate exceptions (voice, not oversight)

- Display type exceeds the 6rem ceiling — the poster scale is the brand register's core move here (explicitly briefed).
- Space Grotesk is on the reflex-reject list — kept per identity-preservation (locked in the user's brief).
- Numbered rows *within* the service menu stay: a price list is a genuine sequence (diner-menu voice), unlike section scaffolding.
- Nav uses a subtle backdrop-blur — functional legibility over scrolling content, not decorative glassmorphism.

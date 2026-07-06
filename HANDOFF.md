# Durden Barbershop — Project Handoff

> Structured snapshot for continuing in a fresh Claude Code session. Last updated: 2026-07-06.

---

## 1. PROJECT OVERVIEW

**What we're building:** A premium, street/Fight-Club-themed single-page marketing site **and** a working online booking system for **Durden Barbershop** — a real barbershop in Ampelokipi, Athens (one barber, Spyros).

**Main goal:** A visually distinctive, immersive Next.js site (3D hero, scroll animations, editorial brutalist design) with a **production-grade booking system** whose #1 requirement is: **never allow a double-booking** for the same barber at overlapping times — concurrency-safe at the database level.

**Real business facts (already in the code):**
- Name: **DURDEN BARBERSHOP**, monogram "DB"
- Address: **Pouliou 5, Ampelokipi 115 23, Athens**
- Phone: **+30 210 440 4849**
- One barber: **Spyros** ("The Artist")
- Hours: **Tue–Sat** (closed Sun + Mon); Tue–Fri 10:00–21:20, Sat 09:00–17:20
- Opened 2024; dog named Luna; Fight-Club-themed decor
- ⚠️ **Still placeholder** (need real values): `email` (`hello@durdenbarbershop.gr`) and Instagram handle (`durden_barbershop`) — flagged in `lib/data.ts`.

---

## 2. CURRENT STATE

**Working right now (verified live):**
- Full marketing site renders: hero, services, barber spotlight, lookbook, testimonials, location/hours, footer, legal pages.
- **3D hero**: loads a real FBX trimmer mesh (`base_basic_pbr.fbx`) with embedded textures; slow vertical-axis auto-spin + mouse/device-orientation reactivity + slight tilt.
- **Booking system is LIVE and verified** against the Supabase project `brctriiajzycycspiopb`:
  - Migration applied (tables, exclusion constraint, RPCs, RLS, seed data).
  - End-to-end UI booking works: dropdowns load from DB, live slot availability, submit → success.
  - Double-booking rejection **proven**: overlapping insert → `slot_taken`; back-to-back allowed; taken slots auto-grey in the UI.
- Interactive animations added: hero headline letter-flip on hover, services interactive hover-links (cursor-follow image), lookbook interactive image selector, vertical auto-scroll testimonials wall.

**Dev server:** `npm run dev` (Next.js) on port 3000. `.env.local` is set with the live Supabase URL + anon key.

**Important UX preference (from the user):** animations should run **regardless of `prefers-reduced-motion`** — the user has reduced-motion enabled on their machine but WANTS the animations. The flip / hover / 3D motion are intentionally NOT reduced-motion-gated. Do not re-add reduced-motion gates to those without asking.

---

## 3. ARCHITECTURE

- **Frontend stack:** Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4 (`@theme inline` tokens in `app/globals.css`) · Framer Motion v12 · vendored shadcn-style UI primitives (Radix under the hood) · lucide-react icons.
- **3D:** three.js + `@react-three/fiber` v9 + `@react-three/drei` v10 (`useFBX`, `Environment`, `Lightformer`, `Float`).
- **Backend:** **Supabase** (PostgreSQL 17, region eu-west-3). No custom server — the DB *is* the backend. All booking writes go through a `SECURITY DEFINER` RPC; reads of availability through a second RPC.
- **Supabase client:** `@supabase/supabase-js` v2, browser-only, `persistSession: false`.
- **Design system:** three-layer tokens (primitive → semantic → component) as CSS vars. Accent = hazard orange `#ff4d00` on asphalt black; fonts Anton (display) / grotesk (body) / JetBrains Mono.

**Overall structure:** one long scrolling page (`app/page.tsx`) composed of section components in `components/site/`. A `BookingProvider` context lets any "Book a chair" CTA open the booking sheet.

---

## 4. DATABASE (Supabase — project `brctriiajzycycspiopb`)

Migration file: `supabase/migrations/20260706000000_booking_system.sql` (already applied live).
Extensions: `btree_gist`, `pgcrypto`.

### Tables

**`barbers`**
| field | type | notes |
|---|---|---|
| id | uuid PK | `default gen_random_uuid()` |
| name | text NOT NULL | |
| alias | text | |
| active | boolean NOT NULL | default true |
| created_at | timestamptz NOT NULL | default now() |

**`services`**
| field | type | notes |
|---|---|---|
| id | uuid PK | |
| name | text NOT NULL | |
| duration_minutes | int NOT NULL | `> 0` |
| price_cents | int NOT NULL | `>= 0` |
| active | boolean NOT NULL | default true |
| created_at | timestamptz NOT NULL | |

**`appointments`**
| field | type | notes |
|---|---|---|
| id | uuid PK | |
| customer_name | text NOT NULL | length 2–120 |
| customer_email | text NOT NULL | regex-checked |
| barber_id | uuid NOT NULL | FK → barbers(id) ON DELETE RESTRICT |
| service_id | uuid | FK → services(id) ON DELETE SET NULL |
| start_time | timestamptz NOT NULL | |
| end_time | timestamptz NOT NULL | |
| created_at | timestamptz NOT NULL | |

**`appointments_legacy`** — the old naive table (`id, date, time, name, phone, created_at`) with 2 test rows (John/Mike, both 2026-07-10 10:00 — the original double-booking bug). Preserved, unused. Safe to drop once confirmed.

### Constraints (the core of the system)
```sql
constraint appointments_time_valid  check (end_time > start_time),
constraint appointments_no_overlap  exclude using gist (
  barber_id                             with =,
  tstzrange(start_time, end_time, '[)') with &&
)
```
`'[)'` = start-inclusive, end-exclusive → back-to-back bookings (10:00–10:40 then 10:40–11:20) do NOT collide.
Index: `appointments (barber_id, start_time)`.

### RPC functions
- **`book_appointment(p_customer_name, p_customer_email, p_barber_id, p_start_time, p_service_id default null, p_duration_minutes default null) returns appointments`** — `SECURITY DEFINER`. Resolves duration (arg → service → 30 default), guards past-time (`hint=past`) & inactive barber (`hint=barber`), inserts, catches `exclusion_violation` → raises with `hint=slot_taken`.
- **`get_booked_slots(p_barber_id, p_from, p_to) returns table(start_time, end_time)`** — `SECURITY DEFINER STABLE`. Times only, no PII.

### RLS
- `barbers`, `services`: RLS on, public read policy `using (active)`.
- `appointments`: RLS on, **no policies** → all direct anon/authenticated access denied. Writes/reads only via the two RPCs. `revoke all on appointments from anon, authenticated`; `grant execute` on both functions to `anon, authenticated`.

### Seed data (already inserted)
- barber: **Spyros / The Artist**
- services: Men's Cut €15/40m, Kids' Cut €12/20m, Cut+Beard €18/40m, Head Shave €13/20m, Head Shave+Beard €15/40m.

---

## 5. BACKEND LOGIC

**Booking flow:**
1. Client calls `createBooking()` → `supabase.rpc('book_appointment', {...})` (never a raw insert).
2. RPC resolves duration, computes `end_time = start + duration`.
3. Guards: not in the past; barber exists & active.
4. `INSERT` into `appointments`. The GiST exclusion constraint runs at insert/commit.
5. On overlap → Postgres raises `exclusion_violation`, caught → re-raised as friendly `'That slot was just taken'` with `hint=slot_taken`.

**Availability check:** `getBookedSlots(barberId, dayStart, dayEnd)` → RPC returns booked ranges; the frontend disables any shop slot whose `[start, start+duration)` overlaps a booked range (or is in the past).

**Conflict prevention (why it's race-safe):** correctness is enforced by the **exclusion constraint**, not by a read-then-write check. Two concurrent transactions inserting overlapping ranges for the same barber → one commits, the other fails at the index level. There is no check-then-insert gap. The client-side availability read and the RPC's pre-checks are UX/early-exit only.

---

## 6. FRONTEND STRUCTURE

**Sections (in `components/site/`, composed by `app/page.tsx`):**
`navbar` · `hero` (+ `hero-3d`) · `services` · `barbers` (Spyros spotlight) · `lookbook` · `testimonials` · `location` · `footer`, plus `marquee`, `reveal`, `magnetic`, `sticker`, `section-heading`, `editorial-image`, `intro-stamp`, `consent`, `custom-cursor`.

**Booking form flow (`components/site/booking-form.tsx`):**
1. On mount (if Supabase configured): `listBarbers()` + `listServices()` populate dropdowns.
2. User fills name + email, picks barber + service, picks a day (native date input, min today; Sun/Mon show "closed").
3. On barber/day change → `getBookedSlots()` fetches booked ranges; slot grid (10:00–20:00, 30-min steps) greys out taken/past slots.
4. User picks an open slot → submit → `createBooking()`.
5. Success → "LOCKED IN" screen. Error → inline message; on `slot_taken`, clears the slot and refetches availability.
6. If env not set → shows a "not configured" message (never crashes).

**Interaction wiring:** `BookingProvider` (in `booking.tsx`) provides `useBooking().open()`; the sheet renders `<BookingForm/>`. Hero/nav/footer/service-row CTAs call `open()`.

---

## 7. FILE STRUCTURE (key files)

```
cutthroat/
├─ app/
│  ├─ page.tsx                     # single long page; composes all sections
│  ├─ layout.tsx                   # fonts, metadata, providers
│  ├─ globals.css                  # design tokens (Tailwind v4 @theme)
│  ├─ privacy/page.tsx, terms/page.tsx
├─ components/
│  ├─ site/
│  │  ├─ hero.tsx                  # headline (letter-flip on hover) + 3D layer
│  │  ├─ hero-3d.tsx               # R3F: loads FBX trimmer, spin+mouse, lighting
│  │  ├─ services.tsx              # interactive hover-links menu (cursor-follow img)
│  │  ├─ barbers.tsx               # single-barber Spyros spotlight
│  │  ├─ lookbook.tsx              # interactive expanding-panel image selector
│  │  ├─ testimonials.tsx          # vertical auto-scroll columns (real reviews)
│  │  ├─ location.tsx              # OSM map (Athens pin), hours table, house rules
│  │  ├─ booking.tsx               # BookingProvider + useBooking + sheet → BookingForm
│  │  └─ booking-form.tsx          # ★ live Supabase booking UI
│  └─ ui/                          # button, input, label, select, sheet, dialog, tabs, accordion
├─ lib/
│  ├─ data.ts                      # SHOP, SERVICES, BARBERS, TESTIMONIALS, HOURS (site content)
│  ├─ supabase.ts                  # guarded browser client + isSupabaseConfigured
│  ├─ booking.ts                   # ★ typed API: listBarbers/Services, getBookedSlots, createBooking
│  ├─ motion.ts, utils.ts          # motion tokens; cn() (tailwind-merge)
├─ supabase/
│  └─ migrations/20260706000000_booking_system.sql   # ★ full DB (applied live)
├─ public/models/trimmer/base_basic_pbr.fbx          # 3D asset (41MB, embedded textures)
├─ 3dtrimmer/                      # original FBX variants + textures (source assets)
├─ .env.local                      # live Supabase keys (gitignored)
├─ .env.local.example              # template
└─ HANDOFF.md                      # this file
```

Note: `lib/data.ts` still holds a `LOOKBOOK` array that is now unused (lookbook uses hardcoded images). Harmless.

---

## 8. ENVIRONMENT VARIABLES

`.env.local` (present, real values set for project `brctriiajzycycspiopb`). Placeholders:
```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR-ANON-PUBLIC-KEY
```
The anon key is browser-safe (RLS + SECURITY DEFINER RPC gate all writes). Next reads `.env.local` at server boot — restart `npm run dev` after changes.

---

## 9. KNOWN ISSUES / BUGS

- **No email confirmations** — booking succeeds silently server-side; no notification to shop or customer.
- **Placeholder contact data** — real email + Instagram handle still needed (`lib/data.ts`, flagged `// PLACEHOLDER`).
- **3D asset is heavy** — `base_basic_pbr.fbx` is 41 MB (embedded textures); slow first load. Should convert to a Draco/meshopt `.glb` (< ~2 MB) for production. `fbx2gltf` CLI didn't resolve in this env; needs Blender or the FBX2glTF binary.
- **Slot grid is generic** — fixed 10:00–20:00 / 30-min, not the exact shop hours (Sat opens 09:00, weekdays close 21:20). Availability/overlap is correct, but the *offered* window is simplified.
- **Lookbook & services images are Unsplash stock**, not real Durden photos.
- **Old demo calendar removed** — the previous fancy DateTimePicker (with fake availability) was replaced by the live `BookingForm` slot grid. If the client prefers the calendar look, it must be re-ported onto the Supabase backend.
- **`appointments_legacy`** table lingers (2 test rows) — drop when ready.
- **Advisor (intentional, not bugs):** SECURITY DEFINER RPCs callable by anon (by design), `appointments` RLS-with-no-policy (deliberate lockdown), `btree_gist` in `public` schema (cosmetic).
- Preview tab throttles rAF when backgrounded — animations look "frozen" in automated screenshots but run fine in a real focused browser.

---

## 10. NEXT STEPS (in order)

1. **Real contact data** — replace placeholder `email` + Instagram in `lib/data.ts`.
2. **Email/notification on booking** — add a Supabase Edge Function (or DB webhook/trigger) that fires on new appointment → email shop + customer (Resend/Postmark). Wire into `book_appointment` success path.
3. **Optimize the 3D asset** — convert `base_basic_pbr.fbx` → compressed `.glb`, swap `useFBX` for `useGLTF` in `hero-3d.tsx`, drop the 41 MB file from `public/`.
4. **Exact shop hours in the slot grid** — make `booking-form.tsx` slot generation per-day (Sat 09:00–17:20, Tue–Fri 10:00–21:20) instead of fixed 10–20.
5. **Admin view** — a simple authenticated page (Supabase Auth) for Spyros to see/cancel upcoming appointments (needs an RLS policy or admin RPC to read PII).
6. **Real photos** — replace Unsplash images in `lookbook.tsx` / `services.tsx` with actual shop/cut photos.
7. **Drop `appointments_legacy`** once its 2 rows are confirmed disposable.
8. **Deploy** — Vercel; set the two env vars in the project settings.
9. Optional: rate-limit `book_appointment` (per email/IP) to prevent spam bookings.

---

## 11. CONTINUATION PROMPT (paste into a new Claude Code session)

> I'm continuing the **Durden Barbershop** project at `D:\webdevelopment\cutthroat` — a Next.js 15 / React 19 / Tailwind v4 site with a **live Supabase booking system** (project ref `brctriiajzycycspiopb`, connected via the Supabase MCP). Read `HANDOFF.md` in the project root first — it has the full context: architecture, DB schema, the double-booking exclusion constraint, RPCs (`book_appointment`, `get_booked_slots`), file map, and known issues.
>
> Key facts: booking is fully working and verified (double-booking prevented by a Postgres GiST exclusion constraint on `barber_id` + `tstzrange(start,end,'[)')`; frontend in `components/site/booking-form.tsx`, API in `lib/booking.ts`, client in `lib/supabase.ts`, migration in `supabase/migrations/`). `.env.local` holds the live keys. The user runs `prefers-reduced-motion` but WANTS animations on — do not gate them. Verify UI changes with the preview tools; run DB changes via the Supabase MCP (`apply_migration` for DDL) against project `brctriiajzycycspiopb`.
>
> My next task is: **[describe what you want]**. Suggested backlog is in HANDOFF.md §10 — start with email confirmations on booking unless I say otherwise.

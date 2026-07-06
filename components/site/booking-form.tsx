"use client";

/* Production booking form backed by Supabase.
   Flow: pick barber → service → day → an OPEN time slot → submit.
   - Available slots are computed from shop hours minus the barber's booked
     ranges (fetched live), so taken times are greyed out before you submit.
   - The submit calls the `book_appointment` RPC. Correctness never relies on
     the client check: if two people race for the same slot, the DB exclusion
     constraint rejects the loser and we show "that slot was just taken". */

import { useCallback, useEffect, useMemo, useState } from "react";
import { Check, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  listBarbers,
  listServices,
  getBookedSlots,
  createBooking,
  isSupabaseConfigured,
  BookingError,
  type Barber,
  type Service,
  type BookedSlot,
} from "@/lib/booking";

const CLOSED_DAYS = [0, 1]; // Sun, Mon
const OPEN_HOUR = 10;
const CLOSE_HOUR = 20; // last slot starts before this
const SLOT_STEP_MIN = 30;

/** Local YYYY-MM-DD (avoids the UTC shift `toISOString` would introduce). */
const toDateStr = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const MONTHS = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
const DOW = ["MO","TU","WE","TH","FR","SA","SU"]; // Monday-first (EU)

/** Month-grid day picker. Past days and closed days (Sun/Mon) are disabled. */
function Calendar({ value, onSelect }: { value: string; onSelect: (s: string) => void }) {
  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);
  const [view, setView] = useState(() => {
    const base = value ? new Date(`${value}T12:00:00`) : new Date();
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });

  const year = view.getFullYear();
  const month = view.getMonth();
  const startOffset = (new Date(year, month, 1).getDay() + 6) % 7; // Mon-first
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  const atCurrentMonth =
    year === today.getFullYear() && month === today.getMonth();

  return (
    <div className="border border-border-strong">
      <div className="flex items-center justify-between border-b border-border-strong px-3 py-2">
        <button
          type="button"
          disabled={atCurrentMonth}
          onClick={() => setView(new Date(year, month - 1, 1))}
          aria-label="Previous month"
          className="flex size-8 items-center justify-center transition-colors hover:text-accent disabled:cursor-not-allowed disabled:text-fg-muted/30"
        >
          <ChevronLeft className="size-4" aria-hidden />
        </button>
        <span className="font-mono text-sm font-bold tracking-wider">
          {MONTHS[month]} {year}
        </span>
        <button
          type="button"
          onClick={() => setView(new Date(year, month + 1, 1))}
          aria-label="Next month"
          className="flex size-8 items-center justify-center transition-colors hover:text-accent"
        >
          <ChevronRight className="size-4" aria-hidden />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-px p-2">
        {DOW.map((d) => (
          <span key={d} className="py-1 text-center font-mono text-[0.65rem] text-fg-muted">
            {d}
          </span>
        ))}
        {cells.map((d, i) => {
          if (!d) return <span key={`e${i}`} aria-hidden />;
          const ds = toDateStr(d);
          const disabled = d < today || CLOSED_DAYS.includes(d.getDay());
          const active = ds === value;
          return (
            <button
              key={ds}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(ds)}
              aria-pressed={active}
              className={cn(
                "aspect-square font-mono text-sm transition-colors",
                disabled && "cursor-not-allowed text-fg-muted/25",
                !disabled && !active && "hover:border hover:border-accent hover:text-accent",
                active && "bg-accent font-bold text-on-accent"
              )}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Build "HH:MM" strings for the shop's opening window. */
const SLOT_TIMES = Array.from(
  { length: ((CLOSE_HOUR - OPEN_HOUR) * 60) / SLOT_STEP_MIN },
  (_, i) => {
    const mins = OPEN_HOUR * 60 + i * SLOT_STEP_MIN;
    return `${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`;
  }
);

/* The shop runs on a single fixed UTC+1 wall-clock (no DST). We store the
   picked time verbatim — labeled UTC — so what the customer books ("10:00") is
   exactly what shows in the database. `shopNow()` expresses the current UTC+1
   wall-clock in the same naive frame so "past slot" checks stay aligned. */
const SHOP_UTC_OFFSET_MS = 1 * 60 * 60 * 1000; // UTC+1

/** Picked wall-clock → the instant stored (naive UTC: the numbers are kept as-is). */
function slotDate(dateStr: string, time: string): Date {
  return new Date(`${dateStr}T${time}:00.000Z`);
}

/** Current shop (UTC+1) wall-clock, in the same naive frame as slotDate. */
function shopNow(): number {
  return Date.now() + SHOP_UTC_OFFSET_MS;
}

function overlaps(aStart: Date, aEnd: Date, booked: BookedSlot[]): boolean {
  return booked.some((b) => {
    const bStart = new Date(b.start_time).getTime();
    const bEnd = new Date(b.end_time).getTime();
    return aStart.getTime() < bEnd && bStart < aEnd.getTime();
  });
}

export function BookingForm({ onBooked }: { onBooked?: (id: string) => void }) {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [booked, setBooked] = useState<BookedSlot[]>([]);

  const [barberId, setBarberId] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [dateStr, setDateStr] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [doneId, setDoneId] = useState<string | null>(null);

  const service = useMemo(
    () => services.find((s) => s.id === serviceId),
    [services, serviceId]
  );
  const duration = service?.duration_minutes ?? SLOT_STEP_MIN;

  // Load reference data once.
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    listBarbers().then(setBarbers).catch(() => {});
    listServices().then(setServices).catch(() => {});
  }, []);

  const closed = dateStr && CLOSED_DAYS.includes(new Date(`${dateStr}T12:00:00`).getDay());

  // Fetch the barber's booked ranges for the chosen day.
  const refreshSlots = useCallback(async () => {
    if (!barberId || !dateStr || closed) {
      setBooked([]);
      return;
    }
    setLoadingSlots(true);
    try {
      // Shop-day bounds (UTC+1 frame) so the availability window matches the
      // shop's day, not the customer's local day.
      const from = slotDate(dateStr, "00:00");
      const to = new Date(from.getTime() + 24 * 60 * 60 * 1000);
      setBooked(await getBookedSlots(barberId, from, to));
    } catch {
      setBooked([]);
    } finally {
      setLoadingSlots(false);
    }
  }, [barberId, dateStr, closed]);

  useEffect(() => {
    refreshSlots();
    setTime("");
  }, [refreshSlots]);

  const isTaken = useCallback(
    (t: string) => {
      const start = slotDate(dateStr, t);
      const end = new Date(start.getTime() + duration * 60_000);
      if (start.getTime() < shopNow()) return true; // past (UTC+1 frame)
      return overlaps(start, end, booked);
    },
    [dateStr, duration, booked]
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!barberId || !dateStr || !time || name.trim().length < 2 || !email) {
      setError("Fill in your name, email, barber, day and an open time.");
      return;
    }
    setSubmitting(true);
    try {
      const { id } = await createBooking({
        customerName: name,
        customerEmail: email,
        barberId,
        serviceId: serviceId || undefined,
        durationMinutes: duration,
        startTime: slotDate(dateStr, time),
      });
      setDoneId(id);
      onBooked?.(id);
    } catch (err) {
      const be = err as BookingError;
      setError(be.message);
      if (be.code === "slot_taken") {
        setTime("");
        refreshSlots(); // pull fresh availability so the taken slot greys out
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (!isSupabaseConfigured) {
    return (
      <p className="label-mono text-fg-muted">
        Booking backend not configured. Set{" "}
        <code className="text-accent">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
        <code className="text-accent">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>.
      </p>
    );
  }

  if (doneId) {
    return (
      <div className="flex flex-col items-start gap-4">
        <span className="flex size-14 items-center justify-center bg-accent text-on-accent">
          <Check className="size-7" aria-hidden />
        </span>
        <h3 className="font-display text-display-sm">Locked in.</h3>
        <p className="text-fg-muted">
          {name} — {dateStr} at {time}. See you in the chair.
        </p>
        <Button
          variant="ghost"
          onClick={() => {
            setDoneId(null);
            setTime("");
          }}
        >
          Book another
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="bf-name">Your name</Label>
          <Input id="bf-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Who's sitting down?" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="bf-email">Email</Label>
          <Input id="bf-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@…" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="bf-barber">Barber</Label>
          <Select id="bf-barber" value={barberId} onChange={(e) => setBarberId(e.target.value)}>
            <option value="" disabled>Pick your barber</option>
            {barbers.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}{b.alias ? ` — ${b.alias}` : ""}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="bf-service">Service</Label>
          <Select id="bf-service" value={serviceId} onChange={(e) => setServiceId(e.target.value)}>
            <option value="">Any (30 min)</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} — €{(s.price_cents / 100).toFixed(0)} · {s.duration_minutes}m
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Day</Label>
        <Calendar value={dateStr} onSelect={setDateStr} />
      </div>

      {dateStr && (
        <div className="flex flex-col gap-2">
          <Label>
            Open times{" "}
            {loadingSlots && <Loader2 className="ml-1 inline size-3 animate-spin" aria-hidden />}
          </Label>
          {closed ? (
            <p className="text-sm text-fg-muted">Closed that day (Tue–Sat only).</p>
          ) : (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {SLOT_TIMES.map((t) => {
                const taken = isTaken(t);
                const active = t === time;
                return (
                  <button
                    key={t}
                    type="button"
                    disabled={taken}
                    onClick={() => setTime(t)}
                    className={cn(
                      "border py-2 text-center font-mono text-sm transition-colors",
                      taken && "cursor-not-allowed border-border-default/40 text-fg-muted/40 line-through",
                      !taken && !active && "border-border-strong hover:border-accent hover:text-accent",
                      active && "border-accent bg-accent font-bold text-on-accent"
                    )}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {error && (
        <p role="alert" className="text-sm font-medium text-accent">{error}</p>
      )}

      <Button type="submit" size="lg" disabled={submitting} className="mt-2">
        {submitting ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" aria-hidden /> Booking…
          </>
        ) : (
          "Lock it in"
        )}
      </Button>
    </form>
  );
}

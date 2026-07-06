import { supabase, isSupabaseConfigured } from "@/lib/supabase";

/* Typed data-access layer for the booking system. Every write goes through the
   `book_appointment` RPC (never a raw insert) so the exclusion constraint and
   validation run server-side. Reads of availability go through
   `get_booked_slots` (times only, no customer PII). */

export type Barber = { id: string; name: string; alias: string | null };
export type Service = {
  id: string;
  name: string;
  duration_minutes: number;
  price_cents: number;
};
export type BookedSlot = { start_time: string; end_time: string };

export type BookingInput = {
  customerName: string;
  customerEmail: string;
  barberId: string;
  startTime: Date;
  serviceId?: string;
  durationMinutes?: number;
};

export class BookingError extends Error {
  /** Machine-readable reason from the RPC's RAISE ... hint, e.g. "slot_taken". */
  code: string;
  constructor(message: string, code = "unknown") {
    super(message);
    this.code = code;
  }
}

function assertClient() {
  if (!supabase) {
    throw new BookingError(
      "Booking isn't configured yet — set the Supabase env vars.",
      "not_configured"
    );
  }
  return supabase;
}

export { isSupabaseConfigured };

export async function listBarbers(): Promise<Barber[]> {
  const db = assertClient();
  const { data, error } = await db
    .from("barbers")
    .select("id, name, alias")
    .eq("active", true)
    .order("name");
  if (error) throw new BookingError(error.message, "read_barbers");
  return data ?? [];
}

export async function listServices(): Promise<Service[]> {
  const db = assertClient();
  const { data, error } = await db
    .from("services")
    .select("id, name, duration_minutes, price_cents")
    .eq("active", true)
    .order("price_cents");
  if (error) throw new BookingError(error.message, "read_services");
  return data ?? [];
}

/** Booked ranges for one barber across [from, to). Used to grey out slots. */
export async function getBookedSlots(
  barberId: string,
  from: Date,
  to: Date
): Promise<BookedSlot[]> {
  const db = assertClient();
  const { data, error } = await db.rpc("get_booked_slots", {
    p_barber_id: barberId,
    p_from: from.toISOString(),
    p_to: to.toISOString(),
  });
  if (error) throw new BookingError(error.message, "read_slots");
  return (data ?? []) as BookedSlot[];
}

/* Human-friendly copy per server-side reason (RAISE ... hint). */
const MESSAGES: Record<string, string> = {
  slot_taken: "That slot was just taken. Pick another time.",
  past: "That time has already passed — choose a later slot.",
  barber: "That barber isn't available. Refresh and try again.",
  duration: "Something's off with the service length. Try again.",
};

export async function createBooking(input: BookingInput): Promise<{ id: string }> {
  const db = assertClient();
  const { data, error } = await db.rpc("book_appointment", {
    p_customer_name: input.customerName,
    p_customer_email: input.customerEmail,
    p_barber_id: input.barberId,
    p_start_time: input.startTime.toISOString(),
    p_service_id: input.serviceId ?? null,
    p_duration_minutes: input.durationMinutes ?? null,
  });

  if (error) {
    // Supabase surfaces the Postgres `hint` on the error object.
    const code = (error as { hint?: string }).hint || "unknown";
    throw new BookingError(MESSAGES[code] ?? error.message, code);
  }
  return { id: (data as { id: string }).id };
}

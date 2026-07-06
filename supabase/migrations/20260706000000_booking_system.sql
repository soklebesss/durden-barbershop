-- ============================================================================
-- Durden Barbershop — booking system
-- Double-booking prevention: a Postgres EXCLUSION CONSTRAINT on
-- (barber_id, [start_time, end_time)) using GiST. This is enforced by the
-- database itself, atomically, so it is race-condition safe even when two
-- users submit the exact same slot at the exact same millisecond.
-- ============================================================================

-- btree_gist lets a GiST exclusion constraint mix an equality op (=) on a
-- scalar column (barber_id) with an overlap op (&&) on a range. pgcrypto gives
-- us gen_random_uuid().
create extension if not exists btree_gist;
create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------
create table if not exists public.barbers (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  alias      text,
  active     boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.services (
  id               uuid primary key default gen_random_uuid(),
  name             text not null,
  duration_minutes int  not null check (duration_minutes > 0),
  price_cents      int  not null check (price_cents >= 0),
  active           boolean not null default true,
  created_at       timestamptz not null default now()
);

create table if not exists public.appointments (
  id             uuid primary key default gen_random_uuid(),
  customer_name  text not null check (char_length(btrim(customer_name)) between 2 and 120),
  customer_email text not null check (customer_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  barber_id      uuid not null references public.barbers(id) on delete restrict,
  service_id     uuid references public.services(id) on delete set null,
  start_time     timestamptz not null,
  end_time       timestamptz not null,
  created_at     timestamptz not null default now(),

  constraint appointments_time_valid check (end_time > start_time),

  -- ★ The heart of the system: no two appointments for the SAME barber may
  --   have OVERLAPPING [start, end) time ranges. '[)' = start inclusive, end
  --   exclusive, so a 10:00–10:40 booking does not collide with 10:40–11:20.
  constraint appointments_no_overlap exclude using gist (
    barber_id                                with =,
    tstzrange(start_time, end_time, '[)')    with &&
  )
);

create index if not exists appointments_barber_start_idx
  on public.appointments (barber_id, start_time);

-- ---------------------------------------------------------------------------
-- RPC: create an appointment safely
-- SECURITY DEFINER so it can write to appointments (which is otherwise locked
-- down by RLS). Correctness does NOT depend on the availability read below —
-- that is only for a friendly early message. The EXCLUSION CONSTRAINT is the
-- real guard, caught here and surfaced as a clean error.
-- ---------------------------------------------------------------------------
create or replace function public.book_appointment(
  p_customer_name  text,
  p_customer_email text,
  p_barber_id      uuid,
  p_start_time     timestamptz,
  p_service_id     uuid default null,
  p_duration_minutes int default null
) returns public.appointments
language plpgsql
security definer
set search_path = public
as $$
declare
  v_duration int;
  v_end      timestamptz;
  v_row      public.appointments;
begin
  -- Resolve duration: explicit arg → service's duration → 30 min default.
  v_duration := coalesce(
    p_duration_minutes,
    (select duration_minutes from public.services where id = p_service_id and active),
    30
  );
  if v_duration <= 0 then
    raise exception 'Invalid duration' using errcode = '22023', hint = 'duration';
  end if;
  v_end := p_start_time + make_interval(mins => v_duration);

  -- Times are stored on a fixed UTC+1 wall-clock (naive). now() is real UTC, so
  -- shift it +1h into the shop frame before the past check.
  if p_start_time < now() + interval '1 hour' then
    raise exception 'Cannot book a time in the past' using errcode = 'P0001', hint = 'past';
  end if;

  if not exists (select 1 from public.barbers where id = p_barber_id and active) then
    raise exception 'Unknown or inactive barber' using errcode = 'P0001', hint = 'barber';
  end if;

  -- Attempt the insert. If a concurrent transaction already holds an
  -- overlapping range for this barber, Postgres raises exclusion_violation.
  begin
    insert into public.appointments
      (customer_name, customer_email, barber_id, service_id, start_time, end_time)
    values
      (btrim(p_customer_name), lower(btrim(p_customer_email)),
       p_barber_id, p_service_id, p_start_time, v_end)
    returning * into v_row;
  exception
    when exclusion_violation then
      raise exception 'That slot was just taken — pick another time.'
        using errcode = 'P0001', hint = 'slot_taken';
  end;

  return v_row;
end;
$$;

-- ---------------------------------------------------------------------------
-- RPC: booked ranges for a barber within a window (no PII — times only).
-- Lets the frontend grey out taken slots before submitting.
-- ---------------------------------------------------------------------------
create or replace function public.get_booked_slots(
  p_barber_id uuid,
  p_from      timestamptz,
  p_to        timestamptz
) returns table (start_time timestamptz, end_time timestamptz)
language sql
stable
security definer
set search_path = public
as $$
  select a.start_time, a.end_time
  from public.appointments a
  where a.barber_id = p_barber_id
    and a.start_time >= p_from
    and a.start_time <  p_to
  order by a.start_time;
$$;

-- ---------------------------------------------------------------------------
-- Row Level Security
--   barbers / services : anyone may read the ACTIVE rows.
--   appointments       : no direct client access at all. All reads/writes go
--                        through the SECURITY DEFINER functions above, so
--                        customer PII is never exposed to the anon key.
-- ---------------------------------------------------------------------------
alter table public.barbers      enable row level security;
alter table public.services     enable row level security;
alter table public.appointments enable row level security;

drop policy if exists "barbers_public_read" on public.barbers;
create policy "barbers_public_read"  on public.barbers  for select using (active);

drop policy if exists "services_public_read" on public.services;
create policy "services_public_read" on public.services for select using (active);
-- appointments: intentionally NO policies → all direct access denied.

-- Expose the functions to the anon + authenticated roles; lock the tables.
revoke all on public.appointments from anon, authenticated;
grant execute on function public.book_appointment(text, text, uuid, timestamptz, uuid, int)
  to anon, authenticated;
grant execute on function public.get_booked_slots(uuid, timestamptz, timestamptz)
  to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Seed (matches the site): one barber, the real menu.
-- ---------------------------------------------------------------------------
insert into public.barbers (name, alias)
select 'Spyros', 'The Artist'
where not exists (select 1 from public.barbers);

insert into public.services (name, duration_minutes, price_cents)
select * from (values
  ('Men''s Cut',           40, 1500),
  ('Kids'' Cut — under 12', 20, 1200),
  ('Cut + Beard',          40, 1800),
  ('Head Shave / Skin Cut',20, 1300),
  ('Head Shave + Beard',   40, 1500)
) as v(name, duration_minutes, price_cents)
where not exists (select 1 from public.services);

/* All site content in one place. Real shop data — Durden Barbershop, Athens.
   Source: the shop's Google listing + service menu + reviews. Values marked
   PLACEHOLDER (email, Instagram handle) still need the real thing. */

export type Service = {
  id: string;
  name: string;
  detail: string;
  price: number;
  duration: string;
};

/* Exact menu, prices and durations as listed by the shop. */
export const SERVICES: Service[] = [
  {
    id: "mens-cut",
    name: "Men's Cut",
    detail: "Cut, wash and styling. The full sit-down — in sharp, out sharper.",
    price: 15,
    duration: "40 min",
  },
  {
    id: "kids-cut",
    name: "Kids' Cut — under 12",
    detail: "Cut and styling for the young ones. No fuss, no fidget.",
    price: 12,
    duration: "20 min",
  },
  {
    id: "cut-beard",
    name: "Cut + Beard",
    detail: "Wash, cut, beard and styling. Head to jaw in one session.",
    price: 18,
    duration: "40 min",
  },
  {
    id: "head-shave",
    name: "Head Shave / Skin Cut",
    detail: "Full head shave, or a cut down to two grades. Clean to the skin.",
    price: 13,
    duration: "20 min",
  },
  {
    id: "shave-beard",
    name: "Head Shave + Beard",
    detail: "Wash, head shave, beard and blow-dry. The full reset.",
    price: 15,
    duration: "40 min",
  },
];

export type Barber = {
  id: string;
  name: string;
  alias: string;
  specialty: string;
  ig: string;
  years: number;
  seed: number;
};

/* One chair, one barber — Spyros. */
export const BARBERS: Barber[] = [
  {
    id: "spyros",
    name: "Spyros",
    alias: "THE ARTIST",
    specialty: "Custom cuts, fades, beard sculpts & head shaves",
    ig: "@durden_barbershop",
    years: 3,
    seed: 3,
  },
];

export type LookbookItem = {
  id: string;
  title: string;
  category: "fades" | "beards" | "designs";
  barber: string;
  ratio: "tall" | "square" | "wide";
  seed: number;
};

/* Representative work — every cut is Spyros's. (Images are stylised
   placeholders; swap for real shop photos when you have them.) */
export const LOOKBOOK: LookbookItem[] = [
  { id: "lb1", title: "Mid skin fade, crop top", category: "fades", barber: "SPYROS", ratio: "tall", seed: 11 },
  { id: "lb2", title: "Sharp side part", category: "designs", barber: "SPYROS", ratio: "square", seed: 12 },
  { id: "lb3", title: "Full beard sculpt", category: "beards", barber: "SPYROS", ratio: "tall", seed: 13 },
  { id: "lb4", title: "Burst fade, curls out", category: "fades", barber: "SPYROS", ratio: "wide", seed: 14 },
  { id: "lb5", title: "Clean line-up", category: "designs", barber: "SPYROS", ratio: "square", seed: 15 },
  { id: "lb6", title: "Taper + goatee line", category: "beards", barber: "SPYROS", ratio: "square", seed: 16 },
  { id: "lb7", title: "Buzz cut, tight edges", category: "fades", barber: "SPYROS", ratio: "tall", seed: 17 },
  { id: "lb8", title: "Low fade, textured top", category: "fades", barber: "SPYROS", ratio: "wide", seed: 18 },
  { id: "lb9", title: "Beard shape + hot finish", category: "beards", barber: "SPYROS", ratio: "tall", seed: 19 },
];

export type Testimonial = {
  quote: string;
  name: string;
  detail: string;
};

/* Real Google reviews, trimmed. */
export const TESTIMONIALS: Testimonial[] = [
  { quote: "Spyros is an artist. He's been my barber for three years — I've never gotten so many compliments on my hair.", name: "George Trakas", detail: "3 years running" },
  { quote: "A professional haircut, 10/10. Loved Spyros and his vibe — in a beautiful Fight Club themed place.", name: "Darius T.", detail: "buzz cut + beard" },
  { quote: "He takes his time to make sure everything is perfect. I always leave feeling confident and looking sharp.", name: "Andreas Sakel", detail: "full restyle" },
  { quote: "He assessed my hair type and face shape first, then made thoughtful suggestions. And Luna, his dog, is great company.", name: "Ed Elafia", detail: "custom cut" },
  { quote: "Very professional guy who knows his art of the cut.", name: "Saif D.", detail: "beard & curly hair" },
  { quote: "The best cut I've had in a very long time. Friendly, and attention down to the last detail.", name: "Giannis Koravos", detail: "custom cut" },
];

/* Real opening hours — closed Sunday and Monday. */
export const HOURS: { day: string; open: string }[] = [
  { day: "Mon", open: "Closed" },
  { day: "Tue", open: "10:00 – 21:20" },
  { day: "Wed", open: "10:00 – 21:20" },
  { day: "Thu", open: "10:00 – 21:20" },
  { day: "Fri", open: "10:00 – 21:20" },
  { day: "Sat", open: "09:00 – 17:20" },
  { day: "Sun", open: "Closed" },
];

export const SHOP = {
  name: "DURDEN BARBERSHOP",
  short: "DURDEN",
  monogram: "DB",
  phone: "+30 210 440 4849",
  phoneHref: "tel:+302104404849",
  email: "hello@durdenbarbershop.gr", // PLACEHOLDER — real email not published
  address: "Pouliou 5, Ampelokipi 115 23, Athens",
  mapsQuery: "Durden+Barbershop+Pouliou+5+Athens",
  instagram: "https://instagram.com/durden_barbershop", // PLACEHOLDER — confirm handle
  est: 2024,
};

export const TICKER_ITEMS = [
  "BY APPOINTMENT",
  "TUE–SAT",
  SHOP.phone,
  "STAY SHARP OR STAY HOME",
  "CUTS · FADES · BEARDS · SHAVES",
  SHOP.address.toUpperCase(),
];

export const HOUSE_RULES: { q: string; a: string }[] = [
  {
    q: "Do I need an appointment?",
    a: "Best to book — Spyros runs one chair, so a booked slot means no waiting. Reserve online here or call the shop. Walk in and if the chair's free, it's yours.",
  },
  {
    q: "What if I don't know what I want?",
    a: "Sit down and say \"fix it.\" Spyros reads your hair type and face shape and tells you honestly what'll work. Bring a photo if you've got one.",
  },
  {
    q: "Kids? Cards? Cash?",
    a: "Kids welcome — there's a dedicated cut for under-12s. Cards and cash both fine.",
  },
  {
    q: "Is that a dog?",
    a: "That's Luna. She runs front-of-house morale and asks for nothing but the occasional scratch. She's part of the vibe.",
  },
];

import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/site/legal-page";
import { SHOP } from "@/lib/data";

export const metadata: Metadata = {
  title: "Terms of Service — DURDEN BARBERSHOP",
  description: "House terms for bookings, lateness, and conduct at Durden Barbershop.",
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" updated="3 JULY 2026">
      <LegalSection heading="The short version">
        <p>
          Book a chair, show up on time, pay for your cut, don&apos;t be a menace.
          Everything below is detail. This page is a template drafted for a
          barbershop and must be reviewed by a qualified lawyer before
          production use.
        </p>
      </LegalSection>

      <LegalSection heading="1. Who you're dealing with">
        <p>
          These terms govern your use of this website and services provided by{" "}
          <strong>{SHOP.name}</strong>, {SHOP.address} (&ldquo;we&rdquo;, &ldquo;the shop&rdquo;).
          By booking a chair or walking in, you accept them.
        </p>
      </LegalSection>

      <LegalSection heading="2. Bookings">
        <p>The shop runs one chair with one barber, so time is booked by appointment — online here or by phone. We hold your slot for ten minutes past the booked time; after that it may be released. If the chair happens to be free when you walk in, you&apos;re welcome to take it.</p>
        <p>The booking form on this demo site does not create a binding appointment; in production, a booking becomes binding when you receive confirmation from us.</p>
      </LegalSection>

      <LegalSection heading="3. Cancellations and no-shows">
        <p>Cancel or move your booking any time up to 3 hours before, free, by phone. Repeated no-shows (three within six months) may mean we ask for a deposit before the next booking. No hard feelings — one chair means every slot counts.</p>
      </LegalSection>

      <LegalSection heading="4. Prices and payment">
        <p>Prices displayed on this site are final and include VAT — no &ldquo;starting at,&rdquo; no surcharges for thick hair, opinions, or difficult cowlicks. We accept cards, mobile payment, and cash. Prices may change; the price shown when you book is the price you pay.</p>
      </LegalSection>

      <LegalSection heading="5. The cut">
        <p>We will tell you honestly what your hair can and cannot do before we start. If you are not happy with your cut, tell us within 7 days and we will fix it free of charge. Refunds are handled case by case, in the shop, like adults.</p>
      </LegalSection>

      <LegalSection heading="6. House conduct">
        <p>Everyone is welcome in the chair. Abusive behaviour toward staff or other clients gets you one warning, then the door. Children under 12 must be accompanied by an adult. Dogs are welcome if they behave better than you do.</p>
      </LegalSection>

      <LegalSection heading="7. Liability">
        <p>We carry professional liability insurance for the services we provide. To the extent permitted by law, we are not liable for indirect damages, or for personal property left in the shop — the coat rack is a courtesy, not a vault.</p>
      </LegalSection>

      <LegalSection heading="8. This website">
        <p>Site content (text, design, imagery) belongs to the shop; don&apos;t reuse it commercially without asking. We aim for accuracy but the definitive word on availability and pricing is given in the shop. The site is provided &ldquo;as is&rdquo; without warranties of uninterrupted availability.</p>
      </LegalSection>

      <LegalSection heading="9. Governing law">
        <p>Greek law applies. Disputes go to the competent court in Athens — but talk to us first; nearly everything can be settled over a line-up.</p>
      </LegalSection>
    </LegalPage>
  );
}

import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/site/legal-page";
import { SHOP } from "@/lib/data";

export const metadata: Metadata = {
  title: "Privacy Policy — DURDEN BARBERSHOP",
  description: "How Durden Barbershop handles your data. Short version: barely, and never for ads.",
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="3 JULY 2026">
      <LegalSection heading="The short version">
        <p>
          We cut hair. We are not in the data business. We collect the minimum
          needed to hold your chair, we never sell it, and we delete it when it
          stops being useful. This page is a template drafted for a barbershop
          and must be reviewed by a qualified lawyer before production use.
        </p>
      </LegalSection>

      <LegalSection heading="1. Who we are">
        <p>
          <strong>{SHOP.name}</strong>, {SHOP.address}. We are the data
          controller for personal data processed through this website and in the
          shop. Questions: <a className="underline decoration-accent decoration-2 underline-offset-2" href={`mailto:${SHOP.email}`}>{SHOP.email}</a> or {SHOP.phone}.
        </p>
      </LegalSection>

      <LegalSection heading="2. What we collect and why">
        <p><strong>Booking form:</strong> your name, phone number, chosen barber, service, and preferred date/time. Legal basis: performance of a contract (holding your appointment). Note: the demo version of this site does not transmit or store this data anywhere — it is validated in your browser only.</p>
        <p><strong>Contact by phone or email:</strong> whatever you tell us, used solely to answer you. Legal basis: legitimate interest in responding to enquiries.</p>
        <p><strong>Cookies and local storage:</strong> one strictly-necessary local-storage entry that remembers your cookie choice, and one session entry that remembers you have seen the intro animation. If you accept non-essential cookies, we load an embedded map from OpenStreetMap; their servers receive your IP address when the map loads (see their privacy policy at openstreetmap.org). We run no analytics, no advertising pixels, and no social trackers.</p>
      </LegalSection>

      <LegalSection heading="3. What we never do">
        <p>We do not sell, rent, or trade your personal data. We do not build advertising profiles. We do not send marketing without your explicit opt-in, and we would honestly rather be cutting hair anyway.</p>
      </LegalSection>

      <LegalSection heading="4. How long we keep it">
        <p>Booking details: up to 12 months after your last appointment, then deleted. Enquiry emails: up to 24 months. Consent choice: stored in your own browser until you clear it.</p>
      </LegalSection>

      <LegalSection heading="5. Your rights">
        <p>Under the GDPR you can request access, correction, deletion, restriction, portability, or object to processing. Email {SHOP.email} and we will respond within 30 days. You can also complain to your local data protection authority (in Greece: the Hellenic Data Protection Authority, HDPA).</p>
      </LegalSection>

      <LegalSection heading="6. Security">
        <p>The site is served over HTTPS. Booking data in the production version would be transmitted encrypted and stored with access limited to shop staff who need it to run the chair schedule.</p>
      </LegalSection>

      <LegalSection heading="7. Changes">
        <p>If this policy changes, the date at the top changes with it. Material changes get a notice on the site before they take effect.</p>
      </LegalSection>
    </LegalPage>
  );
}

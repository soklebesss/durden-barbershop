import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SHOP } from "@/lib/data";

/* Shared shell for /privacy and /terms — same tokens, tuned for reading. */
export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh">
      <header className="gutter border-b border-border-default py-5">
        <div className="flex items-center justify-between">
          <Link href="/" className="font-display text-xl text-fg transition-colors hover:text-accent">
            DURDEN<span className="text-accent">.</span>
          </Link>
          <Link
            href="/"
            className="label-mono flex items-center gap-2 text-fg-muted transition-colors hover:text-accent"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Back to the shop
          </Link>
        </div>
      </header>

      <main className="gutter mx-auto max-w-3xl pb-24 pt-16">
        <p className="label-mono mb-3 text-accent">LEGAL</p>
        <h1 className="font-display text-display-md text-fg">{title}</h1>
        <p className="label-mono mt-3 text-fg-muted">LAST UPDATED: {updated}</p>

        <div
          className="tape label-mono mt-8 inline-block px-3 py-2 font-bold"
          style={{ transform: "rotate(-1deg)" }}
        >
          TEMPLATE — HAVE A LAWYER REVIEW BEFORE GOING LIVE
        </div>

        <div className="prose-legal mt-10 space-y-10">{children}</div>
      </main>

      <footer className="gutter border-t border-border-default py-6">
        <p className="label-mono text-fg-muted">
          © {new Date().getFullYear()} {SHOP.name} · {SHOP.address} ·{" "}
          <Link href="/privacy" className="hover:text-accent">Privacy</Link> ·{" "}
          <Link href="/terms" className="hover:text-accent">Terms</Link>
        </p>
      </footer>
    </div>
  );
}

export function LegalSection({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="font-display mb-4 text-2xl uppercase text-fg">{heading}</h2>
      <div className="space-y-4 leading-relaxed text-fg-muted [&_strong]:text-fg">{children}</div>
    </section>
  );
}

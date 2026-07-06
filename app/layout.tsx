import type { Metadata, Viewport } from "next";
import { Anton, Space_Grotesk, JetBrains_Mono, Geist } from "next/font/google";
import { ConsentProvider } from "@/components/site/consent";
import { BookingProvider } from "@/components/site/booking";
import { CustomCursor } from "@/components/site/custom-cursor";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
});

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DURDEN BARBERSHOP — Stay sharp or stay home",
  description:
    "Fight-Club-themed barbershop in Ampelokipi, Athens. Men's cuts, kids' cuts, fades, beard sculpts and head shaves by Spyros. Book online or by phone.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={cn(anton.variable, grotesk.variable, jetbrains.variable, "font-sans", geist.variable)}>
      <body className="grain">
        <a
          href="#main"
          className="label-mono sr-only z-[100] bg-accent px-4 py-3 text-on-accent focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <ConsentProvider>
          <BookingProvider>
            {children}
          </BookingProvider>
        </ConsentProvider>
        <CustomCursor />
      </body>
    </html>
  );
}

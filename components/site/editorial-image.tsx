"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

/* Art-directed SVG placeholder used for every "photo" on the site so the
   image treatment stays consistent: a bone print panel pasted slightly
   off-grid on asphalt, hard black silhouette, halftone, film noise and a
   contact-sheet label. Seeded so each subject keeps a stable composition.
   Swap for real photography by replacing usages of this component — keep
   the treatment (grayscale, crushed contrast, grain; see .img-duotone). */

type Variant = "portrait" | "cut" | "beard" | "design" | "interior";

function mulberry(seed: number) {
  let s = seed + 0x6d2b79f5;
  return () => {
    s = Math.imul(s ^ (s >>> 15), s | 1);
    s ^= s + Math.imul(s ^ (s >>> 7), s | 61);
    return ((s ^ (s >>> 14)) >>> 0) / 4294967296;
  };
}

const INK = "#0f0e0c";
const PAPER = "#dedad1";

export function EditorialImage({
  seed,
  variant = "portrait",
  label,
  className,
  accent = false,
}: {
  seed: number;
  variant?: Variant;
  label?: string;
  className?: string;
  accent?: boolean;
}) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const rnd = mulberry(seed * 7919);
  /* flip/crown derive from the seed directly so neighbouring seeds are
     guaranteed to differ (pure PRNG draws can coincide). */
  const flip = seed % 2 === 1;
  const flat = seed % 3 !== 0; // flat-top vs rounded crown
  const dotGap = 9 + Math.floor(rnd() * 6);
  const tilt = (rnd() * 3 - 1.5).toFixed(2);
  const headR = 68 + (seed % 5) * 7 + rnd() * 8;
  const slashY = 70 + rnd() * 120;

  return (
    <div className={cn("relative size-full overflow-hidden bg-concrete", className)}>
      <svg
        viewBox="0 0 400 500"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 size-full"
        role="img"
        aria-label={label ?? "Editorial studio image"}
      >
        <defs>
          <filter id={`noise-${id}`}>
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.14" />
            </feComponentTransfer>
            <feComposite operator="over" in2="SourceGraphic" />
          </filter>
          <pattern id={`dots-${id}`} width={dotGap} height={dotGap} patternUnits="userSpaceOnUse">
            <circle cx={dotGap / 2} cy={dotGap / 2} r="1.5" fill={INK} opacity="0.28" />
          </pattern>
        </defs>

        {/* asphalt backing */}
        <rect width="400" height="500" fill="#111111" />

        {/* bone print panel, pasted slightly off-grid */}
        <g transform={`rotate(${tilt} 200 250)`}>
          <rect x="-14" y="-14" width="428" height="528" fill={PAPER} />
          <rect x="-14" y="-14" width="428" height="528" fill={`url(#dots-${id})`} />

          {variant === "portrait" && (
            <g transform={flip ? "scale(-1,1) translate(-400,0)" : undefined}>
              {/* shoulders */}
              <path d="M40,514 C62,404 116,368 200,362 C284,368 338,404 360,514 Z" fill={INK} />
              {/* neck */}
              <rect x="170" y="296" width="60" height="82" fill={INK} />
              {/* head */}
              {flat ? (
                <path
                  d={`M${200 - headR},258 L${200 - headR},168 L${200 + headR},154 L${200 + headR},258 C${200 + headR},322 ${200 + headR * 0.55},354 200,354 C${200 - headR * 0.55},354 ${200 - headR},322 ${200 - headR},258 Z`}
                  fill={INK}
                />
              ) : (
                <ellipse cx="200" cy="238" rx={headR} ry={headR * 1.32} fill={INK} />
              )}
              {/* paper rim light inside the silhouette */}
              <path
                d={`M${200 + headR - 8},182 C${200 + headR + 2},232 ${200 + headR - 4},290 ${200 + headR * 0.6},328`}
                stroke={PAPER}
                strokeWidth="3"
                fill="none"
                opacity="0.9"
              />
              {/* razor slash in the print */}
              <line x1="52" y1={slashY} x2="118" y2={slashY - 34} stroke={INK} strokeWidth="4" />
            </g>
          )}

          {variant === "cut" && (
            <g>
              <ellipse cx={flip ? 150 : 250} cy="232" rx="112" ry="142" fill={INK} />
              <path
                d={`M${flip ? 150 : 250},92 q64,32 46,98`}
                stroke={PAPER}
                strokeWidth="4"
                fill="none"
              />
              <line x1="40" y1="420" x2="360" y2="404" stroke={INK} strokeWidth="3" />
              <line x1="40" y1="436" x2="300" y2="424" stroke={INK} strokeWidth="1.5" />
            </g>
          )}

          {variant === "beard" && (
            <g transform={flip ? "scale(-1,1) translate(-400,0)" : undefined}>
              <ellipse cx="200" cy="196" rx="88" ry="114" fill={INK} />
              <path
                d="M112,214 C112,334 148,382 200,382 C252,382 288,334 288,214 L288,258 C288,352 250,402 200,402 C150,402 112,352 112,258 Z"
                fill={INK}
              />
              <line x1="138" y1="192" x2="264" y2="184" stroke={PAPER} strokeWidth="3" />
              <line x1="160" y1="330" x2="240" y2="330" stroke={PAPER} strokeWidth="2.5" opacity="0.85" />
            </g>
          )}

          {variant === "design" && (
            <g>
              <ellipse cx="200" cy="252" rx="122" ry="152" fill={INK} />
              <path
                d={`M${142 + rnd() * 36},172 l62,-26 l-22,42 l58,-18 l-90,66 l18,-44 z`}
                fill="none"
                stroke={PAPER}
                strokeWidth="5"
              />
              <line x1="118" y1="336" x2="290" y2="322" stroke={PAPER} strokeWidth="3" opacity="0.8" />
            </g>
          )}

          {variant === "interior" && (
            <g>
              <rect x="36" y="110" width="146" height="248" fill={INK} />
              <rect x="222" y="70" width="142" height="288" fill={INK} opacity="0.88" />
              <line x1="20" y1="390" x2="380" y2="390" stroke={INK} strokeWidth="4" />
              <circle cx="110" cy="200" r="36" fill="none" stroke={PAPER} strokeWidth="3" />
              <line x1="244" y1="110" x2="344" y2="330" stroke={PAPER} strokeWidth="3" opacity="0.8" />
            </g>
          )}

          {/* print scratches */}
          <line x1="-14" y1={40 + rnd() * 420} x2="414" y2={44 + rnd() * 420} stroke={INK} strokeWidth="0.75" opacity="0.35" />
        </g>

        {/* film noise on top of everything */}
        <rect width="400" height="500" filter={`url(#noise-${id})`} opacity="0.5" />
      </svg>

      {/* hazard duotone wash on hover (driven by parent .group) */}
      {accent && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-accent opacity-0 mix-blend-multiply transition-opacity duration-300 group-hover:opacity-70 motion-reduce:transition-none"
        />
      )}

      {label && (
        <span className="label-mono pointer-events-none absolute bottom-2 left-2 bg-bg/80 px-1.5 py-0.5 text-[0.65rem] text-bone">
          {label}
        </span>
      )}
    </div>
  );
}

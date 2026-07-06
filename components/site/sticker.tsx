import { cn } from "@/lib/utils";

/* Circular rotating sticker badge — the DB stamp. */
export function StickerBadge({
  className,
  text = "DURDEN · BARBERSHOP · ATHENS · STAY SHARP · ",
}: {
  className?: string;
  text?: string;
}) {
  return (
    <div className={cn("relative aspect-square", className)} aria-hidden>
      <svg viewBox="0 0 120 120" className="size-full animate-[spin_18s_linear_infinite] motion-reduce:animate-none">
        <defs>
          <path id="sticker-circle" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
        </defs>
        <circle cx="60" cy="60" r="58" fill="var(--accent)" />
        <circle cx="60" cy="60" r="34" fill="none" stroke="var(--on-accent)" strokeWidth="1.5" />
        <text
          fill="var(--on-accent)"
          style={{ fontSize: "10.5px", fontFamily: "var(--font-mono)", letterSpacing: "0.14em", fontWeight: 700 }}
        >
          <textPath href="#sticker-circle">{text}</textPath>
        </text>
        <text
          x="60"
          y="66"
          textAnchor="middle"
          fill="var(--on-accent)"
          style={{ fontSize: "18px", fontFamily: "var(--font-display)", letterSpacing: "0.02em" }}
        >
          DB
        </text>
      </svg>
    </div>
  );
}

/* Gaffer tape strip with mono text, slightly rotated. `ink` inverts it for
   use on light (Bone) sections. */
export function Tape({
  children,
  className,
  rotate = -2,
  ink = false,
}: {
  children: React.ReactNode;
  className?: string;
  rotate?: number;
  ink?: boolean;
}) {
  return (
    <span
      className={cn(
        "tape label-mono inline-block px-3 py-1.5 font-bold",
        ink && "tape-ink",
        className
      )}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {children}
    </span>
  );
}

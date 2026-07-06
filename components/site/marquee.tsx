import { cn } from "@/lib/utils";

/* CSS-driven marquee. Content is duplicated for a seamless loop; the copy is
   aria-hidden so screen readers hear it once. Pauses on hover and under
   prefers-reduced-motion (handled in globals.css). */
export function Marquee({
  children,
  className,
  duration = 24,
  reverse = false,
}: {
  children: React.ReactNode;
  className?: string;
  duration?: number;
  reverse?: boolean;
}) {
  return (
    <div className={cn("marquee overflow-hidden", className)}>
      <div
        className="marquee-track"
        style={{
          ["--marquee-duration" as string]: `${duration}s`,
          animationDirection: reverse ? "reverse" : undefined,
        }}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="marquee-dup flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}

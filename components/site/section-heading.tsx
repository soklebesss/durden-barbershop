import { Reveal } from "@/components/site/reveal";
import { Tape } from "@/components/site/sticker";
import { cn } from "@/lib/utils";

/* Section header as a poster paste-up: huge Anton title with a gaffer-tape
   strip slapped across its corner. The tape is the shop's one section
   grammar — rotation and copy vary per section so it reads hand-placed,
   not templated. */
export function SectionHeading({
  title,
  tape,
  tapeRotate = -2,
  className,
  inverted = false,
}: {
  title: string;
  tape?: string;
  tapeRotate?: number;
  className?: string;
  inverted?: boolean;
}) {
  return (
    <div className={cn("mb-12 sm:mb-16", className)}>
      <Reveal>
        <div className="relative inline-block max-w-full">
          {/* On mobile the tape sits above the title in flow; from sm it
             overlaps the headline corner like a pasted label. */}
          {tape && (
            <Tape
              rotate={tapeRotate}
              ink={inverted}
              className="mb-3 whitespace-nowrap sm:absolute sm:-right-6 sm:-top-3 sm:mb-0 sm:translate-x-1/3"
            >
              {tape}
            </Tape>
          )}
          <h2
            className={cn(
              "font-display text-display-lg",
              inverted ? "text-fg-inverted" : "text-fg"
            )}
          >
            {title}
          </h2>
        </div>
      </Reveal>
    </div>
  );
}

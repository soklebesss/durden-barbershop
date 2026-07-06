import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/* Native select, token-styled — reliable keyboard/mobile behavior beats
   a custom popover for a five-option booking form. */
const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <div className="relative">
      <select
        ref={ref}
        className={cn(
          "flex h-12 w-full cursor-pointer appearance-none rounded-[var(--ct-radius-hairline)] border border-[var(--input-border)] bg-[var(--input-bg)] px-4 pr-10 text-base text-[var(--input-fg)] transition-colors focus:border-[var(--input-border-focus)] focus:outline-none aria-[invalid=true]:border-accent disabled:cursor-not-allowed disabled:opacity-40 [color-scheme:dark]",
          className
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-fg-muted"
        aria-hidden
      />
    </div>
  )
);
Select.displayName = "Select";

export { Select };

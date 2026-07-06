import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "flex h-12 w-full rounded-[var(--ct-radius-hairline)] border border-[var(--input-border)] bg-[var(--input-bg)] px-4 text-base text-[var(--input-fg)] transition-colors placeholder:text-[var(--input-placeholder)] focus:border-[var(--input-border-focus)] focus:outline-none aria-[invalid=true]:border-accent disabled:cursor-not-allowed disabled:opacity-40 [color-scheme:dark]",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Input.displayName = "Input";

export { Input };

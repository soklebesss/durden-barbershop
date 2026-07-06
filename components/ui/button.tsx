import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-none font-mono text-label font-bold uppercase tracking-[0.08em] transition-colors duration-150 disabled:pointer-events-none disabled:opacity-40 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--btn-primary-bg)] text-[var(--btn-primary-fg)] hover:bg-bone hover:text-fg-inverted active:bg-[var(--btn-primary-bg-active)]",
        ghost:
          "border border-[var(--btn-ghost-border)] bg-transparent text-[var(--btn-ghost-fg)] hover:border-accent hover:text-accent active:text-accent-pressed",
        inverted:
          "bg-fg-inverted text-bone hover:bg-accent hover:text-on-accent active:bg-accent-pressed",
        link: "text-fg underline decoration-accent decoration-2 underline-offset-4 hover:text-accent",
      },
      size: {
        default: "h-12 px-6",
        lg: "h-14 px-9 text-sm",
        sm: "h-10 px-4",
        icon: "size-11",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      ref={ref}
      {...props}
    />
  )
);
Button.displayName = "Button";

export { Button, buttonVariants };

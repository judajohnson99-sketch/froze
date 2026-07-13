import { cn } from "@/lib/utils";
/**
 * CryoButton — translucent frosted-glass button with cyan edge glow and
 * a light sweep on hover. Variants: primary / secondary / ghost / danger.
 * Sizes: sm / md / lg. Built on top of the shadcn Button primitive so it
 * inherits Radix a11y, focus rings, and `asChild` support.
 */
import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import { type ButtonHTMLAttributes, forwardRef } from "react";

const cryoButtonVariants = cva(
  "cryo-btn-sweep inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-pill font-display font-medium tracking-tight transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground shadow-cryo-cyan-glow hover:shadow-cryo-vault-glow hover:-translate-y-0.5",
        secondary:
          "cryo-glass text-foreground hover:cryo-edge-glow hover:-translate-y-0.5",
        ghost:
          "bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted/40",
        danger:
          "bg-destructive text-destructive-foreground shadow-[0_0_24px_oklch(0.62_0.22_25/35%)] hover:shadow-[0_0_36px_oklch(0.62_0.22_25/50%)] hover:-translate-y-0.5",
      },
      size: {
        sm: "h-9 px-4 text-xs",
        md: "h-11 px-6 text-sm",
        lg: "h-14 px-8 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface CryoButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof cryoButtonVariants> {
  asChild?: boolean;
}

export const CryoButton = forwardRef<HTMLButtonElement, CryoButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(cryoButtonVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);
CryoButton.displayName = "CryoButton";

export { cryoButtonVariants };

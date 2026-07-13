import { cn } from "@/lib/utils";
/**
 * CryoInput — frosted glass input with cyan focus glow.
 * Built on the shadcn Input primitive so it inherits all a11y behaviour.
 */
import { type InputHTMLAttributes, forwardRef } from "react";

export type CryoInputProps = InputHTMLAttributes<HTMLInputElement>;

export const CryoInput = forwardRef<HTMLInputElement, CryoInputProps>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          "cryo-glass flex h-11 w-full rounded-xl px-4 py-2 text-sm text-foreground",
          "placeholder:text-muted-foreground/70",
          "transition-all duration-300",
          "focus-visible:outline-none focus-visible:cryo-edge-glow focus-visible:ring-2 focus-visible:ring-ring",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
    );
  },
);
CryoInput.displayName = "CryoInput";

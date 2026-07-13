import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
/**
 * CryoModal — frosted glass modal with backdrop blur.
 * Wraps the shadcn Dialog primitive (Radix) and applies cryo surfaces.
 */
import type * as React from "react";

export interface CryoModalProps extends React.ComponentProps<typeof Dialog> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  trigger?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export function CryoModal({
  title,
  description,
  trigger,
  footer,
  children,
  className,
  ...dialogProps
}: CryoModalProps) {
  return (
    <Dialog {...dialogProps}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent
        className={cn(
          "cryo-glass-strong cryo-condensation cryo-ice-facet",
          "border-border/40 p-6 text-foreground",
          className,
        )}
      >
        {(title || description) && (
          <DialogHeader>
            {title ? (
              <DialogTitle className="font-display text-xl text-foreground">
                {title}
              </DialogTitle>
            ) : null}
            {description ? (
              <DialogDescription className="text-muted-foreground">
                {description}
              </DialogDescription>
            ) : null}
          </DialogHeader>
        )}
        {children}
        {footer ? <DialogFooter>{footer}</DialogFooter> : null}
      </DialogContent>
    </Dialog>
  );
}

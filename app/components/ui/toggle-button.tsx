import clsx from "clsx";
import {
  ToggleButton as AriaToggleButton,
  ToggleButtonProps,
} from "react-aria-components";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";

const toggleButtonVariants = cva(
  "inline-flex items-center justify-center rounded-md font-medium ring-offset-mauve2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan7 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-mauve3 text-mauve12 selected:bg-cyan7",
        secondary: "bg-ruby9 text-mauve1",
      },
      size: {
        sm: "px-2 py-1 text-sm",
        md: "px-2 py-1",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

interface FullToggleButtonProps
  extends ToggleButtonProps,
    VariantProps<typeof toggleButtonVariants> {}

const ToggleButton = forwardRef<HTMLButtonElement, FullToggleButtonProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <AriaToggleButton
        className={clsx(toggleButtonVariants({ className, variant, size }))}
        ref={ref}
        {...props}
      >
        {children}
      </AriaToggleButton>
    );
  },
);
ToggleButton.displayName = "ToggleButton";

export { ToggleButton };

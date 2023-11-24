import { VariantProps, cva } from "class-variance-authority";
import clsx from "clsx";
import { forwardRef } from "react";
import {
  Input as AriaInput,
  Label,
  TextField,
  TextFieldProps,
  TextArea as AriaTextArea,
} from "react-aria-components";

// INPUT COMPONENT
interface InputProps extends TextFieldProps {
  className?: string;
  label?: string;
  placeholder?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, placeholder, ...props }, ref) => {
    return (
      <TextField
        ref={ref}
        {...props}
        className={clsx("flex flex-col gap-1", className)}
      >
        <Label className="text-sm text-mauve11">{label}</Label>
        <AriaInput
          placeholder={placeholder}
          className="w-full rounded-md border border-mauve6 bg-mauve1 p-1 ring-offset-mauve2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan7 focus-visible:ring-offset-2 disabled:pointer-events-none"
        />
      </TextField>
    );
  },
);
Input.displayName = "Input";

const textAreaVariants = cva(
  "w-full resize-none rounded-md p-2 ring-offset-mauve2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan7 focus-visible:ring-offset-2 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        form: "border border-mauve6 bg-mauve1",
        document: "bg-inherit",
      },
      size: {
        sm: "h-44",
        lg: "h-[75vh]",
      },
    },
    defaultVariants: {
      variant: "form",
      size: "sm",
    },
  },
);

interface InputPropsWithVariants
  extends InputProps,
    VariantProps<typeof textAreaVariants> {}

// TEXTAREA COMPONENT
const TextArea = forwardRef<HTMLTextAreaElement, InputPropsWithVariants>(
  ({ className, label, placeholder, variant, size, ...props }, ref) => {
    return (
      <TextField {...props} className={clsx("flex flex-col gap-1", className)}>
        <Label className="text-sm text-mauve11">{label}</Label>
        <AriaTextArea
          placeholder={placeholder}
          ref={ref}
          className={clsx(textAreaVariants({className, variant, size}))}
        />
      </TextField>
    );
  },
);
TextArea.displayName = "TextArea";

export { Input, TextArea };

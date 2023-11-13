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
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <TextField ref={ref} {...props} className={clsx("flex flex-col gap-1", className)}>
        <Label className="text-sm text-mauve11">{label}</Label>
        <AriaInput className="w-full rounded-md border border-mauve6 bg-mauve1 p-1 ring-offset-mauve2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan7 focus-visible:ring-offset-2 disabled:pointer-events-none" />
      </TextField>
    );
  },
);
Input.displayName = "Input";

// TEXTAREA COMPONENT
// TODO: Add class variance for different size text areas, and for resizeable text areas
const TextArea = forwardRef<HTMLTextAreaElement, InputProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <TextField {...props} className={clsx("flex flex-col gap-1", className)}>
        <Label className="text-sm text-mauve11">{label}</Label>
        <AriaTextArea ref={ref} className="w-full resize-none h-44 rounded-md border border-mauve6 bg-mauve1 p-1 ring-offset-mauve2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan7 focus-visible:ring-offset-2 disabled:pointer-events-none" />
      </TextField>
    );
  },
);
TextArea.displayName = "TextArea";

export { Input, TextArea };

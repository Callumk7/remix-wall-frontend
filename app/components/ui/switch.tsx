import { forwardRef } from "react";
import { Switch as AriaSwitch, Label, SwitchProps } from "react-aria-components";

interface FullSwitchProps extends SwitchProps {
  label: string;
}

const Switch = forwardRef<HTMLInputElement, FullSwitchProps>(
  ({ children, label, ...props }, ref) => {
    return (
      <AriaSwitch
        className={"group flex items-center gap-2 text-sm text-mauve11"}
        ref={ref}
        {...props}
      >
        <div className="box-border flex h-[26px] w-[44px] shrink-0 cursor-default rounded-full border border-solid border-mauve1 bg-mauve4 bg-clip-padding p-[3px] shadow-inner outline-none ring-cyan7 transition duration-200 ease-in-out group-focus-visible:ring-2 group-pressed:bg-mauve9 group-selected:bg-ruby7 group-selected:group-pressed:bg-ruby8">
          <span className="h-[18px] w-[18px] translate-x-0 transform rounded-full bg-mauve1 shadow transition duration-200 ease-in-out group-selected:translate-x-[100%]" />
        </div>
        <Label>{label}</Label>
      </AriaSwitch>
    );
  },
);
Switch.displayName = "Switch";

export { Switch };

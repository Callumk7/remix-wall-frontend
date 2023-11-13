import {
  Popover as AriaPopover,
  Menu as AriaMenu,
  Item as AriaItem,
  ItemProps,
  PopoverProps,
  MenuProps,
} from "react-aria-components";

import { forwardRef } from "react";
import clsx from "clsx";

const Popover = forwardRef<HTMLElement, PopoverProps>(({ className, ...props }, ref) => {
  return (
    <AriaPopover
      className={clsx(
        className,
        "w-56 origin-top-left overflow-auto rounded-md bg-background p-1 shadow-lg ring-1 ring-black ring-opacity-5 fill-mode-forwards entering:animate-in entering:fade-in entering:zoom-in-95 exiting:animate-out exiting:fade-out exiting:zoom-out-95",
      )}
      ref={ref}
      {...props}
    />
  );
});
Popover.displayName = "Popover";

const Menu = forwardRef<HTMLDivElement, MenuProps<ItemProps>>(
  ({ className, ...props }, ref) => {
    return <AriaMenu className={clsx(className, "outline-none")} ref={ref} {...props} />;
  },
);
Menu.displayName = "Menu";

const MenuItem = forwardRef<HTMLElement, ItemProps>(({ className, ...props }, ref) => {
  return (
    <AriaItem
      className={clsx(
        className,
        "group box-border flex w-full cursor-default items-center rounded-md px-3 py-2 text-gray-900 outline-none focus:bg-violet-500 focus:text-white",
      )}
      ref={ref}
      {...props}
    />
  );
});
MenuItem.displayName = "MenuItem";

export { Popover, Menu, MenuItem }

import { clsx } from "clsx";
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={clsx(
        className,
        "relative flex flex-col gap-y-2 rounded-md border border-mauve6 p-3 shadow-lg shadow-blackA1",
      )}
    >
      {children}
    </div>
  );
}


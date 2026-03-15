import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "../../../lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
          {
            "bg-brand-primary text-brand-base hover:bg-brand-primary/90": variant === "primary",
            "bg-brand-secondary text-white hover:bg-brand-secondary/90": variant === "secondary",
            "border border-brand-contrast bg-transparent hover:bg-brand-contrast/5 text-brand-contrast": variant === "outline",
            "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500": variant === "danger",
            "hover:bg-brand-contrast/10 text-brand-contrast": variant === "ghost",
            "h-9 px-4 text-sm": size === "sm",
            "h-10 px-6 py-2": size === "md",
            "h-12 px-8 text-lg": size === "lg",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

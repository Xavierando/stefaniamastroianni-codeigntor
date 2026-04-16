import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "link";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-full font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary disabled:opacity-50 disabled:pointer-events-none",
          {
            "bg-brand-primary text-white hover:bg-brand-primary/90": variant === "primary",
            "bg-brand-secondary text-white hover:bg-brand-secondary/90": variant === "secondary",
            "border border-brand-neutral bg-transparent hover:bg-brand-neutral/50 text-brand-contrast": variant === "outline",
            "hover:bg-brand-contrast/10 text-brand-contrast": variant === "ghost",
            "underline-offset-4 hover:underline text-brand-primary hover:text-brand-primary/80 p-0 h-auto font-semibold": variant === "link",
            "h-9 px-6 text-sm": size === "sm",
            "h-12 px-8 py-2": size === "md",
            "h-14 px-10 text-lg": size === "lg",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";
import { IconSpinner } from "./icons";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "outline";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-accent-600 text-white hover:bg-accent-700 active:bg-accent-800 focus-visible:outline-accent-700",
  secondary:
    "bg-brand-900 text-white hover:bg-brand-800 active:bg-brand-950 focus-visible:outline-brand-900",
  outline:
    "border border-brand-200 bg-white text-brand-900 hover:bg-brand-50 focus-visible:outline-accent-600",
  ghost:
    "text-brand-800 hover:bg-brand-50 focus-visible:outline-accent-600",
  danger:
    "bg-danger-600 text-white hover:bg-danger-700 focus-visible:outline-danger-700",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-8 rounded-md px-3 text-sm",
  md: "h-10 rounded-md px-4 text-sm",
  lg: "h-12 rounded-lg px-6 text-base",
};

export function buttonStyles(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string,
): string {
  return cn(base, variants[variant], sizes[size], className);
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  className,
  children,
  disabled,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonStyles(variant, size, className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <IconSpinner className="h-4 w-4" /> : null}
      {children}
    </button>
  );
}

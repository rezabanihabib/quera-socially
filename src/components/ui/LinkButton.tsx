import { type AnchorHTMLAttributes } from "react";
import { Link, type LinkProps } from "react-router-dom";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "tertiary" | "outline";
type Size = "sm" | "md" | "lg";

interface LinkButtonProps extends LinkProps, Pick<AnchorHTMLAttributes<HTMLAnchorElement>, "className"> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-primary-hover",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary-hover",
  tertiary: "bg-tertiary text-tertiary-foreground hover:opacity-80",
  outline: "bg-transparent border border-border text-foreground hover:bg-surface-hover",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-8 px-3 text-xs rounded-lg gap-1.5",
  md: "h-9 px-4 text-sm rounded-lg gap-2",
  lg: "h-11 px-5 text-sm rounded-xl gap-2",
};

export function LinkButton({ variant = "primary", size = "md", className, ...props }: LinkButtonProps) {
  return (
    <Link
      className={cn(
        "inline-flex items-center justify-center font-medium transition-colors duration-150",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    />
  );
}

import { cn } from "@/lib/utils";
import { getInitial } from "@/lib/utils";

interface AvatarProps {
  src?: string | null;
  name?: string | null;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  xs: "h-6 w-6 text-xs",
  sm: "h-8 w-8 text-sm",
  md: "h-10 w-10 text-base",
  lg: "h-16 w-16 text-2xl",
  xl: "h-20 w-20 text-3xl",
};

// Deterministic fallback color per name, echoing the green "S" avatar in the Figma file
const PALETTE = ["#16a34a", "#2563eb", "#7c3aed", "#dc2626", "#d97706", "#0891b2"];

function colorForName(name?: string | null) {
  if (!name) return PALETTE[0];
  const code = name.charCodeAt(0) || 0;
  return PALETTE[code % PALETTE.length];
}

export function Avatar({ src, name, size = "md", className }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={name ?? "avatar"}
        className={cn("rounded-full object-cover flex-shrink-0", sizeClasses[size], className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full font-semibold text-white flex-shrink-0",
        sizeClasses[size],
        className
      )}
      style={{ backgroundColor: colorForName(name) }}
    >
      {getInitial(name)}
    </div>
  );
}

import { cn } from "@/lib/utils";
import defaultAvatar from "@/img/avatar-placeholder.webp";

interface AvatarProps {
  src?: string | null;
  name?: string | null;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  xs: "h-6 w-6",
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-[59px] w-[59px]",
  xl: "h-[69px] w-[69px]",
};

export function Avatar({ src, name, size = "md", className }: AvatarProps) {
  return (
    <img
      src={src || defaultAvatar}
      alt={name ?? "avatar"}
      className={cn("rounded-full object-cover shrink-0 bg-muted", sizeClasses[size], className)}
      onError={(e) => {
        const img = e.currentTarget;
        if (img.src === defaultAvatar) return;
        img.src = defaultAvatar;
      }}
    />
  );
}

import { getInitial } from "@/lib/utils";

const PALETTE = [
  "#3b82f6", // blue
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#f97316", // orange
  "#10b981", // emerald
  "#06b6d4", // cyan
  "#eab308", // yellow
  "#ef4444", // red
];

function colorForSeed(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

const SIZE_CLASSES = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-lg",
  xl: "h-16 w-16 text-xl",
} as const;

interface InitialAvatarProps {
  id?: string | null;
  name?: string | null;
  avatar?: string | null;
  size?: keyof typeof SIZE_CLASSES;
  className?: string;
}

export function InitialAvatar({
  id,
  name,
  avatar,
  size = "md",
  className = "",
}: InitialAvatarProps) {
  const sizeClass = SIZE_CLASSES[size];

  if (avatar) {
    return (
      <img
        src={avatar}
        alt={name ?? "User"}
        className={`flex-shrink-0 rounded-full object-cover ${sizeClass} ${className}`}
      />
    );
  }

  const seed = id || name || "?";

  return (
    <div
      className={`flex flex-shrink-0 items-center justify-center rounded-full font-semibold text-white ${sizeClass} ${className}`}
      style={{ backgroundColor: colorForSeed(seed) }}
    >
      {getInitial(name)}
    </div>
  );
}

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function timeAgo(dateInput: string | number | Date): string {
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) return "";

  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 5) return "just now";

  const units: [number, string][] = [
    [60, "second"],
    [60, "minute"],
    [24, "hour"],
    [30, "day"],
    [12, "month"],
    [Number.POSITIVE_INFINITY, "year"],
  ];

  let value = seconds;
  let unitLabel = "second";
  for (const [amount, label] of units) {
    if (value < amount) {
      unitLabel = label;
      break;
    }
    value = Math.floor(value / amount);
    unitLabel = label;
  }

  const rounded = Math.max(1, Math.floor(value));
  const plural = rounded === 1 ? "" : "s";
  const prefix = unitLabel === "day" || unitLabel === "month" ? "about " : "";
  return rounded < 60 && unitLabel === "second"
    ? `${rounded}s ago`
    : `${prefix}${rounded} ${unitLabel}${plural} ago`;
}

export function getInitial(name?: string | null): string {
  if (!name || !name.trim()) return "?";
  return name.trim()[0].toUpperCase();
}

const UPLOADCARE_CDN_BASE = "https://1p5nep1spk.ucarecd.net";

export function resolveImageUrl(value?: string | null): string | null {
  if (!value) return null;
  if (value.toLowerCase().includes("avatar-placeholder")) return null;
  if (/^https?:\/\//i.test(value)) return value;
  return `${UPLOADCARE_CDN_BASE}/${value}/`;
}

export function formatJoinDate(dateInput: string | number | Date): string {
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) return "";
  return `Joined ${date.toLocaleDateString(undefined, { month: "long", year: "numeric" })}`;
}

export function displayHandle(
  user?: { id?: string; username?: string | null } | null,
): string {
  if (!user?.username) return "";
  if (user.id && user.username === user.id) {
    return `user-${user.id.slice(0, 6)}`;
  }
  return user.username;
}

export function generateUsernameFromEmail(
  email?: string | null,
): string | undefined {
  if (!email) return undefined;
  const atIndex = email.indexOf("@");
  return atIndex > 0 ? email.slice(0, atIndex) : email;
}

export function isPostLikedByUser(
  likedByUserIds: string[] | undefined | null,
  currentUserId?: string | null,
): boolean {
  if (!currentUserId || !likedByUserIds || likedByUserIds.length === 0)
    return false;
  return likedByUserIds.includes(currentUserId);
}

function extractFollowerId(entry: any): string | undefined {
  if (typeof entry === "string") return entry;
  return (
    entry?.id ?? entry?._id ?? entry?.followerId ?? entry?.userId ?? undefined
  );
}

export function isUserFollowedByMe(
  followers: unknown,
  currentUserId?: string | null,
): boolean {
  if (!currentUserId || !Array.isArray(followers) || followers.length === 0)
    return false;
  return followers.some((entry) => extractFollowerId(entry) === currentUserId);
}

import { api } from "@/api/axiosInstance";
import { generateUsernameFromEmail } from "@/lib/utils";
import type { AppNotification, NotificationType } from "@/types";

type RawActor = {
  id?: string;
  username?: string;
  name?: string;
  email?: string;
  avatar?: string | null;
  image?: string | null;
};

function normalizeActor(actor: RawActor | undefined): AppNotification["actor"] {
  const id = actor?.id ?? "";
  return {
    id,
    username:
      actor?.username ??
      generateUsernameFromEmail(actor?.email) ??
      (id || undefined) ??
      actor?.name ??
      "user",
    name: actor?.name ?? actor?.username ?? "Someone",
    avatar: actor?.avatar ?? actor?.image ?? null,
  };
}

function normalizeType(rawType: unknown): NotificationType {
  const value = String(rawType ?? "").toLowerCase();
  if (value.includes("like")) return "like";
  if (value.includes("comment")) return "comment";
  if (value.includes("follow")) return "follow";
  return "comment";
}

function normalizeNotification(raw: any): AppNotification {
  const actorRaw =
    raw?.actor ??
    raw?.sender ??
    raw?.creator ??
    raw?.fromUser ??
    raw?.from ??
    raw?.follower ??
    raw?.user ??
    raw?.by;

  const postRaw = raw?.post;
  const commentRaw = raw?.comment;

  return {
    id: raw?.id ?? raw?._id ?? raw?.notificationId ?? String(Math.random()),
    type: normalizeType(raw?.type ?? raw?.notificationType ?? raw?.kind),
    read: raw?.read ?? raw?.isRead ?? false,
    actor: normalizeActor(actorRaw),
    post: postRaw
      ? { id: postRaw.id ?? "", content: postRaw.content ?? postRaw.text ?? "" }
      : null,
    commentPreview:
      commentRaw?.content ?? commentRaw?.text ?? raw?.commentPreview ?? null,
    createdAt: raw?.createdAt ?? raw?.date ?? new Date().toISOString(),
  };
}

export const notificationsApi = {
  getAll: async (): Promise<AppNotification[]> => {
    const { data } = await api.get("/api/notifications");

    let notifications: any[] = [];

    if (Array.isArray(data)) {
      notifications = data;
    } else if (Array.isArray(data?.notifications)) {
      notifications = data.notifications;
    }
    // { data: { notifications: [...] } }
    else if (Array.isArray(data?.data?.notifications)) {
      notifications = data.data.notifications;
    } else if (Array.isArray(data?.data)) {
      notifications = data.data;
    } else if (Array.isArray(data?.response)) {
      notifications = data.response;
    } else {
      console.error("Unexpected notifications API response:", data);
    }

    return notifications.map(normalizeNotification);
  },

  markAllAsRead: async (ids: string[]): Promise<void> => {
    if (ids.length === 0) return;
    await api.patch("/api/notifications", { ids });
  },
};

import { Heart, MessageCircle, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar } from "@/components/ui/Avatar";
import { cn, timeAgo } from "@/lib/utils";
import type { AppNotification } from "@/types";

const ICONS: Record<AppNotification["type"], typeof Heart> = {
  like: Heart,
  comment: MessageCircle,
  follow: UserPlus,
};

const ICON_COLORS: Record<AppNotification["type"], string> = {
  like: "text-like",
  comment: "text-accent",
  follow: "text-green-500",
};

function notificationText(n: AppNotification) {
  switch (n.type) {
    case "like":
      return "liked your post";
    case "comment":
      return "commented on your post";
    case "follow":
      return "started following you";
  }
}

export function NotificationItem({
  notification,
}: {
  notification: AppNotification;
}) {
  const Icon = ICONS[notification.type];
  const canLinkToActor = Boolean(
    notification.actor.id || notification.actor.username,
  );

  return (
    <div
      className={cn(
        "flex gap-3 rounded-lg px-3 py-3 transition-colors",
        !notification.read && "bg-surface-hover",
      )}
    >
      <Avatar
        src={notification.actor.avatar}
        name={notification.actor.name}
        size="sm"
      />
      <div className="min-w-0 flex-1">
        <p className="text-sm text-foreground">
          <Icon
            className={cn(
              "mb-0.5 inline h-3.5 w-3.5",
              ICON_COLORS[notification.type],
            )}
          />{" "}
          {canLinkToActor ? (
            <Link
              to={`/profile/${notification.actor.username}`}
              className="font-semibold hover:underline"
            >
              {notification.actor.name}
            </Link>
          ) : (
            <span className="font-semibold">{notification.actor.name}</span>
          )}{" "}
          {notificationText(notification)}
        </p>
        {notification.post?.content && (
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {notification.post.content}
          </p>
        )}
        {notification.commentPreview && (
          <p className="mt-1 rounded-md bg-muted px-2 py-1 text-xs text-foreground">
            {notification.commentPreview}
          </p>
        )}
        <p className="mt-1 text-[11px] text-muted-foreground">
          {timeAgo(notification.createdAt)}
        </p>
      </div>
      {!notification.read && (
        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent" />
      )}
    </div>
  );
}

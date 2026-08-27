import { Bell } from "lucide-react";
import {
  useNotifications,
  useMarkNotificationsRead,
} from "@/hooks/useNotifications";
import { NotificationItem } from "@/components/notifications/NotificationItem";
import { ProfileCardMini } from "@/components/profile/ProfileCardMini";
import { EmptyState, Skeleton } from "@/components/ui/Feedback";
import { useAuthStore } from "@/store/authStore";

export default function NotificationsPage() {
  const user = useAuthStore((s) => s.user);
  const { data: notifications, isLoading } = useNotifications();
  const markRead = useMarkNotificationsRead();

  const unreadIds =
    notifications?.filter((n) => !n.read).map((n) => n.id) ?? [];
  const unreadCount = unreadIds.length;

  return (
    <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 px-4 py-6 md:grid-cols-[240px_1fr]">
      <div className="md:sticky md:top-20 md:h-fit">
        {user && <ProfileCardMini user={user} />}
      </div>

      <div className="rounded-xl border border-border bg-surface p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h1 className="text-sm font-semibold text-foreground">
            Notifications
          </h1>
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <span className="text-xs text-muted-foreground">
                {unreadCount} unread
              </span>
            )}
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() => markRead.mutate(unreadIds)}
                disabled={markRead.isPending}
                className="cursor-pointer text-xs font-semibold text-accent transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
              >
                {markRead.isPending ? "Marking…" : "Mark as read"}
              </button>
            )}
          </div>
        </div>

        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3 w-2/3" />
                  <Skeleton className="h-2.5 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && notifications?.length === 0 && (
          <EmptyState
            icon={Bell}
            title="No notifications yet"
            description="You're all caught up."
          />
        )}

        <div className="divide-y divide-border">
          {notifications?.map((n) => (
            <NotificationItem key={n.id} notification={n} />
          ))}
        </div>
      </div>
    </div>
  );
}

import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { useRecommendedUsers, useToggleFollow } from "@/hooks/useUsers";
import { Skeleton } from "@/components/ui/Feedback";

export function WhoToFollow() {
  const { data: users, isLoading, isFetching } = useRecommendedUsers();
  const toggleFollow = useToggleFollow();

  if (isLoading || (isFetching && (!users || users.length === 0))) {
    return (
      <div className="rounded-xl border border-border bg-surface p-4 shadow-card">
        <p className="mb-3 text-base font-bold text-foreground">
          Recommended users
        </p>
        {[1, 2, 3].map((i) => (
          <div key={i} className="mb-3 flex items-center gap-2.5">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-3 flex-1" />
          </div>
        ))}
      </div>
    );
  }

  if (!users || users.length === 0) return null;

  const followableUsers = users.filter((u) => Boolean(u.username));

  if (followableUsers.length === 0) return null;

  return (
    <div className="rounded-xl border border-border bg-surface p-4 shadow-card">
      <p className="mb-3 text-base font-bold text-foreground">
        Recommended users
      </p>
      <div className="space-y-3">
        {followableUsers.map((u) => {
          const isThisPending =
            toggleFollow.isPending && toggleFollow.variables?.id === u.id;

          return (
            <div key={u.id} className="flex items-center justify-between gap-2">
              <Link
                to={`/profile/${u.username}`}
                className="flex min-w-0 items-center gap-2.5"
              >
                <Avatar src={u.avatar} name={u.name} size="md" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {u.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {u.followersCount} followers
                  </p>
                </div>
              </Link>
              {isThisPending ? (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <Button
                  size="sm"
                  variant={u.isFollowedByMe ? "tertiary" : "outline"}
                  onClick={() => toggleFollow.mutate(u)}
                  className="shrink-0"
                >
                  {u.isFollowedByMe ? "Following" : "Follow"}
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

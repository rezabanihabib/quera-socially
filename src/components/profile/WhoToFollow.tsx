import { Link } from "react-router-dom";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { useRecommendedUsers, useToggleFollow } from "@/hooks/useUsers";
import { Skeleton } from "@/components/ui/Feedback";
import { displayHandle } from "@/lib/utils";

export function WhoToFollow() {
  const { data: users, isLoading, isFetching } = useRecommendedUsers();
  const toggleFollow = useToggleFollow();

  if (isLoading || (isFetching && (!users || users.length === 0))) {
    return (
      <div className="rounded-xl border border-border bg-surface p-4">
        <p className="mb-3 text-sm font-semibold text-foreground">
          Who to Follow
        </p>
        {[1, 2, 3].map((i) => (
          <div key={i} className="mb-3 flex items-center gap-2.5">
            <Skeleton className="h-8 w-8 rounded-full" />
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
    <div className="rounded-xl border border-border bg-surface p-4">
      <p className="mb-3 text-sm font-semibold text-foreground">
        Who to Follow
      </p>
      <div className="space-y-3">
        {followableUsers.map((u) => (
          <div key={u.id} className="flex items-center justify-between gap-2">
            <Link
              to={`/profile/${u.username}`}
              className="flex min-w-0 items-center gap-2.5"
            >
              <Avatar src={u.avatar} name={u.name} size="sm" />
              <div className="min-w-0">
                <p className="truncate text-xs font-medium text-foreground">
                  @{displayHandle(u)}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {u.followersCount} followers
                </p>
              </div>
            </Link>
            <Button
              size="sm"
              variant={u.isFollowedByMe ? "tertiary" : "secondary"}
              onClick={() => toggleFollow.mutate(u)}
              className="flex-shrink-0"
            >
              {u.isFollowedByMe ? "Following" : "Follow"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

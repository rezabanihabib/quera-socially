import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { useFollowings, useToggleFollow } from "@/hooks/useUsers";
import { useAuthStore } from "@/store/authStore";
import { displayHandle } from "@/lib/utils";
import type { User } from "@/types";

interface UserListItemProps {
  user: User;
  onNavigate?: () => void;
}

export function UserListItem({ user, onNavigate }: UserListItemProps) {
  const currentUser = useAuthStore((s) => s.user);
  const toggleFollow = useToggleFollow();
  const isSelf = currentUser?.id === user.id;

  const { data: myFollowings } = useFollowings(currentUser?.id, !isSelf);
  const isFollowedByMe = myFollowings
    ? myFollowings.some((u) => u.id === user.id)
    : user.isFollowedByMe;

  const isThisPending =
    toggleFollow.isPending && toggleFollow.variables?.id === user.id;

  return (
    <div className="flex items-center justify-between gap-2 py-2.5">
      <Link
        to={`/profile/${user.username}`}
        onClick={onNavigate}
        className="flex min-w-0 items-center gap-2.5"
      >
        <Avatar src={user.avatar} name={user.name} size="md" />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">
            {user.name}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            @{displayHandle(user)}
          </p>
        </div>
      </Link>

      {!isSelf &&
        (isThisPending ? (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Button
            size="sm"
            variant={isFollowedByMe ? "tertiary" : "outline"}
            onClick={() => toggleFollow.mutate({ ...user, isFollowedByMe })}
            className="shrink-0"
          >
            {isFollowedByMe ? "Following" : "Follow"}
          </Button>
        ))}
    </div>
  );
}

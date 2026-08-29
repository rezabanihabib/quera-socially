import { Link } from "react-router-dom";
import { MapPin, Link2 } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { displayHandle } from "@/lib/utils";
import type { User } from "@/types";

export function ProfileCardMini({ user }: { user: User }) {
  return (
    <Link
      to={`/profile/${user.username}`}
      className="block rounded-xl border border-border bg-surface px-6 py-[62px] text-center shadow-card transition-colors hover:bg-surface-hover"
    >
      <Avatar
        src={user.avatar}
        name={user.name}
        size="lg"
        className="mx-auto"
      />
      <p className="mt-3 text-sm font-semibold text-foreground">{user.name}</p>
      <p className="text-xs text-muted-foreground">{displayHandle(user)}</p>

      <div className="mt-4 grid grid-cols-2 gap-2 border-y border-border py-3">
        <div>
          <p className="text-sm font-semibold text-foreground">
            {user.followingCount}
          </p>
          <p className="text-[11px] text-muted-foreground">Followings</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">
            {user.followersCount}
          </p>
          <p className="text-[11px] text-muted-foreground">Followers</p>
        </div>
      </div>

      <div className="mt-3 space-y-1.5 text-left">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          {user.location || "No location"}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link2 className="h-3.5 w-3.5" />
          {user.website || "No website"}
        </div>
      </div>
    </Link>
  );
}

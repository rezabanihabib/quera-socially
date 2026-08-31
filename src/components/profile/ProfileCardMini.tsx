import { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Link2 } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { FollowListModal } from "@/components/users/FollowListModal";
import { displayHandle } from "@/lib/utils";
import type { User } from "@/types";

export function ProfileCardMini({ user }: { user: User }) {
  const [followListMode, setFollowListMode] = useState<"followers" | "followings" | null>(null);

  return (
    <div className="rounded-xl border border-border bg-surface px-6 py-[62px] text-center shadow-card transition-colors hover:bg-surface-hover">
      <Link to={`/profile/${user.username}`} className="block">
        <Avatar src={user.avatar} name={user.name} size="lg" className="mx-auto" />
        <p className="mt-3 text-sm font-semibold text-foreground">{user.name}</p>
        <p className="text-xs text-muted-foreground">{displayHandle(user)}</p>
      </Link>

      <div className="mt-4 grid grid-cols-2 gap-2 border-y border-border py-3">
        <button
          type="button"
          onClick={() => setFollowListMode("followings")}
          className="rounded-lg py-1 transition-colors hover:bg-surface-hover"
        >
          <p className="text-sm font-semibold text-foreground">{user.followingCount}</p>
          <p className="text-[11px] text-muted-foreground">Followings</p>
        </button>
        <button
          type="button"
          onClick={() => setFollowListMode("followers")}
          className="rounded-lg py-1 transition-colors hover:bg-surface-hover"
        >
          <p className="text-sm font-semibold text-foreground">{user.followersCount}</p>
          <p className="text-[11px] text-muted-foreground">Followers</p>
        </button>
      </div>

      <Link to={`/profile/${user.username}`} className="block">
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

      {followListMode && (
        <FollowListModal
          open={Boolean(followListMode)}
          onClose={() => setFollowListMode(null)}
          userId={user.id}
          mode={followListMode}
        />
      )}
    </div>
  );
}

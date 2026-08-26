import { MapPin, Link as LinkIcon } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { InitialAvatar } from "./InitialAvatar";

export function ProfileCardMini() {
  const user = useAuthStore((s) => s.user);

  if (!user) return null;

  return (
    <div className="rounded-xl border border-border bg-surface p-5 text-center">
      <InitialAvatar
        id={user.id}
        name={user.name}
        avatar={user.avatar}
        size="xl"
        className="mx-auto"
      />

      <p className="mt-3 text-base font-bold text-foreground">{user.name}</p>
      <p className="text-sm text-muted-foreground">{user.username}</p>

      <div className="mt-4 grid grid-cols-2 gap-2 border-y border-border py-3">
        <div>
          <p className="text-base font-bold text-foreground">
            {user.followingCount}
          </p>
          <p className="text-xs text-muted-foreground">Followings</p>
        </div>
        <div>
          <p className="text-base font-bold text-foreground">
            {user.followersCount}
          </p>
          <p className="text-xs text-muted-foreground">Followers</p>
        </div>
      </div>

      <div className="mt-3 space-y-1.5 text-left">
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
          {user.location || "No location"}
        </p>
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <LinkIcon className="h-3.5 w-3.5 flex-shrink-0" />
          {user.website || "No website"}
        </p>
      </div>
    </div>
  );
}

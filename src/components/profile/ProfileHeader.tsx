import { useState } from "react";
import { Calendar, MapPin, Link2 } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { EditProfileModal } from "@/components/profile/EditProfileModal";
import { useToggleFollow } from "@/hooks/useUsers";
import { useAuthStore } from "@/store/authStore";
import { displayHandle, formatJoinDate } from "@/lib/utils";
import type { User } from "@/types";

export function ProfileHeader({ profile }: { profile: User }) {
  const currentUser = useAuthStore((s) => s.user);
  const isOwnProfile = currentUser?.id === profile.id;
  const toggleFollow = useToggleFollow();
  const [editOpen, setEditOpen] = useState(false);

  return (
    <div className="rounded-xl border border-border bg-surface p-6 text-center">
      <Avatar src={profile.avatar} name={profile.name} size="xl" className="mx-auto" />
      <h1 className="mt-3 text-xl font-bold text-foreground">{profile.name}</h1>
      <p className="text-sm text-muted-foreground">@{displayHandle(profile)}</p>

      <div className="mx-auto mt-4 grid max-w-xs grid-cols-3 gap-2">
        <div>
          <p className="text-sm font-semibold text-foreground">{profile.followingCount}</p>
          <p className="text-[11px] text-muted-foreground">Following</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{profile.followersCount}</p>
          <p className="text-[11px] text-muted-foreground">Followers</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{profile.postsCount ?? 0}</p>
          <p className="text-[11px] text-muted-foreground">Posts</p>
        </div>
      </div>

      <div className="mt-4">
        {isOwnProfile ? (
          <Button variant="primary" className="w-full" onClick={() => setEditOpen(true)}>
            Edit Profile
          </Button>
        ) : (
          <Button
            variant={profile.isFollowedByMe ? "tertiary" : "primary"}
            className="w-full"
            isLoading={toggleFollow.isPending}
            onClick={() => toggleFollow.mutate(profile)}
          >
            {profile.isFollowedByMe ? "Unfollow" : "Follow"}
          </Button>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5" />
          {formatJoinDate(profile.createdAt)}
        </span>
        {profile.location && (
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            {profile.location}
          </span>
        )}
        {profile.website && (
          <span className="flex items-center gap-1.5">
            <Link2 className="h-3.5 w-3.5" />
            {profile.website}
          </span>
        )}
      </div>

      {profile.bio && <p className="mt-3 text-sm text-foreground">{profile.bio}</p>}

      {isOwnProfile && (
        <EditProfileModal open={editOpen} onClose={() => setEditOpen(false)} user={profile} />
      )}
    </div>
  );
}

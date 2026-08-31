import { Modal } from "@/components/ui/Modal";
import { Skeleton, EmptyState } from "@/components/ui/Feedback";
import { UserListItem } from "@/components/users/UserListItem";
import { useFollowers, useFollowings } from "@/hooks/useUsers";
import { Users } from "lucide-react";

interface FollowListModalProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  mode: "followers" | "followings";
}

export function FollowListModal({ open, onClose, userId, mode }: FollowListModalProps) {
  const isFollowers = mode === "followers";
  const followersQuery = useFollowers(userId, open && isFollowers);
  const followingsQuery = useFollowings(userId, open && !isFollowers);

  const { data: users, isLoading } = isFollowers ? followersQuery : followingsQuery;

  return (
    <Modal open={open} onClose={onClose} title={isFollowers ? "Followers" : "Followings"}>
      <div className="max-h-96 overflow-y-auto">
        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-2.5">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-3 flex-1" />
              </div>
            ))}
          </div>
        )}

        {!isLoading && (!users || users.length === 0) && (
          <EmptyState
            icon={Users}
            title={isFollowers ? "No followers yet" : "Not following anyone yet"}
            description={
              isFollowers
                ? "When someone follows this person, they'll show up here."
                : "Accounts this person follows will show up here."
            }
          />
        )}

        <div className="divide-y divide-border">
          {users?.map((user) => (
            <UserListItem key={user.id} user={user} onNavigate={onClose} />
          ))}
        </div>
      </div>
    </Modal>
  );
}

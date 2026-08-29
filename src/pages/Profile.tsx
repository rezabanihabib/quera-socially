import { useState } from "react";
import { useParams } from "react-router-dom";
import { useUserProfile, useUserPosts, useUserLikes } from "@/hooks/useUsers";
import { useAuthStore } from "@/store/authStore";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileCardMini } from "@/components/profile/ProfileCardMini";
import { PostCard } from "@/components/post/PostCard";
import { PostSkeleton } from "@/components/post/PostSkeleton";
import { EmptyState, PageSpinner } from "@/components/ui/Feedback";
import { cn } from "@/lib/utils";

type Tab = "posts" | "likes";

export default function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const { user: currentUser, isInitialized } = useAuthStore();
  const [tab, setTab] = useState<Tab>("posts");

  const { data: profile, isLoading: profileLoading } = useUserProfile(username);
  const { data: posts, isLoading: postsLoading } = useUserPosts(profile?.id);
  const { data: likes, isLoading: likesLoading } = useUserLikes(profile?.id);

  if (!isInitialized || profileLoading) return <PageSpinner />;

  if (!profile) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <EmptyState
          title="User not found"
          description="This profile doesn't exist or was removed."
        />
      </div>
    );
  }

  const isOwnProfile = currentUser?.id === profile.id;
  const activeList = tab === "posts" ? posts : likes;
  const activeLoading = tab === "posts" ? postsLoading : likesLoading;

  const emptyCopy =
    tab === "posts"
      ? {
          title: "There is no post",
          description: isOwnProfile
            ? "You haven't posted anything"
            : "This user not posted anything",
        }
      : {
          title: "There is no likes",
          description: isOwnProfile
            ? "You haven't liked anything"
            : "This user hasn't liked anything",
        };

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 py-6 md:grid-cols-[296px_1fr]">
      <div className="hidden md:sticky md:top-24 md:block md:h-fit">
        {currentUser && <ProfileCardMini user={currentUser} />}
      </div>

      <div className="flex flex-col gap-4">
        <div className="mx-auto w-full max-w-lg">
          <ProfileHeader profile={profile} />
        </div>

        <div className="flex rounded-lg bg-muted p-1">
          <button
            onClick={() => setTab("posts")}
            className={cn(
              "flex-1 rounded-md py-2 text-sm font-semibold transition-colors",
              tab === "posts"
                ? "bg-surface text-foreground shadow-card"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Posts
          </button>
          <button
            onClick={() => setTab("likes")}
            className={cn(
              "flex-1 rounded-md py-2 text-sm font-semibold transition-colors",
              tab === "likes"
                ? "bg-surface text-foreground shadow-card"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Likes
          </button>
        </div>

        {activeLoading && (
          <>
            <PostSkeleton />
            <PostSkeleton />
          </>
        )}

        {!activeLoading && activeList?.length === 0 && (
          <div className="rounded-xl bg-primary px-4 py-3 text-primary-foreground">
            <p className="text-sm font-bold">{emptyCopy.title}</p>
            <p className="text-xs opacity-80">{emptyCopy.description}</p>
          </div>
        )}

        {activeList?.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

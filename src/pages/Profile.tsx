import { useState, type ReactNode } from "react";
import { useParams } from "react-router-dom";
import { FileText, Heart } from "lucide-react";
import { useUserProfile, useUserPosts, useUserLikes } from "@/hooks/useUsers";
import { useAuthStore } from "@/store/authStore";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileCardMini } from "@/components/profile/ProfileCardMini";
import { WhoToFollow } from "@/components/profile/WhoToFollow";
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

  const activeList = tab === "posts" ? posts : likes;
  const activeLoading = tab === "posts" ? postsLoading : likesLoading;

  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-4 py-6 md:grid-cols-[240px_1fr_260px]">
      <div className="md:sticky md:top-20 md:h-fit">
        {currentUser && <ProfileCardMini user={currentUser} />}
      </div>

      <div className="flex flex-col gap-4">
        <ProfileHeader profile={profile} />

        <div className="flex gap-1 border-b border-border">
          <TabButton
            active={tab === "posts"}
            onClick={() => setTab("posts")}
            icon={FileText}
          >
            Posts
          </TabButton>
          <TabButton
            active={tab === "likes"}
            onClick={() => setTab("likes")}
            icon={Heart}
          >
            Likes
          </TabButton>
        </div>

        {activeLoading && (
          <>
            <PostSkeleton />
            <PostSkeleton />
          </>
        )}

        {!activeLoading && activeList?.length === 0 && (
          <EmptyState
            icon={tab === "posts" ? FileText : Heart}
            title={
              tab === "posts" ? "No Posts to Show" : "No Liked Posts to Show"
            }
          />
        )}

        {activeList?.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      <div className="md:sticky md:top-20 md:h-fit">
        <WhoToFollow />
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon: Icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof FileText;
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 border-b-2 px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "border-foreground text-foreground"
          : "border-transparent text-muted-foreground hover:text-foreground",
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {children}
    </button>
  );
}

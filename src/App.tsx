import { useFeed } from "@/hooks/usePosts";
import { useAuthStore } from "@/store/authStore";
import { PostCard } from "@/components/post/PostCard";
import { PostComposer } from "@/components/post/PostComposer";
import { PostSkeleton } from "@/components/post/PostSkeleton";
import { ProfileCardMini } from "@/components/profile/ProfileCardMini";
import { WhoToFollow } from "@/components/profile/WhoToFollow";
import { EmptyState, Skeleton } from "@/components/ui/Feedback";
import { Button } from "@/components/ui/Button";
import { LinkButton } from "@/components/ui/LinkButton";
import { Rss } from "lucide-react";

function ProfileCardMiniSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-surface p-5 text-center shadow-card">
      <Skeleton className="mx-auto h-16 w-16 rounded-full" />
      <Skeleton className="mx-auto mt-3 h-3 w-24" />
      <Skeleton className="mx-auto mt-2 h-2.5 w-16" />
      <div className="mt-4 grid grid-cols-2 gap-2 border-y border-border py-3">
        <Skeleton className="mx-auto h-3 w-10" />
        <Skeleton className="mx-auto h-3 w-10" />
      </div>
    </div>
  );
}

function HomeLoadingState() {
  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 py-6 md:grid-cols-[296px_1fr_296px]">
      <div className="hidden md:sticky md:top-24 md:block md:h-fit">
        <ProfileCardMiniSkeleton />
      </div>
      <div className="flex flex-col gap-4">
        <PostSkeleton />
        <PostSkeleton />
        <PostSkeleton />
      </div>
      <div className="hidden md:block" />
    </div>
  );
}

function LoggedOutHome() {
  const { data: posts, isLoading } = useFeed();

  return (
    <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 px-4 py-6 md:grid-cols-[280px_1fr]">
      <div className="hidden rounded-xl border border-border bg-surface p-6 text-center shadow-card md:sticky md:top-24 md:block md:h-fit">
        <h2 className="text-lg font-semibold text-foreground">Welcome Back!</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Login to access your profile and connect with others.
        </p>
        <div className="mt-5 flex flex-col gap-2">
          <LinkButton to="/login" variant="secondary" className="w-full">
            Log In
          </LinkButton>
          <LinkButton to="/register" variant="outline" className="w-full">
            Sign Up
          </LinkButton>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {isLoading && <PostSkeleton />}
        {isLoading && <PostSkeleton />}
        {!isLoading && posts?.length === 0 && (
          <EmptyState
            icon={Rss}
            title="No posts yet"
            description="Be the first to share something."
          />
        )}
        {posts?.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

function LoggedInHome() {
  const user = useAuthStore((s) => s.user);
  const { data: posts, isLoading, isError, error, refetch } = useFeed();

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 py-6 md:grid-cols-[296px_1fr_296px]">
      <div className="hidden md:sticky md:top-24 md:block md:h-fit">
        {user && <ProfileCardMini user={user} />}
      </div>

      <div className="flex flex-col gap-4">
        <PostComposer />

        {isLoading && (
          <>
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </>
        )}

        {isError && (
          <div className="rounded-xl border border-danger/30 bg-danger/5 p-4 text-center">
            <p className="text-sm text-danger">
              {(error as { message?: string })?.message ?? "Failed to load feed."}
            </p>
            <Button variant="tertiary" size="sm" className="mt-2" onClick={() => refetch()}>
              Try again
            </Button>
          </div>
        )}

        {!isLoading && !isError && posts?.length === 0 && (
          <EmptyState
            icon={Rss}
            title="Your feed is empty"
            description="Follow people or share your first post to get started."
          />
        )}

        {posts?.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      <div className="hidden md:sticky md:top-24 md:block md:h-fit">
        <WhoToFollow />
      </div>
    </div>
  );
}

export default function App() {
  const { user, isInitialized } = useAuthStore();
  if (!isInitialized) return <HomeLoadingState />;
  return user ? <LoggedInHome /> : <LoggedOutHome />;
}

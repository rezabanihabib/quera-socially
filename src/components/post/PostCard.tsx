import toast from "react-hot-toast";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, MessageCircle, Trash2 } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { CommentSection } from "@/components/post/CommentSection";
import { DeletePostModal } from "@/components/post/DeletePostModal";
import { useDeletePost, useToggleLike } from "@/hooks/usePosts";
import { useAuthStore } from "@/store/authStore";
import { cn, displayHandle, isPostLikedByUser, timeAgo } from "@/lib/utils";
import type { Post } from "@/types";

export function PostCard({ post }: { post: Post }) {
  const user = useAuthStore((s) => s.user);
  const isOwner = Boolean(user?.id) && user?.id === post.author?.id;

  const isLiked = post.likedByUserIds
    ? isPostLikedByUser(post.likedByUserIds, user?.id)
    : post.isLikedByMe;

  const [showComments, setShowComments] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const toggleLike = useToggleLike();
  const deletePost = useDeletePost();

  return (
    <article className="rounded-xl border border-border bg-surface p-4 shadow-card transition-colors">
      <div className="flex items-start justify-between">
        <Link
          to={`/profile/${post.author.username}`}
          className="flex items-center gap-3"
        >
          <Avatar src={post.author.avatar} name={post.author.name} size="md" />
          <div className="flex flex-wrap items-baseline gap-x-1.5">
            <span className="text-sm font-semibold text-foreground">
              {post.author.name}
            </span>
            <span className="text-xs text-muted-foreground">
              @{displayHandle(post.author)}
            </span>
            <span className="text-xs text-muted-foreground">
              {timeAgo(post.createdAt)}
            </span>
          </div>
        </Link>

        {isOwner && (
          <button
            onClick={() => setConfirmDelete(true)}
            aria-label="Delete post"
            className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-danger/10 hover:text-danger"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      {post.content && (
        <p className="mt-3 whitespace-pre-wrap text-sm text-foreground">
          {post.content}
        </p>
      )}

      {post.image && (
        <img
          src={post.image}
          alt="post attachment"
          className="mt-3 max-h-96 w-full rounded-lg object-cover"
        />
      )}

      <div className="mt-3 flex items-center gap-4">
        <button
          onClick={() => {
            if (!user) {
              toast.error("Sign in to like posts.");
              return;
            }
            if (isOwner) {
              toast.error("You can't like your own post.");
              return;
            }
            toggleLike.mutate(post);
          }}
          className={cn(
            "flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium transition-colors",
            isLiked
              ? "text-like"
              : "text-muted-foreground hover:bg-surface-hover hover:text-foreground",
          )}
        >
          <Heart className={cn("h-4 w-4", isLiked && "fill-like")} />
          {post.likesCount}
        </button>

        <button
          onClick={() => setShowComments((v) => !v)}
          className={cn(
            "flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium transition-colors",
            showComments && "bg-accent/15",
            showComments
              ? "text-accent"
              : "text-muted-foreground hover:bg-surface-hover hover:text-foreground",
          )}
        >
          <MessageCircle
            className={cn("h-4 w-4", showComments && "fill-accent")}
          />
          {post.commentsCount}
        </button>
      </div>

      {showComments && (
        <CommentSection postId={post.id} comments={post.comments} />
      )}

      <DeletePostModal
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        isDeleting={deletePost.isPending}
        onConfirm={() =>
          deletePost.mutate(post.id, {
            onSuccess: () => setConfirmDelete(false),
          })
        }
      />
    </article>
  );
}

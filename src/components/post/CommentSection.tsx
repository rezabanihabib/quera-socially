import { useState } from "react";
import { Check, Pencil, Send, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import { Avatar } from "@/components/ui/Avatar";
import { TextArea } from "@/components/ui/TextArea";
import { Button } from "@/components/ui/Button";
import { LinkButton } from "@/components/ui/LinkButton";
import {
  useAddComment,
  useDeleteComment,
  useUpdateComment,
} from "@/hooks/usePosts";
import { useAuthStore } from "@/store/authStore";
import { displayHandle, timeAgo } from "@/lib/utils";
import type { Comment } from "@/types";

const MIN_COMMENT_LENGTH = 5;

interface CommentSectionProps {
  postId: string;
  comments?: Comment[];
}

function CommentRow({ postId, comment }: { postId: string; comment: Comment }) {
  const user = useAuthStore((s) => s.user);

  const userEmail = user?.email?.trim().toLowerCase();
  const commentAuthorEmail = comment.author?.email?.trim().toLowerCase();
  const isOwner =
    Boolean(
      userEmail && commentAuthorEmail && userEmail === commentAuthorEmail,
    ) ||
    Boolean(user?.id && comment.author?.id && user.id === comment.author.id);

  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(comment.content);

  const updateComment = useUpdateComment();
  const deleteComment = useDeleteComment();

  const trimmedLength = draft.trim().length;
  const isTooShort = trimmedLength > 0 && trimmedLength < MIN_COMMENT_LENGTH;

  const handleSave = () => {
    const trimmed = draft.trim();
    if (trimmed.length < MIN_COMMENT_LENGTH) {
      toast.error(`Comments need at least ${MIN_COMMENT_LENGTH} characters.`);
      return;
    }
    updateComment.mutate(
      { postId, commentId: comment.id, content: trimmed },
      { onSuccess: () => setIsEditing(false) },
    );
  };

  const handleCancel = () => {
    setDraft(comment.content);
    setIsEditing(false);
  };

  return (
    <div className="mb-3 flex gap-2.5">
      <Avatar
        src={comment.author.avatar}
        name={comment.author.name}
        size="sm"
      />
      <div className="flex-1 rounded-lg bg-muted px-3 py-2">
        <div className="flex items-baseline justify-between gap-2">
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span className="text-xs font-semibold text-foreground">
              {comment.author.name}
            </span>
            <span className="text-[11px] text-muted-foreground">
              @{displayHandle(comment.author)}
            </span>
            <span className="text-[11px] text-muted-foreground">
              · {timeAgo(comment.createdAt)}
            </span>
          </div>

          {isOwner && !isEditing && (
            <div className="flex shrink-0 items-center gap-0.5">
              <button
                onClick={() => setIsEditing(true)}
                aria-label="Edit comment"
                className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground"
              >
                <Pencil className="h-3 w-3" />
              </button>
              <button
                onClick={() =>
                  deleteComment.mutate({ postId, commentId: comment.id })
                }
                disabled={deleteComment.isPending}
                aria-label="Delete comment"
                className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-danger/10 hover:text-danger disabled:opacity-50"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="mt-1.5">
            <TextArea
              rows={2}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              error={
                isTooShort
                  ? `At least ${MIN_COMMENT_LENGTH} characters needed`
                  : undefined
              }
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSave();
                }
                if (e.key === "Escape") handleCancel();
              }}
            />
            <div className="mt-1.5 flex justify-end gap-2">
              <Button
                variant="tertiary"
                size="sm"
                onClick={handleCancel}
                disabled={updateComment.isPending}
              >
                <X className="h-3.5 w-3.5" />
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSave}
                isLoading={updateComment.isPending}
                disabled={trimmedLength < MIN_COMMENT_LENGTH}
              >
                <Check className="h-3.5 w-3.5" />
                Save
              </Button>
            </div>
          </div>
        ) : (
          <p className="mt-0.5 text-sm text-foreground">{comment.content}</p>
        )}
      </div>
    </div>
  );
}

export function CommentSection({ postId, comments = [] }: CommentSectionProps) {
  const user = useAuthStore((s) => s.user);
  const [content, setContent] = useState("");
  const addComment = useAddComment();

  const trimmedLength = content.trim().length;
  const isTooShort = trimmedLength > 0 && trimmedLength < MIN_COMMENT_LENGTH;

  const handleSubmit = () => {
    const trimmed = content.trim();
    if (trimmed.length < MIN_COMMENT_LENGTH) {
      toast.error(`Comments need at least ${MIN_COMMENT_LENGTH} characters.`);
      return;
    }
    addComment.mutate(
      { postId, content: trimmed },
      {
        onSuccess: () => setContent(""),
      },
    );
  };

  return (
    <div className="mt-3 border-t border-border pt-3">
      {comments.map((comment) => (
        <CommentRow key={comment.id} postId={postId} comment={comment} />
      ))}

      {user ? (
        <div className="flex gap-2.5">
          <Avatar src={user.avatar} name={user.name} size="sm" />
          <div className="flex-1">
            <TextArea
              rows={2}
              placeholder="Write a comment..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              error={
                isTooShort
                  ? `At least ${MIN_COMMENT_LENGTH} characters needed`
                  : undefined
              }
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
            />
            <div className="mt-2 flex justify-end">
              <Button
                size="sm"
                variant="primary"
                onClick={handleSubmit}
                isLoading={addComment.isPending}
                disabled={trimmedLength < MIN_COMMENT_LENGTH}
              >
                <Send className="h-3.5 w-3.5" />
                Comment
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-3 rounded-lg bg-muted px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-foreground">
              You are signed out
            </p>
            <p className="text-xs text-muted-foreground">
              Sign in to write a comment
            </p>
          </div>
          <LinkButton
            to="/login"
            variant="primary"
            size="sm"
            className="shrink-0"
          >
            Sign in
          </LinkButton>
        </div>
      )}
    </div>
  );
}

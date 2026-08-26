import { useState } from "react";
import { Send } from "lucide-react";
import toast from "react-hot-toast";
import { Avatar } from "@/components/ui/Avatar";
import { TextArea } from "@/components/ui/TextArea";
import { Button } from "@/components/ui/Button";
import { LinkButton } from "@/components/ui/LinkButton";
import { useAddComment } from "@/hooks/usePosts";
import { useAuthStore } from "@/store/authStore";
import { displayHandle, timeAgo } from "@/lib/utils";
import type { Comment } from "@/types";

const MIN_COMMENT_LENGTH = 5;

interface CommentSectionProps {
  postId: string;
  comments?: Comment[];
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
      }
    );
  };

  return (
    <div className="mt-3 border-t border-border pt-3">
      {comments.map((comment) => (
        <div key={comment.id} className="mb-3 flex gap-2.5">
          <Avatar src={comment.author.avatar} name={comment.author.name} size="sm" />
          <div className="flex-1 rounded-lg bg-muted px-3 py-2">
            <div className="flex items-baseline gap-2">
              <span className="text-xs font-semibold text-foreground">{comment.author.name}</span>
              <span className="text-[11px] text-muted-foreground">@{displayHandle(comment.author)}</span>
              <span className="text-[11px] text-muted-foreground">· {timeAgo(comment.createdAt)}</span>
            </div>
            <p className="mt-0.5 text-sm text-foreground">{comment.content}</p>
          </div>
        </div>
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
              error={isTooShort ? `At least ${MIN_COMMENT_LENGTH} characters needed` : undefined}
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
                variant="secondary"
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
            <p className="text-sm font-semibold text-foreground">You are signed out</p>
            <p className="text-xs text-muted-foreground">Sign in to write a comment</p>
          </div>
          <LinkButton to="/login" variant="primary" size="sm" className="flex-shrink-0">
            Sign in
          </LinkButton>
        </div>
      )}
    </div>
  );
}

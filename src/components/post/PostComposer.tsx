import { useState } from "react";
import { Send } from "lucide-react";
import toast from "react-hot-toast";
import { Avatar } from "@/components/ui/Avatar";
import { TextArea } from "@/components/ui/TextArea";
import { Button } from "@/components/ui/Button";
import { useCreatePost } from "@/hooks/usePosts";
import { useAuthStore } from "@/store/authStore";

const MIN_POST_LENGTH = 5;

export function PostComposer() {
  const user = useAuthStore((s) => s.user);
  const [content, setContent] = useState("");
  const createPost = useCreatePost();

  const trimmedLength = content.trim().length;
  const isTooShort = trimmedLength > 0 && trimmedLength < MIN_POST_LENGTH;

  const handleSubmit = () => {
    const trimmed = content.trim();

    if (trimmed.length < MIN_POST_LENGTH) {
      toast.error(`Posts need at least ${MIN_POST_LENGTH} characters.`);
      return;
    }

    const payload = {
      content: trimmed,
    };

    createPost.mutate(payload, {
      onSuccess: () => {
        setContent("");
      },
    });
  };

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="flex gap-3">
        <Avatar src={user?.avatar} name={user?.name} size="md" />

        <div className="flex-1">
          <TextArea
            rows={3}
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            error={isTooShort ? `At least ${MIN_POST_LENGTH} characters needed` : undefined}
          />
        </div>
      </div>

      <div className="mt-3 flex justify-end">
        <Button
          onClick={handleSubmit}
          isLoading={createPost.isPending}
          disabled={trimmedLength < MIN_POST_LENGTH || createPost.isPending}
          variant="secondary"
        >
          <Send className="h-4 w-4" />
          Post
        </Button>
      </div>
    </div>
  );
}

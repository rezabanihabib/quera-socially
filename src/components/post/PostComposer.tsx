import { useRef, useState } from "react";
import { ImagePlus, Send, X } from "lucide-react";
import toast from "react-hot-toast";
import { Avatar } from "@/components/ui/Avatar";
import { TextArea } from "@/components/ui/TextArea";
import { Button } from "@/components/ui/Button";
import { useCreatePost } from "@/hooks/usePosts";
import { useUploadImage } from "@/hooks/useUpload";
import { useAuthStore } from "@/store/authStore";

const MIN_POST_LENGTH = 5;

export function PostComposer() {
  const user = useAuthStore((s) => s.user);
  const [content, setContent] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createPost = useCreatePost();
  const uploadImage = useUploadImage();

  const trimmedLength = content.trim().length;
  const isTooShort = trimmedLength > 0 && trimmedLength < MIN_POST_LENGTH;
  const isBusy = createPost.isPending || uploadImage.isPending;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);

    uploadImage.mutate(file, {
      onSuccess: (url) => setImage(url),
      onError: () => {
        setPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      },
    });
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = () => {
    const trimmed = content.trim();

    if (trimmed.length < MIN_POST_LENGTH) {
      toast.error(`Posts need at least ${MIN_POST_LENGTH} characters.`);
      return;
    }

    const payload: { content: string; image?: string } = { content: trimmed };
    if (image) payload.image = image;

    createPost.mutate(payload, {
      onSuccess: () => {
        setContent("");
        handleRemoveImage();
      },
    });
  };

  return (
    <div className="rounded-xl border border-border bg-surface p-4 shadow-card">
      <div className="flex items-center gap-3">
        <Avatar src={user?.avatar} name={user?.name} size="md" />

        <div className="flex-1">
          <TextArea
            variant="plain"
            rows={3}
            placeholder="Whats on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            error={isTooShort ? `At least ${MIN_POST_LENGTH} characters needed` : undefined}
          />
        </div>
      </div>

      {previewUrl && (
        <div className="relative mt-3 ml-[52px]">
          <img
            src={previewUrl}
            alt="Post attachment preview"
            className="max-h-64 w-full rounded-lg object-cover"
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            disabled={isBusy}
            aria-label="Remove image"
            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80 disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="my-3 border-t border-border" />

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isBusy}
          aria-label="Add image"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground disabled:opacity-50"
        >
          <ImagePlus className="h-4 w-4" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        <Button
          onClick={handleSubmit}
          isLoading={createPost.isPending}
          disabled={trimmedLength < MIN_POST_LENGTH || isBusy}
          variant="primary"
        >
          <Send className="h-4 w-4" />
          {uploadImage.isPending ? "Uploading…" : "Post"}
        </Button>
      </div>
    </div>
  );
}

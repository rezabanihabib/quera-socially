import { useRef, useState } from "react";
import { ImageOff, ImagePlus, X } from "lucide-react";
import toast from "react-hot-toast";
import { Modal } from "@/components/ui/Modal";
import { TextArea } from "@/components/ui/TextArea";
import { Button } from "@/components/ui/Button";
import { useUpdatePost } from "@/hooks/usePosts";
import { useUploadImage } from "@/hooks/useUpload";
import type { Post } from "@/types";

const MIN_POST_LENGTH = 5;

interface EditPostModalProps {
  open: boolean;
  onClose: () => void;
  post: Post;
}

export function EditPostModal({ open, onClose, post }: EditPostModalProps) {
  const [content, setContent] = useState(post.content ?? "");

  const [previewUrl, setPreviewUrl] = useState<string | null>(
    post.image ?? null,
  );
  const [newImageUuid, setNewImageUuid] = useState<string | null>(null);
  const [imageFailed, setImageFailed] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updatePost = useUpdatePost();
  const uploadImage = useUploadImage();

  const trimmedLength = content.trim().length;
  const isTooShort = trimmedLength > 0 && trimmedLength < MIN_POST_LENGTH;
  const isBusy = updatePost.isPending || uploadImage.isPending;

  const handleClose = () => {
    if (isBusy) return;
    onClose();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);
    setImageFailed(false);

    uploadImage.mutate(file, {
      onSuccess: (uuid) => setNewImageUuid(uuid),
      onError: () => setPreviewUrl(post.image ?? null),
    });
  };

  const handleRemoveImage = () => {
    setNewImageUuid(null);
    setPreviewUrl(null);
    setImageFailed(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = () => {
    const trimmed = content.trim();
    if (trimmed.length < MIN_POST_LENGTH) {
      toast.error(`Posts need at least ${MIN_POST_LENGTH} characters.`);
      return;
    }
    updatePost.mutate(
      {
        postId: post.id,
        content: trimmed,

        ...(newImageUuid ? { image: newImageUuid } : {}),
      },
      { onSuccess: () => onClose() },
    );
  };

  return (
    <Modal open={open} onClose={handleClose} title="Edit Post">
      <TextArea
        rows={4}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        error={
          isTooShort
            ? `At least ${MIN_POST_LENGTH} characters needed`
            : undefined
        }
      />

      <div className="mt-3">
        {previewUrl ? (
          <div className="relative">
            {imageFailed ? (
              <div className="flex h-40 w-full flex-col items-center justify-center gap-1.5 rounded-lg bg-muted text-muted-foreground">
                <ImageOff className="h-6 w-6" />
                <span className="text-xs">Image unavailable</span>
              </div>
            ) : (
              <img
                src={previewUrl}
                alt="Post attachment"
                className="max-h-64 w-full rounded-lg object-cover"
                onError={() => setImageFailed(true)}
              />
            )}
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
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isBusy}
            className="flex items-center gap-1.5 rounded-lg border border-dashed border-border px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground disabled:opacity-50"
          >
            <ImagePlus className="h-4 w-4" />
            Add image
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <Button variant="tertiary" onClick={handleClose} disabled={isBusy}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          isLoading={updatePost.isPending}
          disabled={uploadImage.isPending || trimmedLength < MIN_POST_LENGTH}
        >
          {uploadImage.isPending ? "Uploading…" : "Save"}
        </Button>
      </div>
    </Modal>
  );
}

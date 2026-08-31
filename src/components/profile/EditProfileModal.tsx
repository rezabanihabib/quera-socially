import { useRef, useState } from "react";
import { Camera } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/TextArea";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { useUpdateProfile } from "@/hooks/useUsers";
import { useUploadImage } from "@/hooks/useUpload";
import type { User } from "@/types";

interface EditProfileModalProps {
  open: boolean;
  onClose: () => void;
  user: User;
}

export function EditProfileModal({
  open,
  onClose,
  user,
}: EditProfileModalProps) {
  const [name, setName] = useState(user.name ?? "");
  const [bio, setBio] = useState(user.bio ?? "");
  const [location, setLocation] = useState(user.location ?? "");
  const [website, setWebsite] = useState(user.website ?? "");

  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    user.avatar ?? null,
  );
  const [newAvatarUuid, setNewAvatarUuid] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateProfile = useUpdateProfile();
  const uploadImage = useUploadImage();
  const isBusy = updateProfile.isPending || uploadImage.isPending;

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localPreview = URL.createObjectURL(file);
    setAvatarPreview(localPreview);

    uploadImage.mutate(file, {
      onSuccess: (uuid) => setNewAvatarUuid(uuid),
      onError: () => setAvatarPreview(user.avatar ?? null),
    });
  };

  const handleSave = () => {
    updateProfile.mutate(
      {
        userId: user.id,
        payload: {
          name,
          bio,
          location,
          website,

          ...(newAvatarUuid ? { image: newAvatarUuid } : {}),
        },
      },
      { onSuccess: () => onClose() },
    );
  };

  return (
    <Modal open={open} onClose={onClose} title="Edit Profile">
      <div className="flex flex-col gap-4">
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isBusy}
            aria-label="Change profile picture"
            className="group relative disabled:opacity-50"
          >
            <Avatar src={avatarPreview} name={user.name} size="xl" />
            <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/0 text-transparent transition-colors group-hover:bg-black/40 group-hover:text-white">
              <Camera className="h-5 w-5" />
            </span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>
        {uploadImage.isPending && (
          <p className="text-center text-xs text-muted-foreground">
            Uploading photo…
          </p>
        )}

        <Input
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextArea
          label="Bio"
          rows={3}
          placeholder="Enter your Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
        <Input
          label="Location"
          placeholder="Where you are at"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <Input
          label="Website"
          placeholder="Your personal website"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <Button variant="tertiary" onClick={onClose} disabled={isBusy}>
          Cancel
        </Button>
        <Button
          variant="secondary"
          onClick={handleSave}
          isLoading={updateProfile.isPending}
          disabled={uploadImage.isPending}
        >
          {uploadImage.isPending ? "Uploading…" : "Save Changes"}
        </Button>
      </div>
    </Modal>
  );
}

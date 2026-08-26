import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/TextArea";
import { Button } from "@/components/ui/Button";
import { useUpdateProfile } from "@/hooks/useUsers";
import type { User } from "@/types";

interface EditProfileModalProps {
  open: boolean;
  onClose: () => void;
  user: User;
}

export function EditProfileModal({ open, onClose, user }: EditProfileModalProps) {
  const [name, setName] = useState(user.name ?? "");
  const [bio, setBio] = useState(user.bio ?? "");
  const [location, setLocation] = useState(user.location ?? "");
  const [website, setWebsite] = useState(user.website ?? "");

  const updateProfile = useUpdateProfile();

  const handleSave = () => {
    updateProfile.mutate(
      { userId: user.id, payload: { name, bio, location, website } },
      { onSuccess: () => onClose() }
    );
  };

  return (
    <Modal open={open} onClose={onClose} title="Edit Profile">
      <div className="flex flex-col gap-4">
        <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
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
        <Button variant="tertiary" onClick={onClose} disabled={updateProfile.isPending}>
          Cancel
        </Button>
        <Button variant="secondary" onClick={handleSave} isLoading={updateProfile.isPending}>
          Save Changes
        </Button>
      </div>
    </Modal>
  );
}

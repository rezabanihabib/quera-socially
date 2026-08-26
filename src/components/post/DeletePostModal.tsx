import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

interface DeletePostModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export function DeletePostModal({ open, onClose, onConfirm, isDeleting }: DeletePostModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="Delete Post">
      <p className="mb-6 text-sm text-muted-foreground">This Action Can not be undone</p>
      <div className="flex justify-end gap-3">
        <Button variant="tertiary" onClick={onClose} disabled={isDeleting}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm} isLoading={isDeleting}>
          Delete
        </Button>
      </div>
    </Modal>
  );
}

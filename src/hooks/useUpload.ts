import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { uploadApi } from "@/api/uploadApi";
import type { ApiError } from "@/types";

export function useUploadImage() {
  return useMutation({
    mutationFn: (file: File) => uploadApi.uploadImage(file),
    onError: (error: ApiError) =>
      toast.error(error.message || "Could not upload image."),
  });
}

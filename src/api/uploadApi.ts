import { api } from "@/api/axiosInstance";

export const uploadApi = {
  // --------------------------------------------------
  // POST /api/upload  (multipart/form-data, field "file")
  // --------------------------------------------------

  uploadImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await api.post("/api/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    const url =
      data?.file ??
      data?.data?.file ??
      data?.data?.url ??
      data?.url ??
      data?.data?.image ??
      data?.image ??
      data?.data?.id ??
      data?.id ??
      (typeof data?.data === "string" ? data.data : undefined) ??
      (typeof data === "string" ? data : undefined);

    if (typeof url !== "string" || !url) {
      console.error("Unexpected upload API response:", data);
      throw new Error("Couldn't upload the image. Please try again.");
    }

    return url;
  },
};

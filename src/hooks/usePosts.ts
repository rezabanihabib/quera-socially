import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { postsApi } from "@/api/postsApi";
import { useAuthStore } from "@/store/authStore";
import type { ApiError, Post } from "@/types";

export function useFeed() {
  return useQuery({
    queryKey: ["posts", "feed"],
    queryFn: postsApi.getFeed,
    staleTime: 30 * 1000,
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { content: string; image?: string }) =>
      postsApi.createPost(payload),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["posts", "feed"],
      });

      toast.success("Posted!");
    },

    onError: (error: ApiError) =>
      toast.error(error.message || "Could not create post."),
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) => postsApi.deletePost(postId),
    onSuccess: (_data, postId) => {
      queryClient.setQueriesData<Post[]>({ queryKey: ["posts"] }, (old) =>
        Array.isArray(old) ? old.filter((p) => p.id !== postId) : old,
      );
      queryClient.setQueriesData<Post[]>({ queryKey: ["users"] }, (old) =>
        Array.isArray(old) ? old.filter((p) => p.id !== postId) : old,
      );
      toast.success("Post deleted");
    },
    onError: (error: ApiError) =>
      toast.error(error.message || "Could not delete post."),
  });
}

function patchPostEverywhere(
  queryClient: ReturnType<typeof useQueryClient>,
  postId: string,
  patch: Partial<Post>,
) {
  const updater = (old?: Post[]) =>
    Array.isArray(old)
      ? old.map((p) => (p.id === postId ? { ...p, ...patch } : p))
      : old;
  queryClient.setQueriesData<Post[]>({ queryKey: ["posts"] }, updater);
  queryClient.setQueriesData<Post[]>({ queryKey: ["users"] }, updater);
}

export function useToggleLike() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (post: Post) => postsApi.toggleLike(post.id),
    onMutate: async (post: Post) => {
      const currentUserId = useAuthStore.getState().user?.id;
      if (!currentUserId) {
        throw {
          message: "Sign in to like posts.",
          status: 401,
        } satisfies ApiError;
      }
      if (post.author?.id && post.author.id === currentUserId) {
        throw {
          message: "You can't like your own post.",
          status: 400,
        } satisfies ApiError;
      }
      const currentlyLiked = currentUserId
        ? (post.likedByUserIds ?? []).includes(currentUserId)
        : post.isLikedByMe;
      const nextLiked = !currentlyLiked;
      const nextCount = post.likesCount + (nextLiked ? 1 : -1);
      const nextLikedByUserIds = currentUserId
        ? nextLiked
          ? [...new Set([...(post.likedByUserIds ?? []), currentUserId])]
          : (post.likedByUserIds ?? []).filter((id) => id !== currentUserId)
        : post.likedByUserIds;

      patchPostEverywhere(queryClient, post.id, {
        isLikedByMe: nextLiked,
        likesCount: Math.max(0, nextCount),
        likedByUserIds: nextLikedByUserIds,
      });
      return { post };
    },
    onError: (error: ApiError, post) => {
      patchPostEverywhere(queryClient, post.id, {
        isLikedByMe: post.isLikedByMe,
        likesCount: post.likesCount,
        likedByUserIds: post.likedByUserIds,
      });
      const hasSpecificMessage =
        error.message &&
        !error.message
          .toLowerCase()
          .startsWith("request failed with status code");
      if (error.status === 401 && !hasSpecificMessage) {
        toast.error("Your session expired — please log in again.");
      } else {
        toast.error(error.message || "Could not update like.");
      }
    },
    onSuccess: (result, post) => {
      const patch: Partial<Post> = {};
      if (result.isLikedByMe !== undefined)
        patch.isLikedByMe = result.isLikedByMe;
      if (result.likesCount !== undefined) patch.likesCount = result.likesCount;

      if (Object.keys(patch).length > 0) {
        patchPostEverywhere(queryClient, post.id, patch);
      }
    },
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      postId,
      content,
      image,
    }: {
      postId: string;
      content?: string;
      image?: string | null;
    }) => postsApi.updatePost(postId, { content, image }),
    onSuccess: (updatedPost) => {
      patchPostEverywhere(queryClient, updatedPost.id, {
        content: updatedPost.content,
        image: updatedPost.image,
      });
      toast.success("Post updated");
    },
    onError: (error: ApiError) =>
      toast.error(error.message || "Could not update post."),
  });
}

export function useAddComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, content }: { postId: string; content: string }) =>
      postsApi.addComment(postId, content),
    onSuccess: (comment, { postId }) => {
      const updater = (old?: Post[]) =>
        Array.isArray(old)
          ? old.map((p) =>
              p.id === postId
                ? {
                    ...p,
                    commentsCount: p.commentsCount + 1,
                    comments: [...(p.comments ?? []), comment],
                  }
                : p,
            )
          : old;
      queryClient.setQueriesData<Post[]>({ queryKey: ["posts"] }, updater);
      queryClient.setQueriesData<Post[]>({ queryKey: ["users"] }, updater);

      if (comment.id.startsWith("temp-")) {
        queryClient.invalidateQueries({ queryKey: ["posts"] });
        queryClient.invalidateQueries({ queryKey: ["users"] });
      }
    },
    onError: (error: ApiError) =>
      toast.error(error.message || "Could not add comment."),
  });
}

export function useUpdateComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      postId,
      commentId,
      content,
    }: {
      postId: string;
      commentId: string;
      content: string;
    }) => postsApi.updateComment(postId, commentId, content),
    onSuccess: (updatedComment, { postId, commentId }) => {
      const updater = (old?: Post[]) =>
        Array.isArray(old)
          ? old.map((p) =>
              p.id === postId
                ? {
                    ...p,
                    comments: (p.comments ?? []).map((c) =>
                      c.id === commentId
                        ? { ...c, content: updatedComment.content }
                        : c,
                    ),
                  }
                : p,
            )
          : old;
      queryClient.setQueriesData<Post[]>({ queryKey: ["posts"] }, updater);
      queryClient.setQueriesData<Post[]>({ queryKey: ["users"] }, updater);
      toast.success("Comment updated");
    },
    onError: (error: ApiError) =>
      toast.error(error.message || "Could not update comment."),
  });
}

export function useDeleteComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      postId,
      commentId,
    }: {
      postId: string;
      commentId: string;
    }) => postsApi.deleteComment(postId, commentId),
    onSuccess: (_data, { postId, commentId }) => {
      const updater = (old?: Post[]) =>
        Array.isArray(old)
          ? old.map((p) =>
              p.id === postId
                ? {
                    ...p,
                    commentsCount: Math.max(0, p.commentsCount - 1),
                    comments: (p.comments ?? []).filter(
                      (c) => c.id !== commentId,
                    ),
                  }
                : p,
            )
          : old;
      queryClient.setQueriesData<Post[]>({ queryKey: ["posts"] }, updater);
      queryClient.setQueriesData<Post[]>({ queryKey: ["users"] }, updater);
      toast.success("Comment deleted");
    },
    onError: (error: ApiError) =>
      toast.error(error.message || "Could not delete comment."),
  });
}

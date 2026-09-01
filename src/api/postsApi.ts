import { api } from "@/api/axiosInstance";
import { useAuthStore } from "@/store/authStore";
import {
  generateUsernameFromEmail,
  isPostLikedByUser,
  resolveImageUrl,
} from "@/lib/utils";
import type { Comment, Post } from "@/types";

type RawAuthor = {
  id?: string;
  username?: string;
  name?: string;
  email?: string;
  avatar?: string | null;
  image?: string | null;
};

type RawComment = {
  id?: string;
  content?: string;
  createdAt?: string;
  author?: RawAuthor;
  authorId?: string;
  userId?: string;
  postId?: string;
};

type RawPost = {
  id?: string;
  authorId?: string;
  content?: string;
  image?: string | null;
  createdAt?: string;
  updatedAt?: string;

  author?: RawAuthor;

  likes?: Array<{
    userId?: string;
  }>;

  comments?: RawComment[];

  _count?: {
    likes?: number;
    comments?: number;
  };

  likesCount?: number;
  commentsCount?: number;
  isLikedByMe?: boolean;
};

function normalizeAuthor(
  author: RawAuthor | undefined,
  fallbackId?: string,
): Pick<Post["author"], "id" | "username" | "name" | "avatar"> & {
  email?: string;
} {
  const id =
    author?.id ??
    (author as any)?._id ??
    (author as any)?.userId ??
    (author as any)?.uid ??
    fallbackId ??
    "";

  return {
    id,
    username:
      author?.username ??
      generateUsernameFromEmail(author?.email) ??
      id ??
      fallbackId ??
      "user",
    name: author?.name ?? author?.username ?? "User",
    avatar: resolveImageUrl(author?.avatar ?? author?.image),
    email: author?.email,
  };
}

function normalizeComment(comment: RawComment): Comment {
  return {
    id: comment.id ?? "",
    content: comment.content ?? "",
    createdAt: comment.createdAt ?? new Date().toISOString(),
    
    author: normalizeAuthor(comment.author, comment.authorId ?? comment.userId),
  };
}

export function normalizePost(post: RawPost): Post {
  const currentUserId = useAuthStore.getState().user?.id;

  const likes = Array.isArray(post.likes) ? post.likes : [];
  const likedByUserIds = likes
    .map((like) => like.userId)
    .filter((id): id is string => Boolean(id));

  const isLikedByMe =
    post.isLikedByMe ?? isPostLikedByUser(likedByUserIds, currentUserId);

  const comments = Array.isArray(post.comments)
    ? post.comments.map(normalizeComment)
    : [];

  return {
    id: post.id ?? "",
    content: post.content ?? "",
    image: resolveImageUrl(post.image),

    author: normalizeAuthor(post.author, post.authorId),

    likesCount: post.likesCount ?? post._count?.likes ?? likes.length,

    commentsCount:
      post.commentsCount ?? post._count?.comments ?? comments.length,

    isLikedByMe,

    likedByUserIds,

    comments,

    createdAt: post.createdAt ?? post.updatedAt ?? new Date().toISOString(),
  };
}

export const postsApi = {
  // --------------------------------------------------
  // GET /api/posts
  // --------------------------------------------------

  getFeed: async (): Promise<Post[]> => {
    const { data } = await api.get("/api/posts");

    let posts: RawPost[] = [];

    if (Array.isArray(data)) {
      posts = data;
    } else if (Array.isArray(data?.data)) {
      posts = data.data;
    } else if (Array.isArray(data?.posts)) {
      posts = data.posts;
    } else if (Array.isArray(data?.data?.posts)) {
      posts = data.data.posts;
    }

    if (!posts.length) {
      console.error("Unexpected posts API response:", data);

      return [];
    }

    return posts.map(normalizePost);
  },

  // --------------------------------------------------
  // POST /api/posts
  // --------------------------------------------------

  createPost: async (payload: {
    content: string;
    image?: string;
  }): Promise<Post> => {
    try {

      const { data } = await api.post("/api/posts", payload);

      const rawPost = data?.data?.post ?? data?.post ?? data?.data ?? data;

      return normalizePost(rawPost);
    } catch (error) {
      console.error("CREATE POST API ERROR:", error);

      throw error;
    }
  },

  // --------------------------------------------------
  // DELETE /api/posts/:id
  // --------------------------------------------------

  deletePost: async (postId: string): Promise<void> => {
    await api.delete(`/api/posts/${postId}`);
  },

  // --------------------------------------------------
  // PUT /api/posts/:id
  // --------------------------------------------------

  updatePost: async (
    postId: string,
    payload: { content?: string; image?: string | null },
  ): Promise<Post> => {
    const body: Record<string, unknown> = {};
    if (payload.content !== undefined) body.content = payload.content;
    if (payload.image) body.image = payload.image;

    const { data } = await api.put(`/api/posts/${postId}`, body);
    const rawPost = data?.data?.post ?? data?.post ?? data?.data ?? data;
    return normalizePost(rawPost);
  },

  // --------------------------------------------------
  // PATCH /api/posts/:id
  // --------------------------------------------------

  toggleLike: async (
    postId: string,
  ): Promise<{
    isLikedByMe?: boolean;
    likesCount?: number;
  }> => {
    const { data } = await api.patch(`/api/posts/${postId}`, {});

    const result = data?.data ?? data;

    const isLikedByMe: boolean | undefined =
      result?.isLikedByMe ??
      result?.liked ??
      result?.isLiked ??
      result?.hasLiked ??
      (Array.isArray(result?.likes)
        ? result.likes.some(
            (l: any) =>
              (l?.userId ?? l?.id ?? l) === useAuthStore.getState().user?.id,
          )
        : undefined);

    const likesCount: number | undefined =
      result?.likesCount ??
      result?.likeCount ??
      result?._count?.likes ??
      (Array.isArray(result?.likes) ? result.likes.length : undefined) ??
      (typeof result?.likes === "number" ? result.likes : undefined);

    return { isLikedByMe, likesCount };
  },

  // --------------------------------------------------
  // POST /api/posts/:id/comment
  // --------------------------------------------------

  addComment: async (postId: string, content: string): Promise<Comment> => {
    const { data } = await api.post(`/api/posts/${postId}/comment`, {
      content,
    });

    const rawComment =
      data?.data?.comment ?? data?.comment ?? data?.data ?? data;

    const currentUser = useAuthStore.getState().user;

    const normalized = normalizeComment(rawComment);

    return {
      ...normalized,
      id: normalized.id || rawComment?.id || `temp-${Date.now()}`,
      content:
        rawComment?.content ?? rawComment?.text ?? rawComment?.body ?? content,
      author:
        rawComment?.author &&
        (rawComment.author.name || rawComment.author.username)
          ? normalized.author
          : currentUser
            ? {
                id: currentUser.id,
                username: currentUser.username,
                name: currentUser.name,
                avatar: currentUser.avatar ?? null,
              }
            : normalized.author,
    };
  },

  // --------------------------------------------------
  // PUT /api/posts/:postId/comment/:commentId
  // --------------------------------------------------

  updateComment: async (
    postId: string,
    commentId: string,
    content: string,
  ): Promise<Comment> => {
    const { data } = await api.put(
      `/api/posts/${postId}/comment/${commentId}`,
      { content },
    );

    const rawComment =
      data?.data?.comment ?? data?.comment ?? data?.data ?? data;

    const normalized = normalizeComment(rawComment);

    return {
      ...normalized,
      id: normalized.id || commentId,
      content: rawComment?.content ?? content,
    };
  },

  // --------------------------------------------------
  // DELETE /api/posts/:postId/comment/:commentId
  // --------------------------------------------------

  deleteComment: async (postId: string, commentId: string): Promise<void> => {
    await api.delete(`/api/posts/${postId}/comment/${commentId}`);
  },
};

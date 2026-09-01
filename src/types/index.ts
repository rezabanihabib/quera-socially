export interface User {
  id: string;
  username: string;
  name: string;
  email?: string;
  avatar?: string | null;
  bio?: string | null;
  location?: string | null;
  website?: string | null;
  followersCount: number;
  followingCount: number;
  postsCount?: number;
  isFollowedByMe?: boolean;
  createdAt: string;
}

export interface Comment {
  id: string;
  content: string;
  author: Pick<User, "id" | "username" | "name" | "avatar"> & {
    email?: string;
  };
  createdAt: string;
}

export interface Post {
  id: string;
  content: string;
  image?: string | null;
  author: Pick<User, "id" | "username" | "name" | "avatar">;
  likesCount: number;
  commentsCount: number;
  isLikedByMe: boolean;
  likedByUserIds?: string[];
  comments?: Comment[];
  createdAt: string;
}

export type NotificationType = "like" | "comment" | "follow";

export interface AppNotification {
  id: string;
  type: NotificationType;
  read: boolean;
  actor: Pick<User, "id" | "username" | "name" | "avatar">;
  post?: Pick<Post, "id" | "content"> | null;
  commentPreview?: string | null;
  createdAt: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface UpdateProfilePayload {
  name?: string;
  bio?: string;
  location?: string;
  website?: string;
  image?: string;
}

export interface ApiError {
  message: string;
  status?: number;
}

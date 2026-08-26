import { api } from "@/api/axiosInstance";
import { normalizePost } from "@/api/postsApi";
import { useAuthStore } from "@/store/authStore";
import { generateUsernameFromEmail, isUserFollowedByMe } from "@/lib/utils";
import type { Post, UpdateProfilePayload, User } from "@/types";

function findFirstArray(value: any): any[] | null {
  if (!value || typeof value !== "object") return null;
  for (const v of Object.values(value)) {
    if (Array.isArray(v)) return v;
  }
  for (const v of Object.values(value)) {
    if (v && typeof v === "object" && !Array.isArray(v)) {
      for (const inner of Object.values(v)) {
        if (Array.isArray(inner)) return inner;
      }
    }
  }
  return null;
}

function extractUserWithSiblingFlags(data: any): any {
  const container = data?.data ?? data;
  const rawUser = container?.user ?? container?.profile ?? container;

  if (rawUser === container) return rawUser;

  return {
    ...rawUser,
    isFollowedByMe: rawUser?.isFollowedByMe ?? container?.isFollowedByMe,
    isFollowing: rawUser?.isFollowing ?? container?.isFollowing,
    followersCount: rawUser?.followersCount ?? container?.followersCount,
    followingCount: rawUser?.followingCount ?? container?.followingCount,
  };
}

export const normalizeUser = (user: any): User => ({
  ...user,

  id: user.id ?? user._id ?? user.userId ?? user.uid,

  username:
    user.username ??
    generateUsernameFromEmail(user.email) ??
    user.id ??
    user._id ??
    user.userId ??
    user.uid ??
    user.name?.toLowerCase().replace(/\s+/g, ""),

  avatar: user.avatar ?? user.image ?? null,

  followersCount:
    user._count?.followers ??
    user._count?.followedBy ??
    user.followersCount ??
    (Array.isArray(user.followers) ? user.followers.length : undefined) ??
    (Array.isArray(user.followedBy) ? user.followedBy.length : undefined) ??
    0,

  followingCount:
    user._count?.followings ??
    user.followingCount ??
    (Array.isArray(user.following) ? user.following.length : undefined) ??
    0,

  postsCount:
    user._count?.posts ??
    user.postsCount ??
    (Array.isArray(user.posts) ? user.posts.length : undefined) ??
    0,

  isFollowedByMe:
    user.isFollowedByMe ??
    user.isFollowing ??
    isUserFollowedByMe(
      user.followers ?? user.followedBy,
      useAuthStore.getState().user?.id,
    ),
});

export const usersApi = {
  getById: async (userId: string): Promise<User> => {
    const { data } = await api.get(`/api/users/${userId}`);

    return normalizeUser(extractUserWithSiblingFlags(data));
  },

  getByUsername: async (username: string): Promise<User> => {
    const { data } = await api.get(`/api/users/${username}/profile`);

    return normalizeUser(extractUserWithSiblingFlags(data));
  },

  toggleFollow: async (
    userId: string,
  ): Promise<{
    isFollowedByMe?: boolean;
    followersCount?: number;
  }> => {
    const { data } = await api.patch(`/api/users/${userId}`, {});

    const result = data?.data ?? data;

    return {
      isFollowedByMe:
        result?.isFollowedByMe ??
        result?.following ??
        result?.isFollowing ??
        (Array.isArray(result?.followers ?? result?.followedBy)
          ? (result.followers ?? result.followedBy).some(
              (f: any) =>
                (f?.id ?? f?._id ?? f?.followerId ?? f?.userId ?? f) ===
                useAuthStore.getState().user?.id,
            )
          : undefined),

      followersCount:
        result?.followersCount ??
        result?.followerCount ??
        result?._count?.followers ??
        result?._count?.followedBy ??
        (Array.isArray(result?.followers)
          ? result.followers.length
          : Array.isArray(result?.followedBy)
            ? result.followedBy.length
            : undefined),
    };
  },

  updateProfile: async (
    userId: string,
    payload: UpdateProfilePayload,
  ): Promise<User> => {
    const { data } = await api.put(`/api/users/${userId}`, payload);
    const raw = extractUserWithSiblingFlags(data) ?? {};

    const previous = useAuthStore.getState().user;
    const isSamePerson = previous && previous.id === (raw?.id ?? userId);
    const base: Partial<User> = isSamePerson ? previous : {};

    return normalizeUser({
      ...base,
      ...raw,
      name: raw.name ?? payload.name ?? base.name,
      bio: raw.bio ?? payload.bio ?? base.bio,
      location: raw.location ?? payload.location ?? base.location,
      website: raw.website ?? payload.website ?? base.website,
    });
  },

  getRecommended: async (): Promise<User[]> => {
    const { data } = await api.get("/api/users/recommend");

    console.log("RECOMMENDED USERS API RESPONSE:", data);

    let users: any[] = [];

    if (Array.isArray(data)) {
      users = data;
    } else if (Array.isArray(data?.users)) {
      users = data.users;
    } else if (Array.isArray(data?.data)) {
      users = data.data;
    } else if (Array.isArray(data?.response)) {
      users = data.response;
    } else if (Array.isArray(data?.data?.users)) {
      users = data.data.users;
    }

    if (!users.length) {
      console.error("Unexpected recommended users API response:", data);

      return [];
    }

    return users.map(normalizeUser);
  },

  getUserPosts: async (userId: string): Promise<Post[]> => {
    const { data } = await api.get(`/api/users/${userId}/posts`);

    const raw: any[] =
      (Array.isArray(data) && data) ||
      (Array.isArray(data?.posts) && data.posts) ||
      (Array.isArray(data?.data?.posts) && data.data.posts) ||
      (Array.isArray(data?.data) && data.data) ||
      (Array.isArray(data?.response) && data.response) ||
      findFirstArray(data) ||
      [];

    if (raw.length === 0) {
      console.error("Unexpected user posts API response:", data);
    }

    return raw.map(normalizePost);
  },

  getUserLikes: async (userId: string): Promise<Post[]> => {
    const { data } = await api.get(`/api/users/${userId}/likes`);

    const raw: any[] =
      (Array.isArray(data) && data) ||
      (Array.isArray(data?.posts) && data.posts) ||
      (Array.isArray(data?.likes) && data.likes) ||
      (Array.isArray(data?.data?.posts) && data.data.posts) ||
      (Array.isArray(data?.data?.likes) && data.data.likes) ||
      (Array.isArray(data?.data) && data.data) ||
      (Array.isArray(data?.response) && data.response) ||
      findFirstArray(data) ||
      [];

    if (raw.length === 0) {
      console.error("Unexpected user likes API response:", data);
    }

    return raw.map((item) => normalizePost(item?.post ?? item));
  },
};

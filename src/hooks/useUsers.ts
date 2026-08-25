import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { usersApi } from "@/api/usersApi";
import { useAuthStore } from "@/store/authStore";
import type { ApiError, UpdateProfilePayload, User } from "@/types";

export function useUserProfile(usernameOrId: string | undefined) {
  const isInitialized = useAuthStore((s) => s.isInitialized);
  return useQuery({
    queryKey: ["users", "profile", usernameOrId],
    queryFn: async () => {
      try {
        return await usersApi.getByUsername(usernameOrId as string);
      } catch (err) {
        return await usersApi.getById(usernameOrId as string);
      }
    },
    enabled: Boolean(usernameOrId) && isInitialized,
  });
}

export function useUserPosts(userId: string | undefined) {
  return useQuery({
    queryKey: ["users", userId, "posts"],
    queryFn: () => usersApi.getUserPosts(userId as string),
    enabled: Boolean(userId),
  });
}

export function useUserLikes(userId: string | undefined) {
  return useQuery({
    queryKey: ["users", userId, "likes"],
    queryFn: () => usersApi.getUserLikes(userId as string),
    enabled: Boolean(userId),
  });
}

export function useRecommendedUsers() {
  const isInitialized = useAuthStore((s) => s.isInitialized);
  return useQuery({
    queryKey: ["users", "recommend"],
    queryFn: usersApi.getRecommended,
    staleTime: 60 * 1000,
    enabled: isInitialized,
  });
}

export function useToggleFollow() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (user: User) => usersApi.toggleFollow(user.id),
    onMutate: async (user: User) => {
      const nextFollowed = !user.isFollowedByMe;
      const nextCount = user.followersCount + (nextFollowed ? 1 : -1);
      queryClient.setQueriesData<User>(
        { queryKey: ["users", "profile", user.username] },
        (old) =>
          old
            ? {
                ...old,
                isFollowedByMe: nextFollowed,
                followersCount: Math.max(0, nextCount),
              }
            : old,
      );

      // Remove the just-followed person from "Who to Follow" instead of
      // just flipping their button — the widget always shows fresh
      // suggestions, not people already followed. On unfollow there's
      // nothing to remove (they weren't in the recommend list already).
      if (nextFollowed) {
        queryClient.setQueryData<User[]>(["users", "recommend"], (old) =>
          old ? old.filter((u) => u.id !== user.id) : old,
        );
      } else {
        queryClient.setQueryData<User[]>(["users", "recommend"], (old) =>
          old
            ? old.map((u) =>
                u.id === user.id
                  ? {
                      ...u,
                      isFollowedByMe: false,
                      followersCount: Math.max(0, nextCount),
                    }
                  : u,
              )
            : old,
        );
      }

      // My own followingCount (shown in the left mini profile card, which
      // reads from the session/authStore user) needs to move too — it
      // wasn't being touched before, so it only "updated" after a full
      // page refresh re-fetched the session from scratch.
      const previousMe = useAuthStore.getState().user;
      if (previousMe) {
        const updatedMe: User = {
          ...previousMe,
          followingCount: Math.max(
            0,
            previousMe.followingCount + (nextFollowed ? 1 : -1),
          ),
        };
        setUser(updatedMe);
        queryClient.setQueryData(["session"], updatedMe);
      }

      return { user, previousMe };
    },
    onSuccess: (_result, user) => {
      if (!user.isFollowedByMe) {
        // We just followed someone and removed them from the recommend
        // list — refetch so a new suggestion backfills the slot, keeping
        // the widget at a full set of suggestions.
        queryClient.invalidateQueries({ queryKey: ["users", "recommend"] });
      }
    },
    onError: (error: ApiError, user, context) => {
      queryClient.setQueriesData<User>(
        { queryKey: ["users", "profile", user.username] },
        () => user,
      );
      if (context?.previousMe) {
        setUser(context.previousMe);
        queryClient.setQueryData(["session"], context.previousMe);
      }
      toast.error(error.message || "Could not update follow status.");
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: ({
      userId,
      payload,
    }: {
      userId: string;
      payload: UpdateProfilePayload;
    }) => usersApi.updateProfile(userId, payload),
    onSuccess: (updated) => {
      setUser(updated);
      queryClient.setQueryData(["session"], updated);
      queryClient.setQueriesData<User>(
        { queryKey: ["users", "profile"] },
        (old) => (old && old.id === updated.id ? updated : old),
      );
      toast.success("Profile updated");
    },
    onError: (error: ApiError) =>
      toast.error(error.message || "Could not update profile."),
  });
}

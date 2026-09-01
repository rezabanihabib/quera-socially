import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationsApi } from "@/api/notificationApi";
import type { AppNotification } from "@/types";

export function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: notificationsApi.getAll,
    staleTime: 15 * 1000,
  });
}

export function useMarkNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => notificationsApi.markAllAsRead(ids),
    onSuccess: (_data, ids) => {
      queryClient.setQueryData<AppNotification[]>(["notifications"], (old) =>
        old ? old.map((n) => (ids.includes(n.id) ? { ...n, read: true } : n)) : old
      );
    },
  });
}

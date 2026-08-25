import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { authApi } from "@/api/authApi";
import { useAuthStore } from "@/store/authStore";
import type { ApiError, AuthCredentials, RegisterPayload } from "@/types";

export function useSession() {
  const setUser = useAuthStore((s) => s.setUser);
  const setInitialized = useAuthStore((s) => s.setInitialized);

  const query = useQuery({
    queryKey: ["session"],
    queryFn: authApi.getSession,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (query.isSuccess) {
      setUser(query.data ?? null);
      setInitialized(true);
    }
    if (query.isError) {
      setUser(null);
      setInitialized(true);
    }
  }, [query.isSuccess, query.isError, query.data, setUser, setInitialized]);

  return query;
}

export function useLogin() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (payload: AuthCredentials) => authApi.login(payload),
    onSuccess: (user) => {
      setUser(user);
      queryClient.setQueryData(["session"], user);
      toast.success(`Welcome back, ${user.name ?? user.username}!`);
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Could not log in.");
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (payload: RegisterPayload) => authApi.register(payload),
    onSuccess: (user) => {
      setUser(user);
      queryClient.setQueryData(["session"], user);
      toast.success("Account created — welcome to Socially!");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Could not create your account.");
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      setUser(null);
      queryClient.setQueryData(["session"], null);
      queryClient.clear();
      toast.success("Signed out");
    },
    onError: () => {
      setUser(null);
      queryClient.setQueryData(["session"], null);
    },
  });
}

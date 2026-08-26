import { api } from "@/api/axiosInstance";
import { normalizeUser, usersApi } from "@/api/usersApi";
import type { AuthCredentials, RegisterPayload, User } from "@/types";

async function enrichWithFullProfile(lean: User): Promise<User> {
  if (!lean?.id) return lean;
  try {
    const full = await usersApi.getById(lean.id);
    return { ...lean, ...full };
  } catch {
    return lean;
  }
}

export const authApi = {
  getSession: async (): Promise<User | null> => {
    const { data } = await api.get("/api/authentication/session");

    const raw = data?.data?.user ?? data?.user ?? null;
    if (!raw) return null;

    return enrichWithFullProfile(normalizeUser(raw));
  },

  login: async (payload: AuthCredentials): Promise<User> => {
    const { data } = await api.post("/api/authentication/login", payload);

    const lean = normalizeUser(data?.data?.user ?? data?.user ?? data);
    return enrichWithFullProfile(lean);
  },

  register: async (payload: RegisterPayload): Promise<User> => {
    const { data } = await api.post("/api/authentication/register", payload);

    const lean = normalizeUser(data?.data?.user ?? data?.user ?? data);
    return enrichWithFullProfile(lean);
  },

  logout: async (): Promise<void> => {
    await api.post("/api/authentication/logout");
  },
};

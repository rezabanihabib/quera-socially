import axios, { type AxiosError } from "axios";
import type { ApiError } from "../types";

const Url = import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL: Url,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const normalized: ApiError = {
      message:
        error.response?.data?.message ||
        error.message ||
        "Something went wrong. Please try again.",
      status: error.response?.status,
    };
    return Promise.reject(normalized);
  },
);

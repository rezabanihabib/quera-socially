import { type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { useSession } from "@/hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { PageSpinner } from "../ui/Feedback";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function SessionBootstrap({ children }: { children: ReactNode }) {
  useSession();
  const { user, isInitialized } = useAuthStore();

  if (!isInitialized) return <PageSpinner />;
  if (user) return <Navigate to="/" replace />;
  
  return <>{children}</>;
}

export default function GuestOnlyRoute() {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionBootstrap>
        <Outlet />
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: "rgb(var(--color-surface))",
              color: "rgb(var(--color-foreground))",
              border: "1px solid rgb(var(--color-border))",
              fontSize: "13px",
            },
          }}
        />
      </SessionBootstrap>
    </QueryClientProvider>
  );
}

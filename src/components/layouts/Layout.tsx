import { type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { useSession } from "@/hooks/useAuth";
import { Outlet } from "react-router-dom";

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
  return <>{children}</>;
}

export default function Layout() {
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

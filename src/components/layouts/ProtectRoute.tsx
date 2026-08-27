import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "@/store/authStore";
import { PageSpinner } from "@/components/ui/Feedback";

const ProtectRoute = () => {
  const { user, isInitialized } = useAuthStore();

  if (!isInitialized) return <PageSpinner />;
  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
};

export default ProtectRoute;

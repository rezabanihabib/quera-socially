import { Navigate, Outlet } from "react-router";

const ProtectRoute = () => {
  // const session = useSession((s) => s.session);
  // const loading = useSession((s) => s.loading);

  //   if (loading) {
  //     return <div>loading</div>;
  //   }

  //   if (session) {
  //     return <Navigate to="/sign-in" replace />;
  //   }
  return <Outlet />;
};

export default ProtectRoute;

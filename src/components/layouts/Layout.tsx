import { useState } from "react";
import { Outlet } from "react-router";

const Layout = () => {
  const [loading, setLoading] = useState();
  return (
    <div>
      {/* <Header /> */}
      {/* <Sidebar /> */}

      {loading ? "is loading" : <Outlet />}
    </div>
  );
};

export default Layout;

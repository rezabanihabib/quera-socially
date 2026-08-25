import { useState } from "react";
import { Outlet } from "react-router";
import { Navbar } from "./Navbar";

const Layout = () => {
  const [loading, setLoading] = useState();
  return (
    <div>
      <Navbar />
      {/* <Sidebar /> */}

      {loading ? "is loading" : <Outlet />}
    </div>
  );
};

export default Layout;

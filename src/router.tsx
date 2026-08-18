import { createBrowserRouter } from "react-router";
import Layout from "./components/layouts/Layout";
import App from "./App";
import Profile from "./pages/Profile";
import ProtectRoute from "./components/layouts/ProtectRoute";
import Notifications from "./pages/Notifications";
import Register from "./pages/Register";
import Login from "./pages/Login";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: App },
      { path: "profile/:username", Component: Profile },
      {
        Component: ProtectRoute,
        children: [{ path: "notifications", Component: Notifications }],
      },
    ],
  },
  {
    path: "register",
    Component: Register,
  },
  {
    path: "login",
    Component: Login,
  },
]);

export default router;

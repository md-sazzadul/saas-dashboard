import { createBrowserRouter } from "react-router";
import DashboardLayout from "../components/layout/DashboardLayout";
import Login from "../features/auth/pages/Login";
import Dashboard from "../features/dashboard/pages/Dashboard";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/",
    Component: DashboardLayout,
    children: [
      {
        path: "dashboard",
        Component: Dashboard,
      },
    ],
  },
]);

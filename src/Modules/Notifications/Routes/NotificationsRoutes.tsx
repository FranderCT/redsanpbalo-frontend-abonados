import { createRoute } from "@tanstack/react-router";
import { dashboardRoute } from "../../Dashboard/Routes/DashboardRoutes";
import NotificationsPage from "../Pages/NotificationsPage";

export const notificationsRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "notifications",
  component: NotificationsPage,
});

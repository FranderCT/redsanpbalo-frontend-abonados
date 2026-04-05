import { createRoute } from "@tanstack/react-router";
import { dashboardRoute } from "../../Dashboard/Routes/DashboardRoutes";
import UserAuditPage from "../Pages/UserAuditPage";

export const auditUsersRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "user-audit",
  component: UserAuditPage,
});
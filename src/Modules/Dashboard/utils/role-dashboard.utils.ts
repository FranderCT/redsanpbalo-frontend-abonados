import { Role } from "../../Users/Models/Roles";

export const ADMIN_DASHBOARD_HOME = "/dashboard/principal-admin";
export const BOD_DASHBOARD_HOME = "/dashboard/principal-junta-directiva";
export const PLUMBER_DASHBOARD_HOME = "/dashboard/principal-fontanero";
export const USER_DASHBOARD_HOME = "/dashboard/principal-user";

export const ADMIN_DASHBOARD_ROLES: readonly Role[] = [Role.ADMIN, Role.BOD];
export const USER_DASHBOARD_ROLES: readonly Role[] = [
  Role.GUEST,
  Role.SUB,
  Role.ASSOS,
  Role.PLMBR,
] as const;
export const LIVE_REPORTS_ROLES: readonly Role[] = [Role.ADMIN, Role.BOD];

const REPORTS_DASHBOARD_ROLES: readonly Role[] = [Role.ADMIN, Role.ASSOS, Role.PLMBR];

const ADMIN_ROUTE_PREFIXES = [
  ADMIN_DASHBOARD_HOME,
  BOD_DASHBOARD_HOME,
  "/dashboard/edit-landing",
  "/dashboard/products",
  "/dashboard/materials",
  "/dashboard/categories",
  "/dashboard/units-measure",
  "/dashboard/suppliers",
  "/dashboard/projects",
  "/dashboard/comments",
] as const;

const USER_ROUTE_PREFIXES = [USER_DASHBOARD_HOME, PLUMBER_DASHBOARD_HOME] as const;
const REPORTS_ROUTE_PREFIXES = ["/dashboard/reports"] as const;

const SHARED_ROUTE_PREFIXES = ["/dashboard/settings", "/dashboard/notifications"] as const;
const SHARED_ROUTE_PATHS: readonly string[] = [
  "/dashboard",
  "/dashboard/users/profile",
  "/dashboard/users/edit",
] as const;

type DashboardRouteGroup = "admin" | "user" | "reports" | "shared";

const ALL_ROLES = new Set<string>(Object.values(Role));

export function normalizeRole(role?: string | null): Role | null {
  if (!role) {
    return null;
  }

  return ALL_ROLES.has(role) ? (role as Role) : null;
}

export function isAdminDashboardRole(role?: Role | null): boolean {
  return role != null && ADMIN_DASHBOARD_ROLES.includes(role);
}

export function isUserDashboardRole(role?: Role | null): boolean {
  return role != null && USER_DASHBOARD_ROLES.includes(role);
}

export function getDashboardHomeByRole(role?: Role | null): string {
  if (role === Role.ADMIN) {
    return ADMIN_DASHBOARD_HOME;
  }

  if (role === Role.BOD) {
    return BOD_DASHBOARD_HOME;
  }

  if (role === Role.PLMBR) {
    return PLUMBER_DASHBOARD_HOME;
  }

  return USER_DASHBOARD_HOME;
}

export function getDefaultActiveRole(roles: readonly Role[]): Role | null {
  if (roles.length === 0) {
    return null;
  }

  if (roles.includes(Role.ADMIN)) {
    return Role.ADMIN;
  }

  if (roles.includes(Role.BOD)) {
    return Role.BOD;
  }

  return roles[0];
}

export function normalizeDashboardPath(pathname: string): string {
  if (pathname === "/dashboard/") {
    return "/dashboard";
  }

  return pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
}

export function isDashboardIndexPath(pathname: string): boolean {
  return normalizeDashboardPath(pathname) === "/dashboard";
}

function matchesPrefix(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

function getDashboardRouteGroup(pathname: string): DashboardRouteGroup {
  const normalizedPath = normalizeDashboardPath(pathname);

  if (SHARED_ROUTE_PATHS.includes(normalizedPath)) {
    return "shared";
  }

  if (SHARED_ROUTE_PREFIXES.some((prefix) => matchesPrefix(normalizedPath, prefix))) {
    return "shared";
  }

  if (matchesPrefix(normalizedPath, "/dashboard/requests")) {
    return normalizedPath.endsWith("/admin") ? "admin" : "user";
  }

  if (matchesPrefix(normalizedPath, "/dashboard/users")) {
    return "admin";
  }

  if (ADMIN_ROUTE_PREFIXES.some((prefix) => matchesPrefix(normalizedPath, prefix))) {
    return "admin";
  }

  if (REPORTS_ROUTE_PREFIXES.some((prefix) => matchesPrefix(normalizedPath, prefix))) {
    return "reports";
  }

  if (USER_ROUTE_PREFIXES.some((prefix) => matchesPrefix(normalizedPath, prefix))) {
    return "user";
  }

  return "shared";
}

export function canAccessDashboardPath(role: Role, pathname: string): boolean {
  const routeGroup = getDashboardRouteGroup(pathname);

  if (routeGroup === "shared") {
    return true;
  }

  if (routeGroup === "admin") {
    return isAdminDashboardRole(role);
  }

  if (routeGroup === "reports") {
    return REPORTS_DASHBOARD_ROLES.includes(role);
  }

  return isUserDashboardRole(role);
}

import { Role } from "../../Users/Models/Roles";

export const ADMIN_DASHBOARD_HOME = "/dashboard/principal-admin";
export const USER_DASHBOARD_HOME = "/dashboard/principal-user";

export const ADMIN_DASHBOARD_ROLES = [Role.ADMIN, Role.BOD] as const;
export const USER_DASHBOARD_ROLES = [
  Role.GUEST,
  Role.SUB,
  Role.ASSOS,
  Role.PLMBR,
] as const;
export const LIVE_REPORTS_ROLES = [Role.ADMIN, Role.PLMBR] as const;

const ADMIN_ROUTE_PREFIXES = [
  ADMIN_DASHBOARD_HOME,
  "/dashboard/edit-landing",
  "/dashboard/products",
  "/dashboard/materials",
  "/dashboard/categories",
  "/dashboard/units-measure",
  "/dashboard/suppliers",
  "/dashboard/projects",
  "/dashboard/comments",
  "/dashboard/reports",
] as const;

const USER_ROUTE_PREFIXES = [USER_DASHBOARD_HOME] as const;

const SHARED_ROUTE_PREFIXES = ["/dashboard/settings"] as const;
const SHARED_ROUTE_PATHS = [
  "/dashboard",
  "/dashboard/users/profile",
  "/dashboard/users/edit",
] as const;

type DashboardRouteGroup = "admin" | "user" | "shared";

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
  return isAdminDashboardRole(role) ? ADMIN_DASHBOARD_HOME : USER_DASHBOARD_HOME;
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

  return isUserDashboardRole(role);
}

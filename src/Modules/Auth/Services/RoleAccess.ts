import type { Role } from "../../Users/Models/Roles";

export type AccessRule = {
  any?: Role[];   // al menos uno
  all?: Role[];   // todos
  none?: Role[];  // ninguno de estos
};

export function hasAccess(userRoles: Array<Role | string> = [], rule: AccessRule = {}): boolean {
  const roles = new Set(userRoles);
  const anyOK = !rule.any || rule.any.some((role) => roles.has(role));
  const allOK = !rule.all || rule.all.every((role) => roles.has(role));
  const noneOK = !rule.none || rule.none.every((role) => !roles.has(role));

  return anyOK && allOK && noneOK;
}

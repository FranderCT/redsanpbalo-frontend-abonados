export type Role = 'ADMIN' | 'ABONADO' | 'GUEST';

export type AccessRule = {
  any?: Role[];   // al menos uno
  all?: Role[];   // todos
  none?: Role[];  // ninguno de estos
};

export function hasAccess(userRoles: string[] = [], rule: AccessRule = {}): boolean {
  const roles = userRoles.map(r => r.toUpperCase());
  const anyOK  = !rule.any  || rule.any.some(r => roles.includes(r.toUpperCase()));
  const allOK  = !rule.all  || rule.all.every(r => roles.includes(r.toUpperCase()));
  const noneOK = !rule.none || !roles.some(r => rule.none!.map(n => n.toUpperCase()).includes(r));
  return anyOK && allOK && noneOK;
}

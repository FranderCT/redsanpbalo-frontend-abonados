import React from 'react';
import { useGetUserProfile } from '../../Users/Hooks/UsersHooks';
import type { Role, Roles } from '../../Users/Models/Roles';
import { hasAccess, type AccessRule } from '../Services/RoleAccess';
import { useRole } from './RolesContext';

type CanProps = React.PropsWithChildren<{
  rule?: AccessRule;
  roles?: Role[];
  fallback?: React.ReactNode;
}>;

function getUserRoles(): Role[] {
  const { UserProfile } = useGetUserProfile();

  try {
    return UserProfile?.Roles?.map((role: Roles) => role.Rolname) ?? [];
  } catch {
    return [];
  }
}

export const Can: React.FC<CanProps> = ({ rule, roles, fallback = null, children }) => {
  const { activeRole } = useRole();
  const userRoles = roles ?? (activeRole ? [activeRole] : getUserRoles());

  return hasAccess(userRoles, rule) ? <>{children}</> : <>{fallback}</>;
};

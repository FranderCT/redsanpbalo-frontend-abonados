import React from 'react';
import { useGetUserProfile } from '../../Users/Hooks/UsersHooks';
import type { Role } from '../../Users/Models/Roles';
import { hasAccess, type AccessRule } from '../Services/RoleAccess';


type CanProps = React.PropsWithChildren<{
    rule?: AccessRule;
    roles?: string[];           // opcional: si no lo pasas, lee de getUserRoles()
    fallback?: React.ReactNode;
}>;

// Implementa esto según tu app (contexto, store o localStorage)
function getUserRoles(): string[] {
    const {UserProfile} = useGetUserProfile();
    try {
        // tu estructura suele ser { Roles: [{ Rolname: 'ADMIN' }, ...] }
        return UserProfile?.Roles?.map((r: Role) => r.Rolname) ?? [];
    } catch { return []; }
}

export const Can: React.FC<CanProps> = ({ rule, roles, fallback = null, children }) => {
    const userRoles = roles ?? getUserRoles();
    return hasAccess(userRoles, rule) ? <>{children}</> : <>{fallback}</>;
};  
import React from 'react';
import { useGetUserProfile } from '../../Users/Hooks/UsersHooks';
import type { Roles } from '../../Users/Models/Roles';
import { hasAccess, type AccessRule } from '../Services/RoleAccess';
import { useRole } from './RolesContext';

type CanProps = React.PropsWithChildren<{
    rule?: AccessRule;
    roles?: string[];
    fallback?: React.ReactNode;
}>;

function getUserRoles(): string[] {
    const { UserProfile } = useGetUserProfile();
    try {
        return UserProfile?.Roles?.map((r: Roles) => r.Rolname) ?? [];
    } catch { 
        return []; 
    }
}

export const Can: React.FC<CanProps> = ({ rule, roles, fallback = null, children }) => {
    const { activeRole } = useRole();
    
    // Si no se proporcionan roles, usa el rol activo o todos los roles del usuario
    const userRoles = roles ?? (activeRole ? [activeRole] : getUserRoles());
    
    return hasAccess(userRoles, rule) ? <>{children}</> : <>{fallback}</>;
};
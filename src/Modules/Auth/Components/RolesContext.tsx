import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Role } from '../../Users/Models/Roles';
import { normalizeRole } from '../../Dashboard/utils/role-dashboard.utils';

interface RoleContextType {
  activeRole: Role | null;
  setActiveRole: (role: Role) => void;
  availableRoles: Role[];
  setAvailableRoles: React.Dispatch<React.SetStateAction<Role[]>>;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [activeRole, setActiveRoleState] = useState<Role | null>(null);
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);

  useEffect(() => {
    const savedRole = normalizeRole(localStorage.getItem('activeRole'));
    if (savedRole) {
      setActiveRoleState(savedRole);
    }
  }, []);

  const setActiveRole = (role: Role) => {
    setActiveRoleState(role);
    localStorage.setItem('activeRole', role);
  };

  return (
    <RoleContext.Provider
      value={{
        activeRole,
        setActiveRole,
        availableRoles,
        setAvailableRoles,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }

  return context;
};

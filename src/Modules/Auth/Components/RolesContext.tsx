    import React, { createContext, useContext, useState, useEffect } from 'react';

    interface RoleContextType {
    activeRole: string | null;
    setActiveRole: (role: string) => void;
    availableRoles: string[];
    setAvailableRoles: (roles: string[]) => void;
    }

    const RoleContext = createContext<RoleContextType | undefined>(undefined);

    export const RoleProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [activeRole, setActiveRoleState] = useState<string | null>(null);
    const [availableRoles, setAvailableRoles] = useState<string[]>([]);

    // Cargar rol activo del localStorage al iniciar
    useEffect(() => {
        const savedRole = localStorage.getItem('activeRole');
        if (savedRole) {
        setActiveRoleState(savedRole);
        }
    }, []);

    const setActiveRole = (role: string) => {
        setActiveRoleState(role);
        localStorage.setItem('activeRole', role);
    };

    return (
        <RoleContext.Provider 
        value={{ 
            activeRole, 
            setActiveRole, 
            availableRoles, 
            setAvailableRoles 
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
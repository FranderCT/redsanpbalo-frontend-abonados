    import { useState } from "react";
    import { Outlet, Link, useNavigate } from "@tanstack/react-router";
    import { User, Lock, Mail, Menu } from "lucide-react";

    const navItems = [
    { to: "/dashboard/users/profile", label: "Ver perfil", icon: <User className="h-4 w-4" /> },
    { to: "/dashboard/settings/change-password", label: "Cambiar contraseña", icon: <Lock className="h-4 w-4" /> },
    //{ to: "/dashboard/settings/change-email", label: "Cambiar correo", icon: <Mail className="h-4 w-4" /> },
    ];

    const NavLink = ({ to, label, icon }: { to: string; label: string; icon: React.ReactNode }) => (
    <Link
        to={to}
        activeOptions={{ exact: true }}
        activeProps={{ className: "bg-[#F1EDFF] text-[#5531D6] border-[#5531D6]" }}
        inactiveProps={{ className: "text-gray-700 hover:bg-gray-50" }}
        className="flex items-center gap-2 rounded-xl border border-transparent px-3 py-2 transition-colors"
    >
        {icon}
        <span className="text-sm font-medium">{label}</span>
    </Link>
    );

    const SettingsLayout = () => {
        const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    return (
        <div className="flex min-h-[calc(100vh-64px)] bg-[#F9F5FF]">
        {/* Sidebar desktop */}
        <aside className="hidden md:block w-64 bg-white border-r border-gray-200">
            <div className="p-4">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Configuración</h2>
            <nav className="flex flex-col gap-1">
                {navItems.map((n) => (
                <NavLink key={n.to} {...n} />
                ))}
            </nav> 
            </div>
        </aside>

        {/* Toggle mobile */}
        <button
            className="md:hidden fixed top-4 left-4 z-50 inline-flex items-center justify-center rounded-xl border bg-white px-3 py-2 shadow-sm"
            onClick={() => setOpen((v) => !v)}
            aria-label="Abrir menú de configuración"
        >
            <Menu className="h-5 w-5" />
        </button>

        {/* Sidebar mobile */}
        <aside
            className={`md:hidden fixed top-0 left-0 z-40 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ${
            open ? "translate-x-0" : "-translate-x-full"
            }`}
        >
            <div className="p-4">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Configursación</h2>
            <nav className="flex flex-col gap-1">
                {navItems.map((n) => (
                <NavLink key={n.to} {...n} />
                ))}
            </nav>
            </div>
        </aside>

        {/* Overlay mobile */}
        {open && (
            <div
            className="fixed inset-0 z-30 bg-black/10 md:hidden"
            onClick={() => setOpen(false)}
            />
        )}

        {/* Contenido */}
        <main className="flex-1 p-4 md:p-6">
            <div className="mx-auto max-w-3xl">
            <Outlet />
            </div>
        </main>
        </div>
    );
    };

    export default SettingsLayout;

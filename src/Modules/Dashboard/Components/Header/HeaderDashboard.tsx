import { Menu, X } from "lucide-react";
import NotificationBell from "./NotificationBell";
import ProfileUserMenu from "./ProfileUserMenu";

export type HeaderDashboardProps = {
  menuOpen: boolean;
  setMenuOpen: (val: boolean) => void;
};

const HeaderDashboard = ({ menuOpen, setMenuOpen }: HeaderDashboardProps) => {
  return (
    <header className="sticky top-0 z-30 flex h-16 min-w-0 items-center justify-between border-b border-border bg-background px-3 sm:px-4 md:px-6">
      {/* Botón hamburguesa mobile */}
      <button
        className="shrink-0 text-foreground transition-colors hover:text-muted-foreground md:hidden"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
      >
        {menuOpen ? <X size={26} /> : <Menu size={26} />}
      </button>

      {/* Notificaciones + menú de perfil */}
      <div className="ml-auto flex min-w-0 shrink-0 items-center gap-1 sm:gap-2">
        <NotificationBell />
        <ProfileUserMenu />
      </div>
    </header>
  );
};

export default HeaderDashboard;

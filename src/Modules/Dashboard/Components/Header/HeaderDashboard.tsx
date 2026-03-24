import { Menu, X } from "lucide-react";
import NotificationBell from "./NotificationBell";
import ProfileUserMenu from "./ProfileUserMenu";

export type HeaderDashboardProps = {
  menuOpen: boolean;
  setMenuOpen: (val: boolean) => void;
};

const HeaderDashboard = ({ menuOpen, setMenuOpen }: HeaderDashboardProps) => {
  return (
    <header className="h-16 bg-background border-b border-border px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Botón hamburguesa mobile */}
      <button
        className="md:hidden text-foreground hover:text-muted-foreground transition-colors"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
      >
        {menuOpen ? <X size={26} /> : <Menu size={26} />}
      </button>

      {/* Notificaciones + menú de perfil */}
      <div className="ml-auto flex items-center gap-2">
        <NotificationBell />
        <ProfileUserMenu />
      </div>
    </header>
  );
};

export default HeaderDashboard;
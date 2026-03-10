import { Menu, X } from "lucide-react";
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

      {/* Menú de perfil (avatar + DropdownMenu alineado a la derecha) */}
      <ProfileUserMenu />
    </header>
  );
};

export default HeaderDashboard;
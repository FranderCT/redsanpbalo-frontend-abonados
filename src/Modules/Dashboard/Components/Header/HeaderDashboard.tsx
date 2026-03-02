import { Menu, X } from "lucide-react";
import ProfileUserMenu from "./ProfileUserMenu";

const HeaderDashboard = ({
  menuOpen,
  setMenuOpen,
  profileOpen,
  setProfileOpen,
}: {
  menuOpen: boolean;
  setMenuOpen: (val: boolean) => void;
  profileOpen: boolean;
  setProfileOpen: (val: boolean) => void;
}) => {
  return (
    <header className="h-16 bg-background border-b border-border  px-6 flex items-center justify-between sticky top-0 z-30">

      {/* Botón hamburguesa mobile */}
      <button
        className="md:hidden text-foreground hover:text-muted-foreground transition-colors"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X size={26} /> : <Menu size={26} />}
      </button>


      {/* Menú de perfil */}
      <ProfileUserMenu profileOpen={profileOpen} setProfileOpen={setProfileOpen} />
    </header>
  );
};

export default HeaderDashboard;
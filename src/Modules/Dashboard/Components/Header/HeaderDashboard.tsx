import { Menu, X } from "lucide-react";
import ProfileMenu from "./ProfileMenu";


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
    <header className="h-16 bg-white shadow px-6 flex items-center justify-between sticky top-0 z-30">

      {/* Botón hamburguesa mobile */}
      <button
        className="md:hidden text-gray-700"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X size={26} /> : <Menu size={26} />}
      </button>

      {/* Título (opcional) */}
      <h2 className="text-lg font-semibold text-gray-800 hidden md:block">
        Dashboard
      </h2>

      {/* Menú de perfil */}
      <ProfileMenu profileOpen={profileOpen} setProfileOpen={setProfileOpen} />
    </header>
  );
};

export default HeaderDashboard;

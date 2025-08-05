import { User, Settings, LogOut } from "lucide-react";

const ProfileMenu = ({
  profileOpen,
  setProfileOpen,
}: {
  profileOpen: boolean;
  setProfileOpen: (val: boolean) => void;
}) => {
  return (
    <div className="relative">
      <button
        onClick={() => setProfileOpen(!profileOpen)}
        className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center hover:ring-2 hover:ring-indigo-500 transition"
      >
        <User size={20} className="text-gray-600" />
      </button>

      {/* Dropdown */}
      <div
        className={`absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-50 transform transition-all duration-300 ${
          profileOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <ul className="text-sm text-gray-700">
          <li>
            <a href="#" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100">
              <User size={16} /> Mi perfil
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100">
              <Settings size={16} /> Configuración
            </a>
          </li>
          <li>
            <button className="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-red-500">
              <LogOut size={16} /> Cerrar sesión
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ProfileMenu;

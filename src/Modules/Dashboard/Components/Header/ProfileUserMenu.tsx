import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "@tanstack/react-router";
import { User,LogOut } from "lucide-react";
//import { useLogout } from "../../../Auth/Hooks/AuthHooks";

type Props = {
  profileOpen: boolean;
  setProfileOpen: (v: boolean) => void;
};

export default function ProfileMenu({ profileOpen, setProfileOpen }: Props) {
  const navigate = useNavigate();
  //const logout = useLogout();
  const btnRef = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState<{ top: number; right: number }>({ top: 0, right: 0 });

  useEffect(() => {
    if (!profileOpen || !btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    setPos({ top: rect.bottom + 8, right: window.innerWidth - rect.right });
  }, [profileOpen]);



  return (
    <div className="relative">
      <button
        ref={btnRef}
        onClick={() => setProfileOpen(!profileOpen)}
        className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center hover:ring-1 hover:ring-[#091540] transition"
        aria-label="Abrir menú de perfil"
      >
        <User size={20} className="" />
      </button>

      {profileOpen &&
        createPortal(
          <>
            {/* Backdrop para cerrar y garantizar clics */}
            <div
              className="fixed inset-0 z-[1000]"
              onMouseDown={() => setProfileOpen(false)}
            />

            {/* Dropdown fijo en pantalla, por encima de todo */}
            <div
              className="fixed z-[1001] w-44 bg-[#F9F5FF] border rounded shadow-lg"
              style={{ top: pos.top, right: pos.right }}
              onMouseDown={(e) => e.stopPropagation()} // evita cerrar al clicar dentro
            >
              <ul className="py-1 text-sm text-gray-700">
                <li>
                  <button
                    onMouseDown={() => navigate({to: '/dashboard/users/profile'})}
                    className="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                  >
                    <User size={16} /> Mi perfil
                  </button>
                </li>
                {/* <li>
                  <button
                    onMouseDown={() => go("/dashboard/settings")}
                    className="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                  >
                    <Settings size={16} /> Ajustes
                  </button>
                </li> */}
                <li>
                  <button
                    onMouseDown={() => {
                      localStorage.removeItem('token')
                      navigate({to: '/login'})
                      setProfileOpen(false);
                    }}
                    className="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-red-500"
                  >
                    <LogOut size={16} /> Cerrar sesión
                  </button>
                </li>
              </ul>
            </div>
          </>,
          document.body
        )}
    </div>
  );
}

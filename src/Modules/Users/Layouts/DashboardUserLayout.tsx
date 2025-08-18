import { useState } from "react";

import HeaderDashboardUser from "../Components/Header/HeaderDashboardUser";
import AsideDashboardUser from "../Components/Sidebar/AsideDashboardUser";
import Profile from "../Components/ProfileUser/Profile";

const DashboardUserLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#f9fafb] overflow-hidden relative">
      {/* Sidebar Desktop */}
      <aside className="w-[250px] hidden md:flex flex-col bg-white border-r border-gray-200">
        <AsideDashboardUser />
      </aside>

      {/* Sidebar Mobile */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
        ${menuOpen ? "translate-x-0" : "-translate-x-full"} md:hidden`}
      >
        <AsideDashboardUser />
      </aside>

      {/* Overlay */}
      {(menuOpen || profileOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setMenuOpen(false);
            setProfileOpen(false);
          }}
        />
      )}

      {/* Contenido */}
      <div className="flex flex-col flex-1">
        <HeaderDashboardUser
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          profileOpen={profileOpen}
          setProfileOpen={setProfileOpen}
        />
        <main className="flex-1 p-6 overflow-y-auto">
          <Profile/>
        </main>
      </div>
    </div>
  );
};

export default DashboardUserLayout;
import { useState } from "react";

import HeaderDashboard from "../Components/Header/HeaderDashboard";
import MainDashboard from "../Components/MainDashboard";
import AsideDashboard from "../Components/Sidebard/AsideDashboard";

const DashboardLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#f9fafb] relative">

      {/* Sidebar (desktop) */}
      <aside className="w-[250px] hidden md:flex flex-col bg-white border-r border-gray-200">
        <AsideDashboard />
      </aside>

      {/* Sidebar (mobile drawer) */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
        ${menuOpen ? "translate-x-0" : "-translate-x-full"} md:hidden`}
      >
        <AsideDashboard />
      </aside>

      {/* Overlay para sidebar y perfil */}
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
        <HeaderDashboard
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          profileOpen={profileOpen}
          setProfileOpen={setProfileOpen}
        />
        <main className="flex-1 p-6 overflow-y-auto">
          <MainDashboard />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

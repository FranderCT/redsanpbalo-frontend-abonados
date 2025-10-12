import { useState } from "react";
import AsideDashboard from "../../Dashboard/Components/Sidebar/AsideDashboard";
import HeaderDashboard from "../../Dashboard/Components/Header/HeaderDashboard";
import { Outlet } from "@tanstack/react-router";
import LiveReports from "../../../Sockets/LiveReports";

const DashboardLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#F9F5FF] overflow-hidden relative">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col bg-white border-r border-gray-200">
        <AsideDashboard />
      </aside>

      {/* Sidebar Mobile */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-56 bg-white border-r border-gray-200 transform transition-transform duration-300 
        ${menuOpen ? "translate-x-0" : "-translate-x-full"} md:hidden`}
      >
        <AsideDashboard />
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
        <HeaderDashboard
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          profileOpen={profileOpen}
          setProfileOpen={setProfileOpen}
        />
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet/>
          <LiveReports />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
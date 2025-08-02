import AsideDashboard from "../Components/AsideDashboard"
import HeaderDashboard from "../Components/HeaderDashboard"
import MainDashboard from "../Components/MainDashboard"


const DashboardLayout = () => {
  return (
    <div className="grid grid-cols-[15%_1fr] grid-rows-[7%_93%] h-screen ">
      
      {/* Sidebar completo */}
      <aside className="col-start-1 row-span-2 bg-[#f5f1ff] border-r border-gray-200 h-full">
        <AsideDashboard />
      </aside>

      {/* Header encima del contenido */}
      <header className="col-start-2 row-start-1 bg-amber-400 shadow-md flex items-center px-6 h-full">
        <HeaderDashboard />
      </header>

      {/* Main justo debajo del header */}
      <main className="col-start-2 row-start-2 bg-gray-50 px-6 py-4 h-full">
        <MainDashboard />
      </main>
    </div>
  );
};

export default DashboardLayout;



import { Outlet } from "react-router-dom";
import SideBar from "../../pages/student/SideBar";

function DashboardLayout() {
  return (
    <div className="min-h-screen bg-[#F7F8FC] lg:flex">

      {/* =====================================
          SIDEBAR
      ===================================== */}

      <SideBar />

      {/* =====================================
          MAIN CONTENT
      ===================================== */}

      <main className="min-w-0 flex-1">

        {/* Mobile top-bar spacing */}
        <div className="h-16 lg:hidden" />

        <Outlet />

      </main>

    </div>
  );
}

export default DashboardLayout;
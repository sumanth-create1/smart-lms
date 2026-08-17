import { Outlet } from "react-router-dom";
import SideBar from "../../pages/student/SideBar";
import DashboardHeader from "../../pages/student/DashboardHeader";

function DashboardLayout() {
  return (
    <div className="min-h-screen bg-[#F7F8FC]">

      {/* =========================================
          FIXED SIDEBAR
      ========================================= */}
      <SideBar />

      {/* =========================================
          MAIN AREA
          IMPORTANT:
          lg:ml-[270px] reserves sidebar width
      ========================================= */}
      <div
        className="
          min-h-screen
          lg:ml-[270px]
          transition-[margin]
          duration-300
        "
      >

        {/* =======================================
            FIXED HEADER
        ======================================== */}
        <DashboardHeader />

        {/* =======================================
            DASHBOARD CONTENT
        ======================================== */}
        <main
          className="
            min-h-[calc(100vh-72px)]
            w-full
            px-4
            py-6
            sm:px-6
            lg:px-8
            xl:px-10
          "
        >
          <div
            className="
              mx-auto
              w-full
              max-w-[1500px]
            "
          >
            <Outlet />
          </div>
        </main>

      </div>

    </div>
  );
}

export default DashboardLayout;
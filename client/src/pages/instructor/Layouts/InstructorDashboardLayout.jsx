import { Outlet } from "react-router-dom";
import DashboardHeader from "../dashboardComponents/DashboardHeader";

function InstructorDashboardLayout() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#070605] text-white">

      {/* =====================================================
          GLOBAL BACKGROUND ATMOSPHERE
      ===================================================== */}

      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">

        {/* Top orange glow */}

        <div className="absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full bg-orange-600/[0.045] blur-[160px]" />

        {/* Right gold glow */}

        <div className="absolute -right-40 top-[10%] h-[600px] w-[600px] rounded-full bg-amber-500/[0.025] blur-[170px]" />

        {/* Bottom orange glow */}

        <div className="absolute bottom-[-300px] left-[30%] h-[650px] w-[650px] rounded-full bg-orange-700/[0.025] blur-[180px]" />

      </div>

      {/* =====================================================
          SUBTLE GRID
      ===================================================== */}

      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "70px 70px",
        }}
      />

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="relative z-50">
        <DashboardHeader />
      </div>

      {/* =====================================================
          PAGE CONTENT
      ===================================================== */}

      <main className="relative z-10">
        <Outlet />
      </main>

    </div>
  );
}

export default InstructorDashboardLayout;
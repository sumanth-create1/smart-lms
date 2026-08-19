import { Outlet } from "react-router-dom";
import DashboardHeader from "../DashboardHeader";

function InstructorDashboardLayout() {
  return (
    <div className="min-h-screen bg-[#F7F6F2]">
      <DashboardHeader />

      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default InstructorDashboardLayout;
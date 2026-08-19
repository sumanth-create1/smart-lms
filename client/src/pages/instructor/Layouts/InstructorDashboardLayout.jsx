import { Outlet } from "react-router-dom";

function InstructorDashboardLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Outlet />
    </div>
  );
}

export default InstructorDashboardLayout;
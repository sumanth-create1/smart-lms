import { Outlet } from "react-router-dom";
import StudentSidebar from "../components/student/StudentSidebar";
import StudentHeader from "../components/student/StudentHeader";

function StudentDashboardLayout() {
  return (
    <div className="min-h-screen bg-[#06080a] text-slate-200">
      {/* Sidebar */}
      <StudentSidebar />

      {/* Main Area */}
      <div className="lg:ml-72">
        {/* Header */}
        <StudentHeader />

        {/* Page Content */}
        <main className="pt-[72px]">
          <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default StudentDashboardLayout;
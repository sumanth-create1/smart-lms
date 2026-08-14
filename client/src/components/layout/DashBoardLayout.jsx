import Sidebar from "../common/SideBar"

function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#F7F6F2]">
      
      <Sidebar />

      <main
        className="
          min-h-screen
          transition-all
          duration-300
          lg:pl-[82px]
        "
      >
        {children}
      </main>

    </div>
  );
}

export default DashboardLayout;
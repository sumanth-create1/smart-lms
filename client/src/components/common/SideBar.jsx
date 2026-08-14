import Sidebar from "../../components/common/Sidebar";
import { useAuth } from "../../context/AuthContext";

function UserDashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#F7F6F2]">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN AREA */}
      <main
        className="
          min-h-screen
          transition-all
          duration-300
          lg:pl-[82px]
        "
      >

        {/* Your dashboard content here */}

      </main>
    </div>
  );
}

export default UserDashboard;
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  TrendingUp,
  Trophy,
  Settings,
  LogOut,
  GraduationCap,
} from "lucide-react";

import { useAuth } from "../../../../context/AuthContext";

function StudentSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navigation = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "My Courses",
      path: "/courses",
      icon: BookOpen,
    },
    {
      name: "Progress",
      path: "/progress",
      icon: TrendingUp,
    },
    {
      name: "Achievements",
      path: "/achievements",
      icon: Trophy,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: Settings,
    },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <aside
      className="
        fixed
        inset-y-0
        left-0
        z-50
        hidden
        w-64
        flex-col
        border-r
        border-slate-200
        bg-white
        lg:flex
      "
    >
      {/* Logo */}
      <div className="flex h-[72px] items-center border-b border-slate-100 px-6">
        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
            <GraduationCap size={22} />
          </div>

          <div>
            <h1 className="text-base font-bold tracking-tight text-slate-900">
              Smart LMS
            </h1>

            <p className="text-[11px] text-slate-400">
              Student Portal
            </p>
          </div>

        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto !px-6 !py-7">

        <p className="!mb-4 !px-2 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
          Menu
        </p>

        <div className="flex flex-col !gap-2">

          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  !relative
                  !flex
                  !h-12
                  !w-full
                  !items-center
                  !gap-4
                  !rounded-xl
                  !px-4
                  text-[14px]
                  font-medium
                  transition-all
                  duration-200

                  ${
                    isActive
                      ? "!bg-indigo-50 !text-indigo-600"
                      : "!text-slate-500 hover:!bg-slate-50 hover:!text-slate-900"
                  }
                `}
              >
                {({ isActive }) => (
                  <>
                    {/* Active indicator */}
                    {isActive && (
                      <span className="absolute left-1 top-1/2 h-6 w-1 -translate-y-1/2 rounded-full bg-indigo-600" />
                    )}

                    {/* Icon */}
                    <span className="ml-1 flex h-6 w-6 shrink-0 items-center justify-center">
                      <Icon
                        size={20}
                        strokeWidth={isActive ? 2.3 : 2}
                        className={
                          isActive
                            ? "text-indigo-600"
                            : "text-slate-400"
                        }
                      />
                    </span>

                    {/* Label */}
                    <span className="ml-1 whitespace-nowrap">
                      {item.name}
                    </span>
                  </>
                )}
              </NavLink>
            );
          })}

        </div>
      </nav>

      {/* User Section */}
      <div className="border-t border-slate-100 p-4">

        <div className="flex items-center gap-3 rounded-xl p-2">

          {/* Avatar */}
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-600">
            {user?.name?.charAt(0)?.toUpperCase() || "S"}
          </div>

          {/* User Info */}
          <div className="min-w-0 flex-1">

            <p className="truncate text-sm font-semibold text-slate-800">
              {user?.name || "Student"}
            </p>

            <p className="text-xs text-slate-400">
              Student
            </p>

          </div>

        </div>

        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          className="
            mt-2
            flex
            h-10
            w-full
            items-center
            gap-3
            rounded-xl
            px-3
            text-sm
            font-medium
            text-slate-500
            transition
            hover:bg-red-50
            hover:text-red-500
          "
        >
          <LogOut size={18} />

          Logout
        </button>

      </div>
    </aside>
  );
}

export default StudentSidebar;
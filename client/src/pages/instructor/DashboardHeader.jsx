import { useState } from "react";
import {
  Bell,
  BookOpen,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Settings,
  User,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

function DashboardHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const firstName =
    user?.name?.split(" ")[0] || "Instructor";

  const handleLogout = async () => {
    setOpen(false);

    await logout();

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-6 lg:px-8">

        {/* =========================================
            LOGO
        ========================================= */}
        <button
          type="button"
          onClick={() => navigate("/instructor/dashboard")}
          className="flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
            <BookOpen size={21} />
          </div>

          <div className="hidden sm:block text-left">
            <p className="text-lg font-bold tracking-tight text-gray-900">
              Smart LMS
            </p>

            <p className="text-xs text-gray-500">
              Instructor Portal
            </p>
          </div>
        </button>

        {/* =========================================
            NAVIGATION
        ========================================= */}
        <nav className="hidden items-center gap-1 lg:flex">

          <NavButton
            icon={<LayoutDashboard size={17} />}
            label="Dashboard"
            onClick={() =>
              navigate("/instructor/dashboard")
            }
          />

          <NavButton
            icon={<BookOpen size={17} />}
            label="Courses"
            onClick={() =>
              navigate("/instructor/courses")
            }
          />

          <NavButton
            icon={<Users size={17} />}
            label="Students"
            onClick={() =>
              navigate("/instructor/students")
            }
          />
        </nav>

        {/* =========================================
            RIGHT SIDE
        ========================================= */}
        <div className="flex items-center gap-2">

          {/* Notifications */}
          <button
            type="button"
            className="relative rounded-xl p-2.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
          >
            <Bell size={20} />

            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
          </button>

          {/* Profile */}
          <div className="relative">

            <button
              type="button"
              onClick={() =>
                setOpen((previous) => !previous)
              }
              className="flex items-center gap-3 rounded-xl px-2 py-2 transition hover:bg-gray-50"
            >

              {/* Avatar */}
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-600">
                  {user?.name
                    ?.charAt(0)
                    ?.toUpperCase() || "I"}
                </div>
              )}

              <div className="hidden text-left md:block">
                <p className="max-w-[140px] truncate text-sm font-semibold text-gray-900">
                  {firstName}
                </p>

                <p className="text-xs text-gray-500">
                  Instructor
                </p>
              </div>

              <ChevronDown
                size={17}
                className={`hidden text-gray-400 transition md:block ${
                  open ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* =====================================
                PROFILE DROPDOWN
            ===================================== */}
            {open && (
              <div className="absolute right-0 mt-3 w-64 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">

                {/* User Info */}
                <div className="border-b border-gray-100 px-4 py-4">
                  <p className="truncate text-sm font-semibold text-gray-900">
                    {user?.name || "Instructor"}
                  </p>

                  <p className="mt-1 truncate text-xs text-gray-500">
                    {user?.email || ""}
                  </p>
                </div>

                <div className="p-2">

                  {/* Profile */}
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      navigate("/instructor/profile");
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    <User size={18} />

                    My Profile
                  </button>

                  {/* Settings */}
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      navigate("/instructor/settings");
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    <Settings size={18} />

                    Settings
                  </button>

                  <div className="my-2 border-t border-gray-100" />

                  {/* Logout */}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                  >
                    <LogOut size={18} />

                    Logout
                  </button>

                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

/* ============================================
   NAV BUTTON
============================================ */

function NavButton({
  icon,
  label,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        inline-flex
        items-center
        gap-2
        rounded-xl
        px-4
        py-2.5
        text-sm
        font-medium
        text-gray-600
        transition
        hover:bg-indigo-50
        hover:text-indigo-600
      "
    >
      {icon}
      {label}
    </button>
  );
}

export default DashboardHeader;
import { useState } from "react";
import {
  BarChart3,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Crown,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

function SideBar() {
  const { user, logout } = useAuth();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const userName = user?.name || "Student";
  const userRole = user?.role || "student";

  const avatarLetter =
    userName.charAt(0).toUpperCase();

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
      icon: BarChart3,
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
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      {/* =========================================
          MOBILE HEADER
      ========================================= */}

      <div className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:hidden">

        <div className="flex items-center gap-2.5">

          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600">
            <BookOpen size={19} className="text-white" />
          </div>

          <span className="font-bold text-slate-900">
            Smart LMS
          </span>

        </div>

        <button
          onClick={() => setMobileOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100"
        >
          <Menu size={21} />
        </button>

      </div>

      {/* =========================================
          MOBILE OVERLAY
      ========================================= */}

      {mobileOpen && (
        <button
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          aria-label="Close menu"
        />
      )}

      {/* =========================================
          SIDEBAR
      ========================================= */}

      <aside
        className={`
          sticky
          top-0
          z-50
          flex
          h-screen
          shrink-0
          flex-col
          border-r
          border-slate-800
          bg-[#0B1220]
          text-white
          transition-all
          duration-300
          ease-in-out

          ${collapsed ? "lg:w-[76px]" : "lg:w-[235px]"}

          ${mobileOpen
            ? "fixed left-0 w-[250px] translate-x-0"
            : "fixed left-0 w-[250px] -translate-x-full lg:static lg:translate-x-0"
          }
        `}
      >

        {/* =========================================
            BRAND
        ========================================= */}

        <div
          className={`
            flex
            h-[82px]
            shrink-0
            items-center
            border-b
            border-slate-800
            ${collapsed
              ? "justify-center"
              : "justify-between px-5"
            }
          `}
        >

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/20">
              <BookOpen size={21} />
            </div>

            {!collapsed && (
              <div>

                <h1 className="text-lg font-bold tracking-tight">
                  Smart LMS
                </h1>

                <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.15em] text-slate-500">
                  Learning Platform
                </p>

              </div>
            )}

          </div>

          {/* Mobile close */}

          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden"
          >
            <X size={20} />
          </button>

        </div>

        {/* =========================================
            NAVIGATION
        ========================================= */}

        <nav
          className={`
            flex-1
            overflow-y-auto
            ${collapsed ? "px-2" : "px-3"}
            py-7
          `}
        >

          {!collapsed && (
            <p className="mb-4 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
              Main Menu
            </p>
          )}

          <div className="space-y-2">

            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  title={collapsed ? item.name : ""}
                  className={({ isActive }) =>
                    `
                    group
                    flex
                    h-11
                    items-center
                    rounded-xl
                    transition-all
                    duration-200

                    ${collapsed
                      ? "justify-center"
                      : "gap-3 px-3.5"
                    }

                    ${
                      isActive
                        ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-900/30"
                        : "text-slate-400 hover:bg-white/[0.06] hover:text-white"
                    }
                    `
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        size={19}
                        strokeWidth={isActive ? 2.4 : 2}
                        className="shrink-0"
                      />

                      {!collapsed && (
                        <span className="text-sm font-medium">
                          {item.name}
                        </span>
                      )}

                      {!collapsed && isActive && (
                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white" />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}

          </div>
        </nav>

        {/* =========================================
            BOTTOM AREA
        ========================================= */}

        <div
          className={`
            shrink-0
            border-t
            border-slate-800
            ${collapsed ? "p-2" : "p-3"}
          `}
        >

          {/* =====================================
              PRO CARD
          ===================================== */}

          {!collapsed && (
            <div className="mb-3 rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-600/15 to-violet-600/5 p-3.5">

              <div className="flex items-center gap-2">

                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/15">
                  <Crown
                    size={16}
                    className="text-amber-400"
                  />
                </div>

                <span className="text-sm font-semibold">
                  Upgrade to Pro
                </span>

              </div>

              <p className="mt-2 text-[10px] leading-4 text-slate-500">
                Unlock advanced learning features.
              </p>

              <button className="mt-3 w-full rounded-lg bg-indigo-600 py-2 text-xs font-semibold transition hover:bg-indigo-500">
                Upgrade Now
              </button>

            </div>
          )}

          {/* =====================================
              PROFILE
          ===================================== */}

          <div
            className={`
              rounded-xl
              border
              border-slate-800
              bg-white/[0.03]
              ${collapsed ? "p-2" : "p-2.5"}
            `}
          >

            <div
              className={`
                flex
                items-center
                ${collapsed
                  ? "justify-center"
                  : "gap-3"
                }
              `}
            >

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-xs font-bold">
                {avatarLetter}
              </div>

              {!collapsed && (
                <div className="min-w-0">

                  <p className="truncate text-xs font-semibold text-white">
                    {userName}
                  </p>

                  <p className="mt-0.5 text-[10px] capitalize text-slate-500">
                    {userRole}
                  </p>

                </div>
              )}

            </div>

            {/* Logout */}

            <button
              onClick={handleLogout}
              title={collapsed ? "Logout" : ""}
              className={`
                mt-2
                flex
                w-full
                items-center
                rounded-lg
                py-2
                text-xs
                font-medium
                text-slate-500
                transition
                hover:bg-red-500/10
                hover:text-red-400
                ${collapsed
                  ? "justify-center"
                  : "gap-2 px-2"
                }
              `}
            >

              <LogOut size={15} />

              {!collapsed && (
                <span>
                  Logout
                </span>
              )}

            </button>

          </div>

        </div>

        {/* =========================================
            COLLAPSE BUTTON
        ========================================= */}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="
            absolute
            -right-3
            top-[88px]
            hidden
            h-7
            w-7
            items-center
            justify-center
            rounded-full
            border
            border-slate-700
            bg-[#0B1220]
            text-slate-400
            shadow-md
            transition
            hover:bg-indigo-600
            hover:text-white
            lg:flex
          "
        >
          {collapsed ? (
            <ChevronRight size={14} />
          ) : (
            <ChevronLeft size={14} />
          )}
        </button>

      </aside>
    </>
  );
}

export default SideBar;
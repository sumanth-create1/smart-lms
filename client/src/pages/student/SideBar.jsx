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
  Sparkles,
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

  const avatarLetter = userName.charAt(0).toUpperCase();

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
      {/* =====================================================
          MOBILE HEADER
      ===================================================== */}

      <div
        className="
          fixed
          left-0
          right-0
          top-0
          z-40
          flex
          h-16
          items-center
          justify-between
          border-b
          border-slate-200
          bg-white
          px-4
          lg:hidden
        "
      >
        <div className="flex items-center gap-3">

          <div
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-xl
              bg-gradient-to-br
              from-indigo-600
              to-violet-600
              text-white
            "
          >
            <BookOpen size={19} />
          </div>

          <div>
            <p className="text-sm font-bold text-slate-900">
              Smart LMS
            </p>

            <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
              Learning Platform
            </p>
          </div>

        </div>

        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            border
            border-slate-200
            text-slate-600
            transition
            hover:bg-slate-50
          "
        >
          <Menu size={20} />
        </button>
      </div>

      {/* =====================================================
          MOBILE OVERLAY
      ===================================================== */}

      {mobileOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setMobileOpen(false)}
          className="
            fixed
            inset-0
            z-40
            bg-black/40
            lg:hidden
          "
        />
      )}

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside
        className={`
          fixed
          inset-y-0
          left-0
          z-50
          flex
          h-screen
          flex-col
          bg-[#0B1220]
          text-white
          shadow-xl
          transition-all
          duration-300

          ${
            collapsed
              ? "lg:w-[88px]"
              : "lg:w-[270px]"
          }

          ${
            mobileOpen
              ? "w-[285px] translate-x-0"
              : "w-[285px] -translate-x-full lg:translate-x-0"
          }
        `}
      >

        {/* =================================================
            BRAND
        ================================================= */}

        <div
          className={`
            flex
            h-[82px]
            shrink-0
            items-center
            border-b
            border-white/10

            ${
              collapsed
                ? "justify-center"
                : "justify-between px-5"
            }
          `}
        >

          <div className="flex items-center gap-3">

            <div
              className="
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-2xl
                bg-gradient-to-br
                from-indigo-500
                to-violet-600
                shadow-lg
                shadow-indigo-900/30
              "
            >
              <BookOpen size={22} />
            </div>

            {!collapsed && (
              <div>
                <h1 className="text-lg font-bold tracking-tight">
                  Smart LMS
                </h1>

                <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Learning Platform
                </p>
              </div>
            )}

          </div>

          {/* Mobile close */}

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-lg
              text-slate-400
              hover:bg-white/5
              hover:text-white
              lg:hidden
            "
          >
            <X size={20} />
          </button>

        </div>

        {/* =================================================
            USER PROFILE
        ================================================= */}

        <div className="px-4 pt-5">

          <div
            className={`
              flex
              rounded-2xl
              border
              border-white/[0.07]
              bg-white/[0.04]

              ${
                collapsed
                  ? "justify-center p-2"
                  : "items-center gap-3 p-3"
              }
            `}
          >

            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-gradient-to-br
                from-indigo-500
                to-violet-600
                text-sm
                font-bold
              "
            >
              {avatarLetter}
            </div>

            {!collapsed && (
              <div className="min-w-0">

                <p className="truncate text-sm font-semibold">
                  {userName}
                </p>

                <p className="mt-0.5 text-[11px] capitalize text-slate-500">
                  {userRole}
                </p>

              </div>
            )}

          </div>

        </div>

        {/* =================================================
            NAVIGATION
        ================================================= */}

        <nav
          className={`
            flex-1
            overflow-y-auto
            py-8

            ${
              collapsed
                ? "px-3"
                : "px-4"
            }
          `}
        >

          {!collapsed && (
            <p className="mb-4 px-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
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
                  title={collapsed ? item.name : undefined}
                  className={({ isActive }) => `
                    group
                    relative
                    flex
                    min-h-[54px]
                    w-full
                    items-center
                    rounded-2xl
                    transition-all
                    duration-200

                    ${
                      collapsed
                        ? "justify-center"
                        : "gap-3.5 px-3.5"
                    }

                    ${
                      isActive
                        ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-950/30"
                        : "text-slate-400 hover:bg-white/[0.06] hover:text-white"
                    }
                  `}
                >
                  {({ isActive }) => (
                    <>
                      {isActive && !collapsed && (
                        <span
                          className="
                            absolute
                            left-0
                            h-7
                            w-1
                            rounded-r-full
                            bg-white
                          "
                        />
                      )}

                      <div
                        className={`
                          flex
                          h-10
                          w-10
                          shrink-0
                          items-center
                          justify-center
                          rounded-xl

                          ${
                            isActive
                              ? "bg-white/15"
                              : "bg-white/[0.04] group-hover:bg-white/[0.08]"
                          }
                        `}
                      >
                        <Icon size={20} />
                      </div>

                      {!collapsed && (
                        <span className="text-sm font-semibold">
                          {item.name}
                        </span>
                      )}

                      {!collapsed && isActive && (
                        <ChevronRight
                          size={16}
                          className="ml-auto opacity-70"
                        />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}

          </div>
        </nav>

        {/* =================================================
            BOTTOM
        ================================================= */}

        <div
          className={`
            shrink-0
            border-t
            border-white/10

            ${
              collapsed
                ? "p-3"
                : "space-y-4 p-4"
            }
          `}
        >

          {!collapsed && (
            <div
              className="
                rounded-2xl
                border
                border-indigo-400/10
                bg-gradient-to-br
                from-indigo-500/10
                to-violet-500/[0.03]
                p-4
              "
            >

              <div className="flex items-center gap-3">

                <div
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-xl
                    bg-amber-400/10
                  "
                >
                  <Crown
                    size={17}
                    className="text-amber-400"
                  />
                </div>

                <div>

                  <div className="flex items-center gap-1.5">

                    <span className="text-sm font-bold">
                      Go Pro
                    </span>

                    <Sparkles
                      size={12}
                      className="text-violet-300"
                    />

                  </div>

                  <p className="mt-0.5 text-[10px] text-slate-500">
                    Unlock advanced features
                  </p>

                </div>

              </div>

              <button
                type="button"
                className="
                  mt-4
                  w-full
                  rounded-xl
                  bg-white
                  py-2.5
                  text-xs
                  font-bold
                  text-indigo-700
                  transition
                  hover:bg-indigo-50
                "
              >
                Upgrade Now
              </button>

            </div>
          )}

          {/* Logout */}

          <button
            type="button"
            onClick={handleLogout}
            title={collapsed ? "Logout" : undefined}
            className={`
              flex
              min-h-[52px]
              w-full
              items-center
              rounded-2xl
              border
              border-red-500/10
              bg-red-500/[0.04]
              text-sm
              font-semibold
              text-slate-400
              transition
              hover:bg-red-500/10
              hover:text-red-400

              ${
                collapsed
                  ? "justify-center"
                  : "gap-3 px-3"
              }
            `}
          >

            <div
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                bg-red-500/[0.08]
              "
            >
              <LogOut size={17} />
            </div>

            {!collapsed && (
              <span>
                Logout
              </span>
            )}

          </button>

        </div>

        {/* =================================================
            COLLAPSE
        ================================================= */}

        <button
          type="button"
          onClick={() => setCollapsed((value) => !value)}
          className="
            absolute
            -right-4
            top-[88px]
            hidden
            h-8
            w-8
            items-center
            justify-center
            rounded-full
            border
            border-slate-700
            bg-[#0B1220]
            text-slate-400
            shadow-lg
            transition
            hover:bg-indigo-600
            hover:text-white
            lg:flex
          "
        >
          {collapsed ? (
            <ChevronRight size={15} />
          ) : (
            <ChevronLeft size={15} />
          )}
        </button>

      </aside>
    </>
  );
}

export default SideBar;
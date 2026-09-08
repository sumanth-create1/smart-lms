import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  TrendingUp,
  Trophy,
  Settings,
  LogOut,
  GraduationCap,
  Flame,
  Crown,
  Sword,
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

  // =====================================================
  // LOGOUT
  // =====================================================

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
        overflow-hidden
        border-r
        border-zinc-800
        bg-[#090909]
        shadow-2xl
        lg:flex
      "
    >
      {/* =====================================================
          CINEMATIC BACKGROUND
      ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -right-24
          -top-24
          h-72
          w-72
          rounded-full
          bg-red-900/10
          blur-3xl
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-32
          -left-24
          h-72
          w-72
          rounded-full
          bg-amber-900/5
          blur-3xl
        "
      />

      {/* =====================================================
          BRAND
      ===================================================== */}

      <div
        className="
          relative
          flex
          h-[72px]
          items-center
          border-b
          border-zinc-800
          px-6
        "
      >
        <div className="flex items-center gap-3">
          {/* Dragon crest */}

          <div
            className="
              relative
              flex
              h-10
              w-10
              items-center
              justify-center
              overflow-hidden
              rounded-xl
              border
              border-red-700/40
              bg-gradient-to-br
              from-red-950
              via-zinc-900
              to-black
              text-red-500
              shadow-[0_0_25px_rgba(127,29,29,0.18)]
            "
          >
            <Flame
              size={22}
              strokeWidth={2.2}
            />

            <span
              className="
                absolute
                bottom-0
                left-0
                h-1
                w-full
                bg-gradient-to-r
                from-red-800
                via-red-500
                to-amber-500
              "
            />
          </div>

          {/* Brand */}

          <div>
            <h1
              className="
                text-base
                font-black
                uppercase
                tracking-tight
                text-white
              "
            >
              Smart LMS
            </h1>

            <div className="mt-0.5 flex items-center gap-1.5">
              <span className="h-px w-3 bg-red-600" />

              <p
                className="
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-[0.22em]
                  text-zinc-600
                "
              >
                House of Learning
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          HOUSE BANNER
      ===================================================== */}

      <div
        className="
          relative
          mx-4
          mt-5
          overflow-hidden
          rounded-xl
          border
          border-zinc-800
          bg-gradient-to-br
          from-red-950/30
          via-zinc-950
          to-black
          px-4
          py-4
        "
      >
        {/* Glow */}

        <div
          className="
            pointer-events-none
            absolute
            -right-8
            -top-8
            h-20
            w-20
            rounded-full
            bg-red-600/10
            blur-xl
          "
        />

        <div className="relative flex items-center gap-3">
          <div
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-lg
              bg-red-600/10
              text-red-500
            "
          >
            <Crown size={17} />
          </div>

          <div>
            <p
              className="
                text-[9px]
                font-black
                uppercase
                tracking-[0.2em]
                text-red-500
              "
            >
              Your House
            </p>

            <p
              className="
                mt-0.5
                text-xs
                font-bold
                text-zinc-300
              "
            >
              Knowledge & Power
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================
          NAVIGATION
      ===================================================== */}

      <nav className="relative flex-1 overflow-y-auto px-5 py-6">
        {/* Section title */}

        <div className="mb-4 flex items-center gap-2 px-2">
          <Sword
            size={11}
            className="text-red-600"
          />

          <p
            className="
              text-[9px]
              font-black
              uppercase
              tracking-[0.25em]
              text-zinc-600
            "
          >
            The Realm
          </p>

          <div className="h-px flex-1 bg-zinc-900" />
        </div>

        {/* Navigation */}

        <div className="flex flex-col gap-1.5">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  group
                  relative
                  flex
                  h-11
                  w-full
                  items-center
                  gap-3
                  overflow-hidden
                  rounded-lg
                  px-3
                  text-[12px]
                  font-bold
                  uppercase
                  tracking-wide
                  transition-all
                  duration-300

                  ${
                    isActive
                      ? "border border-red-900/40 bg-gradient-to-r from-red-950/50 to-transparent text-red-500"
                      : "border border-transparent text-zinc-600 hover:border-zinc-800 hover:bg-zinc-950 hover:text-zinc-300"
                  }
                `}
              >
                {({ isActive }) => (
                  <>
                    {/* Active glow */}

                    {isActive && (
                      <>
                        <span
                          className="
                            absolute
                            left-0
                            top-0
                            h-full
                            w-[2px]
                            bg-red-600
                            shadow-[0_0_12px_rgba(220,38,38,0.8)]
                          "
                        />

                        <span
                          className="
                            pointer-events-none
                            absolute
                            right-0
                            top-1/2
                            h-12
                            w-12
                            -translate-y-1/2
                            rounded-full
                            bg-red-600/5
                            blur-xl
                          "
                        />
                      </>
                    )}

                    {/* Icon */}

                    <span
                      className={`
                        relative
                        flex
                        h-7
                        w-7
                        shrink-0
                        items-center
                        justify-center
                        rounded-md
                        transition-all
                        duration-300

                        ${
                          isActive
                            ? "bg-red-600/10 text-red-500"
                            : "text-zinc-700 group-hover:bg-zinc-900 group-hover:text-zinc-400"
                        }
                      `}
                    >
                      <Icon
                        size={17}
                        strokeWidth={
                          isActive ? 2.4 : 1.9
                        }
                      />
                    </span>

                    {/* Label */}

                    <span className="relative whitespace-nowrap">
                      {item.name}
                    </span>

                    {/* Active arrow */}

                    {isActive && (
                      <span
                        className="
                          absolute
                          right-3
                          h-1
                          w-1
                          rounded-full
                          bg-red-500
                          shadow-[0_0_8px_rgba(239,68,68,0.8)]
                        "
                      />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* =====================================================
          HOUSE / USER SECTION
      ===================================================== */}

      <div
        className="
          relative
          border-t
          border-zinc-800
          p-4
        "
      >
        {/* User */}

        <div
          className="
            flex
            items-center
            gap-3
            rounded-xl
            border
            border-zinc-900
            bg-black/30
            p-3
          "
        >
          {/* Avatar */}

          <div
            className="
              relative
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              overflow-hidden
              rounded-lg
              border
              border-red-700/30
              bg-gradient-to-br
              from-zinc-800
              to-black
              text-sm
              font-black
              text-red-500
            "
          >
            {user?.name
              ?.charAt(0)
              ?.toUpperCase() || "S"}

            <span
              className="
                absolute
                bottom-0
                right-0
                h-1.5
                w-1.5
                bg-red-600
              "
            />
          </div>

          {/* User Info */}

          <div className="min-w-0 flex-1">
            <p
              className="
                truncate
                text-xs
                font-bold
                uppercase
                tracking-wide
                text-zinc-300
              "
            >
              {user?.name || "Student"}
            </p>

            <div className="mt-0.5 flex items-center gap-1.5">
              <span className="h-1 w-1 rounded-full bg-red-600" />

              <p
                className="
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-[0.18em]
                  text-zinc-600
                "
              >
                Warrior
              </p>
            </div>
          </div>
        </div>

        {/* Logout */}

        <button
          type="button"
          onClick={handleLogout}
          className="
            group
            mt-2
            flex
            h-10
            w-full
            items-center
            gap-3
            rounded-lg
            px-3
            text-[10px]
            font-black
            uppercase
            tracking-[0.18em]
            text-zinc-600
            transition-all
            duration-300
            hover:bg-red-950/20
            hover:text-red-500
          "
        >
          <LogOut
            size={16}
            className="
              transition-transform
              duration-300
              group-hover:translate-x-0.5
            "
          />

          Leave the House
        </button>
      </div>

      {/* =====================================================
          BOTTOM FIRE LINE
      ===================================================== */}

      <div
        className="
          absolute
          bottom-0
          left-0
          h-[2px]
          w-full
          bg-gradient-to-r
          from-red-900
          via-red-600
          to-amber-600
          opacity-80
        "
      />
    </aside>
  );
}

export default StudentSidebar;
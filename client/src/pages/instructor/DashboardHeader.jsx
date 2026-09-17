import { useEffect, useRef, useState } from "react";
import {
  Bell,
  BookOpen,
  ChevronDown,
  Crown,
  LayoutDashboard,
  LogOut,
  Settings,
  Shield,
  User,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

function DashboardHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const dropdownRef = useRef(null);

  const firstName =
    user?.name?.split(" ")[0] || "Instructor";

  /* =========================================
     CLOSE DROPDOWN WHEN CLICKING OUTSIDE
  ========================================= */

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  /* =========================================
     LOGOUT
  ========================================= */

  const handleLogout = async () => {
    setOpen(false);

    await logout();

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <>
      {/* =========================================
          HEADER
      ========================================= */}

      <header
        className="
          sticky top-0 z-50
          border-b border-[#3d2d1f]
          bg-[#0b0a09]/95
          backdrop-blur-xl
          shadow-[0_8px_30px_rgba(0,0,0,0.55)]
        "
      >
        {/* TOP GOLD LINE */}

        <div
          className="
            absolute
            left-0
            right-0
            top-0
            h-[2px]
            bg-gradient-to-r
            from-transparent
            via-[#c9a227]
            to-transparent
            opacity-80
          "
        />

        {/* SUBTLE RED GLOW */}

        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-0
            h-20
            w-[500px]
            -translate-x-1/2
            bg-red-900/10
            blur-3xl
          "
        />

        <div
          className="
            relative
            mx-auto
            flex
            h-20
            max-w-[1600px]
            items-center
            justify-between
            px-5
            lg:px-8
          "
        >
          {/* =========================================
              LOGO
          ========================================= */}

          <button
            type="button"
            onClick={() =>
              navigate("/instructor/dashboard")
            }
            className="
              group
              flex
              items-center
              gap-3
              outline-none
            "
          >
            {/* SIGIL */}

            <div
              className="
                relative
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                border
                border-[#8f7321]
                bg-gradient-to-br
                from-[#241b0d]
                via-[#120f0b]
                to-[#080706]
                text-[#d4af37]
                shadow-[0_0_20px_rgba(201,162,39,0.15)]
                transition
                duration-300
                group-hover:border-[#d4af37]
                group-hover:shadow-[0_0_25px_rgba(201,162,39,0.3)]
              "
            >
              {/* INNER BORDER */}

              <div
                className="
                  absolute
                  inset-[3px]
                  rounded-lg
                  border
                  border-[#5e4818]/70
                "
              />

              <Crown
                size={21}
                strokeWidth={1.8}
                className="
                  relative
                  z-10
                  transition
                  duration-500
                  group-hover:scale-110
                "
              />

              {/* SIGIL GLOW */}

              <div
                className="
                  absolute
                  inset-0
                  rounded-xl
                  bg-[#d4af37]/5
                  opacity-0
                  blur-md
                  transition
                  duration-300
                  group-hover:opacity-100
                "
              />
            </div>

            {/* BRAND */}

            <div className="hidden text-left sm:block">
              <p
                className="
                  text-[17px]
                  font-bold
                  tracking-[0.08em]
                  text-[#e8d8b0]
                "
              >
                SMART LMS
              </p>

              <div className="mt-0.5 flex items-center gap-2">
                <span
                  className="
                    h-px
                    w-5
                    bg-[#8f7321]
                  "
                />

                <p
                  className="
                    text-[10px]
                    font-medium
                    uppercase
                    tracking-[0.22em]
                    text-[#927f61]
                  "
                >
                  Instructor's Keep
                </p>
              </div>
            </div>
          </button>

          {/* =========================================
              NAVIGATION
          ========================================= */}

          <nav className="hidden items-center gap-1 lg:flex">
            <NavButton
              icon={<LayoutDashboard size={16} />}
              label="Dashboard"
              onClick={() =>
                navigate("/instructor/dashboard")
              }
            />

            <NavButton
              icon={<BookOpen size={16} />}
              label="Courses"
              onClick={() =>
                navigate("/instructor/courses")
              }
            />

            <NavButton
              icon={<Users size={16} />}
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
            {/* =====================================
                NOTIFICATION
            ===================================== */}

            <button
              type="button"
              className="
                group
                relative
                rounded-xl
                border
                border-transparent
                p-2.5
                text-[#8f8068]
                transition-all
                duration-300
                hover:border-[#4b3820]
                hover:bg-[#17120d]
                hover:text-[#d4af37]
              "
            >
              <Bell
                size={19}
                strokeWidth={1.8}
                className="
                  transition-transform
                  duration-300
                  group-hover:rotate-6
                "
              />

              {/* NOTIFICATION DOT */}

              <span
                className="
                  absolute
                  right-2
                  top-2
                  h-2
                  w-2
                  rounded-full
                  bg-[#9f1d20]
                  shadow-[0_0_8px_rgba(159,29,32,0.9)]
                "
              />

              {/* PULSE */}

              <span
                className="
                  absolute
                  right-[7px]
                  top-[7px]
                  h-3
                  w-3
                  animate-ping
                  rounded-full
                  bg-[#9f1d20]/30
                "
              />
            </button>

            {/* =====================================
                PROFILE
            ===================================== */}

            <div
              ref={dropdownRef}
              className="relative"
            >
              <button
                type="button"
                onClick={() =>
                  setOpen((previous) => !previous)
                }
                className="
                  group
                  flex
                  items-center
                  gap-3
                  rounded-xl
                  border
                  border-transparent
                  px-2
                  py-2
                  transition-all
                  duration-300
                  hover:border-[#44341f]
                  hover:bg-[#15110d]
                "
              >
                {/* AVATAR */}

                <div className="relative">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="
                        h-10
                        w-10
                        rounded-full
                        border
                        border-[#806720]
                        object-cover
                        shadow-[0_0_15px_rgba(201,162,39,0.12)]
                      "
                    />
                  ) : (
                    <div
                      className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-[#806720]
                        bg-gradient-to-br
                        from-[#4a3513]
                        via-[#21180d]
                        to-[#0c0a08]
                        text-sm
                        font-bold
                        text-[#d4af37]
                        shadow-[0_0_15px_rgba(201,162,39,0.12)]
                      "
                    >
                      {user?.name
                        ?.charAt(0)
                        ?.toUpperCase() || "I"}
                    </div>
                  )}

                  {/* ONLINE INDICATOR */}

                  <span
                    className="
                      absolute
                      bottom-0
                      right-0
                      h-2.5
                      w-2.5
                      rounded-full
                      border-2
                      border-[#0b0a09]
                      bg-[#628b45]
                      shadow-[0_0_7px_rgba(98,139,69,0.8)]
                    "
                  />
                </div>

                {/* USER DETAILS */}

                <div className="hidden text-left md:block">
                  <p
                    className="
                      max-w-[140px]
                      truncate
                      text-sm
                      font-semibold
                      text-[#e5d9bd]
                    "
                  >
                    {firstName}
                  </p>

                  <p
                    className="
                      mt-0.5
                      text-[10px]
                      uppercase
                      tracking-[0.18em]
                      text-[#88765c]
                    "
                  >
                    Instructor
                  </p>
                </div>

                <ChevronDown
                  size={16}
                  className={`
                    hidden
                    text-[#77684f]
                    transition
                    duration-300
                    md:block
                    ${open ? "rotate-180 text-[#d4af37]" : ""}
                  `}
                />
              </button>

              {/* =====================================
                  DROPDOWN
              ===================================== */}

              {open && (
                <div
                  className="
                    absolute
                    right-0
                    mt-3
                    w-72
                    overflow-hidden
                    rounded-2xl
                    border
                    border-[#4c3922]
                    bg-[#0d0b09]
                    shadow-[0_20px_60px_rgba(0,0,0,0.7)]
                    animate-[fadeIn_.18s_ease-out]
                  "
                >
                  {/* GOLD TOP BORDER */}

                  <div
                    className="
                      h-[2px]
                      bg-gradient-to-r
                      from-transparent
                      via-[#c9a227]
                      to-transparent
                    "
                  />

                  {/* USER INFO */}

                  <div
                    className="
                      relative
                      border-b
                      border-[#2b2117]
                      bg-gradient-to-br
                      from-[#17120d]
                      to-[#0c0a08]
                      px-4
                      py-5
                    "
                  >
                    {/* Decorative circle */}

                    <div
                      className="
                        absolute
                        right-4
                        top-3
                        opacity-10
                      "
                    >
                      <Shield size={55} />
                    </div>

                    <div className="relative z-10">
                      <div className="mb-2 flex items-center gap-2">
                        <Crown
                          size={14}
                          className="text-[#c9a227]"
                        />

                        <span
                          className="
                            text-[9px]
                            font-semibold
                            uppercase
                            tracking-[0.2em]
                            text-[#9d8250]
                          "
                        >
                          The Instructor
                        </span>
                      </div>

                      <p
                        className="
                          truncate
                          text-sm
                          font-semibold
                          text-[#eadfca]
                        "
                      >
                        {user?.name || "Instructor"}
                      </p>

                      <p
                        className="
                          mt-1
                          truncate
                          text-xs
                          text-[#766952]
                        "
                      >
                        {user?.email || ""}
                      </p>
                    </div>
                  </div>

                  {/* MENU */}

                  <div className="p-2">
                    <DropdownButton
                      icon={<User size={17} />}
                      label="My Profile"
                      onClick={() => {
                        setOpen(false);
                        navigate("/instructor/profile");
                      }}
                    />

                    <DropdownButton
                      icon={<Settings size={17} />}
                      label="Settings"
                      onClick={() => {
                        setOpen(false);
                        navigate("/instructor/settings");
                      }}
                    />

                    <div
                      className="
                        my-2
                        border-t
                        border-[#292017]
                      "
                    />

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="
                        flex
                        w-full
                        items-center
                        gap-3
                        rounded-xl
                        px-3
                        py-3
                        text-sm
                        font-medium
                        text-[#b96b6b]
                        transition-all
                        duration-300
                        hover:bg-[#291112]
                        hover:text-[#e08b8b]
                      "
                    >
                      <LogOut size={17} />

                      <span>Leave the Keep</span>
                    </button>
                  </div>

                  {/* BOTTOM DECORATION */}

                  <div
                    className="
                      flex
                      items-center
                      justify-center
                      gap-3
                      border-t
                      border-[#211a13]
                      px-4
                      py-3
                    "
                  >
                    <span className="h-px w-10 bg-[#3c2d1b]" />

                    <Shield
                      size={13}
                      className="text-[#725c2c]"
                    />

                    <span className="h-px w-10 bg-[#3c2d1b]" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* BOTTOM METAL LINE */}

        <div
          className="
            absolute
            bottom-0
            left-0
            right-0
            h-px
            bg-gradient-to-r
            from-transparent
            via-[#35281b]
            to-transparent
          "
        />
      </header>

      {/* =========================================
          ANIMATION
      ========================================= */}

      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(-6px) scale(0.98);
            }

            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `}
      </style>
    </>
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
        group
        relative
        inline-flex
        items-center
        gap-2
        rounded-xl
        border
        border-transparent
        px-4
        py-2.5
        text-sm
        font-medium
        text-[#8d806c]
        transition-all
        duration-300
        hover:border-[#44341f]
        hover:bg-[#17120d]
        hover:text-[#d4af37]
      "
    >
      {/* TOP GOLD ACCENT */}

      <span
        className="
          absolute
          left-1/2
          top-0
          h-[1px]
          w-0
          -translate-x-1/2
          bg-[#c9a227]
          transition-all
          duration-300
          group-hover:w-8
        "
      />

      <span
        className="
          transition-transform
          duration-300
          group-hover:scale-110
        "
      >
        {icon}
      </span>

      {label}
    </button>
  );
}

/* ============================================
   DROPDOWN BUTTON
============================================ */

function DropdownButton({
  icon,
  label,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        group
        flex
        w-full
        items-center
        gap-3
        rounded-xl
        px-3
        py-3
        text-sm
        font-medium
        text-[#a39784]
        transition-all
        duration-300
        hover:bg-[#1b160f]
        hover:text-[#d4af37]
      "
    >
      <span
        className="
          transition-transform
          duration-300
          group-hover:scale-110
        "
      >
        {icon}
      </span>

      {label}
    </button>
  );
}

export default DashboardHeader;
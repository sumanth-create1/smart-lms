import { useEffect, useRef, useState } from "react";
import {
  Bell,
  BookOpen,
  ChevronDown,
  Crown,
  Flame,
  LogOut,
  Plus,
  Settings,
  Sparkles,
  Swords,
  User,
  UserRound,
  X,
  Zap,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

function DashboardHeader({ user }) {
  const navigate = useNavigate();

  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);

  const notificationRef = useRef(null);
  const profileRef = useRef(null);
  const quickActionsRef = useRef(null);

  const firstName = user?.name?.split(" ")[0] || "Instructor";

  /* =====================================================
     CLOSE DROPDOWNS WHEN CLICKING OUTSIDE
  ===================================================== */

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationOpen(false);
      }

      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }

      if (
        quickActionsRef.current &&
        !quickActionsRef.current.contains(event.target)
      ) {
        setQuickActionsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /* =====================================================
     ESCAPE KEY
  ===================================================== */

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setNotificationOpen(false);
        setProfileOpen(false);
        setQuickActionsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  /* =====================================================
     LOGOUT
     
     NOTE:
     This only navigates to login.
     If you already have a logout API/function in AuthContext,
     connect it here instead.
  ===================================================== */

  const handleLogout = () => {
    setProfileOpen(false);

    navigate("/login");
  };

  return (
    <header className="relative z-[100] px-4 pt-4 sm:px-6 lg:px-8">

      {/* =====================================================
          MAIN HEADER
      ===================================================== */}

      <div
        className="
          group/header
          relative
          overflow-visible
          rounded-[28px]
          border border-orange-500/[0.12]
          bg-[#0b0806]/95
          shadow-[0_25px_80px_rgba(0,0,0,0.55)]
          backdrop-blur-2xl
        "
      >

        {/* =====================================================
            AMBIENT BACKGROUND
        ===================================================== */}

        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[28px]">

          {/* Orange glow */}

          <div
            className="
              absolute
              -left-32
              -top-40
              h-[420px]
              w-[420px]
              rounded-full
              bg-orange-600/[0.08]
              blur-[110px]
              transition-all
              duration-1000
              group-hover/header:bg-orange-600/[0.12]
            "
          />

          {/* Red Dragonstone glow */}

          <div
            className="
              absolute
              -right-32
              -top-32
              h-[420px]
              w-[420px]
              rounded-full
              bg-red-950/[0.22]
              blur-[120px]
            "
          />

          {/* Bottom fire */}

          <div
            className="
              absolute
              bottom-[-100px]
              left-1/2
              h-[220px]
              w-[600px]
              -translate-x-1/2
              rounded-full
              bg-orange-500/[0.04]
              blur-[100px]
            "
          />

          {/* Grid */}

          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)",
              backgroundSize: "45px 45px",
            }}
          />

          {/* Ember particles */}

          <div className="absolute left-[8%] top-[25%] h-1 w-1 animate-pulse rounded-full bg-orange-400 shadow-[0_0_12px_4px_rgba(251,146,60,.5)]" />

          <div
            className="
              absolute
              left-[25%]
              top-[70%]
              h-1
              w-1
              animate-pulse
              rounded-full
              bg-orange-300
              shadow-[0_0_12px_4px_rgba(251,146,60,.4)]
            "
          />

          <div
            className="
              absolute
              right-[30%]
              top-[20%]
              h-1
              w-1
              animate-pulse
              rounded-full
              bg-amber-400
              shadow-[0_0_12px_4px_rgba(251,191,36,.4)]
            "
          />

          <div
            className="
              absolute
              right-[10%]
              bottom-[25%]
              h-1
              w-1
              animate-pulse
              rounded-full
              bg-orange-400
              shadow-[0_0_12px_4px_rgba(251,146,60,.4)]
            "
          />

        </div>

        {/* =====================================================
            TOP CONTENT
        ===================================================== */}

        <div className="relative z-20 flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">

          {/* =====================================================
              BRAND / COMMAND CENTER
          ===================================================== */}

          <div className="flex min-w-0 items-center gap-4">

            {/* Crown */}

            <div
              className="
                relative
                hidden
                h-12
                w-12
                shrink-0
                items-center
                justify-center
                rounded-2xl
                border
                border-orange-500/20
                bg-gradient-to-br
                from-orange-500/[0.16]
                to-orange-950/[0.15]
                text-orange-300
                shadow-[0_0_35px_rgba(249,115,22,.08)]
                sm:flex
              "
            >

              <div
                className="
                  absolute
                  inset-1
                  rounded-xl
                  border
                  border-orange-400/[0.08]
                  animate-pulse
                "
              />

              <Crown
                size={21}
                className="relative z-10"
              />

            </div>

            {/* Title */}

            <div className="min-w-0">

              <div className="flex items-center gap-2">

                <p
                  className="
                    truncate
                    text-[10px]
                    font-black
                    uppercase
                    tracking-[0.28em]
                    text-orange-400
                    sm:text-[11px]
                  "
                >
                  Instructor Command
                </p>

                <span className="hidden h-1 w-1 rounded-full bg-orange-500 sm:block" />

                <span
                  className="
                    hidden
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-[0.2em]
                    text-stone-600
                    md:block
                  "
                >
                  Dragonstone
                </span>

              </div>

              <div className="mt-1 flex items-center gap-2">

                <span className="relative flex h-2 w-2">

                  <span
                    className="
                      absolute
                      inline-flex
                      h-full
                      w-full
                      animate-ping
                      rounded-full
                      bg-emerald-400
                      opacity-50
                    "
                  />

                  <span
                    className="
                      relative
                      h-2
                      w-2
                      rounded-full
                      bg-emerald-400
                    "
                  />

                </span>

                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-stone-600">
                  Realm Online
                </p>

              </div>

            </div>

          </div>

          {/* =====================================================
              RIGHT CONTROLS
          ===================================================== */}

          <div className="flex items-center gap-2">

            {/* =================================================
                QUICK ACTIONS
            ================================================= */}

            <div
              ref={quickActionsRef}
              className="relative hidden sm:block"
            >

              <button
                type="button"
                onClick={() =>
                  setQuickActionsOpen((previous) => !previous)
                }
                className="
                  group
                  flex
                  h-11
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-stone-800
                  bg-white/[0.025]
                  px-4
                  text-stone-500
                  transition-all
                  duration-300
                  hover:border-orange-500/25
                  hover:bg-orange-500/[0.05]
                  hover:text-orange-300
                "
              >

                <Zap
                  size={15}
                  className="
                    text-orange-400
                    transition-transform
                    duration-300
                    group-hover:scale-110
                  "
                />

                <span className="hidden text-[10px] font-bold uppercase tracking-[0.15em] lg:block">
                  Quick
                </span>

                <ChevronDown
                  size={13}
                  className={`transition-transform duration-300 ${
                    quickActionsOpen
                      ? "rotate-180"
                      : ""
                  }`}
                />

              </button>

              {quickActionsOpen && (
                <div
                  className="
                    absolute
                    right-0
                    top-[calc(100%+10px)]
                    w-64
                    overflow-hidden
                    rounded-2xl
                    border
                    border-orange-500/15
                    bg-[#100b08]/98
                    p-2
                    shadow-[0_25px_80px_rgba(0,0,0,.7)]
                    backdrop-blur-2xl
                  "
                >

                  <div className="px-3 py-2">

                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-600">
                      Command Actions
                    </p>

                  </div>

                  <QuickAction
                    to="/instructor/create-course"
                    icon={<Plus size={16} />}
                    title="Forge Course"
                    description="Create a new course"
                    onClick={() => setQuickActionsOpen(false)}
                  />

                  <QuickAction
                    to="/instructor/courses"
                    icon={<BookOpen size={16} />}
                    title="Manage Courses"
                    description="View your courses"
                    onClick={() => setQuickActionsOpen(false)}
                  />

                  <QuickAction
                    to="/instructor/students"
                    icon={<UserRound size={16} />}
                    title="Students"
                    description="View your students"
                    onClick={() => setQuickActionsOpen(false)}
                  />

                </div>
              )}

            </div>

            {/* =================================================
                CREATE COURSE
            ================================================= */}

            <Link
              to="/instructor/create-course"
              className="
                group
                hidden
                h-11
                items-center
                gap-2
                rounded-xl
                border
                border-orange-500/25
                bg-orange-500/[0.08]
                px-4
                text-orange-300
                shadow-[0_0_30px_rgba(249,115,22,.05)]
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:border-orange-400/50
                hover:bg-orange-500/[0.13]
                hover:shadow-[0_10px_40px_rgba(249,115,22,.12)]
                md:flex
              "
            >

              <Plus
                size={16}
                className="
                  transition-transform
                  duration-300
                  group-hover:rotate-90
                "
              />

              <span className="text-[10px] font-black uppercase tracking-[0.14em]">
                Forge Course
              </span>

            </Link>

            {/* =================================================
                NOTIFICATIONS
            ================================================= */}

            <div
              ref={notificationRef}
              className="relative"
            >

              <button
                type="button"
                aria-label="Notifications"
                aria-expanded={notificationOpen}
                onClick={() => {
                  setNotificationOpen((previous) => !previous);
                  setProfileOpen(false);
                  setQuickActionsOpen(false);
                }}
                className="
                  group
                  relative
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-stone-800
                  bg-white/[0.025]
                  text-stone-500
                  transition-all
                  duration-300
                  hover:border-orange-500/25
                  hover:bg-orange-500/[0.05]
                  hover:text-orange-300
                "
              >

                <Bell
                  size={17}
                  className="
                    transition-transform
                    duration-300
                    group-hover:-rotate-12
                  "
                />

                {/* Notification badge */}

                <span
                  className="
                    absolute
                    right-2
                    top-2
                    h-1.5
                    w-1.5
                    rounded-full
                    bg-orange-400
                    shadow-[0_0_10px_3px_rgba(251,146,60,.45)]
                  "
                />

              </button>

              {notificationOpen && (
                <div
                  className="
                    absolute
                    right-0
                    top-[calc(100%+10px)]
                    w-80
                    overflow-hidden
                    rounded-2xl
                    border
                    border-orange-500/15
                    bg-[#100b08]/98
                    shadow-[0_25px_80px_rgba(0,0,0,.7)]
                    backdrop-blur-2xl
                  "
                >

                  <div className="flex items-center justify-between border-b border-stone-800/80 px-4 py-4">

                    <div>

                      <p className="text-xs font-bold text-stone-200">
                        Notifications
                      </p>

                      <p className="mt-1 text-[9px] uppercase tracking-[0.15em] text-stone-600">
                        Realm activity
                      </p>

                    </div>

                    <button
                      type="button"
                      onClick={() => setNotificationOpen(false)}
                      className="text-stone-600 transition hover:text-orange-300"
                    >
                      <X size={15} />
                    </button>

                  </div>

                  <div className="p-2">

                    <NotificationItem
                      icon={<Sparkles size={15} />}
                      title="Welcome back"
                      description="Your command center is ready."
                    />

                    <NotificationItem
                      icon={<Flame size={15} />}
                      title="Keep the realm growing"
                      description="Create your next course and continue building."
                    />

                    <NotificationItem
                      icon={<Crown size={15} />}
                      title="Instructor mode active"
                      description="Your instructor dashboard is online."
                    />

                  </div>

                </div>
              )}

            </div>

            {/* =================================================
                PROFILE
            ================================================= */}

            <div
              ref={profileRef}
              className="relative"
            >

              <button
                type="button"
                onClick={() => {
                  setProfileOpen((previous) => !previous);
                  setNotificationOpen(false);
                  setQuickActionsOpen(false);
                }}
                className="
                  group
                  flex
                  h-11
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-stone-800
                  bg-white/[0.025]
                  px-2
                  pr-3
                  transition-all
                  duration-300
                  hover:border-orange-500/25
                  hover:bg-orange-500/[0.05]
                "
              >

                {/* Avatar */}

                <div
                  className="
                    relative
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    overflow-hidden
                    rounded-lg
                    border
                    border-orange-500/20
                    bg-gradient-to-br
                    from-orange-500/20
                    to-red-950/30
                    text-orange-300
                  "
                >

                  {user?.avatar?.url ? (
                    <img
                      src={user.avatar.url}
                      alt={firstName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User size={15} />
                  )}

                </div>

                {/* Name */}

                <div className="hidden text-left md:block">

                  <p className="max-w-[100px] truncate text-[10px] font-bold text-stone-300">
                    {firstName}
                  </p>

                  <p className="text-[8px] uppercase tracking-[0.15em] text-stone-600">
                    Instructor
                  </p>

                </div>

                <ChevronDown
                  size={13}
                  className={`text-stone-600 transition-transform duration-300 ${
                    profileOpen
                      ? "rotate-180"
                      : ""
                  }`}
                />

              </button>

              {profileOpen && (
                <div
                  className="
                    absolute
                    right-0
                    top-[calc(100%+10px)]
                    w-60
                    overflow-hidden
                    rounded-2xl
                    border
                    border-orange-500/15
                    bg-[#100b08]/98
                    p-2
                    shadow-[0_25px_80px_rgba(0,0,0,.7)]
                    backdrop-blur-2xl
                  "
                >

                  {/* Profile header */}

                  <div className="mb-2 rounded-xl border border-stone-800/70 bg-white/[0.02] p-3">

                    <div className="flex items-center gap-3">

                      <div
                        className="
                          flex
                          h-10
                          w-10
                          items-center
                          justify-center
                          overflow-hidden
                          rounded-xl
                          border
                          border-orange-500/20
                          bg-orange-500/[0.08]
                          text-orange-300
                        "
                      >

                        {user?.avatar?.url ? (
                          <img
                            src={user.avatar.url}
                            alt={firstName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <User size={17} />
                        )}

                      </div>

                      <div className="min-w-0">

                        <p className="truncate text-xs font-bold text-stone-200">
                          {user?.name || "Instructor"}
                        </p>

                        <p className="truncate text-[9px] text-stone-600">
                          {user?.email || "Instructor account"}
                        </p>

                      </div>

                    </div>

                  </div>

                  <ProfileMenuItem
                    to="/instructor/profile"
                    icon={<User size={15} />}
                    label="My Profile"
                    onClick={() => setProfileOpen(false)}
                  />

                  <ProfileMenuItem
                    to="/instructor/profile"
                    icon={<Settings size={15} />}
                    label="Settings"
                    onClick={() => setProfileOpen(false)}
                  />

                  <div className="my-2 h-px bg-stone-800/70" />

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
                      py-2.5
                      text-left
                      text-red-400/70
                      transition
                      hover:bg-red-500/[0.06]
                      hover:text-red-300
                    "
                  >

                    <LogOut size={15} />

                    <span className="text-[10px] font-bold uppercase tracking-[0.12em]">
                      Leave the Realm
                    </span>

                  </button>

                </div>
              )}

            </div>

          </div>

        </div>

        {/* =====================================================
            COMMAND STRIP
        ===================================================== */}

        <div
          className="
            relative
            z-10
            flex
            flex-wrap
            items-center
            justify-between
            gap-3
            border-t
            border-stone-800/70
            px-5
            py-3
            sm:px-6
            lg:px-8
          "
        >

          <div className="flex items-center gap-3">

            <div className="flex items-center gap-2">

              <span className="relative flex h-2 w-2">

                <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-400/40" />

                <span className="relative h-2 w-2 rounded-full bg-emerald-400" />

              </span>

              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-emerald-500">
                Systems Operational
              </span>

            </div>

            <span className="hidden h-3 w-px bg-stone-800 sm:block" />

            <div className="hidden items-center gap-2 sm:flex">

              <Swords
                size={12}
                className="text-orange-500/50"
              />

              <span className="text-[8px] font-bold uppercase tracking-[0.18em] text-stone-700">
                The Realm Awaits
              </span>

            </div>

          </div>

          <div className="flex items-center gap-2">

            <Sparkles
              size={12}
              className="text-orange-400/70"
            />

            <span className="text-[8px] font-bold uppercase tracking-[0.18em] text-stone-700">
              Build Your Legacy
            </span>

          </div>

        </div>

        {/* =====================================================
            BOTTOM GLOW
        ===================================================== */}

        <div
          className="
            relative
            h-px
            w-full
            bg-gradient-to-r
            from-transparent
            via-orange-500/40
            to-transparent
          "
        />

      </div>
    </header>
  );
}

/* ============================================================
   QUICK ACTION
============================================================ */

function QuickAction({
  to,
  icon,
  title,
  description,
  onClick,
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="
        group
        flex
        items-center
        gap-3
        rounded-xl
        px-3
        py-3
        transition-all
        duration-200
        hover:bg-orange-500/[0.06]
      "
    >

      <div
        className="
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          rounded-lg
          border
          border-orange-500/10
          bg-orange-500/[0.05]
          text-orange-400
          transition
          group-hover:border-orange-500/25
          group-hover:bg-orange-500/[0.1]
        "
      >
        {icon}
      </div>

      <div className="min-w-0">

        <p className="text-[10px] font-bold text-stone-300 transition group-hover:text-orange-300">
          {title}
        </p>

        <p className="mt-0.5 text-[8px] text-stone-600">
          {description}
        </p>

      </div>

    </Link>
  );
}

/* ============================================================
   NOTIFICATION ITEM
============================================================ */

function NotificationItem({
  icon,
  title,
  description,
}) {
  return (
    <div
      className="
        group
        flex
        gap-3
        rounded-xl
        p-3
        transition
        hover:bg-orange-500/[0.05]
      "
    >

      <div
        className="
          flex
          h-8
          w-8
          shrink-0
          items-center
          justify-center
          rounded-lg
          border
          border-orange-500/10
          bg-orange-500/[0.06]
          text-orange-400
        "
      >
        {icon}
      </div>

      <div className="min-w-0">

        <p className="text-[10px] font-bold text-stone-300">
          {title}
        </p>

        <p className="mt-1 text-[9px] leading-4 text-stone-600">
          {description}
        </p>

      </div>

    </div>
  );
}

/* ============================================================
   PROFILE MENU ITEM
============================================================ */

function ProfileMenuItem({
  to,
  icon,
  label,
  onClick,
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="
        group
        flex
        items-center
        gap-3
        rounded-xl
        px-3
        py-2.5
        text-stone-500
        transition
        hover:bg-orange-500/[0.06]
        hover:text-orange-300
      "
    >

      <span className="text-stone-600 transition group-hover:text-orange-400">
        {icon}
      </span>

      <span className="text-[10px] font-bold uppercase tracking-[0.12em]">
        {label}
      </span>

    </Link>
  );
}

export default DashboardHeader;
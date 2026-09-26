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

  const [openMenu, setOpenMenu] = useState(null);
  const headerRef = useRef(null);

  const firstName = user?.name?.split(" ")[0] || "Instructor";

  /* Close menus */
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        headerRef.current &&
        !headerRef.current.contains(event.target)
      ) {
        setOpenMenu(null);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setOpenMenu(null);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const toggleMenu = (menu) => {
    setOpenMenu((current) => (current === menu ? null : menu));
  };

  const closeMenu = () => {
    setOpenMenu(null);
  };

  const handleLogout = () => {
    closeMenu();
    navigate("/login");
  };

  return (
    <header
      ref={headerRef}
      className="relative z-[100] px-4 pt-4 sm:px-6 lg:px-8"
    >
      <div className="relative overflow-visible rounded-[26px] border border-orange-500/10 bg-[#0b0806]/95 shadow-[0_20px_70px_rgba(0,0,0,.55)] backdrop-blur-2xl">

        {/* Ambient background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[26px]">
          <div className="absolute -left-32 -top-40 h-[400px] w-[400px] rounded-full bg-orange-600/[0.07] blur-[110px]" />
          <div className="absolute -right-32 -top-32 h-[400px] w-[400px] rounded-full bg-red-950/20 blur-[120px]" />
          <div className="absolute bottom-[-120px] left-1/2 h-[220px] w-[600px] -translate-x-1/2 rounded-full bg-orange-500/[0.04] blur-[100px]" />

          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)",
              backgroundSize: "45px 45px",
            }}
          />

          <Ember className="left-[8%] top-[25%]" />
          <Ember className="left-[25%] top-[70%]" />
          <Ember className="right-[30%] top-[20%]" />
          <Ember className="bottom-[25%] right-[10%]" />
        </div>

        {/* Main row */}
        <div className="relative z-20 flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">

          {/* Brand */}
          <div className="flex min-w-0 items-center gap-4">
            <div className="relative hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-orange-500/20 bg-orange-500/[0.08] text-orange-300 sm:flex">
              <div className="absolute inset-1 rounded-xl border border-orange-400/[0.08] animate-pulse" />
              <Crown size={21} />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="truncate text-[10px] font-black uppercase tracking-[0.28em] text-orange-400 sm:text-[11px]">
                  Instructor Command
                </span>

                <span className="hidden h-1 w-1 rounded-full bg-orange-500 sm:block" />

                <span className="hidden text-[9px] font-bold uppercase tracking-[0.2em] text-stone-600 md:block">
                  Dragonstone
                </span>
              </div>

              <div className="mt-1 flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-400/50" />
                  <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
                </span>

                <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-stone-600">
                  Realm Online
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">

            {/* Quick actions */}
            <div className="relative hidden sm:block">
              <HeaderButton
                icon={<Zap size={15} />}
                label="Quick"
                active={openMenu === "quick"}
                onClick={() => toggleMenu("quick")}
              />

              {openMenu === "quick" && (
                <Dropdown className="w-64">
                  <DropdownTitle
                    title="Command Actions"
                    subtitle="Navigate the realm"
                  />

                  <QuickAction
                    to="/instructor/create-course"
                    icon={<Plus size={16} />}
                    title="Forge Course"
                    description="Create a new course"
                    onClick={closeMenu}
                  />

                  <QuickAction
                    to="/instructor/courses"
                    icon={<BookOpen size={16} />}
                    title="Manage Courses"
                    description="View your courses"
                    onClick={closeMenu}
                  />

                  <QuickAction
                    to="/instructor/students"
                    icon={<UserRound size={16} />}
                    title="Students"
                    description="View your students"
                    onClick={closeMenu}
                  />
                </Dropdown>
              )}
            </div>

            {/* Create course */}
            <Link
              to="/instructor/create-course"
              className="group hidden h-11 items-center gap-2 rounded-xl border border-orange-500/20 bg-orange-500/[0.07] px-4 text-orange-300 transition hover:-translate-y-0.5 hover:border-orange-400/40 hover:bg-orange-500/[0.12] md:flex"
            >
              <Plus
                size={16}
                className="transition-transform duration-300 group-hover:rotate-90"
              />

              <span className="text-[10px] font-black uppercase tracking-[0.14em]">
                Forge Course
              </span>
            </Link>

            {/* Notifications */}
            <div className="relative">
              <IconButton
                icon={<Bell size={17} />}
                badge
                label="Notifications"
                onClick={() => toggleMenu("notifications")}
              />

              {openMenu === "notifications" && (
                <Dropdown className="w-80">
                  <div className="flex items-center justify-between border-b border-stone-800/70 px-4 py-4">
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
                      onClick={closeMenu}
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
                </Dropdown>
              )}
            </div>

            {/* Profile */}
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleMenu("profile")}
                className="group flex h-11 items-center gap-2 rounded-xl border border-stone-800 bg-white/[0.025] px-2 pr-3 transition hover:border-orange-500/25 hover:bg-orange-500/[0.05]"
              >
                <Avatar user={user} />

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
                  className={`text-stone-600 transition-transform ${
                    openMenu === "profile" ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openMenu === "profile" && (
                <Dropdown className="w-60">
                  <div className="mb-2 rounded-xl border border-stone-800/70 bg-white/[0.02] p-3">
                    <div className="flex items-center gap-3">
                      <Avatar user={user} size="large" />

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
                    onClick={closeMenu}
                  />

                  <ProfileMenuItem
                    to="/instructor/profile"
                    icon={<Settings size={15} />}
                    label="Settings"
                    onClick={closeMenu}
                  />

                  <div className="my-2 h-px bg-stone-800/70" />

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-red-400/70 transition hover:bg-red-500/[0.06] hover:text-red-300"
                  >
                    <LogOut size={15} />

                    <span className="text-[10px] font-bold uppercase tracking-[0.12em]">
                      Leave the Realm
                    </span>
                  </button>
                </Dropdown>
              )}
            </div>
          </div>
        </div>

        {/* Bottom status */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-t border-stone-800/70 px-5 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <StatusIndicator />

            <span className="hidden h-3 w-px bg-stone-800 sm:block" />

            <div className="hidden items-center gap-2 sm:flex">
              <Swords size={12} className="text-orange-500/50" />

              <span className="text-[8px] font-bold uppercase tracking-[0.18em] text-stone-700">
                The Realm Awaits
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Sparkles size={12} className="text-orange-400/70" />

            <span className="text-[8px] font-bold uppercase tracking-[0.18em] text-stone-700">
              Build Your Legacy
            </span>
          </div>
        </div>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />
      </div>
    </header>
  );
}

/* ============================================================
   SMALL COMPONENTS
============================================================ */

function Ember({ className = "" }) {
  return (
    <span
      className={`absolute h-1 w-1 animate-pulse rounded-full bg-orange-400 shadow-[0_0_12px_4px_rgba(251,146,60,.4)] ${className}`}
    />
  );
}

function HeaderButton({
  icon,
  label,
  active,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex h-11 items-center gap-2 rounded-xl border px-4 transition ${
        active
          ? "border-orange-500/30 bg-orange-500/[0.08] text-orange-300"
          : "border-stone-800 bg-white/[0.025] text-stone-500 hover:border-orange-500/25 hover:bg-orange-500/[0.05] hover:text-orange-300"
      }`}
    >
      <span className="text-orange-400 transition-transform group-hover:scale-110">
        {icon}
      </span>

      <span className="hidden text-[10px] font-bold uppercase tracking-[0.15em] lg:block">
        {label}
      </span>

      <ChevronDown
        size={13}
        className={`transition-transform ${
          active ? "rotate-180" : ""
        }`}
      />
    </button>
  );
}

function IconButton({
  icon,
  badge = false,
  label,
  onClick,
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="group relative flex h-11 w-11 items-center justify-center rounded-xl border border-stone-800 bg-white/[0.025] text-stone-500 transition hover:border-orange-500/25 hover:bg-orange-500/[0.05] hover:text-orange-300"
    >
      {icon}

      {badge && (
        <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-orange-400 shadow-[0_0_10px_3px_rgba(251,146,60,.45)]" />
      )}
    </button>
  );
}

function Dropdown({ children, className = "" }) {
  return (
    <div
      className={`absolute right-0 top-[calc(100%+10px)] overflow-hidden rounded-2xl border border-orange-500/15 bg-[#100b08]/98 shadow-[0_25px_80px_rgba(0,0,0,.7)] backdrop-blur-2xl ${className}`}
    >
      {children}
    </div>
  );
}

function DropdownTitle({ title, subtitle }) {
  return (
    <div className="border-b border-stone-800/70 px-4 py-4">
      <p className="text-xs font-bold text-stone-200">
        {title}
      </p>

      {subtitle && (
        <p className="mt-1 text-[9px] uppercase tracking-[0.15em] text-stone-600">
          {subtitle}
        </p>
      )}
    </div>
  );
}

function Avatar({ user, size = "normal" }) {
  const sizeClass =
    size === "large"
      ? "h-10 w-10 rounded-xl"
      : "h-8 w-8 rounded-lg";

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center overflow-hidden border border-orange-500/20 bg-gradient-to-br from-orange-500/20 to-red-950/30 text-orange-300 ${sizeClass}`}
    >
      {user?.avatar?.url ? (
        <img
          src={user.avatar.url}
          alt={user?.name || "Instructor"}
          className="h-full w-full object-cover"
        />
      ) : (
        <User size={size === "large" ? 17 : 15} />
      )}
    </div>
  );
}

function StatusIndicator() {
  return (
    <div className="flex items-center gap-2">
      <span className="relative flex h-2 w-2">
        <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-400/40" />
        <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
      </span>

      <span className="text-[8px] font-black uppercase tracking-[0.2em] text-emerald-500">
        Systems Operational
      </span>
    </div>
  );
}

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
      className="group flex items-center gap-3 rounded-xl px-3 py-3 transition hover:bg-orange-500/[0.06]"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-orange-500/10 bg-orange-500/[0.05] text-orange-400 transition group-hover:border-orange-500/25 group-hover:bg-orange-500/[0.1]">
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

function NotificationItem({
  icon,
  title,
  description,
}) {
  return (
    <div className="group flex gap-3 rounded-xl p-3 transition hover:bg-orange-500/[0.05]">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-orange-500/10 bg-orange-500/[0.06] text-orange-400">
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
      className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-stone-500 transition hover:bg-orange-500/[0.06] hover:text-orange-300"
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
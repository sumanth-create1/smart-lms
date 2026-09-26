import { useEffect, useRef, useState } from "react";
import {
  Search,
  Bell,
  ChevronDown,
  ChevronRight,
  Swords,
  User,
  Settings,
  LogOut,
  X,
  BookOpen,
  CheckCircle2,
  Crown,
  Shield,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../../../context/AuthContext";

const ROLE_LABELS = {
  student: "Learner",
  instructor: "Instructor",
  admin: "Administrator",
};

const NOTIFICATIONS = [
  {
    id: 1,
    type: "completed",
    title: "Mission completed",
    message:
      "You completed a lecture. Your knowledge grows stronger.",
    unread: true,
  },
  {
    id: 2,
    type: "course",
    title: "New learning mission",
    message:
      "Continue your current course and strengthen your skills.",
    unread: true,
  },
];

function StudentHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  const displayName = user?.name || "Student";
  const displayEmail = user?.email || "student@example.com";
  const displayRole = ROLE_LABELS[user?.role] || "Learner";
  const avatarInitial = displayName.charAt(0).toUpperCase();

  const unreadNotificationCount = NOTIFICATIONS.filter(
    (notification) => notification.unread
  ).length;

  // ============================================================
  // SEARCH
  // ============================================================

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    const query = search.trim();

    if (!query) return;

    navigate(`/courses?search=${encodeURIComponent(query)}`);
  };

  const clearSearch = () => {
    setSearch("");
  };

  // ============================================================
  // PROFILE ACTIONS
  // ============================================================

  const handleProfile = () => {
    setShowProfile(false);
    navigate("/profile");
  };

  const handleSettings = () => {
    setShowProfile(false);
    navigate("/settings");
  };

  // ============================================================
  // LOGOUT
  // ============================================================

  const handleLogout = async () => {
    try {
      setShowProfile(false);

      await logout?.();

      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // ============================================================
  // CLOSE DROPDOWNS
  // ============================================================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }

      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setShowProfile(false);
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

  // ============================================================
  // ESCAPE KEY
  // ============================================================

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key !== "Escape") return;

      setShowNotifications(false);
      setShowProfile(false);
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);

  return (
    <header
      className="
        fixed
        left-0
        right-0
        top-0
        z-40
        h-[74px]
        overflow-visible
        border-b
        border-[#292722]
        bg-[#0a0a09]/95
        text-white
        shadow-[0_10px_40px_rgba(0,0,0,0.35)]
        backdrop-blur-md
        lg:left-64
      "
    >
      {/* ========================================================
          AMBIENT BACKGROUND
      ======================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -right-20
          -top-28
          h-48
          w-48
          rounded-full
          bg-amber-700/[0.06]
          blur-3xl
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-24
          left-1/3
          h-40
          w-40
          rounded-full
          bg-orange-900/[0.04]
          blur-3xl
        "
      />

      {/* ========================================================
          MEDIEVAL TEXTURE
      ======================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-[0.025]
        "
        style={{
          backgroundImage: `
            linear-gradient(
              rgba(255,255,255,.35) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255,255,255,.35) 1px,
              transparent 1px
            )
          `,
          backgroundSize: "36px 36px",
        }}
      />

      {/* ========================================================
          TOP GOLD LINE
      ======================================================== */}

      <div
        className="
          absolute
          left-0
          top-0
          h-[2px]
          w-full
          bg-gradient-to-r
          from-transparent
          via-amber-600/70
          to-transparent
          shadow-[0_0_14px_rgba(217,167,75,.25)]
        "
      />

      {/* ========================================================
          HEADER CONTENT
      ======================================================== */}

      <div
        className="
          relative
          z-10
          flex
          h-full
          items-center
          justify-between
          px-4
          sm:px-6
          lg:px-8
        "
      >
        {/* ======================================================
            LEFT SIDE
        ====================================================== */}

        <div className="flex items-center gap-3">
          {/* Sigil */}

          <div
            className="
              group/sigil
              relative
              hidden
              h-10
              w-10
              items-center
              justify-center
              overflow-hidden
              border
              border-[#554b35]
              bg-gradient-to-br
              from-[#29251d]
              via-[#141412]
              to-black
              text-amber-500
              shadow-[inset_0_0_20px_rgba(212,175,55,.05)]
              transition-all
              duration-500
              hover:border-amber-600/60
              hover:shadow-[0_0_22px_rgba(212,175,55,.12)]
              sm:flex
            "
          >
            <Swords
              size={19}
              strokeWidth={1.5}
              className="
                transition-transform
                duration-500
                group-hover/sigil:rotate-12
                group-hover/sigil:scale-110
              "
            />

            <span
              className="
                absolute
                left-0
                top-0
                h-2
                w-2
                border-l
                border-t
                border-amber-700/50
              "
            />

            <span
              className="
                absolute
                bottom-0
                right-0
                h-2
                w-2
                border-b
                border-r
                border-amber-700/50
              "
            />
          </div>

          {/* Title */}

          <div>
            <div className="mb-0.5 flex items-center gap-2">
              <Crown
                size={10}
                className="hidden text-amber-600 sm:block"
              />

              <span
                className="
                  hidden
                  text-[8px]
                  font-black
                  uppercase
                  tracking-[0.32em]
                  text-amber-600
                  sm:block
                "
              >
                The Learning Realm
              </span>

              <span
                className="
                  hidden
                  h-px
                  w-7
                  bg-amber-700/40
                  sm:block
                "
              />
            </div>

            <h2
              className="
                text-lg
                font-black
                uppercase
                tracking-[0.04em]
                text-[#e7e1d4]
                sm:text-xl
              "
            >
              Dashboard
            </h2>
          </div>
        </div>

        {/* ======================================================
            RIGHT SIDE
        ====================================================== */}

        <div className="flex items-center gap-2 sm:gap-3">
          {/* ====================================================
              SEARCH
          ==================================================== */}

          <form
            onSubmit={handleSearchSubmit}
            className="
              group/search
              hidden
              h-10
              w-64
              items-center
              gap-2
              border
              border-[#292722]
              bg-[#10100e]
              px-3
              transition-all
              duration-300
              focus-within:border-amber-700/60
              focus-within:bg-[#12120f]
              focus-within:shadow-[0_0_20px_rgba(212,175,55,.05)]
              md:flex
            "
          >
            <Search
              size={16}
              className="
                shrink-0
                text-[#5d584d]
                transition-colors
                duration-300
                group-focus-within/search:text-amber-600
              "
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search the realm..."
              className="
                w-full
                bg-transparent
                text-xs
                text-[#cfc8ba]
                outline-none
                placeholder:text-[#4c4942]
              "
            />

            {search && (
              <button
                type="button"
                onClick={clearSearch}
                aria-label="Clear search"
                className="
                  text-[#575249]
                  transition-colors
                  hover:text-amber-500
                "
              >
                <X size={14} />
              </button>
            )}
          </form>

          {/* ====================================================
              NOTIFICATIONS
          ==================================================== */}

          <div
            ref={notificationRef}
            className="relative"
          >
            <button
              type="button"
              aria-label="Notifications"
              aria-expanded={showNotifications}
              onClick={() => {
                setShowNotifications((previous) => !previous);
                setShowProfile(false);
              }}
              className="
                group
                relative
                flex
                h-10
                w-10
                items-center
                justify-center
                border
                border-[#292722]
                bg-[#10100e]
                text-[#686258]
                transition-all
                duration-300
                hover:border-amber-700/50
                hover:bg-[#17150f]
                hover:text-amber-500
                hover:shadow-[0_0_18px_rgba(212,175,55,.06)]
              "
            >
              <Bell
                size={17}
                className="
                  transition-transform
                  duration-300
                  group-hover:rotate-12
                "
              />

              {unreadNotificationCount > 0 && (
                <span
                  className="
                    absolute
                    right-1.5
                    top-1.5
                    flex
                    h-3
                    min-w-3
                    items-center
                    justify-center
                    rounded-full
                    bg-amber-600
                    px-0.5
                    text-[7px]
                    font-black
                    text-black
                    shadow-[0_0_10px_rgba(217,167,75,.55)]
                  "
                >
                  {unreadNotificationCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div
                className="
                  absolute
                  right-0
                  top-12
                  w-80
                  overflow-hidden
                  border
                  border-[#3a352c]
                  bg-[#0d0d0b]
                  shadow-[0_25px_70px_rgba(0,0,0,.65)]
                  animate-dropdown
                "
              >
                <div
                  className="
                    h-[2px]
                    w-full
                    bg-gradient-to-r
                    from-transparent
                    via-amber-600
                    to-transparent
                  "
                />

                {/* Header */}

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    border-b
                    border-[#292722]
                    bg-gradient-to-r
                    from-amber-950/10
                    to-transparent
                    px-4
                    py-4
                  "
                >
                  <div className="flex items-center gap-2">
                    <Crown
                      size={14}
                      className="text-amber-600"
                    />

                    <div>
                      <p
                        className="
                          text-xs
                          font-black
                          uppercase
                          tracking-[0.15em]
                          text-[#ddd5c5]
                        "
                      >
                        Raven Scrolls
                      </p>

                      <p
                        className="
                          mt-0.5
                          text-[10px]
                          text-[#615c52]
                        "
                      >
                        Messages from the realm
                      </p>
                    </div>
                  </div>

                  {unreadNotificationCount > 0 && (
                    <span
                      className="
                        border
                        border-amber-800/30
                        bg-amber-950/20
                        px-2
                        py-1
                        text-[8px]
                        font-black
                        uppercase
                        tracking-wider
                        text-amber-600
                      "
                    >
                      {unreadNotificationCount} New
                    </span>
                  )}
                </div>

                {/* Notifications */}

                {NOTIFICATIONS.length > 0 ? (
                  NOTIFICATIONS.map((notification) => (
                    <div
                      key={notification.id}
                      className="
                        group/notification
                        relative
                        flex
                        gap-3
                        border-b
                        border-[#292722]
                        px-4
                        py-4
                        transition-colors
                        duration-300
                        hover:bg-amber-950/[0.08]
                      "
                    >
                      <div
                        className={`
                          flex
                          h-9
                          w-9
                          shrink-0
                          items-center
                          justify-center
                          border
                          transition-transform
                          duration-300
                          group-hover/notification:scale-105

                          ${
                            notification.type === "completed"
                              ? "border-emerald-900/40 bg-emerald-950/20 text-emerald-500"
                              : "border-[#38342c] bg-[#171613] text-amber-600"
                          }
                        `}
                      >
                        {notification.type === "completed" ? (
                          <CheckCircle2 size={16} />
                        ) : (
                          <BookOpen size={16} />
                        )}
                      </div>

                      <div className="min-w-0 pr-3">
                        <p
                          className="
                            text-xs
                            font-bold
                            text-[#d7d0c2]
                          "
                        >
                          {notification.title}
                        </p>

                        <p
                          className="
                            mt-1
                            text-[10px]
                            leading-4
                            text-[#615c52]
                          "
                        >
                          {notification.message}
                        </p>
                      </div>

                      {notification.unread && (
                        <span
                          className="
                            absolute
                            right-3
                            top-4
                            h-1.5
                            w-1.5
                            rounded-full
                            bg-amber-500
                            shadow-[0_0_8px_rgba(217,167,75,.6)]
                          "
                        />
                      )}
                    </div>
                  ))
                ) : (
                  <div
                    className="
                      px-4
                      py-8
                      text-center
                      text-[10px]
                      uppercase
                      tracking-wider
                      text-[#615c52]
                    "
                  >
                    No new scrolls
                  </div>
                )}

                {/* Footer */}

                <button
                  type="button"
                  onClick={() => {
                    setShowNotifications(false);
                    navigate("/notifications");
                  }}
                  className="
                    group/view
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    border-t
                    border-[#292722]
                    px-4
                    py-3
                    text-[8px]
                    font-black
                    uppercase
                    tracking-[0.22em]
                    text-amber-600
                    transition-colors
                    duration-300
                    hover:bg-amber-950/10
                    hover:text-amber-400
                  "
                >
                  View all scrolls

                  <ChevronRight
                    size={11}
                    className="
                      transition-transform
                      duration-300
                      group-hover/view:translate-x-1
                    "
                  />
                </button>
              </div>
            )}
          </div>

          {/* ====================================================
              PROFILE
          ==================================================== */}

          <div
            ref={profileRef}
            className="relative"
          >
            <button
              type="button"
              aria-expanded={showProfile}
              onClick={() => {
                setShowProfile((previous) => !previous);
                setShowNotifications(false);
              }}
              className="
                group
                flex
                items-center
                gap-2
                border
                border-transparent
                p-1.5
                transition-all
                duration-300
                hover:border-[#292722]
                hover:bg-[#10100e]
              "
            >
              {/* Avatar */}

              <div
                className="
                  relative
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  overflow-hidden
                  border
                  border-amber-800/40
                  bg-gradient-to-br
                  from-[#302b20]
                  via-[#171613]
                  to-black
                  text-sm
                  font-black
                  text-amber-500
                  shadow-[inset_0_0_15px_rgba(212,175,55,.04)]
                  transition-all
                  duration-300
                  group-hover:border-amber-600/60
                  group-hover:shadow-[0_0_18px_rgba(212,175,55,.1)]
                "
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={displayName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  avatarInitial
                )}

                <span
                  className="
                    absolute
                    bottom-0
                    right-0
                    h-2
                    w-2
                    border
                    border-black
                    bg-emerald-500
                  "
                />
              </div>

              {/* User */}

              <div className="hidden text-left sm:block">
                <p
                  className="
                    max-w-28
                    truncate
                    text-[10px]
                    font-black
                    uppercase
                    tracking-[0.08em]
                    text-[#d7d0c2]
                  "
                >
                  {displayName}
                </p>

                <div className="mt-0.5 flex items-center gap-1.5">
                  <Shield
                    size={8}
                    className="text-amber-700"
                  />

                  <p
                    className="
                      text-[8px]
                      font-bold
                      uppercase
                      tracking-[0.18em]
                      text-amber-600
                    "
                  >
                    {displayRole}
                  </p>
                </div>
              </div>

              <ChevronDown
                size={14}
                className="
                  hidden
                  text-[#575249]
                  transition-all
                  duration-300
                  group-hover:translate-y-0.5
                  group-hover:text-amber-500
                  sm:block
                "
              />
            </button>

            {/* Profile Dropdown */}

            {showProfile && (
              <div
                className="
                  absolute
                  right-0
                  top-12
                  w-64
                  overflow-hidden
                  border
                  border-[#3a352c]
                  bg-[#0d0d0b]
                  shadow-[0_25px_70px_rgba(0,0,0,.65)]
                  animate-dropdown
                "
              >
                <div
                  className="
                    h-[2px]
                    w-full
                    bg-gradient-to-r
                    from-transparent
                    via-amber-600
                    to-transparent
                  "
                />

                {/* Profile Header */}

                <div
                  className="
                    relative
                    overflow-hidden
                    border-b
                    border-[#292722]
                    bg-gradient-to-br
                    from-amber-950/20
                    via-transparent
                    to-transparent
                    px-4
                    py-5
                  "
                >
                  <div
                    className="
                      pointer-events-none
                      absolute
                      -right-6
                      -top-6
                      h-20
                      w-20
                      rounded-full
                      bg-amber-600/[0.08]
                      blur-2xl
                    "
                  />

                  <div className="relative flex items-center gap-3">
                    <div
                      className="
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center
                        overflow-hidden
                        border
                        border-amber-800/40
                        bg-[#171613]
                        text-sm
                        font-black
                        text-amber-500
                      "
                    >
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt={displayName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        avatarInitial
                      )}
                    </div>

                    <div className="min-w-0">
                      <p
                        className="
                          truncate
                          text-sm
                          font-black
                          uppercase
                          tracking-wide
                          text-[#e0d8c8]
                        "
                      >
                        {displayName}
                      </p>

                      <p
                        className="
                          mt-1
                          truncate
                          text-[9px]
                          text-[#625d53]
                        "
                      >
                        {displayEmail}
                      </p>

                      <p
                        className="
                          mt-1
                          text-[8px]
                          font-bold
                          uppercase
                          tracking-[0.15em]
                          text-amber-700
                        "
                      >
                        {displayRole}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Profile */}

                <DropdownAction
                  icon={User}
                  label="Profile"
                  onClick={handleProfile}
                />

                {/* Settings */}

                <DropdownAction
                  icon={Settings}
                  label="Settings"
                  onClick={handleSettings}
                />

                {/* Logout */}

                <DropdownAction
                  icon={LogOut}
                  label="Leave the Realm"
                  onClick={handleLogout}
                  danger
                  last
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================
          BOTTOM DECORATION
      ======================================================== */}

      <div
        className="
          absolute
          bottom-0
          left-0
          h-px
          w-full
          bg-gradient-to-r
          from-transparent
          via-amber-700/70
          to-transparent
          shadow-[0_0_12px_rgba(217,167,75,.25)]
        "
      />

      <div
        className="
          absolute
          bottom-[-1px]
          left-1/2
          h-[2px]
          w-24
          -translate-x-1/2
          bg-amber-500/50
          blur-[2px]
          animate-goldPulse
        "
      />

      <style>{`
        @keyframes dropdown {
          from {
            opacity: 0;
            transform: translateY(-6px) scale(.98);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-dropdown {
          animation: dropdown .2s ease-out;
        }

        @keyframes goldPulse {
          0%,
          100% {
            opacity: .35;
            width: 60px;
          }

          50% {
            opacity: .8;
            width: 110px;
          }
        }

        .animate-goldPulse {
          animation: goldPulse 3s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-dropdown,
          .animate-goldPulse {
            animation: none !important;
          }
        }
      `}</style>
    </header>
  );
}

// ================================================================
// DROPDOWN ACTION
// ================================================================

function DropdownAction({
  icon: Icon,
  label,
  onClick,
  danger = false,
  last = false,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        group/item
        flex
        w-full
        items-center
        gap-3
        px-4
        py-3
        text-left
        text-xs
        font-semibold
        transition-all
        duration-300

        ${
          !last
            ? "border-b border-[#201f1b]"
            : ""
        }

        ${
          danger
            ? `
              text-red-600
              hover:bg-red-950/10
              hover:text-red-400
            `
            : `
              text-[#777066]
              hover:bg-amber-950/[0.08]
              hover:text-[#d7d0c2]
            `
        }
      `}
    >
      <span
        className={`
          flex
          h-7
          w-7
          items-center
          justify-center
          border
          transition-all
          duration-300

          ${
            danger
              ? `
                border-red-950/40
                bg-red-950/10
                group-hover/item:border-red-800/50
              `
              : `
                border-[#292722]
                bg-[#131311]
                group-hover/item:border-amber-800/40
                group-hover/item:text-amber-500
              `
          }
        `}
      >
        <Icon size={14} />
      </span>

      <span>{label}</span>

      <ChevronRight
        size={12}
        className="
          ml-auto
          opacity-0
          transition-all
          duration-300
          group-hover/item:translate-x-1
          group-hover/item:opacity-100
        "
      />
    </button>
  );
}

export default StudentHeader;
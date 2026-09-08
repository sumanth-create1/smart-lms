import {
  Search,
  Bell,
  ChevronDown,
  Swords,
  User,
  Settings,
  LogOut,
  X,
  BookOpen,
  CheckCircle2,
} from "lucide-react";

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";

function StudentHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [showNotifications, setShowNotifications] =
    useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  // =====================================================
  // SEARCH
  // =====================================================

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    const query = search.trim();

    if (!query) return;

    navigate(`/courses?search=${encodeURIComponent(query)}`);
  };

  const clearSearch = () => {
    setSearch("");
  };

  // =====================================================
  // PROFILE
  // =====================================================

  const handleProfile = () => {
    setShowProfile(false);
    navigate("/profile");
  };

  const handleSettings = () => {
    setShowProfile(false);
    navigate("/settings");
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = async () => {
    try {
      setShowProfile(false);

      if (logout) {
        await logout();
      }

      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // =====================================================
  // CLOSE DROPDOWNS WHEN CLICKING OUTSIDE
  // =====================================================

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

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // =====================================================
  // ESCAPE KEY
  // =====================================================

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setShowNotifications(false);
        setShowProfile(false);
      }
    };

    document.addEventListener(
      "keydown",
      handleEscape
    );

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
        h-[72px]
        overflow-visible
        border-b
        border-zinc-800
        bg-[#090909]/95
        backdrop-blur-xl
        lg:left-64
      "
    >
      {/* =====================================================
          CINEMATIC GLOW
      ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -right-20
          -top-24
          h-48
          w-48
          rounded-full
          bg-red-600/10
          blur-3xl
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-20
          -left-20
          h-40
          w-40
          rounded-full
          bg-red-900/10
          blur-3xl
        "
      />

      {/* =====================================================
          HEADER CONTENT
      ===================================================== */}

      <div
        className="
          relative
          flex
          h-full
          items-center
          justify-between
          px-4
          sm:px-6
          lg:px-8
        "
      >
        {/* ===================================================
            TITLE
        =================================================== */}

        <div className="flex items-center gap-3">
          <div
            className="
              hidden
              h-9
              w-9
              items-center
              justify-center
              rounded-lg
              border
              border-red-600/30
              bg-red-600/5
              text-red-500
              sm:flex
            "
          >
            <Swords size={17} />
          </div>

          <div>
            <div className="mb-0.5 flex items-center gap-2">
              <span
                className="
                  hidden
                  text-[9px]
                  font-black
                  uppercase
                  tracking-[0.3em]
                  text-red-500
                  sm:block
                "
              >
                Fight Record
              </span>

              <span className="hidden h-px w-5 bg-red-600/50 sm:block" />
            </div>

            <h2
              className="
                text-lg
                font-black
                uppercase
                tracking-tight
                text-white
                sm:text-xl
              "
            >
              Dashboard
            </h2>
          </div>
        </div>

        {/* ===================================================
            RIGHT SIDE
        =================================================== */}

        <div className="flex items-center gap-2 sm:gap-3">

          {/* =================================================
              SEARCH
          ================================================= */}

          <form
            onSubmit={handleSearchSubmit}
            className="
              hidden
              h-10
              w-64
              items-center
              gap-2
              rounded-lg
              border
              border-zinc-800
              bg-zinc-950
              px-3
              transition
              focus-within:border-red-600/50
              md:flex
            "
          >
            <Search
              size={16}
              className="shrink-0 text-zinc-600"
            />

            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Search the record..."
              className="
                w-full
                bg-transparent
                text-xs
                text-zinc-300
                outline-none
                placeholder:text-zinc-700
              "
            />

            {search && (
              <button
                type="button"
                onClick={clearSearch}
                className="text-zinc-600 transition hover:text-red-500"
              >
                <X size={14} />
              </button>
            )}
          </form>

          {/* =================================================
              NOTIFICATION
          ================================================= */}

          <div
            ref={notificationRef}
            className="relative"
          >
            <button
              type="button"
              aria-label="Notifications"
              onClick={() => {
                setShowNotifications(
                  (previous) => !previous
                );

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
                rounded-lg
                border
                border-zinc-800
                bg-zinc-950
                text-zinc-500
                transition
                hover:border-red-600/40
                hover:bg-red-600/5
                hover:text-red-500
              "
            >
              <Bell
                size={18}
                className="
                  transition
                  group-hover:rotate-6
                "
              />

              {/* Notification dot */}

              <span
                className="
                  absolute
                  right-2
                  top-2
                  h-1.5
                  w-1.5
                  animate-pulse
                  rounded-full
                  bg-red-500
                  shadow-[0_0_8px_rgba(239,68,68,0.8)]
                "
              />
            </button>

            {/* =================================================
                NOTIFICATION DROPDOWN
            ================================================= */}

            {showNotifications && (
              <div
                className="
                  absolute
                  right-0
                  top-12
                  w-80
                  overflow-hidden
                  rounded-xl
                  border
                  border-zinc-800
                  bg-[#0d0d0d]
                  shadow-2xl
                  shadow-black/50
                "
              >
                {/* Header */}

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    border-b
                    border-zinc-800
                    px-4
                    py-3
                  "
                >
                  <div>
                    <p
                      className="
                        text-xs
                        font-black
                        uppercase
                        tracking-wider
                        text-white
                      "
                    >
                      Notifications
                    </p>

                    <p className="mt-0.5 text-[10px] text-zinc-600">
                      Your latest activity
                    </p>
                  </div>

                  <span
                    className="
                      rounded-md
                      bg-red-600/10
                      px-2
                      py-1
                      text-[9px]
                      font-bold
                      uppercase
                      text-red-500
                    "
                  >
                    2 New
                  </span>
                </div>

                {/* Notification 1 */}

                <div
                  className="
                    flex
                    gap-3
                    border-b
                    border-zinc-800
                    px-4
                    py-4
                    transition
                    hover:bg-white/[0.02]
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
                      bg-red-600/10
                      text-red-500
                    "
                  >
                    <CheckCircle2 size={16} />
                  </div>

                  <div>
                    <p className="text-xs font-bold text-zinc-300">
                      Mission completed
                    </p>

                    <p className="mt-1 text-[10px] leading-4 text-zinc-600">
                      You completed a lecture.
                      Keep pushing forward.
                    </p>
                  </div>
                </div>

                {/* Notification 2 */}

                <div
                  className="
                    flex
                    gap-3
                    px-4
                    py-4
                    transition
                    hover:bg-white/[0.02]
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
                      bg-zinc-800
                      text-zinc-400
                    "
                  >
                    <BookOpen size={16} />
                  </div>

                  <div>
                    <p className="text-xs font-bold text-zinc-300">
                      New learning mission
                    </p>

                    <p className="mt-1 text-[10px] leading-4 text-zinc-600">
                      Continue your current course.
                    </p>
                  </div>
                </div>

                {/* Footer */}

                <button
                  type="button"
                  onClick={() => {
                    setShowNotifications(false);
                    navigate("/notifications");
                  }}
                  className="
                    w-full
                    border-t
                    border-zinc-800
                    px-4
                    py-3
                    text-[9px]
                    font-black
                    uppercase
                    tracking-[0.2em]
                    text-red-500
                    transition
                    hover:bg-red-600/5
                  "
                >
                  View all notifications
                </button>
              </div>
            )}
          </div>

          {/* =================================================
              USER
          ================================================= */}

          <div
            ref={profileRef}
            className="relative"
          >
            <button
              type="button"
              onClick={() => {
                setShowProfile(
                  (previous) => !previous
                );

                setShowNotifications(false);
              }}
              className="
                group
                flex
                items-center
                gap-2
                rounded-lg
                border
                border-transparent
                p-1.5
                transition
                hover:border-zinc-800
                hover:bg-zinc-950
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
                  rounded-lg
                  border
                  border-red-600/30
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
                    h-2
                    w-2
                    bg-red-600
                  "
                />
              </div>

              {/* User */}

              <div className="hidden text-left sm:block">
                <p
                  className="
                    max-w-28
                    truncate
                    text-[11px]
                    font-bold
                    uppercase
                    tracking-wide
                    text-zinc-200
                  "
                >
                  {user?.name || "Student"}
                </p>

                <p
                  className="
                    mt-0.5
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-[0.18em]
                    text-red-500
                  "
                >
                  Fighter
                </p>
              </div>

              <ChevronDown
                size={14}
                className="
                  hidden
                  text-zinc-600
                  transition
                  group-hover:text-red-500
                  sm:block
                "
              />
            </button>

            {/* =================================================
                PROFILE DROPDOWN
            ================================================= */}

            {showProfile && (
              <div
                className="
                  absolute
                  right-0
                  top-12
                  w-64
                  overflow-hidden
                  rounded-xl
                  border
                  border-zinc-800
                  bg-[#0d0d0d]
                  shadow-2xl
                  shadow-black/50
                "
              >
                {/* Profile header */}

                <div
                  className="
                    border-b
                    border-zinc-800
                    bg-gradient-to-r
                    from-red-950/30
                    to-transparent
                    px-4
                    py-4
                  "
                >
                  <p
                    className="
                      truncate
                      text-sm
                      font-black
                      uppercase
                      text-white
                    "
                  >
                    {user?.name || "Student"}
                  </p>

                  <p
                    className="
                      mt-1
                      truncate
                      text-[10px]
                      text-zinc-600
                    "
                  >
                    {user?.email || "student@example.com"}
                  </p>
                </div>

                {/* Profile */}

                <button
                  type="button"
                  onClick={handleProfile}
                  className="
                    flex
                    w-full
                    items-center
                    gap-3
                    px-4
                    py-3
                    text-left
                    text-xs
                    font-semibold
                    text-zinc-400
                    transition
                    hover:bg-white/[0.03]
                    hover:text-white
                  "
                >
                  <User size={15} />

                  Profile
                </button>

                {/* Settings */}

                <button
                  type="button"
                  onClick={handleSettings}
                  className="
                    flex
                    w-full
                    items-center
                    gap-3
                    px-4
                    py-3
                    text-left
                    text-xs
                    font-semibold
                    text-zinc-400
                    transition
                    hover:bg-white/[0.03]
                    hover:text-white
                  "
                >
                  <Settings size={15} />

                  Settings
                </button>

                {/* Logout */}

                <div className="border-t border-zinc-800" />

                <button
                  type="button"
                  onClick={handleLogout}
                  className="
                    flex
                    w-full
                    items-center
                    gap-3
                    px-4
                    py-3
                    text-left
                    text-xs
                    font-bold
                    text-red-500
                    transition
                    hover:bg-red-600/5
                    hover:text-red-400
                  "
                >
                  <LogOut size={15} />

                  Leave the Fight
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =====================================================
          RED CINEMATIC LINE
      ===================================================== */}

      <div
        className="
          absolute
          bottom-0
          left-0
          h-px
          w-24
          bg-red-600
          shadow-[0_0_10px_rgba(220,38,38,0.6)]
        "
      />
    </header>
  );
}

export default StudentHeader;
import { useEffect, useMemo, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
  BookOpen,
  ChevronRight,
  Crown,
  Flame,
  LayoutDashboard,
  LogOut,
  Settings,
  Shield,
  ShieldCheck,
  Sword,
  TrendingUp,
  Trophy,
  UserRound,
  Zap,
  Castle,
} from "lucide-react";

import { useAuth } from "../../../../context/AuthContext";

function StudentSidebar({ stats = {} }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const sidebarRef = useRef(null);

  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0,
  });

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // ============================================================
  // NAVIGATION
  // ============================================================

  const navigation = [
    {
      name: "The Great Hall",
      path: "/dashboard",
      icon: LayoutDashboard,
      code: "I",
      description: "Kingdom command",
    },
    {
      name: "Maester's Scrolls",
      path: "/courses",
      icon: BookOpen,
      code: "II",
      description: "Learning missions",
    },
    {
      name: "War Progress",
      path: "/progress",
      icon: TrendingUp,
      code: "III",
      description: "Battle progress",
    },
    {
      name: "Hall of Glory",
      path: "/achievements",
      icon: Trophy,
      code: "IV",
      description: "Earned honors",
    },
    {
      name: "Kingdom Settings",
      path: "/settings",
      icon: Settings,
      code: "V",
      description: "System settings",
    },
  ];

  // ============================================================
  // USER
  // ============================================================

  const userName = user?.name || "Student";

  const initials =
    userName
      ?.split(" ")
      .filter(Boolean)
      .map((word) => word.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase() || "ST";

  // ============================================================
  // DYNAMIC STATS
  // ============================================================

  /*
    These values come from the parent dashboard.

    Example expected object:

    {
      xp: 680,
      nextLevelXp: 1000,
      studyStreak: 2,
      streakGoal: 7
    }

    The fallbacks keep the UI working even if your backend
    doesn't provide these values yet.
  */

  const xp = Number(
    stats?.xp ??
      stats?.kingdomXP ??
      stats?.totalXP ??
      0
  );

  const nextLevelXp = Number(
    stats?.nextLevelXp ??
      stats?.requiredXp ??
      stats?.levelTarget ??
      1000
  );

  const studyStreak = Number(
    stats?.studyStreak ??
      stats?.streak ??
      0
  );

  const streakGoal = Number(
    stats?.streakGoal ??
      7
  );

  // ============================================================
  // LEVEL CALCULATION
  // ============================================================

  const levelData = useMemo(() => {
    /*
      Simple XP progression.

      0 - 499      → Level 1
      500 - 999    → Level 2
      1000 - 1499  → Level 3
      etc.

      Change this later if you build a proper XP system.
    */

    const calculatedLevel =
      Math.floor(xp / 500) + 1;

    const currentLevelStart =
      (calculatedLevel - 1) * 500;

    const levelProgress =
      ((xp - currentLevelStart) / 500) * 100;

    return {
      level: calculatedLevel,
      progress: Math.min(
        Math.max(levelProgress, 0),
        100
      ),
    };
  }, [xp]);

  // ============================================================
  // RANK TITLE
  // ============================================================

  const rankTitle = useMemo(() => {
    if (xp >= 5000) return "Grand Maester";
    if (xp >= 3000) return "Lord Scholar";
    if (xp >= 2000) return "Knight Scholar";
    if (xp >= 1500) return "Master";
    if (xp >= 1000) return "Scholar";
    if (xp >= 500) return "Apprentice";

    return "Novice";
  }, [xp]);

  // ============================================================
  // XP PROGRESS
  // ============================================================

  const xpProgress = useMemo(() => {
    if (!nextLevelXp || nextLevelXp <= 0) {
      return 0;
    }

    return Math.min(
      Math.max((xp / nextLevelXp) * 100, 0),
      100
    );
  }, [xp, nextLevelXp]);

  // ============================================================
  // STREAK PROGRESS
  // ============================================================

  const streakProgress = useMemo(() => {
    if (!streakGoal || streakGoal <= 0) {
      return 0;
    }

    return Math.min(
      Math.max(
        (studyStreak / streakGoal) * 100,
        0
      ),
      100
    );
  }, [studyStreak, streakGoal]);

  // ============================================================
  // MOUSE FOLLOW
  // ============================================================

  useEffect(() => {
    const sidebar = sidebarRef.current;

    if (!sidebar) return;

    const handleMouseMove = (event) => {
      const rect = sidebar.getBoundingClientRect();

      setMousePosition({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      });
    };

    sidebar.addEventListener(
      "mousemove",
      handleMouseMove
    );

    return () => {
      sidebar.removeEventListener(
        "mousemove",
        handleMouseMove
      );
    };
  }, []);

  // ============================================================
  // LOGOUT
  // ============================================================

  const handleLogout = async () => {
    if (isLoggingOut) return;

    try {
      setIsLoggingOut(true);

      await logout();

      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);

      setIsLoggingOut(false);
    }
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <aside
      ref={sidebarRef}
      className="
        group/sidebar
        fixed
        inset-y-0
        left-0
        z-50
        hidden
        w-[275px]
        flex-col
        overflow-hidden
        border-r
        border-amber-900/20
        bg-[#08090a]
        text-white
        shadow-[15px_0_70px_rgba(0,0,0,0.55)]
        lg:flex
      "
    >
      {/* ========================================================
          MOUSE FOLLOW LIGHT
      ======================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          z-0
          h-72
          w-72
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-amber-500/[0.045]
          blur-3xl
          transition-[left,top]
          duration-100
        "
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
        }}
      />

      {/* ========================================================
          FIRE GLOW
      ======================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -right-32
          -top-32
          h-96
          w-96
          rounded-full
          bg-orange-900/[0.08]
          blur-[100px]
          animate-fire-glow
        "
      />

      {/* ========================================================
          ICE GLOW
      ======================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -bottom-40
          -left-32
          h-96
          w-96
          rounded-full
          bg-cyan-900/[0.07]
          blur-[100px]
          animate-ice-glow
        "
      />

      {/* ========================================================
          FANTASY GRID
      ======================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-[0.035]
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
          MOVING FOG
      ======================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          bottom-20
          left-[-100px]
          h-28
          w-[450px]
          rounded-full
          bg-white/[0.015]
          blur-3xl
          animate-fog
        "
      />

      {/* ========================================================
          TOP GOLDEN LINE
      ======================================================== */}

      <div
        className="
          absolute
          left-0
          right-0
          top-0
          z-30
          h-[2px]
          bg-gradient-to-r
          from-transparent
          via-amber-500/80
          to-transparent
          shadow-[0_0_15px_rgba(245,158,11,.4)]
        "
      />

      {/* ========================================================
          BRAND
      ======================================================== */}

      <div
        className="
          relative
          z-10
          flex
          h-[82px]
          shrink-0
          items-center
          border-b
          border-zinc-800/80
          px-5
        "
      >
        <div
          className="
            relative
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-sm
            border
            border-amber-700/40
            bg-gradient-to-br
            from-amber-950/40
            via-zinc-900
            to-black
            text-amber-500
            shadow-[inset_0_0_20px_rgba(245,158,11,.05)]
            transition-all
            duration-500
            group-hover/sidebar:border-amber-500/70
            group-hover/sidebar:shadow-[0_0_25px_rgba(245,158,11,.2)]
            group-hover/sidebar:rotate-[-3deg]
          "
        >
          <Castle
            size={22}
            strokeWidth={1.5}
          />

          <span
            className="
              absolute
              -top-1
              left-1/2
              h-1.5
              w-1.5
              -translate-x-1/2
              rounded-full
              bg-amber-400
              shadow-[0_0_8px_rgba(251,191,36,.9)]
              animate-pulse
            "
          />

          <span
            className="
              absolute
              bottom-0
              left-1/2
              h-[2px]
              w-6
              -translate-x-1/2
              bg-amber-500
            "
          />
        </div>

        <div className="ml-3">
          <h1
            className="
              text-[17px]
              font-black
              uppercase
              tracking-tight
              text-zinc-100
            "
          >
            Smart
            <span className="text-amber-500">
              LMS
            </span>
          </h1>

          <div className="mt-1 flex items-center gap-2">
            <span className="h-px w-4 bg-amber-700" />

            <p
              className="
                text-[7px]
                font-bold
                uppercase
                tracking-[0.23em]
                text-zinc-600
              "
            >
              Realm of Knowledge
            </p>
          </div>
        </div>

        <div className="ml-auto">
          <div
            className="
              flex
              h-7
              w-7
              items-center
              justify-center
              rounded-full
              border
              border-emerald-900/40
              bg-emerald-950/10
            "
          >
            <span
              className="
                h-1.5
                w-1.5
                rounded-full
                bg-emerald-500
                shadow-[0_0_8px_rgba(34,197,94,.8)]
                animate-pulse
              "
            />
          </div>
        </div>
      </div>

      {/* ========================================================
          PLAYER PROFILE
      ======================================================== */}

      <div className="relative z-10 px-4 pt-4">
        <div
          className="
            group/profile
            relative
            overflow-hidden
            rounded-sm
            border
            border-zinc-800
            bg-gradient-to-br
            from-zinc-900/80
            via-zinc-950
            to-black
            p-4
            transition-all
            duration-500
            hover:border-amber-700/40
            hover:shadow-[0_0_35px_rgba(245,158,11,.06)]
          "
        >
          <span
            className="
              absolute
              right-0
              top-0
              h-7
              w-7
              border-r
              border-t
              border-amber-700/30
            "
          />

          <span
            className="
              absolute
              bottom-0
              left-0
              h-7
              w-7
              border-b
              border-l
              border-amber-700/20
            "
          />

          <div className="relative flex items-center gap-3">
            {/* Avatar */}

            <div
              className="
                relative
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-full
                border
                border-amber-700/40
                bg-gradient-to-br
                from-amber-950
                via-zinc-800
                to-black
                text-sm
                font-black
                text-amber-400
                transition-all
                duration-500
                group-hover/profile:border-amber-500/70
                group-hover/profile:shadow-[0_0_25px_rgba(245,158,11,.15)]
              "
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={userName}
                  className="
                    h-full
                    w-full
                    rounded-full
                    object-cover
                  "
                />
              ) : (
                initials
              )}

              <span
                className="
                  absolute
                  bottom-0
                  right-0
                  h-3
                  w-3
                  rounded-full
                  border-2
                  border-[#08090a]
                  bg-emerald-500
                  shadow-[0_0_8px_rgba(34,197,94,.7)]
                "
              />
            </div>

            <div className="min-w-0">
              <p
                className="
                  truncate
                  text-[12px]
                  font-black
                  uppercase
                  tracking-wide
                  text-zinc-200
                "
              >
                {userName}
              </p>

              <p
                className="
                  mt-1
                  text-[8px]
                  font-bold
                  uppercase
                  tracking-[0.2em]
                  text-amber-600
                "
              >
                {rankTitle}
              </p>
            </div>

            <Crown
              size={15}
              className="
                ml-auto
                text-amber-700
                transition-all
                duration-500
                group-hover/profile:rotate-12
                group-hover/profile:scale-110
              "
            />
          </div>

          {/* ====================================================
              LEVEL
          ==================================================== */}

          <div className="relative mt-4">
            <div className="flex justify-between">
              <span
                className="
                  text-[7px]
                  font-bold
                  uppercase
                  tracking-[0.2em]
                  text-zinc-600
                "
              >
                House Rank
              </span>

              <span
                className="
                  text-[8px]
                  font-black
                  text-amber-500
                "
              >
                LEVEL {levelData.level}
              </span>
            </div>

            <div className="mt-2 h-1 overflow-hidden bg-zinc-800">
              <div
                className="
                  h-full
                  bg-gradient-to-r
                  from-amber-800
                  via-amber-500
                  to-yellow-300
                  shadow-[0_0_10px_rgba(245,158,11,.4)]
                  transition-all
                  duration-1000
                "
                style={{
                  width: `${levelData.progress}%`,
                }}
              />
            </div>

            <div className="mt-2 flex justify-between">
              <span className="text-[7px] text-zinc-700">
                {xp.toLocaleString()} XP
              </span>

              <span className="text-[7px] text-zinc-700">
                {nextLevelXp.toLocaleString()} XP
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          NAVIGATION
      ======================================================== */}

      <nav
        className="
          relative
          z-10
          flex-1
          overflow-y-auto
          px-4
          py-6
          sidebar-scroll
        "
      >
        <div className="mb-4 flex items-center gap-2 px-2">
          <Sword
            size={13}
            className="text-amber-700"
          />

          <p
            className="
              text-[8px]
              font-black
              uppercase
              tracking-[0.28em]
              text-zinc-600
            "
          >
            The Seven Paths
          </p>

          <div className="h-px flex-1 bg-zinc-900" />
        </div>

        <div className="flex flex-col gap-1">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  group/nav
                  relative
                  flex
                  min-h-[57px]
                  items-center
                  gap-3
                  overflow-hidden
                  rounded-sm
                  border
                  px-3
                  transition-all
                  duration-300

                  ${
                    isActive
                      ? `
                        border-amber-700/30
                        bg-gradient-to-r
                        from-amber-950/30
                        via-amber-950/[0.08]
                        to-transparent
                        shadow-[inset_3px_0_0_#d97706]
                      `
                      : `
                        border-transparent
                        text-zinc-600
                        hover:border-zinc-800
                        hover:bg-zinc-950
                        hover:text-zinc-300
                        hover:translate-x-1
                      `
                  }
                `}
              >
                {({ isActive }) => (
                  <>
                    <span
                      className="
                        pointer-events-none
                        absolute
                        inset-y-0
                        -left-full
                        w-1/2
                        skew-x-[-20deg]
                        bg-gradient-to-r
                        from-transparent
                        via-amber-400/[0.05]
                        to-transparent
                        transition-all
                        duration-700
                        group-hover/nav:left-[130%]
                      "
                    />

                    {isActive && (
                      <>
                        <span
                          className="
                            absolute
                            right-0
                            top-1/2
                            h-20
                            w-20
                            -translate-y-1/2
                            rounded-full
                            bg-amber-500/[0.07]
                            blur-2xl
                          "
                        />

                        <span
                          className="
                            absolute
                            right-3
                            top-1/2
                            h-1.5
                            w-1.5
                            -translate-y-1/2
                            rounded-full
                            bg-amber-400
                            shadow-[0_0_12px_rgba(251,191,36,.9)]
                            animate-pulse
                          "
                        />
                      </>
                    )}

                    <span
                      className={`
                        w-6
                        text-[7px]
                        font-black
                        tracking-widest
                        transition-colors

                        ${
                          isActive
                            ? "text-amber-700"
                            : "text-zinc-800 group-hover/nav:text-zinc-600"
                        }
                      `}
                    >
                      {item.code}
                    </span>

                    <span
                      className={`
                        relative
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-sm
                        border
                        transition-all
                        duration-500

                        ${
                          isActive
                            ? `
                              border-amber-700/40
                              bg-amber-950/20
                              text-amber-500
                              shadow-[0_0_18px_rgba(245,158,11,.08)]
                            `
                            : `
                              border-transparent
                              text-zinc-700
                              group-hover/nav:border-zinc-800
                              group-hover/nav:bg-zinc-900
                              group-hover/nav:text-zinc-300
                            `
                        }
                      `}
                    >
                      <Icon
                        size={17}
                        strokeWidth={
                          isActive ? 2.2 : 1.7
                        }
                        className="
                          transition-all
                          duration-500
                          group-hover/nav:scale-110
                          group-hover/nav:rotate-[-3deg]
                        "
                      />
                    </span>

                    <div className="min-w-0 flex-1">
                      <p
                        className={`
                          text-[10px]
                          font-black
                          uppercase
                          tracking-[0.08em]

                          ${
                            isActive
                              ? "text-zinc-200"
                              : "text-zinc-600 group-hover/nav:text-zinc-300"
                          }
                        `}
                      >
                        {item.name}
                      </p>

                      <p
                        className={`
                          mt-1
                          truncate
                          text-[7px]
                          uppercase
                          tracking-[0.15em]

                          ${
                            isActive
                              ? "text-amber-700"
                              : "text-zinc-800 group-hover/nav:text-zinc-700"
                          }
                        `}
                      >
                        {item.description}
                      </p>
                    </div>

                    <ChevronRight
                      size={13}
                      className="
                        text-zinc-800
                        transition-all
                        duration-300
                        group-hover/nav:translate-x-1
                        group-hover/nav:text-amber-700
                      "
                    />
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* ========================================================
            KINGDOM STATUS
        ======================================================== */}

        <div className="mt-7">
          <div className="mb-3 flex items-center gap-2 px-2">
            <Shield
              size={12}
              className="text-zinc-700"
            />

            <span
              className="
                text-[7px]
                font-black
                uppercase
                tracking-[0.25em]
                text-zinc-700
              "
            >
              Kingdom Status
            </span>
          </div>

          {/* STREAK */}

          <div
            className="
              group/streak
              relative
              overflow-hidden
              rounded-sm
              border
              border-zinc-900
              bg-gradient-to-br
              from-zinc-950
              to-black
              p-4
              transition-all
              duration-500
              hover:border-orange-900/30
            "
          >
            <div
              className="
                pointer-events-none
                absolute
                -right-8
                -top-8
                h-24
                w-24
                rounded-full
                bg-orange-600/[0.08]
                blur-2xl
                transition-all
                duration-500
                group-hover/streak:bg-orange-600/[0.16]
              "
            />

            <div className="relative flex items-center gap-3">
              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-sm
                  border
                  border-orange-900/30
                  bg-orange-950/10
                  text-orange-500
                  transition-all
                  duration-500
                  group-hover/streak:scale-110
                  group-hover/streak:rotate-6
                "
              >
                <Flame size={16} />
              </div>

              <div>
                <p
                  className="
                    text-[7px]
                    font-bold
                    uppercase
                    tracking-[0.2em]
                    text-zinc-700
                  "
                >
                  Warrior Streak
                </p>

                <p
                  className="
                    mt-1
                    text-xs
                    font-black
                    text-zinc-300
                  "
                >
                  {studyStreak}{" "}
                  {studyStreak === 1
                    ? "Day"
                    : "Days"}
                </p>
              </div>

              <span className="ml-auto text-sm">
                🔥
              </span>
            </div>

            {/* Dynamic streak progress */}

            <div className="relative mt-4 h-1 bg-zinc-900">
              <div
                className="
                  h-full
                  bg-gradient-to-r
                  from-orange-800
                  to-orange-400
                  shadow-[0_0_8px_rgba(249,115,22,.4)]
                  transition-all
                  duration-1000
                "
                style={{
                  width: `${streakProgress}%`,
                }}
              />
            </div>

            <div className="mt-2 flex justify-between">
              <span className="text-[6px] text-zinc-800">
                CURRENT
              </span>

              <span className="text-[6px] text-zinc-800">
                {streakGoal} DAY GOAL
              </span>
            </div>
          </div>

          {/* XP */}

          <div
            className="
              group/xp
              mt-2
              flex
              items-center
              justify-between
              rounded-sm
              border
              border-zinc-900
              bg-black/30
              px-3
              py-3
              transition-all
              duration-300
              hover:border-amber-900/30
              hover:bg-amber-950/[0.03]
            "
          >
            <div className="flex items-center gap-2">
              <Zap
                size={14}
                className="
                  text-amber-600
                  transition-all
                  duration-500
                  group-hover/xp:scale-125
                  group-hover/xp:rotate-12
                "
              />

              <span
                className="
                  text-[8px]
                  font-black
                  uppercase
                  tracking-[0.18em]
                  text-zinc-600
                "
              >
                Kingdom XP
              </span>
            </div>

            <span
              className="
                text-[8px]
                font-black
                text-amber-700
              "
            >
              {xp.toLocaleString()}
            </span>
          </div>
        </div>
      </nav>

      {/* ========================================================
          FOOTER
      ======================================================== */}

      <div
        className="
          relative
          z-10
          shrink-0
          border-t
          border-zinc-800
          bg-[#070708]
          p-4
        "
      >
        <div
          className="
            group/user
            relative
            overflow-hidden
            rounded-sm
            border
            border-zinc-900
            bg-black/40
            p-3
            transition-all
            duration-300
            hover:border-amber-900/30
          "
        >
          <div
            className="
              pointer-events-none
              absolute
              -right-10
              -top-10
              h-24
              w-24
              rounded-full
              bg-amber-500/[0.05]
              blur-2xl
              opacity-0
              transition-opacity
              duration-500
              group-hover/user:opacity-100
            "
          />

          <div className="relative flex items-center gap-3">
            <div
              className="
                relative
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-full
                border
                border-amber-800/40
                bg-gradient-to-br
                from-amber-950
                via-zinc-900
                to-black
                text-[10px]
                font-black
                text-amber-500
                transition-all
                duration-500
                group-hover/user:border-amber-500/60
                group-hover/user:shadow-[0_0_20px_rgba(245,158,11,.12)]
              "
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={userName}
                  className="
                    h-full
                    w-full
                    rounded-full
                    object-cover
                  "
                />
              ) : (
                initials
              )}

              <span
                className="
                  absolute
                  bottom-0
                  right-0
                  h-2.5
                  w-2.5
                  rounded-full
                  border-2
                  border-black
                  bg-emerald-500
                "
              />
            </div>

            <div className="min-w-0 flex-1">
              <p
                className="
                  truncate
                  text-[10px]
                  font-black
                  uppercase
                  tracking-wider
                  text-zinc-300
                "
              >
                {userName}
              </p>

              <div className="mt-1 flex items-center gap-2">
                <span
                  className="
                    text-[7px]
                    font-bold
                    uppercase
                    tracking-[0.18em]
                    text-amber-700
                  "
                >
                  {user?.role || "student"}
                </span>

                <span className="h-1 w-1 rounded-full bg-zinc-800" />

                <span
                  className="
                    text-[7px]
                    font-bold
                    uppercase
                    tracking-wider
                    text-zinc-700
                  "
                >
                  ONLINE
                </span>
              </div>
            </div>

            <UserRound
              size={13}
              className="
                text-zinc-800
                transition-colors
                group-hover/user:text-amber-700
              "
            />
          </div>
        </div>

        {/* Logout */}

        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="
            group/logout
            relative
            mt-2
            flex
            h-10
            w-full
            items-center
            gap-3
            overflow-hidden
            rounded-sm
            border
            border-transparent
            px-3
            text-[8px]
            font-black
            uppercase
            tracking-[0.2em]
            text-zinc-700
            transition-all
            duration-300
            hover:border-red-950/40
            hover:bg-red-950/10
            hover:text-red-500
            disabled:opacity-50
          "
        >
          <span
            className="
              absolute
              left-0
              top-0
              h-full
              w-[2px]
              origin-bottom
              scale-y-0
              bg-red-600
              transition-transform
              duration-300
              group-hover/logout:scale-y-100
            "
          />

          {isLoggingOut ? (
            <span
              className="
                h-3.5
                w-3.5
                animate-spin
                rounded-full
                border
                border-zinc-700
                border-t-red-500
              "
            />
          ) : (
            <LogOut
              size={15}
              className="
                transition-all
                duration-300
                group-hover/logout:translate-x-1
                group-hover/logout:text-red-500
              "
            />
          )}

          <span>
            {isLoggingOut
              ? "Leaving..."
              : "Leave the Realm"}
          </span>

          <ChevronRight
            size={12}
            className="
              ml-auto
              opacity-0
              transition-all
              duration-300
              group-hover/logout:translate-x-1
              group-hover/logout:opacity-100
            "
          />
        </button>

        {/* Security */}

        <div
          className="
            mt-3
            flex
            items-center
            justify-center
            gap-2
            text-[6px]
            font-bold
            uppercase
            tracking-[0.2em]
            text-zinc-800
          "
        >
          <ShieldCheck size={10} />

          <span>
            Protected Kingdom Network
          </span>

          <span
            className="
              h-1
              w-1
              rounded-full
              bg-emerald-700
              animate-pulse
            "
          />
        </div>
      </div>

      {/* ========================================================
          ANIMATED RUNES
      ======================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          right-2
          top-[130px]
          text-[9px]
          text-amber-700/[0.12]
          animate-rune
        "
      >
        ᚠ
      </div>

      <div
        className="
          pointer-events-none
          absolute
          bottom-[170px]
          left-2
          text-[12px]
          text-cyan-500/[0.08]
          animate-rune-delay
        "
      >
        ᛟ
      </div>

      {/* ========================================================
          SIDE DECORATION
      ======================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          right-0
          top-[100px]
          h-20
          w-[1px]
          bg-gradient-to-b
          from-transparent
          via-amber-600/30
          to-transparent
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          bottom-[120px]
          left-0
          h-20
          w-[1px]
          bg-gradient-to-b
          from-transparent
          via-cyan-700/20
          to-transparent
        "
      />

      {/* ========================================================
          BOTTOM GOLD LINE
      ======================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          bottom-0
          left-0
          z-30
          h-[2px]
          w-full
          bg-gradient-to-r
          from-transparent
          via-amber-600
          to-transparent
          shadow-[0_0_15px_rgba(245,158,11,.35)]
        "
      />

      {/* ========================================================
          ANIMATIONS
      ======================================================== */}

      <style>{`
        @keyframes fireGlow {
          0% {
            transform: scale(1);
            opacity: .5;
          }

          50% {
            transform: scale(1.15);
            opacity: .8;
          }

          100% {
            transform: scale(1);
            opacity: .5;
          }
        }

        .animate-fire-glow {
          animation: fireGlow 5s ease-in-out infinite;
        }

        @keyframes iceGlow {
          0% {
            transform: translate(0, 0);
            opacity: .3;
          }

          50% {
            transform: translate(20px, -15px);
            opacity: .7;
          }

          100% {
            transform: translate(0, 0);
            opacity: .3;
          }
        }

        .animate-ice-glow {
          animation: iceGlow 7s ease-in-out infinite;
        }

        @keyframes fog {
          0% {
            transform: translateX(-30px);
            opacity: .2;
          }

          50% {
            transform: translateX(80px);
            opacity: .5;
          }

          100% {
            transform: translateX(-30px);
            opacity: .2;
          }
        }

        .animate-fog {
          animation: fog 12s ease-in-out infinite;
        }

        @keyframes rune {
          0% {
            opacity: .1;
            transform: translateY(0) rotate(0deg);
          }

          50% {
            opacity: .35;
            transform: translateY(-10px) rotate(10deg);
          }

          100% {
            opacity: .1;
            transform: translateY(0) rotate(0deg);
          }
        }

        .animate-rune {
          animation: rune 6s ease-in-out infinite;
        }

        .animate-rune-delay {
          animation: rune 8s ease-in-out 2s infinite;
        }

        .sidebar-scroll::-webkit-scrollbar {
          width: 3px;
        }

        .sidebar-scroll::-webkit-scrollbar-track {
          background: transparent;
        }

        .sidebar-scroll::-webkit-scrollbar-thumb {
          background: #27272a;
          border-radius: 999px;
        }

        .sidebar-scroll::-webkit-scrollbar-thumb:hover {
          background: #a16207;
        }
      `}</style>
    </aside>
  );
}

export default StudentSidebar;
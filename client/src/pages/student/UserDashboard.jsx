import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const C = {
  primary: "#5146E5",
  primaryLight: "#F0EEFF",
  green: "#10B981",
  greenLight: "#E9FAF3",
  orange: "#FF6845",
  orangeLight: "#FFF0EB",
  yellow: "#F4B740",
  yellowLight: "#FFF7E1",
  text: "#15152B",
  muted: "#73738A",
  border: "#EAEAF2",
  background: "#FAFAFC",
};

function UserDashboard() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const displayName = useMemo(() => {
    if (!user) return "Student";

    return user.name || user.username || user.email?.split("@")[0] || "Student";
  }, [user]);

  const firstName = displayName.split(" ")[0];

  const handleLogout = async () => {
    await logout();
  };

  const stats = [
    {
      title: "Enrolled Courses",
      value: "6",
      change: "+12%",
      icon: "🎓",
      color: C.primary,
      bg: C.primaryLight,
    },
    {
      title: "Completed Courses",
      value: "2",
      change: "+20%",
      icon: "✓",
      color: C.green,
      bg: C.greenLight,
    },
    {
      title: "Learning Hours",
      value: "24",
      change: "+14%",
      icon: "◷",
      color: C.orange,
      bg: C.orangeLight,
    },
    {
      title: "Certificates",
      value: "2",
      change: "+12%",
      icon: "🏆",
      color: C.yellow,
      bg: C.yellowLight,
    },
  ];

  const courses = [
    {
      title: "MERN Stack Bootcamp",
      lessons: "25 lessons",
      completed: "18/25",
      progress: 72,
      icon: "⚛",
      gradient: "from-indigo-400 to-purple-400",
      progressColor: "bg-indigo-500",
    },
    {
      title: "Java Programming",
      lessons: "25 lessons",
      completed: "12/25",
      progress: 48,
      icon: "☕",
      gradient: "from-emerald-400 to-teal-400",
      progressColor: "bg-emerald-500",
    },
    {
      title: "Database Management",
      lessons: "24 lessons",
      completed: "8/24",
      progress: 31,
      icon: "▣",
      gradient: "from-orange-300 to-orange-400",
      progressColor: "bg-orange-500",
    },
  ];

  const activities = [
    {
      icon: "✓",
      title: 'Completed "React Components"',
      time: "2 hours ago",
      color: C.green,
      bg: C.greenLight,
    },
    {
      icon: "▶",
      title: 'Started "Java Collections"',
      time: "Yesterday",
      color: C.primary,
      bg: C.primaryLight,
    },
    {
      icon: "🏆",
      title: 'Earned "Java Basics" certificate',
      time: "3 days ago",
      color: C.yellow,
      bg: C.yellowLight,
    },
  ];

  const events = [
    {
      title: "React Quiz",
      date: "May 22, 2025",
      time: "10:00 AM",
      icon: "◉",
      color: C.primary,
      bg: C.primaryLight,
    },
    {
      title: "Java Assignment",
      date: "May 24, 2025",
      time: "11:59 PM",
      icon: "▤",
      color: C.green,
      bg: C.greenLight,
    },
    {
      title: "Database Test",
      date: "May 26, 2025",
      time: "02:00 PM",
      icon: "▣",
      color: C.orange,
      bg: C.orangeLight,
    },
  ];

  const calendarDays = [
    ["28", "29", "30", "1", "2", "3", "4"],
    ["5", "6", "7", "8", "9", "10", "11"],
    ["12", "13", "14", "15", "16", "17", "18"],
    ["19", "20", "21", "22", "23", "24", "25"],
    ["26", "27", "28", "29", "30", "31", "1"],
  ];

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: C.background,
        color: C.text,
      }}
    >
      <div className="flex min-h-screen">
        {/* =====================================================
            SIDEBAR
        ====================================================== */}
        {/* =====================================================
    DYNAMIC SIDEBAR
===================================================== */}

        {/* Mobile overlay */}
        {mobileSidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}

        <aside
          className={`
    fixed left-0 top-0 z-50 flex h-screen flex-col
    border-r border-gray-200 bg-white
    transition-all duration-300 ease-in-out
    lg:sticky lg:z-30
    ${sidebarCollapsed ? "w-[82px]" : "w-[270px]"}
    ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
  `}
        >
          {/* =================================================
      LOGO + COLLAPSE BUTTON
  ================================================== */}

          <div
            className={`
      flex h-[72px] shrink-0 items-center border-b border-gray-100
      ${sidebarCollapsed ? "justify-center px-3" : "justify-between px-5"}
    `}
          >
            <Link
              to="/"
              className="flex items-center gap-3"
              onClick={() => setMobileSidebarOpen(false)}
            >
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl
                   text-lg font-bold text-white shadow-md shadow-indigo-200"
                style={{
                  backgroundColor: C.primary,
                }}
              >
                S
              </div>

              {!sidebarCollapsed && (
                <div className="whitespace-nowrap text-[22px] font-bold tracking-tight">
                  Smart<span style={{ color: C.orange }}>LMS</span>
                </div>
              )}
            </Link>

            {/* Collapse button */}
            {!sidebarCollapsed && (
              <button
                onClick={() => setSidebarCollapsed(true)}
                className="
          hidden h-8 w-8 items-center justify-center rounded-lg
          text-gray-400 transition
          hover:bg-indigo-50 hover:text-indigo-600
          lg:flex
        "
                title="Collapse sidebar"
              >
                ‹
              </button>
            )}
          </div>

          {/* Expand button */}
          {sidebarCollapsed && (
            <button
              onClick={() => setSidebarCollapsed(false)}
              className="
        absolute -right-3 top-[76px] z-50
        flex h-7 w-7 items-center justify-center
        rounded-full border border-gray-200 bg-white
        text-sm font-bold text-indigo-600 shadow-md
        transition hover:scale-110 hover:bg-indigo-50
      "
              title="Expand sidebar"
            >
              ›
            </button>
          )}

          {/* =================================================
      NAVIGATION
  ================================================== */}

          <nav className="flex-1 overflow-y-auto px-3 py-5">
            {!sidebarCollapsed && (
              <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[0.15em] text-gray-400">
                Main Menu
              </p>
            )}

            <SidebarItem
              icon="⌂"
              label="Dashboard"
              to="/dashboard"
              active={location.pathname === "/dashboard"}
              collapsed={sidebarCollapsed}
              onClick={() => setMobileSidebarOpen(false)}
            />

            <SidebarItem
              icon="▥"
              label="My Courses"
              to="/my-courses"
              active={location.pathname === "/my-courses"}
              collapsed={sidebarCollapsed}
              onClick={() => setMobileSidebarOpen(false)}
            />

            <SidebarItem
              icon="◉"
              label="Explore Courses"
              to="/courses"
              active={location.pathname === "/courses"}
              collapsed={sidebarCollapsed}
              onClick={() => setMobileSidebarOpen(false)}
            />

            <SidebarItem
              icon="▥"
              label="My Progress"
              to="/progress"
              active={location.pathname === "/progress"}
              collapsed={sidebarCollapsed}
              onClick={() => setMobileSidebarOpen(false)}
            />

            <SidebarItem
              icon="♙"
              label="Certificates"
              to="/certificates"
              active={location.pathname === "/certificates"}
              collapsed={sidebarCollapsed}
              onClick={() => setMobileSidebarOpen(false)}
            />

            <SidebarItem
              icon="♡"
              label="Wishlist"
              to="/wishlist"
              active={location.pathname === "/wishlist"}
              collapsed={sidebarCollapsed}
              onClick={() => setMobileSidebarOpen(false)}
            />

            {!sidebarCollapsed && (
              <p className="mb-3 mt-8 px-3 text-[11px] font-bold uppercase tracking-[0.15em] text-gray-400">
                Community
              </p>
            )}

            <SidebarItem
              icon="◌"
              label="Discussions"
              to="/discussions"
              active={location.pathname === "/discussions"}
              collapsed={sidebarCollapsed}
              onClick={() => setMobileSidebarOpen(false)}
            />

            <SidebarItem
              icon="♧"
              label="Mentorship"
              to="/mentorship"
              active={location.pathname === "/mentorship"}
              collapsed={sidebarCollapsed}
              onClick={() => setMobileSidebarOpen(false)}
            />

            {!sidebarCollapsed && (
              <p className="mb-3 mt-8 px-3 text-[11px] font-bold uppercase tracking-[0.15em] text-gray-400">
                Account
              </p>
            )}

            <SidebarItem
              icon="⚙"
              label="Settings"
              to="/settings"
              active={location.pathname === "/settings"}
              collapsed={sidebarCollapsed}
              onClick={() => setMobileSidebarOpen(false)}
            />

            <SidebarItem
              icon="♙"
              label="Profile"
              to="/profile"
              active={location.pathname === "/profile"}
              collapsed={sidebarCollapsed}
              onClick={() => setMobileSidebarOpen(false)}
            />

            {/* Logout */}
            <button
              onClick={handleLogout}
              className={`
        group relative mt-1 flex w-full items-center rounded-xl
        py-3 text-sm font-medium text-red-500
        transition hover:bg-red-50
        ${sidebarCollapsed ? "justify-center px-2" : "gap-4 px-3"}
      `}
              title={sidebarCollapsed ? "Logout" : ""}
            >
              <span className="text-lg">↪</span>

              {!sidebarCollapsed && <span>Logout</span>}

              {/* Tooltip */}
              {sidebarCollapsed && (
                <span
                  className="
            pointer-events-none absolute left-full ml-3
            whitespace-nowrap rounded-lg bg-gray-900
            px-3 py-2 text-xs font-medium text-white
            opacity-0 shadow-lg transition
            group-hover:opacity-100
          "
                >
                  Logout
                </span>
              )}
            </button>
          </nav>

          {/* =================================================
      KEEP LEARNING CARD
  ================================================== */}

          {!sidebarCollapsed && (
            <div className="px-3 pb-4">
              <div
                className="
          relative overflow-hidden rounded-2xl p-5
          text-white shadow-lg shadow-indigo-200
        "
                style={{
                  background:
                    "linear-gradient(135deg, #5B4CF0 0%, #7447F5 60%, #8A5CF6 100%)",
                }}
              >
                <div className="relative z-10">
                  <h3 className="text-sm font-bold">Keep learning 🚀</h3>

                  <p className="mt-2 max-w-[165px] text-xs leading-5 text-white/80">
                    You're doing great! Keep going and achieve your goals.
                  </p>

                  <Link
                    to="/courses"
                    onClick={() => setMobileSidebarOpen(false)}
                    className="
              mt-4 inline-flex items-center gap-2
              rounded-lg bg-white px-3 py-2
              text-xs font-bold text-indigo-600
              transition hover:scale-105
            "
                  >
                    Continue learning
                    <span>→</span>
                  </Link>
                </div>

                <div className="absolute -bottom-3 -right-2 text-6xl">🚀</div>

                <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/10" />
              </div>
            </div>
          )}

          {/* =================================================
      PROFILE
  ================================================== */}

          <div className="border-t border-gray-100 p-4">
            <div
              className={`
        flex items-center
        ${sidebarCollapsed ? "justify-center" : "gap-3"}
      `}
            >
              <div
                className="
          flex h-10 w-10 shrink-0 items-center
          justify-center rounded-full
          text-sm font-bold text-white
          shadow-md
        "
                style={{
                  backgroundColor: C.primary,
                }}
              >
                {firstName.charAt(0).toUpperCase()}
              </div>

              {!sidebarCollapsed && (
                <>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold">{displayName}</p>

                    <p className="text-xs text-gray-500">
                      {user?.role || "Student"}
                    </p>
                  </div>

                  <span className="text-gray-400">›</span>
                </>
              )}
            </div>
          </div>
        </aside>

        {/* =====================================================
            MAIN
        ====================================================== */}
        <main className="min-w-0 flex-1">
          {/* ===================================================
              TOP BAR
          ==================================================== */}
          <header className="flex h-[72px] items-center justify-between border-b border-gray-200 bg-white px-5 sm:px-8">
            {/* Search */}
            <div className="relative w-full max-w-[460px]">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                ⌕
              </span>

              <input
                type="text"
                placeholder="Search for courses, lessons, instructors..."
                className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-16 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
              />

              <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-gray-200 bg-white px-2 py-1 text-[10px] font-medium text-gray-400">
                Ctrl K
              </span>
            </div>

            {/* Header right */}
            <div className="ml-5 flex items-center gap-3">
              <button className="relative hidden h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100 sm:flex">
                <span className="text-xl">♧</span>
                <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                  3
                </span>
              </button>

              <button className="relative hidden h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100 sm:flex">
                <span className="text-xl">◌</span>
                <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                  2
                </span>
              </button>

              <div className="mx-1 hidden h-8 w-px bg-gray-200 sm:block" />

              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{
                    backgroundColor: C.primary,
                  }}
                >
                  {firstName.charAt(0).toUpperCase()}
                </div>

                <div className="hidden sm:block">
                  <p className="text-sm font-bold">{displayName}</p>
                  <p className="text-[11px] text-gray-500">
                    {user?.role || "Student"}
                  </p>
                </div>

                <span className="hidden text-gray-500 sm:block">⌄</span>
              </div>
            </div>
          </header>

          {/* ===================================================
              CONTENT
          ==================================================== */}
          <div className="relative overflow-hidden px-5 py-7 sm:px-8 xl:px-10">
            {/* Background decoration */}
            <div className="pointer-events-none absolute right-0 top-0 h-64 w-[600px] rounded-full bg-indigo-100/40 blur-3xl" />

            {/* Welcome */}
            <section className="relative mb-7">
              <p
                className="mb-2 text-xs font-bold uppercase tracking-[0.18em]"
                style={{
                  color: C.primary,
                }}
              >
                Your learning space
              </p>

              <h1 className="text-3xl font-bold tracking-tight sm:text-[36px]">
                Welcome back, {firstName}! 👋
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Keep up the great work and continue building your skills.
              </p>
            </section>

            {/* =================================================
                STATISTICS
            ================================================== */}
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => (
                <StatCard key={stat.title} {...stat} />
              ))}
            </section>

            {/* =================================================
                TWO COLUMN AREA
            ================================================== */}
            <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_330px]">
              {/* LEFT */}
              <div className="min-w-0">
                {/* Continue learning */}
                <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="mb-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span
                        className="flex h-9 w-9 items-center justify-center rounded-lg"
                        style={{
                          backgroundColor: C.primaryLight,
                          color: C.primary,
                        }}
                      >
                        ▥
                      </span>

                      <h2 className="text-base font-bold">Continue Learning</h2>
                    </div>

                    <Link
                      to="/courses"
                      className="text-xs font-bold"
                      style={{
                        color: C.primary,
                      }}
                    >
                      View course
                    </Link>
                  </div>

                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
                    {/* Course image */}
                    <div className="relative h-32 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-blue-900 via-indigo-800 to-blue-600 lg:w-48">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.18),transparent_30%)]" />

                      <div className="relative flex h-full flex-col justify-between p-4 text-white">
                        <div className="text-[10px] font-bold tracking-wider text-cyan-300">
                          MERN
                        </div>

                        <div>
                          <p className="text-xl font-black leading-none">
                            STACK
                          </p>
                          <p className="text-xl font-black leading-none">
                            BOOTCAMP
                          </p>
                        </div>

                        <div className="text-[9px] text-blue-200">
                          React • Node • MongoDB
                        </div>
                      </div>
                    </div>

                    {/* Course information */}
                    <div className="min-w-0 flex-1">
                      <p
                        className="text-[10px] font-bold uppercase tracking-wider"
                        style={{
                          color: C.primary,
                        }}
                      >
                        Current Lesson
                      </p>

                      <h3 className="mt-1 text-xl font-bold">
                        React Fundamentals
                      </h3>

                      <p className="mt-1 text-xs text-gray-500">
                        Chapter 5 • Components & Props
                      </p>

                      <div className="mt-5">
                        <div className="mb-2 flex justify-between text-xs">
                          <span className="text-gray-500">
                            18 of 25 lessons completed
                          </span>

                          <span className="font-bold">72%</span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: "72%",
                              backgroundColor: C.primary,
                            }}
                          />
                        </div>

                        <div className="mt-2 text-right text-[11px] text-gray-400">
                          ~ 2h 30m left
                        </div>
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex shrink-0 flex-row gap-3 lg:flex-col">
                      <Link
                        to="/courses"
                        className="flex h-11 items-center justify-center rounded-xl px-6 text-sm font-bold text-white shadow-lg shadow-indigo-200"
                        style={{
                          backgroundColor: C.primary,
                        }}
                      >
                        Continue →
                      </Link>

                      <Link
                        to="/courses"
                        className="flex h-11 items-center justify-center rounded-xl border border-gray-200 px-6 text-sm font-bold text-gray-700 hover:bg-gray-50"
                      >
                        View course
                      </Link>
                    </div>
                  </div>
                </section>

                {/* =================================================
                    MY COURSES
                ================================================== */}
                <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-base font-bold">My Courses</h2>

                    <Link
                      to="/courses"
                      className="text-xs font-bold"
                      style={{
                        color: C.primary,
                      }}
                    >
                      See all →
                    </Link>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    {courses.map((course) => (
                      <CourseCard key={course.title} {...course} />
                    ))}
                  </div>
                </section>

                {/* =================================================
                    BOTTOM WIDGETS
                ================================================== */}
                <div className="mt-6 grid gap-6 lg:grid-cols-3">
                  {/* Recent activity */}
                  <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="mb-5 flex items-center justify-between">
                      <h2 className="text-base font-bold">Recent Activity</h2>

                      <button
                        className="text-xs font-bold"
                        style={{
                          color: C.primary,
                        }}
                      >
                        See all
                      </button>
                    </div>

                    <div className="space-y-5">
                      {activities.map((activity) => (
                        <div
                          key={activity.title}
                          className="flex items-center gap-3"
                        >
                          <div
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold"
                            style={{
                              color: activity.color,
                              backgroundColor: activity.bg,
                            }}
                          >
                            {activity.icon}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-semibold">
                              {activity.title}
                            </p>

                            <p className="mt-1 text-[10px] text-gray-400">
                              {activity.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Weekly goal */}
                  <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                      <h2 className="text-base font-bold">Weekly Goal</h2>
                      <span>🔥</span>
                    </div>

                    <div className="flex items-center gap-5">
                      <div className="relative h-24 w-24 shrink-0">
                        <div
                          className="absolute inset-0 rounded-full"
                          style={{
                            background:
                              "conic-gradient(#5146E5 0deg 252deg, #EEF0F5 252deg 360deg)",
                          }}
                        />

                        <div className="absolute inset-2 flex items-center justify-center rounded-full bg-white">
                          <span className="text-xl font-bold">70%</span>
                        </div>
                      </div>

                      <div>
                        <p className="text-xl font-bold">7 / 10 hours</p>

                        <p className="mt-1 text-xs leading-5 text-gray-500">
                          You're 70% of the way to your weekly learning goal.
                        </p>
                      </div>
                    </div>

                    <button
                      className="mt-5 rounded-lg border px-4 py-2 text-xs font-bold"
                      style={{
                        borderColor: "#DCD9FF",
                        color: C.primary,
                      }}
                    >
                      View progress
                    </button>
                  </section>

                  {/* Streak */}
                  <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                      <h2 className="text-base font-bold">Study Streak</h2>
                      <span className="text-xl">🔥</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-4xl">🔥</span>

                      <div>
                        <p className="text-2xl font-bold">7</p>
                        <p className="text-xs text-gray-500">days</p>
                      </div>
                    </div>

                    <p className="mt-3 text-xs text-gray-500">Keep it up! 🔥</p>

                    <div className="mt-4 grid grid-cols-7 gap-1">
                      {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
                        <div key={index} className="text-center">
                          <p className="mb-2 text-[9px] font-bold text-gray-400">
                            {day}
                          </p>

                          <div
                            className="mx-auto flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold"
                            style={{
                              backgroundColor:
                                index === 6 ? "#EEF0F5" : C.greenLight,
                              color: index === 6 ? "#A0A0AF" : C.green,
                            }}
                          >
                            {index === 6 ? "" : "✓"}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              </div>

              {/* =================================================
                  RIGHT SIDEBAR
              ================================================== */}
              <aside className="space-y-6">
                {/* Calendar */}
                <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        style={{
                          color: C.primary,
                        }}
                      >
                        ▣
                      </span>

                      <h2 className="text-base font-bold">Calendar</h2>
                    </div>

                    <button
                      className="text-xs font-bold"
                      style={{
                        color: C.primary,
                      }}
                    >
                      View all
                    </button>
                  </div>

                  <div className="mt-5 flex items-center justify-between">
                    <button className="text-gray-500">‹</button>

                    <p className="text-sm font-bold">May 2025</p>

                    <button className="text-gray-500">›</button>
                  </div>

                  <div className="mt-5 grid grid-cols-7 gap-y-4 text-center">
                    {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map(
                      (day) => (
                        <span
                          key={day}
                          className="text-[9px] font-bold text-gray-400"
                        >
                          {day}
                        </span>
                      ),
                    )}

                    {calendarDays.flat().map((day, index) => {
                      const isSelected = day === "21" && index === 23;

                      return (
                        <div
                          key={`${day}-${index}`}
                          className={`flex h-7 items-center justify-center text-xs ${
                            isSelected
                              ? "mx-auto w-7 rounded-full text-white"
                              : ""
                          }`}
                          style={{
                            backgroundColor: isSelected
                              ? C.primary
                              : "transparent",
                            color: isSelected
                              ? "white"
                              : index < 3 || index > 33
                                ? "#C7C7D2"
                                : C.muted,
                          }}
                        >
                          {day}
                        </div>
                      );
                    })}
                  </div>

                  {/* Upcoming */}
                  <div className="mt-7 border-t border-gray-100 pt-5">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-sm font-bold">Upcoming Events</h3>

                      <button
                        className="text-xs font-bold"
                        style={{
                          color: C.primary,
                        }}
                      >
                        View all
                      </button>
                    </div>

                    <div className="space-y-4">
                      {events.map((event) => (
                        <div key={event.title} className="flex gap-3">
                          <div
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs"
                            style={{
                              color: event.color,
                              backgroundColor: event.bg,
                            }}
                          >
                            {event.icon}
                          </div>

                          <div>
                            <p className="text-xs font-bold">{event.title}</p>

                            <p className="mt-1 text-[10px] text-gray-400">
                              {event.date} • {event.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              </aside>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

/* ============================================================
   SIDEBAR ITEM
============================================================ */
function SidebarItem({
  icon,
  label,
  to,
  active = false,
  collapsed = false,
  onClick,
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`
        group relative mb-1 flex items-center
        rounded-xl py-3 text-sm font-medium
        transition-all duration-200

        ${collapsed ? "justify-center px-2" : "gap-4 px-3"}

        ${
          active
            ? "bg-indigo-50 text-indigo-600 shadow-sm"
            : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
        }
      `}
    >
      {/* Active indicator */}
      {active && (
        <span
          className="
            absolute left-0 top-1/2
            h-6 w-1 -translate-y-1/2
            rounded-r-full bg-indigo-600
          "
        />
      )}

      <span
        className={`
          flex h-7 w-7 shrink-0 items-center justify-center
          rounded-lg text-lg transition
          ${
            active
              ? "text-indigo-600"
              : "text-gray-400 group-hover:text-gray-700"
          }
        `}
      >
        {icon}
      </span>

      {!collapsed && <span className="whitespace-nowrap">{label}</span>}

      {/* Tooltip when collapsed */}
      {collapsed && (
        <span
          className="
            pointer-events-none absolute left-full ml-3
            z-50 whitespace-nowrap
            rounded-lg bg-gray-900
            px-3 py-2 text-xs font-medium text-white
            opacity-0 shadow-lg
            transition-all duration-200
            group-hover:translate-x-1
            group-hover:opacity-100
          "
        >
          {label}
        </span>
      )}
    </Link>
  );
}

/* ============================================================
   STAT CARD
============================================================ */

function StatCard({ title, value, change, icon, color, bg }) {
  return (
    <div className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-xl text-lg font-bold"
          style={{
            color,
            backgroundColor: bg,
          }}
        >
          {icon}
        </div>

        <div className="text-right">
          <p
            className="text-xs font-bold"
            style={{
              color,
            }}
          >
            ↑ {change}
          </p>

          <p className="mt-1 text-[9px] text-gray-400">vs last month</p>
        </div>
      </div>

      <p className="mt-5 text-xs font-medium text-gray-500">{title}</p>

      <p className="mt-1 text-3xl font-bold tracking-tight">{value}</p>

      {/* tiny chart */}
      <div className="mt-4 flex h-6 items-end gap-[3px] opacity-60">
        {[20, 30, 18, 35, 24, 40, 28, 45, 32, 50, 36, 52].map(
          (height, index) => (
            <div
              key={index}
              className="w-full rounded-t-full"
              style={{
                height: `${height}%`,
                backgroundColor: color,
              }}
            />
          ),
        )}
      </div>
    </div>
  );
}

/* ============================================================
   COURSE CARD
============================================================ */

function CourseCard({
  title,
  lessons,
  completed,
  progress,
  icon,
  gradient,
  progressColor,
}) {
  return (
    <Link
      to="/courses"
      className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition duration-200 hover:-translate-y-1 hover:shadow-lg"
    >
      {/* Header */}
      <div className={`relative h-24 bg-gradient-to-br ${gradient}`}>
        <div className="absolute left-3 top-3 rounded-md bg-black/20 px-2 py-1 text-[10px] font-bold text-white">
          {progress}%
        </div>

        <div className="flex h-full items-center justify-center text-5xl text-white/90">
          {icon}
        </div>

        <button
          onClick={(e) => e.preventDefault()}
          className="absolute right-3 top-3 text-lg text-white"
        >
          ⋮
        </button>
      </div>

      {/* Body */}
      <div className="p-4">
        <p className="text-[10px] font-medium text-gray-400">Smart LMS</p>

        <h3 className="mt-1 truncate text-sm font-bold">{title}</h3>

        <div className="mt-3 flex items-center justify-between text-[10px] text-gray-500">
          <span>{lessons}</span>

          <span className="font-bold">{completed}</span>
        </div>

        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100">
          <div
            className={`h-full rounded-full ${progressColor}`}
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      </div>
    </Link>
  );
}

export default UserDashboard;

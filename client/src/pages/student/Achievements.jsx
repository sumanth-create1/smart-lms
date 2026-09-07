import { useEffect, useMemo, useState } from "react";
import {
  Award,
  BookOpen,
  CalendarDays,
  Check,
  Clock3,
  Flame,
  GraduationCap,
  Grid2X2,
  Lock,
  Medal,
  Search,
  Sparkles,
  Star,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import toast from "react-hot-toast";

import { getAllAchievements } from "../../services/achievementService";

// =====================================================
// BADGE CONFIGURATION
// =====================================================

const BADGE_CONFIG = {
  FIRST_LECTURE: {
    icon: GraduationCap,
    gradient: "from-indigo-500 to-violet-600",
    light: "bg-indigo-50",
    text: "text-indigo-600",
    ring: "ring-indigo-100",
  },

  FIRST_COURSE: {
    icon: Trophy,
    gradient: "from-yellow-400 to-orange-500",
    light: "bg-yellow-50",
    text: "text-yellow-600",
    ring: "ring-yellow-100",
  },

  FIVE_LECTURES: {
    icon: BookOpen,
    gradient: "from-emerald-400 to-teal-600",
    light: "bg-emerald-50",
    text: "text-emerald-600",
    ring: "ring-emerald-100",
  },

  TWENTY_FIVE_LECTURES: {
    icon: Medal,
    gradient: "from-purple-500 to-indigo-600",
    light: "bg-purple-50",
    text: "text-purple-600",
    ring: "ring-purple-100",
  },

  THREE_DAY_STREAK: {
    icon: Flame,
    gradient: "from-orange-400 to-red-500",
    light: "bg-orange-50",
    text: "text-orange-600",
    ring: "ring-orange-100",
  },

  SEVEN_DAY_STREAK: {
    icon: Flame,
    gradient: "from-red-500 to-pink-600",
    light: "bg-red-50",
    text: "text-red-600",
    ring: "ring-red-100",
  },

  TEN_HOURS: {
    icon: Clock3,
    gradient: "from-cyan-400 to-blue-600",
    light: "bg-cyan-50",
    text: "text-cyan-600",
    ring: "ring-cyan-100",
  },

  FIFTY_HOURS: {
    icon: Zap,
    gradient: "from-purple-500 to-fuchsia-600",
    light: "bg-purple-50",
    text: "text-purple-600",
    ring: "ring-purple-100",
  },

  COURSE_COMPLETED: {
    icon: Target,
    gradient: "from-green-500 to-emerald-600",
    light: "bg-green-50",
    text: "text-green-600",
    ring: "ring-green-100",
  },

  PERFECT_COURSE: {
    icon: Star,
    gradient: "from-pink-500 to-rose-600",
    light: "bg-pink-50",
    text: "text-pink-600",
    ring: "ring-pink-100",
  },
};

const DEFAULT_BADGE = {
  icon: Award,
  gradient: "from-indigo-500 to-violet-600",
  light: "bg-indigo-50",
  text: "text-indigo-600",
  ring: "ring-indigo-100",
};

// =====================================================
// HELPERS
// =====================================================

const getBadgeConfig = (achievement) => {
  return BADGE_CONFIG[achievement?.code] || DEFAULT_BADGE;
};

const getCategory = (achievement) => {
  switch (achievement?.requirementType) {
    case "LECTURES_COMPLETED":
      return "Learning";

    case "COURSES_ENROLLED":
    case "COURSES_COMPLETED":
      return "Courses";

    case "STREAK":
      return "Streak";

    case "LEARNING_HOURS":
      return "Hours";

    default:
      return "Special";
  }
};

const getProgress = (achievement) => {
  const current = Number(achievement?.progress || 0);
  const required = Number(achievement?.requirementValue || 0);

  if (!required) {
    return achievement?.unlocked ? 100 : 0;
  }

  return Math.min((current / required) * 100, 100);
};

// =====================================================
// ACHIEVEMENT CARD
// =====================================================

function AchievementCard({ achievement, index }) {
  const config = getBadgeConfig(achievement);
  const Icon = config.icon;

  const unlocked = achievement?.unlocked;
  const progress = getProgress(achievement);

  const current = Number(achievement?.progress || 0);
  const required = Number(achievement?.requirementValue || 0);

  return (
    <div
      className={`
        achievement-card group relative overflow-hidden
        rounded-3xl border bg-white p-5
        transition-all duration-500
        hover:-translate-y-2 hover:shadow-xl
        ${
          unlocked
            ? "border-emerald-100"
            : "border-slate-100"
        }
      `}
      style={{
        animationDelay: `${index * 70}ms`,
      }}
    >
      {/* Top accent */}
      {unlocked && (
        <div
          className="
            absolute left-0 right-0 top-0 h-1
            bg-gradient-to-r
            from-emerald-400 via-teal-400 to-cyan-400
          "
        />
      )}

      {/* Decorative circle */}
      <div
        className={`
          pointer-events-none
          absolute -right-12 -top-12
          h-32 w-32 rounded-full
          bg-gradient-to-br ${config.gradient}
          opacity-[0.05]
          transition-transform duration-700
          group-hover:scale-150
        `}
      />

      {/* Header */}
      <div className="relative flex items-start justify-between">
        {/* Badge */}
        <div
          className={`
            relative flex h-[76px] w-[76px]
            items-center justify-center
            rounded-[22px]
            bg-gradient-to-br ${config.gradient}
            shadow-lg
            transition-all duration-500
            group-hover:rotate-3 group-hover:scale-110
            ${unlocked ? "" : "grayscale opacity-60"}
          `}
        >
          <div
            className="
              absolute inset-1.5
              rounded-[18px]
              border border-white/30
            "
          />

          <Icon
            size={34}
            strokeWidth={1.8}
            className="relative text-white"
          />

          {unlocked && (
            <Sparkles
              size={14}
              className="
                absolute -right-1 -top-1
                animate-pulse
                text-yellow-400
              "
            />
          )}
        </div>

        {/* Status */}
        {unlocked ? (
          <span
            className="
              flex items-center gap-1.5
              rounded-full bg-emerald-50
              px-3 py-1.5
              text-xs font-bold text-emerald-600
            "
          >
            <Check size={13} strokeWidth={3} />
            Unlocked
          </span>
        ) : (
          <span
            className="
              flex items-center gap-1.5
              rounded-full bg-slate-100
              px-3 py-1.5
              text-xs font-semibold text-slate-500
            "
          >
            <Lock size={12} />
            Locked
          </span>
        )}
      </div>

      {/* Content */}
      <div className="relative mt-5">
        <div className="mb-2">
          <span
            className={`
              inline-flex rounded-full
              px-2.5 py-1
              text-[10px] font-bold
              uppercase tracking-wider
              ${config.light}
              ${config.text}
            `}
          >
            {getCategory(achievement)}
          </span>
        </div>

        <h3
          className="
            text-lg font-bold
            text-slate-900
            transition-colors
            group-hover:text-indigo-600
          "
        >
          {achievement?.name || "Achievement"}
        </h3>

        <p
          className="
            mt-1.5 min-h-[40px]
            text-sm leading-5
            text-slate-500
          "
        >
          {achievement?.description ||
            "Complete this milestone to unlock it."}
        </p>

        {/* Locked progress */}
        {!unlocked && required > 0 && (
          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">
                Progress
              </span>

              <span className="text-xs font-bold text-indigo-500">
                {current} / {required}
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="
                  h-full rounded-full
                  bg-gradient-to-r
                  from-indigo-500 to-violet-500
                  transition-all duration-1000
                "
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Unlocked date */}
        {unlocked && (
          <div
            className="
              mt-5 flex items-center gap-2
              text-xs font-medium text-slate-400
            "
          >
            <CalendarDays size={14} />

            <span>
              Unlocked{" "}
              {achievement?.unlockedAt
                ? new Date(
                    achievement.unlockedAt
                  ).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "recently"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// =====================================================
// MAIN COMPONENT
// =====================================================

export default function Achievements() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  // ===================================================
  // FETCH ACHIEVEMENTS
  // ===================================================

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        setLoading(true);

        const response = await getAllAchievements();

        setAchievements(
          response?.achievements || []
        );
      } catch (error) {
        console.error(
          "Fetch achievements error:",
          error
        );

        toast.error(
          "Failed to load achievements"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  // ===================================================
  // STATS
  // ===================================================

  const stats = useMemo(() => {
    const total = achievements.length;

    const unlocked = achievements.filter(
      (achievement) =>
        achievement.unlocked
    ).length;

    const remaining = total - unlocked;

    const percentage =
      total > 0
        ? Math.round(
            (unlocked / total) * 100
          )
        : 0;

    return {
      total,
      unlocked,
      remaining,
      percentage,
    };
  }, [achievements]);

  // ===================================================
  // FILTER
  // ===================================================

  const filteredAchievements = useMemo(() => {
    return achievements.filter(
      (achievement) => {
        const searchText =
          search.toLowerCase();

        const matchesSearch =
          achievement?.name
            ?.toLowerCase()
            .includes(searchText) ||
          achievement?.description
            ?.toLowerCase()
            .includes(searchText);

        const matchesFilter =
          activeFilter === "All" ||
          getCategory(achievement) ===
            activeFilter;

        return (
          matchesSearch &&
          matchesFilter
        );
      }
    );
  }, [
    achievements,
    search,
    activeFilter,
  ]);

  // ===================================================
  // FILTERS
  // ===================================================

  const filters = [
    {
      label: "All",
      icon: Grid2X2,
    },
    {
      label: "Learning",
      icon: BookOpen,
    },
    {
      label: "Courses",
      icon: GraduationCap,
    },
    {
      label: "Streak",
      icon: Flame,
    },
    {
      label: "Hours",
      icon: Clock3,
    },
  ];

  // ===================================================
  // LOADING
  // ===================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8faff] p-5 sm:p-7 lg:p-8">
        <div className="mx-auto max-w-7xl animate-pulse">

          <div className="h-8 w-64 rounded-lg bg-slate-200" />

          <div
            className="
              mt-6 h-[280px]
              rounded-[28px]
              bg-white
            "
          />

          <div className="mt-6 flex gap-3">
            {[1, 2, 3, 4, 5].map(
              (item) => (
                <div
                  key={item}
                  className="
                    h-11 w-28
                    rounded-full
                    bg-slate-200
                  "
                />
              )
            )}
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map(
              (item) => (
                <div
                  key={item}
                  className="
                    h-72
                    rounded-3xl
                    bg-white
                  "
                />
              )
            )}
          </div>
        </div>
      </div>
    );
  }

  // ===================================================
  // PAGE
  // ===================================================

  return (
    <>
      <style>{`
        @keyframes achievementEntrance {
          from {
            opacity: 0;
            transform: translateY(18px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes trophyFloat {
          0%, 100% {
            transform: translateY(0) rotate(-2deg);
          }

          50% {
            transform: translateY(-8px) rotate(2deg);
          }
        }

        @keyframes softFloat {
          0%, 100% {
            transform: translate(0, 0);
          }

          50% {
            transform: translate(10px, -8px);
          }
        }

        @keyframes shine {
          0% {
            transform: translateX(-120%);
          }

          100% {
            transform: translateX(220%);
          }
        }

        .achievement-entrance {
          animation:
            achievementEntrance
            0.55s
            ease-out
            both;
        }

        .trophy-float {
          animation:
            trophyFloat
            4s
            ease-in-out
            infinite;
        }

        .soft-float {
          animation:
            softFloat
            5s
            ease-in-out
            infinite;
        }

        .achievement-card {
          animation:
            achievementEntrance
            0.55s
            ease-out
            both;
        }
      `}</style>

      <div className="min-h-screen bg-[#f8faff]">
        <div className="mx-auto max-w-7xl space-y-7 p-4 sm:p-6 lg:p-8">

          {/* =================================================
              PAGE HEADER
          ================================================= */}

          <div
            className="
              flex flex-col gap-5
              md:flex-row
              md:items-center
              md:justify-between
            "
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">
                  👋
                </span>

                <h1
                  className="
                    text-2xl font-bold
                    tracking-tight
                    text-slate-900
                    sm:text-3xl
                  "
                >
                  Keep going!
                </h1>
              </div>

              <p className="mt-1 text-sm text-slate-500">
                Every achievement brings you
                closer to your goals.
              </p>
            </div>

            {/* Search */}
            <div className="relative w-full md:w-72">
              <Search
                size={18}
                className="
                  absolute left-4 top-1/2
                  -translate-y-1/2
                  text-slate-400
                "
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search achievements..."
                className="
                  h-12 w-full
                  rounded-2xl
                  border border-slate-200
                  bg-white
                  pl-11 pr-4
                  text-sm text-slate-700
                  outline-none
                  transition-all
                  placeholder:text-slate-400
                  focus:border-indigo-300
                  focus:ring-4
                  focus:ring-indigo-100
                "
              />
            </div>
          </div>

          {/* =================================================
              NEW HERO CARD
          ================================================= */}

          <section
            className="
              relative
              overflow-hidden
              rounded-[28px]
              border
              border-slate-100
              bg-white
              p-6
              shadow-sm
              sm:p-8
              lg:p-10
            "
          >
            {/* ================================
                BACKGROUND DECORATIONS
            ================================= */}

            <div
              className="
                pointer-events-none
                absolute
                -left-20
                -top-20
                h-56
                w-56
                rounded-full
                bg-indigo-100/60
                blur-2xl
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                -bottom-24
                -left-10
                h-56
                w-56
                rounded-full
                bg-purple-100/60
                blur-2xl
              "
            />

            <div
              className="
                soft-float
                pointer-events-none
                absolute
                right-16
                top-8
                h-5
                w-5
                rounded-full
                bg-cyan-200
                opacity-70
              "
            />

            <div
              className="
                soft-float
                pointer-events-none
                absolute
                right-32
                top-20
                h-3
                w-3
                rounded-full
                bg-yellow-300
              "
            />

            <div
              className="
                soft-float
                pointer-events-none
                absolute
                bottom-8
                right-1/3
                h-4
                w-4
                rounded-full
                bg-pink-200
              "
            />

            {/* ================================
                HERO CONTENT
            ================================= */}

            <div
              className="
                relative
                grid
                gap-8
                lg:grid-cols-[230px_1fr_340px]
                lg:items-center
              "
            >
              {/* Trophy */}
              <div
                className="
                  flex
                  items-center
                  justify-center
                  lg:justify-start
                "
              >
                <div className="trophy-float relative">

                  {/* Glow */}
                  <div
                    className="
                      absolute
                      inset-3
                      rounded-full
                      bg-yellow-200/50
                      blur-2xl
                    "
                  />

                  {/* Trophy circle */}
                  <div
                    className="
                      relative
                      flex
                      h-44
                      w-44
                      items-center
                      justify-center
                      rounded-full
                      bg-gradient-to-br
                      from-yellow-50
                      via-white
                      to-indigo-50
                      shadow-inner
                    "
                  >
                    {/* Confetti */}
                    <span
                      className="
                        absolute
                        left-7
                        top-7
                        h-2
                        w-2
                        rotate-45
                        rounded-sm
                        bg-cyan-400
                      "
                    />

                    <span
                      className="
                        absolute
                        right-8
                        top-10
                        h-2
                        w-2
                        rounded-full
                        bg-pink-400
                      "
                    />

                    <span
                      className="
                        absolute
                        bottom-9
                        left-9
                        h-2
                        w-2
                        rotate-45
                        bg-purple-400
                      "
                    />

                    <span
                      className="
                        absolute
                        bottom-10
                        right-8
                        h-2
                        w-2
                        rounded-full
                        bg-yellow-400
                      "
                    />

                    {/* Trophy badge */}
                    <div
                      className="
                        flex
                        h-28
                        w-28
                        items-center
                        justify-center
                        rounded-[32px]
                        bg-gradient-to-br
                        from-yellow-400
                        to-orange-500
                        shadow-xl
                        shadow-orange-200
                      "
                    >
                      <Trophy
                        size={56}
                        strokeWidth={1.7}
                        className="text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Main text */}
              <div>
                <p
                  className="
                    text-xs
                    font-bold
                    uppercase
                    tracking-[0.18em]
                    text-indigo-500
                  "
                >
                  Your achievement journey
                </p>

                <h2
                  className="
                    mt-2
                    text-3xl
                    font-black
                    tracking-tight
                    text-slate-900
                    sm:text-4xl
                  "
                >
                  Small Steps.
                  <br />
                  Big Goals.
                </h2>

                <p
                  className="
                    mt-4
                    max-w-xl
                    text-sm
                    leading-6
                    text-slate-500
                    sm:text-base
                  "
                >
                  Every course, every lecture,
                  every milestone brings you
                  closer to your dreams.
                  <span className="font-semibold text-slate-700">
                    {" "}
                    Keep going!
                  </span>
                </p>

                {/* Progress */}
                <div className="mt-7 max-w-xl">
                  <div
                    className="
                      mb-2
                      flex
                      items-center
                      justify-between
                    "
                  >
                    <span
                      className="
                        text-sm
                        font-semibold
                        text-slate-700
                      "
                    >
                      {stats.unlocked} /{" "}
                      {stats.total} achievements
                      unlocked
                    </span>

                    <span
                      className="
                        text-sm
                        font-bold
                        text-indigo-600
                      "
                    >
                      {stats.percentage}%
                    </span>
                  </div>

                  <div
                    className="
                      h-3
                      overflow-hidden
                      rounded-full
                      bg-slate-100
                    "
                  >
                    <div
                      className="
                        relative
                        h-full
                        rounded-full
                        bg-gradient-to-r
                        from-indigo-500
                        via-violet-500
                        to-purple-500
                        transition-all
                        duration-1000
                      "
                      style={{
                        width: `${stats.percentage}%`,
                      }}
                    >
                      {stats.percentage > 0 && (
                        <div
                          className="
                            absolute
                            inset-y-0
                            left-0
                            w-16
                            bg-white/30
                            blur-sm
                          "
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div
                className="
                  grid
                  grid-cols-3
                  gap-3
                  lg:self-center
                "
              >
                {/* Unlocked */}
                <div
                  className="
                    rounded-2xl
                    border
                    border-emerald-100
                    bg-emerald-50/60
                    p-4
                    text-center
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:shadow-md
                  "
                >
                  <div
                    className="
                      mx-auto
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-xl
                      bg-emerald-100
                    "
                  >
                    <Trophy
                      size={19}
                      className="text-emerald-600"
                    />
                  </div>

                  <p
                    className="
                      mt-3
                      text-2xl
                      font-black
                      text-slate-900
                    "
                  >
                    {stats.unlocked}
                  </p>

                  <p
                    className="
                      mt-0.5
                      text-xs
                      font-medium
                      text-slate-500
                    "
                  >
                    Unlocked
                  </p>
                </div>

                {/* Remaining */}
                <div
                  className="
                    rounded-2xl
                    border
                    border-indigo-100
                    bg-indigo-50/60
                    p-4
                    text-center
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:shadow-md
                  "
                >
                  <div
                    className="
                      mx-auto
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-xl
                      bg-indigo-100
                    "
                  >
                    <Lock
                      size={19}
                      className="text-indigo-600"
                    />
                  </div>

                  <p
                    className="
                      mt-3
                      text-2xl
                      font-black
                      text-slate-900
                    "
                  >
                    {stats.remaining}
                  </p>

                  <p
                    className="
                      mt-0.5
                      text-xs
                      font-medium
                      text-slate-500
                    "
                  >
                    Remaining
                  </p>
                </div>

                {/* Complete */}
                <div
                  className="
                    rounded-2xl
                    border
                    border-yellow-100
                    bg-yellow-50/70
                    p-4
                    text-center
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:shadow-md
                  "
                >
                  <div
                    className="
                      mx-auto
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-xl
                      bg-yellow-100
                    "
                  >
                    <Star
                      size={19}
                      className="text-yellow-600"
                    />
                  </div>

                  <p
                    className="
                      mt-3
                      text-2xl
                      font-black
                      text-slate-900
                    "
                  >
                    {stats.percentage}%
                  </p>

                  <p
                    className="
                      mt-0.5
                      text-xs
                      font-medium
                      text-slate-500
                    "
                  >
                    Complete
                  </p>
                </div>
              </div>
            </div>

            {/* Handwritten style motivation */}
            <div
              className="
                absolute
                right-8
                top-5
                hidden
                rotate-[-4deg]
                text-right
                lg:block
              "
            >
              <p
                className="
                  text-sm
                  font-semibold
                  text-indigo-400
                "
              >
                You can
                <br />
                do it! ✨
              </p>

              <div
                className="
                  ml-auto
                  mt-1
                  h-8
                  w-14
                  rounded-br-full
                  border-b-2
                  border-r-2
                  border-indigo-300
                "
              />
            </div>
          </section>

          {/* =================================================
              FILTERS
          ================================================= */}

          <div
            className="
              flex
              flex-col
              gap-4
              lg:flex-row
              lg:items-center
              lg:justify-between
            "
          >
            <div
              className="
                flex
                gap-2
                overflow-x-auto
                pb-1
              "
            >
              {filters.map(
                (filter) => {
                  const Icon =
                    filter.icon;

                  const active =
                    activeFilter ===
                    filter.label;

                  return (
                    <button
                      key={filter.label}
                      type="button"
                      onClick={() =>
                        setActiveFilter(
                          filter.label
                        )
                      }
                      className={`
                        flex
                        shrink-0
                        items-center
                        gap-2
                        rounded-full
                        px-5
                        py-2.5
                        text-sm
                        font-semibold
                        transition-all
                        duration-300
                        ${
                          active
                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                            : "border border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                        }
                      `}
                    >
                      <Icon size={15} />

                      {filter.label}
                    </button>
                  );
                }
              )}
            </div>

            <p
              className="
                text-sm
                font-medium
                text-slate-400
              "
            >
              Showing{" "}
              <span className="font-bold text-slate-700">
                {
                  filteredAchievements.length
                }
              </span>{" "}
              achievements
            </p>
          </div>

          {/* =================================================
              SECTION HEADER
          ================================================= */}

          <div>
            <h2
              className="
                text-2xl
                font-bold
                tracking-tight
                text-slate-900
              "
            >
              Achievements
            </h2>

            <p
              className="
                mt-1
                text-sm
                text-slate-500
              "
            >
              Complete milestones, earn
              badges and showcase your
              progress.
            </p>
          </div>

          {/* =================================================
              EMPTY STATE
          ================================================= */}

          {filteredAchievements.length ===
          0 ? (
            <div
              className="
                flex
                min-h-[320px]
                flex-col
                items-center
                justify-center
                rounded-3xl
                border
                border-dashed
                border-slate-200
                bg-white
                p-8
                text-center
              "
            >
              <div
                className="
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-2xl
                  bg-indigo-50
                "
              >
                <Search
                  size={28}
                  className="text-indigo-500"
                />
              </div>

              <h3
                className="
                  mt-5
                  text-lg
                  font-bold
                  text-slate-900
                "
              >
                No achievements found
              </h3>

              <p
                className="
                  mt-1
                  max-w-sm
                  text-sm
                  text-slate-500
                "
              >
                Try another search term
                or choose a different
                category.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setActiveFilter("All");
                }}
                className="
                  mt-5
                  rounded-xl
                  bg-indigo-600
                  px-5
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-indigo-700
                "
              >
                Clear filters
              </button>
            </div>
          ) : (
            /* =================================================
               ACHIEVEMENT GRID
            ================================================= */

            <div
              className="
                grid
                gap-5
                sm:grid-cols-2
                xl:grid-cols-4
              "
            >
              {filteredAchievements.map(
                (
                  achievement,
                  index
                ) => (
                  <AchievementCard
                    key={
                      achievement?._id ||
                      achievement?.code ||
                      index
                    }
                    achievement={
                      achievement
                    }
                    index={index}
                  />
                )
              )}
            </div>
          )}

          {/* =================================================
              BOTTOM MOTIVATION
          ================================================= */}

          {stats.remaining > 0 && (
            <section
              className="
                relative
                overflow-hidden
                rounded-3xl
                border
                border-indigo-100
                bg-gradient-to-r
                from-indigo-50
                via-white
                to-purple-50
                p-6
                sm:p-7
              "
            >
              <div
                className="
                  absolute
                  -right-10
                  -top-10
                  h-32
                  w-32
                  rounded-full
                  bg-purple-200/40
                  blur-2xl
                "
              />

              <div
                className="
                  relative
                  flex
                  flex-col
                  gap-5
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-4
                  "
                >
                  <div
                    className="
                      trophy-float
                      flex
                      h-14
                      w-14
                      shrink-0
                      items-center
                      justify-center
                      rounded-2xl
                      bg-gradient-to-br
                      from-yellow-400
                      to-orange-500
                      shadow-lg
                      shadow-orange-100
                    "
                  >
                    <Trophy
                      size={28}
                      className="text-white"
                    />
                  </div>

                  <div>
                    <h3
                      className="
                        text-lg
                        font-bold
                        text-slate-900
                      "
                    >
                      More achievements await!
                    </h3>

                    <p
                      className="
                        mt-1
                        text-sm
                        text-slate-500
                      "
                    >
                      Keep learning, keep
                      growing, keep unlocking.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {[
                    Trophy,
                    GraduationCap,
                    Flame,
                    Star,
                  ].map(
                    (
                      Icon,
                      index
                    ) => (
                      <div
                        key={index}
                        className="
                          flex
                          h-10
                          w-10
                          items-center
                          justify-center
                          rounded-xl
                          border
                          border-white
                          bg-white
                          shadow-sm
                          transition-all
                          duration-300
                          hover:-translate-y-1
                          hover:scale-110
                        "
                      >
                        <Icon
                          size={19}
                          className="text-indigo-500"
                        />
                      </div>
                    )
                  )}
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
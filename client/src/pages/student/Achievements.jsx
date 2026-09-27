import {
  memo,
  useMemo,
  useState,
} from "react";

import {
  Award,
  CalendarDays,
  Check,
  ChevronDown,
  Crown,
  Flame,
  Gem,
  GraduationCap,
  Lock,
  Medal,
  Search,
  Sparkles,
  Star,
  Trophy,
  Zap,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

// =====================================================
// CATEGORY MAP
// =====================================================

const CATEGORY_MAP = {
  LEARNING: "Learning",
  COURSE: "Courses",
  STREAK: "Streak",
  TIME: "Hours",
  SPECIAL: "Special",
};

// =====================================================
// BADGE CONFIG
// =====================================================

const BADGE_CONFIG = {
  FIRST_LECTURE: {
    icon: GraduationCap,
    gradient: "from-cyan-400 to-blue-500",
    text: "text-cyan-300",
    glow: "shadow-cyan-500/20",
  },

  FIVE_LECTURES: {
    icon: BookOpenIcon,
    gradient: "from-blue-400 to-indigo-500",
    text: "text-blue-300",
    glow: "shadow-blue-500/20",
  },

  TEN_LECTURES: {
    icon: Medal,
    gradient: "from-indigo-400 to-purple-500",
    text: "text-indigo-300",
    glow: "shadow-indigo-500/20",
  },

  TWENTY_FIVE_LECTURES: {
    icon: Trophy,
    gradient: "from-purple-400 to-fuchsia-500",
    text: "text-purple-300",
    glow: "shadow-purple-500/20",
  },

  FIFTY_LECTURES: {
    icon: Crown,
    gradient: "from-fuchsia-400 to-pink-500",
    text: "text-fuchsia-300",
    glow: "shadow-fuchsia-500/20",
  },

  HUNDRED_LECTURES: {
    icon: Crown,
    gradient: "from-amber-300 to-orange-500",
    text: "text-amber-300",
    glow: "shadow-amber-500/20",
  },

  FIRST_COURSE: {
    icon: GraduationCap,
    gradient: "from-emerald-400 to-teal-500",
    text: "text-emerald-300",
    glow: "shadow-emerald-500/20",
  },

  THREE_COURSES: {
    icon: Gem,
    gradient: "from-teal-400 to-cyan-500",
    text: "text-teal-300",
    glow: "shadow-teal-500/20",
  },

  FIVE_COURSES: {
    icon: Crown,
    gradient: "from-cyan-400 to-blue-500",
    text: "text-cyan-300",
    glow: "shadow-cyan-500/20",
  },

  FIRST_COURSE_COMPLETED: {
    icon: Check,
    gradient: "from-green-400 to-emerald-500",
    text: "text-green-300",
    glow: "shadow-green-500/20",
  },

  THREE_COURSES_COMPLETED: {
    icon: Medal,
    gradient: "from-emerald-400 to-green-500",
    text: "text-emerald-300",
    glow: "shadow-emerald-500/20",
  },

  FIVE_COURSES_COMPLETED: {
    icon: Trophy,
    gradient: "from-green-400 to-lime-500",
    text: "text-green-300",
    glow: "shadow-green-500/20",
  },

  THREE_DAY_STREAK: {
    icon: Flame,
    gradient: "from-orange-400 to-red-500",
    text: "text-orange-300",
    glow: "shadow-orange-500/20",
  },

  SEVEN_DAY_STREAK: {
    icon: Flame,
    gradient: "from-red-400 to-rose-500",
    text: "text-red-300",
    glow: "shadow-red-500/20",
  },

  FOURTEEN_DAY_STREAK: {
    icon: Flame,
    gradient: "from-rose-400 to-pink-500",
    text: "text-rose-300",
    glow: "shadow-rose-500/20",
  },

  THIRTY_DAY_STREAK: {
    icon: Crown,
    gradient: "from-pink-400 to-fuchsia-500",
    text: "text-pink-300",
    glow: "shadow-pink-500/20",
  },

  TEN_HOURS: {
    icon: Star,
    gradient: "from-yellow-300 to-amber-500",
    text: "text-yellow-300",
    glow: "shadow-yellow-500/20",
  },

  TWENTY_FIVE_HOURS: {
    icon: Gem,
    gradient: "from-amber-300 to-orange-500",
    text: "text-amber-300",
    glow: "shadow-amber-500/20",
  },

  FIFTY_HOURS: {
    icon: Trophy,
    gradient: "from-orange-400 to-red-500",
    text: "text-orange-300",
    glow: "shadow-orange-500/20",
  },

  HUNDRED_HOURS: {
    icon: Crown,
    gradient: "from-purple-400 to-pink-500",
    text: "text-purple-300",
    glow: "shadow-purple-500/20",
  },
};

// =====================================================
// FALLBACK BADGE
// =====================================================

const DEFAULT_BADGE = {
  icon: Award,
  gradient: "from-slate-400 to-slate-600",
  text: "text-slate-300",
  glow: "shadow-slate-500/20",
};

// =====================================================
// BOOK OPEN ICON
// =====================================================

function BookOpenIcon(props) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 4.5A2.5 2.5 0 0 1 4.5 2H11v19H4.5A2.5 2.5 0 0 0 2 23V4.5Z" />
      <path d="M22 4.5A2.5 2.5 0 0 0 19.5 2H13v19h6.5A2.5 2.5 0 0 1 22 23V4.5Z" />
    </svg>
  );
}

// =====================================================
// HELPERS
// =====================================================

const getBadgeConfig = (achievement) => {
  return (
    BADGE_CONFIG[achievement?.key] ||
    DEFAULT_BADGE
  );
};

const getCategory = (achievement) => {
  return (
    CATEGORY_MAP[achievement?.category] ||
    "Special"
  );
};

// =====================================================
// PROGRESS HELPER
// =====================================================

const getProgress = (achievement) => {
  // Prefer the percentage calculated by backend
  const backendProgress = Number(
    achievement?.progressPercentage
  );

  if (Number.isFinite(backendProgress)) {
    return Math.min(
      Math.max(backendProgress, 0),
      100
    );
  }

  // Fallback calculation
  const current = Number(
    achievement?.progress || 0
  );

  const required = Number(
    achievement?.requiredProgress ??
      achievement?.requirementValue ??
      0
  );

  if (!required) {
    return achievement?.unlocked
      ? 100
      : 0;
  }

  return Math.min(
    Math.max(
      (current / required) * 100,
      0
    ),
    100
  );
};

// =====================================================
// DATE FORMATTER
// =====================================================

const formatUnlockDate = (date) => {
  if (!date) {
    return "Recently";
  }

  try {
    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  } catch {
    return "Recently";
  }
};

// =====================================================
// ACHIEVEMENT CARD
// =====================================================

const AchievementCard = memo(
  function AchievementCard({
    achievement,
    index,
  }) {
    const config =
      getBadgeConfig(achievement);

    const Icon = config.icon;

    const unlocked = Boolean(
      achievement?.unlocked
    );

    const progress =
      getProgress(achievement);

    const current = Number(
      achievement?.progress ?? 0
    );

    const required = Number(
      achievement?.requiredProgress ??
        achievement?.requirementValue ??
        0
    );

    const progressPercentage =
      Math.round(progress);

    return (
      <div
        className={`
          group relative overflow-hidden rounded-2xl
          border border-white/10
          bg-white/[0.025]
          p-5
          transition-all duration-300
          hover:-translate-y-1
          hover:border-white/20
          hover:bg-white/[0.04]
          ${unlocked ? config.glow : ""}
        `}
        style={{
          animationDelay: `${index * 50}ms`,
        }}
      >
        {/* =================================================
            BACKGROUND GLOW
        ================================================= */}

        <div
          className={`
            pointer-events-none absolute
            -right-16 -top-16
            h-32 w-32
            rounded-full
            bg-gradient-to-br
            ${config.gradient}
            opacity-[0.06]
            blur-3xl
          `}
        />

        {/* =================================================
            TOP ROW
        ================================================= */}

        <div className="relative flex items-start justify-between">
          {/* BADGE */}

          <div
            className={`
              relative flex h-14 w-14
              items-center justify-center
              rounded-2xl
              border border-white/10
              bg-gradient-to-br
              ${config.gradient}
              ${unlocked ? "opacity-100" : "opacity-40 grayscale"}
              shadow-lg
            `}
          >
            <Icon
              size={25}
              strokeWidth={1.7}
              className="text-white"
            />

            {/* Unlocked check */}

            {unlocked && (
              <div className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full border border-black bg-emerald-500">
                <Check
                  size={11}
                  strokeWidth={3}
                  className="text-white"
                />
              </div>
            )}

            {/* Locked icon */}

            {!unlocked && (
              <div className="absolute -bottom-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full border border-black bg-slate-800">
                <Lock
                  size={10}
                  className="text-slate-400"
                />
              </div>
            )}
          </div>

          {/* CATEGORY */}

          <span
            className={`
              rounded-full
              border border-white/10
              bg-black/30
              px-2.5 py-1
              text-[9px]
              font-bold
              uppercase
              tracking-[0.16em]
              ${config.text}
            `}
          >
            {getCategory(achievement)}
          </span>
        </div>

        {/* =================================================
            TITLE
        ================================================= */}

        <div className="relative mt-5">
          <h3
            className={`
              text-base
              font-bold
              tracking-tight
              ${
                unlocked
                  ? "text-white"
                  : "text-slate-300"
              }
            `}
          >
            {achievement?.title ||
              "Achievement"}
          </h3>

          <p className="mt-1.5 text-sm leading-6 text-slate-500">
            {achievement?.description ||
              "Complete the requirement to unlock this achievement."}
          </p>
        </div>

        {/* =================================================
            PROGRESS
        ================================================= */}

        {required > 0 && (
          <div className="relative mt-5">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-600">
                Quest progress
              </span>

              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-bold ${config.text}`}
                >
                  {current} / {required}
                </span>

                <span className="text-[10px] font-bold text-slate-600">
                  {progressPercentage}%
                </span>
              </div>
            </div>

            <div className="relative h-2 overflow-hidden rounded-full border border-white/5 bg-black/50">
              <div
                className={`
                  relative h-full rounded-full
                  bg-gradient-to-r
                  ${config.gradient}
                  transition-[width]
                  duration-700
                `}
                style={{
                  width: `${progressPercentage}%`,
                }}
              />

              {/* Small shine */}

              {progressPercentage > 0 && (
                <div
                  className="
                    pointer-events-none
                    absolute inset-y-0 right-0
                    w-8
                    bg-white/20
                    blur-md
                  "
                  style={{
                    right: `${100 - progressPercentage}%`,
                  }}
                />
              )}
            </div>
          </div>
        )}

        {/* =================================================
            UNLOCKED DATE
        ================================================= */}

        {unlocked && (
          <div className="mt-5 flex items-center gap-2 border-t border-white/5 pt-4 text-xs text-slate-600">
            <CalendarDays
              size={14}
              className="text-amber-300/50"
            />

            <span>
              Chronicle recorded{" "}
              {formatUnlockDate(
                achievement?.unlockedAt
              )}
            </span>
          </div>
        )}
      </div>
    );
  }
);

// =====================================================
// MAIN PAGE
// =====================================================

export default function Achievements() {
  const auth = useAuth();

  const achievements = Array.isArray(
    auth?.achievements
  )
    ? auth.achievements
    : [];

  const achievementsLoading = Boolean(
    auth?.achievementsLoading
  );

  const [search, setSearch] =
    useState("");

  const [selectedCategory, setSelectedCategory] =
    useState("All");

  // ===================================================
  // STATS
  // ===================================================

  const stats = useMemo(() => {
    const total =
      achievements.length;

    const unlocked =
      achievements.reduce(
        (count, achievement) =>
          count +
          (achievement?.unlocked
            ? 1
            : 0),
        0
      );

    return {
      total,
      unlocked,
      remaining: Math.max(
        total - unlocked,
        0
      ),
      percentage:
        total > 0
          ? Math.round(
              (unlocked / total) * 100
            )
          : 0,
    };
  }, [achievements]);

  // ===================================================
  // CATEGORIES
  // ===================================================

  const categories = useMemo(() => {
    const values = achievements
      .map((achievement) =>
        getCategory(achievement)
      )
      .filter(Boolean);

    return [
      "All",
      ...Array.from(
        new Set(values)
      ),
    ];
  }, [achievements]);

  // ===================================================
  // FILTERED ACHIEVEMENTS
  // ===================================================

  const filteredAchievements =
    useMemo(() => {
      const query =
        search.trim().toLowerCase();

      return achievements.filter(
        (achievement) => {
          const matchesSearch =
            !query ||
            achievement?.title
              ?.toLowerCase()
              .includes(query) ||
            achievement?.description
              ?.toLowerCase()
              .includes(query) ||
            achievement?.key
              ?.toLowerCase()
              .includes(query);

          const matchesCategory =
            selectedCategory === "All" ||
            getCategory(achievement) ===
              selectedCategory;

          return (
            matchesSearch &&
            matchesCategory
          );
        }
      );
    }, [
      achievements,
      search,
      selectedCategory,
    ]);

  // ===================================================
  // LOADING
  // ===================================================

  if (achievementsLoading) {
    return (
      <div className="min-h-screen bg-[#050505] px-6 py-10 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="animate-pulse">
            <div className="h-10 w-64 rounded-lg bg-white/5" />

            <div className="mt-4 h-5 w-96 max-w-full rounded bg-white/5" />

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({
                length: 6,
              }).map((_, index) => (
                <div
                  key={index}
                  className="h-64 rounded-2xl border border-white/5 bg-white/[0.025]"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===================================================
  // PAGE
  // ===================================================

  return (
    <div className="min-h-screen bg-[#050505] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* =================================================
            HERO
        ================================================= */}

        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-8 lg:p-10">

          {/* Background glow */}

          <div className="pointer-events-none absolute -right-32 -top-32 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-40 -left-20 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl" />

          <div className="relative">

            <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">

              <div>
                <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-amber-300">
                  <Sparkles size={14} />
                  Hall of Progress
                </div>

                <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                  Your Achievements
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
                  Every lecture completed,
                  every course conquered,
                  and every learning streak
                  builds your legacy.
                </p>
              </div>

              {/* Completion */}

              <div className="min-w-[220px] rounded-2xl border border-white/10 bg-black/20 p-5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600">
                    Collection
                  </span>

                  <Trophy
                    size={17}
                    className="text-amber-300"
                  />
                </div>

                <div className="mt-3 flex items-end justify-between">
                  <span className="text-3xl font-black">
                    {stats.percentage}%
                  </span>

                  <span className="pb-1 text-xs text-slate-600">
                    {stats.unlocked}/
                    {stats.total}
                  </span>
                </div>

                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-300 to-orange-500 transition-[width] duration-700"
                    style={{
                      width: `${stats.percentage}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* =================================================
                STAT ROW
            ================================================= */}

            <div className="mt-8 grid gap-3 sm:grid-cols-3">

              <div className="rounded-2xl border border-white/5 bg-black/20 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10">
                    <Check
                      size={16}
                      className="text-emerald-400"
                    />
                  </div>

                  <div>
                    <p className="text-xl font-black">
                      {stats.unlocked}
                    </p>

                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600">
                      Unlocked
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/5 bg-black/20 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10">
                    <Trophy
                      size={16}
                      className="text-amber-400"
                    />
                  </div>

                  <div>
                    <p className="text-xl font-black">
                      {stats.total}
                    </p>

                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600">
                      Total Quests
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/5 bg-black/20 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10">
                    <Zap
                      size={16}
                      className="text-purple-400"
                    />
                  </div>

                  <div>
                    <p className="text-xl font-black">
                      {stats.remaining}
                    </p>

                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600">
                      Remaining
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* =================================================
            FILTER BAR
        ================================================= */}

        <section className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          {/* Search */}

          <div className="relative w-full lg:max-w-sm">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
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
                h-11 w-full
                rounded-xl
                border border-white/10
                bg-white/[0.025]
                pl-11 pr-4
                text-sm
                text-white
                outline-none
                placeholder:text-slate-700
                focus:border-white/20
              "
            />
          </div>

          {/* Categories */}

          <div className="flex flex-wrap gap-2">
            {categories.map(
              (category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() =>
                    setSelectedCategory(
                      category
                    )
                  }
                  className={`
                    rounded-xl
                    border
                    px-4 py-2
                    text-xs
                    font-bold
                    transition
                    ${
                      selectedCategory ===
                      category
                        ? "border-amber-300/30 bg-amber-300/10 text-amber-300"
                        : "border-white/10 bg-white/[0.025] text-slate-500 hover:border-white/20 hover:text-slate-300"
                    }
                  `}
                >
                  {category}
                </button>
              )
            )}
          </div>
        </section>

        {/* =================================================
            ACHIEVEMENTS GRID
        ================================================= */}

        <section className="mt-8">

          {filteredAchievements.length ===
          0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-12 text-center">
              <Search
                size={28}
                className="mx-auto text-slate-700"
              />

              <h3 className="mt-4 text-base font-bold text-slate-300">
                No achievements found
              </h3>

              <p className="mt-2 text-sm text-slate-600">
                Try changing your search or
                category filter.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredAchievements.map(
                (
                  achievement,
                  index
                ) => (
                  <AchievementCard
                    key={
                      achievement?._id ||
                      achievement?.key ||
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
        </section>

        {/* =================================================
            MOTIVATION
        ================================================= */}

        {achievements.length > 0 && (
          <section className="mt-10 overflow-hidden rounded-2xl border border-amber-300/10 bg-gradient-to-r from-amber-300/[0.04] via-white/[0.02] to-purple-500/[0.04] p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-amber-300/10 bg-amber-300/5">
                  <Flame
                    size={19}
                    className="text-amber-300"
                  />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white">
                    Keep building your legacy.
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-slate-600">
                    Every completed lecture
                    moves you closer to your next
                    achievement.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                <Star
                  size={14}
                  className="text-amber-300"
                />
                {stats.remaining} quests
                remaining
              </div>

            </div>
          </section>
        )}

      </div>
    </div>
  );
}
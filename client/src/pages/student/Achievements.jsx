import { useEffect, useMemo, useState } from "react";
import {
  Award,
  BookOpen,
  CalendarDays,
  Castle,
  Check,
  ChevronRight,
  Clock3,
  Crown,
  Feather,
  Flame,
  GraduationCap,
  Grid2X2,
  Lock,
  Medal,
  Search,
  Shield,
  Sparkles,
  Star,
  Sword,
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
    gradient: "from-slate-200 via-sky-300 to-slate-700",
    glow: "shadow-[0_0_45px_rgba(125,211,252,0.22)]",
    text: "text-sky-200",
    border: "border-sky-300/20",
    aura: "bg-sky-300",
  },

  FIVE_LECTURES: {
    icon: BookOpen,
    gradient: "from-emerald-200 via-teal-500 to-slate-800",
    glow: "shadow-[0_0_45px_rgba(45,212,191,0.22)]",
    text: "text-emerald-300",
    border: "border-emerald-300/20",
    aura: "bg-emerald-300",
  },

  TEN_LECTURES: {
    icon: BookOpen,
    gradient: "from-sky-200 via-blue-500 to-slate-900",
    glow: "shadow-[0_0_45px_rgba(56,189,248,0.24)]",
    text: "text-sky-300",
    border: "border-sky-300/20",
    aura: "bg-sky-300",
  },

  TWENTY_FIVE_LECTURES: {
    icon: Medal,
    gradient: "from-violet-200 via-purple-600 to-slate-950",
    glow: "shadow-[0_0_50px_rgba(167,139,250,0.24)]",
    text: "text-violet-300",
    border: "border-violet-300/20",
    aura: "bg-violet-300",
  },

  FIFTY_LECTURES: {
    icon: Zap,
    gradient: "from-indigo-200 via-violet-600 to-slate-950",
    glow: "shadow-[0_0_55px_rgba(129,140,248,0.26)]",
    text: "text-indigo-300",
    border: "border-indigo-300/20",
    aura: "bg-indigo-300",
  },

  HUNDRED_LECTURES: {
    icon: Trophy,
    gradient: "from-yellow-100 via-amber-500 to-orange-900",
    glow: "shadow-[0_0_60px_rgba(251,191,36,0.32)]",
    text: "text-amber-300",
    border: "border-amber-300/30",
    aura: "bg-amber-300",
  },

  FIRST_COURSE: {
    icon: Trophy,
    gradient: "from-yellow-100 via-amber-500 to-orange-900",
    glow: "shadow-[0_0_55px_rgba(251,191,36,0.3)]",
    text: "text-amber-300",
    border: "border-amber-300/25",
    aura: "bg-amber-300",
  },

  THREE_COURSES: {
    icon: BookOpen,
    gradient: "from-sky-200 via-blue-500 to-slate-900",
    glow: "shadow-[0_0_45px_rgba(56,189,248,0.22)]",
    text: "text-sky-300",
    border: "border-sky-300/20",
    aura: "bg-sky-300",
  },

  FIVE_COURSES: {
    icon: GraduationCap,
    gradient: "from-emerald-200 via-green-600 to-slate-950",
    glow: "shadow-[0_0_50px_rgba(52,211,153,0.23)]",
    text: "text-emerald-300",
    border: "border-emerald-300/20",
    aura: "bg-emerald-300",
  },

  FIRST_COURSE_COMPLETED: {
    icon: GraduationCap,
    gradient: "from-emerald-200 via-green-600 to-slate-950",
    glow: "shadow-[0_0_55px_rgba(74,222,128,0.25)]",
    text: "text-green-300",
    border: "border-green-300/25",
    aura: "bg-green-300",
  },

  THREE_COURSES_COMPLETED: {
    icon: Medal,
    gradient: "from-orange-200 via-amber-500 to-red-950",
    glow: "shadow-[0_0_55px_rgba(251,146,60,0.27)]",
    text: "text-orange-300",
    border: "border-orange-300/25",
    aura: "bg-orange-300",
  },

  FIVE_COURSES_COMPLETED: {
    icon: Trophy,
    gradient: "from-yellow-100 via-amber-500 to-orange-950",
    glow: "shadow-[0_0_60px_rgba(251,191,36,0.32)]",
    text: "text-yellow-300",
    border: "border-yellow-300/30",
    aura: "bg-yellow-300",
  },

  COURSE_COMPLETED: {
    icon: Target,
    gradient: "from-emerald-200 via-green-600 to-slate-950",
    glow: "shadow-[0_0_50px_rgba(52,211,153,0.25)]",
    text: "text-emerald-300",
    border: "border-emerald-300/25",
    aura: "bg-emerald-300",
  },

  THREE_DAY_STREAK: {
    icon: Flame,
    gradient: "from-orange-100 via-orange-500 to-red-950",
    glow: "shadow-[0_0_55px_rgba(249,115,22,0.28)]",
    text: "text-orange-300",
    border: "border-orange-300/25",
    aura: "bg-orange-300",
  },

  SEVEN_DAY_STREAK: {
    icon: Flame,
    gradient: "from-red-100 via-red-600 to-slate-950",
    glow: "shadow-[0_0_55px_rgba(239,68,68,0.28)]",
    text: "text-red-300",
    border: "border-red-300/25",
    aura: "bg-red-300",
  },

  FOURTEEN_DAY_STREAK: {
    icon: Flame,
    gradient: "from-orange-100 via-red-600 to-slate-950",
    glow: "shadow-[0_0_60px_rgba(249,115,22,0.32)]",
    text: "text-orange-300",
    border: "border-orange-300/25",
    aura: "bg-orange-300",
  },

  THIRTY_DAY_STREAK: {
    icon: Flame,
    gradient: "from-red-100 via-rose-600 to-slate-950",
    glow: "shadow-[0_0_65px_rgba(244,63,94,0.34)]",
    text: "text-rose-300",
    border: "border-rose-300/25",
    aura: "bg-rose-300",
  },

  TEN_HOURS: {
    icon: Clock3,
    gradient: "from-cyan-100 via-blue-500 to-slate-950",
    glow: "shadow-[0_0_55px_rgba(34,211,238,0.28)]",
    text: "text-cyan-300",
    border: "border-cyan-300/20",
    aura: "bg-cyan-300",
  },

  TWENTY_FIVE_HOURS: {
    icon: Clock3,
    gradient: "from-sky-100 via-cyan-600 to-slate-950",
    glow: "shadow-[0_0_55px_rgba(56,189,248,0.28)]",
    text: "text-sky-300",
    border: "border-sky-300/20",
    aura: "bg-sky-300",
  },

  FIFTY_HOURS: {
    icon: Zap,
    gradient: "from-violet-100 via-purple-600 to-slate-950",
    glow: "shadow-[0_0_60px_rgba(139,92,246,0.3)]",
    text: "text-violet-300",
    border: "border-violet-300/25",
    aura: "bg-violet-300",
  },

  HUNDRED_HOURS: {
    icon: Trophy,
    gradient: "from-purple-100 via-fuchsia-600 to-slate-950",
    glow: "shadow-[0_0_65px_rgba(192,132,252,0.32)]",
    text: "text-fuchsia-300",
    border: "border-fuchsia-300/25",
    aura: "bg-fuchsia-300",
  },

  PERFECT_COURSE: {
    icon: Star,
    gradient: "from-yellow-100 via-pink-500 to-rose-950",
    glow: "shadow-[0_0_65px_rgba(244,114,182,0.34)]",
    text: "text-pink-300",
    border: "border-pink-300/25",
    aura: "bg-pink-300",
  },

  EARLY_BIRD: {
    icon: Sparkles,
    gradient: "from-amber-100 via-yellow-500 to-orange-950",
    glow: "shadow-[0_0_55px_rgba(251,191,36,0.3)]",
    text: "text-amber-300",
    border: "border-amber-300/25",
    aura: "bg-amber-300",
  },

  NIGHT_OWL: {
    icon: Star,
    gradient: "from-indigo-100 via-purple-700 to-slate-950",
    glow: "shadow-[0_0_60px_rgba(129,140,248,0.3)]",
    text: "text-indigo-300",
    border: "border-indigo-300/25",
    aura: "bg-indigo-300",
  },

  WEEKEND_WARRIOR: {
    icon: Zap,
    gradient: "from-red-100 via-orange-600 to-slate-950",
    glow: "shadow-[0_0_60px_rgba(249,115,22,0.32)]",
    text: "text-orange-300",
    border: "border-orange-300/25",
    aura: "bg-orange-300",
  },

  COMEBACK_KID: {
    icon: Target,
    gradient: "from-teal-100 via-emerald-600 to-slate-950",
    glow: "shadow-[0_0_60px_rgba(45,212,191,0.3)]",
    text: "text-teal-300",
    border: "border-teal-300/25",
    aura: "bg-teal-300",
  },
};

const DEFAULT_BADGE = {
  icon: Award,
  gradient: "from-slate-200 via-slate-500 to-slate-950",
  glow: "shadow-[0_0_40px_rgba(148,163,184,0.2)]",
  text: "text-slate-300",
  border: "border-slate-300/20",
  aura: "bg-slate-300",
};

// =====================================================
// HELPERS
// =====================================================

const getBadgeConfig = (achievement) =>
  BADGE_CONFIG[achievement?.key] || DEFAULT_BADGE;

const getCategory = (achievement) => {
  switch (achievement?.category) {
    case "LEARNING":
      return "Learning";
    case "COURSE":
      return "Courses";
    case "STREAK":
      return "Streak";
    case "TIME":
      return "Hours";
    case "SPECIAL":
      return "Special";
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
// BACKGROUND PARTICLES
// =====================================================

function RealmParticles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 45 }).map((_, index) => {
        const isEmber = index % 5 === 0;

        return (
          <span
            key={index}
            className={`realm-particle absolute rounded-full ${
              isEmber
                ? "h-1.5 w-1.5 bg-amber-300/80 shadow-[0_0_12px_rgba(251,191,36,.8)]"
                : "h-1 w-1 bg-slate-100/30"
            }`}
            style={{
              left: `${(index * 29) % 100}%`,
              top: `${(index * 43) % 100}%`,
              animationDelay: `${(index % 11) * 0.6}s`,
              animationDuration: `${6 + (index % 6)}s`,
            }}
          />
        );
      })}
    </div>
  );
}

// =====================================================
// SNOW
// =====================================================

function Snowfall() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 30 }).map((_, index) => (
        <span
          key={index}
          className="snow-particle absolute top-[-10px] h-1 w-1 rounded-full bg-white/40"
          style={{
            left: `${(index * 37) % 100}%`,
            animationDelay: `${(index % 10) * 0.8}s`,
            animationDuration: `${8 + (index % 6)}s`,
          }}
        />
      ))}
    </div>
  );
}

// =====================================================
// EMBERS
// =====================================================

function Embers() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 18 }).map((_, index) => (
        <span
          key={index}
          className="ember-particle absolute bottom-0 h-1.5 w-1.5 rounded-full bg-amber-300 shadow-[0_0_14px_rgba(251,191,36,.8)]"
          style={{
            left: `${(index * 47) % 100}%`,
            animationDelay: `${(index % 8) * 0.7}s`,
            animationDuration: `${5 + (index % 5)}s`,
          }}
        />
      ))}
    </div>
  );
}

// =====================================================
// CASTLE / MOUNTAIN SCENE
// =====================================================

function CastleScene() {
  return (
    <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-64 overflow-hidden">
      {/* Back mountains */}

      <div
        className="absolute bottom-0 left-[-10%] h-48 w-[75%] opacity-70"
        style={{
          clipPath:
            "polygon(0 100%, 15% 62%, 30% 80%, 46% 24%, 61% 70%, 77% 42%, 100% 100%)",
          background:
            "linear-gradient(to top, #030507, #0b1118, transparent)",
        }}
      />

      <div
        className="absolute bottom-0 right-[-10%] h-52 w-[72%] opacity-80"
        style={{
          clipPath:
            "polygon(0 100%, 18% 65%, 35% 25%, 50% 70%, 67% 36%, 82% 62%, 100% 25%, 100% 100%)",
          background:
            "linear-gradient(to top, #020305, #090f16, transparent)",
        }}
      />

      {/* Castle */}

      <div className="absolute bottom-0 left-1/2 h-44 w-80 -translate-x-1/2">
        {/* Main keep */}

        <div className="absolute bottom-0 left-1/2 h-36 w-36 -translate-x-1/2 bg-[#030507]">
          <div className="absolute left-1/2 top-4 h-4 w-3 -translate-x-1/2 bg-amber-300/30 shadow-[0_0_15px_rgba(251,191,36,.4)]" />

          <div className="absolute bottom-0 left-1/2 h-16 w-9 -translate-x-1/2 rounded-t-full bg-[#0b1015]" />
        </div>

        {/* Towers */}

        <div className="absolute bottom-0 left-5 h-44 w-14 bg-[#020305]">
          <div className="absolute -top-4 left-0 right-0 flex justify-around">
            {[1, 2, 3].map((item) => (
              <span key={item} className="h-5 w-3 bg-[#020305]" />
            ))}
          </div>

          <div className="absolute left-1/2 top-10 h-3 w-2 -translate-x-1/2 bg-amber-300/20" />
        </div>

        <div className="absolute bottom-0 right-5 h-44 w-14 bg-[#020305]">
          <div className="absolute -top-4 left-0 right-0 flex justify-around">
            {[1, 2, 3].map((item) => (
              <span key={item} className="h-5 w-3 bg-[#020305]" />
            ))}
          </div>

          <div className="absolute left-1/2 top-10 h-3 w-2 -translate-x-1/2 bg-sky-200/20" />
        </div>

        {/* Main battlements */}

        <div className="absolute left-1/2 top-1 flex w-48 -translate-x-1/2 justify-between">
          {[1, 2, 3, 4, 5, 6, 7].map((item) => (
            <span key={item} className="h-5 w-5 bg-[#020305]" />
          ))}
        </div>

        {/* Castle glow */}

        <div className="castle-glow absolute bottom-8 left-1/2 h-16 w-32 -translate-x-1/2 rounded-full bg-amber-400/[0.04] blur-2xl" />
      </div>

      {/* Foreground fog */}

      <div className="absolute bottom-0 left-[-10%] h-28 w-[120%] bg-gradient-to-t from-[#030507] via-[#030507]/80 to-transparent" />

      <div className="fog-drift absolute bottom-12 left-[-15%] h-16 w-[130%] rounded-[50%] bg-slate-300/[0.04] blur-3xl" />
    </div>
  );
}

// =====================================================
// ACHIEVEMENT CARD
// =====================================================

function AchievementCard({ achievement, index }) {
  const config = getBadgeConfig(achievement);
  const Icon = config.icon;

  const unlocked = Boolean(achievement?.unlocked);
  const progress = getProgress(achievement);

  const current = Number(achievement?.progress || 0);
  const required = Number(achievement?.requirementValue || 0);

  const category = getCategory(achievement);

  return (
    <div
      className={`achievement-card group relative overflow-hidden rounded-2xl border ${config.border} bg-gradient-to-br from-[#12171d] via-[#0b1015] to-[#05070a] p-5 transition-all duration-500 hover:-translate-y-2 hover:border-amber-300/30 hover:shadow-[0_25px_60px_rgba(0,0,0,.55)]`}
      style={{
        animationDelay: `${index * 65}ms`,
      }}
    >
      {/* Stone texture */}

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `
            linear-gradient(90deg, transparent 48%, rgba(255,255,255,.5) 50%, transparent 52%),
            linear-gradient(0deg, transparent 48%, rgba(255,255,255,.3) 50%, transparent 52%)
          `,
          backgroundSize: "11px 11px",
        }}
      />

      {/* Top metal edge */}

      <div
        className={`absolute left-0 right-0 top-0 h-[2px] bg-gradient-to-r ${config.gradient} opacity-80`}
      />

      {/* Aura */}

      <div
        className={`pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full ${config.aura} opacity-[0.05] blur-3xl transition-all duration-700 group-hover:scale-150 group-hover:opacity-[0.13]`}
      />

      {/* Corner cuts */}

      <div className="absolute right-3 top-3 h-6 w-6 border-r border-t border-amber-200/10" />
      <div className="absolute bottom-3 left-3 h-6 w-6 border-b border-l border-amber-200/10" />

      {/* Badge + status */}

      <div className="relative flex items-start justify-between">
        <div
          className={`relative flex h-[78px] w-[78px] items-center justify-center rounded-[22px] border border-white/10 bg-gradient-to-br ${config.gradient} ${config.glow} transition-all duration-500 group-hover:scale-110 group-hover:rotate-2 ${
            unlocked ? "" : "grayscale opacity-40"
          }`}
        >
          {/* Metal rings */}

          <div className="absolute inset-1.5 rounded-[18px] border border-white/25" />

          <div className="absolute inset-3 rounded-[15px] border border-black/25" />

          <div className="absolute inset-5 rounded-[12px] border border-white/10" />

          <Icon
            size={34}
            strokeWidth={1.6}
            className="relative z-10 text-white drop-shadow-xl"
          />

          {unlocked && (
            <>
              <Sparkles
                size={13}
                className="absolute -right-1 -top-1 animate-pulse text-amber-300"
              />

              <span className="achievement-ring absolute inset-[-9px] rounded-[27px] border border-dashed border-amber-300/20" />
            </>
          )}
        </div>

        {unlocked ? (
          <span className="flex items-center gap-1.5 rounded-full border border-amber-300/20 bg-amber-300/[0.06] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.15em] text-amber-200">
            <Check size={11} strokeWidth={3} />
            Claimed
          </span>
        ) : (
          <span className="flex items-center gap-1.5 rounded-full border border-slate-500/20 bg-slate-500/[0.05] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.15em] text-slate-500">
            <Lock size={11} />
            Locked
          </span>
        )}
      </div>

      {/* Content */}

      <div className="relative mt-6">
        <div className="mb-2 flex items-center gap-2">
          <span
            className={`inline-flex rounded-full border ${config.border} bg-white/[0.025] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.18em] ${config.text}`}
          >
            {category}
          </span>

          <span className="h-px flex-1 bg-gradient-to-r from-amber-300/10 to-transparent" />
        </div>

        <h3 className="text-lg font-bold tracking-tight text-slate-100 transition-colors duration-300 group-hover:text-amber-100">
          {achievement?.title || "Achievement"}
        </h3>

        <p className="mt-1.5 min-h-[40px] text-sm leading-5 text-slate-500">
          {achievement?.description ||
            "Complete this milestone to unlock it."}
        </p>

        {/* Progress */}

        {!unlocked && required > 0 && (
          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-600">
                Quest progress
              </span>

              <span className={`text-xs font-bold ${config.text}`}>
                {current} / {required}
              </span>
            </div>

            <div className="relative h-2 overflow-hidden rounded-full border border-white/5 bg-black/50">
              <div
                className={`relative h-full rounded-full bg-gradient-to-r ${config.gradient} shadow-[0_0_12px_rgba(251,191,36,.12)] transition-all duration-1000`}
                style={{
                  width: `${progress}%`,
                }}
              >
                <div className="shimmer-line absolute inset-y-0 left-0 w-12 bg-white/40 blur-sm" />
              </div>
            </div>
          </div>
        )}

        {/* Unlocked */}

        {unlocked && (
          <div className="mt-5 flex items-center gap-2 border-t border-white/5 pt-4 text-xs text-slate-600">
            <CalendarDays
              size={14}
              className="text-amber-300/50"
            />

            <span>
              Chronicle recorded{" "}
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

      {/* Hover sword line */}

      <div className="absolute bottom-0 left-1/2 h-px w-0 -translate-x-1/2 bg-gradient-to-r from-transparent via-amber-300/50 to-transparent transition-all duration-500 group-hover:w-3/4" />
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
  // FETCH
  // ===================================================

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        setLoading(true);

        const response = await getAllAchievements();

        setAchievements(
          Array.isArray(response?.achievements)
            ? response.achievements
            : []
        );
      } catch (error) {
        console.error(
          "Fetch achievements error:",
          error
        );

        toast.error("Failed to load achievements");
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
      (achievement) => achievement?.unlocked
    ).length;

    const remaining = total - unlocked;

    const percentage =
      total > 0
        ? Math.round((unlocked / total) * 100)
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
    const searchText = search.trim().toLowerCase();

    return achievements.filter((achievement) => {
      const title =
        achievement?.title?.toLowerCase() || "";

      const description =
        achievement?.description?.toLowerCase() || "";

      const key =
        achievement?.key?.toLowerCase() || "";

      const matchesSearch =
        !searchText ||
        title.includes(searchText) ||
        description.includes(searchText) ||
        key.includes(searchText);

      const matchesFilter =
        activeFilter === "All" ||
        getCategory(achievement) === activeFilter;

      return matchesSearch && matchesFilter;
    });
  }, [achievements, search, activeFilter]);

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
    {
      label: "Special",
      icon: Star,
    },
  ];

  // ===================================================
  // LOADING
  // ===================================================

  if (loading) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-[#030507] p-5 text-slate-200 sm:p-7 lg:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(100,130,155,.16),transparent_35%),linear-gradient(180deg,#080c11_0%,#040608_60%,#020304_100%)]" />

        <div className="moon-pulse pointer-events-none absolute right-[9%] top-12 h-28 w-28 rounded-full bg-slate-200/60 shadow-[0_0_100px_rgba(186,230,253,.14)]" />

        <CastleScene />
        <RealmParticles />
        <Snowfall />
        <Embers />

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="h-9 w-80 animate-pulse rounded bg-slate-800/70" />

          <div className="mt-7 h-[350px] animate-pulse rounded-3xl border border-white/5 bg-[#0b1015]/80" />

          <div className="mt-7 flex gap-3 overflow-hidden">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="h-11 w-28 shrink-0 animate-pulse rounded-xl bg-slate-800/60"
              />
            ))}
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="h-72 animate-pulse rounded-2xl border border-white/5 bg-[#0b1015]/80"
              />
            ))}
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
            transform: translateY(22px) scale(.98);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes trophyFloat {
          0%, 100% {
            transform: translateY(0) rotate(-2deg);
          }

          50% {
            transform: translateY(-10px) rotate(2deg);
          }
        }

        @keyframes crownFloat {
          0%, 100% {
            transform: translateY(0) rotate(-3deg);
          }

          50% {
            transform: translateY(-7px) rotate(3deg);
          }
        }

        @keyframes swordFloat {
          0%, 100% {
            transform: rotate(-15deg) translateY(0);
          }

          50% {
            transform: rotate(-8deg) translateY(-6px);
          }
        }

        @keyframes moonPulse {
          0%, 100% {
            transform: scale(1);
            opacity: .58;
          }

          50% {
            transform: scale(1.06);
            opacity: .8;
          }
        }

        @keyframes snowFall {
          0% {
            transform: translate3d(0,-20px,0);
            opacity: 0;
          }

          15% {
            opacity: .7;
          }

          100% {
            transform: translate3d(30px,520px,0);
            opacity: 0;
          }
        }

        @keyframes emberRise {
          0% {
            transform: translate3d(0,20px,0) scale(.6);
            opacity: 0;
          }

          25% {
            opacity: .8;
          }

          100% {
            transform: translate3d(25px,-230px,0) scale(1.2);
            opacity: 0;
          }
        }

        @keyframes fogDrift {
          0%, 100% {
            transform: translateX(-4%);
          }

          50% {
            transform: translateX(4%);
          }
        }

        @keyframes realmParticle {
          0% {
            transform: translateY(30px);
            opacity: 0;
          }

          20% {
            opacity: .7;
          }

          80% {
            opacity: .4;
          }

          100% {
            transform: translateY(-120px);
            opacity: 0;
          }
        }

        @keyframes castleGlow {
          0%, 100% {
            opacity: .25;
          }

          50% {
            opacity: .7;
          }
        }

        @keyframes ringSpin {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-150%);
          }

          100% {
            transform: translateX(250%);
          }
        }

        @keyframes torchFlicker {
          0%, 100% {
            opacity: .3;
            transform: scale(.9);
          }

          50% {
            opacity: .75;
            transform: scale(1.1);
          }
        }

        .achievement-card {
          animation: achievementEntrance .65s cubic-bezier(.2,.8,.2,1) both;
        }

        .achievement-ring {
          animation: ringSpin 9s linear infinite;
        }

        .trophy-float {
          animation: trophyFloat 4s ease-in-out infinite;
        }

        .crown-float {
          animation: crownFloat 4s ease-in-out infinite;
        }

        .sword-float {
          animation: swordFloat 4s ease-in-out infinite;
        }

        .moon-pulse {
          animation: moonPulse 6s ease-in-out infinite;
        }

        .snow-particle {
          animation: snowFall linear infinite;
        }

        .ember-particle {
          animation: emberRise linear infinite;
        }

        .realm-particle {
          animation: realmParticle linear infinite;
        }

        .fog-drift {
          animation: fogDrift 14s ease-in-out infinite;
        }

        .castle-glow {
          animation: castleGlow 4s ease-in-out infinite;
        }

        .shimmer-line {
          animation: shimmer 5s ease-in-out infinite;
        }

        .torch-flicker {
          animation: torchFlicker 2s ease-in-out infinite;
        }
      `}</style>

      <div className="relative min-h-screen overflow-hidden bg-[#030507] text-slate-200">
        {/* =================================================
            GLOBAL SKY
        ================================================= */}

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(94,117,138,.18),transparent_34%),radial-gradient(circle_at_15%_45%,rgba(212,170,75,.045),transparent_30%),linear-gradient(180deg,#080c11_0%,#040608_55%,#020304_100%)]" />

        {/* Stars */}

        <div className="pointer-events-none absolute inset-0 opacity-60">
          {Array.from({ length: 35 }).map((_, index) => (
            <span
              key={index}
              className="absolute h-[2px] w-[2px] rounded-full bg-slate-200/30"
              style={{
                left: `${(index * 41) % 100}%`,
                top: `${(index * 23) % 55}%`,
              }}
            />
          ))}
        </div>

        {/* Moon */}

        <div className="moon-pulse pointer-events-none absolute right-[8%] top-12 h-28 w-28 rounded-full bg-gradient-to-br from-slate-100 via-slate-300 to-slate-500 opacity-60 shadow-[0_0_100px_rgba(186,230,253,.16)]" />

        <div className="pointer-events-none absolute right-[5%] top-7 h-24 w-24 rounded-full bg-[#080c11] opacity-80" />

        {/* Atmosphere */}

        <div className="pointer-events-none absolute left-[-10%] top-[28%] h-56 w-[55%] rounded-full bg-sky-300/[0.025] blur-3xl" />

        <div className="pointer-events-none absolute right-[-10%] top-[48%] h-72 w-[55%] rounded-full bg-amber-300/[0.025] blur-3xl" />

        <CastleScene />
        <RealmParticles />
        <Snowfall />
        <Embers />

        {/* =================================================
            CONTENT
        ================================================= */}

        <div className="relative z-10 mx-auto max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8">
          {/* =================================================
              HEADER
          ================================================= */}

          <header className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="crown-float flex h-12 w-12 items-center justify-center rounded-xl border border-amber-300/20 bg-amber-300/[0.05] shadow-[0_0_35px_rgba(251,191,36,.08)]">
                  <Crown
                    size={23}
                    className="text-amber-300"
                  />
                </div>

                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-amber-300/50">
                    The Realm · Hall of Deeds
                  </p>

                  <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-100 sm:text-3xl">
                    Hall of Achievements
                  </h1>
                </div>
              </div>

              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
                Every lesson mastered, every course conquered,
                and every streak maintained becomes part of
                your eternal chronicle.
              </p>
            </div>

            {/* Search */}

            <div className="relative w-full md:w-80">
              <Search
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search the chronicle..."
                className="h-12 w-full rounded-xl border border-white/10 bg-[#090d12]/90 pl-11 pr-4 text-sm text-slate-200 outline-none transition-all placeholder:text-slate-700 focus:border-amber-300/30 focus:ring-4 focus:ring-amber-300/[0.04]"
              />
            </div>
          </header>

          {/* =================================================
              HERO
          ================================================= */}

          <section className="relative overflow-hidden rounded-[30px] border border-amber-300/10 bg-gradient-to-br from-[#121820] via-[#0a0e13] to-[#030507] p-6 shadow-[0_30px_100px_rgba(0,0,0,.5)] sm:p-8 lg:p-10">
            {/* Stone texture */}

            <div
              className="pointer-events-none absolute inset-0 opacity-[0.035]"
              style={{
                backgroundImage: `
                  repeating-linear-gradient(
                    0deg,
                    rgba(255,255,255,.3) 0px,
                    rgba(255,255,255,.3) 1px,
                    transparent 1px,
                    transparent 5px
                  )
                `,
              }}
            />

            {/* Gold aura */}

            <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-amber-400/[0.08] blur-3xl" />

            {/* Ice aura */}

            <div className="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-sky-400/[0.06] blur-3xl" />

            {/* Castle */}

            <div className="pointer-events-none absolute bottom-0 left-0 right-0 opacity-60">
              <CastleScene />
            </div>

            {/* Floating feather */}

            <div className="raven-glide pointer-events-none absolute right-[28%] top-8 hidden opacity-20 lg:block">
              <Feather
                size={60}
                strokeWidth={1}
                className="rotate-[-25deg] text-slate-200"
              />
            </div>

            {/* Hero layout */}

            <div className="relative grid gap-10 lg:grid-cols-[230px_1fr_360px] lg:items-center">
              {/* Emblem */}

              <div className="flex justify-center lg:justify-start">
                <div className="trophy-float relative">
                  <div className="absolute inset-[-30px] rounded-full bg-amber-400/[0.06] blur-3xl" />

                  <div className="relative flex h-48 w-48 items-center justify-center rounded-full border border-amber-300/20 bg-gradient-to-br from-amber-200/[0.08] via-[#11171e] to-[#030507] shadow-[inset_0_0_70px_rgba(251,191,36,.06)]">
                    <div className="absolute inset-3 rounded-full border border-dashed border-amber-300/15" />

                    <div className="absolute inset-8 rounded-full border border-sky-300/10" />

                    <Crown
                      size={25}
                      className="crown-float absolute right-8 top-6 text-amber-300 drop-shadow-[0_0_14px_rgba(251,191,36,.5)]"
                    />

                    <Sword
                      size={29}
                      className="sword-float absolute bottom-8 left-8 text-sky-200/60"
                    />

                    {/* Shield */}

                    <div className="relative flex h-28 w-28 items-center justify-center rounded-[32px] border border-amber-200/20 bg-gradient-to-br from-amber-200 via-amber-600 to-orange-950 shadow-[0_0_50px_rgba(251,191,36,.2)]">
                      <Shield
                        size={57}
                        strokeWidth={1.4}
                        className="text-white"
                      />

                      <Trophy
                        size={25}
                        strokeWidth={1.5}
                        className="absolute text-amber-100"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Main copy */}

              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-amber-300/60">
                  Your deeds are remembered
                </p>

                <h2 className="mt-3 text-3xl font-black leading-[1.05] tracking-tight text-slate-100 sm:text-4xl lg:text-5xl">
                  Earn Your Place
                  <br />
                  in the Chronicle.
                </h2>

                <p className="mt-5 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
                  Every course completed.
                  <br />
                  Every lecture mastered.
                  <br />
                  Every streak defended.
                  <br />
                  Your progress becomes your legend.
                </p>

                {/* Progress */}

                <div className="mt-7 max-w-xl">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-600">
                      Realm progress
                    </span>

                    <span className="text-sm font-black text-amber-300">
                      {stats.percentage}%
                    </span>
                  </div>

                  <div className="relative h-3 overflow-hidden rounded-full border border-white/10 bg-black/50">
                    <div
                      className="relative h-full rounded-full bg-gradient-to-r from-sky-300 via-amber-400 to-orange-600 shadow-[0_0_20px_rgba(251,191,36,.2)] transition-all duration-1000"
                      style={{
                        width: `${stats.percentage}%`,
                      }}
                    >
                      <div className="shimmer-line absolute inset-y-0 left-0 w-20 bg-white/50 blur-sm" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}

              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-2xl border border-emerald-300/10 bg-emerald-300/[0.035] p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300/25">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-300/15 bg-emerald-300/[0.05]">
                    <Trophy
                      size={18}
                      className="text-emerald-300"
                    />
                  </div>

                  <p className="mt-3 text-2xl font-black text-slate-100">
                    {stats.unlocked}
                  </p>

                  <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.16em] text-slate-600">
                    Claimed
                  </p>
                </div>

                <div className="rounded-2xl border border-sky-300/10 bg-sky-300/[0.035] p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-sky-300/25">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl border border-sky-300/15 bg-sky-300/[0.05]">
                    <Lock
                      size={18}
                      className="text-sky-300"
                    />
                  </div>

                  <p className="mt-3 text-2xl font-black text-slate-100">
                    {stats.remaining}
                  </p>

                  <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.16em] text-slate-600">
                    Unclaimed
                  </p>
                </div>

                <div className="rounded-2xl border border-amber-300/10 bg-amber-300/[0.035] p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-amber-300/25">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl border border-amber-300/15 bg-amber-300/[0.05]">
                    <Star
                      size={18}
                      className="text-amber-300"
                    />
                  </div>

                  <p className="mt-3 text-2xl font-black text-slate-100">
                    {stats.percentage}%
                  </p>

                  <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.16em] text-slate-600">
                    Complete
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom gold blade */}

            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-300/40 to-transparent" />
          </section>

          {/* =================================================
              FILTERS
          ================================================= */}

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {filters.map((filter) => {
                const Icon = filter.icon;

                const active =
                  activeFilter === filter.label;

                return (
                  <button
                    key={filter.label}
                    type="button"
                    onClick={() =>
                      setActiveFilter(filter.label)
                    }
                    className={`flex shrink-0 items-center gap-2 rounded-xl border px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.16em] transition-all duration-300 ${
                      active
                        ? "border-amber-300/30 bg-amber-300/[0.08] text-amber-200 shadow-[0_0_25px_rgba(251,191,36,.08)]"
                        : "border-white/10 bg-[#090d12] text-slate-600 hover:border-slate-400/20 hover:bg-white/[0.025] hover:text-slate-300"
                    }`}
                  >
                    <Icon size={14} />

                    {filter.label}
                  </button>
                );
              })}
            </div>

            <p className="text-xs text-slate-600">
              <span className="font-bold text-slate-300">
                {filteredAchievements.length}
              </span>{" "}
              deeds recorded
            </p>
          </div>

          {/* =================================================
              SECTION HEADER
          ================================================= */}

          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-center gap-3">
                <Sword
                  size={21}
                  className="text-amber-300/60"
                />

                <h2 className="text-2xl font-black tracking-tight text-slate-100">
                  The Achievement Hall
                </h2>
              </div>

              <p className="mt-2 text-sm text-slate-600">
                Complete milestones, earn honor, and
                expand your legend.
              </p>
            </div>

            <div className="hidden items-center gap-2 text-[9px] font-bold uppercase tracking-[0.25em] text-amber-300/35 sm:flex">
              <Feather size={14} />
              The Chronicle
            </div>
          </div>

          {/* =================================================
              EMPTY
          ================================================= */}

          {filteredAchievements.length === 0 ? (
            <div className="relative flex min-h-[380px] flex-col items-center justify-center overflow-hidden rounded-3xl border border-dashed border-white/10 bg-[#090d12] p-8 text-center">
              <Castle
                size={150}
                strokeWidth={0.7}
                className="absolute bottom-[-25px] text-slate-700/[0.08]"
              />

              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-300/15 bg-amber-300/[0.04] shadow-[0_0_30px_rgba(251,191,36,.05)]">
                <Search
                  size={27}
                  className="text-amber-300/60"
                />
              </div>

              <h3 className="relative mt-6 text-lg font-bold text-slate-200">
                No deeds found
              </h3>

              <p className="relative mt-2 max-w-sm text-sm leading-6 text-slate-600">
                The ravens found no record matching
                your search or chosen category.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setActiveFilter("All");
                }}
                className="relative mt-6 flex items-center gap-2 rounded-xl border border-amber-300/20 bg-amber-300/[0.07] px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.16em] text-amber-200 transition hover:border-amber-300/35 hover:bg-amber-300/[0.12]"
              >
                Clear the search
                <ChevronRight size={14} />
              </button>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {filteredAchievements.map(
                (achievement, index) => (
                  <AchievementCard
                    key={
                      achievement?._id ||
                      achievement?.key ||
                      index
                    }
                    achievement={achievement}
                    index={index}
                  />
                )
              )}
            </div>
          )}

          {/* =================================================
              MOTIVATION
          ================================================= */}

          {stats.remaining > 0 && (
            <section className="relative overflow-hidden rounded-3xl border border-amber-300/10 bg-gradient-to-r from-[#11171d] via-[#0b1015] to-[#05070a] p-6 shadow-[0_25px_70px_rgba(0,0,0,.35)] sm:p-7">
              <div className="pointer-events-none absolute -right-24 -top-24 h-60 w-60 rounded-full bg-amber-400/[0.07] blur-3xl" />

              <div className="pointer-events-none absolute bottom-0 left-1/3 h-24 w-72 rounded-full bg-sky-400/[0.035] blur-3xl" />

              <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="crown-float flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-amber-300/20 bg-gradient-to-br from-amber-400 to-orange-950 shadow-[0_0_35px_rgba(251,191,36,.13)]">
                    <Shield
                      size={28}
                      className="text-white"
                    />
                  </div>

                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-amber-300/50">
                      The road continues
                    </p>

                    <h3 className="mt-1 text-lg font-bold text-slate-100">
                      More deeds await your blade.
                    </h3>

                    <p className="mt-1 text-sm text-slate-600">
                      Keep learning. Keep conquering.
                      Let the realm remember your work.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {[
                    Trophy,
                    GraduationCap,
                    Flame,
                    Crown,
                    Sword,
                  ].map((Icon, index) => (
                    <div
                      key={index}
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.025] transition-all duration-300 hover:-translate-y-1 hover:border-amber-300/25 hover:bg-amber-300/[0.05]"
                    >
                      <Icon
                        size={18}
                        className={
                          index === 4
                            ? "text-sky-300"
                            : "text-amber-300"
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-amber-300/20 to-transparent" />
            </section>
          )}
        </div>
      </div>
    </>
  );
}
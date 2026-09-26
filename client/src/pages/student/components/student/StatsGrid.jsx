import { memo, useMemo } from "react";

import {
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  Crown,
  Feather,
  Flame,
  Sparkles,
  Sword,
} from "lucide-react";

/* =========================================================
   STATIC CONFIG
========================================================= */

const STAT_CONFIG = [
  {
    key: "enrolled",
    title: "Enrolled Courses",
    label: "THE NORTH",

    icon: BookOpen,
    secondaryIcon: Feather,

    iconBg:
      "bg-gradient-to-br from-sky-950 via-slate-900 to-slate-950",

    iconColor: "text-sky-300",

    cardGradient:
      "from-[#0d151b] via-[#0b1014] to-[#080b0e]",

    progressBg: "bg-sky-950",

    progressGradient:
      "from-sky-900 via-sky-500 to-cyan-300",

    progressIcon: BookOpen,
    progressIconClass: "text-sky-500/70",

    bottomText: "COURSES UNDER YOUR BANNER",
  },

  {
    key: "completed",
    title: "Completed Courses",
    label: "THE CROWN",

    icon: CheckCircle2,
    secondaryIcon: Crown,

    iconBg:
      "bg-gradient-to-br from-amber-950 via-yellow-950 to-zinc-950",

    iconColor: "text-amber-400",

    cardGradient:
      "from-[#17130a] via-[#100f0b] to-[#090909]",

    progressBg: "bg-amber-950",

    progressGradient:
      "from-amber-900 via-amber-500 to-yellow-300",

    progressIcon: Crown,
    progressIconClass: "text-amber-400",

    bottomText: "VICTORIES EARNED",
  },

  {
    key: "hours",
    title: "Learning Hours",
    label: "THE TRAINING HALL",

    icon: Clock3,
    secondaryIcon: Sword,

    iconBg:
      "bg-gradient-to-br from-slate-800 via-zinc-900 to-black",

    iconColor: "text-slate-300",

    cardGradient:
      "from-[#111417] via-[#0d1012] to-[#08090a]",

    progressBg: "bg-slate-900",

    progressGradient:
      "from-slate-700 via-slate-400 to-sky-300",

    progressIcon: Sword,
    progressIconClass: "text-slate-300",

    bottomText: "WEEKLY TRAINING PROGRESS",
  },

  {
    key: "streak",
    title: "Study Streak",
    label: "THE FIRE WITHIN",

    icon: Flame,
    secondaryIcon: Flame,

    iconBg:
      "bg-gradient-to-br from-red-950 via-orange-950 to-zinc-950",

    iconColor: "text-orange-400",

    cardGradient:
      "from-[#180d0b] via-[#110b0a] to-[#090909]",

    progressBg: "bg-red-950",

    progressGradient:
      "from-red-900 via-orange-600 to-amber-300",

    progressIcon: Flame,
    progressIconClass: "text-orange-400",

    bottomText: "30 DAY STREAK CHALLENGE",
  },
];

/* =========================================================
   HELPERS
========================================================= */

const clampPercentage = (value) => {
  if (!Number.isFinite(value)) return 0;

  return Math.min(100, Math.max(0, Math.round(value)));
};

const getProgress = (key, values) => {
  switch (key) {
    case "enrolled":
      return Math.min(100, values.enrolledCourses * 10);

    case "completed":
      return values.enrolledCourses > 0
        ? clampPercentage(
            (values.completedCourses /
              values.enrolledCourses) *
              100
          )
        : 0;

    case "hours":
      return clampPercentage(
        (values.learningHours / 20) * 100
      );

    case "streak":
      return clampPercentage(
        (values.studyStreak / 30) * 100
      );

    default:
      return 0;
  }
};

/* =========================================================
   PROGRESS BAR
========================================================= */

const ProgressBar = memo(function ProgressBar({
  progress,
  stat,
}) {
  const Icon = stat.progressIcon;

  return (
    <div className="flex items-center gap-3">
      <div
        className={`
          relative
          h-1.5
          flex-1
          overflow-hidden
          rounded-full
          ${stat.progressBg}
        `}
      >
        <div
          className={`
            h-full
            rounded-full
            bg-gradient-to-r
            ${stat.progressGradient}
            transition-[width]
            duration-500
            ease-out
          `}
          style={{
            width: `${progress}%`,
          }}
        >
          {/* Lightweight progress endpoint */}
          <span
            aria-hidden="true"
            className="
              absolute
              right-0
              top-1/2
              h-1.5
              w-1.5
              -translate-y-1/2
              rounded-full
              bg-white
            "
          />
        </div>
      </div>

      <Icon
        size={15}
        aria-hidden="true"
        className={`
          shrink-0
          ${stat.progressIconClass}
          transition-transform
          duration-200
          group-hover:scale-105
        `}
      />
    </div>
  );
});

/* =========================================================
   STAT CARD
========================================================= */

const StatCard = memo(function StatCard({
  stat,
  value,
  description,
  progress,
}) {
  const Icon = stat.icon;
  const SecondaryIcon = stat.secondaryIcon;

  return (
    <article
      className={`
        group
        relative
        min-w-0
        w-full
        overflow-hidden
        rounded-[24px]
        border
        border-slate-700/60
        bg-gradient-to-br
        ${stat.cardGradient}
        p-5
        shadow-lg
        shadow-black/20
        transform-gpu
        transition-[transform,border-color,box-shadow]
        duration-200
        ease-out
        hover:-translate-y-1
        hover:border-slate-500/70
        hover:shadow-xl
        hover:shadow-black/30
        sm:p-6
      `}
    >
      {/* =====================================================
          LIGHTWEIGHT DECORATION
      ===================================================== */}

      {/* Small static glow instead of huge blur layers */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-12
          -top-12
          h-28
          w-28
          rounded-full
          bg-white/[0.025]
          blur-2xl
        "
      />

      {/* Medieval grid */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-[0.025]
          bg-[linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)]
          bg-[size:24px_24px]
        "
      />

      {/* Top realm line */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          left-6
          right-6
          top-0
          h-px
          bg-gradient-to-r
          from-transparent
          via-slate-500/30
          to-transparent
          transition-opacity
          duration-200
          group-hover:opacity-100
        "
      />

      {/* Corners */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          right-4
          top-4
          h-7
          w-7
          border-r
          border-t
          border-slate-700/50
          transition-colors
          duration-200
          group-hover:border-amber-500/40
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          bottom-4
          left-4
          h-7
          w-7
          border-b
          border-l
          border-slate-700/40
          transition-colors
          duration-200
          group-hover:border-sky-500/30
        "
      />

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="relative z-10 flex items-start justify-between">
        {/* Main icon */}

        <div
          className={`
            relative
            flex
            h-12
            w-12
            shrink-0
            items-center
            justify-center
            rounded-2xl
            border
            border-slate-700/60
            ${stat.iconBg}
            shadow-md
            transform-gpu
            transition-transform
            duration-200
            group-hover:scale-105
            group-hover:rotate-2
          `}
        >
          <Icon
            size={22}
            strokeWidth={1.8}
            aria-hidden="true"
            className={`
              ${stat.iconColor}
              transform-gpu
              transition-transform
              duration-200
              group-hover:scale-105
            `}
          />

          <span
            aria-hidden="true"
            className="
              absolute
              -right-1
              -top-1
              h-2
              w-2
              rounded-full
              bg-slate-300
            "
          />
        </div>

        {/* Realm label */}

        <div
          className="
            flex
            items-center
            gap-1.5
            rounded-full
            border
            border-slate-700/50
            bg-black/30
            px-2.5
            py-1.5
          "
        >
          <SecondaryIcon
            size={11}
            aria-hidden="true"
            className="
              text-amber-500/80
              transform-gpu
              transition-transform
              duration-200
              group-hover:rotate-12
            "
          />

          <span
            className="
              text-[8px]
              font-bold
              tracking-[0.16em]
              text-slate-500
            "
          >
            {stat.label}
          </span>
        </div>
      </div>

      {/* =====================================================
          VALUE
      ===================================================== */}

      <div className="relative z-10 mt-5">
        <p
          className="
            m-0
            text-[10px]
            font-bold
            uppercase
            tracking-[0.2em]
            text-slate-500
          "
        >
          {stat.title}
        </p>

        <div className="mt-1 flex items-end justify-between">
          <h3
            className="
              m-0
              text-4xl
              font-black
              tracking-tight
              text-slate-100
            "
          >
            {value}
          </h3>

          <div
            aria-hidden="true"
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-full
              border
              border-slate-800
              bg-black/30
              text-slate-600
              transform-gpu
              transition-[transform,border-color,color]
              duration-200
              group-hover:rotate-45
              group-hover:border-slate-600
              group-hover:text-slate-300
            "
          >
            <ArrowUpRight size={15} />
          </div>
        </div>

        <p
          className="
            m-0
            mt-1.5
            min-h-[32px]
            text-xs
            font-medium
            leading-5
            text-slate-500
            transition-colors
            duration-200
            group-hover:text-slate-400
          "
        >
          {description}
        </p>
      </div>

      {/* =====================================================
          PROGRESS
      ===================================================== */}

      <div className="relative z-10 mt-5">
        <ProgressBar
          progress={progress}
          stat={stat}
        />
      </div>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <div
        className="
          relative
          z-10
          mt-4
          flex
          items-center
          justify-between
          border-t
          border-slate-800/70
          pt-3
        "
      >
        <div className="flex min-w-0 items-center gap-2">
          <Sparkles
            size={11}
            aria-hidden="true"
            className="
              shrink-0
              text-amber-500/70
              transform-gpu
              transition-transform
              duration-200
              group-hover:rotate-90
            "
          />

          <span
            className="
              truncate
              text-[8px]
              font-bold
              uppercase
              tracking-[0.16em]
              text-slate-600
              transition-colors
              duration-200
              group-hover:text-slate-500
            "
          >
            {stat.bottomText}
          </span>
        </div>

        <span
          aria-hidden="true"
          className="
            ml-3
            h-1
            w-1
            shrink-0
            rounded-full
            bg-slate-700
            transition-colors
            duration-200
            group-hover:bg-amber-500
          "
        />
      </div>

      {/* Bottom realm line */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          bottom-0
          left-0
          h-px
          w-full
          bg-gradient-to-r
          from-transparent
          via-slate-700
          to-transparent
          opacity-70
          transition-opacity
          duration-200
          group-hover:opacity-100
        "
      />
    </article>
  );
});

/* =========================================================
   MAIN COMPONENT
========================================================= */

function StatsGrid({ stats }) {
  /*
   * Calculate everything once.
   * Prevents unnecessary object creation and repeated calculations.
   */

  const dashboard = useMemo(() => {
    const enrolledCourses = Number(stats?.enrolledCourses) || 0;
    const completedCourses = Number(stats?.completedCourses) || 0;
    const learningHours = Number(stats?.learningHours) || 0;
    const studyStreak = Number(stats?.studyStreak) || 0;

    const completion =
      enrolledCourses > 0
        ? clampPercentage(
            (completedCourses / enrolledCourses) * 100
          )
        : 0;

    const values = {
      enrolledCourses,
      completedCourses,
      learningHours,
      studyStreak,
    };

    return {
      values,

      enrolled: {
        value: enrolledCourses,
        description:
          enrolledCourses === 1
            ? "Active course in your realm"
            : "Active courses in your realm",
        progress: getProgress("enrolled", values),
      },

      completed: {
        value: completedCourses,
        description:
          completedCourses === 0
            ? "Your first victory awaits"
            : `${completion}% of enrolled courses conquered`,
        progress: getProgress("completed", values),
      },

      hours: {
        value: `${learningHours.toFixed(1)}h`,
        description: "Time spent sharpening your skills",
        progress: getProgress("hours", values),
      },

      streak: {
        value: studyStreak,
        description:
          studyStreak === 1
            ? "Day defending your streak"
            : "Days defending your streak",
        progress: getProgress("streak", values),
      },
    };
  }, [
    stats?.enrolledCourses,
    stats?.completedCourses,
    stats?.learningHours,
    stats?.studyStreak,
  ]);

  return (
    <div
      className="
        grid
        w-full
        grid-cols-1
        gap-4
        sm:grid-cols-2
        xl:grid-cols-4
      "
    >
      {STAT_CONFIG.map((stat) => {
        const item = dashboard[stat.key];

        return (
          <StatCard
            key={stat.key}
            stat={stat}
            value={item.value}
            description={item.description}
            progress={item.progress}
          />
        );
      })}
    </div>
  );
}

/* =========================================================
   EXPORT
========================================================= */

export default memo(StatsGrid);
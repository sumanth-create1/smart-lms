import {
  Target,
  Clock3,
  ArrowUpRight,
  Flame,
  Sparkles,
  Zap,
} from "lucide-react";

function WeeklyGoal({ weeklyGoal }) {
  // =====================================================
  // DATA
  // =====================================================

  const targetHours = Number(
    weeklyGoal?.targetHours ?? 0
  );

  const completedHours = Number(
    weeklyGoal?.completedHours ?? 0
  );

  const percentage = Math.min(
    Math.max(
      Math.round(
        Number(
          weeklyGoal?.percentage ??
            (targetHours > 0
              ? (completedHours / targetHours) * 100
              : 0)
        )
      ),
      0
    ),
    100
  );

  const remainingHours = Math.max(
    targetHours - completedHours,
    0
  );

  // =====================================================
  // CIRCLE
  // =====================================================

  const radius = 48;
  const circumference = 2 * Math.PI * radius;

  const offset =
    circumference -
    (percentage / 100) * circumference;

  // =====================================================
  // MOTIVATION
  // =====================================================

  const getMessage = () => {
    if (percentage >= 100) {
      return {
        title: "Mission accomplished.",
        description:
          "You hit your weekly learning target.",
        icon: "🏆",
      };
    }

    if (percentage >= 75) {
      return {
        title: "Final stretch.",
        description:
          "You're dangerously close to your goal.",
        icon: "🔥",
      };
    }

    if (percentage >= 50) {
      return {
        title: "Momentum secured.",
        description:
          "Halfway there. Keep the pressure on.",
        icon: "⚡",
      };
    }

    if (percentage > 0) {
      return {
        title: "The mission has started.",
        description:
          "Stay consistent and build momentum.",
        icon: "🎯",
      };
    }

    return {
      title: "Your mission awaits.",
      description:
        "Start learning and make today count.",
      icon: "🚀",
    };
  };

  const motivation = getMessage();

  // =====================================================
  // UI
  // =====================================================

  return (
    <section
      className="
        group
        relative
        overflow-hidden
        rounded-[28px]
        border
        border-slate-800
        bg-[#080b12]
        shadow-xl
        shadow-slate-300/20
        transition-all
        duration-500
        hover:-translate-y-1
        hover:shadow-2xl
      "
    >
      {/* =================================================
          CINEMATIC BACKGROUND
      ================================================= */}

      <div className="absolute inset-0 overflow-hidden">
        {/* Dark cinematic gradient */}

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-br
            from-[#080b12]
            via-[#111827]
            to-[#1e1b4b]
          "
        />

        {/* Neon light */}

        <div
          className="
            absolute
            -right-24
            -top-24
            h-72
            w-72
            rounded-full
            bg-violet-600/20
            blur-[90px]
            transition-all
            duration-1000
            group-hover:scale-125
          "
        />

        <div
          className="
            absolute
            -bottom-28
            -left-20
            h-72
            w-72
            rounded-full
            bg-fuchsia-600/10
            blur-[100px]
          "
        />

        {/* Cinematic vertical light */}

        <div
          className="
            absolute
            right-[18%]
            top-0
            h-full
            w-px
            rotate-[18deg]
            bg-gradient-to-b
            from-transparent
            via-violet-400/20
            to-transparent
          "
        />

        {/* Rain / film texture */}

        <div
          className="
            absolute
            inset-0
            opacity-[0.04]
            [background-image:linear-gradient(120deg,transparent_45%,white_46%,transparent_47%)]
            [background-size:18px_18px]
          "
        />

        {/* Cinematic silhouette */}

        <div
          className="
            pointer-events-none
            absolute
            -bottom-12
            -right-4
            text-[170px]
            leading-none
            opacity-[0.035]
            grayscale
            transition-all
            duration-700
            group-hover:opacity-[0.06]
            group-hover:scale-105
          "
        >
          🕴️
        </div>
      </div>

      {/* =================================================
          HEADER
      ================================================= */}

      <div
        className="
          relative
          z-10
          flex
          items-center
          justify-between
          border-b
          border-white/10
          px-5
          py-5
          sm:px-6
        "
      >
        <div className="flex items-center gap-3">
          {/* Target icon */}

          <div
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              border
              border-white/10
              bg-white/10
              backdrop-blur-md
              transition-all
              duration-300
              group-hover:scale-105
            "
          >
            <Target
              size={19}
              className="text-violet-300"
            />
          </div>

          <div>
            <h2
              className="
                m-0
                text-base
                font-bold
                tracking-tight
                text-white
                sm:text-lg
              "
            >
              Weekly Mission
            </h2>

            <p
              className="
                m-0
                mt-0.5
                text-xs
                text-slate-400
                sm:text-sm
              "
            >
              Keep your learning streak alive
            </p>
          </div>
        </div>

        {/* Status badge */}

        <div
          className="
            hidden
            items-center
            gap-1.5
            rounded-full
            border
            border-white/10
            bg-white/5
            px-3
            py-1.5
            backdrop-blur-md
            sm:flex
          "
        >
          <Sparkles
            size={13}
            className="text-violet-300"
          />

          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
            Weekly Goal
          </span>
        </div>
      </div>

      {/* =================================================
          CONTENT
      ================================================= */}

      <div
        className="
          relative
          z-10
          p-5
          sm:p-6
        "
      >
        <div
          className="
            flex
            flex-col
            items-center
            gap-7
          "
        >
          {/* =================================================
              CINEMATIC CIRCLE
          ================================================= */}

          <div className="relative h-48 w-48">
            {/* Outer glow */}

            <div
              className="
                absolute
                inset-3
                rounded-full
                bg-violet-600/20
                blur-2xl
                transition-all
                duration-700
                group-hover:bg-violet-500/30
              "
            />

            {/* SVG */}

            <svg
              className="
                relative
                h-full
                w-full
                -rotate-90
              "
              viewBox="0 0 120 120"
            >
              {/* Outer ring */}

              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="text-white/10"
              />

              {/* Background */}

              <circle
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth="9"
                className="text-white/10"
              />

              {/* Progress */}

              <circle
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke="url(#goalGradient)"
                strokeWidth="9"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                className="
                  transition-all
                  duration-1000
                  ease-out
                "
              />

              {/* Gradient */}

              <defs>
                <linearGradient
                  id="goalGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop
                    offset="0%"
                    stopColor="#8b5cf6"
                  />

                  <stop
                    offset="50%"
                    stopColor="#d946ef"
                  />

                  <stop
                    offset="100%"
                    stopColor="#ec4899"
                  />
                </linearGradient>
              </defs>
            </svg>

            {/* Center */}

            <div
              className="
                absolute
                inset-0
                flex
                flex-col
                items-center
                justify-center
              "
            >
              <span
                className="
                  text-4xl
                  font-black
                  tracking-tight
                  text-white
                "
              >
                {percentage}%
              </span>

              <span
                className="
                  mt-0.5
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.18em]
                  text-slate-400
                "
              >
                Complete
              </span>
            </div>

            {/* Small floating badge */}

            <div
              className="
                absolute
                -right-2
                top-5
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                border
                border-white/10
                bg-white/10
                text-lg
                shadow-lg
                backdrop-blur-md
                animate-bounce
              "
            >
              {motivation.icon}
            </div>
          </div>

          {/* =================================================
              HOURS
          ================================================= */}

          <div className="text-center">
            <div className="flex items-center justify-center gap-2">
              <Clock3
                size={17}
                className="text-violet-300"
              />

              <span
                className="
                  text-2xl
                  font-extrabold
                  tracking-tight
                  text-white
                "
              >
                {completedHours.toFixed(1)}
              </span>

              <span
                className="
                  text-sm
                  font-medium
                  text-slate-500
                "
              >
                / {targetHours} hrs
              </span>
            </div>

            <p
              className="
                m-0
                mt-1
                text-xs
                text-slate-500
              "
            >
              {percentage >= 100
                ? "You've conquered this week's target."
                : `${remainingHours.toFixed(
                    1
                  )} hours remaining this week`}
            </p>
          </div>

          {/* =================================================
              MOTIVATION PANEL
          ================================================= */}

          <div
            className="
              w-full
              rounded-2xl
              border
              border-white/10
              bg-white/[0.05]
              p-4
              backdrop-blur-md
              transition-all
              duration-300
              group-hover:bg-white/[0.07]
            "
          >
            <div className="flex items-center gap-3">
              {/* Icon */}

              <div
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-gradient-to-br
                  from-violet-500
                  to-fuchsia-500
                  shadow-lg
                  shadow-violet-900/30
                "
              >
                {percentage >= 100 ? (
                  <TrophyIcon />
                ) : (
                  <Zap
                    size={19}
                    className="text-white"
                    fill="currentColor"
                  />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p
                  className="
                    m-0
                    text-sm
                    font-bold
                    text-white
                  "
                >
                  {motivation.title}
                </p>

                <p
                  className="
                    m-0
                    mt-0.5
                    text-xs
                    leading-5
                    text-slate-400
                  "
                >
                  {motivation.description}
                </p>
              </div>

              <ArrowUpRight
                size={18}
                className="
                  shrink-0
                  text-slate-600
                  transition-all
                  duration-300
                  group-hover:-translate-y-0.5
                  group-hover:translate-x-0.5
                  group-hover:text-violet-300
                "
              />
            </div>
          </div>

          {/* =================================================
              MINI STATS
          ================================================= */}

          <div className="grid w-full grid-cols-2 gap-3">
            <div
              className="
                rounded-xl
                border
                border-white/10
                bg-white/[0.035]
                px-3
                py-3
              "
            >
              <div className="flex items-center gap-2">
                <Flame
                  size={14}
                  className="text-orange-400"
                />

                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Completed
                </span>
              </div>

              <p className="m-0 mt-1 text-sm font-bold text-white">
                {completedHours.toFixed(1)} hrs
              </p>
            </div>

            <div
              className="
                rounded-xl
                border
                border-white/10
                bg-white/[0.035]
                px-3
                py-3
              "
            >
              <div className="flex items-center gap-2">
                <Target
                  size={14}
                  className="text-violet-400"
                />

                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Target
                </span>
              </div>

              <p className="m-0 mt-1 text-sm font-bold text-white">
                {targetHours} hrs
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* =================================================
          CINEMATIC FOOTER LINE
      ================================================= */}

      <div
        className="
          absolute
          bottom-0
          left-0
          h-px
          w-full
          bg-gradient-to-r
          from-transparent
          via-violet-500
          to-transparent
          opacity-50
        "
      />

      <style>{`
        @keyframes cinematicPulse {
          0%,
          100% {
            opacity: 0.25;
          }

          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </section>
  );
}

// =====================================================
// TROPHY ICON
// =====================================================

function TrophyIcon() {
  return (
    <span className="text-lg">
      🏆
    </span>
  );
}

export default WeeklyGoal;
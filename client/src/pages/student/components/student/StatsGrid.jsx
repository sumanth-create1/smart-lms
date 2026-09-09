import {
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  Crown,
  Feather,
  Flame,
  Shield,
  Sparkles,
  Sword,
  Trophy,
  Zap,
} from "lucide-react";

function StatsGrid({ stats }) {
  const enrolledCourses = stats?.enrolledCourses ?? 0;
  const completedCourses = stats?.completedCourses ?? 0;
  const learningHours = Number(stats?.learningHours ?? 0);
  const studyStreak = stats?.studyStreak ?? 0;

  /*
   * ---------------------------------------------------------
   * PRESENTATION-ONLY PERCENTAGES
   * ---------------------------------------------------------
   */

  const courseCompletion =
    enrolledCourses > 0
      ? Math.min(
          100,
          Math.round((completedCourses / enrolledCourses) * 100)
        )
      : 0;

  const learningGoal = Math.min(
    100,
    Math.round((learningHours / 20) * 100)
  );

  const streakProgress = Math.min(
    100,
    Math.round((studyStreak / 30) * 100)
  );

  /*
   * ---------------------------------------------------------
   * STATS CONFIGURATION
   * ---------------------------------------------------------
   */

  const dashboardStats = [
    {
      title: "Enrolled Courses",
      value: enrolledCourses,

      description:
        enrolledCourses === 1
          ? "Active course in your realm"
          : "Active courses in your realm",

      label: "THE NORTH",

      icon: BookOpen,
      secondaryIcon: Feather,

      iconBg:
        "bg-gradient-to-br from-sky-950 via-slate-900 to-slate-950",

      iconColor: "text-sky-300",

      accent: "sky",

      cardGradient:
        "from-[#0d151b] via-[#0b1014] to-[#080b0e]",

      progressBg: "bg-sky-950",

      progressGradient:
        "from-sky-900 via-sky-600 to-cyan-300",

      progress:
        Math.min(100, enrolledCourses * 10),

      bottomText: "COURSES UNDER YOUR BANNER",

      decoration: "north",
    },

    {
      title: "Completed Courses",
      value: completedCourses,

      description:
        completedCourses === 0
          ? "Your first victory awaits"
          : `${courseCompletion}% of enrolled courses conquered`,

      label: "THE CROWN",

      icon: CheckCircle2,
      secondaryIcon: Crown,

      iconBg:
        "bg-gradient-to-br from-amber-950 via-yellow-950 to-zinc-950",

      iconColor: "text-amber-400",

      accent: "amber",

      cardGradient:
        "from-[#17130a] via-[#100f0b] to-[#090909]",

      progressBg: "bg-amber-950",

      progressGradient:
        "from-amber-900 via-amber-600 to-yellow-300",

      progress: courseCompletion,

      bottomText: "VICTORIES EARNED",

      decoration: "crown",
    },

    {
      title: "Learning Hours",
      value: `${learningHours.toFixed(1)}h`,

      description: "Time spent sharpening your skills",

      label: "THE TRAINING HALL",

      icon: Clock3,
      secondaryIcon: Sword,

      iconBg:
        "bg-gradient-to-br from-slate-800 via-zinc-900 to-black",

      iconColor: "text-slate-300",

      accent: "steel",

      cardGradient:
        "from-[#111417] via-[#0d1012] to-[#08090a]",

      progressBg: "bg-slate-900",

      progressGradient:
        "from-slate-700 via-slate-400 to-sky-300",

      progress: learningGoal,

      bottomText: "WEEKLY TRAINING PROGRESS",

      decoration: "sword",
    },

    {
      title: "Study Streak",
      value: studyStreak,

      description:
        studyStreak === 1
          ? "Day defending your streak"
          : "Days defending your streak",

      label: "THE FIRE WITHIN",

      icon: Flame,
      secondaryIcon: Zap,

      iconBg:
        "bg-gradient-to-br from-red-950 via-orange-950 to-zinc-950",

      iconColor: "text-orange-400",

      accent: "fire",

      cardGradient:
        "from-[#180d0b] via-[#110b0a] to-[#090909]",

      progressBg: "bg-red-950",

      progressGradient:
        "from-red-900 via-orange-600 to-amber-300",

      progress: streakProgress,

      bottomText: "30 DAY STREAK CHALLENGE",

      decoration: "fire",
    },
  ];

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
      {dashboardStats.map((stat) => {
        const Icon = stat.icon;
        const SecondaryIcon = stat.secondaryIcon;

        return (
          <div
            key={stat.title}
            className={`
              group
              relative
              min-w-0
              w-full
              overflow-hidden
              rounded-[26px]
              border
              border-slate-700/60
              bg-gradient-to-br
              ${stat.cardGradient}
              p-5
              shadow-xl
              shadow-black/20
              transition-all
              duration-500
              hover:-translate-y-2
              hover:border-slate-500/70
              hover:shadow-2xl
              hover:shadow-black/50
              sm:p-6
            `}
          >
            {/* =================================================
                ATMOSPHERIC BACKGROUND
            ================================================= */}

            <div
              className="
                pointer-events-none
                absolute
                -right-16
                -top-16
                h-40
                w-40
                rounded-full
                bg-white/[0.035]
                blur-3xl
                transition-all
                duration-1000
                group-hover:scale-150
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                -bottom-20
                -left-16
                h-40
                w-40
                rounded-full
                bg-slate-500/[0.04]
                blur-3xl
                transition-all
                duration-1000
                group-hover:scale-125
              "
            />

            {/* =================================================
                MEDIEVAL GRID
            ================================================= */}

            <div
              className="
                pointer-events-none
                absolute
                inset-0
                opacity-[0.045]
                bg-[linear-gradient(rgba(255,255,255,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.15)_1px,transparent_1px)]
                bg-[size:24px_24px]
              "
            />

            {/* =================================================
                TOP DECORATIVE LINE
            ================================================= */}

            <div
              className="
                pointer-events-none
                absolute
                left-6
                right-6
                top-0
                h-px
                bg-gradient-to-r
                from-transparent
                via-slate-500/40
                to-transparent
                transition-all
                duration-500
                group-hover:via-amber-400/70
              "
            />

            {/* =================================================
                CORNER DECORATIONS
            ================================================= */}

            <div
              className="
                pointer-events-none
                absolute
                right-4
                top-4
                h-8
                w-8
                border-r
                border-t
                border-slate-700/50
                transition-all
                duration-500
                group-hover:h-10
                group-hover:w-10
                group-hover:border-amber-500/40
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                bottom-4
                left-4
                h-8
                w-8
                border-b
                border-l
                border-slate-700/40
                transition-all
                duration-500
                group-hover:border-sky-500/30
              "
            />

            {/* =================================================
                FLOATING PARTICLES
            ================================================= */}

            <span
              className="
                pointer-events-none
                absolute
                right-16
                top-12
                h-1
                w-1
                rounded-full
                bg-slate-300/60
                animate-pulse
              "
            />

            <span
              className="
                pointer-events-none
                absolute
                right-10
                top-24
                h-1.5
                w-1.5
                rounded-full
                bg-amber-400/50
                animate-ping
              "
            />

            <span
              className="
                pointer-events-none
                absolute
                bottom-20
                right-24
                h-1
                w-1
                rounded-full
                bg-sky-300/50
                animate-pulse
              "
            />

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="relative z-10 flex items-start justify-between">
              {/* Icon */}
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
                  shadow-lg
                  transition-all
                  duration-500
                  group-hover:scale-110
                  group-hover:rotate-3
                `}
              >
                {/* Icon glow */}
                <div
                  className="
                    pointer-events-none
                    absolute
                    inset-0
                    rounded-2xl
                    bg-white/[0.04]
                    blur-md
                    transition-all
                    duration-500
                    group-hover:bg-white/[0.08]
                  "
                />

                <Icon
                  size={22}
                  strokeWidth={1.8}
                  className={`
                    relative
                    z-10
                    ${stat.iconColor}
                    transition-all
                    duration-500
                    group-hover:scale-110
                  `}
                />

                {/* Orbital dot */}
                <span
                  className="
                    absolute
                    -right-1
                    -top-1
                    h-2
                    w-2
                    rounded-full
                    bg-slate-300
                    shadow-[0_0_8px_rgba(255,255,255,0.7)]
                    animate-pulse
                  "
                />
              </div>

              {/* House label */}
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
                  backdrop-blur-sm
                "
              >
                <SecondaryIcon
                  size={11}
                  className="
                    text-amber-500/80
                    transition-transform
                    duration-500
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

            {/* =================================================
                MAIN VALUE
            ================================================= */}

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
                    transition-all
                    duration-500
                    group-hover:text-white
                  "
                >
                  {stat.value}
                </h3>

                {/* Arrow */}
                <div
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
                    transition-all
                    duration-500
                    group-hover:border-slate-600
                    group-hover:bg-slate-800/50
                    group-hover:text-slate-300
                    group-hover:rotate-45
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
                  duration-300
                  group-hover:text-slate-400
                "
              >
                {stat.description}
              </p>
            </div>

            {/* =================================================
                SPECIAL VISUAL
            ================================================= */}

            <div className="relative z-10 mt-4 h-8">
              {stat.decoration === "north" && (
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <div
                      className="
                        h-1.5
                        overflow-hidden
                        rounded-full
                        bg-sky-950
                      "
                    >
                      <div
                        className="
                          relative
                          h-full
                          rounded-full
                          bg-gradient-to-r
                          from-sky-900
                          via-sky-500
                          to-cyan-300
                          shadow-[0_0_12px_rgba(56,189,248,0.5)]
                          transition-all
                          duration-1000
                        "
                        style={{
                          width: `${stat.progress}%`,
                        }}
                      >
                        <span
                          className="
                            absolute
                            right-0
                            top-1/2
                            h-2
                            w-2
                            -translate-y-1/2
                            rounded-full
                            bg-white
                            shadow-[0_0_8px_rgba(125,211,252,0.9)]
                          "
                        />
                      </div>
                    </div>
                  </div>

                  <BookOpen
                    size={15}
                    className="
                      text-sky-500/70
                      transition-transform
                      duration-500
                      group-hover:scale-125
                    "
                  />
                </div>
              )}

              {stat.decoration === "crown" && (
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <div
                      className="
                        h-1.5
                        overflow-hidden
                        rounded-full
                        bg-amber-950
                      "
                    >
                      <div
                        className="
                          relative
                          h-full
                          rounded-full
                          bg-gradient-to-r
                          from-amber-900
                          via-amber-500
                          to-yellow-300
                          shadow-[0_0_12px_rgba(245,158,11,0.55)]
                          transition-all
                          duration-1000
                        "
                        style={{
                          width: `${stat.progress}%`,
                        }}
                      >
                        <span
                          className="
                            absolute
                            right-0
                            top-1/2
                            h-2
                            w-2
                            -translate-y-1/2
                            rounded-full
                            bg-yellow-100
                            shadow-[0_0_10px_rgba(254,240,138,0.9)]
                            animate-pulse
                          "
                        />
                      </div>
                    </div>
                  </div>

                  <Crown
                    size={16}
                    className="
                      text-amber-400
                      drop-shadow-[0_0_7px_rgba(251,191,36,0.6)]
                      transition-all
                      duration-500
                      group-hover:scale-125
                      group-hover:-translate-y-1
                    "
                  />
                </div>
              )}

              {stat.decoration === "sword" && (
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <div
                      className="
                        h-1.5
                        overflow-hidden
                        rounded-full
                        bg-slate-900
                      "
                    >
                      <div
                        className="
                          relative
                          h-full
                          rounded-full
                          bg-gradient-to-r
                          from-slate-700
                          via-slate-400
                          to-sky-300
                          shadow-[0_0_12px_rgba(148,163,184,0.5)]
                          transition-all
                          duration-1000
                        "
                        style={{
                          width: `${stat.progress}%`,
                        }}
                      >
                        <span
                          className="
                            absolute
                            right-0
                            top-1/2
                            h-2
                            w-2
                            -translate-y-1/2
                            rounded-full
                            bg-white
                            shadow-[0_0_9px_rgba(226,232,240,0.9)]
                          "
                        />
                      </div>
                    </div>
                  </div>

                  <Sword
                    size={17}
                    className="
                      rotate-[-25deg]
                      text-slate-300
                      transition-all
                      duration-500
                      group-hover:rotate-[-5deg]
                      group-hover:scale-125
                    "
                  />
                </div>
              )}

              {stat.decoration === "fire" && (
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <div
                      className="
                        h-1.5
                        overflow-hidden
                        rounded-full
                        bg-red-950
                      "
                    >
                      <div
                        className="
                          relative
                          h-full
                          rounded-full
                          bg-gradient-to-r
                          from-red-900
                          via-orange-600
                          to-amber-300
                          shadow-[0_0_14px_rgba(249,115,22,0.6)]
                          transition-all
                          duration-1000
                        "
                        style={{
                          width: `${stat.progress}%`,
                        }}
                      >
                        <span
                          className="
                            absolute
                            right-0
                            top-1/2
                            h-2
                            w-2
                            -translate-y-1/2
                            rounded-full
                            bg-orange-100
                            shadow-[0_0_10px_rgba(251,146,60,0.9)]
                            animate-pulse
                          "
                        />
                      </div>
                    </div>
                  </div>

                  <Flame
                    size={17}
                    className="
                      text-orange-400
                      drop-shadow-[0_0_8px_rgba(249,115,22,0.7)]
                      transition-all
                      duration-500
                      group-hover:scale-125
                      group-hover:-translate-y-1
                    "
                  />
                </div>
              )}
            </div>

            {/* =================================================
                BOTTOM INFORMATION
            ================================================= */}

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
              <div className="flex items-center gap-2">
                <Sparkles
                  size={11}
                  className="
                    text-amber-500/70
                    transition-transform
                    duration-500
                    group-hover:rotate-180
                  "
                />

                <span
                  className="
                    text-[8px]
                    font-bold
                    uppercase
                    tracking-[0.16em]
                    text-slate-600
                    transition-colors
                    duration-300
                    group-hover:text-slate-500
                  "
                >
                  {stat.bottomText}
                </span>
              </div>

              <div
                className="
                  h-1
                  w-1
                  rounded-full
                  bg-slate-700
                  transition-all
                  duration-300
                  group-hover:bg-amber-500
                  group-hover:shadow-[0_0_8px_rgba(245,158,11,0.7)]
                "
              />
            </div>

            {/* =================================================
                HOVER LIGHT SWEEP
            ================================================= */}

            <div
              className="
                pointer-events-none
                absolute
                inset-y-0
                -left-24
                w-12
                rotate-[18deg]
                bg-white/[0.04]
                blur-lg
                transition-all
                duration-[1200ms]
                group-hover:left-[120%]
              "
            />

            {/* =================================================
                BOTTOM REALM LINE
            ================================================= */}

            <div
              className="
                pointer-events-none
                absolute
                bottom-0
                left-0
                h-[2px]
                w-full
                bg-gradient-to-r
                from-transparent
                via-slate-700
                to-transparent
                opacity-70
                transition-all
                duration-500
                group-hover:via-amber-600
              "
            />
          </div>
        );
      })}
    </div>
  );
}

export default StatsGrid;
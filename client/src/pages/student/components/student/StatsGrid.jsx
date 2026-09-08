import {
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  Flame,
  Sparkles,
  Trophy,
} from "lucide-react";

function StatsGrid({ stats }) {
  const enrolledCourses = stats?.enrolledCourses ?? 0;
  const completedCourses = stats?.completedCourses ?? 0;
  const learningHours = Number(stats?.learningHours ?? 0);
  const studyStreak = stats?.studyStreak ?? 0;

  /*
   * Small visual percentages.
   * These are only for presentation and do not affect your backend logic.
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

  const dashboardStats = [
    {
      title: "Enrolled Courses",
      value: enrolledCourses,
      description:
        enrolledCourses === 1
          ? "Active course"
          : "Active courses",

      icon: BookOpen,

      iconBg:
        "bg-gradient-to-br from-violet-100 to-indigo-100",

      iconColor: "text-violet-600",

      cardGradient:
        "from-violet-50/70 via-white to-white",

      visual: (
        <div className="relative h-12 w-16">
          {/* Books */}
          <div
            className="
              absolute
              bottom-1
              left-1
              h-2.5
              w-12
              rotate-[-3deg]
              rounded-md
              bg-violet-300
            "
          />

          <div
            className="
              absolute
              bottom-4
              left-3
              h-2.5
              w-10
              rotate-[2deg]
              rounded-md
              bg-indigo-300
            "
          />

          <div
            className="
              absolute
              bottom-7
              left-5
              h-2.5
              w-8
              rotate-[-4deg]
              rounded-md
              bg-purple-300
            "
          />

          <Sparkles
            size={13}
            className="
              absolute
              right-0
              top-0
              text-violet-400
              animate-pulse
            "
          />
        </div>
      ),
    },

    {
      title: "Completed Courses",
      value: completedCourses,
      description:
        completedCourses === 0
          ? "Start your first course"
          : `${courseCompletion}% completion`,

      icon: CheckCircle2,

      iconBg:
        "bg-gradient-to-br from-emerald-100 to-teal-100",

      iconColor: "text-emerald-600",

      cardGradient:
        "from-emerald-50/70 via-white to-white",

      visual: (
        <div className="relative flex h-14 w-14 items-center justify-center">
          {/* Progress ring */}
          <svg
            width="56"
            height="56"
            viewBox="0 0 56 56"
            className="-rotate-90"
          >
            <circle
              cx="28"
              cy="28"
              r="23"
              fill="none"
              stroke="currentColor"
              strokeWidth="5"
              className="text-emerald-100"
            />

            <circle
              cx="28"
              cy="28"
              r="23"
              fill="none"
              stroke="currentColor"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray="144.5"
              strokeDashoffset={
                144.5 - (144.5 * courseCompletion) / 100
              }
              className="
                text-emerald-500
                transition-all
                duration-1000
              "
            />
          </svg>

          <CheckCircle2
            size={19}
            className="
              absolute
              text-emerald-500
            "
          />
        </div>
      ),
    },

    {
      title: "Learning Hours",
      value: `${learningHours.toFixed(1)}h`,
      description: "Total study time",

      icon: Clock3,

      iconBg:
        "bg-gradient-to-br from-amber-100 to-orange-100",

      iconColor: "text-amber-600",

      cardGradient:
        "from-amber-50/70 via-white to-white",

      visual: (
        <div className="flex h-14 w-16 items-end gap-1.5">
          <div
            className="
              h-5
              w-2.5
              rounded-t-md
              bg-amber-200
              transition-all
              duration-500
              group-hover:h-7
            "
          />

          <div
            className="
              h-8
              w-2.5
              rounded-t-md
              bg-amber-300
              transition-all
              duration-500
              group-hover:h-10
            "
          />

          <div
            className="
              h-11
              w-2.5
              rounded-t-md
              bg-orange-400
              transition-all
              duration-500
              group-hover:h-12
            "
          />

          <div
            className="
              h-7
              w-2.5
              rounded-t-md
              bg-orange-200
              transition-all
              duration-500
              group-hover:h-9
            "
          />

          <div
            className="
              h-9
              w-2.5
              rounded-t-md
              bg-amber-400
              transition-all
              duration-500
              group-hover:h-11
            "
          />
        </div>
      ),
    },

    {
      title: "Study Streak",
      value: studyStreak,
      description:
        studyStreak === 1
          ? "Day in a row"
          : "Days in a row",

      icon: Flame,

      iconBg:
        "bg-gradient-to-br from-orange-100 to-red-100",

      iconColor: "text-orange-600",

      cardGradient:
        "from-orange-50/70 via-white to-white",

      visual: (
        <div className="relative flex h-14 w-14 items-center justify-center">
          {/* Glow */}
          <div
            className="
              absolute
              h-12
              w-12
              rounded-full
              bg-orange-200/40
              blur-xl
              animate-pulse
            "
          />

          <Flame
            size={42}
            strokeWidth={1.6}
            className="
              relative
              z-10
              text-orange-500
              transition-transform
              duration-500
              group-hover:scale-110
              group-hover:-translate-y-1
            "
          />

          {studyStreak > 0 && (
            <Sparkles
              size={12}
              className="
                absolute
                right-0
                top-0
                text-orange-400
                animate-pulse
              "
            />
          )}
        </div>
      ),
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

        return (
          <div
            key={stat.title}
            className={`
              group
              relative
              min-w-0
              w-full
              overflow-hidden
              rounded-3xl
              border
              border-slate-200/80
              bg-gradient-to-br
              ${stat.cardGradient}
              p-5
              shadow-sm
              transition-all
              duration-300
              hover:-translate-y-1
              hover:shadow-xl
              hover:shadow-slate-200/50
              sm:p-6
            `}
          >
            {/* =================================================
                Decorative background
            ================================================= */}

            <div
              className="
                pointer-events-none
                absolute
                -right-8
                -top-8
                h-24
                w-24
                rounded-full
                bg-white/80
                blur-xl
                transition-transform
                duration-700
                group-hover:scale-150
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                bottom-0
                right-0
                h-20
                w-20
                translate-x-1/2
                translate-y-1/2
                rounded-full
                bg-slate-100/50
                blur-xl
              "
            />

            {/* =================================================
                Header
            ================================================= */}

            <div className="relative z-10 flex items-start justify-between">
              <div
                className={`
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-2xl
                  ${stat.iconBg}
                  shadow-sm
                  transition-transform
                  duration-300
                  group-hover:scale-110
                  group-hover:rotate-3
                `}
              >
                <Icon
                  size={21}
                  className={stat.iconColor}
                  strokeWidth={2}
                />
              </div>

              <div
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-full
                  bg-slate-50
                  text-slate-300
                  transition-all
                  duration-300
                  group-hover:bg-slate-100
                  group-hover:text-slate-500
                "
              >
                <ArrowUpRight size={16} />
              </div>
            </div>

            {/* =================================================
                Main content
            ================================================= */}

            <div
              className="
                relative
                z-10
                mt-5
                flex
                items-end
                justify-between
                gap-3
              "
            >
              <div className="min-w-0">
                <p
                  className="
                    m-0
                    truncate
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wider
                    text-slate-400
                  "
                >
                  {stat.title}
                </p>

                <h3
                  className="
                    m-0
                    mt-1
                    text-3xl
                    font-extrabold
                    tracking-tight
                    text-slate-900
                  "
                >
                  {stat.value}
                </h3>

                <p
                  className="
                    m-0
                    mt-1
                    text-xs
                    font-medium
                    text-slate-400
                  "
                >
                  {stat.description}
                </p>
              </div>

              {/* Visual */}
              <div className="shrink-0">
                {stat.visual}
              </div>
            </div>

            {/* =================================================
                Bottom progress
            ================================================= */}

            {stat.title === "Enrolled Courses" && (
              <div className="relative z-10 mt-5">
                <div className="h-1.5 overflow-hidden rounded-full bg-violet-100">
                  <div
                    className="
                      h-full
                      rounded-full
                      bg-gradient-to-r
                      from-violet-500
                      to-indigo-500
                      transition-all
                      duration-1000
                    "
                    style={{
                      width: `${Math.min(
                        100,
                        enrolledCourses * 10
                      )}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {stat.title === "Completed Courses" && (
              <div className="relative z-10 mt-5">
                <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400">
                  <span>Course progress</span>
                  <span>{courseCompletion}%</span>
                </div>

                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-emerald-100">
                  <div
                    className="
                      h-full
                      rounded-full
                      bg-gradient-to-r
                      from-emerald-400
                      to-teal-500
                      transition-all
                      duration-1000
                    "
                    style={{
                      width: `${courseCompletion}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {stat.title === "Learning Hours" && (
              <div className="relative z-10 mt-5">
                <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400">
                  <span>Weekly learning goal</span>
                  <span>{learningGoal}%</span>
                </div>

                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-amber-100">
                  <div
                    className="
                      h-full
                      rounded-full
                      bg-gradient-to-r
                      from-amber-400
                      to-orange-500
                      transition-all
                      duration-1000
                    "
                    style={{
                      width: `${learningGoal}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {stat.title === "Study Streak" && (
              <div className="relative z-10 mt-5">
                <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400">
                  <span>30 day challenge</span>
                  <span>{streakProgress}%</span>
                </div>

                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-orange-100">
                  <div
                    className="
                      h-full
                      rounded-full
                      bg-gradient-to-r
                      from-orange-400
                      to-red-500
                      transition-all
                      duration-1000
                    "
                    style={{
                      width: `${streakProgress}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default StatsGrid;
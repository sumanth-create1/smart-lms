import {
  BookOpen,
  GraduationCap,
  Users,
  Coins,
  ArrowUpRight,
  Crown,
} from "lucide-react";

const STAT_CONFIG = [
  {
    key: "totalCourses",
    title: "Courses",
    subtitle: "Courses under your command",
    icon: BookOpen,
    accent: "orange",
  },
  {
    key: "totalStudents",
    title: "Students",
    subtitle: "Learners in your realm",
    icon: GraduationCap,
    accent: "gold",
  },
  {
    key: "totalEnrollments",
    title: "Enrollments",
    subtitle: "Total course enrollments",
    icon: Users,
    accent: "crimson",
  },
  {
    key: "totalCourseValue",
    title: "Course Value",
    subtitle: "Combined course pricing",
    icon: Coins,
    accent: "amber",
  },
];

const accentStyles = {
  orange: {
    icon: "text-orange-400",
    iconBg: "bg-orange-500/[0.08]",
    border: "group-hover:border-orange-500/30",
    glow: "group-hover:shadow-[0_0_35px_rgba(249,115,22,0.08)]",
    line: "from-transparent via-orange-500/60 to-transparent",
  },

  gold: {
    icon: "text-amber-300",
    iconBg: "bg-amber-400/[0.08]",
    border: "group-hover:border-amber-400/30",
    glow: "group-hover:shadow-[0_0_35px_rgba(251,191,36,0.08)]",
    line: "from-transparent via-amber-400/60 to-transparent",
  },

  crimson: {
    icon: "text-red-400",
    iconBg: "bg-red-500/[0.08]",
    border: "group-hover:border-red-500/30",
    glow: "group-hover:shadow-[0_0_35px_rgba(239,68,68,0.08)]",
    line: "from-transparent via-red-500/60 to-transparent",
  },

  amber: {
    icon: "text-orange-300",
    iconBg: "bg-orange-400/[0.08]",
    border: "group-hover:border-orange-400/30",
    glow: "group-hover:shadow-[0_0_35px_rgba(251,146,60,0.08)]",
    line: "from-transparent via-orange-300/60 to-transparent",
  },
};

function formatValue(key, value) {
  const numericValue = Number(value || 0);

  if (key === "totalCourseValue") {
    return `₹${numericValue.toLocaleString("en-IN")}`;
  }

  return numericValue.toLocaleString("en-IN");
}

function InstructorStats({ stats = {} }) {
  return (
    <section className="mt-6">

      {/* SECTION HEADER */}

      <div className="mb-4 flex items-end justify-between">

        <div>
          <div className="flex items-center gap-2">

            <Crown
              size={15}
              className="text-orange-400"
            />

            <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-orange-400">
              Realm Overview
            </p>

          </div>

          <h2 className="mt-2 font-serif text-2xl font-semibold text-stone-100">
            Kingdom Statistics
          </h2>

          <p className="mt-1 text-xs text-stone-600">
            A live overview of your instructor activity.
          </p>
        </div>

      </div>

      {/* STAT GRID */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {STAT_CONFIG.map((stat) => {

          const Icon = stat.icon;

          const style =
            accentStyles[stat.accent];

          const value =
            formatValue(
              stat.key,
              stats[stat.key]
            );

          return (
            <div
              key={stat.key}
              className={`
                group
                relative
                overflow-hidden
                rounded-2xl
                border
                border-stone-800/80
                bg-[#0d0a08]
                p-5
                transition-all
                duration-500
                hover:-translate-y-1
                ${style.border}
                ${style.glow}
              `}
            >

              {/* BACKGROUND GLOW */}

              <div
                className="
                  pointer-events-none
                  absolute
                  -right-10
                  -top-10
                  h-28
                  w-28
                  rounded-full
                  bg-orange-500/[0.035]
                  blur-3xl
                  transition-all
                  duration-500
                  group-hover:scale-150
                "
              />

              {/* TOP */}

              <div className="relative flex items-start justify-between">

                <div
                  className={`
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-white/[0.04]
                    ${style.iconBg}
                    ${style.icon}
                    transition-all
                    duration-300
                    group-hover:scale-110
                    group-hover:rotate-3
                  `}
                >
                  <Icon size={19} />
                </div>

                <div
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-stone-800
                    text-stone-700
                    transition-all
                    duration-300
                    group-hover:border-orange-500/20
                    group-hover:text-orange-400
                  "
                >
                  <ArrowUpRight size={14} />
                </div>

              </div>

              {/* VALUE */}

              <div className="relative mt-6">

                <p
                  className="
                    text-3xl
                    font-semibold
                    tracking-tight
                    text-stone-100
                    transition-all
                    duration-300
                    group-hover:text-orange-100
                  "
                >
                  {value}
                </p>

                <p className="mt-2 text-sm font-medium text-stone-300">
                  {stat.title}
                </p>

                <p className="mt-1 text-[10px] leading-5 text-stone-600">
                  {stat.subtitle}
                </p>

              </div>

              {/* BOTTOM DECORATION */}

              <div className="mt-5 flex items-center gap-3">

                <div className="h-px flex-1 bg-stone-800" />

                <span className="text-[8px] font-bold uppercase tracking-[0.25em] text-stone-700">
                  Live
                </span>

                <div className="h-px w-8 bg-stone-800" />

              </div>

              {/* ORANGE LINE */}

              <div
                className={`
                  absolute
                  bottom-0
                  left-1/2
                  h-px
                  w-0
                  -translate-x-1/2
                  bg-gradient-to-r
                  transition-all
                  duration-500
                  group-hover:w-3/4
                  ${style.line}
                `}
              />

            </div>
          );
        })}

      </div>
    </section>
  );
}

export default InstructorStats;
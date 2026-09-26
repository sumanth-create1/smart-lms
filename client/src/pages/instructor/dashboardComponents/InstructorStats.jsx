import {
  ArrowUpRight,
  BookOpen,
  Coins,
  Crown,
  GraduationCap,
  Users,
} from "lucide-react";

const STATS = [
  {
    key: "totalCourses",
    title: "Courses",
    description: "Courses under your command",
    icon: BookOpen,
    color: "orange",
  },
  {
    key: "totalStudents",
    title: "Students",
    description: "Learners in your realm",
    icon: GraduationCap,
    color: "gold",
  },
  {
    key: "totalEnrollments",
    title: "Enrollments",
    description: "Total course enrollments",
    icon: Users,
    color: "red",
  },
  {
    key: "totalCourseValue",
    title: "Course Value",
    description: "Combined course pricing",
    icon: Coins,
    color: "amber",
  },
];

const COLORS = {
  orange: {
    icon: "text-orange-400",
    iconBg: "bg-orange-500/[0.08]",
    hoverBorder: "hover:border-orange-500/30",
    line: "via-orange-500/60",
  },

  gold: {
    icon: "text-amber-300",
    iconBg: "bg-amber-400/[0.08]",
    hoverBorder: "hover:border-amber-400/30",
    line: "via-amber-400/60",
  },

  red: {
    icon: "text-red-400",
    iconBg: "bg-red-500/[0.08]",
    hoverBorder: "hover:border-red-500/30",
    line: "via-red-500/60",
  },

  amber: {
    icon: "text-orange-300",
    iconBg: "bg-orange-400/[0.08]",
    hoverBorder: "hover:border-orange-400/30",
    line: "via-orange-300/60",
  },
};

function formatValue(key, value) {
  const number = Number(value) || 0;
  const formatted = number.toLocaleString("en-IN");

  return key === "totalCourseValue"
    ? `₹${formatted}`
    : formatted;
}

function StatCard({ stat, value }) {
  const Icon = stat.icon;
  const color = COLORS[stat.color];

  return (
    <div
      className={`
        group relative overflow-hidden rounded-2xl
        border border-stone-800/80
        bg-[#0d0a08] p-5
        transition-all duration-300
        hover:-translate-y-1
        ${color.hoverBorder}
        hover:shadow-[0_0_35px_rgba(249,115,22,0.07)]
      `}
    >
      {/* Ambient glow */}
      <div
        className="
          pointer-events-none absolute
          -right-10 -top-10
          h-28 w-28
          rounded-full
          bg-orange-500/[0.035]
          blur-3xl
          transition-transform duration-500
          group-hover:scale-150
        "
      />

      {/* Header */}
      <div className="relative flex items-start justify-between">
        <div
          className={`
            flex h-11 w-11 items-center justify-center
            rounded-xl border border-white/[0.04]
            ${color.iconBg} ${color.icon}
            transition-transform duration-300
            group-hover:scale-110
            group-hover:rotate-3
          `}
        >
          <Icon size={19} />
        </div>

        <div
          className="
            flex h-8 w-8 items-center justify-center
            rounded-full border border-stone-800
            text-stone-700
            transition-colors duration-300
            group-hover:border-orange-500/20
            group-hover:text-orange-400
          "
        >
          <ArrowUpRight size={14} />
        </div>
      </div>

      {/* Value */}
      <div className="relative mt-6">
        <p className="text-3xl font-semibold tracking-tight text-stone-100 transition-colors group-hover:text-orange-100">
          {value}
        </p>

        <p className="mt-2 text-sm font-medium text-stone-300">
          {stat.title}
        </p>

        <p className="mt-1 text-[10px] leading-5 text-stone-600">
          {stat.description}
        </p>
      </div>

      {/* Footer */}
      <div className="mt-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-stone-800" />

        <span className="flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-[0.25em] text-stone-700">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Live
        </span>

        <div className="h-px w-8 bg-stone-800" />
      </div>

      {/* Bottom glow line */}
      <div
        className={`
          absolute bottom-0 left-1/2
          h-px w-0
          -translate-x-1/2
          bg-gradient-to-r from-transparent
          ${color.line}
          to-transparent
          transition-all duration-500
          group-hover:w-3/4
        `}
      />
    </div>
  );
}

function InstructorStats({ stats = {} }) {
  return (
    <section className="mt-6">
      {/* Section heading */}
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <Crown size={15} className="text-orange-400" />

          <span className="text-[9px] font-bold uppercase tracking-[0.35em] text-orange-400">
            Realm Overview
          </span>
        </div>

        <h2 className="mt-2 font-serif text-2xl font-semibold text-stone-100">
          Kingdom Statistics
        </h2>

        <p className="mt-1 text-xs text-stone-600">
          A live overview of your instructor activity.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STATS.map((stat) => (
          <StatCard
            key={stat.key}
            stat={stat}
            value={formatValue(stat.key, stats[stat.key])}
          />
        ))}
      </div>
    </section>
  );
}

export default InstructorStats;
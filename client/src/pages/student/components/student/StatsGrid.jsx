import {
  BookOpen,
  CheckCircle2,
  Clock3,
  Flame,
  ArrowUpRight,
} from "lucide-react";

function StatsGrid({ stats }) {
  const dashboardStats = [
    {
      title: "Enrolled Courses",
      value: stats?.enrolledCourses ?? 0,
      description: "Active courses",
      icon: BookOpen,
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-600",
    },
    {
      title: "Completed Courses",
      value: stats?.completedCourses ?? 0,
      description: "Courses completed",
      icon: CheckCircle2,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      title: "Learning Hours",
      value: Number(stats?.learningHours ?? 0).toFixed(1),
      description: "Total study time",
      icon: Clock3,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    {
      title: "Study Streak",
      value: stats?.studyStreak ?? 0,
      description: "Days in a row",
      icon: Flame,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
    },
  ];

  return (
    <div
      className="
        !grid
        !w-full
        !grid-cols-1
        gap-4
        sm:!grid-cols-2
        xl:!grid-cols-4
      "
    >
      {dashboardStats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="
              !block
              !min-w-0
              !w-full
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-5
              shadow-sm
              transition
              duration-200
              hover:-translate-y-0.5
              hover:shadow-md
              sm:p-6
            "
          >
            {/* Top */}
            <div className="flex items-start justify-between">
              <div
                className={`
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  ${stat.iconBg}
                `}
              >
                <Icon
                  size={21}
                  className={stat.iconColor}
                />
              </div>

              <ArrowUpRight
                size={17}
                className="text-slate-300"
              />
            </div>

            {/* Content */}
            <div className="mt-5 min-w-0">
              <p className="!m-0 truncate text-sm font-medium text-slate-500">
                {stat.title}
              </p>

              <h3 className="!m-0 mt-1 text-3xl font-bold tracking-tight text-slate-900">
                {stat.value}
              </h3>

              <p className="!m-0 mt-1 text-xs text-slate-400">
                {stat.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default StatsGrid;
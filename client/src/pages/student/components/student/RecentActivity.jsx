import {
  PlayCircle,
  CheckCircle2,
  BookOpen,
  Award,
  Clock3,
  ArrowRight,
} from "lucide-react";

function RecentActivity() {
  const activities = [
    {
      title: "Completed a lesson",
      description: "Building REST APIs with Express",
      time: "20 min ago",
      icon: CheckCircle2,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      title: "Started learning",
      description: "Advanced MERN Stack",
      time: "2 hours ago",
      icon: PlayCircle,
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-600",
    },
    {
      title: "Enrolled in a course",
      description: "Advanced MERN Stack",
      time: "Yesterday",
      icon: BookOpen,
      iconBg: "bg-violet-50",
      iconColor: "text-violet-600",
    },
    {
      title: "Achievement unlocked",
      description: "First lesson completed",
      time: "2 days ago",
      icon: Award,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
  ];

  return (
    <section className="min-w-0 rounded-2xl border border-slate-200 bg-white shadow-sm">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">

        <div>
          <h2 className="text-base font-bold text-slate-900 sm:text-lg">
            Recent Activity
          </h2>

          <p className="mt-0.5 text-xs text-slate-400 sm:text-sm">
            Your latest learning activity
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 transition hover:text-indigo-700 sm:text-sm"
        >
          View all
          <ArrowRight size={15} />
        </button>

      </div>

      {/* Activities */}
      <div className="divide-y divide-slate-100">

        {activities.map((activity) => {
          const Icon = activity.icon;

          return (
            <div
              key={`${activity.title}-${activity.time}`}
              className="flex items-center gap-4 px-5 py-4 transition hover:bg-slate-50 sm:px-6"
            >

              {/* Icon */}
              <div
                className={`
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  ${activity.iconBg}
                `}
              >
                <Icon
                  size={18}
                  className={activity.iconColor}
                />
              </div>

              {/* Text */}
              <div className="min-w-0 flex-1">

                <p className="truncate text-sm font-semibold text-slate-800">
                  {activity.title}
                </p>

                <p className="mt-0.5 truncate text-xs text-slate-400">
                  {activity.description}
                </p>

              </div>

              {/* Time */}
              <div className="flex shrink-0 items-center gap-1 text-[11px] text-slate-400">
                <Clock3 size={12} />
                <span className="hidden sm:inline">
                  {activity.time}
                </span>
              </div>

            </div>
          );
        })}

      </div>
    </section>
  );
}

export default RecentActivity;
import {
  BookOpen,
  CheckCircle,
  Clock3,
  Flame,
} from "lucide-react";

function StatsGrid({ stats }) {
  const statCards = [
    {
      title: "Enrolled Courses",
      value: stats?.enrolledCourses ?? 0,
      icon: BookOpen,
      description: "Courses you're learning",
    },
    {
      title: "Completed Courses",
      value: stats?.completedCourses ?? 0,
      icon: CheckCircle,
      description: "Courses completed",
    },
    {
      title: "Learning Hours",
      value: stats?.learningHours ?? 0,
      icon: Clock3,
      description: "Total learning time",
    },
    {
      title: "Study Streak",
      value: stats?.studyStreak ?? 0,
      icon: Flame,
      description: "Days in a row",
    },
  ];

  return (
    <section className="mt-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              {/* TOP */}

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {stat.title}
                  </p>

                  <h2 className="mt-2 text-3xl font-bold text-gray-900">
                    {stat.value}
                  </h2>
                </div>

                {/* ICON */}

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50">
                  <Icon
                    size={22}
                    strokeWidth={2}
                    className="text-indigo-600"
                  />
                </div>

              </div>

              {/* DESCRIPTION */}

              <p className="mt-4 text-xs text-gray-400">
                {stat.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default StatsGrid;
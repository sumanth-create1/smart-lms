import {
  PlayCircle,
  CheckCircle2,
  BookOpen,
  Award,
  Clock3,
  ArrowRight,
} from "lucide-react";

function RecentActivity({ activities = [] }) {
  /*
   * Map backend activity types to the appropriate icon
   * and styling.
   */
  const getActivityStyle = (type = "") => {
    const normalizedType = type.toLowerCase();

    if (
      normalizedType.includes("complete") ||
      normalizedType.includes("completed")
    ) {
      return {
        icon: CheckCircle2,
        iconBg: "bg-emerald-50",
        iconColor: "text-emerald-600",
      };
    }

    if (
      normalizedType.includes("start") ||
      normalizedType.includes("started")
    ) {
      return {
        icon: PlayCircle,
        iconBg: "bg-indigo-50",
        iconColor: "text-indigo-600",
      };
    }

    if (
      normalizedType.includes("enroll") ||
      normalizedType.includes("enrolled")
    ) {
      return {
        icon: BookOpen,
        iconBg: "bg-violet-50",
        iconColor: "text-violet-600",
      };
    }

    if (
      normalizedType.includes("achievement") ||
      normalizedType.includes("award")
    ) {
      return {
        icon: Award,
        iconBg: "bg-amber-50",
        iconColor: "text-amber-600",
      };
    }

    return {
      icon: BookOpen,
      iconBg: "bg-slate-100",
      iconColor: "text-slate-500",
    };
  };

  /*
   * Convert a date into a readable relative time.
   */
  const getRelativeTime = (date) => {
    if (!date) {
      return "Recently";
    }

    const createdAt = new Date(date);

    if (Number.isNaN(createdAt.getTime())) {
      return "Recently";
    }

    const now = new Date();

    const differenceInSeconds = Math.floor(
      (now - createdAt) / 1000
    );

    if (differenceInSeconds < 60) {
      return "Just now";
    }

    const differenceInMinutes = Math.floor(
      differenceInSeconds / 60
    );

    if (differenceInMinutes < 60) {
      return `${differenceInMinutes} min ago`;
    }

    const differenceInHours = Math.floor(
      differenceInMinutes / 60
    );

    if (differenceInHours < 24) {
      return `${differenceInHours} ${
        differenceInHours === 1 ? "hour" : "hours"
      } ago`;
    }

    const differenceInDays = Math.floor(
      differenceInHours / 24
    );

    if (differenceInDays === 1) {
      return "Yesterday";
    }

    if (differenceInDays < 7) {
      return `${differenceInDays} days ago`;
    }

    return createdAt.toLocaleDateString();
  };

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

      {/* Empty State */}
      {activities.length === 0 ? (
        <div className="flex min-h-[250px] flex-col items-center justify-center px-5 py-10 text-center sm:px-6">

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50">
            <Clock3
              size={22}
              className="text-slate-400"
            />
          </div>

          <p className="mt-3 text-sm font-semibold text-slate-700">
            No recent activity
          </p>

          <p className="mt-1 max-w-xs text-xs leading-5 text-slate-400">
            Your recent lessons, enrollments, and achievements
            will appear here.
          </p>

        </div>
      ) : (
        /* Activities */
        <div className="divide-y divide-slate-100">

          {activities.map((activity, index) => {
            const style = getActivityStyle(
              activity.type || activity.title
            );

            const Icon = style.icon;

            const title =
              activity.title ||
              activity.action ||
              "Learning activity";

            const description =
              activity.description ||
              activity.courseTitle ||
              activity.lessonTitle ||
              "";

            const time = getRelativeTime(
              activity.createdAt ||
                activity.timestamp ||
                activity.date
            );

            return (
              <div
                key={
                  activity._id ||
                  `${title}-${time}-${index}`
                }
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
                    ${style.iconBg}
                  `}
                >
                  <Icon
                    size={18}
                    className={style.iconColor}
                  />
                </div>

                {/* Text */}
                <div className="min-w-0 flex-1">

                  <p className="truncate text-sm font-semibold text-slate-800">
                    {title}
                  </p>

                  {description && (
                    <p className="mt-0.5 truncate text-xs text-slate-400">
                      {description}
                    </p>
                  )}

                </div>

                {/* Time */}
                <div className="flex shrink-0 items-center gap-1 text-[11px] text-slate-400">

                  <Clock3 size={12} />

                  <span className="hidden sm:inline">
                    {time}
                  </span>

                </div>

              </div>
            );
          })}

        </div>
      )}

    </section>
  );
}

export default RecentActivity;
import {
  Activity,
  BookOpen,
  CheckCircle2,
  Clock3,
  PlayCircle,
} from "lucide-react";

function LearningActivity({ activity = [] }) {
  // ------------------------------------------
  // FORMAT ACTIVITY DATE
  // ------------------------------------------

  const formatDate = (date) => {
    if (!date) return "";

    const activityDate = new Date(date);

    if (Number.isNaN(activityDate.getTime())) {
      return "";
    }

    return activityDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // ------------------------------------------
  // GET ACTIVITY ICON
  // ------------------------------------------

  const getActivityIcon = (type) => {
    const activityType = type?.toLowerCase();

    if (
      activityType?.includes("complete") ||
      activityType?.includes("finish")
    ) {
      return CheckCircle2;
    }

    if (
      activityType?.includes("watch") ||
      activityType?.includes("lecture") ||
      activityType?.includes("video")
    ) {
      return PlayCircle;
    }

    if (
      activityType?.includes("course") ||
      activityType?.includes("enroll")
    ) {
      return BookOpen;
    }

    return Activity;
  };

  // ------------------------------------------
  // ACTIVITY TITLE
  // ------------------------------------------

  const getActivityTitle = (item) => {
    const type = item?.type?.toLowerCase();

    if (type?.includes("complete")) {
      return "Completed a lesson";
    }

    if (type?.includes("watch")) {
      return "Watched a lesson";
    }

    if (type?.includes("enroll")) {
      return "Enrolled in a course";
    }

    if (type?.includes("course")) {
      return "Course activity";
    }

    return "Learning activity";
  };

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">

      {/* =====================================
          HEADER
      ===================================== */}

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
            <Activity
              size={21}
              className="text-indigo-600"
            />
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Learning Activity
            </h2>

            <p className="text-sm text-gray-500">
              Your recent learning activity
            </p>
          </div>

        </div>

      </div>

      {/* =====================================
          EMPTY STATE
      ===================================== */}

      {activity.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-gray-200 p-8 text-center">

          <Activity
            size={34}
            className="mx-auto text-gray-300"
          />

          <h3 className="mt-3 font-semibold text-gray-700">
            No activity yet
          </h3>

          <p className="mt-1 text-sm text-gray-400">
            Your learning activity will appear here as you study.
          </p>

        </div>
      ) : (

        /* =====================================
           ACTIVITY LIST
        ===================================== */

        <div className="mt-6">

          {activity.map((item, index) => {

            const Icon = getActivityIcon(item?.type);

            const courseTitle =
              item?.course?.courseTitle ||
              "Course";

            const lectureTitle =
              item?.lecture?.lectureTitle ||
              "Learning activity";

            return (
              <div
                key={item?._id || index}
                className="relative flex gap-4 pb-6 last:pb-0"
              >

                {/* =================================
                    TIMELINE
                ================================= */}

                {index !== activity.length - 1 && (
                  <div className="absolute left-5 top-10 h-full w-px bg-gray-100" />
                )}

                {/* =================================
                    ICON
                ================================= */}

                <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50">

                  <Icon
                    size={18}
                    className="text-indigo-600"
                  />

                </div>

                {/* =================================
                    CONTENT
                ================================= */}

                <div className="min-w-0 flex-1">

                  <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">

                    <div className="min-w-0">

                      <h3 className="text-sm font-semibold text-gray-800">
                        {getActivityTitle(item)}
                      </h3>

                      <p className="mt-1 truncate text-sm text-gray-600">
                        {lectureTitle}
                      </p>

                      <p className="mt-1 truncate text-xs text-gray-400">
                        {courseTitle}
                      </p>

                    </div>

                    <div className="flex shrink-0 items-center gap-1 text-xs text-gray-400">

                      <Clock3 size={13} />

                      <span>
                        {formatDate(item?.createdAt)}
                      </span>

                    </div>

                  </div>

                </div>

              </div>
            );
          })}

        </div>
      )}

    </section>
  );
}

export default LearningActivity;
import {
  Activity,
  BookOpen,
  CheckCircle2,
  Clock3,
  PlayCircle,
} from "lucide-react";

function LearningActivity({ activity = [] }) {
  // =====================================================
  // FORMAT DATE
  // =====================================================

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

  // =====================================================
  // ACTIVITY ICON
  // =====================================================

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

  // =====================================================
  // ACTIVITY TITLE
  // =====================================================

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
    <section
      className="
        w-full
        rounded-3xl
        border
        border-slate-200
        bg-white
        p-5
        shadow-sm
        sm:p-6
        lg:p-7
      "
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex items-center justify-between">
        <div className="flex min-w-0 items-center gap-3">
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
              bg-indigo-50
              text-indigo-600
            "
          >
            <Activity size={21} />
          </div>

          {/* Heading */}

          <div className="min-w-0">
            <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
              Learning Activity
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Your recent learning activity
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================
          EMPTY STATE
      ===================================================== */}

      {activity.length === 0 ? (
        <div
          className="
            mt-7
            rounded-2xl
            border
            border-dashed
            border-slate-200
            bg-slate-50/60
            px-6
            py-12
            text-center
          "
        >
          <div
            className="
              mx-auto
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              bg-white
              shadow-sm
            "
          >
            <Activity
              size={30}
              className="text-slate-300"
            />
          </div>

          <h3 className="mt-5 text-base font-bold text-slate-700">
            No activity yet
          </h3>

          <p
            className="
              mx-auto
              mt-2
              max-w-sm
              text-sm
              leading-6
              text-slate-400
            "
          >
            Your learning activity will appear here as
            you study, watch lessons, and complete courses.
          </p>
        </div>
      ) : (
        /* =====================================================
           ACTIVITY LIST
        ===================================================== */

        <div className="mt-7">
          {activity.map((item, index) => {
            const Icon = getActivityIcon(item?.type);

            const courseTitle =
              item?.course?.courseTitle || "Course";

            const lectureTitle =
              item?.lecture?.lectureTitle ||
              "Learning activity";

            const isLast = index === activity.length - 1;

            return (
              <div
                key={item?._id || index}
                className="
                  relative
                  flex
                  gap-4
                  pb-7
                  last:pb-0
                  sm:gap-5
                "
              >
                {/* =================================================
                    TIMELINE
                ================================================= */}

                {!isLast && (
                  <div
                    className="
                      absolute
                      left-[21px]
                      top-12
                      bottom-0
                      w-px
                      bg-slate-200
                    "
                  />
                )}

                {/* =================================================
                    ACTIVITY ICON
                ================================================= */}

                <div
                  className="
                    relative
                    z-10
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-indigo-100
                    bg-indigo-50
                    text-indigo-600
                  "
                >
                  <Icon
                    size={18}
                    strokeWidth={2}
                  />
                </div>

                {/* =================================================
                    CONTENT
                ================================================= */}

                <div
                  className="
                    min-w-0
                    flex-1
                    rounded-2xl
                    border
                    border-slate-100
                    bg-slate-50/50
                    px-4
                    py-4
                    transition
                    hover:border-indigo-100
                    hover:bg-white
                    hover:shadow-sm
                    sm:px-5
                  "
                >
                  {/* TOP */}

                  <div
                    className="
                      flex
                      flex-col
                      gap-3
                      sm:flex-row
                      sm:items-start
                      sm:justify-between
                    "
                  >
                    {/* Activity information */}

                    <div className="min-w-0">
                      <h3
                        className="
                          break-words
                          text-sm
                          font-bold
                          text-slate-800
                        "
                      >
                        {getActivityTitle(item)}
                      </h3>

                      <p
                        className="
                          mt-2
                          break-words
                          text-sm
                          font-medium
                          leading-5
                          text-slate-600
                        "
                      >
                        {lectureTitle}
                      </p>

                      <p
                        className="
                          mt-1.5
                          break-words
                          text-xs
                          font-medium
                          text-slate-400
                        "
                      >
                        {courseTitle}
                      </p>
                    </div>

                    {/* DATE */}

                    <div
                      className="
                        flex
                        w-fit
                        shrink-0
                        items-center
                        gap-1.5
                        rounded-lg
                        bg-white
                        px-2.5
                        py-1.5
                        text-[11px]
                        font-medium
                        text-slate-400
                        shadow-sm
                      "
                    >
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
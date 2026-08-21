import {
  PlayCircle,
  CheckCircle2,
  BookOpen,
  Award,
  Clock3,
  ArrowRight,
  GraduationCap,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// =====================================================
// ACTIVITY STYLE
// =====================================================

const getActivityStyle = (type = "") => {
  const normalizedType = String(type).toLowerCase();

  // Lecture completed
  if (
    normalizedType.includes("complete") ||
    normalizedType.includes("completed") ||
    normalizedType.includes("lecture_complete") ||
    normalizedType.includes("lecture_completed")
  ) {
    return {
      icon: CheckCircle2,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    };
  }

  // Lecture started / learning started
  if (
    normalizedType.includes("start") ||
    normalizedType.includes("started") ||
    normalizedType.includes("begin") ||
    normalizedType.includes("resume")
  ) {
    return {
      icon: PlayCircle,
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-600",
    };
  }

  // Progress
  if (
    normalizedType.includes("progress") ||
    normalizedType.includes("watch") ||
    normalizedType.includes("lesson")
  ) {
    return {
      icon: TrendingUp,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    };
  }

  // Enrollment
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

  // Course completed
  if (
    normalizedType.includes("course_complete") ||
    normalizedType.includes("course_completed")
  ) {
    return {
      icon: GraduationCap,
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
    };
  }

  // Achievement
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

  // Default
  return {
    icon: BookOpen,
    iconBg: "bg-slate-100",
    iconColor: "text-slate-500",
  };
};

// =====================================================
// ACTIVITY TITLE
// =====================================================

const getActivityTitle = (activity) => {
  const type = String(
    activity?.type ||
      activity?.action ||
      ""
  ).toLowerCase();

  if (
    type.includes("lecture_completed") ||
    type.includes("lecture_complete")
  ) {
    return "Lecture completed";
  }

  if (
    type.includes("course_completed") ||
    type.includes("course_complete")
  ) {
    return "Course completed";
  }

  if (
    type.includes("enrolled") ||
    type.includes("enroll")
  ) {
    return "Course enrolled";
  }

  if (
    type.includes("started") ||
    type.includes("start")
  ) {
    return "Started learning";
  }

  if (
    type.includes("progress") ||
    type.includes("watch")
  ) {
    return "Learning progress updated";
  }

  if (
    type.includes("achievement") ||
    type.includes("award")
  ) {
    return "Achievement unlocked";
  }

  return (
    activity?.title ||
    activity?.action ||
    "Learning activity"
  );
};

// =====================================================
// ACTIVITY DESCRIPTION
// =====================================================

const getActivityDescription = (activity) => {
  if (!activity) {
    return "";
  }

  if (activity.description) {
    return activity.description;
  }

  const courseTitle =
    activity.courseTitle ||
    activity.course?.courseTitle ||
    activity.course?.title;

  const lectureTitle =
    activity.lectureTitle ||
    activity.lessonTitle ||
    activity.lecture?.title ||
    activity.lesson?.title;

  const type = String(
    activity.type ||
      activity.action ||
      ""
  ).toLowerCase();

  // Lecture completed
  if (
    type.includes("lecture_completed") ||
    type.includes("lecture_complete")
  ) {
    if (lectureTitle && courseTitle) {
      return `${lectureTitle} • ${courseTitle}`;
    }

    return lectureTitle || courseTitle || "";
  }

  // Course enrollment
  if (
    type.includes("enroll") ||
    type.includes("enrolled")
  ) {
    return courseTitle
      ? `You enrolled in ${courseTitle}`
      : "You enrolled in a new course";
  }

  // Course completed
  if (
    type.includes("course_completed") ||
    type.includes("course_complete")
  ) {
    return courseTitle
      ? `Congratulations on completing ${courseTitle}`
      : "You completed a course";
  }

  // Started learning
  if (
    type.includes("start") ||
    type.includes("started")
  ) {
    return lectureTitle
      ? `Started ${lectureTitle}`
      : courseTitle || "You started learning";
  }

  // Progress
  if (
    type.includes("progress") ||
    type.includes("watch")
  ) {
    if (lectureTitle) {
      return `Progress updated for ${lectureTitle}`;
    }

    return courseTitle
      ? `Progress updated for ${courseTitle}`
      : "Your learning progress was updated";
  }

  return (
    activity.courseTitle ||
    activity.lessonTitle ||
    activity.lectureTitle ||
    ""
  );
};

// =====================================================
// RELATIVE TIME
// =====================================================

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
    (now.getTime() - createdAt.getTime()) / 1000
  );

  if (differenceInSeconds < 0) {
    return "Just now";
  }

  if (differenceInSeconds < 60) {
    return "Just now";
  }

  const differenceInMinutes = Math.floor(
    differenceInSeconds / 60
  );

  if (differenceInMinutes < 60) {
    return `${differenceInMinutes} ${
      differenceInMinutes === 1
        ? "min"
        : "mins"
    } ago`;
  }

  const differenceInHours = Math.floor(
    differenceInMinutes / 60
  );

  if (differenceInHours < 24) {
    return `${differenceInHours} ${
      differenceInHours === 1
        ? "hour"
        : "hours"
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

  const differenceInWeeks = Math.floor(
    differenceInDays / 7
  );

  if (differenceInWeeks < 4) {
    return `${differenceInWeeks} ${
      differenceInWeeks === 1
        ? "week"
        : "weeks"
    } ago`;
  }

  return createdAt.toLocaleDateString(
    undefined,
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
};

// =====================================================
// ACTIVITY DATE
// =====================================================

const getActivityDate = (activity) => {
  return (
    activity?.createdAt ||
    activity?.timestamp ||
    activity?.date ||
    activity?.updatedAt ||
    null
  );
};

// =====================================================
// ACTIVITY NAVIGATION
// =====================================================

const getActivityPath = (activity) => {
  if (!activity) {
    return null;
  }

  const courseId =
    activity.courseId ||
    activity.course?._id ||
    activity.course;

  const lectureId =
    activity.lectureId ||
    activity.lecture?._id ||
    activity.lessonId ||
    activity.lesson?._id;

  /*
   * If your learning route is:
   * /courses/:courseId/learn
   *
   * then navigate to the course learning page.
   */

  if (courseId) {
    return `/courses/${courseId}/learn${
      lectureId
        ? `?lecture=${lectureId}`
        : ""
    }`;
  }

  return null;
};

// =====================================================
// ACTIVITY ITEM
// =====================================================

const ActivityItem = ({
  activity,
  index,
  onClick,
}) => {
  const type =
    activity?.type ||
    activity?.action ||
    activity?.title ||
    "";

  const style = getActivityStyle(type);

  const Icon = style.icon;

  const title =
    getActivityTitle(activity);

  const description =
    getActivityDescription(activity);

  const time = getRelativeTime(
    getActivityDate(activity)
  );

  const isClickable =
    Boolean(
      getActivityPath(activity)
    );

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!isClickable}
      className={`
        flex
        w-full
        items-center
        gap-4
        px-5
        py-4
        text-left
        transition
        sm:px-6
        ${
          isClickable
            ? "cursor-pointer hover:bg-slate-50"
            : "cursor-default"
        }
      `}
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

      {/* Content */}

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

      {/* Arrow */}

      {isClickable && (
        <ArrowRight
          size={15}
          className="hidden shrink-0 text-slate-300 sm:block"
        />
      )}
    </button>
  );
};

// =====================================================
// LOADING STATE
// =====================================================

const ActivityLoading = () => {
  return (
    <div className="divide-y divide-slate-100">
      {[1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="flex items-center gap-4 px-5 py-4 sm:px-6"
        >
          {/* Icon skeleton */}

          <div className="h-10 w-10 shrink-0 animate-pulse rounded-xl bg-slate-100" />

          {/* Text skeleton */}

          <div className="min-w-0 flex-1">
            <div className="h-4 w-40 animate-pulse rounded bg-slate-100" />

            <div className="mt-2 h-3 w-56 animate-pulse rounded bg-slate-100" />
          </div>

          {/* Time skeleton */}

          <div className="h-3 w-14 animate-pulse rounded bg-slate-100" />
        </div>
      ))}
    </div>
  );
};

// =====================================================
// EMPTY STATE
// =====================================================

const EmptyActivity = () => {
  return (
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
        Your lessons, enrollments, progress,
        and achievements will appear here.
      </p>
    </div>
  );
};

// =====================================================
// MAIN COMPONENT
// =====================================================

function RecentActivity({
  activities = [],
  loading = false,
  maxItems = 5,
}) {
  const navigate = useNavigate();

  /*
   * Make sure activities is always an array.
   */

  const safeActivities =
    Array.isArray(activities)
      ? activities
      : [];

  /*
   * Display only the latest activities.
   */

  const visibleActivities =
    safeActivities.slice(
      0,
      maxItems
    );

  // ===================================================
  // HANDLE ACTIVITY CLICK
  // ===================================================

  const handleActivityClick = (
    activity
  ) => {
    const path =
      getActivityPath(activity);

    if (!path) {
      return;
    }

    navigate(path);
  };

  // ===================================================
  // HANDLE VIEW ALL
  // ===================================================

  const handleViewAll = () => {
    /*
     * Change this route if you create
     * a dedicated activity page.
     */

    navigate("/dashboard/activity");
  };

  return (
    <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
        <div>
          <h2 className="text-base font-bold text-slate-900 sm:text-lg">
            Recent Activity
          </h2>

          <p className="mt-0.5 text-xs text-slate-400 sm:text-sm">
            Your latest learning activity
          </p>
        </div>

        {safeActivities.length > 0 && (
          <button
            type="button"
            onClick={handleViewAll}
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 transition hover:text-indigo-700 sm:text-sm"
          >
            View all
            <ArrowRight size={15} />
          </button>
        )}
      </div>

      {/* =================================================
          LOADING
      ================================================= */}

      {loading ? (
        <ActivityLoading />
      ) : visibleActivities.length === 0 ? (
        /* =================================================
           EMPTY
        ================================================= */

        <EmptyActivity />
      ) : (
        /* =================================================
           ACTIVITIES
        ================================================= */

        <div className="divide-y divide-slate-100">
          {visibleActivities.map(
            (activity, index) => (
              <ActivityItem
                key={
                  activity?._id ||
                  activity?.id ||
                  `${activity?.type || "activity"}-${
                    activity?.createdAt || index
                  }-${index}`
                }
                activity={activity}
                index={index}
                onClick={() =>
                  handleActivityClick(
                    activity
                  )
                }
              />
            )
          )}
        </div>
      )}

      {/* =================================================
          FOOTER
      ================================================= */}

      {!loading &&
        safeActivities.length >
          maxItems && (
          <div className="border-t border-slate-100 px-5 py-3 text-center sm:px-6">
            <button
              type="button"
              onClick={handleViewAll}
              className="text-xs font-semibold text-indigo-600 transition hover:text-indigo-700"
            >
              View{" "}
              {safeActivities.length -
                maxItems}{" "}
              more activities
            </button>
          </div>
        )}
    </section>
  );
}

export default RecentActivity;
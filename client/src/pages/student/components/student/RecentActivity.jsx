import {
  PlayCircle,
  CheckCircle2,
  BookOpen,
  Award,
  Clock3,
  ArrowRight,
  GraduationCap,
  TrendingUp,
  Flame,
  Swords,
  Trophy,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// =====================================================
// ACTIVITY STYLE
// =====================================================

const getActivityStyle = (type = "") => {
  const normalizedType = String(type).toLowerCase();

  if (
    normalizedType.includes("complete") ||
    normalizedType.includes("completed") ||
    normalizedType.includes("lecture_complete") ||
    normalizedType.includes("lecture_completed")
  ) {
    return {
      icon: CheckCircle2,
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-400",
      accent: "border-emerald-500/20",
    };
  }

  if (
    normalizedType.includes("start") ||
    normalizedType.includes("started") ||
    normalizedType.includes("begin") ||
    normalizedType.includes("resume")
  ) {
    return {
      icon: PlayCircle,
      iconBg: "bg-red-500/10",
      iconColor: "text-red-400",
      accent: "border-red-500/20",
    };
  }

  if (
    normalizedType.includes("progress") ||
    normalizedType.includes("watch") ||
    normalizedType.includes("lesson")
  ) {
    return {
      icon: TrendingUp,
      iconBg: "bg-orange-500/10",
      iconColor: "text-orange-400",
      accent: "border-orange-500/20",
    };
  }

  if (
    normalizedType.includes("enroll") ||
    normalizedType.includes("enrolled")
  ) {
    return {
      icon: BookOpen,
      iconBg: "bg-violet-500/10",
      iconColor: "text-violet-400",
      accent: "border-violet-500/20",
    };
  }

  if (
    normalizedType.includes("course_complete") ||
    normalizedType.includes("course_completed")
  ) {
    return {
      icon: GraduationCap,
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-400",
      accent: "border-amber-500/20",
    };
  }

  if (
    normalizedType.includes("achievement") ||
    normalizedType.includes("award")
  ) {
    return {
      icon: Award,
      iconBg: "bg-yellow-500/10",
      iconColor: "text-yellow-400",
      accent: "border-yellow-500/20",
    };
  }

  return {
    icon: BookOpen,
    iconBg: "bg-white/5",
    iconColor: "text-slate-400",
    accent: "border-white/10",
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

  if (
    type.includes("lecture_completed") ||
    type.includes("lecture_complete")
  ) {
    if (lectureTitle && courseTitle) {
      return `${lectureTitle} • ${courseTitle}`;
    }

    return lectureTitle || courseTitle || "";
  }

  if (
    type.includes("enroll") ||
    type.includes("enrolled")
  ) {
    return courseTitle
      ? `You enrolled in ${courseTitle}`
      : "You enrolled in a new course";
  }

  if (
    type.includes("course_completed") ||
    type.includes("course_complete")
  ) {
    return courseTitle
      ? `Congratulations on completing ${courseTitle}`
      : "You completed a course";
  }

  if (
    type.includes("start") ||
    type.includes("started")
  ) {
    return lectureTitle
      ? `Started ${lectureTitle}`
      : courseTitle || "You started learning";
  }

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

  const isClickable = Boolean(
    getActivityPath(activity)
  );

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!isClickable}
      className={`
        group/item
        relative
        flex
        w-full
        items-center
        gap-4
        overflow-hidden
        px-5
        py-4
        text-left
        transition-all
        duration-300
        sm:px-6

        ${
          isClickable
            ? `
              cursor-pointer
              hover:bg-white/[0.045]
              hover:pl-7
            `
            : "cursor-default"
        }
      `}
    >
      {/* =================================================
          LEFT TIMELINE
      ================================================= */}

      {index !== 0 && (
        <div
          className="
            absolute
            left-[39px]
            top-0
            h-4
            w-px
            bg-white/10
          "
        />
      )}

      {/* =================================================
          ICON
      ================================================= */}

      <div
        className={`
          relative
          z-10
          flex
          h-10
          w-10
          shrink-0
          items-center
          justify-center
          rounded-xl
          border
          ${style.accent}
          ${style.iconBg}
          transition-all
          duration-300
          group-hover/item:scale-110
          group-hover/item:rotate-[-3deg]
        `}
      >
        <Icon
          size={18}
          className={style.iconColor}
        />

        {/* Pulse */}

        {isClickable && (
          <span
            className="
              absolute
              inset-0
              rounded-xl
              border
              border-current
              opacity-0
              transition-all
              duration-500
              group-hover/item:scale-125
              group-hover/item:opacity-20
            "
          />
        )}
      </div>

      {/* =================================================
          CONTENT
      ================================================= */}

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p
            className="
              truncate
              text-sm
              font-bold
              text-slate-200
              transition-colors
              group-hover/item:text-white
            "
          >
            {title}
          </p>

          {index === 0 && (
            <span
              className="
                shrink-0
                rounded-full
                border
                border-red-500/20
                bg-red-500/10
                px-2
                py-0.5
                text-[8px]
                font-black
                uppercase
                tracking-wider
                text-red-400
              "
            >
              Latest
            </span>
          )}
        </div>

        {description && (
          <p
            className="
              mt-0.5
              truncate
              text-xs
              text-slate-500
            "
          >
            {description}
          </p>
        )}
      </div>

      {/* =================================================
          TIME
      ================================================= */}

      <div
        className="
          flex
          shrink-0
          items-center
          gap-1
          text-[10px]
          font-medium
          text-slate-600
        "
      >
        <Clock3 size={11} />

        <span className="hidden sm:inline">
          {time}
        </span>
      </div>

      {/* =================================================
          ARROW
      ================================================= */}

      {isClickable && (
        <ArrowRight
          size={15}
          className="
            hidden
            shrink-0
            text-slate-700
            transition-all
            duration-300
            group-hover/item:translate-x-1
            group-hover/item:text-red-400
            sm:block
          "
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
    <div className="divide-y divide-white/5">
      {[1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="
            flex
            items-center
            gap-4
            px-5
            py-4
            sm:px-6
          "
        >
          <div
            className="
              h-10
              w-10
              shrink-0
              animate-pulse
              rounded-xl
              bg-white/10
            "
          />

          <div className="min-w-0 flex-1">
            <div
              className="
                h-4
                w-40
                animate-pulse
                rounded
                bg-white/10
              "
            />

            <div
              className="
                mt-2
                h-3
                w-56
                animate-pulse
                rounded
                bg-white/5
              "
            />
          </div>

          <div
            className="
              h-3
              w-14
              animate-pulse
              rounded
              bg-white/10
            "
          />
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
    <div
      className="
        relative
        flex
        min-h-[250px]
        flex-col
        items-center
        justify-center
        overflow-hidden
        px-5
        py-10
        text-center
        sm:px-6
      "
    >
      {/* Background typography */}

      <div
        className="
          pointer-events-none
          absolute
          text-[100px]
          font-black
          uppercase
          tracking-tighter
          text-white/[0.02]
        "
      >
        FIGHT
      </div>

      <div
        className="
          relative
          flex
          h-14
          w-14
          items-center
          justify-center
          rounded-2xl
          border
          border-red-500/20
          bg-red-500/10
        "
      >
        <Swords
          size={24}
          className="text-red-400"
        />
      </div>

      <p
        className="
          mt-4
          text-sm
          font-bold
          text-slate-200
        "
      >
        No fights recorded
      </p>

      <p
        className="
          mt-1
          max-w-xs
          text-xs
          leading-5
          text-slate-500
        "
      >
        Start learning and build your record
        one lesson at a time.
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

  const safeActivities =
    Array.isArray(activities)
      ? activities
      : [];

  const visibleActivities =
    safeActivities.slice(
      0,
      maxItems
    );

  // ===================================================
  // CLICK
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
  // VIEW ALL
  // ===================================================

  const handleViewAll = () => {
    navigate(
      "/dashboard/activity"
    );
  };

  return (
    <section
      className="
        group
        relative
        min-w-0
        overflow-hidden
        rounded-[28px]
        border
        border-slate-800
        bg-[#08090d]
        shadow-xl
        shadow-slate-300/20
        transition-all
        duration-500
        hover:-translate-y-1
        hover:shadow-2xl
      "
    >
      {/* =================================================
          CINEMATIC BACKGROUND
      ================================================= */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Base */}

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-br
            from-[#08090d]
            via-[#151419]
            to-[#1c1111]
          "
        />

        {/* Red glow */}

        <div
          className="
            absolute
            -right-24
            -top-24
            h-72
            w-72
            rounded-full
            bg-red-700/10
            blur-[100px]
            transition-all
            duration-1000
            group-hover:scale-125
          "
        />

        {/* Orange glow */}

        <div
          className="
            absolute
            -bottom-32
            -left-20
            h-72
            w-72
            rounded-full
            bg-orange-600/5
            blur-[110px]
          "
        />

        {/* Grunge */}

        <div
          className="
            absolute
            inset-0
            opacity-[0.035]
            [background-image:radial-gradient(circle_at_20%_20%,white_0.7px,transparent_0.8px),radial-gradient(circle_at_80%_60%,white_0.6px,transparent_0.7px)]
            [background-size:18px_18px,25px_25px]
          "
        />

        {/* Giant background text */}

        <div
          className="
            absolute
            -right-8
            top-16
            rotate-90
            text-[80px]
            font-black
            uppercase
            tracking-[-0.08em]
            text-white/[0.018]
          "
        >
          CLUB
        </div>

        {/* Red light strip */}

        <div
          className="
            absolute
            right-[8%]
            top-0
            h-full
            w-px
            rotate-[12deg]
            bg-gradient-to-b
            from-transparent
            via-red-500/20
            to-transparent
          "
        />

        {/* Dust particles */}

        <div className="absolute left-[20%] top-[25%] h-1 w-1 animate-pulse rounded-full bg-red-400/40" />

        <div className="absolute right-[30%] top-[40%] h-1 w-1 animate-ping rounded-full bg-orange-400/30" />

        <div className="absolute right-[15%] bottom-[20%] h-1.5 w-1.5 animate-pulse rounded-full bg-red-500/30" />
      </div>

      {/* =================================================
          HEADER
      ================================================= */}

      <div
        className="
          relative
          z-10
          flex
          items-center
          justify-between
          border-b
          border-white/10
          px-5
          py-5
          sm:px-6
        "
      >
        <div className="flex items-center gap-3">
          <div
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              border
              border-red-500/20
              bg-red-500/10
              transition-all
              duration-300
              group-hover:rotate-[-5deg]
              group-hover:scale-105
            "
          >
            <Swords
              size={19}
              className="text-red-400"
            />
          </div>

          <div>
            <h2
              className="
                m-0
                text-base
                font-black
                uppercase
                tracking-tight
                text-white
                sm:text-lg
              "
            >
              Fight Record
            </h2>

            <p
              className="
                m-0
                mt-0.5
                text-xs
                text-slate-500
                sm:text-sm
              "
            >
              Your latest battles with learning
            </p>
          </div>
        </div>

        {/* Record badge */}

        <div
          className="
            hidden
            items-center
            gap-1.5
            rounded-full
            border
            border-red-500/20
            bg-red-500/10
            px-3
            py-1.5
            sm:flex
          "
        >
          <Flame
            size={13}
            className="text-red-400"
          />

          <span
            className="
              text-[10px]
              font-black
              uppercase
              tracking-[0.15em]
              text-red-400
            "
          >
            No Excuses
          </span>
        </div>

        {safeActivities.length > 0 && (
          <button
            type="button"
            onClick={handleViewAll}
            className="
              inline-flex
              items-center
              gap-1
              text-xs
              font-bold
              uppercase
              tracking-wide
              text-red-400
              transition
              hover:text-red-300
              sm:text-sm
            "
          >
            View all
            <ArrowRight size={15} />
          </button>
        )}
      </div>

      {/* =================================================
          RECORD SUMMARY
      ================================================= */}

      {!loading &&
        safeActivities.length > 0 && (
          <div
            className="
              relative
              z-10
              grid
              grid-cols-2
              gap-px
              border-b
              border-white/10
              bg-white/5
            "
          >
            <div className="bg-[#0b0c11]/90 px-5 py-4 sm:px-6">
              <div className="flex items-center gap-2">
                <Trophy
                  size={14}
                  className="text-amber-400"
                />

                <span
                  className="
                    text-[9px]
                    font-black
                    uppercase
                    tracking-[0.16em]
                    text-slate-600
                  "
                >
                  Battles
                </span>
              </div>

              <p
                className="
                  m-0
                  mt-1
                  text-xl
                  font-black
                  text-white
                "
              >
                {safeActivities.length}
              </p>
            </div>

            <div className="bg-[#0b0c11]/90 px-5 py-4 sm:px-6">
              <div className="flex items-center gap-2">
                <Flame
                  size={14}
                  className="text-red-400"
                />

                <span
                  className="
                    text-[9px]
                    font-black
                    uppercase
                    tracking-[0.16em]
                    text-slate-600
                  "
                >
                  Latest
                </span>
              </div>

              <p
                className="
                  m-0
                  mt-1
                  text-xl
                  font-black
                  text-white
                "
              >
                {visibleActivities.length}
              </p>
            </div>
          </div>
        )}

      {/* =================================================
          LOADING
      ================================================= */}

      {loading ? (
        <ActivityLoading />
      ) : visibleActivities.length === 0 ? (
        <EmptyActivity />
      ) : (
        <div className="relative z-10 divide-y divide-white/5">
          {visibleActivities.map(
            (activity, index) => (
              <ActivityItem
                key={
                  activity?._id ||
                  activity?.id ||
                  `${activity?.type || "activity"}-${
                    activity?.createdAt ||
                    index
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
          <div
            className="
              relative
              z-10
              border-t
              border-white/10
              px-5
              py-4
              text-center
              sm:px-6
            "
          >
            <button
              type="button"
              onClick={handleViewAll}
              className="
                inline-flex
                items-center
                gap-2
                text-xs
                font-black
                uppercase
                tracking-wider
                text-red-400
                transition
                hover:text-red-300
              "
            >
              View{" "}
              {safeActivities.length -
                maxItems}{" "}
              more battles

              <ArrowRight size={14} />
            </button>
          </div>
        )}

      {/* =================================================
          CINEMATIC RED LINE
      ================================================= */}

      <div
        className="
          absolute
          bottom-0
          left-0
          h-px
          w-full
          bg-gradient-to-r
          from-transparent
          via-red-600
          to-transparent
          opacity-70
        "
      />
    </section>
  );
}

export default RecentActivity;
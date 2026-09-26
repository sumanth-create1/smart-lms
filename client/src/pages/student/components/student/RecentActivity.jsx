import { memo, useMemo } from "react";
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
  Crown,
  Shield,
  Castle,
  Feather,
  Sparkles,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

/* =====================================================
   CONSTANTS
===================================================== */

const EMPTY_ARRAY = [];

const ACTIVITY_STYLES = {
  lectureCompleted: {
    icon: CheckCircle2,
    iconBg: "bg-emerald-500/[0.07]",
    iconColor: "text-emerald-400",
    accent: "border-emerald-500/20",
  },

  courseCompleted: {
    icon: GraduationCap,
    iconBg: "bg-amber-500/[0.07]",
    iconColor: "text-amber-400",
    accent: "border-amber-500/20",
  },

  started: {
    icon: PlayCircle,
    iconBg: "bg-sky-500/[0.07]",
    iconColor: "text-sky-400",
    accent: "border-sky-500/20",
  },

  progress: {
    icon: TrendingUp,
    iconBg: "bg-amber-500/[0.07]",
    iconColor: "text-amber-400",
    accent: "border-amber-500/20",
  },

  enrolled: {
    icon: BookOpen,
    iconBg: "bg-violet-500/[0.07]",
    iconColor: "text-violet-400",
    accent: "border-violet-500/20",
  },

  achievement: {
    icon: Award,
    iconBg: "bg-yellow-500/[0.07]",
    iconColor: "text-yellow-400",
    accent: "border-yellow-500/20",
  },

  default: {
    icon: BookOpen,
    iconBg: "bg-white/[0.04]",
    iconColor: "text-slate-400",
    accent: "border-white/10",
  },
};

/* =====================================================
   TYPE HELPERS
===================================================== */

const normalizeActivityType = (activity) =>
  String(
    activity?.type ||
      activity?.action ||
      activity?.title ||
      ""
  ).toLowerCase();

/* =====================================================
   ACTIVITY CATEGORY
===================================================== */

const getActivityCategory = (type) => {
  if (
    type.includes("course_completed") ||
    type.includes("course_complete")
  ) {
    return "courseCompleted";
  }

  if (
    type.includes("lecture_completed") ||
    type.includes("lecture_complete")
  ) {
    return "lectureCompleted";
  }

  if (
    type.includes("achievement") ||
    type.includes("award")
  ) {
    return "achievement";
  }

  if (
    type.includes("enrolled") ||
    type.includes("enroll")
  ) {
    return "enrolled";
  }

  if (
    type.includes("started") ||
    type.includes("start") ||
    type.includes("begin") ||
    type.includes("resume")
  ) {
    return "started";
  }

  if (
    type.includes("progress") ||
    type.includes("watch") ||
    type.includes("lesson")
  ) {
    return "progress";
  }

  return "default";
};

/* =====================================================
   ACTIVITY TITLE
===================================================== */

const getActivityTitle = (activity, type) => {
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

/* =====================================================
   ACTIVITY DESCRIPTION
===================================================== */

const getActivityDescription = (activity, type) => {
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
    return lectureTitle
      ? `Progress updated for ${lectureTitle}`
      : courseTitle
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

/* =====================================================
   ACTIVITY DATE
===================================================== */

const getActivityDate = (activity) =>
  activity?.createdAt ||
  activity?.timestamp ||
  activity?.date ||
  activity?.updatedAt ||
  null;

/* =====================================================
   RELATIVE TIME
===================================================== */

const getRelativeTime = (date) => {
  if (!date) {
    return "Recently";
  }

  const createdAt = new Date(date);
  const createdTime = createdAt.getTime();

  if (Number.isNaN(createdTime)) {
    return "Recently";
  }

  const differenceInSeconds = Math.floor(
    (Date.now() - createdTime) / 1000
  );

  if (differenceInSeconds < 60) {
    return "Just now";
  }

  const differenceInMinutes = Math.floor(
    differenceInSeconds / 60
  );

  if (differenceInMinutes < 60) {
    return `${differenceInMinutes} ${
      differenceInMinutes === 1 ? "min" : "mins"
    } ago`;
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

  const differenceInWeeks = Math.floor(
    differenceInDays / 7
  );

  if (differenceInWeeks < 4) {
    return `${differenceInWeeks} ${
      differenceInWeeks === 1 ? "week" : "weeks"
    } ago`;
  }

  return createdAt.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

/* =====================================================
   ACTIVITY NAVIGATION
===================================================== */

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

  if (!courseId) {
    return null;
  }

  return `/courses/${courseId}/learn${
    lectureId ? `?lecture=${lectureId}` : ""
  }`;
};

/* =====================================================
   ACTIVITY PROCESSOR
===================================================== */

const processActivity = (activity) => {
  const type = normalizeActivityType(activity);
  const category = getActivityCategory(type);

  return {
    activity,
    type,
    style: ACTIVITY_STYLES[category],
    title: getActivityTitle(activity, type),
    description: getActivityDescription(activity, type),
    time: getRelativeTime(getActivityDate(activity)),
    path: getActivityPath(activity),
  };
};

/* =====================================================
   ACTIVITY ITEM
===================================================== */

const ActivityItem = memo(function ActivityItem({
  item,
  index,
  onClick,
}) {
  const {
    activity,
    style,
    title,
    description,
    time,
    path,
  } = item;

  const Icon = style.icon;
  const isClickable = Boolean(path);

  return (
    <button
      type="button"
      onClick={() => {
        if (isClickable) {
          onClick(path);
        }
      }}
      disabled={!isClickable}
      aria-label={
        isClickable
          ? `Open ${title}`
          : title
      }
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
        transition-[background-color,padding]
        duration-300
        sm:px-6

        ${
          isClickable
            ? `
              cursor-pointer
              hover:bg-white/[0.035]
              hover:pl-7
            `
            : "cursor-default"
        }
      `}
    >
      {/* Timeline */}
      {index !== 0 && (
        <div
          aria-hidden="true"
          className="
            absolute
            left-[39px]
            top-0
            h-4
            w-px
            bg-gradient-to-b
            from-amber-500/20
            to-transparent
          "
        />
      )}

      {/* Icon */}
      <div
        aria-hidden="true"
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
          shadow-[0_0_20px_rgba(0,0,0,0.2)]
          transition-transform
          duration-300
          group-hover/item:scale-110
          group-hover/item:rotate-[-3deg]
        `}
      >
        <Icon
          size={18}
          className={style.iconColor}
        />

        {isClickable && (
          <span
            className="
              absolute
              inset-0
              rounded-xl
              border
              border-transparent
              opacity-0
              transition-[transform,opacity,border-color]
              duration-500
              group-hover/item:scale-125
              group-hover/item:border-amber-400/30
              group-hover/item:opacity-100
            "
          />
        )}

        <span
          className="
            absolute
            -right-0.5
            -top-0.5
            h-1.5
            w-1.5
            rounded-full
            bg-amber-400/40
            shadow-[0_0_7px_rgba(245,158,11,0.5)]
          "
        />
      </div>

      {/* Content */}
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
                border-amber-500/20
                bg-amber-500/[0.06]
                px-2
                py-0.5
                text-[8px]
                font-black
                uppercase
                tracking-wider
                text-amber-400
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
              transition-colors
              group-hover/item:text-slate-400
            "
          >
            {description}
          </p>
        )}
      </div>

      {/* Time */}
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

      {/* Arrow */}
      {isClickable && (
        <ArrowRight
          aria-hidden="true"
          size={15}
          className="
            hidden
            shrink-0
            text-slate-700
            transition-[transform,color]
            duration-300
            group-hover/item:translate-x-1
            group-hover/item:text-amber-400
            sm:block
          "
        />
      )}
    </button>
  );
});

/* =====================================================
   LOADING
===================================================== */

const ActivityLoading = memo(function ActivityLoading() {
  return (
    <div className="relative divide-y divide-white/[0.05]">
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
              border
              border-slate-700/30
              bg-slate-700/20
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
                bg-white/[0.05]
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
});

/* =====================================================
   EMPTY STATE
===================================================== */

const EmptyActivity = memo(function EmptyActivity() {
  return (
    <div
      className="
        relative
        flex
        min-h-[270px]
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
      {/* Atmospheric background */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
        "
      >
        <div
          className="
            absolute
            right-[12%]
            top-[12%]
            h-16
            w-16
            rounded-full
            bg-slate-200/[0.025]
            shadow-[0_0_50px_rgba(186,230,253,0.05)]
            animate-[moonPulse_7s_ease-in-out_infinite]
          "
        />

        <Castle
          size={105}
          className="
            absolute
            bottom-[-25px]
            left-1/2
            -translate-x-1/2
            text-slate-300/[0.025]
          "
        />

        <div
          className="
            absolute
            bottom-0
            left-0
            h-16
            w-full
            bg-gradient-to-t
            from-slate-300/[0.025]
            to-transparent
          "
        />

        <span
          className="
            absolute
            left-[18%]
            top-[20%]
            h-1
            w-1
            rounded-full
            bg-white/30
            animate-[snowFall_8s_linear_infinite]
          "
        />

        <span
          className="
            absolute
            right-[25%]
            top-[15%]
            h-1
            w-1
            rounded-full
            bg-sky-100/30
            animate-[snowFall_10s_linear_infinite_1s]
          "
        />
      </div>

      {/* Decorative icons */}
      <Flame
        aria-hidden="true"
        size={19}
        className="
          absolute
          left-8
          top-8
          animate-[flameFlicker_1.8s_ease-in-out_infinite]
          text-amber-500/20
        "
      />

      <Sword
        aria-hidden="true"
        size={22}
        className="
          absolute
          bottom-10
          right-8
          rotate-[-20deg]
          animate-[swordFloat_4s_ease-in-out_infinite]
          text-slate-300/20
        "
      />

      <Feather
        aria-hidden="true"
        size={18}
        className="
          absolute
          bottom-16
          left-16
          animate-[featherFloat_6s_ease-in-out_infinite]
          text-sky-300/15
        "
      />

      <Sparkles
        aria-hidden="true"
        size={15}
        className="
          absolute
          right-20
          top-16
          animate-pulse
          text-amber-400/20
        "
      />

      {/* Shield */}
      <div
        aria-hidden="true"
        className="
          relative
          flex
          h-14
          w-14
          animate-[floatIcon_4s_ease-in-out_infinite]
          items-center
          justify-center
          rounded-2xl
          border
          border-amber-500/20
          bg-amber-500/[0.06]
          shadow-[0_0_35px_rgba(245,158,11,0.07)]
        "
      >
        <Shield
          size={25}
          className="
            text-amber-400
            drop-shadow-[0_0_9px_rgba(245,158,11,0.5)]
          "
        />

        <div
          className="
            absolute
            inset-0
            animate-ping
            rounded-2xl
            border
            border-amber-400/[0.07]
          "
        />
      </div>

      <p
        className="
          mt-4
          text-sm
          font-black
          uppercase
          tracking-wide
          text-slate-200
        "
      >
        The chronicle is empty
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
        Begin your training and every lesson,
        victory, and achievement will be recorded
        in your realm chronicle.
      </p>
    </div>
  );
});

/* =====================================================
   MAIN COMPONENT
===================================================== */

function RecentActivity({
  activities = EMPTY_ARRAY,
  loading = false,
  maxItems = 5,
}) {
  const navigate = useNavigate();

  /*
   * Process activities once.
   *
   * This prevents repeated calls to:
   * - getActivityStyle
   * - getActivityTitle
   * - getActivityDescription
   * - getActivityDate
   * - getRelativeTime
   * - getActivityPath
   */
  const processedActivities = useMemo(() => {
    if (!Array.isArray(activities)) {
      return EMPTY_ARRAY;
    }

    return activities
      .slice(0, Math.max(0, maxItems))
      .map(processActivity);
  }, [activities, maxItems]);

  const totalActivities = Array.isArray(activities)
    ? activities.length
    : 0;

  const hasActivities = totalActivities > 0;

  /*
   * One navigation function instead of creating a
   * new closure for every ActivityItem.
   */
  const handleActivityClick = (path) => {
    if (path) {
      navigate(path);
    }
  };

  const handleViewAll = () => {
    navigate("/dashboard/activity");
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
        border-slate-700/50
        bg-[#080b0e]
        shadow-2xl
        shadow-black/60
        transition-[transform,border-color,box-shadow]
        duration-500
        hover:-translate-y-1
        hover:border-amber-700/40
        hover:shadow-[0_30px_90px_rgba(0,0,0,0.65)]
      "
    >
      {/* =================================================
          REALM BACKGROUND
      ================================================= */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          overflow-hidden
        "
      >
        {/* Base */}
        <div
          className="
            absolute
            inset-0
            bg-gradient-to-br
            from-[#06090b]
            via-[#11171b]
            to-[#0b0e10]
          "
        />

        {/* Moon */}
        <div
          className="
            absolute
            right-[7%]
            top-[5%]
            h-24
            w-24
            rounded-full
            bg-slate-100/[0.025]
            shadow-[0_0_80px_rgba(186,230,253,0.05)]
            animate-[moonPulse_8s_ease-in-out_infinite]
          "
        />

        {/* Icy glow */}
        <div
          className="
            absolute
            -right-24
            -top-24
            h-80
            w-80
            rounded-full
            bg-sky-800/[0.08]
            blur-[110px]
            transition-transform
            duration-1000
            group-hover:scale-125
          "
        />

        {/* Torch glow */}
        <div
          className="
            absolute
            -bottom-28
            -left-24
            h-80
            w-80
            rounded-full
            bg-amber-700/[0.07]
            blur-[100px]
            transition-transform
            duration-1000
            group-hover:scale-125
          "
        />

        {/* Castle silhouette */}
        <div
          className="
            absolute
            bottom-0
            left-0
            h-24
            w-full
            opacity-30
          "
        >
          <Castle
            aria-hidden="true"
            size={105}
            className="
              absolute
              bottom-[-28px]
              left-[8%]
              text-slate-300/[0.035]
            "
          />

          <Castle
            aria-hidden="true"
            size={80}
            className="
              absolute
              bottom-[-18px]
              right-[12%]
              text-slate-300/[0.025]
            "
          />
        </div>

        {/* Mountains */}
        <div
          className="
            absolute
            bottom-0
            left-0
            h-20
            w-full
            bg-gradient-to-t
            from-slate-300/[0.025]
            to-transparent
          "
        />

        {/* Stone texture */}
        <div
          className="
            absolute
            inset-0
            opacity-[0.045]
            [background-image:linear-gradient(135deg,transparent_45%,white_46%,transparent_47%),linear-gradient(45deg,transparent_45%,white_46%,transparent_47%)]
            [background-size:26px_26px]
          "
        />

        {/* Vertical stone seam */}
        <div
          className="
            absolute
            right-[9%]
            top-0
            h-full
            w-px
            rotate-[8deg]
            bg-gradient-to-b
            from-transparent
            via-slate-300/[0.06]
            to-transparent
          "
        />

        {/* Fog */}
        <div
          className="
            absolute
            bottom-0
            left-[-20%]
            h-20
            w-[140%]
            rounded-[50%]
            bg-slate-200/[0.025]
            blur-3xl
            animate-[fogDrift_14s_ease-in-out_infinite]
          "
        />

        {/* Snow - reduced to 4 */}
        <span
          className="
            absolute
            left-[10%]
            top-[18%]
            h-1
            w-1
            rounded-full
            bg-white/30
            animate-[snowFall_9s_linear_infinite]
          "
        />

        <span
          className="
            absolute
            left-[25%]
            top-[12%]
            h-1.5
            w-1.5
            rounded-full
            bg-sky-100/25
            animate-[snowFall_11s_linear_infinite_1s]
          "
        />

        <span
          className="
            absolute
            right-[28%]
            top-[10%]
            h-1
            w-1
            rounded-full
            bg-sky-100/25
            animate-[snowFall_10s_linear_infinite_1.5s]
          "
        />

        <span
          className="
            absolute
            right-[13%]
            top-[28%]
            h-1.5
            w-1.5
            rounded-full
            bg-white/25
            animate-[snowFall_12s_linear_infinite_3s]
          "
        />

        {/* Embers - reduced to 2 */}
        <span
          className="
            absolute
            left-[15%]
            bottom-[18%]
            h-1
            w-1
            rounded-full
            bg-amber-400/50
            animate-[emberFloat_5s_ease-in-out_infinite]
          "
        />

        <span
          className="
            absolute
            right-[20%]
            bottom-[20%]
            h-1
            w-1
            rounded-full
            bg-orange-400/50
            animate-[emberFloat_7s_ease-in-out_infinite_2s]
          "
        />

        {/* Light sweep */}
        <div
          className="
            absolute
            left-[-30%]
            top-0
            h-full
            w-[22%]
            -skew-x-12
            bg-gradient-to-r
            from-transparent
            via-amber-300/[0.025]
            to-transparent
            transition-[left]
            duration-[1800ms]
            group-hover:left-[120%]
          "
        />
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
          border-white/[0.07]
          px-5
          py-5
          sm:px-6
        "
      >
        <div className="flex items-center gap-3">
          <div
            aria-hidden="true"
            className="
              relative
              flex
              h-10
              w-10
              animate-[iconFloat_4s_ease-in-out_infinite]
              items-center
              justify-center
              rounded-xl
              border
              border-amber-500/20
              bg-amber-500/[0.06]
              shadow-[0_0_25px_rgba(245,158,11,0.06)]
              transition-transform
              duration-300
              group-hover:rotate-[-5deg]
              group-hover:scale-105
            "
          >
            <Swords
              size={19}
              className="
                text-amber-400
                drop-shadow-[0_0_7px_rgba(245,158,11,0.6)]
              "
            />

            <span
              className="
                absolute
                -right-1
                -top-1
                h-1.5
                w-1.5
                rounded-full
                bg-sky-300/70
                shadow-[0_0_8px_rgba(125,211,252,0.7)]
              "
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
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
                Realm Chronicle
              </h2>

              <Crown
                aria-hidden="true"
                size={13}
                className="
                  hidden
                  animate-[crownFloat_3s_ease-in-out_infinite]
                  text-amber-400/60
                  sm:block
                "
              />
            </div>

            <p
              className="
                m-0
                mt-0.5
                text-xs
                text-slate-500
                sm:text-sm
              "
            >
              Your latest victories and journeys
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Realm badge */}
          <div
            className="
              hidden
              items-center
              gap-1.5
              rounded-full
              border
              border-amber-500/20
              bg-amber-500/[0.06]
              px-3
              py-1.5
              sm:flex
            "
          >
            <Flame
              aria-hidden="true"
              size={13}
              className="
                animate-[flameFlicker_1.4s_ease-in-out_infinite]
                text-amber-400
                drop-shadow-[0_0_6px_rgba(245,158,11,0.7)]
              "
            />

            <span
              className="
                text-[10px]
                font-black
                uppercase
                tracking-[0.15em]
                text-amber-400
              "
            >
              Realm Active
            </span>
          </div>

          {/* View all */}
          {hasActivities && (
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
                text-amber-400
                transition-colors
                hover:text-amber-300
                sm:text-sm
              "
            >
              View all
              <ArrowRight size={15} />
            </button>
          )}
        </div>
      </div>

      {/* =================================================
          RECORD SUMMARY
      ================================================= */}

      {!loading && hasActivities && (
        <div
          className="
            relative
            z-10
            grid
            grid-cols-2
            gap-px
            border-b
            border-white/[0.07]
            bg-white/[0.025]
          "
        >
          <div
            className="
              bg-[#0a0d10]/90
              px-5
              py-4
              sm:px-6
            "
          >
            <div className="flex items-center gap-2">
              <Trophy
                aria-hidden="true"
                size={14}
                className="
                  text-amber-400
                  drop-shadow-[0_0_6px_rgba(245,158,11,0.4)]
                "
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
                Recorded Battles
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
              {totalActivities}
            </p>
          </div>

          <div
            className="
              bg-[#0a0d10]/90
              px-5
              py-4
              sm:px-6
            "
          >
            <div className="flex items-center gap-2">
              <Flame
                aria-hidden="true"
                size={14}
                className="
                  text-sky-400
                  drop-shadow-[0_0_6px_rgba(56,189,248,0.4)]
                "
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
                Latest Chronicle
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
              {processedActivities.length}
            </p>
          </div>
        </div>
      )}

      {/* =================================================
          CONTENT
      ================================================= */}

      {loading ? (
        <ActivityLoading />
      ) : processedActivities.length === 0 ? (
        <EmptyActivity />
      ) : (
        <div
          className="
            relative
            z-10
            divide-y
            divide-white/[0.05]
          "
        >
          {processedActivities.map((item, index) => (
            <ActivityItem
              key={
                item.activity?._id ||
                item.activity?.id ||
                `${item.type}-${getActivityDate(item.activity) || index}`
              }
              item={item}
              index={index}
              onClick={handleActivityClick}
            />
          ))}
        </div>
      )}

      {/* =================================================
          FOOTER
      ================================================= */}

      {!loading &&
        totalActivities > maxItems && (
          <div
            className="
              relative
              z-10
              border-t
              border-white/[0.07]
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
                text-amber-400
                transition-colors
                hover:text-amber-300
              "
            >
              View {totalActivities - maxItems} more battles
              <ArrowRight size={14} />
            </button>
          </div>
        )}

      {/* Realm footer */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          bottom-0
          left-0
          h-px
          w-full
          bg-gradient-to-r
          from-transparent
          via-amber-700
          to-transparent
          opacity-70
        "
      />

      {/* Scanner */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          bottom-0
          left-[-20%]
          h-px
          w-[20%]
          bg-amber-300
          shadow-[0_0_12px_rgba(245,158,11,0.8)]
          transition-[left]
          duration-[1600ms]
          group-hover:left-[100%]
        "
      />

      {/* =================================================
          ANIMATIONS
      ================================================= */}

      <style>{`
        @keyframes iconFloat {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }

          50% {
            transform: translateY(-4px) rotate(1deg);
          }
        }

        @keyframes floatIcon {
          0%, 100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-7px);
          }
        }

        @keyframes swordFloat {
          0%, 100% {
            transform: translateY(0) rotate(-20deg);
          }

          50% {
            transform: translateY(-5px) rotate(-12deg);
          }
        }

        @keyframes crownFloat {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }

          50% {
            transform: translateY(-5px) rotate(3deg);
          }
        }

        @keyframes flameFlicker {
          0%, 100% {
            transform: scale(1) rotate(-2deg);
            opacity: .8;
          }

          25% {
            transform: scale(1.08) rotate(2deg);
            opacity: 1;
          }

          50% {
            transform: scale(.94) rotate(-3deg);
            opacity: .7;
          }

          75% {
            transform: scale(1.05) rotate(3deg);
            opacity: .95;
          }
        }

        @keyframes emberFloat {
          0% {
            transform: translate3d(0, 0, 0);
            opacity: 0;
          }

          20% {
            opacity: .7;
          }

          50% {
            transform: translate3d(8px, -25px, 0);
            opacity: .5;
          }

          80% {
            opacity: .3;
          }

          100% {
            transform: translate3d(-5px, -55px, 0);
            opacity: 0;
          }
        }

        @keyframes snowFall {
          0% {
            transform: translate3d(0, -20px, 0);
            opacity: 0;
          }

          15% {
            opacity: .7;
          }

          50% {
            transform: translate3d(12px, 80px, 0);
            opacity: .5;
          }

          100% {
            transform: translate3d(-8px, 180px, 0);
            opacity: 0;
          }
        }

        @keyframes fogDrift {
          0%, 100% {
            transform: translate3d(-5%, 0, 0);
            opacity: .25;
          }

          50% {
            transform: translate3d(5%, 0, 0);
            opacity: .55;
          }
        }

        @keyframes moonPulse {
          0%, 100% {
            transform: scale(1);
            opacity: .65;
          }

          50% {
            transform: scale(1.04);
            opacity: 1;
          }
        }

        @keyframes featherFloat {
          0%, 100% {
            transform: translateY(0) rotate(-10deg);
          }

          50% {
            transform: translateY(-10px) rotate(8deg);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>
    </section>
  );
}

export default RecentActivity;
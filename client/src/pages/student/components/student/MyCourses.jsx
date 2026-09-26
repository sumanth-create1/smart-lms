import {
  ArrowRight,
  BookOpen,
  Castle,
  CheckCircle2,
  Clock3,
  Crown,
  Feather,
  Play,
  Shield,
  Sparkles,
  Sword,
  Trophy,
} from "lucide-react";
import { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

/* =========================================================
   CONSTANTS
========================================================= */

const EMPTY_SNOW_COUNT = 8;
const BACKGROUND_SNOW_COUNT = 10;

/* =========================================================
   HELPERS
========================================================= */

const toNumber = (value, fallback = 0) => {
  const number = Number(value);

  return Number.isFinite(number) ? number : fallback;
};

const clampPercent = (value) =>
  Math.min(100, Math.max(0, Math.round(toNumber(value))));

/* =========================================================
   SNOW
   Fewer particles = much less animation/paint work.
========================================================= */

function SnowParticles({ count }) {
  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <span
          key={index}
          aria-hidden="true"
          className="
            absolute
            h-1
            w-1
            rounded-full
            bg-sky-100/20
            motion-safe:animate-[myCoursesSnow_linear_infinite]
          "
          style={{
            left: `${5 + ((index * 17) % 90)}%`,
            top: `${5 + ((index * 23) % 75)}%`,
            animationDuration: `${5 + (index % 4)}s`,
            animationDelay: `${index * 0.5}s`,
          }}
        />
      ))}
    </>
  );
}

/* =========================================================
   COURSE VISUAL
========================================================= */

function CourseVisual({
  thumbnail,
  title,
  level,
  isCompleted,
  index,
}) {
  return (
    <div
      className="
        relative
        h-36
        overflow-hidden
        rounded-2xl
        border
        border-[#302f2b]
        bg-[#111315]
        shadow-[0_15px_40px_rgba(0,0,0,0.35)]
      "
    >
      {thumbnail ? (
        <img
          src={thumbnail}
          alt={title}
          loading="lazy"
          decoding="async"
          className="
            h-full
            w-full
            object-cover
            opacity-75
            transition-[transform,opacity]
            duration-700
            will-change-transform
            group-hover:scale-105
            group-hover:opacity-95
          "
        />
      ) : (
        <>
          {/* Mountain background */}
          <div
            className="
              absolute
              inset-0
              bg-gradient-to-br
              from-[#15191c]
              via-[#101518]
              to-[#070809]
            "
          />

          {/* Mountains */}
          <div
            className="
              absolute
              bottom-0
              left-0
              h-16
              w-28
              rotate-[-18deg]
              bg-slate-500/10
            "
          />

          <div
            className="
              absolute
              bottom-0
              right-0
              h-20
              w-36
              rotate-[16deg]
              bg-slate-400/10
            "
          />

          {/* Moon */}
          <div
            className="
              absolute
              right-5
              top-4
              h-9
              w-9
              rounded-full
              bg-sky-100/10
              shadow-[0_0_25px_rgba(180,220,240,0.1)]
            "
          />

          {/* Castle */}
          <div
            className="
              absolute
              bottom-0
              left-1/2
              h-14
              w-24
              -translate-x-1/2
              bg-[#171a1c]
              opacity-80
            "
          >
            <div className="absolute -left-3 bottom-0 h-20 w-5 bg-[#171a1c]" />
            <div className="absolute -right-3 bottom-0 h-16 w-5 bg-[#171a1c]" />
            <div className="absolute bottom-0 left-1/2 h-24 w-5 -translate-x-1/2 bg-[#171a1c]" />
          </div>

          {/* Course icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-full
                border
                border-amber-400/25
                bg-black/60
                text-amber-300
                shadow-[0_0_35px_rgba(212,175,55,0.1)]
                backdrop-blur-sm
              "
            >
              <BookOpen size={23} />
            </div>
          </div>
        </>
      )}

      {/* Overlay */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          bg-gradient-to-t
          from-black/85
          via-black/20
          to-black/25
        "
      />

      {/* Quest number */}
      <div
        className="
          absolute
          bottom-3
          left-3
          flex
          items-center
          gap-1.5
          text-[9px]
          font-bold
          uppercase
          tracking-[0.25em]
          text-white/45
        "
      >
        <Sword size={10} />
        Quest {String(index + 1).padStart(2, "0")}
      </div>

      {/* Level */}
      <span
        className="
          absolute
          left-3
          top-3
          rounded-md
          border
          border-sky-200/10
          bg-black/60
          px-2
          py-1
          text-[9px]
          font-bold
          uppercase
          tracking-wider
          text-sky-100
          backdrop-blur-md
        "
      >
        {level}
      </span>

      {/* Completed */}
      {isCompleted && (
        <span
          className="
            absolute
            right-3
            top-3
            inline-flex
            items-center
            gap-1
            rounded-md
            border
            border-amber-400/30
            bg-black/70
            px-2
            py-1
            text-[9px]
            font-bold
            uppercase
            tracking-wider
            text-amber-300
            backdrop-blur-md
          "
        >
          <Trophy size={11} />
          Mastered
        </span>
      )}
    </div>
  );
}

/* =========================================================
   COURSE CARD
========================================================= */

const CourseCard = memo(function CourseCard({
  course,
  index,
  onOpen,
}) {
  const title =
    course.courseTitle ||
    course.title ||
    "Untitled Course";

  const instructor =
    course.instructor?.name ||
    "Smart LMS Instructor";

  const category =
    course.category ||
    "Course";

  const level =
    course.courseLevel ||
    "Beginner";

  const progress = clampPercent(course.progress);

  const completedLessons = Math.max(
    0,
    Math.floor(toNumber(course.completedLessons))
  );

  const totalLessons = Math.max(
    0,
    Math.floor(toNumber(course.totalLessons))
  );

  const thumbnail =
    course.courseThumbnail?.url ||
    course.thumbnail ||
    "";

  const isCompleted = progress >= 100;

  const statusText = isCompleted
    ? "Quest complete"
    : progress > 0
      ? "Journey underway"
      : "Awaiting your blade";

  return (
    <article
      className="
        group
        relative
        min-w-0
        p-5
        transition-colors
        duration-300
        hover:bg-white/[0.018]
        sm:p-6
      "
    >
      {/* Gold side line */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          left-0
          top-0
          h-full
          w-[2px]
          origin-top
          scale-y-0
          bg-gradient-to-b
          from-amber-300
          via-amber-500
          to-sky-400
          transition-transform
          duration-500
          group-hover:scale-y-100
        "
      />

      <CourseVisual
        thumbnail={thumbnail}
        title={title}
        level={level}
        isCompleted={isCompleted}
        index={index}
      />

      {/* Category */}
      <div className="mt-5 flex items-center gap-2">
        <span
          aria-hidden="true"
          className="
            h-px
            w-5
            bg-gradient-to-r
            from-amber-400
            to-sky-400
          "
        />

        <p
          className="
            text-[9px]
            font-black
            uppercase
            tracking-[0.25em]
            text-amber-300
          "
        >
          {category}
        </p>
      </div>

      {/* Title */}
      <h3
        title={title}
        className="
          mt-2
          line-clamp-1
          text-base
          font-black
          uppercase
          tracking-tight
          text-white
        "
      >
        {title}
      </h3>

      {/* Subtitle */}
      {course.subTitle && (
        <p
          className="
            mt-1
            line-clamp-1
            text-xs
            text-zinc-500
          "
        >
          {course.subTitle}
        </p>
      )}

      {/* Instructor */}
      <p className="mt-2 text-xs text-zinc-600">
        Guided by{" "}
        <span className="text-zinc-400">
          {instructor}
        </span>
      </p>

      {/* Progress */}
      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between">
          <span
            className="
              text-[10px]
              font-bold
              uppercase
              tracking-wider
              text-zinc-600
            "
          >
            Journey Progress
          </span>

          <span className="text-xs font-black text-amber-300">
            {progress}%
          </span>
        </div>

        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
          aria-label={`${title} progress`}
          className="
            relative
            h-1.5
            overflow-hidden
            rounded-full
            bg-[#292a27]
          "
        >
          <div
            className="
              h-full
              rounded-full
              bg-gradient-to-r
              from-sky-600
              via-sky-400
              to-amber-400
              shadow-[0_0_12px_rgba(125,211,252,0.2)]
              transition-[width]
              duration-700
              ease-out
            "
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      </div>

      {/* Meta */}
      <div
        className="
          mt-4
          flex
          items-center
          justify-between
          gap-3
          text-[10px]
          font-medium
          uppercase
          tracking-wider
          text-zinc-600
        "
      >
        <span>
          {completedLessons}/{totalLessons} lessons
        </span>

        <span className="inline-flex items-center gap-1">
          <Clock3 size={11} />
          {statusText}
        </span>
      </div>

      {/* Action */}
      <button
        type="button"
        onClick={() => onOpen(course)}
        className="
          group/btn
          mt-5
          flex
          w-full
          items-center
          justify-center
          gap-2
          rounded-xl
          border
          border-[#45423a]
          bg-[#121416]
          px-4
          py-3
          text-[10px]
          font-black
          uppercase
          tracking-[0.15em]
          text-zinc-300
          transition-[background-color,border-color,color,box-shadow,transform]
          duration-300
          hover:border-amber-400/60
          hover:bg-amber-400
          hover:text-black
          hover:shadow-[0_0_30px_rgba(212,175,55,0.12)]
          active:scale-[0.98]
        "
      >
        {isCompleted ? (
          <>
            <CheckCircle2
              size={14}
              className="transition-transform group-hover/btn:scale-110"
            />

            Review the Chronicle
          </>
        ) : (
          <>
            <Play
              size={13}
              fill="currentColor"
              className="transition-transform group-hover/btn:scale-110"
            />

            {progress > 0
              ? "Continue the Quest"
              : "Begin the Quest"}
          </>
        )}
      </button>
    </article>
  );
});

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyCourses({ onViewAll }) {
  return (
    <section
      className="
        relative
        min-w-0
        overflow-hidden
        rounded-[28px]
        border
        border-[#2a2925]
        bg-[#090b0d]
        shadow-[0_25px_80px_rgba(0,0,0,0.45)]
      "
    >
      {/* Background */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          overflow-hidden
        "
      >
        {/* Moon */}
        <div
          className="
            absolute
            right-10
            top-8
            h-24
            w-24
            rounded-full
            bg-[#d8e8ee]/10
            shadow-[0_0_50px_rgba(180,220,235,0.12)]
          "
        />

        <div
          className="
            absolute
            right-16
            top-14
            h-20
            w-20
            rounded-full
            bg-[#090b0d]
          "
        />

        {/* Static ambient gradients
            No expensive blur animation */}
        <div
          className="
            absolute
            inset-0
            bg-[radial-gradient(circle_at_0%_0%,rgba(14,165,233,0.07),transparent_30%),radial-gradient(circle_at_100%_100%,rgba(245,158,11,0.06),transparent_30%)]
          "
        />

        {/* Mountains */}
        <div
          className="
            absolute
            bottom-0
            left-0
            h-32
            w-full
            bg-gradient-to-t
            from-black
            via-[#111417]/90
            to-transparent
            opacity-90
          "
        />

        {/* Castle */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 opacity-20">
          <div className="relative h-20 w-40 bg-[#151719]">
            <div className="absolute -left-5 bottom-0 h-28 w-8 bg-[#151719]" />
            <div className="absolute -right-5 bottom-0 h-28 w-8 bg-[#151719]" />
            <div className="absolute left-1/2 top-0 h-32 w-10 -translate-x-1/2 bg-[#151719]" />

            <div className="absolute -left-5 top-0 h-3 w-8 bg-[#151719]" />
            <div className="absolute right-[-20px] top-0 h-3 w-8 bg-[#151719]" />
            <div className="absolute left-1/2 top-0 h-3 w-10 -translate-x-1/2 bg-[#151719]" />
          </div>
        </div>

        <SnowParticles count={EMPTY_SNOW_COUNT} />
      </div>

      {/* Header */}
      <div
        className="
          relative
          z-10
          flex
          items-center
          justify-between
          border-b
          border-[#292a27]
          px-5
          py-5
          sm:px-7
        "
      >
        <div>
          <div className="mb-1 flex items-center gap-2">
            <Feather
              size={14}
              className="text-sky-300"
            />

            <span
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-[0.3em]
                text-sky-300
              "
            >
              The Great Library
            </span>
          </div>

          <h2
            className="
              text-lg
              font-black
              uppercase
              tracking-tight
              text-white
              sm:text-xl
            "
          >
            My Courses
          </h2>

          <p className="mt-1 text-xs text-zinc-500 sm:text-sm">
            The knowledge within your realm
          </p>
        </div>

        <button
          type="button"
          onClick={onViewAll}
          className="
            group
            inline-flex
            items-center
            gap-2
            rounded-lg
            border
            border-[#444039]
            bg-[#121416]/80
            px-3
            py-2
            text-xs
            font-bold
            uppercase
            tracking-wider
            text-zinc-300
            transition-[background-color,border-color,color]
            hover:border-amber-500/50
            hover:bg-amber-500/10
            hover:text-amber-300
            sm:px-4
          "
        >
          View all

          <ArrowRight
            size={14}
            className="transition-transform group-hover:translate-x-1"
          />
        </button>
      </div>

      {/* Empty content */}
      <div
        className="
          relative
          z-10
          flex
          min-h-[320px]
          flex-col
          items-center
          justify-center
          px-5
          py-12
          text-center
        "
      >
        <div
          className="
            relative
            flex
            h-24
            w-24
            items-center
            justify-center
          "
        >
          <div
            className="
              absolute
              inset-0
              rounded-full
              border
              border-amber-400/10
              bg-amber-400/5
              shadow-[0_0_60px_rgba(212,175,55,0.08)]
            "
          />

          <div
            className="
              absolute
              inset-3
              rounded-full
              border
              border-sky-300/10
            "
          />

          <Shield
            size={38}
            strokeWidth={1.3}
            className="text-amber-300"
          />

          <Sparkles
            size={14}
            className="
              absolute
              right-0
              top-2
              motion-safe:animate-pulse
              text-sky-300
            "
          />
        </div>

        <h3
          className="
            mt-6
            text-xl
            font-black
            uppercase
            tracking-[0.08em]
            text-white
          "
        >
          No courses in your realm
        </h3>

        <p
          className="
            mt-2
            max-w-sm
            text-sm
            leading-6
            text-zinc-500
          "
        >
          The path awaits. Choose a course, sharpen your
          skills, and begin your journey toward mastery.
        </p>

        <button
          type="button"
          onClick={onViewAll}
          className="
            mt-6
            inline-flex
            items-center
            gap-2
            rounded-xl
            border
            border-amber-500/40
            bg-amber-500/10
            px-5
            py-3
            text-sm
            font-black
            uppercase
            tracking-wide
            text-amber-300
            shadow-[0_0_25px_rgba(212,175,55,0.08)]
            transition-[background-color,border-color,color,transform]
            hover:border-amber-400
            hover:bg-amber-400
            hover:text-black
            active:scale-[0.98]
          "
        >
          Enter the Library
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Bottom line */}
      <div
        aria-hidden="true"
        className="
          absolute
          bottom-0
          left-0
          h-px
          w-full
          bg-gradient-to-r
          from-transparent
          via-amber-400/40
          to-transparent
        "
      />
    </section>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

function MyCourses({ courses = [] }) {
  const navigate = useNavigate();

  const handleViewAll = useCallback(() => {
    navigate("/courses");
  }, [navigate]);

  const handleOpenCourse = useCallback(
    (course) => {
      if (!course?._id) {
        toast.error("Course information is unavailable.");
        return;
      }

      navigate(`/courses/${course._id}/learn`);
    },
    [navigate]
  );

  /* =======================================================
     EMPTY
  ======================================================= */

  if (!courses.length) {
    return <EmptyCourses onViewAll={handleViewAll} />;
  }

  /* =======================================================
     COURSES
  ======================================================= */

  return (
    <section
      className="
        relative
        min-w-0
        overflow-hidden
        rounded-[28px]
        border
        border-[#2a2925]
        bg-[#090b0d]
        shadow-[0_25px_80px_rgba(0,0,0,0.45)]
      "
    >
      {/* =================================================
          BACKGROUND
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
        {/* Ambient gradients
            Replaces expensive blurred circles */}
        <div
          className="
            absolute
            inset-0
            bg-[radial-gradient(circle_at_0%_0%,rgba(14,165,233,0.07),transparent_32%),radial-gradient(circle_at_100%_0%,rgba(245,158,11,0.06),transparent_32%)]
          "
        />

        {/* Moon */}
        <div
          className="
            absolute
            right-[12%]
            top-[-35px]
            h-32
            w-32
            rounded-full
            bg-slate-100/5
            shadow-[0_0_70px_rgba(200,220,230,0.08)]
          "
        />

        {/* Castle */}
        <div
          className="
            absolute
            bottom-0
            right-[8%]
            h-28
            w-44
            opacity-[0.08]
          "
        >
          <div className="absolute bottom-0 left-0 h-20 w-12 bg-slate-300" />
          <div className="absolute bottom-0 right-0 h-24 w-12 bg-slate-300" />
          <div className="absolute bottom-0 left-1/2 h-28 w-14 -translate-x-1/2 bg-slate-300" />

          <div className="absolute left-0 top-0 h-3 w-12 bg-slate-300" />
          <div className="absolute right-0 top-0 h-3 w-12 bg-slate-300" />
          <div className="absolute left-1/2 top-0 h-3 w-14 -translate-x-1/2 bg-slate-300" />
        </div>

        {/* Fog */}
        <div
          className="
            absolute
            bottom-0
            left-0
            h-20
            w-full
            bg-gradient-to-t
            from-slate-400/[0.04]
            to-transparent
          "
        />

        <SnowParticles count={BACKGROUND_SNOW_COUNT} />
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
          border-[#292a27]
          px-5
          py-5
          sm:px-7
        "
      >
        <div>
          <div className="mb-1 flex items-center gap-2">
            <Crown
              size={14}
              className="text-amber-300"
            />

            <span
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-[0.3em]
                text-amber-300
              "
            >
              Your Realm
            </span>
          </div>

          <h2
            className="
              text-lg
              font-black
              uppercase
              tracking-tight
              text-white
              sm:text-xl
            "
          >
            My Courses
          </h2>

          <p className="mt-1 text-xs text-zinc-500 sm:text-sm">
            Knowledge earned. Skills forged.
          </p>
        </div>

        <button
          type="button"
          onClick={handleViewAll}
          className="
            group
            inline-flex
            items-center
            gap-2
            rounded-lg
            border
            border-[#444039]
            bg-[#121416]/80
            px-3
            py-2
            text-xs
            font-bold
            uppercase
            tracking-wider
            text-zinc-300
            transition-[background-color,border-color,color]
            hover:border-amber-500/50
            hover:bg-amber-500/10
            hover:text-amber-300
            sm:px-4
          "
        >
          All courses

          <ArrowRight
            size={14}
            className="transition-transform group-hover:translate-x-1"
          />
        </button>
      </div>

      {/* =================================================
          COURSE GRID
      ================================================= */}

      <div
        className="
          relative
          z-10
          grid
          grid-cols-1
          divide-y
          divide-[#292a27]
          xl:grid-cols-3
          xl:divide-x
          xl:divide-y-0
        "
      >
        {courses.map((course, index) => (
          <CourseCard
            key={course._id || index}
            course={course}
            index={index}
            onOpen={handleOpenCourse}
          />
        ))}
      </div>

      {/* =================================================
          FOOTER
      ================================================= */}

      <div
        className="
          relative
          z-10
          flex
          items-center
          justify-center
          border-t
          border-[#292a27]
          bg-black/20
          px-5
          py-3
        "
      >
        <p
          className="
            flex
            items-center
            gap-2
            text-[9px]
            font-bold
            uppercase
            tracking-[0.3em]
            text-zinc-700
          "
        >
          <Castle size={11} />

          Learn • Master • Earn Your Place

          <Feather size={11} />
        </p>
      </div>
    </section>
  );
}

export default memo(MyCourses);


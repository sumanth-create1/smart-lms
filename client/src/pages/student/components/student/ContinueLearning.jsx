import {
  Play,
  Clock3,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Flame,
  GraduationCap,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// =====================================================
// CONTINUE LEARNING
// =====================================================

function ContinueLearning({ courses = [] }) {
  const navigate = useNavigate();

  const course = courses[0];

  // =====================================================
  // NAVIGATION
  // =====================================================

  const handleViewAll = () => {
    navigate("/courses");
  };

  const handleContinueCourse = () => {
    if (!course?._id) {
      toast.error("Course information is unavailable.");
      return;
    }

    navigate(`/courses/${course._id}/learn`);
  };

  // =====================================================
  // EMPTY STATE
  // =====================================================

  if (!course) {
    return (
      <section
        className="
          group
          relative
          min-w-0
          overflow-hidden
          rounded-[28px]
          border
          border-slate-200
          bg-gradient-to-br
          from-white
          via-white
          to-violet-50/50
          shadow-sm
          transition-all
          duration-300
          hover:shadow-lg
        "
      >
        {/* Background decoration */}

        <div
          className="
            pointer-events-none
            absolute
            -right-16
            -top-16
            h-44
            w-44
            rounded-full
            bg-violet-100/60
            blur-2xl
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -bottom-16
            left-1/3
            h-40
            w-40
            rounded-full
            bg-fuchsia-100/40
            blur-2xl
          "
        />

        {/* Header */}

        <div
          className="
            relative
            z-10
            flex
            items-center
            justify-between
            border-b
            border-slate-100
            px-5
            py-5
            sm:px-6
          "
        >
          <div>
            <div className="flex items-center gap-2">
              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-xl
                  bg-violet-50
                "
              >
                <GraduationCap
                  size={18}
                  className="text-violet-600"
                />
              </div>

              <h2
                className="
                  m-0
                  text-base
                  font-bold
                  text-slate-900
                  sm:text-lg
                "
              >
                Continue Learning
              </h2>
            </div>

            <p
              className="
                m-0
                mt-1
                pl-11
                text-xs
                text-slate-400
                sm:text-sm
              "
            >
              Pick up where you left off
            </p>
          </div>

          <button
            type="button"
            onClick={handleViewAll}
            className="
              inline-flex
              items-center
              gap-1
              rounded-lg
              px-2
              py-1.5
              text-xs
              font-bold
              text-violet-600
              transition-all
              hover:bg-violet-50
              sm:text-sm
            "
          >
            View all
            <ArrowRight size={15} />
          </button>
        </div>

        {/* Empty content */}

        <div
          className="
            relative
            z-10
            flex
            min-h-[280px]
            flex-col
            items-center
            justify-center
            px-5
            py-10
            text-center
          "
        >
          {/* Animated illustration */}

          <div className="relative">
            <div
              className="
                absolute
                inset-0
                rounded-full
                bg-violet-200/40
                blur-2xl
                animate-pulse
              "
            />

            <div
              className="
                relative
                flex
                h-20
                w-20
                items-center
                justify-center
                rounded-[26px]
                bg-gradient-to-br
                from-violet-100
                to-fuchsia-100
                text-4xl
                shadow-sm
                animate-[float_4s_ease-in-out_infinite]
              "
            >
              📚
            </div>

            <Sparkles
              size={16}
              className="
                absolute
                -right-4
                -top-2
                text-violet-400
                animate-pulse
              "
            />

            <Sparkles
              size={12}
              className="
                absolute
                -bottom-2
                -left-4
                text-fuchsia-400
                animate-pulse
              "
            />
          </div>

          <h3
            className="
              m-0
              mt-6
              text-lg
              font-extrabold
              text-slate-900
            "
          >
            Your learning journey starts here
          </h3>

          <p
            className="
              m-0
              mt-2
              max-w-sm
              text-sm
              leading-6
              text-slate-400
            "
          >
            Explore our courses, choose something you love,
            and start building your skills today.
          </p>

          <button
            type="button"
            onClick={handleViewAll}
            className="
              mt-6
              inline-flex
              items-center
              gap-2
              rounded-xl
              bg-gradient-to-r
              from-violet-600
              to-fuchsia-600
              px-5
              py-3
              text-sm
              font-bold
              text-white
              shadow-lg
              shadow-violet-200
              transition-all
              duration-300
              hover:-translate-y-1
              hover:shadow-xl
            "
          >
            Explore Courses
            <ArrowRight size={16} />
          </button>
        </div>

        <style>{`
          @keyframes float {
            0%,
            100% {
              transform: translateY(0);
            }

            50% {
              transform: translateY(-8px);
            }
          }
        `}</style>
      </section>
    );
  }

  // =====================================================
  // COURSE DATA
  // =====================================================

  const title =
    course.courseTitle ||
    course.title ||
    "Untitled Course";

  const instructor =
    course.instructor?.name ||
    "Smart LMS Instructor";

  const currentLesson =
    course.currentLesson?.lectureTitle ||
    course.currentLesson?.title ||
    "Start your first lesson";

  const completedLessons = Math.max(
    Number(course.completedLessons ?? 0),
    0
  );

  const totalLessons = Math.max(
    Number(course.totalLessons ?? 0),
    0
  );

  const progress = Math.min(
    Math.max(Number(course.progress ?? 0), 0),
    100
  );

  const watchedSeconds = Math.max(
    Number(
      course.currentLesson?.watchedSeconds ??
        course.watchedSeconds ??
        0
    ),
    0
  );

  const watchedMinutes = Math.floor(
    watchedSeconds / 60
  );

  const thumbnail =
    course.courseThumbnail?.url ||
    course.thumbnail ||
    "";

  const level =
    course.courseLevel ||
    "Beginner";

  const category =
    course.category ||
    "Course";

  const isCompleted = progress >= 100;

  // =====================================================
  // MOTIVATIONAL MESSAGE
  // =====================================================

  const getProgressMessage = () => {
    if (isCompleted) {
      return "Amazing! You've completed this course.";
    }

    if (progress >= 75) {
      return "You're almost there. Finish strong!";
    }

    if (progress >= 50) {
      return "You're halfway there. Keep the momentum!";
    }

    if (progress > 0) {
      return "Great start. Keep building your momentum!";
    }

    return "Ready to start your learning journey?";
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <section
      className="
        group
        relative
        min-w-0
        overflow-hidden
        rounded-[28px]
        border
        border-slate-200/80
        bg-white
        shadow-sm
        transition-all
        duration-500
        hover:-translate-y-1
        hover:shadow-xl
        hover:shadow-slate-200/50
      "
    >
      {/* =================================================
          BACKGROUND GLOW
      ================================================= */}

      <div
        className="
          pointer-events-none
          absolute
          -right-24
          -top-24
          h-64
          w-64
          rounded-full
          bg-violet-100/50
          blur-3xl
          transition-transform
          duration-1000
          group-hover:scale-125
        "
      />

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
          border-slate-100
          px-5
          py-5
          sm:px-6
        "
      >
        <div>
          <div className="flex items-center gap-2">
            <div
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                bg-gradient-to-br
                from-violet-100
                to-fuchsia-100
              "
            >
              <GraduationCap
                size={18}
                className="text-violet-600"
              />
            </div>

            <h2
              className="
                m-0
                text-base
                font-bold
                text-slate-900
                sm:text-lg
              "
            >
              Continue Learning
            </h2>
          </div>

          <p
            className="
              m-0
              mt-1
              pl-11
              text-xs
              text-slate-400
              sm:text-sm
            "
          >
            Pick up where you left off
          </p>
        </div>

        <button
          type="button"
          onClick={handleViewAll}
          className="
            inline-flex
            items-center
            gap-1
            rounded-lg
            px-2
            py-1.5
            text-xs
            font-bold
            text-violet-600
            transition-all
            hover:bg-violet-50
            sm:text-sm
          "
        >
          View all
          <ArrowRight size={15} />
        </button>
      </div>

      {/* =================================================
          COURSE CONTENT
      ================================================= */}

      <div className="relative z-10 p-5 sm:p-6">
        <div
          className="
            grid
            grid-cols-1
            gap-6
            xl:grid-cols-[280px_1fr]
          "
        >
          {/* =================================================
              THUMBNAIL
          ================================================= */}

          <div
            className="
              relative
              h-52
              w-full
              overflow-hidden
              rounded-3xl
              bg-gradient-to-br
              from-violet-600
              via-fuchsia-500
              to-orange-400
              shadow-lg
              shadow-violet-100
              sm:h-56
              xl:h-full
              xl:min-h-[330px]
            "
          >
            {thumbnail ? (
              <img
                src={thumbnail}
                alt={title}
                className="
                  h-full
                  w-full
                  object-cover
                  transition-transform
                  duration-700
                  group-hover:scale-105
                "
              />
            ) : (
              <>
                {/* Decorative circles */}

                <div
                  className="
                    absolute
                    -right-12
                    -top-12
                    h-40
                    w-40
                    rounded-full
                    bg-white/15
                  "
                />

                <div
                  className="
                    absolute
                    -bottom-14
                    -left-12
                    h-44
                    w-44
                    rounded-full
                    bg-white/10
                  "
                />

                {/* Illustration */}

                <div
                  className="
                    absolute
                    inset-0
                    flex
                    items-center
                    justify-center
                  "
                >
                  <div
                    className="
                      flex
                      h-28
                      w-28
                      items-center
                      justify-center
                      rounded-[32px]
                      bg-white/15
                      text-6xl
                      backdrop-blur-sm
                      animate-[float_4s_ease-in-out_infinite]
                    "
                  >
                    📖
                  </div>
                </div>
              </>
            )}

            {/* Image overlay */}

            <div
              className="
                absolute
                inset-0
                bg-gradient-to-t
                from-black/45
                via-transparent
                to-black/10
              "
            />

            {/* =================================================
                TOP BADGES
            ================================================= */}

            <div
              className="
                absolute
                left-3
                right-3
                top-3
                flex
                items-center
                justify-between
              "
            >
              <span
                className="
                  rounded-lg
                  border
                  border-white/20
                  bg-black/25
                  px-2.5
                  py-1.5
                  text-[10px]
                  font-bold
                  text-white
                  backdrop-blur-md
                "
              >
                {level}
              </span>

              <span
                className="
                  rounded-lg
                  border
                  border-white/20
                  bg-black/25
                  px-2.5
                  py-1.5
                  text-[10px]
                  font-bold
                  text-white
                  backdrop-blur-md
                "
              >
                {category}
              </span>
            </div>

            {/* =================================================
                PLAY BUTTON
            ================================================= */}

            <button
              type="button"
              onClick={handleContinueCourse}
              aria-label={
                isCompleted
                  ? "Review course"
                  : "Continue course"
              }
              className="
                absolute
                inset-0
                flex
                items-center
                justify-center
              "
            >
              {/* Pulse ring */}

              <div
                className="
                  absolute
                  h-20
                  w-20
                  rounded-full
                  border
                  border-white/30
                  animate-ping
                "
              />

              <div
                className="
                  relative
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-full
                  bg-white
                  shadow-2xl
                  transition-all
                  duration-300
                  group-hover:scale-110
                "
              >
                {isCompleted ? (
                  <CheckCircle2
                    size={27}
                    className="text-emerald-500"
                    strokeWidth={2.5}
                  />
                ) : (
                  <Play
                    size={25}
                    fill="currentColor"
                    className="
                      ml-1
                      text-violet-600
                    "
                  />
                )}
              </div>
            </button>

            {/* =================================================
                BOTTOM INFO
            ================================================= */}

            <div
              className="
                absolute
                bottom-4
                left-4
                right-4
                flex
                items-center
                justify-between
              "
            >
              <span
                className="
                  inline-flex
                  items-center
                  gap-1.5
                  rounded-lg
                  bg-black/30
                  px-2.5
                  py-1.5
                  text-[10px]
                  font-medium
                  text-white
                  backdrop-blur-md
                "
              >
                <Clock3 size={12} />

                {watchedMinutes > 0
                  ? `${watchedMinutes} min watched`
                  : "Not started"}
              </span>

              {progress > 0 && (
                <span
                  className="
                    rounded-lg
                    bg-white/90
                    px-2.5
                    py-1.5
                    text-[10px]
                    font-extrabold
                    text-violet-600
                    shadow-sm
                  "
                >
                  {progress}% complete
                </span>
              )}
            </div>
          </div>

          {/* =================================================
              COURSE DETAILS
          ================================================= */}

          <div className="flex min-w-0 flex-col">
            {/* Category */}

            <div className="flex items-center gap-2">
              <span
                className="
                  rounded-full
                  bg-violet-50
                  px-2.5
                  py-1
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-wider
                  text-violet-600
                "
              >
                {category}
              </span>

              {isCompleted && (
                <span
                  className="
                    inline-flex
                    items-center
                    gap-1
                    rounded-full
                    bg-emerald-50
                    px-2.5
                    py-1
                    text-[10px]
                    font-bold
                    text-emerald-600
                  "
                >
                  <CheckCircle2 size={11} />
                  Completed
                </span>
              )}
            </div>

            {/* Title */}

            <h3
              className="
                m-0
                mt-3
                line-clamp-2
                text-xl
                font-extrabold
                leading-tight
                tracking-tight
                text-slate-900
                sm:text-2xl
              "
              title={title}
            >
              {title}
            </h3>

            {/* Instructor */}

            <div
              className="
                mt-2
                flex
                items-center
                gap-2
                text-xs
                text-slate-400
              "
            >
              <div
                className="
                  flex
                  h-6
                  w-6
                  items-center
                  justify-center
                  rounded-full
                  bg-slate-100
                "
              >
                <GraduationCap
                  size={13}
                  className="text-slate-500"
                />
              </div>

              <span>
                Taught by{" "}
                <span className="font-semibold text-slate-600">
                  {instructor}
                </span>
              </span>
            </div>

            {/* =================================================
                CURRENT LESSON
            ================================================= */}

            <div
              className="
                relative
                mt-6
                overflow-hidden
                rounded-2xl
                border
                border-violet-100
                bg-gradient-to-br
                from-violet-50
                to-fuchsia-50/50
                p-4
              "
            >
              {/* Decorative glow */}

              <div
                className="
                  pointer-events-none
                  absolute
                  -right-6
                  -top-6
                  h-20
                  w-20
                  rounded-full
                  bg-violet-100
                  blur-xl
                "
              />

              <div className="relative z-10 flex items-start gap-3">
                <div
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-white
                    shadow-sm
                  "
                >
                  <BookOpen
                    size={18}
                    className="text-violet-600"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="
                        text-[10px]
                        font-bold
                        uppercase
                        tracking-wider
                        text-violet-500
                      "
                    >
                      Up next
                    </span>

                    <span className="h-1 w-1 rounded-full bg-violet-300" />

                    <span className="text-[10px] font-medium text-slate-400">
                      Current lesson
                    </span>
                  </div>

                  <p
                    className="
                      m-0
                      mt-1
                      line-clamp-2
                      text-sm
                      font-bold
                      leading-5
                      text-slate-800
                    "
                  >
                    {currentLesson}
                  </p>
                </div>

                <ChevronRight
                  size={17}
                  className="
                    mt-2
                    shrink-0
                    text-violet-300
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                  "
                />
              </div>
            </div>

            {/* =================================================
                PROGRESS
            ================================================= */}

            <div className="mt-6">
              <div className="mb-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-600">
                    Your progress
                  </span>

                  {progress > 0 && progress < 100 && (
                    <Flame
                      size={14}
                      className="text-orange-500 animate-pulse"
                    />
                  )}
                </div>

                <span
                  className="
                    text-sm
                    font-extrabold
                    text-violet-600
                  "
                >
                  {progress}%
                </span>
              </div>

              {/* Progress bar */}

              <div
                className="
                  relative
                  h-3
                  overflow-hidden
                  rounded-full
                  bg-slate-100
                "
              >
                <div
                  className="
                    relative
                    h-full
                    rounded-full
                    bg-gradient-to-r
                    from-violet-500
                    via-fuchsia-500
                    to-pink-500
                    shadow-[0_0_12px_rgba(168,85,247,0.3)]
                    transition-all
                    duration-1000
                  "
                  style={{
                    width: `${progress}%`,
                  }}
                >
                  {/* Moving shine */}

                  {progress > 0 && progress < 100 && (
                    <div
                      className="
                        absolute
                        inset-y-0
                        -left-8
                        w-8
                        bg-white/35
                        blur-sm
                        animate-[progressShine_2.5s_infinite]
                      "
                    />
                  )}
                </div>
              </div>

              {/* Progress details */}

              <div
                className="
                  mt-2.5
                  flex
                  flex-wrap
                  items-center
                  justify-between
                  gap-2
                "
              >
                <span className="text-[11px] font-medium text-slate-400">
                  {completedLessons} of {totalLessons} lessons
                </span>

                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400">
                  <Clock3 size={12} />

                  {watchedMinutes > 0
                    ? `${watchedMinutes} min watched`
                    : "Ready to begin"}
                </span>
              </div>
            </div>

            {/* =================================================
                MOTIVATION + BUTTON
            ================================================= */}

            <div
              className="
                mt-6
                flex
                flex-col
                gap-4
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >
              <div className="flex items-center gap-2">
                <div
                  className="
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-amber-50
                  "
                >
                  {isCompleted ? (
                    <Trophy
                      size={15}
                      className="text-amber-500"
                    />
                  ) : (
                    <Sparkles
                      size={15}
                      className="text-amber-500"
                    />
                  )}
                </div>

                <p
                  className="
                    m-0
                    text-xs
                    font-semibold
                    leading-5
                    text-slate-500
                  "
                >
                  {getProgressMessage()}
                </p>
              </div>

              {/* Continue button */}

              <button
                type="button"
                onClick={handleContinueCourse}
                className="
                  inline-flex
                  shrink-0
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-gradient-to-r
                  from-violet-600
                  to-fuchsia-600
                  px-5
                  py-3
                  text-sm
                  font-bold
                  text-white
                  shadow-lg
                  shadow-violet-200
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:shadow-xl
                  hover:shadow-violet-200
                  active:translate-y-0
                "
              >
                {isCompleted ? (
                  <>
                    <CheckCircle2 size={16} />
                    Review Course
                  </>
                ) : (
                  <>
                    <Play
                      size={15}
                      fill="currentColor"
                    />

                    {progress > 0
                      ? "Continue Learning"
                      : "Start Learning"}
                  </>
                )}

                <ArrowRight
                  size={15}
                  className="
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                  "
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          ANIMATION KEYFRAMES
      ===================================================== */}

      <style>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }

          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes progressShine {
          0% {
            left: -32px;
          }

          100% {
            left: 100%;
          }
        }
      `}</style>
    </section>
  );
}

export default ContinueLearning;
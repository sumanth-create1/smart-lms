import {
  ArrowRight,
  BookOpen,
  PlayCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function ContinueLearning({ courses = [] }) {
  const navigate = useNavigate();

  /* =================================================
     EMPTY STATE
  ================================================== */

  if (courses.length === 0) {
    return (
      <section
        className="
          w-full
          overflow-hidden
          rounded-2xl
          border
          border-slate-200
          bg-white
          p-6
          shadow-sm
          sm:p-7
        "
      >
        <div className="m-1">

          {/* Header */}

          <div className="flex items-center gap-4">

            <div
              className="
                flex
                h-12
                w-12
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-indigo-50
                text-indigo-600
              "
            >
              <BookOpen size={22} />
            </div>

            <div className="min-w-0">

              <h2 className="text-lg font-bold text-slate-900">
                Continue Learning
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Pick up where you left off
              </p>

            </div>

          </div>

          {/* Empty state */}

          <div
            className="
              mt-7
              rounded-2xl
              border
              border-dashed
              border-slate-200
              bg-slate-50/60
              px-6
              py-10
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
              <BookOpen
                size={28}
                className="text-slate-300"
              />
            </div>

            <p className="mt-4 text-sm font-bold text-slate-700">
              No courses yet
            </p>

            <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-slate-400">
              Enroll in a course to start learning and track your progress.
            </p>

            <button
              onClick={() => navigate("/courses")}
              className="
                mt-6
                rounded-xl
                bg-indigo-600
                px-6
                py-3
                text-sm
                font-bold
                text-white
                shadow-sm
                transition
                hover:bg-indigo-700
                hover:shadow-md
                active:scale-[0.98]
              "
            >
              Browse Courses
            </button>
          </div>

        </div>
      </section>
    );
  }

  /* =================================================
     FIND ACTIVE COURSE
  ================================================== */

  const activeCourse =
    courses.find(
      (course) =>
        course.progress > 0 &&
        course.progress < 100
    ) ||
    courses.find(
      (course) =>
        (course.progress ?? 0) < 100
    );

  /* =================================================
     ALL COURSES COMPLETED
  ================================================== */

  if (!activeCourse) {
    return (
      <section
        className="
          w-full
          overflow-hidden
          rounded-2xl
          border
          border-slate-200
          bg-white
          p-6
          shadow-sm
          sm:p-7
        "
      >
        <div className="m-1">

          {/* Header */}

          <div className="flex items-center gap-4">

            <div
              className="
                flex
                h-12
                w-12
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-emerald-50
                text-emerald-600
              "
            >
              <BookOpen size={22} />
            </div>

            <div>

              <h2 className="text-lg font-bold text-slate-900">
                Continue Learning
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Pick up where you left off
              </p>

            </div>

          </div>

          {/* Completed state */}

          <div
            className="
              mt-7
              rounded-2xl
              border
              border-emerald-100
              bg-emerald-50/60
              px-6
              py-9
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
                rounded-full
                bg-emerald-100
                text-xl
              "
            >
              🎉
            </div>

            <h3 className="mt-4 text-base font-bold text-emerald-700">
              All courses completed!
            </h3>

            <p className="mt-2 text-sm leading-6 text-emerald-600">
              Great job. Keep learning something new.
            </p>

            <button
              onClick={() => navigate("/courses")}
              className="
                mt-6
                rounded-xl
                bg-emerald-600
                px-6
                py-3
                text-sm
                font-bold
                text-white
                transition
                hover:bg-emerald-700
                active:scale-[0.98]
              "
            >
              Explore More Courses
            </button>

          </div>

        </div>
      </section>
    );
  }

  /* =================================================
     COURSE DATA
  ================================================== */

  const currentLesson = activeCourse.currentLesson;

  const progress = Math.min(
    Math.max(activeCourse.progress ?? 0, 0),
    100
  );

  const completedLessons =
    activeCourse.completedLessons ?? 0;

  const totalLessons =
    activeCourse.totalLessons ?? 0;

  /* =================================================
     NAVIGATION
  ================================================== */

  const handleContinue = () => {
    navigate(
      `/course/${activeCourse._id}/learn`
    );
  };

  /* =================================================
     MAIN COMPONENT
  ================================================== */

  return (
    <section
      className="
        w-full
        overflow-hidden
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-6
        shadow-sm
        transition
        hover:shadow-md
        sm:p-7
      "
    >
      <div className="m-1">

        {/* =================================================
            HEADER
        ================================================== */}

        <div className="flex items-center gap-4">

          <div
            className="
              flex
              h-12
              w-12
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-indigo-50
              text-indigo-600
            "
          >
            <PlayCircle size={22} />
          </div>

          <div className="min-w-0">

            <h2 className="text-lg font-bold text-slate-900">
              Continue Learning
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Pick up where you left off
            </p>

          </div>

        </div>

        {/* =================================================
            COURSE CARD
        ================================================== */}

        <div
          className="
            mt-7
            overflow-hidden
            rounded-2xl
            border
            border-slate-200
            bg-slate-50
          "
        >

          {/* =================================================
              THUMBNAIL
          ================================================== */}

          <div
            className="
              relative
              h-48
              overflow-hidden
              bg-slate-100
              sm:h-52
            "
          >

            {activeCourse.courseThumbnail ? (
              <img
                src={activeCourse.courseThumbnail}
                alt={activeCourse.courseTitle}
                className="
                  h-full
                  w-full
                  object-cover
                  transition
                  duration-500
                  hover:scale-[1.02]
                "
              />
            ) : (
              <div
                className="
                  flex
                  h-full
                  items-center
                  justify-center
                  bg-gradient-to-br
                  from-indigo-50
                  to-violet-50
                "
              >
                <BookOpen
                  size={46}
                  className="text-indigo-200"
                />
              </div>
            )}

            {/* Bottom progress */}

            <div
              className="
                absolute
                bottom-0
                left-0
                right-0
                h-1.5
                bg-black/10
              "
            >
              <div
                className="
                  h-full
                  bg-indigo-600
                  transition-all
                  duration-500
                "
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>

          </div>

          {/* =================================================
              COURSE INFORMATION
          ================================================== */}

          <div className="bg-white p-6 sm:p-7">

            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

              {/* Course information */}

              <div className="min-w-0">

                <p
                  className="
                    text-[11px]
                    font-bold
                    uppercase
                    tracking-[0.12em]
                    text-indigo-600
                  "
                >
                  {activeCourse.category || "Course"}
                </p>

                <h3
                  className="
                    mt-2
                    break-words
                    text-xl
                    font-bold
                    leading-tight
                    text-slate-900
                    sm:text-2xl
                  "
                >
                  {activeCourse.courseTitle}
                </h3>

                {currentLesson?.lectureTitle && (
                  <p className="mt-3 text-sm leading-6 text-slate-500">

                    Next lesson:

                    <span className="ml-1 font-semibold text-slate-700">
                      {currentLesson.lectureTitle}
                    </span>

                  </p>
                )}

              </div>

              {/* Percentage */}

              <div
                className="
                  shrink-0
                  rounded-xl
                  bg-indigo-50
                  px-3
                  py-2
                  text-sm
                  font-bold
                  text-indigo-600
                "
              >
                {progress}%
              </div>

            </div>

            {/* =================================================
                PROGRESS
            ================================================== */}

            <div className="mt-7">

              <div className="flex items-center justify-between gap-4">

                <span
                  className="
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wide
                    text-slate-400
                  "
                >
                  Course Progress
                </span>

                <span className="text-xs font-semibold text-slate-500">
                  {completedLessons}/{totalLessons} lessons
                </span>

              </div>

              <div
                className="
                  mt-3
                  h-2.5
                  w-full
                  overflow-hidden
                  rounded-full
                  bg-slate-100
                "
              >
                <div
                  className="
                    h-full
                    rounded-full
                    bg-gradient-to-r
                    from-indigo-500
                    to-violet-600
                    transition-all
                    duration-500
                  "
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>

            </div>

            {/* =================================================
                BUTTON
            ================================================== */}

            <button
              onClick={handleContinue}
              className="
                mt-7
                flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-indigo-600
                px-6
                py-3.5
                text-sm
                font-bold
                text-white
                shadow-sm
                transition-all
                hover:bg-indigo-700
                hover:shadow-md
                active:scale-[0.99]
              "
            >
              Continue Learning

              <ArrowRight size={17} />

            </button>

          </div>

        </div>

      </div>
    </section>
  );
}

export default ContinueLearning;
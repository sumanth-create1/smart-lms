import {
  ArrowRight,
  BookOpen,
  PlayCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function ContinueLearning({ courses = [] }) {
  const navigate = useNavigate();

  // ------------------------------------------
  // EMPTY STATE
  // ------------------------------------------

  if (courses.length === 0) {
    return (
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
            <BookOpen
              size={21}
              className="text-indigo-600"
            />
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Continue Learning
            </h2>

            <p className="text-sm text-gray-500">
              Pick up where you left off
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-dashed border-gray-200 p-8 text-center">
          <BookOpen
            size={34}
            className="mx-auto text-gray-300"
          />

          <p className="mt-3 font-semibold text-gray-600">
            No courses yet
          </p>

          <p className="mt-1 text-sm text-gray-400">
            Enroll in a course to start learning.
          </p>

          <button
            onClick={() => navigate("/courses")}
            className="mt-5 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Browse Courses
          </button>
        </div>
      </section>
    );
  }

  // ------------------------------------------
  // FIND COURSE TO CONTINUE
  // ------------------------------------------

  const activeCourse =
    courses.find(
      (course) =>
        course.progress > 0 &&
        course.progress < 100
    ) ||
    courses.find(
      (course) => course.progress < 100
    );

  // ------------------------------------------
  // ALL COURSES COMPLETED
  // ------------------------------------------

  if (!activeCourse) {
    return (
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50">
            <BookOpen
              size={21}
              className="text-green-600"
            />
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Continue Learning
            </h2>

            <p className="text-sm text-gray-500">
              Pick up where you left off
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-xl bg-green-50 p-6 text-center">
          <h3 className="font-bold text-green-700">
            🎉 All courses completed!
          </h3>

          <p className="mt-1 text-sm text-green-600">
            Great job. Keep learning something new.
          </p>

          <button
            onClick={() => navigate("/courses")}
            className="mt-4 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700"
          >
            Explore More Courses
          </button>
        </div>
      </section>
    );
  }

  const currentLesson = activeCourse.currentLesson;

  const progress = Math.min(
    Math.max(activeCourse.progress ?? 0, 0),
    100
  );

  // ------------------------------------------
  // NAVIGATE TO LEARNING PAGE
  // ------------------------------------------

  const handleContinue = () => {
    /*
      Change this route later if your actual
      learning page uses another URL.
    */

    navigate(
      `/course/${activeCourse._id}/learn`
    );
  };

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">

      {/* =====================================
          HEADER
      ===================================== */}

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
            <PlayCircle
              size={21}
              className="text-indigo-600"
            />
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Continue Learning
            </h2>

            <p className="text-sm text-gray-500">
              Pick up where you left off
            </p>
          </div>

        </div>

      </div>

      {/* =====================================
          COURSE
      ===================================== */}

      <div className="mt-6 overflow-hidden rounded-2xl border border-gray-100">

        {/* COURSE THUMBNAIL */}

        <div className="relative h-44 overflow-hidden bg-gray-100">

          {activeCourse.courseThumbnail ? (
            <img
              src={activeCourse.courseThumbnail}
              alt={activeCourse.courseTitle}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <BookOpen
                size={42}
                className="text-gray-300"
              />
            </div>
          )}

          {/* PROGRESS */}

          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/10">

            <div
              className="h-full bg-indigo-600"
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

        </div>

        {/* COURSE CONTENT */}

        <div className="p-5">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

            <div className="min-w-0">

              <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                {activeCourse.category || "Course"}
              </p>

              <h3 className="mt-1 text-xl font-bold text-gray-900">
                {activeCourse.courseTitle}
              </h3>

              {currentLesson?.lectureTitle && (
                <p className="mt-2 text-sm text-gray-500">
                  Next:
                  <span className="ml-1 font-medium text-gray-700">
                    {currentLesson.lectureTitle}
                  </span>
                </p>
              )}

            </div>

            <span className="shrink-0 text-sm font-bold text-indigo-600">
              {progress}%
            </span>

          </div>

          {/* PROGRESS BAR */}

          <div className="mt-5">

            <div className="flex justify-between text-xs text-gray-400">

              <span>
                Course progress
              </span>

              <span>
                {activeCourse.completedLessons ?? 0}/
                {activeCourse.totalLessons ?? 0} lessons
              </span>

            </div>

            <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">

              <div
                className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                style={{
                  width: `${progress}%`,
                }}
              />

            </div>

          </div>

          {/* BUTTON */}

          <button
            onClick={handleContinue}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-700"
          >
            Continue Learning

            <ArrowRight size={17} />
          </button>

        </div>

      </div>

    </section>
  );
}

export default ContinueLearning;
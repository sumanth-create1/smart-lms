import {
  Play,
  Clock3,
  BookOpen,
  ArrowRight,
} from "lucide-react";

function ContinueLearning({ courses = [] }) {
  const course = courses[0];

  // No enrolled courses
  if (!course) {
    return (
      <section className="min-w-0 rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 sm:text-lg">
              Continue Learning
            </h2>

            <p className="mt-0.5 text-xs text-slate-400 sm:text-sm">
              Pick up where you left off
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
        <div className="flex min-h-[250px] flex-col items-center justify-center px-5 py-10 text-center sm:px-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50">
            <BookOpen size={25} className="text-indigo-600" />
          </div>

          <h3 className="mt-4 text-base font-bold text-slate-900">
            No courses yet
          </h3>

          <p className="mt-1 max-w-sm text-sm leading-6 text-slate-400">
            Enroll in a course to start learning.
          </p>
        </div>
      </section>
    );
  }

  // Backend data
  const title = course.courseTitle || "Untitled Course";

  const instructor =
    course.instructor?.name || "Smart LMS Instructor";

  const currentLesson =
    course.currentLesson?.lectureTitle ||
    "Start your first lesson";

  const completedLessons = course.completedLessons ?? 0;

  const totalLessons = course.totalLessons ?? 0;

  const progress = Math.min(
    Math.max(course.progress ?? 0, 0),
    100
  );

  const watchedSeconds =
    course.currentLesson?.watchedSeconds ?? 0;

  // Convert seconds to minutes
  const watchedMinutes = Math.floor(watchedSeconds / 60);

  const thumbnail = course.courseThumbnail?.url;

  return (
    <section className="min-w-0 rounded-2xl border border-slate-200 bg-white shadow-sm">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
        <div>
          <h2 className="text-base font-bold text-slate-900 sm:text-lg">
            Continue Learning
          </h2>

          <p className="mt-0.5 text-xs text-slate-400 sm:text-sm">
            Pick up where you left off
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

      {/* Course */}
      <div className="p-5 sm:p-6">

        <div className="flex flex-col gap-5 sm:flex-row">

          {/* Course Thumbnail */}
          <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-500 to-violet-500 sm:h-36 sm:w-52">

            {thumbnail ? (
              <img
                src={thumbnail}
                alt={title}
                className="h-full w-full object-cover"
              />
            ) : (
              <>
                <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10" />

                <div className="absolute -bottom-10 -left-8 h-32 w-32 rounded-full bg-white/10" />
              </>
            )}

            {/* Play Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-lg">
                <Play
                  size={22}
                  fill="currentColor"
                  className="ml-1 text-indigo-600"
                />
              </div>
            </div>

            {/* Course Level */}
            <span className="absolute left-3 top-3 rounded-lg bg-black/30 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
              {course.courseLevel}
            </span>

            {/* Watched Time */}
            <span className="absolute bottom-3 left-3 rounded-lg bg-black/30 px-2 py-1 text-[10px] font-medium text-white backdrop-blur-sm">
              {watchedMinutes > 0
                ? `${watchedMinutes} min watched`
                : "Not started"}
            </span>

          </div>

          {/* Course Info */}
          <div className="min-w-0 flex-1">

            {/* Title */}
            <div className="min-w-0">

              <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                {course.category || "Course"}
              </p>

              <h3 className="mt-1 truncate text-lg font-bold text-slate-900">
                {title}
              </h3>

              <p className="mt-1 text-xs text-slate-400">
                By {instructor}
              </p>

            </div>

            {/* Current Lesson */}
            <div className="mt-5 rounded-xl bg-slate-50 p-3.5">

              <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <BookOpen size={15} />
                Current lesson
              </div>

              <p className="mt-1 text-sm font-semibold text-slate-800">
                {currentLesson}
              </p>

            </div>

            {/* Progress */}
            <div className="mt-5">

              <div className="mb-2 flex items-center justify-between text-xs">

                <span className="font-medium text-slate-500">
                  Course progress
                </span>

                <span className="font-bold text-indigo-600">
                  {progress}%
                </span>

              </div>

              {/* Progress Bar */}
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">

                <div
                  className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                  style={{
                    width: `${progress}%`,
                  }}
                />

              </div>

              {/* Progress Details */}
              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">

                <span>
                  {completedLessons} of {totalLessons} lessons
                </span>

                <span className="inline-flex items-center gap-1">
                  <Clock3 size={12} />

                  {watchedMinutes > 0
                    ? `${watchedMinutes} min watched`
                    : "Not started"}
                </span>

              </div>

            </div>

            {/* Continue Button */}
            <button
              type="button"
              className="
                mt-5
                inline-flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-indigo-600
                px-4
                py-3
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-indigo-700
                sm:w-auto
              "
            >
              <Play size={16} fill="currentColor" />

              {progress > 0
                ? "Continue Course"
                : "Start Course"}
            </button>

          </div>

        </div>

      </div>
    </section>
  );
}

export default ContinueLearning;
import {
  Play,
  Clock3,
  BookOpen,
  ArrowRight,
} from "lucide-react";

function ContinueLearning() {
  const course = {
    title: "Advanced MERN Stack",
    instructor: "Smart LMS Instructor",
    currentLesson: "Building REST APIs with Express",
    completedLessons: 12,
    totalLessons: 24,
    progress: 50,
    duration: "18 min left",
  };

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
          <div className="relative flex h-40 w-full shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-500 to-violet-500 sm:h-36 sm:w-52">

            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10" />

            <div className="absolute -bottom-10 -left-8 h-32 w-32 rounded-full bg-white/10" />

            <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-lg">
              <Play
                size={22}
                fill="currentColor"
                className="ml-1 text-indigo-600"
              />
            </div>

            <span className="absolute bottom-3 left-3 rounded-lg bg-black/20 px-2 py-1 text-[10px] font-medium text-white backdrop-blur-sm">
              {course.duration}
            </span>

          </div>

          {/* Course Info */}
          <div className="min-w-0 flex-1">

            <div className="flex items-start justify-between gap-3">

              <div className="min-w-0">

                <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                  Course
                </p>

                <h3 className="mt-1 truncate text-lg font-bold text-slate-900">
                  {course.title}
                </h3>

                <p className="mt-1 text-xs text-slate-400">
                  By {course.instructor}
                </p>

              </div>

            </div>

            {/* Current lesson */}
            <div className="mt-5 rounded-xl bg-slate-50 p-3.5">

              <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <BookOpen size={15} />
                Current lesson
              </div>

              <p className="mt-1 text-sm font-semibold text-slate-800">
                {course.currentLesson}
              </p>

            </div>

            {/* Progress */}
            <div className="mt-5">

              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="font-medium text-slate-500">
                  Course progress
                </span>

                <span className="font-bold text-indigo-600">
                  {course.progress}%
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-100">

                <div
                  className="h-full rounded-full bg-indigo-600 transition-all"
                  style={{ width: `${course.progress}%` }}
                />

              </div>

              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">

                <span>
                  {course.completedLessons} of {course.totalLessons} lessons
                </span>

                <span className="inline-flex items-center gap-1">
                  <Clock3 size={12} />
                  {course.duration}
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
              Continue Course
            </button>

          </div>

        </div>

      </div>
    </section>
  );
}

export default ContinueLearning;
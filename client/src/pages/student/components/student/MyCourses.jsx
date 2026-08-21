import {
  BookOpen,
  Clock3,
  ArrowRight,
  Play,
} from "lucide-react";

function MyCourses({ courses = [] }) {
  return (
    <section className="min-w-0 rounded-2xl border border-slate-200 bg-white shadow-sm">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">

        <div>
          <h2 className="text-base font-bold text-slate-900 sm:text-lg">
            My Courses
          </h2>

          <p className="mt-0.5 text-xs text-slate-400 sm:text-sm">
            Courses you're currently learning
          </p>
        </div>

        <button
          type="button"
          className="
            inline-flex
            items-center
            gap-1
            text-xs
            font-semibold
            text-indigo-600
            transition
            hover:text-indigo-700
            sm:text-sm
          "
        >
          View all
          <ArrowRight size={15} />
        </button>

      </div>

      {/* Empty State */}
      {courses.length === 0 ? (
        <div className="flex min-h-[280px] flex-col items-center justify-center px-5 py-10 text-center">

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50">
            <BookOpen
              size={25}
              className="text-indigo-600"
            />
          </div>

          <h3 className="mt-4 text-base font-bold text-slate-900">
            No courses yet
          </h3>

          <p className="mt-1 max-w-sm text-sm leading-6 text-slate-400">
            Enroll in a course to start building your learning journey.
          </p>

        </div>
      ) : (
        /* Courses */
        <div className="grid grid-cols-1 divide-y divide-slate-100 xl:grid-cols-3 xl:divide-x xl:divide-y-0">

          {courses.map((course) => {

            const title =
              course.courseTitle || "Untitled Course";

            const instructor =
              course.instructor?.name ||
              "Smart LMS Instructor";

            const category =
              course.category || "Course";

            const level =
              course.courseLevel || "Beginner";

            const progress = Math.min(
              Math.max(course.progress ?? 0, 0),
              100
            );

            const completedLessons =
              course.completedLessons ?? 0;

            const totalLessons =
              course.totalLessons ?? 0;

            const thumbnail =
              course.courseThumbnail?.url;

            return (
              <div
                key={course._id}
                className="
                  group
                  p-5
                  transition
                  hover:bg-slate-50/70
                  sm:p-6
                "
              >

                {/* Course visual */}
                <div
                  className="
                    relative
                    h-32
                    overflow-hidden
                    rounded-2xl
                    bg-gradient-to-br
                    from-indigo-600
                    to-violet-500
                  "
                >

                  {thumbnail ? (
                    <img
                      src={thumbnail}
                      alt={title}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <>
                      {/* Decorative shapes */}
                      <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10" />

                      <div className="absolute -bottom-10 -left-8 h-28 w-28 rounded-full bg-white/10" />

                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md">
                          <BookOpen
                            size={21}
                            className="text-indigo-600"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Level */}
                  <span className="absolute left-3 top-3 rounded-lg bg-black/30 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
                    {level}
                  </span>

                </div>

                {/* Category */}
                <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.12em] text-indigo-600">
                  {category}
                </p>

                {/* Title */}
                <h3 className="mt-1 line-clamp-1 text-base font-bold text-slate-900">
                  {title}
                </h3>

                {/* Subtitle */}
                {course.subTitle && (
                  <p className="mt-1 line-clamp-1 text-xs text-slate-400">
                    {course.subTitle}
                  </p>
                )}

                {/* Instructor */}
                <p className="mt-1 text-xs text-slate-400">
                  By {instructor}
                </p>

                {/* Progress */}
                <div className="mt-5">

                  <div className="mb-2 flex items-center justify-between">

                    <span className="text-xs font-medium text-slate-500">
                      Progress
                    </span>

                    <span className="text-xs font-bold text-indigo-600">
                      {progress}%
                    </span>

                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">

                    <div
                      className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                      style={{
                        width: `${progress}%`,
                      }}
                    />

                  </div>

                </div>

                {/* Meta */}
                <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400">

                  <span>
                    {completedLessons}/{totalLessons} lessons
                  </span>

                  <span className="inline-flex items-center gap-1">
                    <Clock3 size={12} />

                    {progress === 100
                      ? "Completed"
                      : progress > 0
                      ? "In progress"
                      : "Not started"}
                  </span>

                </div>

                {/* Button */}
                <button
                  type="button"
                  className="
                    mt-5
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    px-4
                    py-2.5
                    text-xs
                    font-semibold
                    text-slate-700
                    transition
                    hover:border-indigo-200
                    hover:bg-indigo-50
                    hover:text-indigo-600
                  "
                >
                  <Play
                    size={14}
                    fill="currentColor"
                  />

                  {progress > 0
                    ? "Continue Learning"
                    : "Start Learning"}
                </button>

              </div>
            );
          })}

        </div>
      )}

    </section>
  );
}

export default MyCourses;
import {
  BookOpen,
  CheckCircle2,
  Clock3,
  Play,
} from "lucide-react";

function MyCourses({ courses = [] }) {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">

      {/* =========================
          HEADER
      ========================= */}

      <div className="flex items-center justify-between">

        <div>
          <h2 className="text-lg font-bold text-gray-900">
            My Courses
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Courses you are currently enrolled in
          </p>
        </div>

        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-600">
          {courses.length}{" "}
          {courses.length === 1 ? "Course" : "Courses"}
        </span>

      </div>

      {/* =========================
          EMPTY STATE
      ========================= */}

      {courses.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-gray-200 p-8 text-center">

          <BookOpen
            size={35}
            className="mx-auto text-gray-300"
          />

          <h3 className="mt-3 font-semibold text-gray-700">
            No courses yet
          </h3>

          <p className="mt-1 text-sm text-gray-400">
            You haven't enrolled in any courses yet.
          </p>

        </div>
      ) : (

        /* =========================
           COURSE LIST
        ========================= */

        <div className="mt-5 space-y-4">

          {courses.map((course) => {

            const progress = Math.min(
              Math.max(course.progress ?? 0, 0),
              100
            );

            const completed = progress === 100;

            return (
              <div
                key={course._id}
                className="rounded-xl border border-gray-100 p-4 transition hover:border-indigo-100 hover:shadow-sm"
              >

                <div className="flex flex-col gap-4 sm:flex-row">

                  {/* =========================
                      THUMBNAIL
                  ========================= */}

                  <div className="h-28 w-full shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:w-40">

                    {course.courseThumbnail ? (
                      <img
                        src={course.courseThumbnail}
                        alt={course.courseTitle}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <BookOpen
                          size={30}
                          className="text-gray-300"
                        />
                      </div>
                    )}

                  </div>

                  {/* =========================
                      COURSE INFORMATION
                  ========================= */}

                  <div className="min-w-0 flex-1">

                    <div className="flex flex-wrap items-start justify-between gap-3">

                      <div className="min-w-0">

                        <h3 className="truncate font-bold text-gray-900">
                          {course.courseTitle}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          {course.category || "Online Course"}
                        </p>

                      </div>

                      {/* STATUS */}

                      {completed ? (
                        <span className="flex shrink-0 items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-600">
                          <CheckCircle2 size={14} />
                          Completed
                        </span>
                      ) : (
                        <span className="shrink-0 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-600">
                          {progress}% Complete
                        </span>
                      )}

                    </div>

                    {/* =========================
                        COURSE META
                    ========================= */}

                    <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-400">

                      {course.courseLevel && (
                        <span>
                          Level:{" "}
                          <strong className="text-gray-500">
                            {course.courseLevel}
                          </strong>
                        </span>
                      )}

                      <span>
                        {course.completedLessons ?? 0} /{" "}
                        {course.totalLessons ?? 0} lessons
                      </span>

                    </div>

                    {/* =========================
                        PROGRESS
                    ========================= */}

                    <div className="mt-4">

                      <div className="h-2 overflow-hidden rounded-full bg-gray-100">

                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            completed
                              ? "bg-green-500"
                              : "bg-indigo-600"
                          }`}
                          style={{
                            width: `${progress}%`,
                          }}
                        />

                      </div>

                    </div>

                    {/* =========================
                        FOOTER
                    ========================= */}

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">

                      <div className="flex items-center gap-2 text-xs text-gray-400">

                        <Clock3 size={14} />

                        <span>
                          {completed
                            ? "Course completed"
                            : course.currentLesson?.lectureTitle ||
                              "Ready to start"}
                        </span>

                      </div>

                      <button
                        className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition ${
                          completed
                            ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            : "bg-indigo-600 text-white hover:bg-indigo-700"
                        }`}
                      >

                        <Play
                          size={14}
                          fill="currentColor"
                        />

                        {completed ? "Review Course" : "Continue"}

                      </button>

                    </div>

                  </div>

                </div>

              </div>
            );
          })}

        </div>
      )}

    </section>
  );
}

export default MyCourses;
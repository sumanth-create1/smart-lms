import { BarChart3, CheckCircle2, BookOpen, Clock3 } from "lucide-react";

function ProgressOverview({ stats = {} }) {
  const enrolledCourses = stats.enrolledCourses ?? 0;
  const completedCourses = stats.completedCourses ?? 0;
  const learningHours = stats.learningHours ?? 0;

  const completionPercentage =
    enrolledCourses > 0
      ? Math.round((completedCourses / enrolledCourses) * 100)
      : 0;

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">

      {/* =========================
          HEADER
      ========================= */}

      <div className="flex items-center gap-3">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
          <BarChart3
            size={21}
            className="text-indigo-600"
          />
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-900">
            Progress Overview
          </h2>

          <p className="text-sm text-gray-500">
            Your learning progress
          </p>
        </div>

      </div>


      {/* =========================
          OVERALL PROGRESS
      ========================= */}

      <div className="mt-6">

        <div className="flex items-end justify-between">

          <div>
            <p className="text-sm text-gray-500">
              Course Completion
            </p>

            <h3 className="mt-1 text-3xl font-bold text-gray-900">
              {completionPercentage}%
            </h3>
          </div>

          <CheckCircle2
            size={28}
            className="text-green-500"
          />

        </div>

        {/* PROGRESS BAR */}

        <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-gray-100">

          <div
            className="h-full rounded-full bg-indigo-600 transition-all duration-500"
            style={{
              width: `${completionPercentage}%`,
            }}
          />

        </div>

      </div>


      {/* =========================
          STAT ITEMS
      ========================= */}

      <div className="mt-6 space-y-4">

        {/* ENROLLED */}

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
              <BookOpen
                size={18}
                className="text-blue-600"
              />
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700">
                Enrolled Courses
              </p>

              <p className="text-xs text-gray-400">
                Currently learning
              </p>
            </div>

          </div>

          <span className="text-lg font-bold text-gray-900">
            {enrolledCourses}
          </span>

        </div>


        {/* COMPLETED */}

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50">
              <CheckCircle2
                size={18}
                className="text-green-600"
              />
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700">
                Completed
              </p>

              <p className="text-xs text-gray-400">
                Finished courses
              </p>
            </div>

          </div>

          <span className="text-lg font-bold text-gray-900">
            {completedCourses}
          </span>

        </div>


        {/* LEARNING HOURS */}

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50">
              <Clock3
                size={18}
                className="text-orange-500"
              />
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700">
                Learning Hours
              </p>

              <p className="text-xs text-gray-400">
                Total study time
              </p>
            </div>

          </div>

          <span className="text-lg font-bold text-gray-900">
            {learningHours}
          </span>

        </div>

      </div>

    </section>
  );
}

export default ProgressOverview;
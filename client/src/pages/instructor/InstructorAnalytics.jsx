import { useEffect, useState } from "react";
import {
  BarChart3,
  BookOpen,
  Users,
  UserPlus,
  IndianRupee,
  LoaderCircle,
  TrendingUp,
} from "lucide-react";
import toast from "react-hot-toast";

import api from "../../services/api";

function InstructorAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // FETCH ANALYTICS
  // =====================================================

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      const response = await api.get(
        "/dashboard/instructor/analytics",
      );

      if (response.data?.success) {
        setAnalytics(response.data.data);
      } else {
        toast.error(
          response.data?.message || "Failed to load analytics",
        );
      }
    } catch (error) {
      console.error("Instructor analytics error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to load analytics",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <LoaderCircle
            size={36}
            className="animate-spin text-indigo-600"
          />

          <p className="text-sm text-gray-500">
            Loading analytics...
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // DATA
  // =====================================================

  const overview = analytics?.overview || {};

  const monthlyEnrollments =
    analytics?.monthlyEnrollments || [];

  const coursePerformance =
    analytics?.coursePerformance || [];

  const recentEnrollments =
    analytics?.recentEnrollments || [];

  // Calculate maximum enrollment count once.
  const maxEnrollmentCount = Math.max(
    ...monthlyEnrollments.map(
      (item) => Number(item.count) || 0,
    ),
    1,
  );

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="space-y-8 p-6 lg:p-8">

      {/* =================================================
          HEADER
      ================================================= */}

      <div>
        <p className="mb-1 text-sm font-medium text-indigo-600">
          Instructor Analytics
        </p>

        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Analytics & Performance
        </h1>

        <p className="mt-2 text-gray-500">
          Monitor your courses, students, enrollments,
          and estimated revenue.
        </p>
      </div>

      {/* =================================================
          OVERVIEW
      ================================================= */}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

        <AnalyticsCard
          title="Total Courses"
          value={overview.totalCourses || 0}
          icon={<BookOpen size={22} />}
          iconClass="bg-indigo-50 text-indigo-600"
        />

        <AnalyticsCard
          title="Total Students"
          value={overview.totalStudents || 0}
          icon={<Users size={22} />}
          iconClass="bg-blue-50 text-blue-600"
        />

        <AnalyticsCard
          title="Total Enrollments"
          value={overview.totalEnrollments || 0}
          icon={<UserPlus size={22} />}
          iconClass="bg-emerald-50 text-emerald-600"
        />

        <AnalyticsCard
          title="Estimated Revenue"
          value={`₹${overview.totalRevenue || 0}`}
          icon={<IndianRupee size={22} />}
          iconClass="bg-amber-50 text-amber-600"
        />

      </div>

      {/* =================================================
          ENROLLMENT OVERVIEW
      ================================================= */}

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

        <div className="mb-6 flex items-center gap-3">

          <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
            <TrendingUp size={21} />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Enrollment Overview
            </h2>

            <p className="text-sm text-gray-500">
              Monthly student enrollment activity
            </p>
          </div>

        </div>

        {monthlyEnrollments.length === 0 ? (
          <div className="flex h-72 items-center justify-center text-sm text-gray-500">
            No enrollment data available.
          </div>
        ) : (
          <div className="flex h-72 items-end gap-2 overflow-x-auto border-b border-gray-100 px-2 pb-0">

            {monthlyEnrollments.map((item) => {
              const count = Number(item.count) || 0;

              const height =
                (count / maxEnrollmentCount) * 100;

              return (
                <div
                  key={item.month}
                  className="
                    flex
                    min-w-[38px]
                    flex-1
                    flex-col
                    items-center
                    justify-end
                    gap-2
                  "
                >

                  <span className="text-xs font-medium text-gray-500">
                    {count}
                  </span>

                  <div
                    className="
                      w-full
                      max-w-[34px]
                      rounded-t-lg
                      bg-indigo-500
                      transition
                      hover:bg-indigo-600
                    "
                    style={{
                      height: `${Math.max(
                        height,
                        count > 0 ? 8 : 2,
                      )}%`,
                    }}
                    title={`${count} enrollments`}
                  />

                  <span className="text-xs text-gray-400">
                    {item.month}
                  </span>

                </div>
              );
            })}

          </div>
        )}

      </div>

      {/* =================================================
          COURSE PERFORMANCE
      ================================================= */}

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

        <div className="border-b border-gray-100 px-6 py-5">

          <div className="flex items-center gap-3">

            <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
              <BarChart3 size={21} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Course Performance
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Compare the performance of your courses
              </p>
            </div>

          </div>

        </div>

        {coursePerformance.length === 0 ? (
          <div className="flex min-h-[250px] items-center justify-center px-6 text-sm text-gray-500">
            No course performance data available.
          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full min-w-[700px]">

              <thead className="bg-gray-50">

                <tr className="text-left text-xs font-semibold uppercase tracking-wide text-gray-500">

                  <th className="px-6 py-4">
                    Course
                  </th>

                  <th className="px-6 py-4">
                    Level
                  </th>

                  <th className="px-6 py-4">
                    Students
                  </th>

                  <th className="px-6 py-4">
                    Enrollments
                  </th>

                  <th className="px-6 py-4">
                    Price
                  </th>

                  <th className="px-6 py-4">
                    Revenue
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-gray-100">

                {coursePerformance.map((course) => (
                  <tr
                    key={course._id}
                    className="transition hover:bg-gray-50"
                  >

                    {/* COURSE */}

                    <td className="px-6 py-5">

                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                          <BookOpen size={18} />
                        </div>

                        <div className="min-w-0">

                          <p className="max-w-[250px] truncate font-semibold text-gray-900">
                            {course.courseTitle || "Course"}
                          </p>

                          <p className="text-xs text-gray-400">
                            Course
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* LEVEL */}

                    <td className="px-6 py-5">

                      <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">
                        {course.courseLevel || "N/A"}
                      </span>

                    </td>

                    {/* STUDENTS */}

                    <td className="px-6 py-5 font-semibold text-gray-900">
                      {course.students || 0}
                    </td>

                    {/* ENROLLMENTS */}

                    <td className="px-6 py-5 text-gray-600">
                      {course.enrollments || 0}
                    </td>

                    {/* PRICE */}

                    <td className="px-6 py-5 text-gray-600">
                      ₹{course.coursePrice || 0}
                    </td>

                    {/* REVENUE */}

                    <td className="px-6 py-5 font-semibold text-gray-900">
                      ₹{course.revenue || 0}
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>

      {/* =================================================
          RECENT ENROLLMENTS
      ================================================= */}

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

        <div className="border-b border-gray-100 px-6 py-5">

          <h2 className="text-lg font-semibold text-gray-900">
            Recent Enrollments
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Latest students who joined your courses
          </p>

        </div>

        {recentEnrollments.length === 0 ? (
          <div className="flex min-h-[220px] items-center justify-center px-6 text-sm text-gray-500">
            No recent enrollments.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">

            {recentEnrollments.map((enrollment) => (

              <div
                key={enrollment._id}
                className="
                  flex
                  items-center
                  gap-4
                  px-6
                  py-4
                  transition
                  hover:bg-gray-50
                "
              >

                {/* AVATAR */}

                {enrollment.student?.avatar ? (
                  <img
                    src={enrollment.student.avatar}
                    alt={
                      enrollment.student.name ||
                      "Student"
                    }
                    className="
                      h-11
                      w-11
                      shrink-0
                      rounded-full
                      object-cover
                    "
                  />
                ) : (
                  <div
                    className="
                      flex
                      h-11
                      w-11
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-indigo-50
                      text-sm
                      font-semibold
                      text-indigo-600
                    "
                  >
                    {enrollment.student?.name
                      ?.charAt(0)
                      ?.toUpperCase() || "S"}
                  </div>
                )}

                {/* STUDENT */}

                <div className="min-w-0 flex-1">

                  <p className="truncate font-semibold text-gray-900">
                    {enrollment.student?.name ||
                      "Student"}
                  </p>

                  <p className="truncate text-sm text-gray-500">
                    {enrollment.course?.courseTitle ||
                      "Course"}
                  </p>

                </div>

                {/* DATE */}

                <div className="shrink-0 text-right">

                  <p className="text-xs text-gray-400">
                    Enrolled
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-700">
                    {enrollment.enrolledAt
                      ? new Date(
                          enrollment.enrolledAt,
                        ).toLocaleDateString()
                      : "—"}
                  </p>

                </div>

              </div>

            ))}

          </div>
        )}

      </div>

    </div>
  );
}

// =====================================================
// ANALYTICS CARD
// =====================================================

function AnalyticsCard({
  title,
  value,
  icon,
  iconClass,
}) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-gray-200
        bg-white
        p-6
        shadow-sm
        transition
        hover:-translate-y-0.5
        hover:shadow-md
      "
    >

      <div className="flex items-start justify-between">

        <div>

          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          <p className="mt-3 text-3xl font-bold tracking-tight text-gray-900">
            {value}
          </p>

        </div>

        <div
          className={`rounded-xl p-3 ${iconClass}`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
}

export default InstructorAnalytics;
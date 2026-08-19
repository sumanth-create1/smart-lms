import { useEffect, useState } from "react";
import {
  BookOpen,
  Users,
  UserPlus,
  IndianRupee,
  LoaderCircle,
  ArrowRight,
  Plus,
} from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

function InstructorDashboard() {
  const { user } = useAuth();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const response = await api.get("/dashboard/instructor");

      if (response.data?.success) {
        setDashboard(response.data.data);
      } else {
        toast.error(
          response.data?.message || "Failed to load instructor dashboard",
        );
      }
    } catch (error) {
      console.error("Instructor dashboard error:", error);

      toast.error(
        error.response?.data?.message || "Unable to load instructor dashboard",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <LoaderCircle size={36} className="animate-spin text-indigo-600" />

          <p className="text-sm text-gray-500">
            Loading instructor dashboard...
          </p>
        </div>
      </div>
    );
  }

  const stats = dashboard?.stats || {};
  const courses = dashboard?.courses || [];
  const recentEnrollments = dashboard?.recentEnrollments || [];

  const firstName = user?.name?.split(" ")[0] || "Instructor";

  return (
    <div className="space-y-8 p-6 lg:p-8">
      {/* ========================================
          HEADER
      ======================================== */}
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="mb-1 text-sm font-medium text-indigo-600">
            Instructor Dashboard
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Welcome back, {firstName} 👋
          </h1>

          <p className="mt-2 text-gray-500">
            Manage your courses and keep track of your students.
          </p>
        </div>

        <Link
          to="/instructor/create-course"
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-indigo-600
            px-5
            py-3
            text-sm
            font-semibold
            text-white
            shadow-sm
            transition
            hover:bg-indigo-700
          "
        >
          <Plus size={18} />
          Create Course
        </Link>
      </div>

      {/* ========================================
          STATS
      ======================================== */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {/* Total Courses */}
        <StatCard
          title="Total Courses"
          value={stats.totalCourses || 0}
          icon={<BookOpen size={22} />}
          iconClass="bg-indigo-50 text-indigo-600"
        />

        {/* Total Students */}
        <StatCard
          title="Total Students"
          value={stats.totalStudents || 0}
          icon={<Users size={22} />}
          iconClass="bg-blue-50 text-blue-600"
        />

        {/* Total Enrollments */}
        <StatCard
          title="Total Enrollments"
          value={stats.totalEnrollments || 0}
          icon={<UserPlus size={22} />}
          iconClass="bg-emerald-50 text-emerald-600"
        />

        {/* Course Value */}
        <StatCard
          title="Course Value"
          value={`₹${stats.totalCourseValue || 0}`}
          icon={<IndianRupee size={22} />}
          iconClass="bg-amber-50 text-amber-600"
        />
      </div>

      {/* ========================================
          MAIN CONTENT
      ======================================== */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* ====================================
            MY COURSES
        ==================================== */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm xl:col-span-2">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                My Courses
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Courses created by you
              </p>
            </div>

            <Link
              to="/instructor/courses"
              className="
                inline-flex
                items-center
                gap-1
                text-sm
                font-medium
                text-indigo-600
                hover:text-indigo-700
              "
            >
              View all
              <ArrowRight size={16} />
            </Link>
          </div>

          {courses.length === 0 ? (
            <EmptyCourses />
          ) : (
            <div className="divide-y divide-gray-100">
              {courses.slice(0, 5).map((course) => (
                <div
                  key={course._id}
                  className="
                    flex
                    flex-col
                    gap-4
                    p-6
                    transition
                    hover:bg-gray-50
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                  "
                >
                  {/* Course info */}
                  <div className="flex min-w-0 items-center gap-4">
                    <img
                      src={
                        course.courseThumbnail?.url || "/placeholder-course.jpg"
                      }
                      alt={course.courseTitle}
                      className="
                        h-16
                        w-24
                        shrink-0
                        rounded-xl
                        object-cover
                        bg-gray-100
                      "
                    />

                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-gray-900">
                        {course.courseTitle}
                      </h3>

                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        {course.category && (
                          <span
                            className="
                            rounded-full
                            bg-gray-100
                            px-2.5
                            py-1
                            text-xs
                            font-medium
                            text-gray-600
                          "
                          >
                            {course.category}
                          </span>
                        )}

                        <span
                          className="
                          rounded-full
                          bg-indigo-50
                          px-2.5
                          py-1
                          text-xs
                          font-medium
                          text-indigo-600
                        "
                        >
                          {course.courseLevel}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Course stats */}
                  <div className="flex items-center gap-8">
                    <div>
                      <p className="text-xs text-gray-400">Students</p>

                      <p className="mt-1 font-semibold text-gray-900">
                        {course.studentCount || 0}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400">Price</p>

                      <p className="mt-1 font-semibold text-gray-900">
                        ₹{course.coursePrice || 0}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ====================================
            RECENT ENROLLMENTS
        ==================================== */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-6 py-5">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Enrollments
            </h2>

            <p className="mt-1 text-sm text-gray-500">Latest students</p>
          </div>

          {recentEnrollments.length === 0 ? (
            <div className="flex min-h-[280px] flex-col items-center justify-center px-6 text-center">
              <div className="rounded-full bg-gray-100 p-4">
                <Users size={26} className="text-gray-400" />
              </div>

              <p className="mt-4 font-medium text-gray-700">
                No enrollments yet
              </p>

              <p className="mt-1 text-sm text-gray-400">
                Your recent student enrollments will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentEnrollments.map((enrollment) => (
                <div
                  key={enrollment._id}
                  className="flex items-center gap-3 px-6 py-4"
                >
                  {/* Avatar */}
                  {enrollment.student?.avatar ? (
                    <img
                      src={enrollment.student.avatar}
                      alt={enrollment.student.name}
                      className="
                        h-10
                        w-10
                        rounded-full
                        object-cover
                      "
                    />
                  ) : (
                    <div
                      className="
                      flex
                      h-10
                      w-10
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
                      {enrollment.student?.name?.charAt(0)?.toUpperCase() ||
                        "S"}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-900">
                      {enrollment.student?.name || "Student"}
                    </p>

                    <p className="truncate text-xs text-gray-500">
                      {enrollment.course?.courseTitle || "Course"}
                    </p>
                  </div>

                  <span className="shrink-0 text-xs text-gray-400">
                    {enrollment.enrolledAt
                      ? new Date(enrollment.enrolledAt).toLocaleDateString()
                      : ""}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ========================================
          QUICK ACTIONS
      ======================================== */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <QuickAction
            title="Create Course"
            description="Create a new course"
            icon={<Plus size={20} />}
            to="/instructor/create-course"
          />

          <QuickAction
            title="Manage Courses"
            description="Edit your existing courses"
            icon={<BookOpen size={20} />}
            to="/instructor/courses"
          />

          <QuickAction
            title="View Students"
            description="See your enrolled students"
            icon={<Users size={20} />}
            to="/instructor/students"
          />
        </div>
      </div>
    </div>
  );
}

/* ============================================
   STAT CARD
============================================ */

function StatCard({ title, value, icon, iconClass }) {
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
          <p className="text-sm font-medium text-gray-500">{title}</p>

          <p className="mt-3 text-3xl font-bold tracking-tight text-gray-900">
            {value}
          </p>
        </div>

        <div className={`rounded-xl p-3 ${iconClass}`}>{icon}</div>
      </div>
    </div>
  );
}

/* ============================================
   EMPTY COURSES
============================================ */

function EmptyCourses() {
  return (
    <div
      className="
      flex
      min-h-[300px]
      flex-col
      items-center
      justify-center
      px-6
      text-center
    "
    >
      <div className="rounded-full bg-indigo-50 p-4">
        <BookOpen size={28} className="text-indigo-500" />
      </div>

      <h3 className="mt-4 font-semibold text-gray-900">No courses yet</h3>

      <p className="mt-1 max-w-sm text-sm text-gray-500">
        Start creating your first course and begin teaching your students.
      </p>

      <Link
       to="/instructor/create-course"
        className="
          mt-5
          inline-flex
          items-center
          gap-2
          rounded-xl
          bg-indigo-600
          px-4
          py-2.5
          text-sm
          font-semibold
          text-white
          hover:bg-indigo-700
        "
      >
        <Plus size={17} />
        Create Course
      </Link>
    </div>
  );
}

/* ============================================
   QUICK ACTION
============================================ */

function QuickAction({ title, description, icon, to }) {
  return (
    <Link
      to={to}
      className="
        group
        flex
        items-center
        gap-4
        rounded-2xl
        border
        border-gray-200
        bg-white
        p-5
        shadow-sm
        transition
        hover:-translate-y-0.5
        hover:border-indigo-200
        hover:shadow-md
      "
    >
      <div
        className="
        rounded-xl
        bg-indigo-50
        p-3
        text-indigo-600
        transition
        group-hover:bg-indigo-600
        group-hover:text-white
      "
      >
        {icon}
      </div>

      <div className="flex-1">
        <h3 className="font-semibold text-gray-900">{title}</h3>

        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>

      <ArrowRight
        size={18}
        className="
          text-gray-300
          transition
          group-hover:translate-x-1
          group-hover:text-indigo-600
        "
      />
    </Link>
  );
}

export default InstructorDashboard;

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  LoaderCircle,
  Mail,
  UserRound,
  TrendingUp,
} from "lucide-react";
import toast from "react-hot-toast";

import api from "../../services/api";

function InstructorStudentDetails() {
  const { studentId } = useParams();

  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // FETCH STUDENT DETAILS
  // =====================================================

  const fetchStudentDetails = async () => {
    try {
      setLoading(true);

      const response = await api.get(
        `/dashboard/instructor/students/${studentId}`,
      );

      if (response.data?.success) {
        setStudentData(response.data.data);
      } else {
        toast.error(
          response.data?.message ||
            "Failed to load student details",
        );
      }
    } catch (error) {
      console.error(
        "Student details error:",
        error,
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to load student details",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (studentId) {
      fetchStudentDetails();
    }
  }, [studentId]);

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
            Loading student details...
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // NO DATA
  // =====================================================

  if (!studentData?.student) {
    return (
      <div className="flex min-h-[500px] flex-col items-center justify-center px-6 text-center">
        <div className="rounded-full bg-gray-100 p-4">
          <UserRound
            size={30}
            className="text-gray-400"
          />
        </div>

        <h2 className="mt-4 text-lg font-semibold text-gray-900">
          Student not found
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          This student could not be found in your courses.
        </p>

        <Link
          to="/instructor/students"
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
            transition
            hover:bg-indigo-700
          "
        >
          <ArrowLeft size={17} />
          Back to Students
        </Link>
      </div>
    );
  }

  const student = studentData.student;
  const courses = studentData.courses || [];

  // =====================================================
  // CALCULATE OVERALL PROGRESS
  // =====================================================

  const totalCompletedLectures = courses.reduce(
    (total, item) =>
      total +
      (item.progress?.completedLectures || 0),
    0,
  );

  const totalLectures = courses.reduce(
    (total, item) =>
      total +
      (item.progress?.totalLectures || 0),
    0,
  );

  const overallProgress =
    totalLectures > 0
      ? Math.round(
          (totalCompletedLectures / totalLectures) * 100,
        )
      : 0;

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="space-y-8 p-6 lg:p-8">

      {/* =================================================
          BACK BUTTON
      ================================================= */}

      <Link
        to="/instructor/students"
        className="
          inline-flex
          items-center
          gap-2
          text-sm
          font-medium
          text-gray-500
          transition
          hover:text-indigo-600
        "
      >
        <ArrowLeft size={17} />
        Back to Students
      </Link>

      {/* =================================================
          STUDENT PROFILE
      ================================================= */}

      <div
        className="
          overflow-hidden
          rounded-3xl
          border
          border-gray-200
          bg-white
          shadow-sm
        "
      >
        <div
          className="
            h-32
            bg-gradient-to-r
            from-indigo-600
            via-indigo-500
            to-violet-500
          "
        />

        <div className="px-6 pb-7 lg:px-8">

          <div className="-mt-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

            {/* Avatar + info */}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">

              {student.avatar ? (
                <img
                  src={student.avatar}
                  alt={student.name}
                  className="
                    h-24
                    w-24
                    rounded-2xl
                    border-4
                    border-white
                    object-cover
                    shadow-md
                  "
                />
              ) : (
                <div
                  className="
                    flex
                    h-24
                    w-24
                    items-center
                    justify-center
                    rounded-2xl
                    border-4
                    border-white
                    bg-indigo-50
                    text-3xl
                    font-bold
                    text-indigo-600
                    shadow-md
                  "
                >
                  {student.name
                    ?.charAt(0)
                    ?.toUpperCase() || "S"}
                </div>
              )}

              <div className="pb-1">

                <div className="flex flex-wrap items-center gap-2">

                  <h1 className="text-2xl font-bold text-gray-900">
                    {student.name}
                  </h1>

                  <span
                    className="
                      rounded-full
                      bg-emerald-50
                      px-2.5
                      py-1
                      text-xs
                      font-semibold
                      text-emerald-600
                    "
                  >
                    Active Student
                  </span>

                </div>

                <div className="mt-2 flex flex-wrap items-center gap-4">

                  <a
                    href={`mailto:${student.email}`}
                    className="
                      inline-flex
                      items-center
                      gap-2
                      text-sm
                      text-gray-500
                      hover:text-indigo-600
                    "
                  >
                    <Mail size={15} />
                    {student.email}
                  </a>

                </div>

              </div>

            </div>

            {/* Course count */}

            <div className="flex items-center gap-3">

              <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                <BookOpen size={21} />
              </div>

              <div>
                <p className="text-xs text-gray-400">
                  Enrolled Courses
                </p>

                <p className="text-xl font-bold text-gray-900">
                  {courses.length}
                </p>
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* =================================================
          SUMMARY CARDS
      ================================================= */}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">

        <SummaryCard
          title="Enrolled Courses"
          value={courses.length}
          description="Courses you're teaching"
          icon={<BookOpen size={22} />}
          iconClass="bg-indigo-50 text-indigo-600"
        />

        <SummaryCard
          title="Overall Progress"
          value={`${overallProgress}%`}
          description="Across enrolled courses"
          icon={<TrendingUp size={22} />}
          iconClass="bg-emerald-50 text-emerald-600"
        />

        <SummaryCard
          title="Completed Lectures"
          value={totalCompletedLectures}
          description={`Out of ${totalLectures || 0} lectures`}
          icon={<CheckCircle2 size={22} />}
          iconClass="bg-amber-50 text-amber-600"
        />

      </div>

      {/* =================================================
          COURSES
      ================================================= */}

      <div
        className="
          overflow-hidden
          rounded-2xl
          border
          border-gray-200
          bg-white
          shadow-sm
        "
      >

        {/* Header */}

        <div className="border-b border-gray-100 px-6 py-5">

          <h2 className="text-lg font-semibold text-gray-900">
            Enrolled Courses
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Courses this student is enrolled in.
          </p>

        </div>

        {/* Courses */}

        {courses.length === 0 ? (
          <div className="flex min-h-[250px] flex-col items-center justify-center px-6 text-center">

            <div className="rounded-full bg-gray-100 p-4">
              <BookOpen
                size={28}
                className="text-gray-400"
              />
            </div>

            <h3 className="mt-4 font-semibold text-gray-900">
              No courses found
            </h3>

          </div>
        ) : (
          <div className="divide-y divide-gray-100">

            {courses.map((item) => {

              const course = item.course;
              const progress = item.progress || {};

              const percentage =
                progress.percentage || 0;

              return (
                <div
                  key={item.enrollmentId}
                  className="
                    p-6
                    transition
                    hover:bg-gray-50
                  "
                >

                  <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                    {/* Course information */}

                    <div className="flex min-w-0 items-center gap-4">

                      {course?.courseThumbnail?.url ? (
                        <img
                          src={
                            course.courseThumbnail.url
                          }
                          alt={course.courseTitle}
                          className="
                            h-16
                            w-24
                            shrink-0
                            rounded-xl
                            object-cover
                          "
                        />
                      ) : (
                        <div
                          className="
                            flex
                            h-16
                            w-24
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            bg-indigo-50
                            text-indigo-600
                          "
                        >
                          <BookOpen size={25} />
                        </div>
                      )}

                      <div className="min-w-0">

                        <h3 className="truncate text-base font-semibold text-gray-900">
                          {course?.courseTitle ||
                            "Course"}
                        </h3>

                        <div className="mt-2 flex flex-wrap items-center gap-2">

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
                            {course?.courseLevel ||
                              "N/A"}
                          </span>

                          <span className="text-xs text-gray-400">
                            ₹{course?.coursePrice || 0}
                          </span>

                        </div>

                      </div>

                    </div>

                    {/* Progress */}

                    <div className="w-full lg:max-w-md">

                      <div className="mb-2 flex items-center justify-between">

                        <div className="flex items-center gap-2">

                          <TrendingUp
                            size={15}
                            className="text-gray-400"
                          />

                          <span className="text-sm font-medium text-gray-700">
                            Progress
                          </span>

                        </div>

                        <span className="text-sm font-bold text-indigo-600">
                          {percentage}%
                        </span>

                      </div>

                      <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">

                        <div
                          className="
                            h-full
                            rounded-full
                            bg-indigo-600
                            transition-all
                            duration-500
                          "
                          style={{
                            width: `${Math.min(
                              percentage,
                              100,
                            )}%`,
                          }}
                        />

                      </div>

                      <div className="mt-2 flex items-center justify-between text-xs text-gray-400">

                        <span>
                          {progress.completedLectures ||
                            0}{" "}
                          completed
                        </span>

                        <span>
                          {progress.totalLectures ||
                            0}{" "}
                          total lectures
                        </span>

                      </div>

                    </div>

                    {/* Enrollment date */}

                    <div className="flex shrink-0 items-center gap-2 text-sm text-gray-500">

                      <CalendarDays
                        size={16}
                        className="text-gray-400"
                      />

                      <div>

                        <p className="text-xs text-gray-400">
                          Enrolled
                        </p>

                        <p className="font-medium text-gray-700">
                          {item.enrolledAt
                            ? new Date(
                                item.enrolledAt,
                              ).toLocaleDateString()
                            : "N/A"}
                        </p>

                      </div>

                    </div>

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </div>

    </div>
  );
}

// =====================================================
// SUMMARY CARD
// =====================================================

function SummaryCard({
  title,
  value,
  description,
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

          <p className="mt-1 text-xs text-gray-400">
            {description}
          </p>

        </div>

        <div className={`rounded-xl p-3 ${iconClass}`}>
          {icon}
        </div>

      </div>

    </div>
  );
}

export default InstructorStudentDetails;
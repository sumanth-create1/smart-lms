import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Circle,
  Clock3,
  LoaderCircle,
  Mail,
  PlayCircle,
  TrendingUp,
  UserRound,
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

  useEffect(() => {
    if (!studentId) return;

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

    fetchStudentDetails();
  }, [studentId]);

  // =====================================================
  // SAFE DATA
  // IMPORTANT:
  // These values are defined before any return so that
  // hooks and calculations remain consistent.
  // =====================================================

  const student = studentData?.student || null;
  const courses = studentData?.courses || [];

  // =====================================================
  // OVERALL PROGRESS
  // =====================================================

  const overallStats = useMemo(() => {
    const totalLectures = courses.reduce(
      (total, course) =>
        total + Number(course.progress?.totalLectures || 0),
      0,
    );

    const completedLectures = courses.reduce(
      (total, course) =>
        total +
        Number(course.progress?.completedLectures || 0),
      0,
    );

    const remainingLectures = Math.max(
      totalLectures - completedLectures,
      0,
    );

    const percentage =
      totalLectures > 0
        ? Math.round(
            (completedLectures / totalLectures) * 100,
          )
        : 0;

    return {
      totalLectures,
      completedLectures,
      remainingLectures,
      percentage,
    };
  }, [courses]);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return <LoadingState />;
  }

  // =====================================================
  // NO DATA
  // =====================================================

  if (!student) {
    return <StudentNotFound />;
  }

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

      <StudentProfile
        student={student}
        courseCount={courses.length}
      />

      {/* =================================================
          OVERALL SUMMARY
      ================================================= */}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

        <SummaryCard
          title="Enrolled Courses"
          value={courses.length}
          description="Courses enrolled"
          icon={<BookOpen size={22} />}
          iconClass="bg-indigo-50 text-indigo-600"
        />

        <SummaryCard
          title="Overall Progress"
          value={`${overallStats.percentage}%`}
          description="Across all courses"
          icon={<TrendingUp size={22} />}
          iconClass="bg-emerald-50 text-emerald-600"
        />

        <SummaryCard
          title="Completed Lectures"
          value={overallStats.completedLectures}
          description={`Out of ${overallStats.totalLectures} lectures`}
          icon={<CheckCircle2 size={22} />}
          iconClass="bg-blue-50 text-blue-600"
        />

        <SummaryCard
          title="Remaining Lectures"
          value={overallStats.remainingLectures}
          description="Lectures left"
          icon={<PlayCircle size={22} />}
          iconClass="bg-amber-50 text-amber-600"
        />

      </div>

      {/* =================================================
          COURSE PROGRESS
      ================================================= */}

      {courses.length === 0 ? (
        <EmptyCourses />
      ) : (
        <div className="space-y-6">
          {courses.map((item) => (
            <CourseProgressCard
              key={item.enrollmentId || item.course?._id}
              item={item}
            />
          ))}
        </div>
      )}

    </div>
  );
}

// =====================================================
// LOADING STATE
// =====================================================

function LoadingState() {
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
// STUDENT NOT FOUND
// =====================================================

function StudentNotFound() {
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

      <p className="mt-2 max-w-md text-sm text-gray-500">
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

// =====================================================
// STUDENT PROFILE
// =====================================================

function StudentProfile({ student, courseCount }) {
  const initial =
    student.name?.charAt(0)?.toUpperCase() || "S";

  return (
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

      {/* COVER */}

      <div
        className="
          h-28
          bg-gradient-to-r
          from-indigo-600
          via-indigo-500
          to-violet-500
          sm:h-32
        "
      />

      {/* CONTENT */}

      <div className="px-6 pb-7 lg:px-8">

        <div
          className="
            -mt-12
            flex
            flex-col
            gap-6
            sm:flex-row
            sm:items-end
            sm:justify-between
          "
        >

          {/* PROFILE */}

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">

            {student.avatar ? (
              <img
                src={student.avatar}
                alt={student.name || "Student"}
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
                {initial}
              </div>
            )}

            <div className="pb-1">

              <div className="flex flex-wrap items-center gap-2">

                <h1 className="text-2xl font-bold text-gray-900">
                  {student.name || "Student"}
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

              {student.email && (
                <a
                  href={`mailto:${student.email}`}
                  className="
                    mt-2
                    inline-flex
                    items-center
                    gap-2
                    text-sm
                    text-gray-500
                    transition
                    hover:text-indigo-600
                  "
                >
                  <Mail size={15} />
                  {student.email}
                </a>
              )}

            </div>

          </div>

          {/* COURSE COUNT */}

          <div className="flex items-center gap-3">

            <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
              <BookOpen size={21} />
            </div>

            <div>
              <p className="text-xs text-gray-400">
                Enrolled Courses
              </p>

              <p className="text-xl font-bold text-gray-900">
                {courseCount}
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

// =====================================================
// COURSE PROGRESS CARD
// =====================================================

function CourseProgressCard({ item }) {
  const course = item.course || {};
  const progress = item.progress || {};

  const percentage = Math.min(
    Number(progress.percentage || 0),
    100,
  );

  const completedLectures =
    Number(progress.completedLectures || 0);

  const totalLectures =
    Number(progress.totalLectures || 0);

  const remainingLectures =
    Math.max(
      totalLectures - completedLectures,
      0,
    );

  const lectures = progress.lectures || [];

  const status = getCourseStatus({
    percentage,
    completedLectures,
    totalLectures,
  });

  return (
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

      {/* =================================================
          COURSE HEADER
      ================================================= */}

      <div className="border-b border-gray-100 p-6">

        <div
          className="
            flex
            flex-col
            gap-5
            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >

          {/* COURSE INFO */}

          <div className="flex min-w-0 items-center gap-4">

            {course.courseThumbnail?.url ? (
              <img
                src={course.courseThumbnail.url}
                alt={course.courseTitle || "Course"}
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

              <h2 className="truncate text-lg font-bold text-gray-900">
                {course.courseTitle || "Course"}
              </h2>

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
                  {course.courseLevel || "N/A"}
                </span>

                <span className="text-xs text-gray-400">
                  ₹{course.coursePrice || 0}
                </span>

              </div>

            </div>

          </div>

          <StatusBadge status={status} />

        </div>

        {/* =================================================
            PROGRESS
        ================================================= */}

        <div className="mt-6">

          <div className="mb-2 flex items-center justify-between">

            <div>

              <p className="text-sm font-semibold text-gray-900">
                Course Progress
              </p>

              <p className="mt-1 text-xs text-gray-400">
                {completedLectures} of{" "}
                {totalLectures} lectures completed
              </p>

            </div>

            <span className="text-lg font-bold text-indigo-600">
              {percentage}%
            </span>

          </div>

          <div className="h-3 overflow-hidden rounded-full bg-gray-100">

            <div
              className="
                h-full
                rounded-full
                bg-indigo-600
                transition-all
                duration-500
              "
              style={{
                width: `${percentage}%`,
              }}
            />

          </div>

          <div className="mt-2 flex justify-between text-xs text-gray-400">

            <span>
              {completedLectures} completed
            </span>

            <span>
              {remainingLectures} remaining
            </span>

          </div>

        </div>

      </div>

      {/* =================================================
          LAST ACTIVITY
      ================================================= */}

      {progress.lastActivity ? (
        <div className="border-b border-gray-100 bg-gray-50 px-6 py-4">

          <div className="flex items-center gap-3">

            <div className="rounded-xl bg-white p-2.5 text-indigo-600 shadow-sm">
              <Clock3 size={18} />
            </div>

            <div className="min-w-0">

              <p className="text-xs font-medium text-gray-400">
                Last Activity
              </p>

              <p className="mt-0.5 truncate font-semibold text-gray-900">
                {progress.lastActivity.lectureTitle ||
                  "Lecture activity"}
              </p>

              {progress.lastActivity.completedAt && (
                <p className="mt-0.5 text-xs text-gray-500">
                  Completed{" "}
                  {formatDateTime(
                    progress.lastActivity.completedAt,
                  )}
                </p>
              )}

            </div>

          </div>

        </div>
      ) : (
        <div className="border-b border-gray-100 bg-gray-50 px-6 py-4">

          <div className="flex items-center gap-3">

            <div className="rounded-xl bg-white p-2.5 text-gray-400 shadow-sm">
              <Clock3 size={18} />
            </div>

            <div>

              <p className="text-xs font-medium text-gray-400">
                Last Activity
              </p>

              <p className="mt-0.5 text-sm text-gray-500">
                No activity recorded yet
              </p>

            </div>

          </div>

        </div>
      )}

      {/* =================================================
          LECTURE PROGRESS
      ================================================= */}

      <div>

        <div className="border-b border-gray-100 px-6 py-5">

          <h3 className="font-semibold text-gray-900">
            Lecture Progress
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Track the student's progress through each lecture.
          </p>

        </div>

        {lectures.length === 0 ? (
          <div className="flex min-h-[180px] items-center justify-center px-6 text-center">

            <div>

              <BookOpen
                size={28}
                className="mx-auto text-gray-300"
              />

              <p className="mt-3 text-sm text-gray-500">
                Detailed lecture progress is not available yet.
              </p>

              <p className="mt-1 text-xs text-gray-400">
                Lecture progress will appear here once the
                backend returns individual lecture data.
              </p>

            </div>

          </div>
        ) : (
          <div className="divide-y divide-gray-100">

            {lectures.map((lecture) => (
              <LectureProgressRow
                key={
                  lecture._id ||
                  lecture.lecture ||
                  `${lecture.order}-${lecture.title}`
                }
                lecture={lecture}
              />
            ))}

          </div>
        )}

      </div>

      {/* =================================================
          ENROLLMENT DATE
      ================================================= */}

      <div className="border-t border-gray-100 px-6 py-4">

        <div className="flex items-center gap-2 text-sm text-gray-500">

          <CalendarDays
            size={16}
            className="text-gray-400"
          />

          <span>
            Enrolled{" "}
            {item.enrolledAt
              ? formatDate(item.enrolledAt)
              : "N/A"}
          </span>

        </div>

      </div>

    </div>
  );
}

// =====================================================
// LECTURE PROGRESS ROW
// =====================================================

function LectureProgressRow({ lecture }) {
  const completed = Boolean(lecture.completed);

  const watchedSeconds =
    Number(lecture.watchedSeconds || 0);

  const videoDuration =
    Number(
      lecture.videoDuration ||
        lecture.duration ||
        0,
    );

  const watchedPercentage =
    videoDuration > 0
      ? Math.min(
          Math.round(
            (watchedSeconds / videoDuration) * 100,
          ),
          100,
        )
      : 0;

  const lectureTitle =
    lecture.title ||
    lecture.lectureTitle ||
    "Lecture";

  const lectureOrder =
    lecture.order || "";

  return (
    <div
      className="
        flex
        flex-col
        gap-4
        px-6
        py-4
        transition
        hover:bg-gray-50
        sm:flex-row
        sm:items-center
      "
    >

      {/* STATUS */}

      <div className="shrink-0">

        {completed ? (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <CheckCircle2 size={20} />
          </div>
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-400">
            <Circle size={19} />
          </div>
        )}

      </div>

      {/* INFO */}

      <div className="min-w-0 flex-1">

        <div className="flex flex-wrap items-center gap-2">

          <p className="font-medium text-gray-900">
            {lectureOrder
              ? `${lectureOrder}. `
              : ""}
            {lectureTitle}
          </p>

          {completed && (
            <span
              className="
                rounded-full
                bg-emerald-50
                px-2
                py-0.5
                text-[10px]
                font-semibold
                text-emerald-600
              "
            >
              Completed
            </span>
          )}

        </div>

        {/* WATCHED PROGRESS */}

        {!completed && watchedSeconds > 0 && (
          <div className="mt-2">

            <div className="flex items-center justify-between text-xs text-gray-400">

              <span>
                Watched
              </span>

              <span>
                {watchedPercentage}%
              </span>

            </div>

            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-gray-100">

              <div
                className="h-full rounded-full bg-indigo-500"
                style={{
                  width: `${watchedPercentage}%`,
                }}
              />

            </div>

          </div>
        )}

        {completed && lecture.completedAt && (
          <p className="mt-1 text-xs text-gray-400">
            Completed{" "}
            {formatDateTime(lecture.completedAt)}
          </p>
        )}

      </div>

      {/* STATUS TEXT */}

      <div className="shrink-0">

        {completed ? (
          <span className="text-sm font-medium text-emerald-600">
            Completed
          </span>
        ) : watchedSeconds > 0 ? (
          <span className="text-sm font-medium text-amber-600">
            In Progress
          </span>
        ) : (
          <span className="text-sm font-medium text-gray-400">
            Not Started
          </span>
        )}

      </div>

    </div>
  );
}

// =====================================================
// COURSE STATUS
// =====================================================

function getCourseStatus({
  percentage,
  completedLectures,
  totalLectures,
}) {
  if (
    totalLectures > 0 &&
    completedLectures >= totalLectures
  ) {
    return "Completed";
  }

  if (completedLectures > 0 || percentage > 0) {
    return "In Progress";
  }

  return "Not Started";
}

// =====================================================
// STATUS BADGE
// =====================================================

function StatusBadge({ status }) {
  const styles = {
    Completed: "bg-emerald-50 text-emerald-600",
    "In Progress": "bg-indigo-50 text-indigo-600",
    "Not Started": "bg-gray-100 text-gray-500",
  };

  return (
    <span
      className={`
        inline-flex
        shrink-0
        items-center
        rounded-full
        px-3
        py-1.5
        text-xs
        font-semibold
        ${styles[status] || styles["Not Started"]}
      `}
    >
      {status}
    </span>
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

        <div
          className={`rounded-xl p-3 ${iconClass}`}
        >
          {icon}
        </div>

      </div>
    </div>
  );
}

// =====================================================
// EMPTY COURSES
// =====================================================

function EmptyCourses() {
  return (
    <div
      className="
        flex
        min-h-[300px]
        flex-col
        items-center
        justify-center
        rounded-2xl
        border
        border-gray-200
        bg-white
        px-6
        text-center
        shadow-sm
      "
    >

      <div className="rounded-full bg-gray-100 p-4">
        <BookOpen
          size={28}
          className="text-gray-400"
        />
      </div>

      <h3 className="mt-4 font-semibold text-gray-900">
        No courses found
      </h3>

      <p className="mt-2 text-sm text-gray-500">
        This student is not enrolled in any of your courses.
      </p>

    </div>
  );
}

// =====================================================
// DATE HELPERS
// =====================================================

function formatDate(date) {
  if (!date) return "N/A";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "N/A";
  }

  return parsedDate.toLocaleDateString();
}

function formatDateTime(date) {
  if (!date) return "N/A";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "N/A";
  }

  return parsedDate.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default InstructorStudentDetails;
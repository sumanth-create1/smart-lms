import { useEffect, useMemo, useState } from "react";
import {
  Users,
  Search,
  LoaderCircle,
  Mail,
  BookOpen,
  CalendarDays,
  UserRound,
} from "lucide-react";
import toast from "react-hot-toast";

import api from "../../services/api";

function InstructorStudents() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // =====================================================
  // FETCH STUDENTS
  // =====================================================

  const fetchStudents = async () => {
    try {
      setLoading(true);

      const response = await api.get("/dashboard/instructor/students");

      if (response.data?.success) {
        setEnrollments(response.data.data || []);
      } else {
        toast.error(
          response.data?.message || "Failed to load students",
        );
      }
    } catch (error) {
      console.error("Instructor students error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to load students",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // =====================================================
  // FILTER STUDENTS
  // =====================================================

  const filteredEnrollments = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return enrollments;
    }

    return enrollments.filter((enrollment) => {
      const studentName =
        enrollment.student?.name?.toLowerCase() || "";

      const studentEmail =
        enrollment.student?.email?.toLowerCase() || "";

      const courseTitle =
        enrollment.course?.courseTitle?.toLowerCase() || "";

      return (
        studentName.includes(query) ||
        studentEmail.includes(query) ||
        courseTitle.includes(query)
      );
    });
  }, [enrollments, search]);

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
            Loading students...
          </p>
        </div>
      </div>
    );
  }

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
          Instructor
        </p>

        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Students
        </h1>

        <p className="mt-2 text-gray-500">
          View and manage students enrolled in your courses.
        </p>
      </div>

      {/* =================================================
          STATS
      ================================================= */}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

        <InfoCard
          title="Total Enrollments"
          value={enrollments.length}
          icon={<Users size={22} />}
          iconClass="bg-indigo-50 text-indigo-600"
        />

        <InfoCard
          title="Active Students"
          value={new Set(
            enrollments
              .map((item) => item.student?._id)
              .filter(Boolean),
          ).size}
          icon={<UserRound size={22} />}
          iconClass="bg-emerald-50 text-emerald-600"
        />

        <InfoCard
          title="Courses Enrolled"
          value={new Set(
            enrollments
              .map((item) => item.course?._id)
              .filter(Boolean),
          ).size}
          icon={<BookOpen size={22} />}
          iconClass="bg-amber-50 text-amber-600"
        />

      </div>

      {/* =================================================
          SEARCH
      ================================================= */}

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

        <div className="relative max-w-xl">

          <Search
            size={19}
            className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-gray-400
            "
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search students, email or course..."
            className="
              w-full
              rounded-xl
              border
              border-gray-200
              bg-gray-50
              py-3
              pl-11
              pr-4
              text-sm
              text-gray-900
              outline-none
              transition
              placeholder:text-gray-400
              focus:border-indigo-500
              focus:bg-white
              focus:ring-4
              focus:ring-indigo-50
            "
          />

        </div>

      </div>

      {/* =================================================
          STUDENT TABLE
      ================================================= */}

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

        {/* TABLE HEADER */}

        <div className="border-b border-gray-100 px-6 py-5">

          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Enrolled Students
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {filteredEnrollments.length}{" "}
                {filteredEnrollments.length === 1
                  ? "enrollment"
                  : "enrollments"}{" "}
                found
              </p>
            </div>

          </div>

        </div>

        {/* EMPTY */}

        {filteredEnrollments.length === 0 ? (
          <EmptyStudents search={search} />
        ) : (
          <>

            {/* DESKTOP TABLE */}

            <div className="hidden overflow-x-auto md:block">

              <table className="w-full">

                <thead className="bg-gray-50">

                  <tr>

                    <th
                      className="
                        px-6
                        py-4
                        text-left
                        text-xs
                        font-semibold
                        uppercase
                        tracking-wider
                        text-gray-500
                      "
                    >
                      Student
                    </th>

                    <th
                      className="
                        px-6
                        py-4
                        text-left
                        text-xs
                        font-semibold
                        uppercase
                        tracking-wider
                        text-gray-500
                      "
                    >
                      Course
                    </th>

                    <th
                      className="
                        px-6
                        py-4
                        text-left
                        text-xs
                        font-semibold
                        uppercase
                        tracking-wider
                        text-gray-500
                      "
                    >
                      Level
                    </th>

                    <th
                      className="
                        px-6
                        py-4
                        text-left
                        text-xs
                        font-semibold
                        uppercase
                        tracking-wider
                        text-gray-500
                      "
                    >
                      Enrolled
                    </th>

                    <th
                      className="
                        px-6
                        py-4
                        text-left
                        text-xs
                        font-semibold
                        uppercase
                        tracking-wider
                        text-gray-500
                      "
                    >
                      Email
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-gray-100">

                  {filteredEnrollments.map((enrollment) => {

                    const student = enrollment.student;
                    const course = enrollment.course;

                    return (
                      <tr
                        key={enrollment._id}
                        className="transition hover:bg-gray-50"
                      >

                        {/* STUDENT */}

                        <td className="px-6 py-5">

                          <div className="flex items-center gap-3">

                            {student?.avatar ? (
                              <img
                                src={student.avatar}
                                alt={student.name}
                                className="
                                  h-11
                                  w-11
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
                                  font-bold
                                  text-indigo-600
                                "
                              >
                                {student?.name
                                  ?.charAt(0)
                                  ?.toUpperCase() || "S"}
                              </div>
                            )}

                            <div className="min-w-0">

                              <p className="font-semibold text-gray-900">
                                {student?.name || "Student"}
                              </p>

                              <p className="mt-1 text-xs text-gray-500">
                                Student
                              </p>

                            </div>

                          </div>

                        </td>

                        {/* COURSE */}

                        <td className="px-6 py-5">

                          <div className="flex items-center gap-2">

                            <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
                              <BookOpen size={16} />
                            </div>

                            <div>
                              <p className="max-w-[220px] truncate font-medium text-gray-900">
                                {course?.courseTitle || "Course"}
                              </p>

                              <p className="mt-1 text-xs text-gray-400">
                                ₹{course?.coursePrice || 0}
                              </p>
                            </div>

                          </div>

                        </td>

                        {/* LEVEL */}

                        <td className="px-6 py-5">

                          <span
                            className="
                              inline-flex
                              rounded-full
                              bg-indigo-50
                              px-3
                              py-1.5
                              text-xs
                              font-medium
                              text-indigo-600
                            "
                          >
                            {course?.courseLevel || "N/A"}
                          </span>

                        </td>

                        {/* DATE */}

                        <td className="px-6 py-5">

                          <div className="flex items-center gap-2 text-sm text-gray-600">

                            <CalendarDays
                              size={16}
                              className="text-gray-400"
                            />

                            {enrollment.enrolledAt
                              ? new Date(
                                  enrollment.enrolledAt,
                                ).toLocaleDateString()
                              : "N/A"}

                          </div>

                        </td>

                        {/* EMAIL */}

                        <td className="px-6 py-5">

                          <a
                            href={`mailto:${student?.email || ""}`}
                            className="
                              inline-flex
                              items-center
                              gap-2
                              text-sm
                              text-gray-600
                              transition
                              hover:text-indigo-600
                            "
                          >
                            <Mail
                              size={16}
                              className="text-gray-400"
                            />

                            <span className="max-w-[220px] truncate">
                              {student?.email || "No email"}
                            </span>

                          </a>

                        </td>

                      </tr>
                    );
                  })}

                </tbody>

              </table>

            </div>

            {/* =================================================
                MOBILE CARDS
            ================================================= */}

            <div className="divide-y divide-gray-100 md:hidden">

              {filteredEnrollments.map((enrollment) => {

                const student = enrollment.student;
                const course = enrollment.course;

                return (
                  <div
                    key={enrollment._id}
                    className="p-5"
                  >

                    <div className="flex items-start gap-4">

                      {student?.avatar ? (
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="
                            h-12
                            w-12
                            shrink-0
                            rounded-full
                            object-cover
                          "
                        />
                      ) : (
                        <div
                          className="
                            flex
                            h-12
                            w-12
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            bg-indigo-50
                            font-bold
                            text-indigo-600
                          "
                        >
                          {student?.name
                            ?.charAt(0)
                            ?.toUpperCase() || "S"}
                        </div>
                      )}

                      <div className="min-w-0 flex-1">

                        <h3 className="font-semibold text-gray-900">
                          {student?.name || "Student"}
                        </h3>

                        <p className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                          <Mail size={14} />
                          <span className="truncate">
                            {student?.email || "No email"}
                          </span>
                        </p>

                      </div>

                    </div>

                    <div className="mt-5 rounded-xl bg-gray-50 p-4">

                      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                        Enrolled Course
                      </p>

                      <p className="mt-1 font-semibold text-gray-900">
                        {course?.courseTitle || "Course"}
                      </p>

                      <div className="mt-3 flex flex-wrap items-center gap-2">

                        <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-600">
                          {course?.courseLevel || "N/A"}
                        </span>

                        <span className="text-xs text-gray-500">
                          ₹{course?.coursePrice || 0}
                        </span>

                      </div>

                      <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">

                        <CalendarDays size={14} />

                        Enrolled{" "}
                        {enrollment.enrolledAt
                          ? new Date(
                              enrollment.enrolledAt,
                            ).toLocaleDateString()
                          : "N/A"}

                      </div>

                    </div>

                  </div>
                );
              })}

            </div>

          </>
        )}

      </div>
    </div>
  );
}

// =====================================================
// INFO CARD
// =====================================================

function InfoCard({
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

        <div className={`rounded-xl p-3 ${iconClass}`}>
          {icon}
        </div>

      </div>

    </div>
  );
}

// =====================================================
// EMPTY STATE
// =====================================================

function EmptyStudents({ search }) {
  return (
    <div className="flex min-h-[350px] flex-col items-center justify-center px-6 text-center">

      <div className="rounded-full bg-gray-100 p-4">
        <Users
          size={28}
          className="text-gray-400"
        />
      </div>

      <h3 className="mt-4 font-semibold text-gray-900">
        {search
          ? "No students found"
          : "No students yet"}
      </h3>

      <p className="mt-2 max-w-md text-sm text-gray-500">
        {search
          ? "Try searching with a different student name, email, or course."
          : "Students who enroll in your courses will appear here."}
      </p>

    </div>
  );
}

export default InstructorStudents;
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Edit3,
  IndianRupee,
  LoaderCircle,
  Plus,
  Trash2,
  Users,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../services/api";

function InstructorCourses() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const fetchCourses = async () => {
    try {
      setLoading(true);

      const response = await api.get("/course/instructor");

      if (response.data?.success) {
        setCourses(response.data.courses || []);
      } else {
        toast.error(
          response.data?.message ||
            "Failed to load your courses."
        );
      }
    } catch (error) {
      console.error("Instructor courses error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to load your courses."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = async (courseId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this course?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(courseId);

      const response = await api.delete(
        `/course/${courseId}`
      );

      if (response.data?.success) {
        toast.success("Course deleted successfully.");

        setCourses((prev) =>
          prev.filter((course) => course._id !== courseId)
        );
      } else {
        toast.error(
          response.data?.message ||
            "Failed to delete course."
        );
      }
    } catch (error) {
      console.error("Delete course error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to delete course."
      );
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <LoaderCircle
            size={36}
            className="animate-spin text-indigo-600"
          />

          <p className="text-sm text-gray-500">
            Loading your courses...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#F7F6F2] p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        {/* =========================
            HEADER
        ========================= */}

        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <p className="mb-1 text-sm font-medium text-indigo-600">
              Instructor
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-[#15121F]">
              My Courses
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Manage the courses you have created.
            </p>
          </div>

          <Link
            to="/instructor/create-course"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            <Plus size={18} />
            Create Course
          </Link>
        </div>

        {/* =========================
            COURSE COUNT
        ========================= */}

        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <BookOpen size={20} />
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-900">
              {courses.length}{" "}
              {courses.length === 1
                ? "Course"
                : "Courses"}
            </p>

            <p className="text-xs text-gray-500">
              Created by you
            </p>
          </div>
        </div>

        {/* =========================
            EMPTY STATE
        ========================= */}

        {courses.length === 0 ? (
          <div className="rounded-3xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <BookOpen size={30} />
            </div>

            <h2 className="mt-5 text-xl font-semibold text-gray-900">
              No courses yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              You haven't created any courses yet.
              Create your first course and start
              adding lectures for your students.
            </p>

            <Link
              to="/instructor/create-course"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              <Plus size={18} />
              Create Your First Course
            </Link>
          </div>
        ) : (
          /* =========================
             COURSE GRID
          ========================= */

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">

            {courses.map((course) => (
              <CourseCard
                key={course._id}
                course={course}
                deleting={deletingId === course._id}
                onDelete={handleDelete}
                onManage={() =>
                  navigate(
                    `/instructor/course/${course._id}`
                  )
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


/* =====================================================
   COURSE CARD
===================================================== */

function CourseCard({
  course,
  deleting,
  onDelete,
  onManage,
}) {
  const thumbnail =
    course.courseThumbnail?.url ||
    "/placeholder-course.jpg";

  return (
    <div className="group overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">

      {/* Thumbnail */}

      <div className="relative aspect-video overflow-hidden bg-gray-100">

        <img
          src={thumbnail}
          alt={course.courseTitle}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src =
              "/placeholder-course.jpg";
          }}
        />

        <div className="absolute left-4 top-4">
          <span className="rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-indigo-600 shadow-sm">
            {course.courseLevel || "Course"}
          </span>
        </div>
      </div>

      {/* Content */}

      <div className="p-5">

        <div className="mb-4">

          <h2 className="line-clamp-2 min-h-[56px] text-lg font-bold text-gray-900">
            {course.courseTitle}
          </h2>

          <p className="mt-2 line-clamp-2 text-sm leading-5 text-gray-500">
            {course.subTitle ||
              "No subtitle available."}
          </p>
        </div>

        {/* Category */}

        {course.category && (
          <span className="inline-flex rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600">
            {course.category}
          </span>
        )}

        {/* Stats */}

        <div className="mt-5 grid grid-cols-2 gap-3">

          <div className="rounded-xl bg-gray-50 p-3">
            <div className="flex items-center gap-2 text-gray-400">
              <Users size={15} />

              <span className="text-xs">
                Students
              </span>
            </div>

            <p className="mt-1 font-semibold text-gray-900">
              {course.studentCount || 0}
            </p>
          </div>

          <div className="rounded-xl bg-gray-50 p-3">
            <div className="flex items-center gap-2 text-gray-400">
              <IndianRupee size={15} />

              <span className="text-xs">
                Price
              </span>
            </div>

            <p className="mt-1 font-semibold text-gray-900">
              ₹{course.coursePrice || 0}
            </p>
          </div>
        </div>

        {/* Actions */}

        <div className="mt-5 flex gap-2">

          <button
            type="button"
            onClick={onManage}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Manage
            <ArrowRight size={16} />
          </button>

          <button
            type="button"
            onClick={() => onDelete(course._id)}
            disabled={deleting}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
            title="Delete course"
          >
            {deleting ? (
              <LoaderCircle
                size={17}
                className="animate-spin"
              />
            ) : (
              <Trash2 size={17} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default InstructorCourses;
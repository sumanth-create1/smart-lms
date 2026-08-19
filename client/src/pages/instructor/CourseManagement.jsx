import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  Edit3,
  IndianRupee,
  LoaderCircle,
  Plus,
  Save,
  Trash2,
  Users,
  Film,
} from "lucide-react";
import toast from "react-hot-toast";

import api from "../../services/api";

function CourseManagement() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    courseTitle: "",
    subTitle: "",
    description: "",
    category: "",
    courseLevel: "",
    coursePrice: "",
  });

  /* =====================================================
     NAVIGATION
  ===================================================== */

  const goToLectures = () => {
    navigate(`/instructor/courses/${courseId}/lectures`);
  };

  /* =====================================================
     FETCH COURSE
  ===================================================== */

  const fetchCourse = async () => {
    try {
      setLoading(true);

      const response = await api.get(`/course/${courseId}`);

      if (response.data?.success) {
        const courseData = response.data.course;

        setCourse(courseData);

        setFormData({
          courseTitle: courseData.courseTitle || "",
          subTitle: courseData.subTitle || "",
          description: courseData.description || "",
          category: courseData.category || "",
          courseLevel: courseData.courseLevel || "",
          coursePrice: courseData.coursePrice ?? "",
        });
      } else {
        toast.error(
          response.data?.message || "Failed to load course."
        );
      }
    } catch (error) {
      console.error("Course management error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to load course."
      );

      navigate("/instructor/courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  /* =====================================================
     HANDLE INPUT
  ===================================================== */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =====================================================
     UPDATE COURSE
  ===================================================== */

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (saving) return;

    if (!formData.courseTitle.trim()) {
      toast.error("Course title is required.");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Course description is required.");
      return;
    }

    if (!formData.category) {
      toast.error("Please select a category.");
      return;
    }

    if (!formData.courseLevel) {
      toast.error("Please select a course level.");
      return;
    }

    try {
      setSaving(true);

      const response = await api.put(`/course/${courseId}`, {
        courseTitle: formData.courseTitle.trim(),
        subTitle: formData.subTitle.trim(),
        description: formData.description.trim(),
        category: formData.category,
        courseLevel: formData.courseLevel,
        coursePrice: Number(formData.coursePrice),
      });

      if (response.data?.success) {
        setCourse(response.data.course);
        setEditing(false);

        toast.success("Course updated successfully.");
      } else {
        toast.error(
          response.data?.message ||
            "Failed to update course."
        );
      }
    } catch (error) {
      console.error("Update course error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to update course."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =====================================================
     DELETE COURSE
  ===================================================== */

  const handleDeleteCourse = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this course? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      const response = await api.delete(`/course/${courseId}`);

      if (response.data?.success) {
        toast.success("Course deleted successfully.");

        navigate("/instructor/courses", {
          replace: true,
        });
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
    }
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <LoaderCircle
            size={36}
            className="animate-spin text-indigo-600"
          />

          <p className="text-sm text-gray-500">
            Loading course...
          </p>
        </div>
      </div>
    );
  }

  /* =====================================================
     COURSE NOT FOUND
  ===================================================== */

  if (!course) {
    return (
      <div className="flex min-h-[500px] flex-col items-center justify-center px-6 text-center">
        <div className="rounded-2xl bg-gray-100 p-4">
          <BookOpen
            size={30}
            className="text-gray-400"
          />
        </div>

        <h2 className="mt-4 text-xl font-semibold text-gray-900">
          Course not found
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          The course you're looking for doesn't exist.
        </p>

        <button
          type="button"
          onClick={() =>
            navigate("/instructor/courses")
          }
          className="mt-5 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Back to Courses
        </button>
      </div>
    );
  }

  const thumbnail =
    course.courseThumbnail?.url ||
    "/placeholder-course.jpg";

  return (
    <div className="min-h-full bg-[#F7F6F2] p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-8">
          <button
            type="button"
            onClick={() =>
              navigate("/instructor/courses")
            }
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-gray-900"
          >
            <ArrowLeft size={18} />
            Back to Courses
          </button>

          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="mb-1 text-sm font-medium text-indigo-600">
                Course Management
              </p>

              <h1 className="max-w-3xl text-3xl font-bold tracking-tight text-[#15121F]">
                {course.courseTitle}
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Manage your course information and content.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">

              {!editing && (
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-indigo-200 hover:text-indigo-600"
                >
                  <Edit3 size={17} />
                  Edit Course
                </button>
              )}

              <button
                type="button"
                onClick={goToLectures}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
              >
                <Film size={17} />
                Manage Lectures
              </button>

              <button
                type="button"
                onClick={handleDeleteCourse}
                className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100"
              >
                <Trash2 size={17} />
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* =================================================
            MAIN GRID
        ================================================= */}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">

          {/* =================================================
              LEFT
          ================================================= */}

          <div className="space-y-6">

            {/* COURSE PREVIEW */}

            <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">

              <div className="relative aspect-[16/6] overflow-hidden bg-gray-100">

                <img
                  src={thumbnail}
                  alt={course.courseTitle}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src =
                      "/placeholder-course.jpg";
                  }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                <div className="absolute bottom-5 left-6 right-6">

                  <span className="inline-flex rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-indigo-600 shadow-sm">
                    {course.courseLevel}
                  </span>

                  <h2 className="mt-3 text-2xl font-bold text-white">
                    {course.courseTitle}
                  </h2>
                </div>
              </div>

              <div className="p-6">

                <p className="text-base font-medium text-gray-700">
                  {course.subTitle}
                </p>

                <p className="mt-4 whitespace-pre-line text-sm leading-7 text-gray-500">
                  {course.description}
                </p>

                <div className="mt-6 flex flex-wrap gap-3">

                  <InfoBadge
                    icon={<BookOpen size={15} />}
                    label={course.category}
                  />

                  <InfoBadge
                    icon={<IndianRupee size={15} />}
                    label={`₹${course.coursePrice || 0}`}
                  />

                  <InfoBadge
                    icon={<Users size={15} />}
                    label={`${course.studentCount || 0} Students`}
                  />
                </div>
              </div>
            </div>

            {/* =================================================
                COURSE CONTENT
            ================================================= */}

            <div className="rounded-3xl border border-gray-200 bg-white shadow-sm">

              <div className="flex flex-col gap-4 border-b border-gray-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">

                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Course Content
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Add lectures and organize your course.
                  </p>
                </div>

                {/* UPDATED LINK */}

                <button
                  type="button"
                  onClick={goToLectures}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                >
                  <Plus size={17} />
                  Add Lecture
                </button>
              </div>

              <div className="flex min-h-[240px] flex-col items-center justify-center px-6 py-12 text-center">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                  <BookOpen size={25} />
                </div>

                <h3 className="mt-4 font-semibold text-gray-900">
                  Manage your lectures
                </h3>

                <p className="mt-1 max-w-sm text-sm leading-6 text-gray-500">
                  Create lectures, upload videos, edit lecture
                  titles and enable free previews.
                </p>

                {/* UPDATED LINK */}

                <button
                  type="button"
                  onClick={goToLectures}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-100"
                >
                  <Film size={17} />
                  Manage Lectures
                </button>
              </div>
            </div>
          </div>

          {/* =================================================
              RIGHT SIDEBAR
          ================================================= */}

          <div className="space-y-6">

            {/* COURSE DETAILS */}

            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">

              <h2 className="text-lg font-semibold text-gray-900">
                Course Details
              </h2>

              <div className="mt-5 space-y-4">

                <DetailRow
                  label="Category"
                  value={course.category || "—"}
                />

                <DetailRow
                  label="Level"
                  value={course.courseLevel || "—"}
                />

                <DetailRow
                  label="Price"
                  value={`₹${course.coursePrice || 0}`}
                />

                <DetailRow
                  label="Students"
                  value={course.studentCount || 0}
                />

                <DetailRow
                  label="Created"
                  value={
                    course.createdAt
                      ? new Date(
                          course.createdAt
                        ).toLocaleDateString()
                      : "—"
                  }
                />
              </div>
            </div>

            {/* QUICK ACTIONS */}

            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">

              <h2 className="text-lg font-semibold text-gray-900">
                Quick Actions
              </h2>

              <div className="mt-5 space-y-3">

                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="flex w-full items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                >
                  <Edit3 size={18} />
                  Edit Course
                </button>

                {/* UPDATED LINK */}

                <button
                  type="button"
                  onClick={goToLectures}
                  className="flex w-full items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                >
                  <Plus size={18} />
                  Add Lecture
                </button>

                {/* NEW MANAGE LECTURES LINK */}

                <button
                  type="button"
                  onClick={goToLectures}
                  className="flex w-full items-center gap-3 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-left text-sm font-semibold text-indigo-600 transition hover:bg-indigo-100"
                >
                  <Film size={18} />
                  Manage Lectures
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* =================================================
            EDIT MODAL
        ================================================= */}

        {editing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6 backdrop-blur-sm">

            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">

              {/* MODAL HEADER */}

              <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">

                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Edit Course
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Update your course information.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100"
                >
                  Close
                </button>
              </div>

              {/* FORM */}

              <form
                onSubmit={handleUpdate}
                className="space-y-5 p-6"
              >

                <InputField
                  label="Course Title"
                  name="courseTitle"
                  value={formData.courseTitle}
                  onChange={handleChange}
                />

                <InputField
                  label="Subtitle"
                  name="subTitle"
                  value={formData.subTitle}
                  onChange={handleChange}
                />

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={6}
                    required
                    className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm leading-6 text-gray-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Category
                    </label>

                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                    >
                      <option value="">
                        Select category
                      </option>

                      <option value="Web Development">
                        Web Development
                      </option>

                      <option value="Programming">
                        Programming
                      </option>

                      <option value="Data Science">
                        Data Science
                      </option>

                      <option value="Mobile Development">
                        Mobile Development
                      </option>

                      <option value="Database">
                        Database
                      </option>

                      <option value="DevOps">
                        DevOps
                      </option>

                      <option value="Other">
                        Other
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Course Level
                    </label>

                    <select
                      name="courseLevel"
                      value={formData.courseLevel}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                    >
                      <option value="">
                        Select level
                      </option>

                      <option value="Beginner">
                        Beginner
                      </option>

                      <option value="Intermediate">
                        Intermediate
                      </option>

                      <option value="Advanced">
                        Advanced
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Course Price
                  </label>

                  <div className="relative">

                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-500">
                      ₹
                    </span>

                    <input
                      type="number"
                      name="coursePrice"
                      value={formData.coursePrice}
                      onChange={handleChange}
                      min="0"
                      required
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-9 pr-4 text-sm text-gray-900 outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                    />
                  </div>
                </div>

                {/* BUTTONS */}

                <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">

                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    disabled={saving}
                    className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? (
                      <>
                        <LoaderCircle
                          size={17}
                          className="animate-spin"
                        />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={17} />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* =====================================================
   INPUT FIELD
===================================================== */

function InputField({
  label,
  name,
  value,
  onChange,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-700">
        {label}
      </label>

      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        required
        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
      />
    </div>
  );
}

/* =====================================================
   INFO BADGE
===================================================== */

function InfoBadge({ icon, label }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2 text-xs font-medium text-gray-600">
      {icon}
      {label}
    </div>
  );
}

/* =====================================================
   DETAIL ROW
===================================================== */

function DetailRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3 last:border-0 last:pb-0">
      <span className="text-sm text-gray-500">
        {label}
      </span>

      <span className="text-right text-sm font-semibold text-gray-900">
        {value}
      </span>
    </div>
  );
}

export default CourseManagement;
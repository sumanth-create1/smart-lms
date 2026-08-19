import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ImagePlus,
  LoaderCircle,
  Upload,
} from "lucide-react";

import api from "../../services/api";

function CreateCourse() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    courseTitle: "",
    subTitle: "",
    description: "",
    category: "",
    courseLevel: "",
    coursePrice: "",
  });

  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================
  // CLEANUP PREVIEW URL
  // ==========================================

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  // ==========================================
  // INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  // ==========================================
  // THUMBNAIL CHANGE
  // ==========================================

  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setError("Please upload a JPG, PNG, or WEBP image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Thumbnail must be smaller than 5MB.");
      return;
    }

    setThumbnail(file);
    setPreview(URL.createObjectURL(file));
    setError("");
  };

  // ==========================================
  // VALIDATE FORM
  // ==========================================

  const validateForm = () => {
    const title = formData.courseTitle.trim();
    const subtitle = formData.subTitle.trim();
    const description = formData.description.trim();

    if (!title) {
      return "Please enter a course title.";
    }

    if (title.length < 5) {
      return "Course title must contain at least 5 characters.";
    }

    if (!subtitle) {
      return "Please enter a course subtitle.";
    }

    if (!description) {
      return "Please enter a course description.";
    }

    if (description.length < 20) {
      return "Course description should contain at least 20 characters.";
    }

    if (!formData.category) {
      return "Please select a category.";
    }

    if (!formData.courseLevel) {
      return "Please select a course level.";
    }

    if (formData.coursePrice === "" || Number(formData.coursePrice) < 0) {
      return "Please enter a valid course price.";
    }

    if (!thumbnail) {
      return "Please upload a course thumbnail.";
    }

    return null;
  };

  // ==========================================
  // CREATE COURSE
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setError("");
    setSuccess("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      // ======================================
      // STEP 1: CREATE COURSE
      // ======================================

      const courseResponse = await api.post("/course/create", {
        courseTitle: formData.courseTitle.trim(),
        subTitle: formData.subTitle.trim(),
        description: formData.description.trim(),
        category: formData.category,
        courseLevel: formData.courseLevel,
        coursePrice: Number(formData.coursePrice),
      });

      const createdCourse = courseResponse.data?.course;

      if (!createdCourse?._id) {
        throw new Error("Course was created, but no course ID was returned.");
      }

      // ======================================
      // STEP 2: UPLOAD THUMBNAIL
      // ======================================

      const thumbnailData = new FormData();

      thumbnailData.append("thumbnail", thumbnail);

      await api.put(`/course/thumbnail/${createdCourse._id}`, thumbnailData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // ======================================
      // STEP 3: SUCCESS
      // ======================================

      setSuccess("Course created successfully!");

      // ======================================
      // STEP 4: REDIRECT
      // ======================================

      setTimeout(() => {
        navigate("/instructor/courses", {
          replace: true,
        });
      }, 700);
    } catch (error) {
      console.error("Create course error:", error);

      setError(
        error.response?.data?.message ||
          error.message ||
          "Unable to create course. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="min-h-full bg-[#F7F6F2] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* ====================================
            HEADER
        ===================================== */}

        <div className="mb-8">
          <button
            type="button"
            onClick={() => navigate("/instructor/courses")}
            disabled={loading}
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ArrowLeft size={18} />
            Back to Courses
          </button>

          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-sm">
              <BookOpen size={24} />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[#15121F] sm:text-3xl">
                Create Course
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Create a new course and start building your learning content.
              </p>
            </div>
          </div>
        </div>

        {/* ====================================
            ERROR
        ===================================== */}

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">
            <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-red-500" />

            <p className="leading-5">{error}</p>
          </div>
        )}

        {/* ====================================
            SUCCESS
        ===================================== */}

        {success && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm font-medium text-emerald-700">
            <CheckCircle2 size={19} />

            <span>{success}</span>
          </div>
        )}

        {/* ====================================
            FORM
        ===================================== */}

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            {/* ==================================
                COURSE INFORMATION
            ================================== */}

            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-[#15121F]">
                  Course Information
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Add the basic information students will see about your course.
                </p>
              </div>

              <div className="space-y-6">
                {/* TITLE */}

                <div>
                  <label
                    htmlFor="courseTitle"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Course Title
                  </label>

                  <input
                    id="courseTitle"
                    type="text"
                    name="courseTitle"
                    value={formData.courseTitle}
                    onChange={handleChange}
                    placeholder="e.g. Advanced MERN Stack Development"
                    disabled={loading}
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>

                {/* SUBTITLE */}

                <div>
                  <label
                    htmlFor="subTitle"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Course Subtitle
                  </label>

                  <input
                    id="subTitle"
                    type="text"
                    name="subTitle"
                    value={formData.subTitle}
                    onChange={handleChange}
                    placeholder="Build real-world applications with MERN"
                    disabled={loading}
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>

                {/* DESCRIPTION */}

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="description"
                      className="block text-sm font-semibold text-gray-700"
                    >
                      Description
                    </label>

                    <span className="text-xs text-gray-400">
                      {formData.description.length} characters
                    </span>
                  </div>

                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Explain what students will learn in this course..."
                    rows={7}
                    disabled={loading}
                    required
                    className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm leading-6 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>

                {/* CATEGORY + LEVEL */}

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="category"
                      className="mb-2 block text-sm font-semibold text-gray-700"
                    >
                      Category
                    </label>

                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      disabled={loading}
                      required
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-gray-700 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <option value="">Select category</option>

                      <option value="Web Development">Web Development</option>

                      <option value="Programming">Programming</option>

                      <option value="Data Science">Data Science</option>

                      <option value="Mobile Development">
                        Mobile Development
                      </option>

                      <option value="Database">Database</option>

                      <option value="DevOps">DevOps</option>

                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="courseLevel"
                      className="mb-2 block text-sm font-semibold text-gray-700"
                    >
                      Course Level
                    </label>

                    <select
                      id="courseLevel"
                      name="courseLevel"
                      value={formData.courseLevel}
                      onChange={handleChange}
                      disabled={loading}
                      required
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-gray-700 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <option value="">Select level</option>

                      <option value="Beginner">Beginner</option>

                      <option value="Intermediate">Intermediate</option>

                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                {/* PRICE */}

                <div>
                  <label
                    htmlFor="coursePrice"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Course Price
                  </label>

                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-500">
                      ₹
                    </span>

                    <input
                      id="coursePrice"
                      type="number"
                      name="coursePrice"
                      value={formData.coursePrice}
                      onChange={handleChange}
                      placeholder="1499"
                      min="0"
                      step="1"
                      disabled={loading}
                      required
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-9 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </div>

                  <p className="mt-2 text-xs text-gray-400">
                    Set the amount students will pay to enroll in your course.
                  </p>
                </div>
              </div>
            </div>

            {/* ==================================
                THUMBNAIL
            ================================== */}

            <div className="h-fit rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-5">
                <h2 className="text-lg font-semibold text-[#15121F]">
                  Course Thumbnail
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Choose an image that represents your course.
                </p>
              </div>

              {/* UPLOAD AREA */}

              <label
                htmlFor="thumbnail"
                className={`group block ${
                  loading ? "cursor-not-allowed" : "cursor-pointer"
                }`}
              >
                <div className="relative aspect-video overflow-hidden rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 transition group-hover:border-indigo-400 group-hover:bg-indigo-50/30">
                  {preview ? (
                    <>
                      <img
                        src={preview}
                        alt="Course thumbnail preview"
                        className="h-full w-full object-cover"
                      />

                      {!loading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition group-hover:opacity-100">
                          <span className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-gray-800 shadow-lg">
                            <Upload size={16} />
                            Change Image
                          </span>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
                        <ImagePlus size={26} />
                      </div>

                      <p className="text-sm font-semibold text-gray-700">
                        Upload Thumbnail
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        JPG, PNG or WEBP
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        Maximum size: 5MB
                      </p>
                    </div>
                  )}
                </div>
              </label>

              <input
                id="thumbnail"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleThumbnailChange}
                disabled={loading}
                className="hidden"
              />

              {/* SELECTED FILE */}

              {thumbnail && (
                <div className="mt-4 rounded-xl bg-gray-50 px-4 py-3">
                  <p className="truncate text-xs font-medium text-gray-700">
                    {thumbnail.name}
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    {(thumbnail.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              )}

              {/* CREATE BUTTON */}

              <button
                type="submit"
                disabled={loading}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <LoaderCircle size={18} className="animate-spin" />
                    Creating Course...
                  </>
                ) : (
                  <>
                    <BookOpen size={18} />
                    Create Course
                  </>
                )}
              </button>

              <p className="mt-3 text-center text-xs leading-5 text-gray-400">
                Your course will be created first, then the thumbnail will be
                uploaded securely.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateCourse;

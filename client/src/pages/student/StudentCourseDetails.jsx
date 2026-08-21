import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock3,
  LoaderCircle,
  UserRound,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";

const StudentCourseDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // FETCH COURSE
  // =====================================================

  useEffect(() => {
    if (!courseId) {
      toast.error("Invalid course ID");
      navigate("/courses");
      return;
    }

    fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      setLoading(true);

      const response = await api.get(`/course/${courseId}`);

      if (response.data.success) {
        setCourse(response.data.course);
      } else {
        toast.error(
          response.data.message || "Course not found"
        );

        navigate("/courses");
      }
    } catch (error) {
      console.error("Fetch course error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to load course details"
      );

      navigate("/courses");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F6F2] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <LoaderCircle
            size={38}
            className="animate-spin text-gray-900"
          />

          <p className="text-sm text-gray-500">
            Loading course...
          </p>
        </div>
      </div>
    );
  }

  if (!course) {
    return null;
  }

  const thumbnailUrl =
    course.courseThumbnail?.url;

  const instructorName =
    course.instructor?.name ||
    "Unknown Instructor";

  const instructorEmail =
    course.instructor?.email || "";

  const price = Number(course.coursePrice || 0);

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-[#F7F6F2] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* =================================================
            BACK BUTTON
        ================================================= */}

        <button
          type="button"
          onClick={() => navigate("/courses")}
          className="mb-6 flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-white hover:text-gray-900"
        >
          <ArrowLeft size={18} />
          Back to Courses
        </button>

        {/* =================================================
            HERO
        ================================================= */}

        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">

          <div className="grid lg:grid-cols-[1.25fr_1fr]">

            {/* =================================================
                THUMBNAIL
            ================================================= */}

            <div className="relative min-h-[280px] bg-gray-100 lg:min-h-[480px]">

              {thumbnailUrl ? (
                <img
                  src={thumbnailUrl}
                  alt={course.courseTitle}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full min-h-[280px] items-center justify-center lg:min-h-[480px]">
                  <BookOpen
                    size={70}
                    className="text-gray-300"
                  />
                </div>
              )}

              {/* LEVEL */}

              <div className="absolute left-5 top-5">
                <span className="rounded-xl bg-white/95 px-4 py-2 text-xs font-bold text-gray-800 shadow-sm backdrop-blur">
                  {course.courseLevel || "Beginner"}
                </span>
              </div>

            </div>

            {/* =================================================
                COURSE INFO
            ================================================= */}

            <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">

              {/* CATEGORY */}

              {course.category && (
                <div className="mb-4">
                  <span className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-gray-600">
                    {course.category}
                  </span>
                </div>
              )}

              {/* TITLE */}

              <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl">
                {course.courseTitle}
              </h1>

              {/* SUBTITLE */}

              {course.subTitle && (
                <p className="mt-4 text-base leading-7 text-gray-500">
                  {course.subTitle}
                </p>
              )}

              {/* INSTRUCTOR */}

              <div className="mt-7 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100">
                  <UserRound
                    size={21}
                    className="text-gray-500"
                  />
                </div>

                <div>
                  <p className="text-xs text-gray-400">
                    Created by
                  </p>

                  <p className="font-semibold text-gray-900">
                    {instructorName}
                  </p>

                  {instructorEmail && (
                    <p className="text-xs text-gray-400">
                      {instructorEmail}
                    </p>
                  )}
                </div>
              </div>

              {/* QUICK INFO */}

              <div className="mt-7 grid grid-cols-2 gap-3">

                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <BookOpen
                    size={19}
                    className="mb-2 text-gray-500"
                  />

                  <p className="text-xs text-gray-400">
                    Level
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-800">
                    {course.courseLevel || "Beginner"}
                  </p>
                </div>

                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <Clock3
                    size={19}
                    className="mb-2 text-gray-500"
                  />

                  <p className="text-xs text-gray-400">
                    Course Type
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-800">
                    Self Paced
                  </p>
                </div>

              </div>

              {/* PRICE */}

              <div className="mt-7 border-t border-gray-100 pt-6">

                <p className="text-xs text-gray-400">
                  Course Price
                </p>

                <p className="mt-1 text-3xl font-bold text-gray-900">
                  {price === 0
                    ? "Free"
                    : `₹${price.toLocaleString("en-IN")}`}
                </p>

              </div>

              {/* ENROLL */}

              <button
                type="button"
                onClick={() =>
                  toast.info(
                    "Enrollment will be connected next."
                  )
                }
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                Enroll in Course
                <CheckCircle2 size={18} />
              </button>

            </div>
          </div>
        </div>

        {/* =================================================
            DESCRIPTION
        ================================================= */}

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">

          {/* DESCRIPTION */}

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">

            <h2 className="text-xl font-bold text-gray-900">
              About This Course
            </h2>

            <div className="mt-5">
              {course.description ? (
                <p className="whitespace-pre-line text-sm leading-7 text-gray-600">
                  {course.description}
                </p>
              ) : (
                <p className="text-sm text-gray-400">
                  No course description has been added yet.
                </p>
              )}
            </div>

          </div>

          {/* WHAT YOU'LL GET */}

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

            <h2 className="text-lg font-bold text-gray-900">
              What You'll Get
            </h2>

            <div className="mt-5 space-y-4">

              <Feature
                text="Learn at your own pace"
              />

              <Feature
                text="Access course content"
              />

              <Feature
                text="Track your learning progress"
              />

              <Feature
                text="Learn from an instructor"
              />

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

// =====================================================
// FEATURE
// =====================================================

const Feature = ({ text }) => {
  return (
    <div className="flex items-start gap-3">
      <CheckCircle2
        size={18}
        className="mt-0.5 shrink-0 text-gray-700"
      />

      <p className="text-sm leading-6 text-gray-600">
        {text}
      </p>
    </div>
  );
};

export default StudentCourseDetails;


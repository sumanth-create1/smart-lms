import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  Edit3,
  IndianRupee,
  Layers,
  LoaderCircle,
  Plus,
  Save,
  Trash2,
  Users,
  Film,
  ChevronRight,
  Crown,
  Flame,
  Gem,
  Shield,
  Sparkles,
  X,
  ScrollText,
  Swords,
} from "lucide-react";
import toast from "react-hot-toast";

import api from "../../services/api";

function CourseManagement() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const cursorRef = useRef(null);
  const cursorDotRef = useRef(null);

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
     CUSTOM CURSOR
  ===================================================== */

  useEffect(() => {
    const moveCursor = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }

      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };

    window.addEventListener("pointermove", moveCursor);

    return () => {
      window.removeEventListener("pointermove", moveCursor);
    };
  }, []);

  /* =====================================================
     NAVIGATION
  ===================================================== */

  const goToLectures = () => {
    navigate(`/instructor/courses/${courseId}/lectures`);
  };

  const goToModules = () => {
    navigate(`/instructor/courses/${courseId}/modules`);
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
      <div className="relative flex min-h-[600px] items-center justify-center overflow-hidden bg-[#050403] text-white">
        <AmbientParticles />

        <div className="relative z-10 flex flex-col items-center">
          <div className="relative flex h-24 w-24 items-center justify-center">
            <div className="absolute inset-0 animate-ping rounded-full bg-orange-500/10" />

            <div className="absolute inset-2 rounded-full border border-orange-400/20" />

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-orange-400/30 bg-black/70 shadow-[0_0_50px_rgba(249,115,22,0.15)]">
              <Crown
                size={30}
                className="text-orange-400"
              />
            </div>
          </div>

          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.35em] text-orange-300">
            Entering the realm
          </p>

          <p className="mt-2 text-sm text-white/40">
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
      <div className="relative flex min-h-[600px] flex-col items-center justify-center overflow-hidden bg-[#050403] px-6 text-center text-white">
        <AmbientParticles />

        <div className="relative z-10">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-orange-400/20 bg-orange-500/5 shadow-[0_0_60px_rgba(249,115,22,0.1)]">
            <BookOpen
              size={30}
              className="text-orange-400"
            />
          </div>

          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.3em] text-orange-400">
            The scroll is lost
          </p>

          <h2 className="mt-3 text-2xl font-bold">
            Course not found
          </h2>

          <p className="mt-2 text-sm text-white/40">
            The course you're looking for doesn't exist.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/instructor/courses")
            }
            className="mt-7 inline-flex items-center gap-2 rounded-xl border border-orange-400/30 bg-orange-500/10 px-5 py-3 text-sm font-semibold text-orange-300 transition-all hover:border-orange-400/60 hover:bg-orange-500/20 hover:shadow-[0_0_30px_rgba(249,115,22,0.15)]"
          >
            <ArrowLeft size={17} />
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  const thumbnail =
    course.courseThumbnail?.url ||
    "/placeholder-course.jpg";

  const students = course.studentCount || 0;

  return (
    <div className="course-realm relative min-h-full overflow-hidden bg-[#050403] text-white">
      {/* =================================================
          CUSTOM CURSOR
      ================================================= */}

      <div
        ref={cursorRef}
        className="realm-cursor pointer-events-none fixed left-0 top-0 z-[100] hidden h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-orange-400/60 bg-orange-500/5 shadow-[0_0_30px_rgba(249,115,22,0.25)] md:flex"
      >
        <div className="h-1.5 w-1.5 rounded-full bg-orange-300 shadow-[0_0_12px_rgba(251,146,60,0.9)]" />
      </div>

      <div
        ref={cursorDotRef}
        className="realm-cursor-dot pointer-events-none fixed left-0 top-0 z-[101] hidden h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white md:block"
      />

      {/* =================================================
          AMBIENT BACKGROUND
      ================================================= */}

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-15%] top-[-10%] h-[500px] w-[500px] rounded-full bg-orange-600/[0.06] blur-[120px]" />

        <div className="absolute right-[-15%] top-[25%] h-[500px] w-[500px] rounded-full bg-amber-500/[0.05] blur-[120px]" />

        <div className="absolute bottom-[-15%] left-[25%] h-[500px] w-[500px] rounded-full bg-red-700/[0.04] blur-[130px]" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.7) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#050403_95%)]" />
      </div>

      <AmbientParticles />

      <div className="relative z-10 mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-8">
          <button
            type="button"
            onClick={() =>
              navigate("/instructor/courses")
            }
            className="group mb-6 inline-flex items-center gap-2 text-sm font-medium text-white/40 transition-all hover:text-orange-300"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] transition-all group-hover:border-orange-400/30 group-hover:bg-orange-500/10">
              <ArrowLeft size={16} />
            </span>

            Back to Courses
          </button>

          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-4xl">
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-orange-400/25 bg-orange-500/10 text-orange-300 shadow-[0_0_25px_rgba(249,115,22,0.08)]">
                  <Crown size={17} />
                </span>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-orange-400">
                    Course Command
                  </p>

                  <p className="text-[10px] uppercase tracking-[0.18em] text-white/25">
                    Royal Learning Realm
                  </p>
                </div>
              </div>

              <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
                {course.courseTitle}
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/40 sm:text-base">
                Command your course, organize its learning
                structure and shape the experience your
                students receive.
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {!editing && (
                <PremiumButton
                  icon={<Edit3 size={16} />}
                  onClick={() => setEditing(true)}
                  variant="neutral"
                >
                  Edit Course
                </PremiumButton>
              )}

              <PremiumButton
                icon={<Layers size={16} />}
                onClick={goToModules}
                variant="gold"
              >
                Manage Modules
              </PremiumButton>

              <PremiumButton
                icon={<Film size={16} />}
                onClick={goToLectures}
                variant="orange"
              >
                Manage Lectures
              </PremiumButton>

              <button
                type="button"
                onClick={handleDeleteCourse}
                className="group inline-flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/[0.06] px-4 py-3 text-sm font-semibold text-red-300 transition-all hover:border-red-400/50 hover:bg-red-500/10 hover:shadow-[0_0_30px_rgba(239,68,68,0.1)]"
              >
                <Trash2
                  size={16}
                  className="transition-transform group-hover:scale-110"
                />
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

            <div className="group overflow-hidden rounded-[28px] border border-white/[0.08] bg-white/[0.025] shadow-2xl shadow-black/30 backdrop-blur-xl">
              <div className="relative aspect-[16/6] min-h-[230px] overflow-hidden bg-black">
                <img
                  src={thumbnail}
                  alt={course.courseTitle}
                  className="h-full w-full object-cover transition duration-1000 group-hover:scale-[1.04]"
                  onError={(e) => {
                    e.currentTarget.src =
                      "/placeholder-course.jpg";
                  }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#050403] via-black/30 to-transparent" />

                <div className="absolute inset-0 bg-gradient-to-r from-orange-950/20 via-transparent to-black/30" />

                <div className="absolute left-6 top-6 flex items-center gap-2 rounded-full border border-orange-300/20 bg-black/50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-orange-300 backdrop-blur-md">
                  <Sparkles size={12} />
                  Course Realm
                </div>

                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-300/20 bg-black/50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-orange-200 backdrop-blur-md">
                        <Shield size={12} />
                        {course.courseLevel}
                      </span>

                      <h2 className="mt-3 text-2xl font-black text-white sm:text-3xl">
                        {course.courseTitle}
                      </h2>
                    </div>

                    <div className="hidden items-center gap-2 rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-white/50 backdrop-blur-md sm:flex">
                      <Users
                        size={14}
                        className="text-orange-400"
                      />
                      {students} students
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-7">
                <p className="text-base font-semibold text-white/80">
                  {course.subTitle ||
                    "Your course subtitle awaits."}
                </p>

                <p className="mt-4 whitespace-pre-line text-sm leading-7 text-white/40">
                  {course.description}
                </p>

                <div className="mt-6 flex flex-wrap gap-2.5">
                  <InfoBadge
                    icon={<BookOpen size={14} />}
                    label={course.category}
                  />

                  <InfoBadge
                    icon={<IndianRupee size={14} />}
                    label={`₹${course.coursePrice || 0}`}
                    highlight
                  />

                  <InfoBadge
                    icon={<Users size={14} />}
                    label={`${students} Students`}
                  />

                  <InfoBadge
                    icon={<Gem size={14} />}
                    label={course.courseLevel}
                  />
                </div>
              </div>
            </div>

            {/* LEARNING STRUCTURE */}

            <div className="overflow-hidden rounded-[28px] border border-white/[0.08] bg-white/[0.025] shadow-2xl shadow-black/30 backdrop-blur-xl">
              <div className="border-b border-white/[0.06] px-6 py-6 sm:px-7">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-orange-400/20 bg-orange-500/[0.08] text-orange-300">
                        <Layers size={20} />

                        <span className="absolute inset-0 animate-pulse rounded-xl border border-orange-400/10" />
                      </div>

                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-orange-400">
                          Architecture
                        </p>

                        <h2 className="text-lg font-bold text-white">
                          Learning Structure
                        </h2>
                      </div>
                    </div>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-white/35">
                      Shape your course into modules, lectures
                      and AI-powered learning challenges.
                    </p>
                  </div>

                  <PremiumButton
                    icon={<Plus size={16} />}
                    onClick={goToModules}
                    variant="gold"
                  >
                    Manage Modules
                  </PremiumButton>
                </div>
              </div>

              <div className="p-6 sm:p-7">
                <div className="grid gap-4 sm:grid-cols-3">
                  <StructureCard
                    icon={<Layers size={20} />}
                    title="Modules"
                    description="Create and organize the chapters of your course."
                  />

                  <StructureCard
                    icon={<Film size={20} />}
                    title="Lectures"
                    description="Assign existing lectures to your learning structure."
                  />

                  <StructureCard
                    icon={<Sparkles size={20} />}
                    title="AI Quizzes"
                    description="Turn module content into intelligent challenges."
                  />
                </div>

                <button
                  type="button"
                  onClick={goToModules}
                  className="group mt-5 flex w-full items-center justify-between rounded-2xl border border-white/[0.07] bg-black/20 px-4 py-4 text-left transition-all duration-300 hover:border-orange-400/25 hover:bg-orange-500/[0.04] hover:shadow-[0_0_35px_rgba(249,115,22,0.05)]"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-orange-300 transition-all group-hover:border-orange-400/30 group-hover:bg-orange-500/10">
                      <ScrollText size={18} />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-white/80">
                        Open Module Management
                      </p>

                      <p className="mt-1 text-xs text-white/30">
                        Create modules, organize lectures and
                        manage quizzes.
                      </p>
                    </div>
                  </div>

                  <ChevronRight
                    size={19}
                    className="text-white/20 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-orange-300"
                  />
                </button>
              </div>
            </div>

            {/* COURSE CONTENT */}

            <div className="overflow-hidden rounded-[28px] border border-white/[0.08] bg-white/[0.025] shadow-2xl shadow-black/30 backdrop-blur-xl">
              <div className="flex flex-col gap-4 border-b border-white/[0.06] px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-7">
                <div>
                  <div className="flex items-center gap-2">
                    <Film
                      size={17}
                      className="text-orange-400"
                    />

                    <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-orange-400">
                      Knowledge Vault
                    </p>
                  </div>

                  <h2 className="mt-2 text-lg font-bold text-white">
                    Course Content
                  </h2>

                  <p className="mt-1 text-sm text-white/35">
                    Create lectures, upload videos and manage
                    your course content.
                  </p>
                </div>

                <PremiumButton
                  icon={<Plus size={16} />}
                  onClick={goToLectures}
                  variant="orange"
                >
                  Add Lecture
                </PremiumButton>
              </div>

              <div className="flex min-h-[280px] flex-col items-center justify-center px-6 py-12 text-center">
                <div className="relative">
                  <div className="absolute inset-0 animate-pulse rounded-3xl bg-orange-500/10 blur-xl" />

                  <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-orange-400/20 bg-orange-500/[0.07] text-orange-300">
                    <BookOpen size={26} />
                  </div>
                </div>

                <h3 className="mt-5 font-bold text-white">
                  Manage your lectures
                </h3>

                <p className="mt-2 max-w-sm text-sm leading-6 text-white/35">
                  Create lectures, upload videos, edit lecture
                  titles and assign lectures to modules.
                </p>

                <button
                  type="button"
                  onClick={goToLectures}
                  className="group mt-6 inline-flex items-center gap-2 rounded-xl border border-orange-400/20 bg-orange-500/[0.07] px-4 py-2.5 text-sm font-semibold text-orange-300 transition-all hover:border-orange-400/40 hover:bg-orange-500/15 hover:shadow-[0_0_30px_rgba(249,115,22,0.1)]"
                >
                  <Film size={16} />

                  Manage Lectures

                  <ChevronRight
                    size={15}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </button>
              </div>
            </div>
          </div>

          {/* =================================================
              RIGHT SIDEBAR
          ================================================= */}

          <div className="space-y-6">
            {/* COURSE DETAILS */}

            <div className="rounded-[28px] border border-white/[0.08] bg-white/[0.025] p-6 shadow-2xl shadow-black/30 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-orange-400/20 bg-orange-500/[0.07] text-orange-300">
                  <Shield size={18} />
                </div>

                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-orange-400">
                    Royal Record
                  </p>

                  <h2 className="text-lg font-bold text-white">
                    Course Details
                  </h2>
                </div>
              </div>

              <div className="mt-6 space-y-4">
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
                  gold
                />

                <DetailRow
                  label="Students"
                  value={students}
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

            <div className="rounded-[28px] border border-white/[0.08] bg-white/[0.025] p-6 shadow-2xl shadow-black/30 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-orange-400/20 bg-orange-500/[0.07] text-orange-300">
                  <Swords size={18} />
                </div>

                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-orange-400">
                    Command Deck
                  </p>

                  <h2 className="text-lg font-bold text-white">
                    Quick Actions
                  </h2>
                </div>
              </div>

              <div className="mt-6 space-y-2.5">
                <QuickAction
                  icon={<Edit3 size={17} />}
                  label="Edit Course"
                  onClick={() => setEditing(true)}
                />

                <QuickAction
                  icon={<Layers size={17} />}
                  label="Manage Modules"
                  onClick={goToModules}
                  highlighted
                />

                <QuickAction
                  icon={<Plus size={17} />}
                  label="Add Lecture"
                  onClick={goToLectures}
                />

                <QuickAction
                  icon={<Film size={17} />}
                  label="Manage Lectures"
                  onClick={goToLectures}
                  highlighted
                />
              </div>
            </div>

            {/* ROYAL STATUS */}

            <div className="relative overflow-hidden rounded-[28px] border border-orange-400/15 bg-gradient-to-br from-orange-500/[0.08] via-transparent to-amber-500/[0.04] p-6">
              <div className="absolute right-[-25px] top-[-25px] h-32 w-32 rounded-full bg-orange-500/10 blur-3xl" />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-orange-400">
                    Realm Status
                  </span>

                  <span className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-300">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                    Online
                  </span>
                </div>

                <div className="mt-5 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-orange-400/20 bg-black/30 text-orange-300">
                    <Crown size={21} />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-white">
                      Course command active
                    </p>

                    <p className="mt-1 text-xs leading-5 text-white/35">
                      Your learning realm is ready for
                      expansion.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =================================================
            EDIT MODAL
        ================================================= */}

        {editing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 py-6 backdrop-blur-md">
            <div className="relative max-h-[92vh] w-full max-w-2xl overflow-hidden rounded-[30px] border border-orange-400/15 bg-[#0a0806] shadow-[0_30px_120px_rgba(0,0,0,0.7)]">
              {/* modal glow */}

              <div className="pointer-events-none absolute left-[-100px] top-[-100px] h-64 w-64 rounded-full bg-orange-500/10 blur-[90px]" />

              <div className="relative flex items-center justify-between border-b border-white/[0.07] px-6 py-5 sm:px-7">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-orange-400/20 bg-orange-500/[0.07] text-orange-300">
                    <Edit3 size={18} />
                  </div>

                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-orange-400">
                      Royal Scribe
                    </p>

                    <h2 className="text-lg font-bold text-white">
                      Edit Course
                    </h2>

                    <p className="mt-0.5 text-xs text-white/30">
                      Update your course information.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  disabled={saving}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-white/40 transition-all hover:border-orange-400/25 hover:bg-orange-500/10 hover:text-orange-300 disabled:opacity-50"
                >
                  <X size={17} />
                </button>
              </div>

              <form
                onSubmit={handleUpdate}
                className="relative max-h-[calc(92vh-85px)] space-y-5 overflow-y-auto p-6 sm:p-7"
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
                  <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.15em] text-white/45">
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={6}
                    required
                    className="w-full resize-none rounded-2xl border border-white/[0.08] bg-white/[0.025] px-4 py-3 text-sm leading-6 text-white outline-none transition-all placeholder:text-white/20 focus:border-orange-400/40 focus:bg-orange-500/[0.03] focus:ring-4 focus:ring-orange-500/[0.05]"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <SelectField
                    label="Category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    options={[
                      "Web Development",
                      "Programming",
                      "Data Science",
                      "Mobile Development",
                      "Database",
                      "DevOps",
                      "Other",
                    ]}
                    placeholder="Select category"
                  />

                  <SelectField
                    label="Course Level"
                    name="courseLevel"
                    value={formData.courseLevel}
                    onChange={handleChange}
                    options={[
                      "Beginner",
                      "Intermediate",
                      "Advanced",
                    ]}
                    placeholder="Select level"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.15em] text-white/45">
                    Course Price
                  </label>

                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-orange-400">
                      ₹
                    </span>

                    <input
                      type="number"
                      name="coursePrice"
                      value={formData.coursePrice}
                      onChange={handleChange}
                      min="0"
                      required
                      className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.025] py-3 pl-9 pr-4 text-sm text-white outline-none transition-all focus:border-orange-400/40 focus:bg-orange-500/[0.03] focus:ring-4 focus:ring-orange-500/[0.05]"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 border-t border-white/[0.07] pt-5">
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    disabled={saving}
                    className="rounded-xl border border-white/[0.08] bg-white/[0.025] px-5 py-3 text-sm font-semibold text-white/50 transition-all hover:border-white/15 hover:bg-white/[0.05] hover:text-white disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-xl border border-orange-300/30 bg-gradient-to-r from-orange-500/90 to-amber-500/90 px-5 py-3 text-sm font-bold text-black shadow-[0_0_30px_rgba(249,115,22,0.12)] transition-all hover:from-orange-400 hover:to-amber-400 hover:shadow-[0_0_40px_rgba(249,115,22,0.2)] disabled:cursor-not-allowed disabled:opacity-50"
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

      {/* =================================================
          RESPONSIVE CURSOR STYLE
      ================================================= */}

      <style>{`
        .course-realm {
          cursor: none;
        }

        .course-realm button,
        .course-realm a,
        .course-realm input,
        .course-realm textarea,
        .course-realm select {
          cursor: none;
        }

        .course-realm select option {
          background: #0a0806;
          color: white;
        }

        @media (max-width: 767px) {
          .course-realm {
            cursor: auto;
          }

          .course-realm button,
          .course-realm a,
          .course-realm input,
          .course-realm textarea,
          .course-realm select {
            cursor: pointer;
          }

          .realm-cursor,
          .realm-cursor-dot {
            display: none !important;
          }
        }

        @keyframes emberFloat {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0;
          }

          20% {
            opacity: .65;
          }

          80% {
            opacity: .3;
          }

          100% {
            transform: translateY(-110px) scale(.4);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

/* =====================================================
   AMBIENT PARTICLES
===================================================== */

function AmbientParticles() {
  const particles = Array.from(
    { length: 20 },
    (_, index) => ({
      id: index,
      left: `${(index * 37) % 100}%`,
      bottom: `${(index * 17) % 70}%`,
      delay: `${(index % 7) * 0.8}s`,
      duration: `${5 + (index % 5)}s`,
      size: `${2 + (index % 3)}px`,
    })
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((particle) => (
        <span
          key={particle.id}
          className="absolute rounded-full bg-orange-400/50 blur-[1px]"
          style={{
            left: particle.left,
            bottom: particle.bottom,
            width: particle.size,
            height: particle.size,
            animation: `emberFloat ${particle.duration} ease-in-out ${particle.delay} infinite`,
          }}
        />
      ))}
    </div>
  );
}

/* =====================================================
   PREMIUM BUTTON
===================================================== */

function PremiumButton({
  children,
  icon,
  onClick,
  variant = "neutral",
}) {
  const variants = {
    neutral:
      "border-white/[0.09] bg-white/[0.03] text-white/70 hover:border-orange-400/30 hover:bg-orange-500/[0.05] hover:text-orange-300",

    gold:
      "border-amber-400/25 bg-amber-500/[0.08] text-amber-300 hover:border-amber-300/50 hover:bg-amber-500/[0.14] hover:shadow-[0_0_30px_rgba(245,158,11,0.1)]",

    orange:
      "border-orange-400/30 bg-gradient-to-r from-orange-500/90 to-amber-500/90 text-black shadow-[0_0_25px_rgba(249,115,22,0.1)] hover:from-orange-400 hover:to-amber-400 hover:shadow-[0_0_35px_rgba(249,115,22,0.2)]",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold transition-all duration-300 ${variants[variant]}`}
    >
      <span className="transition-transform duration-300 group-hover:scale-110">
        {icon}
      </span>

      {children}
    </button>
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
      <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.15em] text-white/45">
        {label}
      </label>

      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        required
        className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.025] px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-white/20 focus:border-orange-400/40 focus:bg-orange-500/[0.03] focus:ring-4 focus:ring-orange-500/[0.05]"
      />
    </div>
  );
}

/* =====================================================
   SELECT FIELD
===================================================== */

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  placeholder,
}) {
  return (
    <div>
      <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.15em] text-white/45">
        {label}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        required
        className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.025] px-4 py-3 text-sm text-white outline-none transition-all focus:border-orange-400/40 focus:bg-orange-500/[0.03] focus:ring-4 focus:ring-orange-500/[0.05]"
      >
        <option value="">{placeholder}</option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

/* =====================================================
   INFO BADGE
===================================================== */

function InfoBadge({
  icon,
  label,
  highlight = false,
}) {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition-all ${
        highlight
          ? "border-amber-400/20 bg-amber-500/[0.07] text-amber-300"
          : "border-white/[0.07] bg-white/[0.025] text-white/45"
      }`}
    >
      <span
        className={
          highlight ? "text-amber-400" : "text-orange-400/80"
        }
      >
        {icon}
      </span>

      {label}
    </div>
  );
}

/* =====================================================
   DETAIL ROW
===================================================== */

function DetailRow({
  label,
  value,
  gold = false,
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/[0.06] pb-3 last:border-0 last:pb-0">
      <span className="text-xs uppercase tracking-wider text-white/30">
        {label}
      </span>

      <span
        className={`text-right text-sm font-bold ${
          gold ? "text-amber-300" : "text-white/75"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

/* =====================================================
   STRUCTURE CARD
===================================================== */

function StructureCard({
  icon,
  title,
  description,
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-black/20 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-orange-400/20 hover:bg-orange-500/[0.03] hover:shadow-[0_15px_40px_rgba(0,0,0,0.25)]">
      <div className="absolute right-[-20px] top-[-20px] h-20 w-20 rounded-full bg-orange-500/5 blur-2xl transition-all group-hover:bg-orange-500/10" />

      <div className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-orange-400/15 bg-orange-500/[0.06] text-orange-300 transition-all group-hover:border-orange-400/30 group-hover:bg-orange-500/10">
        {icon}
      </div>

      <h3 className="relative mt-4 text-sm font-bold text-white/80">
        {title}
      </h3>

      <p className="relative mt-2 text-xs leading-5 text-white/30">
        {description}
      </p>
    </div>
  );
}

/* =====================================================
   QUICK ACTION
===================================================== */

function QuickAction({
  icon,
  label,
  onClick,
  highlighted = false,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-semibold transition-all duration-300 ${
        highlighted
          ? "border-orange-400/15 bg-orange-500/[0.06] text-orange-300 hover:border-orange-400/35 hover:bg-orange-500/10"
          : "border-white/[0.07] bg-white/[0.015] text-white/50 hover:border-orange-400/20 hover:bg-orange-500/[0.04] hover:text-orange-300"
      }`}
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.06] bg-black/20 text-orange-400/80 transition-all group-hover:border-orange-400/20 group-hover:bg-orange-500/10">
        {icon}
      </span>

      <span>{label}</span>

      <ChevronRight
        size={15}
        className="ml-auto text-white/15 transition-all group-hover:translate-x-1 group-hover:text-orange-300"
      />
    </button>
  );
}

export default CourseManagement;
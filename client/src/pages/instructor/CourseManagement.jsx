import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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
  Check,
  LockKeyhole,
} from "lucide-react";

import { toast } from "react-hot-toast";
import api from "../../services/api";


// ============================================================
// AMBIENT PARTICLES
// ============================================================

const AmbientParticles = () => {
  const particles = Array.from({ length: 24 });

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((_, index) => (
        <span
          key={index}
          className="absolute h-1 w-1 rounded-full bg-orange-400/30 animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 4}s`,
            animationDuration: `${2 + Math.random() * 4}s`,
          }}
        />
      ))}
    </div>
  );
};


// ============================================================
// PREMIUM BUTTON
// ============================================================

const PremiumButton = ({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  type = "button",
  className = "",
}) => {
  const base =
    "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50";

  const variants = {
    primary:
      "bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-black shadow-[0_0_25px_rgba(249,115,22,0.18)] hover:-translate-y-0.5 hover:shadow-[0_0_35px_rgba(249,115,22,0.35)]",

    secondary:
      "border border-orange-400/20 bg-white/[0.04] text-orange-100 hover:border-orange-400/50 hover:bg-orange-400/10",

    danger:
      "border border-red-500/20 bg-red-500/10 text-red-300 hover:border-red-500/40 hover:bg-red-500/20",

    dark:
      "border border-white/10 bg-black/30 text-gray-300 hover:border-orange-400/30 hover:text-orange-300",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${className}`}
    >
      <span className="absolute inset-0 -translate-x-full bg-white/10 transition-transform duration-500 group-hover:translate-x-full" />
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
    </button>
  );
};


// ============================================================
// INPUT
// ============================================================

const InputField = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}) => {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-orange-200/70">
        {label}
        {required && <span className="ml-1 text-orange-400">*</span>}
      </label>

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-gray-600 focus:border-orange-400/50 focus:bg-black/50 focus:ring-2 focus:ring-orange-400/10"
      />
    </div>
  );
};


// ============================================================
// SELECT
// ============================================================

const SelectField = ({ label, value, onChange, children }) => {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-orange-200/70">
        {label}
      </label>

      <select
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-white/10 bg-[#100d0b] px-4 py-3 text-sm text-white outline-none transition-all focus:border-orange-400/50 focus:ring-2 focus:ring-orange-400/10"
      >
        {children}
      </select>
    </div>
  );
};


// ============================================================
// INFO BADGE
// ============================================================

const InfoBadge = ({ icon: Icon, children }) => {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-orange-400/10 bg-orange-400/[0.06] px-3 py-1.5 text-xs text-orange-200/80">
      <Icon size={13} className="text-orange-400" />
      {children}
    </div>
  );
};


// ============================================================
// DETAIL ROW
// ============================================================

const DetailRow = ({ icon: Icon, label, value }) => {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/[0.06] py-4 last:border-b-0">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-400/[0.07] text-orange-400">
          <Icon size={16} />
        </div>

        <span className="text-sm text-gray-400">{label}</span>
      </div>

      <span className="text-right text-sm font-medium text-gray-200">
        {value}
      </span>
    </div>
  );
};


// ============================================================
// STRUCTURE CARD
// ============================================================

const StructureCard = ({ icon: Icon, title, description, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="group w-full rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-orange-400/30 hover:bg-orange-400/[0.04]"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-orange-400/10 bg-orange-400/[0.06] text-orange-400 transition-all duration-300 group-hover:scale-110 group-hover:border-orange-400/30">
            <Icon size={21} />
          </div>

          <div>
            <h3 className="font-semibold text-white">{title}</h3>
            <p className="mt-1 text-xs text-gray-500">{description}</p>
          </div>
        </div>

        <ChevronRight
          size={18}
          className="text-gray-600 transition-all group-hover:translate-x-1 group-hover:text-orange-400"
        />
      </div>
    </button>
  );
};


// ============================================================
// QUICK ACTION
// ============================================================

const QuickAction = ({ icon: Icon, title, description, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="group flex w-full items-center gap-3 rounded-xl border border-white/[0.06] bg-black/20 p-3 text-left transition-all hover:border-orange-400/20 hover:bg-orange-400/[0.04]"
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-400/[0.06] text-orange-400">
        <Icon size={16} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-gray-200">{title}</p>
        <p className="truncate text-xs text-gray-600">{description}</p>
      </div>

      <ChevronRight
        size={15}
        className="text-gray-600 transition-all group-hover:translate-x-1 group-hover:text-orange-400"
      />
    </button>
  );
};


// ============================================================
// MAIN COMPONENT
// ============================================================

const CourseManagement = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // ==========================================================
  // FORM STATE
  // ==========================================================

  const [formData, setFormData] = useState({
    courseTitle: "",
    subTitle: "",
    description: "",
    category: "",
    courseLevel: "",
    coursePrice: "",
  });

  // NEW
  const [isFreeCourse, setIsFreeCourse] = useState(false);

  // ==========================================================
  // CURSOR
  // ==========================================================

  const cursorRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (!cursorRef.current) return;

      cursorRef.current.style.transform = `translate3d(
        ${event.clientX}px,
        ${event.clientY}px,
        0
      )`;
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // ==========================================================
  // FETCH COURSE
  // ==========================================================

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      setLoading(true);

      const response = await api.get(`/course/${courseId}`);

      const courseData = response?.data?.course || response?.data;

      if (!courseData) {
        toast.error("Course not found");
        return;
      }

      setCourse(courseData);

      setFormData({
        courseTitle: courseData.courseTitle || "",
        subTitle: courseData.subTitle || "",
        description: courseData.description || "",
        category: courseData.category || "",
        courseLevel: courseData.courseLevel || "",
        coursePrice: courseData.coursePrice ?? "",
      });

      // ======================================================
      // FREE / PAID DETECTION
      // ======================================================

      setIsFreeCourse(
        Number(courseData.coursePrice || 0) === 0
      );
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to load course"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // FORM CHANGE
  // ==========================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================================
  // FREE COURSE
  // ==========================================================

  const handleFreeCourse = () => {
    setIsFreeCourse(true);

    setFormData((prev) => ({
      ...prev,
      coursePrice: 0,
    }));
  };

  // ==========================================================
  // PAID COURSE
  // ==========================================================

  const handlePaidCourse = () => {
    setIsFreeCourse(false);

    setFormData((prev) => ({
      ...prev,
      coursePrice:
        Number(prev.coursePrice) > 0
          ? prev.coursePrice
          : 499,
    }));
  };

  // ==========================================================
  // UPDATE COURSE
  // ==========================================================

  const handleUpdate = async (event) => {
    event.preventDefault();

    if (!formData.courseTitle.trim()) {
      toast.error("Course title is required");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Course description is required");
      return;
    }

    if (!formData.category) {
      toast.error("Please select a category");
      return;
    }

    if (!formData.courseLevel) {
      toast.error("Please select course level");
      return;
    }

    if (
      !isFreeCourse &&
      Number(formData.coursePrice) <= 0
    ) {
      toast.error("Enter a valid course price");
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

        // ====================================================
        // IMPORTANT
        // Free course = 0
        // Paid course = entered price
        // ====================================================

        coursePrice: isFreeCourse
          ? 0
          : Number(formData.coursePrice),
      });

      const updatedCourse =
        response?.data?.course || response?.data;

      setCourse(updatedCourse);

      setFormData({
        courseTitle: updatedCourse.courseTitle || "",
        subTitle: updatedCourse.subTitle || "",
        description: updatedCourse.description || "",
        category: updatedCourse.category || "",
        courseLevel: updatedCourse.courseLevel || "",
        coursePrice: updatedCourse.coursePrice ?? 0,
      });

      setIsFreeCourse(
        Number(updatedCourse.coursePrice || 0) === 0
      );

      setEditing(false);

      toast.success("Course updated successfully");
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to update course"
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================================
  // DELETE COURSE
  // ==========================================================

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this course?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/course/${courseId}`);

      toast.success("Course deleted successfully");

      navigate("/instructor/courses");
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to delete course"
      );
    }
  };

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080706] text-orange-400">
        <div className="text-center">
          <LoaderCircle
            size={42}
            className="mx-auto animate-spin"
          />

          <p className="mt-4 text-sm tracking-widest text-gray-500">
            ENTERING THE ROYAL ARCHIVES...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================================
  // NOT FOUND
  // ==========================================================

  if (!course) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080706] text-white">
        <div className="text-center">
          <Shield
            size={50}
            className="mx-auto mb-5 text-orange-400"
          />

          <h2 className="text-2xl font-bold">
            Course Not Found
          </h2>

          <p className="mt-2 text-gray-500">
            The requested course could not be found.
          </p>

          <div className="mt-6">
            <PremiumButton
              variant="secondary"
              onClick={() =>
                navigate("/instructor/courses")
              }
            >
              <ArrowLeft size={16} />
              Back to Courses
            </PremiumButton>
          </div>
        </div>
      </div>
    );
  }

  const isCurrentlyFree =
    Number(course.coursePrice || 0) === 0;

  // ==========================================================
  // MAIN UI
  // ==========================================================

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#080706] text-white">
      {/* Ambient background */}

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-orange-600/10 blur-[140px]" />

        <div className="absolute right-[-10%] top-[20%] h-[500px] w-[500px] rounded-full bg-amber-500/[0.07] blur-[140px]" />

        <div className="absolute bottom-[-20%] left-[25%] h-[500px] w-[500px] rounded-full bg-red-900/[0.08] blur-[150px]" />
      </div>

      <AmbientParticles />

      {/* Custom cursor */}

      <div
        ref={cursorRef}
        className="pointer-events-none fixed left-0 top-0 z-[100] hidden h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border border-orange-400/60 shadow-[0_0_20px_rgba(249,115,22,0.45)] lg:block"
      />

      <div className="relative z-10 mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">

        {/* ====================================================
            TOP BAR
        ==================================================== */}

        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <PremiumButton
            variant="dark"
            onClick={() =>
              navigate("/instructor/courses")
            }
          >
            <ArrowLeft size={16} />
            Course Archives
          </PremiumButton>

          <div className="flex items-center gap-2">
            <InfoBadge icon={Crown}>
              INSTRUCTOR COMMAND
            </InfoBadge>

            <InfoBadge icon={Flame}>
              ROYAL ACADEMY
            </InfoBadge>
          </div>
        </div>


        {/* ====================================================
            HERO
        ==================================================== */}

        <section className="relative overflow-hidden rounded-[28px] border border-orange-400/10 bg-gradient-to-br from-[#17110d] via-[#0e0b09] to-[#080706] p-6 shadow-[0_25px_100px_rgba(0,0,0,0.45)] sm:p-8 lg:p-10">

          <div className="absolute right-[-60px] top-[-80px] opacity-[0.04]">
            <Crown size={360} />
          </div>

          <div className="absolute bottom-[-100px] left-[30%] opacity-[0.025]">
            <Swords size={400} />
          </div>

          <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_400px]">

            {/* Hero information */}

            <div>
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-orange-400/20 bg-orange-400/[0.07] text-orange-400 shadow-[0_0_30px_rgba(249,115,22,0.1)]">
                  <Crown size={23} />
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-orange-400">
                    COURSE COMMAND
                  </p>

                  <p className="text-xs text-gray-600">
                    Royal Learning Realm
                  </p>
                </div>
              </div>

              <h1 className="max-w-4xl text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
                {course.courseTitle}
              </h1>

              <p className="mt-4 max-w-3xl text-base leading-7 text-gray-400">
                {course.subTitle ||
                  "A course crafted for those who seek knowledge and mastery."}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                <InfoBadge icon={BookOpen}>
                  {course.category || "General"}
                </InfoBadge>

                <InfoBadge icon={Layers}>
                  {course.courseLevel || "All Levels"}
                </InfoBadge>

                <InfoBadge icon={Users}>
                  {course.enrolledStudents?.length || 0} Students
                </InfoBadge>

                {isCurrentlyFree ? (
                  <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.07] px-3 py-1.5 text-xs font-semibold text-emerald-300">
                    <Check size={13} />
                    FREE COURSE
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 rounded-full border border-orange-400/20 bg-orange-400/[0.07] px-3 py-1.5 text-xs font-semibold text-orange-300">
                    <IndianRupee size={13} />
                    ₹{Number(course.coursePrice || 0).toLocaleString("en-IN")}
                  </div>
                )}
              </div>
            </div>


            {/* Course preview */}

            <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-black/30">
              <div className="relative aspect-video overflow-hidden">
                {course.courseThumbnail?.url ? (
                  <img
                    src={course.courseThumbnail.url}
                    alt={course.courseTitle}
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-orange-950 via-black to-amber-950">
                    <Crown
                      size={65}
                      className="text-orange-500/30"
                    />
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

                <div className="absolute bottom-4 left-4">
                  {isCurrentlyFree ? (
                    <span className="rounded-full border border-emerald-400/30 bg-black/70 px-3 py-1 text-xs font-bold text-emerald-300 backdrop-blur-md">
                      FREE
                    </span>
                  ) : (
                    <span className="rounded-full border border-orange-400/30 bg-black/70 px-3 py-1 text-xs font-bold text-orange-300 backdrop-blur-md">
                      ₹{Number(course.coursePrice || 0).toLocaleString("en-IN")}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* ====================================================
            MAIN GRID
        ==================================================== */}

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">

          {/* ==================================================
              LEFT
          ================================================== */}

          <main className="space-y-6">

            {/* Description */}

            <section className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6 backdrop-blur-xl sm:p-7">

              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-400/[0.07] text-orange-400">
                  <ScrollText size={19} />
                </div>

                <div>
                  <h2 className="font-bold text-white">
                    Course Chronicle
                  </h2>

                  <p className="text-xs text-gray-600">
                    About this learning realm
                  </p>
                </div>
              </div>

              <p className="whitespace-pre-line text-sm leading-7 text-gray-400">
                {course.description ||
                  "No course description has been written yet."}
              </p>
            </section>


            {/* Learning Structure */}

            <section className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6 backdrop-blur-xl sm:p-7">

              <div className="mb-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-orange-400">
                  ROYAL STRUCTURE
                </p>

                <h2 className="mt-2 text-xl font-bold">
                  Learning Structure
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                  Manage the content that forms this course.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">

                <StructureCard
                  icon={Layers}
                  title="Modules"
                  description="Organize course modules"
                  onClick={() =>
                    navigate(
                      `/instructor/course/${courseId}/modules`
                    )
                  }
                />

                <StructureCard
                  icon={Film}
                  title="Lectures"
                  description="Manage lessons and videos"
                  onClick={() =>
                    navigate(
                      `/instructor/course/${courseId}/lectures`
                    )
                  }
                />
              </div>
            </section>


            {/* Quick Actions */}

            <section className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6 backdrop-blur-xl sm:p-7">

              <div className="mb-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-orange-400">
                  COMMANDS
                </p>

                <h2 className="mt-2 text-xl font-bold">
                  Course Actions
                </h2>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">

                <QuickAction
                  icon={Layers}
                  title="Manage Modules"
                  description="Build your course structure"
                  onClick={() =>
                    navigate(
                      `/instructor/course/${courseId}/modules`
                    )
                  }
                />

                <QuickAction
                  icon={Film}
                  title="Manage Lectures"
                  description="Create and arrange lectures"
                  onClick={() =>
                    navigate(
                      `/instructor/course/${courseId}/lectures`
                    )
                  }
                />

                <QuickAction
                  icon={Users}
                  title="View Students"
                  description="See enrolled learners"
                  onClick={() =>
                    navigate("/instructor/students")
                  }
                />

                <QuickAction
                  icon={Edit3}
                  title="Edit Course"
                  description="Update course information"
                  onClick={() => setEditing(true)}
                />
              </div>
            </section>
          </main>


          {/* ==================================================
              RIGHT SIDEBAR
          ================================================== */}

          <aside className="space-y-6">

            {/* Course Details */}

            <section className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6 backdrop-blur-xl">

              <div className="mb-3 flex items-center gap-3">
                <Gem
                  size={19}
                  className="text-orange-400"
                />

                <h2 className="font-bold">
                  Course Details
                </h2>
              </div>

              <DetailRow
                icon={BookOpen}
                label="Category"
                value={course.category || "—"}
              />

              <DetailRow
                icon={Layers}
                label="Level"
                value={course.courseLevel || "—"}
              />

              <DetailRow
                icon={Users}
                label="Students"
                value={
                  course.enrolledStudents?.length || 0
                }
              />

              <DetailRow
                icon={
                  isCurrentlyFree
                    ? Check
                    : IndianRupee
                }
                label="Access"
                value={
                  isCurrentlyFree
                    ? "Free"
                    : `₹${Number(
                        course.coursePrice || 0
                      ).toLocaleString("en-IN")}`
                }
              />
            </section>


            {/* Management */}

            <section className="rounded-2xl border border-orange-400/10 bg-gradient-to-br from-orange-500/[0.07] to-transparent p-6">

              <div className="mb-5 flex items-center gap-3">
                <Shield
                  size={19}
                  className="text-orange-400"
                />

                <div>
                  <h2 className="font-bold">
                    Course Management
                  </h2>

                  <p className="text-xs text-gray-600">
                    Instructor controls
                  </p>
                </div>
              </div>

              <div className="space-y-3">

                <PremiumButton
                  className="w-full"
                  onClick={() => setEditing(true)}
                >
                  <Edit3 size={16} />
                  Edit Course
                </PremiumButton>

                <PremiumButton
                  variant="danger"
                  className="w-full"
                  onClick={handleDelete}
                >
                  <Trash2 size={16} />
                  Delete Course
                </PremiumButton>
              </div>
            </section>
          </aside>
        </div>
      </div>


      {/* ======================================================
          EDIT MODAL
      ====================================================== */}

      {editing && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-md">

          <div className="relative my-8 w-full max-w-3xl overflow-hidden rounded-3xl border border-orange-400/15 bg-[#100d0b] shadow-[0_30px_120px_rgba(0,0,0,0.7)]">

            {/* Modal glow */}

            <div className="pointer-events-none absolute left-1/2 top-[-150px] h-[300px] w-[500px] -translate-x-1/2 rounded-full bg-orange-500/10 blur-[100px]" />

            {/* Header */}

            <div className="relative flex items-center justify-between border-b border-white/[0.07] px-6 py-5">

              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-400/[0.07] text-orange-400">
                  <Crown size={20} />
                </div>

                <div>
                  <h2 className="font-bold">
                    Edit Course
                  </h2>

                  <p className="text-xs text-gray-600">
                    Modify the royal learning realm
                  </p>
                </div>
              </div>

              <button
                onClick={() => setEditing(false)}
                className="rounded-xl border border-white/10 p-2 text-gray-500 transition hover:border-orange-400/30 hover:text-orange-400"
              >
                <X size={18} />
              </button>
            </div>


            {/* Form */}

            <form
              onSubmit={handleUpdate}
              className="relative space-y-6 p-6"
            >

              <div className="grid gap-5 sm:grid-cols-2">

                <InputField
                  label="Course Title"
                  value={formData.courseTitle}
                  onChange={(e) =>
                    handleChange({
                      target: {
                        name: "courseTitle",
                        value: e.target.value,
                      },
                    })
                  }
                  placeholder="Enter course title"
                  required
                />

                <InputField
                  label="Subtitle"
                  value={formData.subTitle}
                  onChange={(e) =>
                    handleChange({
                      target: {
                        name: "subTitle",
                        value: e.target.value,
                      },
                    })
                  }
                  placeholder="Enter course subtitle"
                />

                <SelectField
                  label="Category"
                  value={formData.category}
                  onChange={(e) =>
                    handleChange({
                      target: {
                        name: "category",
                        value: e.target.value,
                      },
                    })
                  }
                >
                  <option value="">
                    Select Category
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

                  <option value="Artificial Intelligence">
                    Artificial Intelligence
                  </option>

                  <option value="Database">
                    Database
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </SelectField>


                <SelectField
                  label="Course Level"
                  value={formData.courseLevel}
                  onChange={(e) =>
                    handleChange({
                      target: {
                        name: "courseLevel",
                        value: e.target.value,
                      },
                    })
                  }
                >
                  <option value="">
                    Select Level
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
                </SelectField>
              </div>


              {/* ==================================================
                  FREE / PAID SELECTOR
              ================================================== */}

              <div>
                <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.18em] text-orange-200/70">
                  Course Access
                </label>

                <div className="grid gap-3 sm:grid-cols-2">

                  {/* FREE */}

                  <button
                    type="button"
                    onClick={handleFreeCourse}
                    className={`group relative overflow-hidden rounded-2xl border p-5 text-left transition-all duration-300 ${
                      isFreeCourse
                        ? "border-emerald-400/50 bg-emerald-400/[0.08] shadow-[0_0_30px_rgba(52,211,153,0.08)]"
                        : "border-white/[0.08] bg-black/20 hover:border-emerald-400/30 hover:bg-emerald-400/[0.03]"
                    }`}
                  >
                    {isFreeCourse && (
                      <div className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400 text-black">
                        <Check size={14} />
                      </div>
                    )}

                    <div className="flex items-center gap-4">

                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl transition-all ${
                          isFreeCourse
                            ? "bg-emerald-400/15 text-emerald-300"
                            : "bg-white/[0.04] text-gray-500"
                        }`}
                      >
                        <Sparkles size={21} />
                      </div>

                      <div>
                        <h3
                          className={`font-bold ${
                            isFreeCourse
                              ? "text-emerald-300"
                              : "text-gray-200"
                          }`}
                        >
                          Free Course
                        </h3>

                        <p className="mt-1 text-xs text-gray-600">
                          Students can enroll without payment
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 text-xs text-gray-500">
                      Course price will be set to{" "}
                      <span className="font-semibold text-emerald-400">
                        ₹0
                      </span>
                    </div>
                  </button>


                  {/* PAID */}

                  <button
                    type="button"
                    onClick={handlePaidCourse}
                    className={`group relative overflow-hidden rounded-2xl border p-5 text-left transition-all duration-300 ${
                      !isFreeCourse
                        ? "border-orange-400/50 bg-orange-400/[0.08] shadow-[0_0_30px_rgba(249,115,22,0.08)]"
                        : "border-white/[0.08] bg-black/20 hover:border-orange-400/30 hover:bg-orange-400/[0.03]"
                    }`}
                  >
                    {!isFreeCourse && (
                      <div className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-orange-400 text-black">
                        <Check size={14} />
                      </div>
                    )}

                    <div className="flex items-center gap-4">

                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl transition-all ${
                          !isFreeCourse
                            ? "bg-orange-400/15 text-orange-300"
                            : "bg-white/[0.04] text-gray-500"
                        }`}
                      >
                        <IndianRupee size={21} />
                      </div>

                      <div>
                        <h3
                          className={`font-bold ${
                            !isFreeCourse
                              ? "text-orange-300"
                              : "text-gray-200"
                          }`}
                        >
                          Paid Course
                        </h3>

                        <p className="mt-1 text-xs text-gray-600">
                          Students purchase access
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 text-xs text-gray-500">
                      Set your own course price below.
                    </div>
                  </button>
                </div>
              </div>


              {/* ==================================================
                  PRICE INPUT
              ================================================== */}

              {!isFreeCourse && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">

                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-orange-200/70">
                    Course Price
                  </label>

                  <div className="relative">

                    <IndianRupee
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400"
                    />

                    <input
                      type="number"
                      min="1"
                      value={formData.coursePrice}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          coursePrice: e.target.value,
                        }))
                      }
                      placeholder="Enter course price"
                      className="w-full rounded-xl border border-white/10 bg-black/30 py-3 pl-11 pr-4 text-sm text-white outline-none transition-all placeholder:text-gray-600 focus:border-orange-400/50 focus:ring-2 focus:ring-orange-400/10"
                    />
                  </div>

                  <p className="mt-2 text-xs text-gray-600">
                    Enter the amount students need to pay to
                    access this course.
                  </p>
                </div>
              )}


              {/* FREE COURSE INFO */}

              {isFreeCourse && (
                <div className="flex items-start gap-3 rounded-xl border border-emerald-400/15 bg-emerald-400/[0.05] p-4">

                  <Check
                    size={18}
                    className="mt-0.5 shrink-0 text-emerald-400"
                  />

                  <div>
                    <p className="text-sm font-semibold text-emerald-300">
                      This is a free course
                    </p>

                    <p className="mt-1 text-xs leading-5 text-gray-500">
                      Students will be able to enroll without
                      making a payment. The course price will be
                      saved as ₹0.
                    </p>
                  </div>
                </div>
              )}


              {/* Description */}

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-orange-200/70">
                  Description
                </label>

                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    handleChange({
                      target: {
                        name: "description",
                        value: e.target.value,
                      },
                    })
                  }
                  rows={6}
                  placeholder="Describe your course..."
                  className="w-full resize-none rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm leading-6 text-white outline-none transition-all placeholder:text-gray-600 focus:border-orange-400/50 focus:ring-2 focus:ring-orange-400/10"
                />
              </div>


              {/* Actions */}

              <div className="flex flex-col-reverse gap-3 border-t border-white/[0.07] pt-5 sm:flex-row sm:justify-end">

                <PremiumButton
                  type="button"
                  variant="dark"
                  onClick={() => setEditing(false)}
                  disabled={saving}
                >
                  <X size={16} />
                  Cancel
                </PremiumButton>

                <PremiumButton
                  type="submit"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <LoaderCircle
                        size={16}
                        className="animate-spin"
                      />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Save Changes
                    </>
                  )}
                </PremiumButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseManagement;
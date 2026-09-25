import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  BookOpen,
  ChevronRight,
  Crown,
  Edit3,
  Film,
  Gem,
  IndianRupee,
  Layers,
  LoaderCircle,
  Plus,
  Save,
  ScrollText,
  Shield,
  Sparkles,
  Swords,
  Trash2,
  Users,
  X,
} from "lucide-react";

import toast from "react-hot-toast";
import api from "../../services/api";

function CourseManagement() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  const [formData, setFormData] = useState({
    courseTitle: "",
    subTitle: "",
    description: "",
    category: "",
    courseLevel: "Beginner",
    coursePrice: 0,
  });

  /* =====================================================
     FETCH COURSE
  ===================================================== */

  const fetchCourse = useCallback(async () => {
    if (!courseId) return;

    try {
      setLoading(true);

      const response = await api.get(
        `/course/${courseId}`,
      );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
            "Failed to load course.",
        );
      }

      const courseData = response.data.course;

      setCourse(courseData);

      setFormData({
        courseTitle: courseData.courseTitle || "",
        subTitle: courseData.subTitle || "",
        description: courseData.description || "",
        category: courseData.category || "",
        courseLevel:
          courseData.courseLevel || "Beginner",
        coursePrice: courseData.coursePrice ?? 0,
      });
    } catch (error) {
      console.error(
        "Course management error:",
        error,
      );

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Unable to load course.",
      );

      navigate("/instructor/courses", {
        replace: true,
      });
    } finally {
      setLoading(false);
    }
  }, [courseId, navigate]);

  useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);

  /* =====================================================
     NAVIGATION
  ===================================================== */

  const goToCourses = () => {
    navigate("/instructor/courses");
  };

  const goToModules = () => {
    navigate(
      `/instructor/courses/${courseId}/modules`,
    );
  };

  const goToLectures = () => {
    navigate(
      `/instructor/courses/${courseId}/lectures`,
    );
  };

  /* =====================================================
     FORM
  ===================================================== */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const setCourseType = (type) => {
    setFormData((previous) => ({
      ...previous,
      coursePrice:
        type === "free"
          ? 0
          : Number(previous.coursePrice) > 0
            ? previous.coursePrice
            : 499,
    }));
  };

  const isFreeCourse =
    Number(formData.coursePrice) === 0;

  /* =====================================================
     UPDATE COURSE
  ===================================================== */

  const handleUpdate = async (event) => {
    event.preventDefault();

    if (saving) return;

    const title = formData.courseTitle.trim();
    const subtitle = formData.subTitle.trim();
    const description =
      formData.description.trim();

    const price = isFreeCourse
      ? 0
      : Number(formData.coursePrice);

    if (!title) {
      toast.error("Course title is required.");
      return;
    }

    if (!description) {
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

    if (!isFreeCourse && price <= 0) {
      toast.error(
        "Paid course price must be greater than ₹0.",
      );
      return;
    }

    try {
      setSaving(true);

      const response = await api.put(
        `/course/${courseId}`,
        {
          courseTitle: title,
          subTitle: subtitle,
          description,
          category: formData.category,
          courseLevel: formData.courseLevel,
          coursePrice: price,
        },
      );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
            "Failed to update course.",
        );
      }

      setCourse(response.data.course);

      setFormData((previous) => ({
        ...previous,
        coursePrice:
          response.data.course.coursePrice ?? 0,
      }));

      setEditing(false);

      toast.success(
        "Course updated successfully.",
      );
    } catch (error) {
      console.error(
        "Update course error:",
        error,
      );

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Unable to update course.",
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
      "Are you sure you want to delete this course? This action cannot be undone.",
    );

    if (!confirmed) return;

    try {
      const response = await api.delete(
        `/course/${courseId}`,
      );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
            "Failed to delete course.",
        );
      }

      toast.success(
        "Course deleted successfully.",
      );

      navigate("/instructor/courses", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "Delete course error:",
        error,
      );

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Unable to delete course.",
      );
    }
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return <LoadingState />;
  }

  /* =====================================================
     NOT FOUND
  ===================================================== */

  if (!course) {
    return (
      <EmptyState
        onBack={goToCourses}
      />
    );
  }

  const thumbnail =
    course.courseThumbnail?.url ||
    "/placeholder-course.jpg";

  const students =
    Number(course.studentCount) || 0;

  const price =
    Number(course.coursePrice) || 0;

  return (
    <div className="relative min-h-full overflow-hidden bg-[#050403] text-white">

      {/* ================================================
          BACKGROUND
      ================================================= */}

      <Background />

      <AmbientParticles />

      {/* ================================================
          PAGE
      ================================================= */}

      <main className="relative z-10 mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">

        {/* ================================================
            HEADER
        ================================================= */}

        <CourseHeader
          course={course}
          editing={editing}
          onBack={goToCourses}
          onEdit={() => setEditing(true)}
          onModules={goToModules}
          onLectures={goToLectures}
          onDelete={handleDeleteCourse}
        />

        {/* ================================================
            CONTENT
        ================================================= */}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">

          {/* LEFT */}

          <div className="space-y-6">

            <CoursePreview
              course={course}
              thumbnail={thumbnail}
              students={students}
              price={price}
            />

            <LearningStructure
              onModules={goToModules}
            />

            <CourseContent
              onLectures={goToLectures}
            />

          </div>

          {/* RIGHT */}

          <aside className="space-y-6">

            <CourseDetails
              course={course}
              students={students}
              price={price}
            />

            <QuickActions
              onEdit={() => setEditing(true)}
              onModules={goToModules}
              onLectures={goToLectures}
            />

            <RealmStatus />

          </aside>
        </div>
      </main>

      {/* ================================================
          EDIT MODAL
      ================================================= */}

      {editing && (
        <EditCourseModal
          formData={formData}
          saving={saving}
          isFreeCourse={isFreeCourse}
          onChange={handleChange}
          onCourseType={setCourseType}
          onSubmit={handleUpdate}
          onClose={() => {
            if (!saving) {
              setEditing(false);
            }
          }}
        />
      )}
    </div>
  );
}

/* =======================================================
   HEADER
======================================================= */

function CourseHeader({
  course,
  editing,
  onBack,
  onEdit,
  onModules,
  onLectures,
  onDelete,
}) {
  return (
    <header className="mb-8">

      <button
        type="button"
        onClick={onBack}
        className="group mb-6 inline-flex items-center gap-2 text-sm font-medium text-white/40 transition hover:text-orange-300"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] transition group-hover:border-orange-400/30 group-hover:bg-orange-500/10">
          <ArrowLeft size={16} />
        </span>

        Back to Courses
      </button>

      <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">

        <div className="max-w-4xl">

          <div className="mb-3 flex items-center gap-3">

            <IconBox>
              <Crown size={17} />
            </IconBox>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-orange-400">
                Course Command
              </p>

              <p className="text-[10px] uppercase tracking-[0.18em] text-white/25">
                Royal Learning Realm
              </p>
            </div>
          </div>

          <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
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
              onClick={onEdit}
            >
              Edit Course
            </PremiumButton>
          )}

          <PremiumButton
            icon={<Layers size={16} />}
            onClick={onModules}
            variant="gold"
          >
            Manage Modules
          </PremiumButton>

          <PremiumButton
            icon={<Film size={16} />}
            onClick={onLectures}
            variant="orange"
          >
            Manage Lectures
          </PremiumButton>

          <button
            type="button"
            onClick={onDelete}
            className="inline-flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/[0.06] px-4 py-3 text-sm font-semibold text-red-300 transition hover:border-red-400/50 hover:bg-red-500/10"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>
    </header>
  );
}

/* =======================================================
   COURSE PREVIEW
======================================================= */

function CoursePreview({
  course,
  thumbnail,
  students,
  price,
}) {
  return (
    <section className="group overflow-hidden rounded-[28px] border border-white/[0.08] bg-white/[0.025] shadow-2xl shadow-black/30 backdrop-blur-xl">

      <div className="relative aspect-[16/6] min-h-[230px] overflow-hidden bg-black">

        <img
          src={thumbnail}
          alt={course.courseTitle}
          className="h-full w-full object-cover transition duration-1000 group-hover:scale-[1.04]"
          onError={(event) => {
            event.currentTarget.src =
              "/placeholder-course.jpg";
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#050403] via-black/30 to-transparent" />

        <div className="absolute inset-0 bg-gradient-to-r from-orange-950/20 via-transparent to-black/30" />

        <div className="absolute left-6 top-6">
          <Badge icon={<Sparkles size={12} />}>
            Course Realm
          </Badge>
        </div>

        <div className="absolute bottom-6 left-6 right-6">

          <div className="flex flex-wrap items-end justify-between gap-4">

            <div>

              <Badge
                icon={<Shield size={12} />}
              >
                {course.courseLevel}
              </Badge>

              <h2 className="mt-3 text-2xl font-black sm:text-3xl">
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
            label={
              price === 0
                ? "Free"
                : `₹${price}`
            }
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
    </section>
  );
}

/* =======================================================
   LEARNING STRUCTURE
======================================================= */

function LearningStructure({
  onModules,
}) {
  const cards = [
    {
      icon: <Layers size={20} />,
      title: "Modules",
      description:
        "Create and organize the chapters of your course.",
    },
    {
      icon: <Film size={20} />,
      title: "Lectures",
      description:
        "Assign lectures to your learning structure.",
    },
    {
      icon: <Sparkles size={20} />,
      title: "AI Quizzes",
      description:
        "Turn module content into intelligent challenges.",
    },
  ];

  return (
    <section className="overflow-hidden rounded-[28px] border border-white/[0.08] bg-white/[0.025] shadow-2xl shadow-black/30 backdrop-blur-xl">

      <SectionHeader
        icon={<Layers size={20} />}
        eyebrow="Architecture"
        title="Learning Structure"
        description="Shape your course into modules, lectures and AI-powered learning challenges."
        action={
          <PremiumButton
            icon={<Plus size={16} />}
            onClick={onModules}
            variant="gold"
          >
            Manage Modules
          </PremiumButton>
        }
      />

      <div className="p-6 sm:p-7">

        <div className="grid gap-4 sm:grid-cols-3">

          {cards.map((card) => (
            <StructureCard
              key={card.title}
              {...card}
            />
          ))}

        </div>

        <NavigationCard
          icon={<ScrollText size={18} />}
          title="Open Module Management"
          description="Create modules, organize lectures and manage quizzes."
          onClick={onModules}
        />

      </div>
    </section>
  );
}

/* =======================================================
   COURSE CONTENT
======================================================= */

function CourseContent({
  onLectures,
}) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-white/[0.08] bg-white/[0.025] shadow-2xl shadow-black/30 backdrop-blur-xl">

      <SectionHeader
        icon={<Film size={17} />}
        eyebrow="Knowledge Vault"
        title="Course Content"
        description="Create lectures, upload videos and manage your course content."
        action={
          <PremiumButton
            icon={<Plus size={16} />}
            onClick={onLectures}
            variant="orange"
          >
            Add Lecture
          </PremiumButton>
        }
      />

      <div className="flex min-h-[280px] flex-col items-center justify-center px-6 py-12 text-center">

        <IconBox size="large">
          <BookOpen size={26} />
        </IconBox>

        <h3 className="mt-5 font-bold">
          Manage your lectures
        </h3>

        <p className="mt-2 max-w-sm text-sm leading-6 text-white/35">
          Create lectures, upload videos, edit lecture
          titles and assign lectures to modules.
        </p>

        <button
          type="button"
          onClick={onLectures}
          className="group mt-6 inline-flex items-center gap-2 rounded-xl border border-orange-400/20 bg-orange-500/[0.07] px-4 py-2.5 text-sm font-semibold text-orange-300 transition hover:border-orange-400/40 hover:bg-orange-500/15"
        >
          <Film size={16} />
          Manage Lectures
          <ChevronRight
            size={15}
            className="transition group-hover:translate-x-1"
          />
        </button>

      </div>
    </section>
  );
}

/* =======================================================
   COURSE DETAILS
======================================================= */

function CourseDetails({
  course,
  students,
  price,
}) {
  return (
    <section className="rounded-[28px] border border-white/[0.08] bg-white/[0.025] p-6 shadow-2xl shadow-black/30 backdrop-blur-xl">

      <SectionTitle
        icon={<Shield size={18} />}
        eyebrow="Royal Record"
        title="Course Details"
      />

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
          value={
            price === 0
              ? "Free"
              : `₹${price}`
          }
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
                  course.createdAt,
                ).toLocaleDateString()
              : "—"
          }
        />

      </div>
    </section>
  );
}

/* =======================================================
   QUICK ACTIONS
======================================================= */

function QuickActions({
  onEdit,
  onModules,
  onLectures,
}) {
  const actions = [
    {
      icon: <Edit3 size={17} />,
      label: "Edit Course",
      onClick: onEdit,
    },
    {
      icon: <Layers size={17} />,
      label: "Manage Modules",
      onClick: onModules,
      highlighted: true,
    },
    {
      icon: <Plus size={17} />,
      label: "Add Lecture",
      onClick: onLectures,
    },
    {
      icon: <Film size={17} />,
      label: "Manage Lectures",
      onClick: onLectures,
      highlighted: true,
    },
  ];

  return (
    <section className="rounded-[28px] border border-white/[0.08] bg-white/[0.025] p-6 shadow-2xl shadow-black/30 backdrop-blur-xl">

      <SectionTitle
        icon={<Swords size={18} />}
        eyebrow="Command Deck"
        title="Quick Actions"
      />

      <div className="mt-6 space-y-2.5">

        {actions.map((action) => (
          <QuickAction
            key={action.label}
            {...action}
          />
        ))}

      </div>
    </section>
  );
}

/* =======================================================
   REALM STATUS
======================================================= */

function RealmStatus() {
  return (
    <section className="relative overflow-hidden rounded-[28px] border border-orange-400/15 bg-gradient-to-br from-orange-500/[0.08] via-transparent to-amber-500/[0.04] p-6">

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

          <IconBox>
            <Crown size={21} />
          </IconBox>

          <div>
            <p className="text-sm font-bold">
              Course command active
            </p>

            <p className="mt-1 text-xs leading-5 text-white/35">
              Your learning realm is ready for expansion.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}

/* =======================================================
   EDIT MODAL
======================================================= */

function EditCourseModal({
  formData,
  saving,
  isFreeCourse,
  onChange,
  onCourseType,
  onSubmit,
  onClose,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 py-6 backdrop-blur-md">

      <div className="relative max-h-[92vh] w-full max-w-2xl overflow-hidden rounded-[30px] border border-orange-400/15 bg-[#0a0806] shadow-[0_30px_120px_rgba(0,0,0,0.7)]">

        <div className="pointer-events-none absolute left-[-100px] top-[-100px] h-64 w-64 rounded-full bg-orange-500/10 blur-[90px]" />

        {/* MODAL HEADER */}

        <div className="relative flex items-center justify-between border-b border-white/[0.07] px-6 py-5 sm:px-7">

          <SectionTitle
            icon={<Edit3 size={18} />}
            eyebrow="Royal Scribe"
            title="Edit Course"
          />

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-white/40 transition hover:border-orange-400/25 hover:bg-orange-500/10 hover:text-orange-300 disabled:opacity-50"
          >
            <X size={17} />
          </button>

        </div>

        {/* FORM */}

        <form
          onSubmit={onSubmit}
          className="relative max-h-[calc(92vh-85px)] space-y-5 overflow-y-auto p-6 sm:p-7"
        >

          <InputField
            label="Course Title"
            name="courseTitle"
            value={formData.courseTitle}
            onChange={onChange}
          />

          <InputField
            label="Subtitle"
            name="subTitle"
            value={formData.subTitle}
            onChange={onChange}
            required={false}
          />

          <FieldLabel label="Description">
            <textarea
              name="description"
              value={formData.description}
              onChange={onChange}
              rows={6}
              required
              className={inputClass("resize-none")}
            />
          </FieldLabel>

          <div className="grid gap-4 sm:grid-cols-2">

            <SelectField
              label="Category"
              name="category"
              value={formData.category}
              onChange={onChange}
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
              onChange={onChange}
              options={[
                "Beginner",
                "Intermediate",
                "Advanced",
              ]}
              placeholder="Select level"
            />

          </div>

          {/* COURSE TYPE */}

          <FieldLabel label="Course Access">

            <div className="grid grid-cols-2 gap-3">

              <CourseTypeButton
                active={isFreeCourse}
                icon={<Sparkles size={18} />}
                title="Free"
                description="Students can enroll directly"
                onClick={() =>
                  onCourseType("free")
                }
              />

              <CourseTypeButton
                active={!isFreeCourse}
                icon={<IndianRupee size={18} />}
                title="Paid"
                description="Students pay before access"
                onClick={() =>
                  onCourseType("paid")
                }
              />

            </div>

          </FieldLabel>

          {/* PRICE */}

          {!isFreeCourse && (
            <FieldLabel label="Course Price">

              <div className="relative">

                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-orange-400">
                  ₹
                </span>

                <input
                  type="number"
                  name="coursePrice"
                  value={formData.coursePrice}
                  onChange={onChange}
                  min="1"
                  step="1"
                  required
                  className={inputClass(
                    "pl-9",
                  )}
                />

              </div>

            </FieldLabel>
          )}

          {isFreeCourse && (
            <div className="rounded-2xl border border-emerald-400/15 bg-emerald-500/[0.05] px-4 py-3 text-sm text-emerald-300">
              This course will be available for free.
              Students won't need to make a payment.
            </div>
          )}

          {/* ACTIONS */}

          <div className="flex justify-end gap-3 border-t border-white/[0.07] pt-5">

            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-xl border border-white/[0.08] bg-white/[0.025] px-5 py-3 text-sm font-semibold text-white/50 transition hover:bg-white/[0.05] hover:text-white disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl border border-orange-300/30 bg-gradient-to-r from-orange-500/90 to-amber-500/90 px-5 py-3 text-sm font-bold text-black transition hover:from-orange-400 hover:to-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
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
  );
}

/* =======================================================
   COURSE TYPE BUTTON
======================================================= */

function CourseTypeButton({
  active,
  icon,
  title,
  description,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border p-4 text-left transition ${
        active
          ? "border-orange-400/40 bg-orange-500/10 text-orange-300 shadow-[0_0_25px_rgba(249,115,22,0.08)]"
          : "border-white/[0.08] bg-white/[0.02] text-white/40 hover:border-white/15 hover:bg-white/[0.04]"
      }`}
    >
      <div className="flex items-center gap-3">
        {icon}

        <div>
          <p className="text-sm font-bold">
            {title}
          </p>

          <p className="mt-1 text-[11px] text-white/30">
            {description}
          </p>
        </div>
      </div>
    </button>
  );
}

/* =======================================================
   SECTION HEADER
======================================================= */

function SectionHeader({
  icon,
  eyebrow,
  title,
  description,
  action,
}) {
  return (
    <div className="flex flex-col gap-5 border-b border-white/[0.06] px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-7">

      <div>
        <div className="flex items-center gap-3">

          <IconBox>
            {icon}
          </IconBox>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-orange-400">
              {eyebrow}
            </p>

            <h2 className="text-lg font-bold">
              {title}
            </h2>
          </div>

        </div>

        {description && (
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/35">
            {description}
          </p>
        )}
      </div>

      {action}

    </div>
  );
}

/* =======================================================
   SECTION TITLE
======================================================= */

function SectionTitle({
  icon,
  eyebrow,
  title,
}) {
  return (
    <div className="flex items-center gap-3">

      <IconBox>
        {icon}
      </IconBox>

      <div>
        <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-orange-400">
          {eyebrow}
        </p>

        <h2 className="text-lg font-bold">
          {title}
        </h2>
      </div>

    </div>
  );
}

/* =======================================================
   PREMIUM BUTTON
======================================================= */

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
      "border-amber-400/25 bg-amber-500/[0.08] text-amber-300 hover:border-amber-300/50 hover:bg-amber-500/[0.14]",

    orange:
      "border-orange-400/30 bg-gradient-to-r from-orange-500/90 to-amber-500/90 text-black hover:from-orange-400 hover:to-amber-400",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold transition-all duration-300 ${variants[variant]}`}
    >
      <span className="transition group-hover:scale-110">
        {icon}
      </span>

      {children}
    </button>
  );
}

/* =======================================================
   QUICK ACTION
======================================================= */

function QuickAction({
  icon,
  label,
  onClick,
  highlighted,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${
        highlighted
          ? "border-orange-400/15 bg-orange-500/[0.06] text-orange-300 hover:border-orange-400/35 hover:bg-orange-500/10"
          : "border-white/[0.07] bg-white/[0.015] text-white/50 hover:border-orange-400/20 hover:bg-orange-500/[0.04] hover:text-orange-300"
      }`}
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.06] bg-black/20 text-orange-400/80">
        {icon}
      </span>

      <span>{label}</span>

      <ChevronRight
        size={15}
        className="ml-auto text-white/15 transition group-hover:translate-x-1 group-hover:text-orange-300"
      />
    </button>
  );
}

/* =======================================================
   STRUCTURE CARD
======================================================= */

function StructureCard({
  icon,
  title,
  description,
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-black/20 p-5 transition duration-300 hover:-translate-y-1 hover:border-orange-400/20 hover:bg-orange-500/[0.03]">

      <div className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-orange-400/15 bg-orange-500/[0.06] text-orange-300 transition group-hover:border-orange-400/30 group-hover:bg-orange-500/10">
        {icon}
      </div>

      <h3 className="mt-4 text-sm font-bold text-white/80">
        {title}
      </h3>

      <p className="mt-2 text-xs leading-5 text-white/30">
        {description}
      </p>
    </div>
  );
}

/* =======================================================
   NAVIGATION CARD
======================================================= */

function NavigationCard({
  icon,
  title,
  description,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group mt-5 flex w-full items-center justify-between rounded-2xl border border-white/[0.07] bg-black/20 px-4 py-4 text-left transition hover:border-orange-400/25 hover:bg-orange-500/[0.04]"
    >
      <div className="flex items-center gap-3">

        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-orange-300">
          {icon}
        </div>

        <div>
          <p className="text-sm font-bold text-white/80">
            {title}
          </p>

          <p className="mt-1 text-xs text-white/30">
            {description}
          </p>
        </div>

      </div>

      <ChevronRight
        size={19}
        className="text-white/20 transition group-hover:translate-x-1 group-hover:text-orange-300"
      />
    </button>
  );
}

/* =======================================================
   INPUT FIELD
======================================================= */

function InputField({
  label,
  name,
  value,
  onChange,
  required = true,
}) {
  return (
    <FieldLabel label={label}>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={inputClass()}
      />
    </FieldLabel>
  );
}

/* =======================================================
   SELECT FIELD
======================================================= */

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  placeholder,
}) {
  return (
    <FieldLabel label={label}>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required
        className={inputClass()}
      >
        <option value="">
          {placeholder}
        </option>

        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>
    </FieldLabel>
  );
}

/* =======================================================
   FIELD LABEL
======================================================= */

function FieldLabel({
  label,
  children,
}) {
  return (
    <div>
      <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.15em] text-white/45">
        {label}
      </label>

      {children}
    </div>
  );
}

/* =======================================================
   INPUT CLASS
======================================================= */

function inputClass(extra = "") {
  return `w-full rounded-2xl border border-white/[0.08] bg-white/[0.025] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-orange-400/40 focus:bg-orange-500/[0.03] focus:ring-4 focus:ring-orange-500/[0.05] ${extra}`;
}

/* =======================================================
   INFO BADGE
======================================================= */

function InfoBadge({
  icon,
  label,
  highlight = false,
}) {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold ${
        highlight
          ? "border-amber-400/20 bg-amber-500/[0.07] text-amber-300"
          : "border-white/[0.07] bg-white/[0.025] text-white/45"
      }`}
    >
      <span
        className={
          highlight
            ? "text-amber-400"
            : "text-orange-400/80"
        }
      >
        {icon}
      </span>

      {label}
    </div>
  );
}

/* =======================================================
   DETAIL ROW
======================================================= */

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
          gold
            ? "text-amber-300"
            : "text-white/75"
        }`}
      >
        {value}
      </span>

    </div>
  );
}

/* =======================================================
   BADGE
======================================================= */

function Badge({
  icon,
  children,
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-300/20 bg-black/50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-orange-300 backdrop-blur-md">
      {icon}
      {children}
    </span>
  );
}

/* =======================================================
   ICON BOX
======================================================= */

function IconBox({
  children,
  size = "normal",
}) {
  return (
    <div
      className={`relative flex shrink-0 items-center justify-center rounded-xl border border-orange-400/20 bg-orange-500/[0.07] text-orange-300 ${
        size === "large"
          ? "h-16 w-16 rounded-2xl"
          : "h-10 w-10"
      }`}
    >
      {children}
    </div>
  );
}

/* =======================================================
   LOADING
======================================================= */

function LoadingState() {
  return (
    <div className="relative flex min-h-[600px] items-center justify-center overflow-hidden bg-[#050403] text-white">

      <Background />
      <AmbientParticles />

      <div className="relative z-10 text-center">

        <div className="relative mx-auto flex h-24 w-24 items-center justify-center">

          <div className="absolute inset-0 animate-ping rounded-full bg-orange-500/10" />

          <div className="absolute inset-2 rounded-full border border-orange-400/20" />

          <IconBox size="large">
            <Crown size={30} />
          </IconBox>

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

/* =======================================================
   EMPTY STATE
======================================================= */

function EmptyState({
  onBack,
}) {
  return (
    <div className="relative flex min-h-[600px] items-center justify-center overflow-hidden bg-[#050403] px-6 text-center text-white">

      <Background />
      <AmbientParticles />

      <div className="relative z-10">

        <IconBox size="large">
          <BookOpen size={30} />
        </IconBox>

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
          onClick={onBack}
          className="mt-7 inline-flex items-center gap-2 rounded-xl border border-orange-400/30 bg-orange-500/10 px-5 py-3 text-sm font-semibold text-orange-300 transition hover:bg-orange-500/20"
        >
          <ArrowLeft size={17} />
          Back to Courses
        </button>

      </div>
    </div>
  );
}

/* =======================================================
   BACKGROUND
======================================================= */

function Background() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">

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
  );
}

/* =======================================================
   AMBIENT PARTICLES
======================================================= */

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
    }),
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
            animation: `courseEmberFloat ${particle.duration} ease-in-out ${particle.delay} infinite`,
          }}
        />
      ))}

      <style>{`
        @keyframes courseEmberFloat {
          0% {
            transform:
              translateY(0)
              scale(1);
            opacity: 0;
          }

          20% {
            opacity: .65;
          }

          80% {
            opacity: .3;
          }

          100% {
            transform:
              translateY(-110px)
              scale(.4);
            opacity: 0;
          }
        }
      `}</style>

    </div>
  );
}

export default CourseManagement;
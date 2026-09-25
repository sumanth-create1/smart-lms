import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  Crown,
  ImagePlus,
  IndianRupee,
  LoaderCircle,
  Sparkles,
  Upload,
  WandSparkles,
  X,
} from "lucide-react";

import toast from "react-hot-toast";
import api from "../../services/api";

const categories = [
  "Web Development",
  "Frontend Development",
  "Backend Development",
  "Full Stack Development",
  "Programming",
  "Data Structures",
  "Database",
  "DevOps",
  "Mobile Development",
  "Other",
];

const levels = ["Beginner", "Intermediate", "Advanced"];

const initialForm = {
  courseTitle: "",
  subTitle: "",
  description: "",
  category: "",
  courseLevel: "Beginner",
  coursePrice: "",
};

function CreateCourse() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialForm);
  const [isFreeCourse, setIsFreeCourse] = useState(false);

  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");

  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const [currentStep, setCurrentStep] = useState(1);

  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [showLevelMenu, setShowLevelMenu] = useState(false);

  const [errors, setErrors] = useState({});

  /* ---------------------------------------------------------
     THUMBNAIL CLEANUP
  --------------------------------------------------------- */

  useEffect(() => {
    return () => {
      if (thumbnailPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(thumbnailPreview);
      }
    };
  }, [thumbnailPreview]);

  /* ---------------------------------------------------------
     CLOSE DROPDOWNS WITH ESC
  --------------------------------------------------------- */

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setShowCategoryMenu(false);
        setShowLevelMenu(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  /* ---------------------------------------------------------
     FORM HANDLERS
  --------------------------------------------------------- */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const selectCategory = (category) => {
    handleChange({
      target: {
        name: "category",
        value: category,
      },
    });

    setShowCategoryMenu(false);
  };

  const selectLevel = (level) => {
    handleChange({
      target: {
        name: "courseLevel",
        value: level,
      },
    });

    setShowLevelMenu(false);
  };

  /* ---------------------------------------------------------
     FREE / PAID
  --------------------------------------------------------- */

  const handleFreeCourse = () => {
    setIsFreeCourse(true);

    setFormData((prev) => ({
      ...prev,
      coursePrice: "0",
    }));

    setErrors((prev) => ({
      ...prev,
      coursePrice: "",
    }));
  };

  const handlePaidCourse = () => {
    setIsFreeCourse(false);

    setFormData((prev) => ({
      ...prev,
      coursePrice:
        !prev.coursePrice || prev.coursePrice === "0"
          ? "499"
          : prev.coursePrice,
    }));
  };

  /* ---------------------------------------------------------
     THUMBNAIL
  --------------------------------------------------------- */

  const handleThumbnailChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Thumbnail must be less than 5MB.");
      event.target.value = "";
      return;
    }

    if (thumbnailPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(thumbnailPreview);
    }

    const previewUrl = URL.createObjectURL(file);

    setThumbnail(file);
    setThumbnailPreview(previewUrl);

    setErrors((prev) => ({
      ...prev,
      thumbnail: "",
    }));
  };

  const removeThumbnail = () => {
    if (thumbnailPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(thumbnailPreview);
    }

    setThumbnail(null);
    setThumbnailPreview("");
  };

  /* ---------------------------------------------------------
     VALIDATION
  --------------------------------------------------------- */

  const validateStepOne = () => {
    const newErrors = {};

    const title = formData.courseTitle.trim();
    const subTitle = formData.subTitle.trim();
    const description = formData.description.trim();

    if (!title) {
      newErrors.courseTitle = "Course title is required.";
    }

    if (!subTitle) {
      newErrors.subTitle = "Course subtitle is required.";
    }

    if (!description) {
      newErrors.description = "Course description is required.";
    }

    if (!formData.category) {
      newErrors.category = "Select a category.";
    }

    if (!formData.courseLevel) {
      newErrors.courseLevel = "Select a course level.";
    }

    if (!isFreeCourse) {
      const price = Number(formData.coursePrice);

      if (!formData.coursePrice.trim()) {
        newErrors.coursePrice = "Enter a course price.";
      } else if (!Number.isFinite(price)) {
        newErrors.coursePrice = "Enter a valid course price.";
      } else if (price <= 0) {
        newErrors.coursePrice =
          "Paid course price must be greater than 0.";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const validateStepTwo = () => {
    if (!thumbnail) {
      setErrors({
        thumbnail: "Please upload a course thumbnail.",
      });

      toast.error("Please upload a course thumbnail.");

      return false;
    }

    setErrors({});

    return true;
  };

  /* ---------------------------------------------------------
     STEP NAVIGATION
  --------------------------------------------------------- */

  const handleNext = () => {
    if (currentStep === 1 && !validateStepOne()) {
      toast.error("Please complete all required fields.");
      return;
    }

    if (currentStep === 2 && !validateStepTwo()) {
      return;
    }

    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  /* ---------------------------------------------------------
     AI SCRIBE
  --------------------------------------------------------- */

  const handleAiScribe = async () => {
    if (!formData.courseTitle.trim()) {
      toast.error("Enter a course title first.");
      return;
    }

    setAiLoading(true);

    try {
      /*
       * Keep your existing AI Scribe API call here
       * if you already have one connected.
       *
       * No new backend endpoint is created here.
       */

      toast.success("AI Scribe is ready.");
    } catch (error) {
      console.error("AI Scribe error:", error);

      toast.error(
        error?.response?.data?.message ||
          "Unable to generate course content.",
      );
    } finally {
      setAiLoading(false);
    }
  };

  /* ---------------------------------------------------------
     CREATE COURSE
  --------------------------------------------------------- */

  const handleCreateCourse = async () => {
    if (loading) return;

    if (!validateStepOne()) {
      setCurrentStep(1);
      toast.error("Please complete the required course details.");
      return;
    }

    if (!validateStepTwo()) {
      setCurrentStep(2);
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      data.append(
        "courseTitle",
        formData.courseTitle.trim(),
      );

      data.append(
        "subTitle",
        formData.subTitle.trim(),
      );

      data.append(
        "description",
        formData.description.trim(),
      );

      data.append("category", formData.category);
      data.append("courseLevel", formData.courseLevel);

      const coursePrice = isFreeCourse
        ? 0
        : Number(formData.coursePrice);

      data.append("coursePrice", String(coursePrice));

      data.append("courseThumbnail", thumbnail);

      /*
       * IMPORTANT:
       *
       * Do NOT manually set Content-Type here.
       *
       * Axios/browser automatically adds:
       *
       * multipart/form-data;
       * boundary=....
       */

      const response = await api.post(
        "/course/create",
        data,
      );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
            "Course creation failed.",
        );
      }

      toast.success("Course created successfully.");

      const createdCourse =
        response.data?.course ||
        response.data?.createdCourse;

      if (createdCourse?._id) {
        navigate(
          `/instructor/courses/${createdCourse._id}`,
        );
      } else {
        navigate("/instructor/courses");
      }
    } catch (error) {
      console.error("Create course error:", error);

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to create course.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------------------------------------------------
     PRICE DISPLAY
  --------------------------------------------------------- */

  const priceLabel = useMemo(() => {
    if (isFreeCourse) {
      return "FREE";
    }

    if (!formData.coursePrice) {
      return "₹0";
    }

    const price = Number(formData.coursePrice);

    if (!Number.isFinite(price)) {
      return "₹0";
    }

    return `₹${price.toLocaleString("en-IN")}`;
  }, [formData.coursePrice, isFreeCourse]);

  /* ---------------------------------------------------------
     UI
  --------------------------------------------------------- */

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#070605] text-white">
      <PremiumStyles />

      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[10%] top-[10%] h-72 w-72 rounded-full bg-orange-600/10 blur-[120px]" />

        <div className="absolute right-[5%] top-[30%] h-96 w-96 rounded-full bg-amber-500/10 blur-[150px]" />

        <div className="absolute bottom-[5%] left-[35%] h-80 w-80 rounded-full bg-red-900/10 blur-[140px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#090807]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() =>
              navigate("/instructor/courses")
            }
            className="premium-action group"
          >
            <ArrowLeft size={18} />
            <span>Back to Courses</span>
          </button>

          <div className="hidden items-center gap-3 sm:flex">
            <Crown
              className="text-amber-400"
              size={20}
            />

            <span className="text-sm font-semibold tracking-[0.25em] text-amber-300">
              THE ROYAL ARCHIVE
            </span>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/5 px-3 py-2">
            <BookOpen
              size={16}
              className="text-amber-400"
            />

            <span className="text-xs font-medium text-white/70">
              Course Creation
            </span>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {/* Hero */}
        <section className="mb-10">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">
              <Sparkles size={14} />
              Forge a New Course
            </div>

            <h1 className="premium-heading text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              Build something
              <span className="block text-amber-400">
                worth learning.
              </span>
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/55 sm:text-base">
              Create a premium learning experience for
              your students. Define the course identity,
              choose its access model, and prepare the
              visual presentation.
            </p>
          </div>
        </section>

        {/* Steps */}
        <div className="mb-8 grid grid-cols-3 gap-2 sm:gap-4">
          <StepIndicator
            number="01"
            title="Identity"
            active={currentStep === 1}
            completed={currentStep > 1}
          />

          <StepIndicator
            number="02"
            title="Appearance"
            active={currentStep === 2}
            completed={currentStep > 2}
          />

          <StepIndicator
            number="03"
            title="Review"
            active={currentStep === 3}
            completed={false}
          />
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* Main */}
          <section className="premium-panel rounded-[2rem] p-5 sm:p-7 lg:p-9">
            {currentStep === 1 && (
              <CourseIdentity
                formData={formData}
                errors={errors}
                isFreeCourse={isFreeCourse}
                showCategoryMenu={showCategoryMenu}
                showLevelMenu={showLevelMenu}
                setShowCategoryMenu={
                  setShowCategoryMenu
                }
                setShowLevelMenu={setShowLevelMenu}
                handleChange={handleChange}
                selectCategory={selectCategory}
                selectLevel={selectLevel}
                handleFreeCourse={handleFreeCourse}
                handlePaidCourse={handlePaidCourse}
                handleAiScribe={handleAiScribe}
                aiLoading={aiLoading}
              />
            )}

            {currentStep === 2 && (
              <CourseAppearance
                thumbnailPreview={thumbnailPreview}
                errors={errors}
                handleThumbnailChange={
                  handleThumbnailChange
                }
                removeThumbnail={removeThumbnail}
              />
            )}

            {currentStep === 3 && (
              <CourseReview
                formData={formData}
                thumbnailPreview={thumbnailPreview}
                isFreeCourse={isFreeCourse}
                priceLabel={priceLabel}
              />
            )}

            {/* Navigation */}
            <div className="mt-10 flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={handleBack}
                disabled={currentStep === 1 || loading}
                className="premium-secondary-button disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ArrowLeft size={17} />
                Back
              </button>

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="premium-primary-button"
                >
                  Continue
                  <ArrowRight size={17} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleCreateCourse}
                  disabled={loading}
                  className="premium-primary-button min-w-[180px] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <LoaderCircle
                        size={18}
                        className="animate-spin"
                      />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Crown size={18} />
                      Create Course
                    </>
                  )}
                </button>
              )}
            </div>
          </section>

          {/* Preview */}
          <aside className="h-fit lg:sticky lg:top-24">
            <CoursePreview
              formData={formData}
              thumbnailPreview={thumbnailPreview}
              isFreeCourse={isFreeCourse}
              priceLabel={priceLabel}
            />
          </aside>
        </div>
      </main>
    </div>
  );
}

/* =========================================================
   COURSE IDENTITY
========================================================= */

function CourseIdentity({
  formData,
  errors,
  isFreeCourse,
  showCategoryMenu,
  showLevelMenu,
  setShowCategoryMenu,
  setShowLevelMenu,
  handleChange,
  selectCategory,
  selectLevel,
  handleFreeCourse,
  handlePaidCourse,
  handleAiScribe,
  aiLoading,
}) {
  return (
    <div>
      <SectionHeading
        icon={<BookOpen size={20} />}
        title="Course Identity"
        description="Give your course a strong identity."
      />

      <div className="mt-8 space-y-6">
        <Field
          label="Course Title"
          required
          error={errors.courseTitle}
        >
          <input
            type="text"
            name="courseTitle"
            value={formData.courseTitle}
            onChange={handleChange}
            placeholder="e.g. Advanced MERN Stack Development"
            className="premium-input"
          />
        </Field>

        <Field
          label="Course Subtitle"
          required
          error={errors.subTitle}
        >
          <div className="relative">
            <input
              type="text"
              name="subTitle"
              value={formData.subTitle}
              onChange={handleChange}
              placeholder="A short description students will see first"
              className="premium-input pr-32"
            />

            <button
              type="button"
              onClick={handleAiScribe}
              disabled={aiLoading}
              className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1.5 rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-xs font-semibold text-amber-300 transition hover:bg-amber-500/20 disabled:opacity-50"
            >
              {aiLoading ? (
                <LoaderCircle
                  size={14}
                  className="animate-spin"
                />
              ) : (
                <WandSparkles size={14} />
              )}
              AI
            </button>
          </div>
        </Field>

        <Field
          label="Description"
          required
          error={errors.description}
        >
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={7}
            placeholder="Describe what students will learn..."
            className="premium-input resize-none"
          />
        </Field>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Category */}
          <Field
            label="Category"
            required
            error={errors.category}
          >
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setShowCategoryMenu(
                    (prev) => !prev,
                  )
                }
                className="premium-select"
              >
                <span
                  className={
                    formData.category
                      ? "text-white"
                      : "text-white/35"
                  }
                >
                  {formData.category ||
                    "Select category"}
                </span>

                <ChevronDown
                  size={18}
                  className="text-white/40"
                />
              </button>

              {showCategoryMenu && (
                <div className="premium-dropdown">
                  {categories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() =>
                        selectCategory(category)
                      }
                      className="premium-option"
                    >
                      {category}

                      {formData.category ===
                        category && (
                        <Check
                          size={16}
                          className="text-amber-400"
                        />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </Field>

          {/* Level */}
          <Field
            label="Difficulty"
            required
            error={errors.courseLevel}
          >
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setShowLevelMenu(
                    (prev) => !prev,
                  )
                }
                className="premium-select"
              >
                <span className="text-white">
                  {formData.courseLevel}
                </span>

                <ChevronDown
                  size={18}
                  className="text-white/40"
                />
              </button>

              {showLevelMenu && (
                <div className="premium-dropdown">
                  {levels.map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() =>
                        selectLevel(level)
                      }
                      className="premium-option"
                    >
                      {level}

                      {formData.courseLevel ===
                        level && (
                        <Check
                          size={16}
                          className="text-amber-400"
                        />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </Field>
        </div>

        {/* Access */}
        <div>
          <label className="mb-3 block text-sm font-semibold text-white">
            Course Access
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <AccessCard
              active={isFreeCourse}
              icon={<Sparkles size={20} />}
              title="Free Course"
              description="Students can enroll without payment."
              onClick={handleFreeCourse}
            />

            <AccessCard
              active={!isFreeCourse}
              icon={<IndianRupee size={20} />}
              title="Paid Course"
              description="Students purchase access."
              onClick={handlePaidCourse}
            />
          </div>
        </div>

        {!isFreeCourse && (
          <Field
            label="Course Price"
            required
            error={errors.coursePrice}
          >
            <div className="relative">
              <IndianRupee
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400"
              />

              <input
                type="number"
                min="1"
                step="1"
                name="coursePrice"
                value={formData.coursePrice}
                onChange={handleChange}
                placeholder="499"
                className="premium-input pl-11"
              />
            </div>
          </Field>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   COURSE APPEARANCE
========================================================= */

function CourseAppearance({
  thumbnailPreview,
  errors,
  handleThumbnailChange,
  removeThumbnail,
}) {
  return (
    <div>
      <SectionHeading
        icon={<ImagePlus size={20} />}
        title="Course Appearance"
        description="Choose the visual identity students will see."
      />

      <div className="mt-8">
        <label className="mb-3 block text-sm font-semibold text-white">
          Course Thumbnail
        </label>

        <label className="group relative block cursor-pointer overflow-hidden rounded-[1.5rem] border border-dashed border-amber-500/25 bg-black/20 transition hover:border-amber-400/50 hover:bg-amber-500/[0.03]">
          {thumbnailPreview ? (
            <div className="relative aspect-video">
              <img
                src={thumbnailPreview}
                alt="Course thumbnail preview"
                className="h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

              <div className="absolute bottom-5 left-5">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Check
                    size={17}
                    className="text-emerald-400"
                  />
                  Thumbnail selected
                </div>
              </div>

              <div className="absolute right-4 top-4 rounded-full border border-white/15 bg-black/50 p-2 backdrop-blur-md">
                <Upload size={16} />
              </div>
            </div>
          ) : (
            <div className="flex aspect-video flex-col items-center justify-center px-6 text-center">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10 text-amber-400 transition group-hover:scale-110">
                <ImagePlus size={28} />
              </div>

              <h3 className="text-lg font-bold">
                Upload Course Artwork
              </h3>

              <p className="mt-2 max-w-sm text-sm text-white/40">
                JPG, PNG or WEBP. Maximum file size 5MB.
              </p>
            </div>
          )}

          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/*"
            onChange={handleThumbnailChange}
            className="hidden"
          />
        </label>

        {errors.thumbnail && (
          <p className="mt-2 text-xs text-red-400">
            {errors.thumbnail}
          </p>
        )}

        {thumbnailPreview && (
          <button
            type="button"
            onClick={removeThumbnail}
            className="mt-4 flex items-center gap-2 text-xs font-semibold text-red-400 transition hover:text-red-300"
          >
            <X size={14} />
            Remove thumbnail
          </button>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   REVIEW
========================================================= */

function CourseReview({
  formData,
  thumbnailPreview,
  isFreeCourse,
  priceLabel,
}) {
  return (
    <div>
      <SectionHeading
        icon={<Crown size={20} />}
        title="Final Review"
        description="Review your course before creating it."
      />

      <div className="mt-8 overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/20">
        {thumbnailPreview && (
          <div className="aspect-[21/9] overflow-hidden">
            <img
              src={thumbnailPreview}
              alt="Course preview"
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <div className="space-y-6 p-6">
          <div>
            <div className="mb-3 flex flex-wrap gap-2">
              <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs text-amber-300">
                {formData.category || "Category"}
              </span>

              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60">
                {formData.courseLevel}
              </span>

              <span
                className={`rounded-full px-3 py-1 text-xs ${
                  isFreeCourse
                    ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                    : "border border-amber-500/20 bg-amber-500/10 text-amber-300"
                }`}
              >
                {priceLabel}
              </span>
            </div>

            <h2 className="text-2xl font-black sm:text-3xl">
              {formData.courseTitle ||
                "Untitled Course"}
            </h2>

            <p className="mt-2 text-sm text-amber-300/70">
              {formData.subTitle ||
                "Course subtitle"}
            </p>
          </div>

          <div className="border-t border-white/10 pt-5">
            <p className="text-sm leading-7 text-white/50">
              {formData.description ||
                "Your course description will appear here."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   PREVIEW
========================================================= */

function CoursePreview({
  formData,
  thumbnailPreview,
  isFreeCourse,
  priceLabel,
}) {
  return (
    <div className="premium-panel overflow-hidden rounded-[2rem]">
      <div className="border-b border-white/10 px-5 py-4">
        <div className="flex items-center gap-2">
          <Sparkles
            size={17}
            className="text-amber-400"
          />

          <span className="text-sm font-bold">
            Live Preview
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d0b09]">
          <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-amber-900/30 to-black">
            {thumbnailPreview ? (
              <img
                src={thumbnailPreview}
                alt="Course preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Crown
                  size={42}
                  className="text-amber-500/30"
                />
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

            <div className="absolute bottom-3 left-3 rounded-full border border-white/10 bg-black/50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white/70 backdrop-blur-md">
              {formData.courseLevel}
            </div>
          </div>

          <div className="p-5">
            <h3 className="line-clamp-2 text-lg font-black">
              {formData.courseTitle ||
                "Your Course Title"}
            </h3>

            <p className="mt-2 line-clamp-2 text-xs leading-5 text-white/40">
              {formData.subTitle ||
                "Your course subtitle will appear here."}
            </p>

            <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
              <span className="text-xs text-white/35">
                Course access
              </span>

              <span
                className={`font-black ${
                  isFreeCourse
                    ? "text-emerald-400"
                    : "text-amber-400"
                }`}
              >
                {priceLabel}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   SECTION HEADING
========================================================= */

function SectionHeading({
  icon,
  title,
  description,
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-400">
        {icon}
      </div>

      <div>
        <h2 className="text-xl font-black sm:text-2xl">
          {title}
        </h2>

        <p className="mt-1 text-sm text-white/40">
          {description}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   FIELD
========================================================= */

function Field({
  label,
  required,
  error,
  children,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-white/80">
        {label}

        {required && (
          <span className="ml-1 text-amber-400">
            *
          </span>
        )}
      </label>

      {children}

      {error && (
        <p className="mt-2 text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

/* =========================================================
   ACCESS CARD
========================================================= */

function AccessCard({
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
      className={`group rounded-2xl border p-5 text-left transition duration-300 ${
        active
          ? "border-amber-400/50 bg-amber-500/10 shadow-[0_0_30px_rgba(245,158,11,0.08)]"
          : "border-white/10 bg-white/[0.02] hover:border-amber-500/25 hover:bg-white/[0.04]"
      }`}
    >
      <div className="flex items-start justify-between">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
            active
              ? "bg-amber-500/15 text-amber-400"
              : "bg-white/5 text-white/40"
          }`}
        >
          {icon}
        </div>

        <div
          className={`h-5 w-5 rounded-full border ${
            active
              ? "border-amber-400 bg-amber-400"
              : "border-white/20"
          }`}
        >
          {active && (
            <Check
              size={13}
              className="m-[3px] text-black"
            />
          )}
        </div>
      </div>

      <h3 className="mt-4 font-bold">
        {title}
      </h3>

      <p className="mt-1 text-xs leading-5 text-white/40">
        {description}
      </p>
    </button>
  );
}

/* =========================================================
   STEP INDICATOR
========================================================= */

function StepIndicator({
  number,
  title,
  active,
  completed,
}) {
  return (
    <div
      className={`rounded-2xl border px-4 py-3 transition ${
        active
          ? "border-amber-400/30 bg-amber-500/10"
          : completed
            ? "border-emerald-500/20 bg-emerald-500/5"
            : "border-white/10 bg-white/[0.02]"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-black ${
            active
              ? "bg-amber-400 text-black"
              : completed
                ? "bg-emerald-400 text-black"
                : "bg-white/5 text-white/30"
          }`}
        >
          {completed ? (
            <Check size={15} />
          ) : (
            number
          )}
        </div>

        <span
          className={`hidden text-xs font-bold sm:block ${
            active
              ? "text-amber-300"
              : "text-white/40"
          }`}
        >
          {title}
        </span>
      </div>
    </div>
  );
}

/* =========================================================
   PREMIUM STYLES
========================================================= */

function PremiumStyles() {
  return (
    <style>{`
      .premium-panel {
        background:
          linear-gradient(
            145deg,
            rgba(255,255,255,0.045),
            rgba(255,255,255,0.015)
          );
        border: 1px solid rgba(255,255,255,0.08);
        box-shadow:
          0 25px 80px rgba(0,0,0,0.35),
          inset 0 1px 0 rgba(255,255,255,0.04);
        backdrop-filter: blur(20px);
      }

      .premium-heading {
        text-shadow:
          0 0 40px rgba(245,158,11,0.08);
      }

      .premium-input {
        width: 100%;
        border-radius: 14px;
        border: 1px solid rgba(255,255,255,0.09);
        background: rgba(0,0,0,0.25);
        padding: 14px 16px;
        color: white;
        outline: none;
        transition:
          border-color 180ms ease,
          background 180ms ease,
          box-shadow 180ms ease;
      }

      .premium-input::placeholder {
        color: rgba(255,255,255,0.25);
      }

      .premium-input:focus {
        border-color: rgba(245,158,11,0.5);
        background: rgba(245,158,11,0.025);
        box-shadow:
          0 0 0 3px rgba(245,158,11,0.06),
          0 0 30px rgba(245,158,11,0.05);
      }

      .premium-select {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-radius: 14px;
        border: 1px solid rgba(255,255,255,0.09);
        background: rgba(0,0,0,0.25);
        padding: 14px 16px;
        text-align: left;
        transition: all 180ms ease;
      }

      .premium-select:hover {
        border-color: rgba(245,158,11,0.3);
        background: rgba(245,158,11,0.025);
      }

      .premium-dropdown {
        position: absolute;
        z-index: 50;
        left: 0;
        right: 0;
        top: calc(100% + 8px);
        max-height: 260px;
        overflow-y: auto;
        border-radius: 14px;
        border: 1px solid rgba(255,255,255,0.1);
        background: #100e0b;
        padding: 6px;
        box-shadow: 0 25px 70px rgba(0,0,0,0.6);
      }

      .premium-option {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-radius: 10px;
        padding: 11px 12px;
        text-align: left;
        font-size: 13px;
        color: rgba(255,255,255,0.7);
        transition: all 150ms ease;
      }

      .premium-option:hover {
        background: rgba(245,158,11,0.08);
        color: white;
      }

      .premium-action {
        display: flex;
        align-items: center;
        gap: 8px;
        border-radius: 12px;
        border: 1px solid rgba(255,255,255,0.08);
        background: rgba(255,255,255,0.025);
        padding: 9px 13px;
        font-size: 12px;
        font-weight: 700;
        color: rgba(255,255,255,0.65);
        transition: all 180ms ease;
      }

      .premium-action:hover {
        border-color: rgba(245,158,11,0.3);
        background: rgba(245,158,11,0.08);
        color: #fbbf24;
      }

      .premium-primary-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 9px;
        border-radius: 13px;
        background: linear-gradient(
          135deg,
          #f59e0b,
          #d97706
        );
        padding: 13px 20px;
        font-size: 13px;
        font-weight: 900;
        color: #120b02;
        box-shadow:
          0 10px 30px rgba(245,158,11,0.15);
        transition:
          transform 180ms ease,
          box-shadow 180ms ease,
          filter 180ms ease;
      }

      .premium-primary-button:hover:not(:disabled) {
        transform: translateY(-2px);
        filter: brightness(1.08);
        box-shadow:
          0 15px 40px rgba(245,158,11,0.25);
      }

      .premium-primary-button:active:not(:disabled) {
        transform: translateY(0);
      }

      .premium-secondary-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 9px;
        border-radius: 13px;
        border: 1px solid rgba(255,255,255,0.1);
        background: rgba(255,255,255,0.025);
        padding: 13px 20px;
        font-size: 13px;
        font-weight: 800;
        color: rgba(255,255,255,0.65);
        transition: all 180ms ease;
      }

      .premium-secondary-button:hover:not(:disabled) {
        border-color: rgba(245,158,11,0.3);
        background: rgba(245,158,11,0.06);
        color: white;
      }

      @media (max-width: 640px) {
        .premium-panel {
          border-radius: 1.5rem;
        }
      }
    `}</style>
  );
}

export default CreateCourse;
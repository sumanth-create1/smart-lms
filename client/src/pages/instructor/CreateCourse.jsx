import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  Crown,
  FileText,
  ImagePlus,
  IndianRupee,
  Lightbulb,
  LoaderCircle,
  RefreshCw,
  Sparkles,
  Star,
  Target,
  Upload,
  WandSparkles,
  X,
  Zap,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";

const AI_COURSE_ENDPOINT = "/ai/course-suggestions";

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

const AI_ACTIONS = {
  title: "improve_title",
  subtitle: "generate_subtitle",
  description: "generate_description",
  category: "suggest_category",
  level: "suggest_level",
  price: "suggest_price",
  all: "generate_all",
  review: "review_course",
};

const getAIResult = (response) => {
  const data = response?.data;

  return data?.result || data?.suggestions || data?.data || data;
};

const getErrorMessage = (error) =>
  error?.response?.data?.message || error?.message || "Something went wrong.";

const formatPrice = (price) => {
  if (!price) return "Free";
  return `₹${Number(price).toLocaleString("en-IN")}`;
};

export default function CreateCourse() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialForm);
  const [isFreeCourse, setIsFreeCourse] = useState(false);

  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");

  const [loading, setLoading] = useState(false);

  const [aiLoading, setAiLoading] = useState(false);
  const [aiAction, setAiAction] = useState("");

  const [aiResult, setAiResult] = useState(null);
  const [showAiPanel, setShowAiPanel] = useState(false);

  const [currentStep, setCurrentStep] = useState(1);

  const [openMenu, setOpenMenu] = useState(null);

  const [errors, setErrors] = useState({});

  /* ----------------------------------------
     Thumbnail cleanup
  ---------------------------------------- */

  useEffect(() => {
    return () => {
      if (thumbnailPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(thumbnailPreview);
      }
    };
  }, [thumbnailPreview]);

  /* ----------------------------------------
     Close dropdown with Escape
  ---------------------------------------- */

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setOpenMenu(null);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  /* ----------------------------------------
     Form helpers
  ---------------------------------------- */

  const clearError = (field) => {
    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    clearError(name);
  };

  const selectCategory = (category) => {
    setFormData((prev) => ({
      ...prev,
      category,
    }));

    clearError("category");
    setOpenMenu(null);
  };

  const selectLevel = (level) => {
    setFormData((prev) => ({
      ...prev,
      courseLevel: level,
    }));

    clearError("courseLevel");
    setOpenMenu(null);
  };

  const handleFreeCourse = () => {
    setIsFreeCourse(true);

    setFormData((prev) => ({
      ...prev,
      coursePrice: "0",
    }));

    clearError("coursePrice");
  };

  const handlePaidCourse = () => {
    setIsFreeCourse(false);

    setFormData((prev) => ({
      ...prev,
      coursePrice: prev.coursePrice === "0" ? "499" : prev.coursePrice,
    }));
  };

  /* ----------------------------------------
     Thumbnail
  ---------------------------------------- */

  const handleThumbnailChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Thumbnail must be less than 5MB.");
      return;
    }

    setThumbnail(file);
    setThumbnailPreview(URL.createObjectURL(file));
    clearError("thumbnail");
  };

  const removeThumbnail = () => {
    setThumbnail(null);
    setThumbnailPreview("");
  };

  /* ----------------------------------------
     Validation
  ---------------------------------------- */

  const validateStepOne = () => {
    const newErrors = {};

    if (!formData.courseTitle.trim()) {
      newErrors.courseTitle = "Course title is required.";
    }

    if (!formData.subTitle.trim()) {
      newErrors.subTitle = "Subtitle is required.";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required.";
    }

    if (!formData.category) {
      newErrors.category = "Please select a category.";
    }

    if (!formData.courseLevel) {
      newErrors.courseLevel = "Please select a level.";
    }

    if (!isFreeCourse) {
      if (!formData.coursePrice) {
        newErrors.coursePrice = "Course price is required.";
      } else if (Number(formData.coursePrice) < 0) {
        newErrors.coursePrice = "Price cannot be negative.";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const validateStepTwo = () => {
    if (!thumbnail) {
      setErrors((prev) => ({
        ...prev,
        thumbnail: "Please upload a course thumbnail.",
      }));

      return false;
    }

    return true;
  };

  /* ----------------------------------------
     Navigation
  ---------------------------------------- */

  const handleNext = () => {
    if (currentStep === 1) {
      if (!validateStepOne()) return;

      setCurrentStep(2);
      return;
    }

    if (currentStep === 2) {
      if (!validateStepTwo()) return;

      setCurrentStep(3);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    } else {
      navigate(-1);
    }
  };

  /* ----------------------------------------
     AI
  ---------------------------------------- */

  const runCourseAI = async (action) => {
    if (aiLoading) return;

    setAiLoading(true);
    setAiAction(action);
    setAiResult(null);

    try {
      const response = await api.post(AI_COURSE_ENDPOINT, {
        action,
        courseTitle: formData.courseTitle,
        subTitle: formData.subTitle,
        description: formData.description,
        category: formData.category,
        courseLevel: formData.courseLevel,
        coursePrice: isFreeCourse ? 0 : formData.coursePrice,
      });

      const result = getAIResult(response);

      setAiResult(result);
      setShowAiPanel(true);

      toast.success("AI suggestion generated.");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setAiLoading(false);
      setAiAction("");
    }
  };

  const applyAIResult = () => {
    if (!aiResult) return;

    console.log("APPLYING AI RESULT:", aiResult);

    setFormData((prev) => ({
      ...prev,

      // Backend returns `title`
      courseTitle: aiResult.title ?? aiResult.courseTitle ?? prev.courseTitle,

      // Backend may return either `subtitle` or `subTitle`
      subTitle: aiResult.subtitle ?? aiResult.subTitle ?? prev.subTitle,

      description: aiResult.description ?? prev.description,

      category: aiResult.category ?? prev.category,

      courseLevel: aiResult.level ?? aiResult.courseLevel ?? prev.courseLevel,

      coursePrice:
        aiResult.price !== undefined
          ? String(aiResult.price)
          : aiResult.coursePrice !== undefined
            ? String(aiResult.coursePrice)
            : prev.coursePrice,
    }));

    // Handle free course returned by AI
    const aiPrice = aiResult.price ?? aiResult.coursePrice;

    if (aiPrice !== undefined && Number(aiPrice) === 0) {
      setIsFreeCourse(true);
    }

    setErrors({});
    setShowAiPanel(false);

    toast.success("AI suggestions applied successfully.");
  };

  const isFieldLoading = (field) => aiLoading && aiAction === AI_ACTIONS[field];

  const handleCreateCourse = async () => {
    if (!validateStepOne()) {
      setCurrentStep(1);
      return;
    }

    if (!validateStepTwo()) {
      setCurrentStep(2);
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/course/create", {
        courseTitle: formData.courseTitle,
        subTitle: formData.subTitle,
        description: formData.description,
        category: formData.category,
        courseLevel: formData.courseLevel,
        coursePrice: isFreeCourse ? 0 : Number(formData.coursePrice),
      });

      if (!response?.data?.success) {
        throw new Error(response?.data?.message || "Course creation failed.");
      }

      const course = response?.data?.course || response?.data?.createdCourse;

      const courseId = course?._id;

      if (!courseId) {
        throw new Error("Course ID was not returned.");
      }

      if (thumbnail) {
        const uploadToast = toast.loading("Uploading course thumbnail...");

        try {
          const thumbnailData = new FormData();

          thumbnailData.append("thumbnail", thumbnail);

          const thumbnailResponse = await api.put(
            `/course/thumbnail/${courseId}`,
            thumbnailData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            },
          );

          if (!thumbnailResponse?.data?.success) {
            throw new Error(
              thumbnailResponse?.data?.message || "Thumbnail upload failed.",
            );
          }

          toast.success("Thumbnail uploaded.", {
            id: uploadToast,
          });
        } catch (error) {
          toast.error(getErrorMessage(error), {
            id: uploadToast,
          });
        }
      }

      toast.success("Course created successfully.");

      navigate(`/instructor/courses/${courseId}`);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-course-page">
      <PremiumStyles />

      <div className="premium-grid" />
      <div className="ambient-glow ambient-glow-one" />
      <div className="ambient-glow ambient-glow-two" />

      {/* Header */}

      <header className="course-header">
        <div className="header-left">
          <button type="button" className="icon-button" onClick={handleBack}>
            <ArrowLeft size={18} />
          </button>

          <div>
            <div className="header-eyebrow">
              <Crown size={13} />
              INSTRUCTOR FORGE
            </div>

            <h1>Create Course</h1>
          </div>
        </div>

        <button
          type="button"
          className="ai-architect-button"
          onClick={() => runCourseAI(AI_ACTIONS.all)}
          disabled={aiLoading || loading}
        >
          {isFieldLoading("all") ? (
            <LoaderCircle size={16} className="ai-inline-loader" />
          ) : (
            <Sparkles size={16} />
          )}

          {isFieldLoading("all") ? "Generating..." : "AI Architect"}
        </button>
      </header>

      {/* Steps */}

      <div className="steps-wrapper">
        <StepIndicator
          number="01"
          title="Identity"
          active={currentStep === 1}
          completed={currentStep > 1}
        />

        <div className="step-line" />

        <StepIndicator
          number="02"
          title="Appearance"
          active={currentStep === 2}
          completed={currentStep > 2}
        />

        <div className="step-line" />

        <StepIndicator
          number="03"
          title="Review"
          active={currentStep === 3}
          completed={false}
        />
      </div>

      {/* Main */}

      <main className="course-layout">
        <section className="course-main-panel">
          {currentStep === 1 && (
            <CourseIdentity
              formData={formData}
              errors={errors}
              handleChange={handleChange}
              openMenu={openMenu}
              setOpenMenu={setOpenMenu}
              selectCategory={selectCategory}
              selectLevel={selectLevel}
              isFreeCourse={isFreeCourse}
              handleFreeCourse={handleFreeCourse}
              handlePaidCourse={handlePaidCourse}
              runCourseAI={runCourseAI}
              isFieldLoading={isFieldLoading}
            />
          )}

          {currentStep === 2 && (
            <CourseAppearance
              thumbnail={thumbnail}
              thumbnailPreview={thumbnailPreview}
              errors={errors}
              handleThumbnailChange={handleThumbnailChange}
              removeThumbnail={removeThumbnail}
            />
          )}

          {currentStep === 3 && (
            <CourseReview
              formData={formData}
              isFreeCourse={isFreeCourse}
              thumbnailPreview={thumbnailPreview}
              runCourseAI={runCourseAI}
              aiLoading={aiLoading}
            />
          )}

          <div className="navigation-bar">
            <button
              type="button"
              className="secondary-button"
              onClick={handleBack}
              disabled={loading}
            >
              <ArrowLeft size={17} />
              Back
            </button>

            {currentStep < 3 ? (
              <button
                type="button"
                className="primary-button"
                onClick={handleNext}
                disabled={loading}
              >
                Continue
                <ArrowRight size={17} />
              </button>
            ) : (
              <button
                type="button"
                className="primary-button create-button"
                onClick={handleCreateCourse}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <LoaderCircle size={17} className="ai-inline-loader" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Crown size={17} />
                    Create Course
                  </>
                )}
              </button>
            )}
          </div>
        </section>

        {/* Live Preview */}

        <aside className="preview-column">
          <CoursePreview
            formData={formData}
            isFreeCourse={isFreeCourse}
            thumbnailPreview={thumbnailPreview}
          />
        </aside>
      </main>

      {/* AI Result */}

      {showAiPanel && aiResult && (
        <AIPanel
          result={aiResult}
          action={aiAction}
          onApply={applyAIResult}
          onClose={() => setShowAiPanel(false)}
          onRetry={() => runCourseAI(aiAction)}
        />
      )}
    </div>
  );
}

/* =========================================================
   COURSE IDENTITY
========================================================= */

function CourseIdentity({
  formData,
  errors,
  handleChange,
  openMenu,
  setOpenMenu,
  selectCategory,
  selectLevel,
  isFreeCourse,
  handleFreeCourse,
  handlePaidCourse,
  runCourseAI,
  isFieldLoading,
}) {
  return (
    <div className="step-content">
      <SectionHeading
        icon={BookOpen}
        eyebrow="COURSE IDENTITY"
        title="Forge your course"
        description="Define the foundation of your learning experience."
      />

      {/* Title */}

      <Field
        label="Course Title"
        required
        error={errors.courseTitle}
        action={
          <AIFieldButton
            field="title"
            label="Improve"
            onClick={() => runCourseAI(AI_ACTIONS.title)}
            loading={isFieldLoading("title")}
          />
        }
      >
        <div className="field-wrapper">
          <input
            type="text"
            name="courseTitle"
            value={formData.courseTitle}
            onChange={handleChange}
            placeholder="e.g. Complete MERN Stack Development"
            className={`premium-input ${
              errors.courseTitle ? "input-error" : ""
            }`}
          />

          {isFieldLoading("title") && (
            <LoaderCircle size={18} className="field-inline-loader" />
          )}
        </div>

        <CharacterCount value={formData.courseTitle} max={100} />
      </Field>

      {/* Subtitle */}

      <Field
        label="Subtitle"
        required
        error={errors.subTitle}
        action={
          <AIFieldButton
            field="subtitle"
            label="Generate"
            onClick={() => runCourseAI(AI_ACTIONS.subtitle)}
            loading={isFieldLoading("subtitle")}
          />
        }
      >
        <div className="field-wrapper">
          <input
            type="text"
            name="subTitle"
            value={formData.subTitle}
            onChange={handleChange}
            placeholder="What will students learn?"
            className={`premium-input ${errors.subTitle ? "input-error" : ""}`}
          />

          {isFieldLoading("subtitle") && (
            <LoaderCircle size={18} className="field-inline-loader" />
          )}
        </div>

        <CharacterCount value={formData.subTitle} max={160} />
      </Field>

      {/* Description */}

      <Field
        label="Description"
        required
        error={errors.description}
        action={
          <AIFieldButton
            field="description"
            label="Generate"
            onClick={() => runCourseAI(AI_ACTIONS.description)}
            loading={isFieldLoading("description")}
          />
        }
      >
        <div className="field-wrapper">
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe what students will learn..."
            className={`premium-textarea ${
              errors.description ? "input-error" : ""
            }`}
          />

          {isFieldLoading("description") && (
            <LoaderCircle
              size={18}
              className="field-inline-loader textarea-loader"
            />
          )}
        </div>

        <CharacterCount value={formData.description} max={2000} />
      </Field>

      {/* Category / Level */}

      <div className="two-column-grid">
        <Field
          label="Category"
          required
          error={errors.category}
          action={
            <AIFieldButton
              field="category"
              label="Suggest"
              onClick={() => runCourseAI(AI_ACTIONS.category)}
              loading={isFieldLoading("category")}
            />
          }
        >
          <div className="dropdown-wrapper">
            <button
              type="button"
              className={`premium-select ${
                errors.category ? "input-error" : ""
              }`}
              onClick={() =>
                setOpenMenu(openMenu === "category" ? null : "category")
              }
            >
              <span>{formData.category || "Select category"}</span>

              <ChevronDown size={17} />
            </button>

            {openMenu === "category" && (
              <div className="dropdown-menu">
                {categories.map((category) => (
                  <button
                    type="button"
                    key={category}
                    onClick={() => selectCategory(category)}
                    className={
                      formData.category === category
                        ? "dropdown-item active"
                        : "dropdown-item"
                    }
                  >
                    {category}

                    {formData.category === category && <Check size={15} />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </Field>

        <Field
          label="Course Level"
          required
          error={errors.courseLevel}
          action={
            <AIFieldButton
              field="level"
              label="Suggest"
              onClick={() => runCourseAI(AI_ACTIONS.level)}
              loading={isFieldLoading("level")}
            />
          }
        >
          <div className="dropdown-wrapper">
            <button
              type="button"
              className={`premium-select ${
                errors.courseLevel ? "input-error" : ""
              }`}
              onClick={() => setOpenMenu(openMenu === "level" ? null : "level")}
            >
              <span>{formData.courseLevel}</span>

              <ChevronDown size={17} />
            </button>

            {openMenu === "level" && (
              <div className="dropdown-menu">
                {levels.map((level) => (
                  <button
                    type="button"
                    key={level}
                    onClick={() => selectLevel(level)}
                    className={
                      formData.courseLevel === level
                        ? "dropdown-item active"
                        : "dropdown-item"
                    }
                  >
                    {level}

                    {formData.courseLevel === level && <Check size={15} />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </Field>
      </div>

      {/* Pricing */}

      <Field
        label="Course Access"
        error={errors.coursePrice}
        action={
          !isFreeCourse && (
            <AIFieldButton
              field="price"
              label="Suggest Price"
              onClick={() => runCourseAI(AI_ACTIONS.price)}
              loading={isFieldLoading("price")}
            />
          )
        }
      >
        <div className="access-grid">
          <AccessCard
            active={isFreeCourse}
            icon={Zap}
            title="Free"
            description="Open learning"
            onClick={handleFreeCourse}
          />

          <AccessCard
            active={!isFreeCourse}
            icon={Crown}
            title="Premium"
            description="Paid access"
            onClick={handlePaidCourse}
          />
        </div>

        {!isFreeCourse && (
          <div className="price-input-wrapper">
            <IndianRupee size={17} />

            <input
              type="number"
              name="coursePrice"
              value={formData.coursePrice}
              onChange={handleChange}
              placeholder="499"
              min="0"
              className={`premium-input price-input ${
                errors.coursePrice ? "input-error" : ""
              }`}
            />

            {isFieldLoading("price") && (
              <LoaderCircle size={18} className="field-inline-loader" />
            )}
          </div>
        )}
      </Field>
    </div>
  );
}

/* =========================================================
   COURSE APPEARANCE
========================================================= */

function CourseAppearance({
  thumbnail,
  thumbnailPreview,
  errors,
  handleThumbnailChange,
  removeThumbnail,
}) {
  return (
    <div className="step-content">
      <SectionHeading
        icon={ImagePlus}
        eyebrow="COURSE APPEARANCE"
        title="Give it a visual identity"
        description="Upload a premium thumbnail that represents your course."
      />

      <div
        className={`thumbnail-upload ${errors.thumbnail ? "upload-error" : ""}`}
      >
        {thumbnailPreview ? (
          <div className="thumbnail-preview-wrapper">
            <img
              src={thumbnailPreview}
              alt="Course thumbnail"
              className="thumbnail-preview"
            />

            <div className="thumbnail-overlay">
              <div>
                <CheckCircle2 size={22} />
                <span>Thumbnail ready</span>
              </div>

              <button
                type="button"
                className="remove-thumbnail"
                onClick={removeThumbnail}
              >
                <X size={16} />
                Remove
              </button>
            </div>
          </div>
        ) : (
          <label className="upload-content">
            <input
              type="file"
              accept="image/*"
              onChange={handleThumbnailChange}
              hidden
            />

            <div className="upload-icon">
              <Upload size={24} />
            </div>

            <h3>Upload Course Thumbnail</h3>

            <p>Drag your visual identity here or click to browse.</p>

            <span>PNG, JPG, WEBP • Maximum 5MB</span>
          </label>
        )}
      </div>

      {errors.thumbnail && (
        <div className="error-message">{errors.thumbnail}</div>
      )}

      <div className="appearance-tips">
        <div className="tip-icon">
          <Lightbulb size={17} />
        </div>

        <div>
          <strong>Premium presentation</strong>

          <p>
            Use a clean, high-contrast image that clearly communicates what
            students will learn.
          </p>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   COURSE REVIEW
========================================================= */

function CourseReview({
  formData,
  isFreeCourse,
  thumbnailPreview,
  runCourseAI,
  aiLoading,
}) {
  return (
    <div className="step-content">
      <SectionHeading
        icon={FileText}
        eyebrow="FINAL REVIEW"
        title="Review your course"
        description="Make sure everything is ready before publishing."
      />

      <div className="review-card">
        {thumbnailPreview && (
          <img
            src={thumbnailPreview}
            alt="Course thumbnail"
            className="review-thumbnail"
          />
        )}

        <div className="review-content">
          <div className="review-badge">{formData.courseLevel}</div>

          <h2>{formData.courseTitle || "Untitled Course"}</h2>

          <p>{formData.subTitle || "No subtitle provided."}</p>

          <div className="review-meta">
            <span>
              <Target size={14} />
              {formData.category || "No category"}
            </span>

            <span>
              {isFreeCourse ? "Free" : formatPrice(formData.coursePrice)}
            </span>
          </div>
        </div>
      </div>

      <div className="review-description">
        <div className="review-description-header">
          <h3>Description</h3>

          <button
            type="button"
            className="ai-field-button"
            disabled={aiLoading}
            onClick={() => runCourseAI(AI_ACTIONS.review)}
          >
            {aiLoading ? (
              <LoaderCircle size={14} className="ai-inline-loader" />
            ) : (
              <Sparkles size={14} />
            )}
            AI Review
          </button>
        </div>

        <p>{formData.description || "No description provided."}</p>
      </div>
    </div>
  );
}

/* =========================================================
   COURSE PREVIEW
========================================================= */

function CoursePreview({ formData, isFreeCourse, thumbnailPreview }) {
  return (
    <div className="preview-card">
      <div className="preview-header">
        <span>LIVE PREVIEW</span>

        <span className="live-indicator">
          <span />
          LIVE
        </span>
      </div>

      <div className="preview-image-wrapper">
        {thumbnailPreview ? (
          <img
            src={thumbnailPreview}
            alt="Course preview"
            className="preview-image"
          />
        ) : (
          <div className="preview-placeholder">
            <BookOpen size={32} />
            <span>Your thumbnail</span>
          </div>
        )}

        <div className="preview-level">{formData.courseLevel}</div>
      </div>

      <div className="preview-body">
        <span className="preview-category">
          {formData.category || "Category"}
        </span>

        <h3>{formData.courseTitle || "Your course title will appear here"}</h3>

        <p>{formData.subTitle || "Your course subtitle will appear here"}</p>

        <div className="preview-divider" />

        <div className="preview-footer">
          <PreviewStat icon={Star} label="Premium" />

          <strong>
            {isFreeCourse ? "Free" : formatPrice(formData.coursePrice)}
          </strong>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   AI PANEL
========================================================= */

function AIPanel({ result, onApply, onClose, onRetry }) {
  return (
    <div className="ai-result-panel">
      <div className="ai-result-header">
        <div className="ai-result-title">
          <div className="ai-result-icon">
            <Sparkles size={18} />
          </div>

          <div>
            <span>AI ARCHITECT</span>
            <h3>Suggestion Ready</h3>
          </div>
        </div>

        <button type="button" className="icon-button" onClick={onClose}>
          <X size={17} />
        </button>
      </div>

      <div className="ai-result-content">
        <AIResult result={result} />
      </div>

      <div className="ai-result-actions">
        <button type="button" className="secondary-button" onClick={onRetry}>
          <RefreshCw size={15} />
          Retry
        </button>

        <button type="button" className="primary-button" onClick={onApply}>
          <Check size={16} />
          Apply Suggestions
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   AI RESULT
========================================================= */

function AIResult({ result }) {
  if (typeof result === "string") {
    return <p className="ai-result-text">{result}</p>;
  }

  if (!result || typeof result !== "object") {
    return <p className="ai-result-text">No AI result available.</p>;
  }

  return (
    <div className="ai-result-list">
      {result.courseTitle && (
        <AIResultRow label="Course Title" value={result.courseTitle} />
      )}

      {result.subTitle && (
        <AIResultRow label="Subtitle" value={result.subTitle} />
      )}

      {result.description && (
        <AIResultRow label="Description" value={result.description} />
      )}

      {result.category && (
        <AIResultRow label="Category" value={result.category} />
      )}

      {result.courseLevel && (
        <AIResultRow label="Level" value={result.courseLevel} />
      )}

      {result.coursePrice !== undefined && (
        <AIResultRow
          label="Suggested Price"
          value={
            Number(result.coursePrice) === 0
              ? "Free"
              : `₹${Number(result.coursePrice).toLocaleString("en-IN")}`
          }
        />
      )}

      {result.review && <AIBlock title="AI Review" value={result.review} />}

      {result.strengths && (
        <AIList title="Strengths" items={result.strengths} />
      )}

      {result.improvements && (
        <AIList title="Improvements" items={result.improvements} />
      )}
    </div>
  );
}

function AIResultRow({ label, value }) {
  return (
    <div className="ai-result-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function AIBlock({ title, value }) {
  return (
    <div className="ai-block">
      <span>{title}</span>
      <p>{value}</p>
    </div>
  );
}

function AIList({ title, items }) {
  if (!Array.isArray(items)) return null;

  return (
    <div className="ai-block">
      <span>{title}</span>

      <ul>
        {items.map((item, index) => (
          <li key={`${title}-${index}`}>
            <Check size={14} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* =========================================================
   AI FIELD BUTTON
========================================================= */

function AIFieldButton({ field, label, onClick, loading }) {
  return (
    <button
      type="button"
      className="ai-field-button"
      onClick={onClick}
      disabled={loading}
    >
      {loading ? (
        <LoaderCircle size={14} className="ai-inline-loader" />
      ) : (
        <WandSparkles size={14} />
      )}

      {loading ? "Generating..." : label}
    </button>
  );
}

/* =========================================================
   CHARACTER COUNT
========================================================= */

function CharacterCount({ value, max }) {
  return (
    <div className="character-count">
      {value.length}/{max}
    </div>
  );
}

/* =========================================================
   SECTION HEADING
========================================================= */

function SectionHeading({ icon: Icon, eyebrow, title, description }) {
  return (
    <div className="section-heading">
      <div className="section-heading-icon">
        <Icon size={21} />
      </div>

      <div>
        <span>{eyebrow}</span>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </div>
  );
}

/* =========================================================
   FIELD
========================================================= */

function Field({ label, required, error, action, children }) {
  return (
    <div className="form-field">
      <div className="field-label-row">
        <label>
          {label}

          {required && <span className="required-mark">*</span>}
        </label>

        {action}
      </div>

      {children}

      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

/* =========================================================
   ACCESS CARD
========================================================= */

function AccessCard({ active, icon: Icon, title, description, onClick }) {
  return (
    <button
      type="button"
      className={`access-card ${active ? "active" : ""}`}
      onClick={onClick}
    >
      <div className="access-icon">
        <Icon size={18} />
      </div>

      <div>
        <strong>{title}</strong>
        <span>{description}</span>
      </div>

      {active && <CheckCircle2 size={18} className="access-check" />}
    </button>
  );
}

/* =========================================================
   STEP INDICATOR
========================================================= */

function StepIndicator({ number, title, active, completed }) {
  return (
    <div
      className={`step-indicator ${
        active ? "active" : ""
      } ${completed ? "completed" : ""}`}
    >
      <div className="step-number">
        {completed ? <Check size={15} /> : number}
      </div>

      <span>{title}</span>
    </div>
  );
}

/* =========================================================
   PREVIEW STAT
========================================================= */

function PreviewStat({ icon: Icon, label }) {
  return (
    <span className="preview-stat">
      <Icon size={14} />
      {label}
    </span>
  );
}

/* =========================================================
   PREMIUM STYLES
========================================================= */

function PremiumStyles() {
  return (
    <style>{`
      * {
        box-sizing: border-box;
      }

      .create-course-page {
        min-height: 100vh;
        background:
          radial-gradient(
            circle at 15% 10%,
            rgba(245, 158, 11, 0.08),
            transparent 28%
          ),
          radial-gradient(
            circle at 85% 80%,
            rgba(245, 158, 11, 0.06),
            transparent 30%
          ),
          #090909;
        color: #f5f5f5;
        padding: 28px;
        position: relative;
        overflow-x: hidden;
      }

      .premium-grid {
        position: fixed;
        inset: 0;
        pointer-events: none;
        opacity: 0.035;
        background-image:
          linear-gradient(
            rgba(255,255,255,0.5) 1px,
            transparent 1px
          ),
          linear-gradient(
            90deg,
            rgba(255,255,255,0.5) 1px,
            transparent 1px
          );
        background-size: 50px 50px;
      }

      .ambient-glow {
        position: fixed;
        width: 400px;
        height: 400px;
        border-radius: 50%;
        filter: blur(120px);
        pointer-events: none;
        opacity: 0.07;
      }

      .ambient-glow-one {
        background: #f59e0b;
        top: -200px;
        right: -100px;
      }

      .ambient-glow-two {
        background: #ea580c;
        bottom: -200px;
        left: -100px;
      }

      .course-header {
        max-width: 1450px;
        margin: 0 auto 30px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;
        z-index: 5;
      }

      .header-left {
        display: flex;
        align-items: center;
        gap: 14px;
      }

      .header-eyebrow,
      .section-heading > div > span {
        display: flex;
        align-items: center;
        gap: 7px;
        color: #f59e0b;
        font-size: 10px;
        font-weight: 800;
        letter-spacing: 0.16em;
      }

      .course-header h1 {
        margin: 4px 0 0;
        font-size: 28px;
        letter-spacing: -0.03em;
      }

      .icon-button {
        width: 42px;
        height: 42px;
        display: grid;
        place-items: center;
        border: 1px solid rgba(255,255,255,0.08);
        background: rgba(255,255,255,0.035);
        color: #ddd;
        border-radius: 12px;
        cursor: pointer;
        transition: 0.2s ease;
      }

      .icon-button:hover {
        border-color: rgba(245,158,11,0.4);
        color: #f59e0b;
        background: rgba(245,158,11,0.07);
      }

      .ai-architect-button,
      .primary-button {
        border: 0;
        color: #111;
        background: linear-gradient(
          135deg,
          #fbbf24,
          #f59e0b
        );
        font-weight: 800;
        border-radius: 12px;
        padding: 12px 17px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        cursor: pointer;
        transition: 0.2s ease;
      }

      .ai-architect-button:hover,
      .primary-button:hover {
        transform: translateY(-1px);
        filter: brightness(1.08);
      }

      .ai-architect-button:disabled,
      .primary-button:disabled,
      .secondary-button:disabled,
      .ai-field-button:disabled {
        opacity: 0.55;
        cursor: not-allowed;
        transform: none;
      }

      .steps-wrapper {
        max-width: 900px;
        margin: 0 auto 35px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        z-index: 3;
      }

      .step-indicator {
        display: flex;
        align-items: center;
        gap: 9px;
        color: #666;
        font-size: 12px;
        font-weight: 700;
        white-space: nowrap;
      }

      .step-indicator.active,
      .step-indicator.completed {
        color: #f59e0b;
      }

      .step-number {
        width: 30px;
        height: 30px;
        display: grid;
        place-items: center;
        border-radius: 50%;
        border: 1px solid rgba(255,255,255,0.12);
        font-size: 10px;
      }

      .step-indicator.active .step-number,
      .step-indicator.completed .step-number {
        border-color: #f59e0b;
        background: rgba(245,158,11,0.1);
      }

      .step-line {
        width: 70px;
        height: 1px;
        margin: 0 15px;
        background: rgba(255,255,255,0.08);
      }

      .course-layout {
        max-width: 1450px;
        margin: auto;
        display: grid;
        grid-template-columns: minmax(0, 1fr) 360px;
        gap: 24px;
        position: relative;
        z-index: 2;
      }

      .course-main-panel,
      .preview-card {
        border: 1px solid rgba(255,255,255,0.07);
        background: rgba(16,16,16,0.86);
        border-radius: 20px;
        backdrop-filter: blur(14px);
      }

      .course-main-panel {
        padding: 30px;
      }

      .preview-column {
        position: relative;
      }

      .preview-card {
        position: sticky;
        top: 25px;
        overflow: hidden;
      }

      .section-heading {
        display: flex;
        gap: 14px;
        margin-bottom: 34px;
      }

      .section-heading-icon {
        width: 44px;
        height: 44px;
        flex-shrink: 0;
        display: grid;
        place-items: center;
        color: #f59e0b;
        border: 1px solid rgba(245,158,11,0.2);
        background: rgba(245,158,11,0.06);
        border-radius: 13px;
      }

      .section-heading h2 {
        margin: 4px 0 5px;
        font-size: 23px;
      }

      .section-heading p {
        margin: 0;
        color: #777;
        font-size: 13px;
      }

      .form-field {
        margin-bottom: 25px;
      }

      .field-label-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        margin-bottom: 9px;
      }

      .field-label-row label {
        color: #ddd;
        font-size: 13px;
        font-weight: 700;
      }

      .required-mark {
        color: #f59e0b;
        margin-left: 3px;
      }

      .field-wrapper {
        position: relative;
        width: 100%;
      }

      .premium-input,
      .premium-textarea,
      .premium-select {
        width: 100%;
        border: 1px solid rgba(255,255,255,0.08);
        background: rgba(255,255,255,0.035);
        color: #f4f4f4;
        border-radius: 11px;
        outline: none;
        transition: border-color 0.2s ease,
                    background 0.2s ease;
      }

      .premium-input {
        height: 48px;
        padding: 0 44px 0 14px;
      }

      .premium-textarea {
        min-height: 145px;
        padding: 14px 44px 14px 14px;
        resize: vertical;
        line-height: 1.6;
      }

      .premium-input:focus,
      .premium-textarea:focus,
      .premium-select:focus {
        border-color: rgba(245,158,11,0.55);
        background: rgba(245,158,11,0.035);
      }

      .premium-input::placeholder,
      .premium-textarea::placeholder {
        color: #555;
      }

      .input-error {
        border-color: rgba(239,68,68,0.6) !important;
      }

      .field-inline-loader {
        position: absolute;
        right: 15px;
        top: 50%;
        transform: translateY(-50%);
        color: #f59e0b;
        animation: field-spin 0.8s linear infinite;
        pointer-events: none;
      }

      .textarea-loader {
        top: 18px;
        transform: none;
      }

      @keyframes field-spin {
        to {
          transform: translateY(-50%) rotate(360deg);
        }
      }

      .textarea-loader {
        animation: textarea-spin 0.8s linear infinite;
      }

      @keyframes textarea-spin {
        to {
          transform: rotate(360deg);
        }
      }

      .ai-field-button {
        border: 1px solid rgba(245,158,11,0.2);
        background: rgba(245,158,11,0.05);
        color: #fbbf24;
        border-radius: 8px;
        padding: 6px 9px;
        font-size: 10px;
        font-weight: 800;
        display: inline-flex;
        align-items: center;
        gap: 5px;
        cursor: pointer;
        transition: 0.2s ease;
      }

      .ai-field-button:hover {
        border-color: rgba(245,158,11,0.45);
        background: rgba(245,158,11,0.1);
      }

      .character-count {
        margin-top: 5px;
        text-align: right;
        color: #555;
        font-size: 10px;
      }

      .error-message {
        margin-top: 6px;
        color: #f87171;
        font-size: 11px;
      }

      .two-column-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 18px;
      }

      .dropdown-wrapper {
        position: relative;
      }

      .premium-select {
        height: 48px;
        padding: 0 14px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
        text-align: left;
      }

      .dropdown-menu {
        position: absolute;
        left: 0;
        right: 0;
        top: calc(100% + 6px);
        z-index: 20;
        padding: 6px;
        border: 1px solid rgba(255,255,255,0.1);
        background: #151515;
        border-radius: 12px;
        box-shadow: 0 20px 50px rgba(0,0,0,0.5);
      }

      .dropdown-item {
        width: 100%;
        border: 0;
        background: transparent;
        color: #aaa;
        padding: 10px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
        font-size: 12px;
        text-align: left;
      }

      .dropdown-item:hover,
      .dropdown-item.active {
        color: #fbbf24;
        background: rgba(245,158,11,0.08);
      }

      .access-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
      }

      .access-card {
        position: relative;
        display: flex;
        align-items: center;
        gap: 11px;
        text-align: left;
        padding: 15px;
        border-radius: 12px;
        border: 1px solid rgba(255,255,255,0.08);
        background: rgba(255,255,255,0.025);
        color: #aaa;
        cursor: pointer;
      }

      .access-card.active {
        border-color: rgba(245,158,11,0.45);
        background: rgba(245,158,11,0.07);
        color: #f5f5f5;
      }

      .access-icon {
        width: 34px;
        height: 34px;
        display: grid;
        place-items: center;
        border-radius: 9px;
        background: rgba(245,158,11,0.1);
        color: #f59e0b;
      }

      .access-card strong,
      .access-card span {
        display: block;
      }

      .access-card strong {
        font-size: 12px;
      }

      .access-card span {
        margin-top: 3px;
        color: #666;
        font-size: 10px;
      }

      .access-check {
        margin-left: auto;
        color: #f59e0b;
      }

      .price-input-wrapper {
        position: relative;
        margin-top: 12px;
        display: flex;
        align-items: center;
      }

      .price-input-wrapper > svg:first-child {
        position: absolute;
        left: 14px;
        color: #777;
        z-index: 1;
      }

      .price-input {
        padding-left: 38px;
      }

      .thumbnail-upload {
        min-height: 320px;
        border: 1px dashed rgba(255,255,255,0.13);
        border-radius: 18px;
        overflow: hidden;
        background: rgba(255,255,255,0.02);
      }

      .thumbnail-upload.upload-error {
        border-color: rgba(239,68,68,0.5);
      }

      .upload-content {
        min-height: 320px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        text-align: center;
        padding: 30px;
      }

      .upload-icon {
        width: 58px;
        height: 58px;
        display: grid;
        place-items: center;
        border-radius: 16px;
        background: rgba(245,158,11,0.08);
        color: #f59e0b;
        margin-bottom: 15px;
      }

      .upload-content h3 {
        margin: 0;
        font-size: 17px;
      }

      .upload-content p {
        margin: 7px 0;
        color: #777;
        font-size: 12px;
      }

      .upload-content span {
        color: #555;
        font-size: 10px;
      }

      .thumbnail-preview-wrapper {
        height: 320px;
        position: relative;
      }

      .thumbnail-preview {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .thumbnail-overlay {
        position: absolute;
        inset: auto 0 0;
        padding: 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: linear-gradient(
          transparent,
          rgba(0,0,0,0.85)
        );
      }

      .thumbnail-overlay > div {
        display: flex;
        align-items: center;
        gap: 7px;
        color: #fff;
        font-size: 12px;
      }

      .thumbnail-overlay svg {
        color: #f59e0b;
      }

      .remove-thumbnail {
        border: 1px solid rgba(255,255,255,0.15);
        background: rgba(0,0,0,0.45);
        color: #fff;
        padding: 7px 10px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 5px;
        cursor: pointer;
      }

      .appearance-tips {
        margin-top: 18px;
        display: flex;
        gap: 12px;
        padding: 15px;
        border: 1px solid rgba(245,158,11,0.1);
        background: rgba(245,158,11,0.035);
        border-radius: 12px;
      }

      .tip-icon {
        color: #f59e0b;
      }

      .appearance-tips strong {
        font-size: 12px;
      }

      .appearance-tips p {
        margin: 4px 0 0;
        color: #777;
        font-size: 11px;
        line-height: 1.5;
      }

      .review-card {
        display: grid;
        grid-template-columns: 180px 1fr;
        gap: 20px;
        padding: 18px;
        border: 1px solid rgba(255,255,255,0.08);
        background: rgba(255,255,255,0.025);
        border-radius: 16px;
      }

      .review-thumbnail {
        width: 180px;
        height: 120px;
        object-fit: cover;
        border-radius: 10px;
      }

      .review-badge,
      .preview-level {
        display: inline-flex;
        color: #fbbf24;
        background: rgba(245,158,11,0.1);
        border: 1px solid rgba(245,158,11,0.15);
        border-radius: 6px;
        padding: 4px 7px;
        font-size: 9px;
        font-weight: 800;
        text-transform: uppercase;
      }

      .review-content h2 {
        margin: 9px 0 5px;
        font-size: 19px;
      }

      .review-content p {
        margin: 0;
        color: #777;
        font-size: 12px;
        line-height: 1.5;
      }

      .review-meta {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 14px;
        color: #999;
        font-size: 11px;
      }

      .review-meta span:first-child {
        display: flex;
        align-items: center;
        gap: 5px;
      }

      .review-meta svg {
        color: #f59e0b;
      }

      .review-description {
        margin-top: 18px;
        padding: 18px;
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 15px;
      }

      .review-description-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
      }

      .review-description-header h3 {
        margin: 0;
        font-size: 13px;
      }

      .review-description p {
        margin: 0;
        color: #777;
        font-size: 12px;
        line-height: 1.7;
      }

      .navigation-bar {
        margin-top: 35px;
        padding-top: 20px;
        border-top: 1px solid rgba(255,255,255,0.06);
        display: flex;
        justify-content: space-between;
        gap: 12px;
      }

      .secondary-button {
        border: 1px solid rgba(255,255,255,0.09);
        background: rgba(255,255,255,0.035);
        color: #aaa;
        padding: 11px 15px;
        border-radius: 11px;
        display: inline-flex;
        align-items: center;
        gap: 7px;
        cursor: pointer;
        font-weight: 700;
      }

      .secondary-button:hover {
        color: #fff;
        border-color: rgba(255,255,255,0.16);
      }

      .preview-header {
        padding: 15px 17px;
        border-bottom: 1px solid rgba(255,255,255,0.06);
        display: flex;
        justify-content: space-between;
        color: #666;
        font-size: 9px;
        font-weight: 800;
        letter-spacing: 0.12em;
      }

      .live-indicator {
        display: flex;
        align-items: center;
        gap: 5px;
        color: #888;
      }

      .live-indicator span {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #22c55e;
      }

      .preview-image-wrapper {
        height: 190px;
        position: relative;
        overflow: hidden;
      }

      .preview-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .preview-placeholder {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 8px;
        color: #444;
        background:
          linear-gradient(
            135deg,
            rgba(245,158,11,0.05),
            transparent
          );
      }

      .preview-level {
        position: absolute;
        left: 12px;
        bottom: 12px;
      }

      .preview-body {
        padding: 19px;
      }

      .preview-category {
        color: #f59e0b;
        font-size: 9px;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.1em;
      }

      .preview-body h3 {
        margin: 8px 0 6px;
        font-size: 18px;
        line-height: 1.25;
      }

      .preview-body p {
        margin: 0;
        color: #777;
        font-size: 11px;
        line-height: 1.5;
      }

      .preview-divider {
        height: 1px;
        background: rgba(255,255,255,0.06);
        margin: 18px 0;
      }

      .preview-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .preview-footer strong {
        color: #fbbf24;
        font-size: 16px;
      }

      .preview-stat {
        display: flex;
        align-items: center;
        gap: 5px;
        color: #777;
        font-size: 10px;
      }

      .preview-stat svg {
        color: #f59e0b;
      }

      .ai-result-panel {
        position: fixed;
        right: 25px;
        bottom: 25px;
        width: min(480px, calc(100vw - 40px));
        max-height: 75vh;
        overflow-y: auto;
        z-index: 100;
        border: 1px solid rgba(245,158,11,0.2);
        background: #121212;
        border-radius: 18px;
        box-shadow: 0 25px 80px rgba(0,0,0,0.65);
      }

      .ai-result-header {
        padding: 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid rgba(255,255,255,0.07);
      }

      .ai-result-title {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .ai-result-icon {
        width: 36px;
        height: 36px;
        display: grid;
        place-items: center;
        border-radius: 10px;
        background: rgba(245,158,11,0.1);
        color: #f59e0b;
      }

      .ai-result-title span {
        color: #f59e0b;
        font-size: 8px;
        font-weight: 800;
        letter-spacing: 0.12em;
      }

      .ai-result-title h3 {
        margin: 3px 0 0;
        font-size: 14px;
      }

      .ai-result-content {
        padding: 16px;
      }

      .ai-result-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .ai-result-row {
        padding: 11px;
        border: 1px solid rgba(255,255,255,0.06);
        border-radius: 9px;
        background: rgba(255,255,255,0.025);
      }

      .ai-result-row span,
      .ai-block > span {
        display: block;
        margin-bottom: 5px;
        color: #f59e0b;
        font-size: 9px;
        font-weight: 800;
        text-transform: uppercase;
      }

      .ai-result-row strong {
        color: #ddd;
        font-size: 11px;
        line-height: 1.5;
      }

      .ai-result-text,
      .ai-block p {
        margin: 0;
        color: #aaa;
        font-size: 11px;
        line-height: 1.6;
      }

      .ai-block {
        padding: 12px;
        border: 1px solid rgba(255,255,255,0.06);
        border-radius: 10px;
        background: rgba(255,255,255,0.025);
      }

      .ai-block ul {
        margin: 0;
        padding: 0;
        list-style: none;
        display: flex;
        flex-direction: column;
        gap: 7px;
      }

      .ai-block li {
        display: flex;
        align-items: flex-start;
        gap: 6px;
        color: #aaa;
        font-size: 11px;
      }

      .ai-block li svg {
        flex-shrink: 0;
        color: #f59e0b;
        margin-top: 2px;
      }

      .ai-result-actions {
        padding: 14px 16px;
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        border-top: 1px solid rgba(255,255,255,0.07);
      }

      @media (max-width: 1050px) {
        .course-layout {
          grid-template-columns: 1fr;
        }

        .preview-column {
          display: none;
        }
      }

      @media (max-width: 700px) {
        .create-course-page {
          padding: 16px;
        }

        .course-header {
          align-items: flex-start;
        }

        .course-header h1 {
          font-size: 22px;
        }

        .ai-architect-button {
          padding: 10px;
        }

        .ai-architect-button:not(:disabled) {
          font-size: 0;
        }

        .ai-architect-button svg {
          margin: 0;
        }

        .course-main-panel {
          padding: 20px;
        }

        .two-column-grid,
        .access-grid {
          grid-template-columns: 1fr;
        }

        .steps-wrapper {
          justify-content: flex-start;
          overflow-x: auto;
        }

        .step-line {
          width: 30px;
          margin: 0 8px;
        }

        .review-card {
          grid-template-columns: 1fr;
        }

        .review-thumbnail {
          width: 100%;
          height: 180px;
        }

        .navigation-bar {
          flex-direction: column-reverse;
        }

        .navigation-bar button {
          width: 100%;
        }

        .ai-result-panel {
          right: 15px;
          bottom: 15px;
          width: calc(100vw - 30px);
        }
      }

      @media (prefers-reduced-motion: reduce) {
        *,
        *::before,
        *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      }
    `}</style>
  );
}

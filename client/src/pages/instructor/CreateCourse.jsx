import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  Castle,
  Check,
  CheckCircle2,
  ChevronDown,
  Crown,
  Gem,
  ImagePlus,
  Info,
  LoaderCircle,
  ScrollText,
  Shield,
  Sparkles,
  Swords,
  Upload,
  X,
} from "lucide-react";

import api from "../../services/api";
import toast from "react-hot-toast";

// ============================================================
// CREATE COURSE
// ============================================================

function CreateCourse() {
  const navigate = useNavigate();

  // ==========================================================
  // FORM
  // ==========================================================

  const [formData, setFormData] = useState({
    courseTitle: "",
    subTitle: "",
    description: "",
    category: "",
    courseLevel: "",
    coursePrice: "",
  });

  // ==========================================================
  // THUMBNAIL
  // ==========================================================

  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState("");

  // ==========================================================
  // STATES
  // ==========================================================

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================================
  // CURSOR
  // ==========================================================

  const [cursor, setCursor] = useState({
    x: -100,
    y: -100,
  });

  const [spotlight, setSpotlight] = useState({
    x: 50,
    y: 30,
  });

  // ==========================================================
  // CURSOR EFFECT
  // ==========================================================

  useEffect(() => {
    const moveCursor = (event) => {
      setCursor({
        x: event.clientX,
        y: event.clientY,
      });

      setSpotlight({
        x: (event.clientX / window.innerWidth) * 100,
        y: (event.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener("mousemove", moveCursor);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
    };
  }, []);

  // ==========================================================
  // PREVIEW CLEANUP
  // ==========================================================

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  // ==========================================================
  // FORM CHANGE
  // ==========================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  // ==========================================================
  // THUMBNAIL
  // ==========================================================

  const handleThumbnailChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error(
        "Only JPG, PNG or WEBP images are allowed."
      );

      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error(
        "The royal banner must be smaller than 5MB."
      );

      return;
    }

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setThumbnail(file);

    setPreview(
      URL.createObjectURL(file)
    );

    setError("");

    toast.success(
      "Your royal banner has been prepared."
    );
  };

  // ==========================================================
  // REMOVE THUMBNAIL
  // ==========================================================

  const removeThumbnail = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setThumbnail(null);
    setPreview("");

    toast("Banner removed from the realm.", {
      icon: "🗑️",
    });
  };

  // ==========================================================
  // VALIDATION
  // ==========================================================

  const validateForm = () => {
    const title =
      formData.courseTitle.trim();

    const subtitle =
      formData.subTitle.trim();

    const description =
      formData.description.trim();

    if (!title) {
      return "Every realm must have a name.";
    }

    if (title.length < 5) {
      return "Course title must contain at least 5 characters.";
    }

    if (!subtitle) {
      return "Give your course a powerful subtitle.";
    }

    if (!description) {
      return "Describe what your students will conquer.";
    }

    if (description.length < 20) {
      return "Course description should contain at least 20 characters.";
    }

    if (!formData.category) {
      return "Choose the territory of your course.";
    }

    if (!formData.courseLevel) {
      return "Choose the difficulty level.";
    }

    if (
      formData.coursePrice === "" ||
      Number(formData.coursePrice) < 0
    ) {
      return "Enter a valid course price.";
    }

    if (!thumbnail) {
      return "Every great realm needs a banner.";
    }

    return null;
  };

  // ==========================================================
  // CREATE COURSE
  // ==========================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading) return;

    setError("");
    setSuccess("");

    const validationError =
      validateForm();

    if (validationError) {
      setError(validationError);

      toast.error(validationError);

      return;
    }

    try {
      setLoading(true);

      toast.loading(
        "The royal scribes are forging your realm...",
        {
          id: "create-course",
        }
      );

      // ======================================================
      // CREATE COURSE
      // ======================================================

      const courseResponse =
        await api.post(
          "/course/create",
          {
            courseTitle:
              formData.courseTitle.trim(),

            subTitle:
              formData.subTitle.trim(),

            description:
              formData.description.trim(),

            category:
              formData.category,

            courseLevel:
              formData.courseLevel,

            coursePrice:
              Number(
                formData.coursePrice
              ),
          }
        );

      const createdCourse =
        courseResponse.data?.course;

      if (!createdCourse?._id) {
        throw new Error(
          "Course was created, but no course ID was returned."
        );
      }

      // ======================================================
      // UPLOAD THUMBNAIL
      // ======================================================

      const thumbnailData =
        new FormData();

      thumbnailData.append(
        "thumbnail",
        thumbnail
      );

      await api.put(
        `/course/thumbnail/${createdCourse._id}`,
        thumbnailData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      // ======================================================
      // SUCCESS
      // ======================================================

      setSuccess(
        "Your learning realm has been forged successfully."
      );

      toast.success(
        "The realm has been forged! ⚔️",
        {
          id: "create-course",
          duration: 4000,
        }
      );

      // ======================================================
      // REDIRECT
      // ======================================================

      setTimeout(() => {
        navigate(
          "/instructor/courses",
          {
            replace: true,
          }
        );
      }, 1200);

    } catch (error) {
      console.error(
        "Create course error:",
        error
      );

      const message =
        error.response?.data?.message ||
        error.message ||
        "Unable to create course.";

      setError(message);

      toast.error(message, {
        id: "create-course",
        duration: 4500,
      });

    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="got-create-page">

      <PremiumStyles />

      {/* ====================================================
          CINEMATIC BACKGROUND
      ==================================================== */}

      <FantasyBackground
        spotlight={spotlight}
      />

      {/* ====================================================
          CUSTOM CURSOR
      ==================================================== */}

      <div
        className="got-cursor-dot"
        style={{
          left: cursor.x,
          top: cursor.y,
        }}
      />

      <div
        className="got-cursor-ring"
        style={{
          left: cursor.x,
          top: cursor.y,
        }}
      />

      {/* ====================================================
          MAIN CONTENT
      ==================================================== */}

      <main className="relative z-10 mx-auto max-w-[1480px] px-4 py-6 sm:px-6 lg:px-8 lg:py-10">

        {/* ==================================================
            BACK
        ================================================== */}

        <button
          type="button"
          onClick={() =>
            navigate(
              "/instructor/courses"
            )
          }
          disabled={loading}
          className="got-back-button"
        >
          <ArrowLeft size={15} />

          Return to the Course Hall
        </button>

        {/* ==================================================
            HERO
        ================================================== */}

        <header className="relative mb-10 mt-8">

          <div className="got-hero-grid">

            <div className="max-w-4xl">

              <div className="got-eyebrow">

                <Crown size={12} />

                THE ROYAL ARCHIVES

                <span className="got-eyebrow-line" />

                COURSE FORGE

              </div>

              <h1 className="got-title">

                Forge Your

                <span>
                  Learning Realm
                </span>

              </h1>

              <p className="got-description">
                Shape knowledge into a realm worthy
                of your students. Define its identity,
                choose its territory, raise its banner,
                and prepare it for the journey ahead.
              </p>

              <div className="got-hero-meta">

                <HeroMeta
                  icon={<Shield size={13} />}
                  label="ROYAL STANDARD"
                  value="Instructor"
                />

                <HeroMeta
                  icon={<ScrollText size={13} />}
                  label="ARCHIVE"
                  value="New Course"
                />

                <HeroMeta
                  icon={<Sparkles size={13} />}
                  label="STATUS"
                  value="Unforged"
                />

              </div>

            </div>

            {/* ==================================================
                ROYAL SIGIL
            ================================================== */}

            <RoyalSigil />

          </div>

          <div className="got-hero-divider">

            <div />

            <Gem size={11} />

            <span>
              VALAR DOHAERIS
            </span>

            <Gem size={11} />

            <div />

          </div>

        </header>

        {/* ==================================================
            ERROR
        ================================================== */}

        {error && (
          <AlertBox
            type="error"
            message={error}
            onClose={() =>
              setError("")
            }
          />
        )}

        {/* ==================================================
            SUCCESS
        ================================================== */}

        {success && (
          <AlertBox
            type="success"
            message={success}
          />
        )}

        {/* ==================================================
            FORM
        ================================================== */}

        <form
          onSubmit={handleSubmit}
          className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_400px]"
        >

          {/* =================================================
              LEFT COLUMN
          ================================================= */}

          <div className="space-y-8">

            {/* =================================================
                IDENTITY
            ================================================= */}

            <FantasyPanel
              number="I"
              icon={<ScrollText size={18} />}
              eyebrow="THE FIRST SCROLL"
              title="Name Your Realm"
              description="Give your learning kingdom a name that commands attention."
            >

              <div className="space-y-7">

                <FantasyInput
                  label="Course Title"
                  name="courseTitle"
                  value={
                    formData.courseTitle
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Advanced MERN Stack Development"
                  required
                />

                <FantasyInput
                  label="Course Subtitle"
                  name="subTitle"
                  value={
                    formData.subTitle
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Build production-ready applications from frontend to backend"
                  required
                />

                <div>

                  <div className="mb-2 flex items-center justify-between">

                    <label className="got-label">
                      Course Description
                    </label>

                    <span className="got-character-count">
                      {formData.description.length}
                      {" "}
                      CHARACTERS
                    </span>

                  </div>

                  <textarea
                    name="description"
                    value={
                      formData.description
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Tell your students what they will learn, what they will build and where this journey will take them..."
                    rows={8}
                    required
                    disabled={loading}
                    className="got-textarea"
                  />

                </div>

              </div>

            </FantasyPanel>

            {/* =================================================
                TERRITORY
            ================================================= */}

            <FantasyPanel
              number="II"
              icon={<Gem size={18} />}
              eyebrow="THE TERRITORY"
              title="Choose Your Domain"
              description="Define the realm, difficulty and value of your knowledge."
            >

              <div className="grid gap-6 sm:grid-cols-2">

                <FantasySelect
                  label="Category"
                  name="category"
                  value={
                    formData.category
                  }
                  onChange={
                    handleChange
                  }
                  options={[
                    "Web Development",
                    "Programming",
                    "Data Science",
                    "Mobile Development",
                    "Database",
                    "DevOps",
                    "Other",
                  ]}
                />

                <FantasySelect
                  label="Course Level"
                  name="courseLevel"
                  value={
                    formData.courseLevel
                  }
                  onChange={
                    handleChange
                  }
                  options={[
                    "Beginner",
                    "Intermediate",
                    "Advanced",
                  ]}
                />

              </div>

              <div className="got-gold-divider" />

              <div>

                <label className="got-label">
                  Course Price
                </label>

                <div className="got-price-input">

                  <div className="got-rupee">
                    ₹
                  </div>

                  <input
                    type="number"
                    name="coursePrice"
                    value={
                      formData.coursePrice
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="1499"
                    min="0"
                    step="1"
                    disabled={loading}
                    required
                  />

                  <div className="got-price-label">
                    COURSE VALUE
                  </div>

                </div>

                <p className="got-help-text">

                  <Info size={11} />

                  Pricing can be changed later
                  from course management.

                </p>

              </div>

            </FantasyPanel>

            {/* =================================================
                CREATION PATH
            ================================================= */}

            <div className="got-journey-panel">

              <div className="got-journey-header">

                <div className="got-journey-icon">
                  <Swords size={17} />
                </div>

                <div>

                  <p className="got-section-eyebrow">
                    THE PATH AHEAD
                  </p>

                  <h3>
                    From Realm to Legacy
                  </h3>

                </div>

              </div>

              <div className="got-journey-line" />

              <div className="grid gap-4 sm:grid-cols-3">

                <JourneyStep
                  number="01"
                  title="Course"
                  description="Forge the realm"
                  active
                />

                <JourneyStep
                  number="02"
                  title="Modules"
                  description="Raise the halls"
                />

                <JourneyStep
                  number="03"
                  title="AI Quiz"
                  description="Test the realm"
                />

              </div>

            </div>

          </div>

          {/* =================================================
              RIGHT COLUMN
          ================================================= */}

          <aside className="space-y-8">

            {/* =================================================
                BANNER
            ================================================= */}

            <FantasyPanel
              number="III"
              icon={<ImagePlus size={18} />}
              eyebrow="THE ROYAL STANDARD"
              title="Raise Your Banner"
              description="Choose the image that will represent your realm."
            >

              <input
                id="thumbnail"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={
                  handleThumbnailChange
                }
                disabled={loading}
                className="hidden"
              />

              <label
                htmlFor="thumbnail"
                className="block cursor-pointer"
              >

                <div
                  className={`got-thumbnail ${
                    preview
                      ? "has-image"
                      : ""
                  }`}
                >

                  {preview ? (

                    <>
                      <img
                        src={preview}
                        alt="Course banner preview"
                      />

                      <div className="got-thumbnail-overlay">

                        <div className="got-upload-circle">

                          <Upload
                            size={18}
                          />

                        </div>

                        <span>
                          Change Royal Banner
                        </span>

                      </div>
                    </>

                  ) : (

                    <div className="got-upload-content">

                      <div className="got-upload-icon">

                        <ImagePlus
                          size={25}
                        />

                      </div>

                      <p>
                        Raise Your Banner
                      </p>

                      <span>
                        JPG · PNG · WEBP
                      </span>

                      <small>
                        Maximum 5MB
                      </small>

                      <div className="got-browse-button">

                        <Upload
                          size={12}
                        />

                        Browse Images

                      </div>

                    </div>

                  )}

                </div>

              </label>

              {thumbnail && (

                <div className="got-file-card">

                  <div className="got-file-icon">
                    <ImagePlus size={14} />
                  </div>

                  <div className="min-w-0 flex-1">

                    <p>
                      {thumbnail.name}
                    </p>

                    <span>
                      {(
                        thumbnail.size /
                        1024 /
                        1024
                      ).toFixed(2)}
                      {" "}
                      MB
                    </span>

                  </div>

                  <button
                    type="button"
                    onClick={
                      removeThumbnail
                    }
                    disabled={loading}
                    className="got-remove-button"
                  >
                    <X size={14} />
                  </button>

                </div>

              )}

            </FantasyPanel>

            {/* =================================================
                LIVE PREVIEW
            ================================================= */}

            <div className="got-preview-card">

              <div className="got-preview-header">

                <div>

                  <p>
                    ROYAL PREVIEW
                  </p>

                  <span>
                    LIVE FROM THE ARCHIVES
                  </span>

                </div>

                <span className="got-live">

                  <span />

                  LIVE

                </span>

              </div>

              <div className="got-preview-image">

                {preview ? (

                  <img
                    src={preview}
                    alt="Course preview"
                  />

                ) : (

                  <div className="got-preview-placeholder">

                    <Castle size={35} />

                    <span>
                      YOUR REALM
                    </span>

                  </div>

                )}

                <div className="got-preview-vignette" />

                <div className="got-preview-content">

                  <span className="got-preview-category">

                    {formData.category ||
                      "COURSE"}

                  </span>

                  <h3>

                    {formData.courseTitle ||
                      "Your Course Title"}

                  </h3>

                  <p>

                    {formData.subTitle ||
                      "Your course subtitle will appear here."}

                  </p>

                </div>

              </div>

              <div className="got-preview-footer">

                <div>

                  <span>
                    LEVEL
                  </span>

                  <strong>
                    {formData.courseLevel ||
                      "—"}
                  </strong>

                </div>

                <div>

                  <span>
                    PRICE
                  </span>

                  <strong>
                    {formData.coursePrice
                      ? `₹${formData.coursePrice}`
                      : "—"}
                  </strong>

                </div>

              </div>

            </div>

            {/* =================================================
                FORGE BUTTON
            ================================================= */}

            <button
              type="submit"
              disabled={loading}
              className="got-forge-button"
            >

              <span className="got-button-shine" />

              <span className="got-button-content">

                {loading ? (

                  <>
                    <LoaderCircle
                      size={19}
                      className="animate-spin"
                    />

                    Forging Realm...
                  </>

                ) : (

                  <>
                    <Crown size={18} />

                    Forge This Realm

                    <ArrowRight
                      size={16}
                    />
                  </>

                )}

              </span>

            </button>

            <div className="got-warning">

              <Gem size={10} />

              <span>
                The realm will be created before
                its royal banner is uploaded.
              </span>

              <Gem size={10} />

            </div>

          </aside>

        </form>

        {/* ==================================================
            FOOTER
        ================================================== */}

        <footer className="got-footer">

          <div />

          <Gem size={10} />

          <span>
            BUILD YOUR LEGACY
          </span>

          <Gem size={10} />

          <div />

        </footer>

      </main>
    </div>
  );
}

// ============================================================
// HERO META
// ============================================================

function HeroMeta({
  icon,
  label,
  value,
}) {
  return (
    <div className="got-hero-meta-item">

      <div className="got-hero-meta-icon">
        {icon}
      </div>

      <div>
        <span>
          {label}
        </span>

        <strong>
          {value}
        </strong>
      </div>

    </div>
  );
}

// ============================================================
// ROYAL SIGIL
// ============================================================

function RoyalSigil() {
  return (
    <div className="got-royal-sigil">

      <div className="sigil-orbit orbit-one" />

      <div className="sigil-orbit orbit-two" />

      <div className="sigil-orbit orbit-three" />

      <div className="sigil-diamond diamond-one" />
      <div className="sigil-diamond diamond-two" />
      <div className="sigil-diamond diamond-three" />
      <div className="sigil-diamond diamond-four" />

      <div className="got-sigil-core">

        <div className="sigil-inner-ring">

          <Castle size={39} />

        </div>

      </div>

      <div className="sigil-caption">
        <span>THE</span>
        <strong>FORGE</strong>
      </div>

    </div>
  );
}

// ============================================================
// FANTASY PANEL
// ============================================================

function FantasyPanel({
  number,
  icon,
  eyebrow,
  title,
  description,
  children,
}) {
  return (
    <section className="got-panel">

      <div className="got-panel-glow" />

      <div className="got-panel-corner corner-tl" />
      <div className="got-panel-corner corner-tr" />
      <div className="got-panel-corner corner-bl" />
      <div className="got-panel-corner corner-br" />

      <div className="got-panel-top-line" />

      <div className="got-panel-header">

        <div className="got-panel-number">
          {number}
        </div>

        <div className="got-panel-icon">
          {icon}
        </div>

        <div className="min-w-0">

          <p className="got-panel-eyebrow">
            {eyebrow}
          </p>

          <h2>
            {title}
          </h2>

          <p>
            {description}
          </p>

        </div>

      </div>

      <div className="got-panel-body">
        {children}
      </div>

    </section>
  );
}

// ============================================================
// INPUT
// ============================================================

function FantasyInput({
  label,
  name,
  value,
  onChange,
  placeholder,
  required,
}) {
  return (
    <div>

      <label
        htmlFor={name}
        className="got-label"
      >
        {label}
      </label>

      <div className="got-input-shell">

        <div className="got-input-rune">
          ◆
        </div>

        <input
          id={name}
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="got-input"
        />

      </div>

    </div>
  );
}

// ============================================================
// SELECT
// ============================================================

function FantasySelect({
  label,
  name,
  value,
  onChange,
  options,
}) {
  return (
    <div>

      <label className="got-label">
        {label}
      </label>

      <div className="got-select-shell">

        <select
          name={name}
          value={value}
          onChange={onChange}
          className="got-select"
        >

          <option value="">
            Select {label.toLowerCase()}
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

        <ChevronDown
          size={15}
          className="got-select-arrow"
        />

      </div>

    </div>
  );
}

// ============================================================
// ALERT
// ============================================================

function AlertBox({
  type,
  message,
  onClose,
}) {
  const success =
    type === "success";

  return (
    <div
      className={`got-alert ${
        success
          ? "got-alert-success"
          : "got-alert-error"
      }`}
    >

      {success ? (
        <CheckCircle2 size={18} />
      ) : (
        <Info size={18} />
      )}

      <p>
        {message}
      </p>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
        >
          <X size={15} />
        </button>
      )}

    </div>
  );
}

// ============================================================
// JOURNEY STEP
// ============================================================

function JourneyStep({
  number,
  title,
  description,
  active = false,
}) {
  return (
    <div
      className={`got-journey-step ${
        active
          ? "active"
          : ""
      }`}
    >

      <div className="got-journey-number">
        {number}
      </div>

      <div>

        <p>
          {title}
        </p>

        <span>
          {description}
        </span>

      </div>

      {active && (
        <Check
          size={13}
          className="got-journey-check"
        />
      )}

    </div>
  );
}

// ============================================================
// BACKGROUND
// ============================================================

function FantasyBackground({
  spotlight,
}) {
  const particles =
    Array.from(
      { length: 42 },
      (_, index) => index
    );

  return (
    <>

      {/* Main darkness */}

      <div className="got-bg-base" />

      {/* Cursor spotlight */}

      <div
        className="got-mouse-light"
        style={{
          left: `${spotlight.x}%`,
          top: `${spotlight.y}%`,
        }}
      />

      {/* Royal glow */}

      <div className="got-bg-gold" />

      <div className="got-bg-red" />

      {/* Grid */}

      <div className="got-bg-grid" />

      {/* Mountain silhouette */}

      <div className="got-mountains">

        <div className="mountain mountain-one" />
        <div className="mountain mountain-two" />
        <div className="mountain mountain-three" />

      </div>

      {/* Fog */}

      <div className="got-fog got-fog-one" />
      <div className="got-fog got-fog-two" />

      {/* Embers */}

      <div className="got-embers">

        {particles.map((particle) => (
          <span
            key={particle}
            className="got-ember"
            style={{
              left:
                `${(particle * 37) % 100}%`,
              top:
                `${70 + ((particle * 17) % 30)}%`,
              animationDelay:
                `${-(particle % 11)}s`,
              animationDuration:
                `${7 + (particle % 8)}s`,
            }}
          />
        ))}

      </div>

      {/* Vignette */}

      <div className="got-vignette" />

    </>
  );
}

// ============================================================
// PREMIUM CSS
// ============================================================

function PremiumStyles() {
  return (
    <style>{`

      /* =====================================================
         ROOT
      ===================================================== */

      .got-create-page {
        min-height: 100vh;
        position: relative;
        overflow-x: hidden;
        background: #030302;
        color: #d8d4ca;
        font-family: Inter, system-ui, sans-serif;
      }

      .got-create-page,
      .got-create-page * {
        cursor: none !important;
      }


      /* =====================================================
         BACKGROUND
      ===================================================== */

      .got-bg-base {
        position: fixed;
        inset: 0;
        z-index: 0;
        background:
          radial-gradient(
            ellipse at 50% -10%,
            rgba(201,162,39,.12),
            transparent 32%
          ),
          radial-gradient(
            ellipse at 10% 70%,
            rgba(96,19,8,.12),
            transparent 30%
          ),
          radial-gradient(
            ellipse at 90% 35%,
            rgba(89,22,8,.10),
            transparent 30%
          ),
          #030302;
      }

      .got-mouse-light {
        position: fixed;
        z-index: 1;
        width: 550px;
        height: 550px;
        transform: translate(-50%, -50%);
        pointer-events: none;
        border-radius: 50%;
        background:
          radial-gradient(
            circle,
            rgba(212,175,55,.055),
            transparent 68%
          );
        filter: blur(10px);
        transition:
          left .25s ease-out,
          top .25s ease-out;
      }

      .got-bg-gold {
        position: fixed;
        z-index: 0;
        left: -250px;
        top: 20%;
        width: 600px;
        height: 600px;
        border-radius: 50%;
        background: rgba(201,162,39,.035);
        filter: blur(130px);
        animation:
          backgroundFloat 12s ease-in-out infinite;
      }

      .got-bg-red {
        position: fixed;
        z-index: 0;
        right: -250px;
        bottom: 10%;
        width: 600px;
        height: 600px;
        border-radius: 50%;
        background: rgba(100,15,5,.045);
        filter: blur(130px);
        animation:
          backgroundFloatReverse 15s ease-in-out infinite;
      }

      .got-bg-grid {
        position: fixed;
        inset: 0;
        z-index: 1;
        pointer-events: none;
        opacity: .025;
        background-image:
          linear-gradient(
            rgba(212,175,55,.8) 1px,
            transparent 1px
          ),
          linear-gradient(
            90deg,
            rgba(212,175,55,.8) 1px,
            transparent 1px
          );
        background-size: 70px 70px;
        mask-image:
          linear-gradient(
            to bottom,
            black,
            transparent 85%
          );
      }


      /* =====================================================
         MOUNTAINS
      ===================================================== */

      .got-mountains {
        position: fixed;
        z-index: 1;
        left: 0;
        right: 0;
        bottom: 0;
        height: 280px;
        opacity: .25;
        pointer-events: none;
        overflow: hidden;
      }

      .mountain {
        position: absolute;
        bottom: -120px;
        width: 0;
        height: 0;
        border-left: 350px solid transparent;
        border-right: 350px solid transparent;
        border-bottom: 420px solid #080807;
      }

      .mountain-one {
        left: -150px;
      }

      .mountain-two {
        left: 30%;
        transform: scale(1.35);
        opacity: .65;
      }

      .mountain-three {
        right: -180px;
        transform: scale(1.15);
        opacity: .8;
      }


      /* =====================================================
         FOG
      ===================================================== */

      .got-fog {
        position: fixed;
        z-index: 2;
        pointer-events: none;
        width: 65vw;
        height: 170px;
        border-radius: 50%;
        background:
          linear-gradient(
            90deg,
            transparent,
            rgba(150,150,145,.025),
            transparent
          );
        filter: blur(55px);
      }

      .got-fog-one {
        left: -25%;
        bottom: 15%;
        animation:
          fogMove 25s ease-in-out infinite;
      }

      .got-fog-two {
        right: -25%;
        top: 35%;
        animation:
          fogMoveReverse 30s ease-in-out infinite;
      }


      /* =====================================================
         EMBERS
      ===================================================== */

      .got-embers {
        position: fixed;
        inset: 0;
        z-index: 3;
        pointer-events: none;
        overflow: hidden;
      }

      .got-ember {
        position: absolute;
        width: 2px;
        height: 2px;
        border-radius: 50%;
        background: #e0b93f;
        box-shadow:
          0 0 8px rgba(224,185,63,.8);
        opacity: 0;
        animation:
          emberRise
          9s
          linear
          infinite;
      }


      /* =====================================================
         VIGNETTE
      ===================================================== */

      .got-vignette {
        position: fixed;
        inset: 0;
        z-index: 4;
        pointer-events: none;
        background:
          radial-gradient(
            ellipse at center,
            transparent 40%,
            rgba(0,0,0,.55) 100%
          );
      }


      /* =====================================================
         CURSOR
      ===================================================== */

      .got-cursor-dot {
        position: fixed;
        z-index: 9999;
        width: 6px;
        height: 6px;
        margin-left: -3px;
        margin-top: -3px;
        border-radius: 50%;
        pointer-events: none;
        background: #e6c65a;
        box-shadow:
          0 0 12px rgba(212,175,55,.95),
          0 0 30px rgba(212,175,55,.35);
      }

      .got-cursor-ring {
        position: fixed;
        z-index: 9998;
        width: 38px;
        height: 38px;
        margin-left: -19px;
        margin-top: -19px;
        border: 1px solid rgba(212,175,55,.35);
        border-radius: 50%;
        pointer-events: none;
        transition:
          left .1s ease-out,
          top .1s ease-out;
      }


      /* =====================================================
         BACK BUTTON
      ===================================================== */

      .got-back-button {
        position: relative;
        display: inline-flex;
        align-items: center;
        gap: 9px;
        padding: 10px 14px;
        border: 1px solid #28261f;
        border-radius: 10px;
        background: rgba(255,255,255,.015);
        color: #68635a;
        font-size: 9px;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: .18em;
        transition: all .35s ease;
      }

      .got-back-button:hover {
        color: #d4af37;
        border-color: rgba(201,162,39,.35);
        background: rgba(201,162,39,.04);
        transform: translateX(-5px);
        box-shadow:
          0 8px 30px rgba(201,162,39,.06);
      }


      /* =====================================================
         HERO
      ===================================================== */

      .got-hero-grid {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 50px;
      }

      .got-eyebrow {
        display: inline-flex;
        align-items: center;
        gap: 9px;
        padding: 7px 12px;
        border: 1px solid rgba(201,162,39,.22);
        border-radius: 999px;
        background:
          linear-gradient(
            135deg,
            rgba(201,162,39,.07),
            rgba(201,162,39,.015)
          );
        color: #a18432;
        font-size: 7px;
        font-weight: 900;
        letter-spacing: .3em;
        box-shadow:
          0 0 30px rgba(201,162,39,.035);
      }

      .got-eyebrow-line {
        width: 18px;
        height: 1px;
        background: rgba(201,162,39,.3);
      }

      .got-title {
        margin-top: 20px;
        font-family:
          Georgia,
          'Times New Roman',
          serif;
        font-size:
          clamp(3rem, 7vw, 6rem);
        line-height: .94;
        font-weight: 500;
        letter-spacing: -.045em;
        color: #eee9db;
        text-shadow:
          0 5px 45px rgba(0,0,0,.7);
      }

      .got-title span {
        display: block;
        margin-top: 10px;
        color: #d4af37;
        text-shadow:
          0 0 45px rgba(212,175,55,.11);
      }

      .got-description {
        max-width: 650px;
        margin-top: 25px;
        color: #68645c;
        font-size: 13px;
        line-height: 2;
      }

      .got-hero-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        margin-top: 30px;
      }

      .got-hero-meta-item {
        display: flex;
        align-items: center;
        gap: 9px;
        min-width: 125px;
        padding: 9px 12px;
        border: 1px solid #201f1b;
        border-radius: 11px;
        background: rgba(8,8,7,.6);
      }

      .got-hero-meta-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 27px;
        height: 27px;
        border: 1px solid rgba(201,162,39,.16);
        border-radius: 8px;
        color: #a18432;
        background: rgba(201,162,39,.035);
      }

      .got-hero-meta-item span {
        display: block;
        color: #4c4942;
        font-size: 6px;
        font-weight: 900;
        letter-spacing: .2em;
      }

      .got-hero-meta-item strong {
        display: block;
        margin-top: 3px;
        color: #777269;
        font-size: 9px;
      }

      .got-hero-divider {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-top: 45px;
        color: #5c4c27;
      }

      .got-hero-divider div {
        height: 1px;
        flex: 1;
        background:
          linear-gradient(
            90deg,
            transparent,
            #29251a
          );
      }

      .got-hero-divider div:last-child {
        background:
          linear-gradient(
            90deg,
            #29251a,
            transparent
          );
      }

      .got-hero-divider span {
        font-family: Georgia, serif;
        font-size: 7px;
        letter-spacing: .4em;
      }


      /* =====================================================
         ROYAL SIGIL
      ===================================================== */

      .got-royal-sigil {
        position: relative;
        width: 245px;
        height: 245px;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .sigil-orbit {
        position: absolute;
        border-radius: 50%;
        border: 1px solid rgba(201,162,39,.14);
      }

      .orbit-one {
        inset: 0;
        border-style: dashed;
        animation:
          gotSpin 30s linear infinite;
      }

      .orbit-two {
        inset: 23px;
        border-color: rgba(201,162,39,.2);
        animation:
          gotSpinReverse 22s linear infinite;
      }

      .orbit-three {
        inset: 49px;
        border-style: dotted;
        border-color: rgba(201,162,39,.13);
        animation:
          gotSpin 14s linear infinite;
      }

      .got-sigil-core {
        position: relative;
        z-index: 5;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 104px;
        height: 104px;
        border: 1px solid rgba(212,175,55,.4);
        border-radius: 50%;
        background:
          radial-gradient(
            circle,
            rgba(201,162,39,.08),
            #090806 65%
          );
        box-shadow:
          inset 0 0 35px rgba(201,162,39,.07),
          0 0 60px rgba(201,162,39,.08);
        animation:
          sigilPulse 5s ease-in-out infinite;
      }

      .sigil-inner-ring {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 72px;
        height: 72px;
        border: 1px solid rgba(212,175,55,.2);
        border-radius: 50%;
        color: #d4af37;
      }

      .sigil-diamond {
        position: absolute;
        width: 5px;
        height: 5px;
        transform: rotate(45deg);
        background: #d4af37;
        box-shadow:
          0 0 10px rgba(212,175,55,.7);
      }

      .diamond-one {
        top: 17px;
        left: 50%;
      }

      .diamond-two {
        right: 17px;
        top: 50%;
      }

      .diamond-three {
        bottom: 17px;
        left: 50%;
      }

      .diamond-four {
        left: 17px;
        top: 50%;
      }

      .sigil-caption {
        position: absolute;
        bottom: -8px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2px;
        font-family: Georgia, serif;
      }

      .sigil-caption span {
        color: #575044;
        font-size: 6px;
        letter-spacing: .4em;
      }

      .sigil-caption strong {
        color: #9b8032;
        font-size: 9px;
        letter-spacing: .32em;
      }


      /* =====================================================
         PANEL
      ===================================================== */

      .got-panel {
        position: relative;
        overflow: hidden;
        border: 1px solid #24221d;
        border-radius: 24px;
        background:
          linear-gradient(
            135deg,
            rgba(16,15,12,.97),
            rgba(7,7,6,.96)
          );
        box-shadow:
          0 30px 100px rgba(0,0,0,.38);
        backdrop-filter: blur(25px);
        transition:
          transform .45s ease,
          border-color .45s ease,
          box-shadow .45s ease;
        animation:
          panelReveal .7s ease-out both;
      }

      .got-panel:hover {
        transform: translateY(-3px);
        border-color: rgba(201,162,39,.2);
        box-shadow:
          0 35px 110px rgba(0,0,0,.5),
          0 0 50px rgba(201,162,39,.025);
      }

      .got-panel-glow {
        position: absolute;
        right: -150px;
        top: -180px;
        width: 350px;
        height: 350px;
        border-radius: 50%;
        background: rgba(201,162,39,.035);
        filter: blur(80px);
        pointer-events: none;
      }

      .got-panel-top-line {
        position: absolute;
        left: 50%;
        top: 0;
        width: 20%;
        height: 1px;
        transform: translateX(-50%);
        background:
          linear-gradient(
            90deg,
            transparent,
            rgba(212,175,55,.65),
            transparent
          );
        transition: width .6s ease;
      }

      .got-panel:hover .got-panel-top-line {
        width: 55%;
      }

      .got-panel-corner {
        position: absolute;
        width: 18px;
        height: 18px;
        pointer-events: none;
        opacity: .45;
      }

      .corner-tl {
        left: 10px;
        top: 10px;
        border-left: 1px solid #806b30;
        border-top: 1px solid #806b30;
      }

      .corner-tr {
        right: 10px;
        top: 10px;
        border-right: 1px solid #806b30;
        border-top: 1px solid #806b30;
      }

      .corner-bl {
        left: 10px;
        bottom: 10px;
        border-left: 1px solid #806b30;
        border-bottom: 1px solid #806b30;
      }

      .corner-br {
        right: 10px;
        bottom: 10px;
        border-right: 1px solid #806b30;
        border-bottom: 1px solid #806b30;
      }

      .got-panel-header {
        position: relative;
        z-index: 2;
        display: flex;
        align-items: center;
        gap: 13px;
        padding: 24px;
        border-bottom: 1px solid #1c1b18;
      }

      .got-panel-number {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 34px;
        height: 34px;
        flex-shrink: 0;
        border: 1px solid #302d24;
        border-radius: 9px;
        color: #6c5b32;
        font-family: Georgia, serif;
        font-size: 10px;
        background: rgba(201,162,39,.025);
      }

      .got-panel-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 43px;
        height: 43px;
        flex-shrink: 0;
        border: 1px solid rgba(201,162,39,.2);
        border-radius: 12px;
        background:
          linear-gradient(
            135deg,
            rgba(201,162,39,.07),
            rgba(201,162,39,.015)
          );
        color: #aa8c37;
        transition: all .4s ease;
      }

      .got-panel:hover .got-panel-icon {
        color: #e0bd50;
        border-color: rgba(201,162,39,.42);
        transform:
          scale(1.07)
          rotate(3deg);
        box-shadow:
          0 0 30px rgba(201,162,39,.08);
      }

      .got-panel-eyebrow {
        color: #856c2b;
        font-size: 7px;
        font-weight: 900;
        letter-spacing: .3em;
      }

      .got-panel-header h2 {
        margin-top: 4px;
        font-family: Georgia, serif;
        font-size: 20px;
        font-weight: 600;
        color: #ded9cb;
      }

      .got-panel-header p:last-child {
        margin-top: 4px;
        color: #59554e;
        font-size: 9px;
        line-height: 1.7;
      }

      .got-panel-body {
        position: relative;
        z-index: 2;
        padding: 26px;
      }


      /* =====================================================
         LABELS
      ===================================================== */

      .got-label {
        display: block;
        margin-bottom: 9px;
        color: #777168;
        font-size: 8px;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: .2em;
      }

      .got-character-count {
        color: #403d36;
        font-size: 7px;
        letter-spacing: .12em;
      }


      /* =====================================================
         INPUTS
      ===================================================== */

      .got-input-shell {
        position: relative;
      }

      .got-input-rune {
        position: absolute;
        left: 14px;
        top: 50%;
        transform: translateY(-50%);
        color: #574924;
        font-size: 7px;
        transition: color .3s ease;
      }

      .got-input-shell:focus-within
      .got-input-rune {
        color: #d4af37;
      }

      .got-input,
      .got-textarea,
      .got-select {
        width: 100%;
        border: 1px solid #28261f;
        outline: none;
        border-radius: 13px;
        background:
          linear-gradient(
            135deg,
            #0d0d0b,
            #090908
          );
        color: #d8d3c8;
        font-size: 12px;
        transition:
          border-color .35s ease,
          box-shadow .35s ease,
          background .35s ease;
      }

      .got-input {
        padding: 15px 15px 15px 30px;
      }

      .got-textarea {
        resize: vertical;
        min-height: 155px;
        padding: 15px;
        line-height: 1.8;
      }

      .got-input::placeholder,
      .got-textarea::placeholder {
        color: #403d36;
      }

      .got-input:focus,
      .got-textarea:focus,
      .got-select:focus {
        border-color: rgba(201,162,39,.48);
        background: #0f0f0d;
        box-shadow:
          0 0 0 4px rgba(201,162,39,.025),
          0 0 40px rgba(201,162,39,.045);
      }


      /* =====================================================
         SELECT
      ===================================================== */

      .got-select-shell {
        position: relative;
      }

      .got-select {
        appearance: none;
        padding: 15px 42px 15px 15px;
      }

      .got-select-arrow {
        position: absolute;
        right: 15px;
        top: 50%;
        transform: translateY(-50%);
        pointer-events: none;
        color: #5d5132;
      }

      .got-select option {
        background: #0b0b09;
        color: #d8d3c8;
      }


      /* =====================================================
         GOLD DIVIDER
      ===================================================== */

      .got-gold-divider {
        height: 1px;
        margin: 25px 0;
        background:
          linear-gradient(
            90deg,
            transparent,
            #322b1c,
            transparent
          );
      }


      /* =====================================================
         PRICE
      ===================================================== */

      .got-price-input {
        display: flex;
        align-items: center;
        overflow: hidden;
        border: 1px solid #28261f;
        border-radius: 13px;
        background: #0b0b09;
        transition: all .35s ease;
      }

      .got-price-input:focus-within {
        border-color: rgba(201,162,39,.48);
        box-shadow:
          0 0 0 4px rgba(201,162,39,.025);
      }

      .got-rupee {
        padding-left: 16px;
        color: #d4af37;
        font-family: Georgia, serif;
        font-size: 17px;
      }

      .got-price-input input {
        width: 100%;
        padding: 15px 12px;
        border: 0;
        outline: 0;
        background: transparent;
        color: #d8d3c8;
        font-size: 12px;
      }

      .got-price-label {
        padding-right: 15px;
        color: #403d36;
        font-size: 7px;
        font-weight: 900;
        letter-spacing: .16em;
        white-space: nowrap;
      }

      .got-help-text {
        display: flex;
        align-items: center;
        gap: 6px;
        margin-top: 9px;
        color: #4b4841;
        font-size: 8px;
      }


      /* =====================================================
         JOURNEY
      ===================================================== */

      .got-journey-panel {
        position: relative;
        padding: 22px;
        overflow: hidden;
        border: 1px solid #24221d;
        border-radius: 22px;
        background:
          linear-gradient(
            135deg,
            rgba(14,13,11,.9),
            rgba(7,7,6,.8)
          );
      }

      .got-journey-header {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .got-journey-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 38px;
        height: 38px;
        border: 1px solid rgba(201,162,39,.2);
        border-radius: 10px;
        color: #a18432;
        background: rgba(201,162,39,.035);
      }

      .got-section-eyebrow {
        color: #80672a;
        font-size: 7px;
        font-weight: 900;
        letter-spacing: .3em;
      }

      .got-journey-header h3 {
        margin-top: 3px;
        font-family: Georgia, serif;
        font-size: 16px;
        color: #c9c3b7;
      }

      .got-journey-line {
        height: 1px;
        margin: 19px 0;
        background:
          linear-gradient(
            90deg,
            transparent,
            #28251e,
            transparent
          );
      }

      .got-journey-step {
        position: relative;
        display: flex;
        align-items: center;
        gap: 11px;
        min-height: 65px;
        padding: 11px;
        border: 1px solid #1e1d19;
        border-radius: 13px;
        background: rgba(0,0,0,.18);
        transition: all .35s ease;
      }

      .got-journey-step.active {
        border-color: rgba(201,162,39,.25);
        background: rgba(201,162,39,.035);
        box-shadow:
          inset 0 0 25px rgba(201,162,39,.025);
      }

      .got-journey-number {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 30px;
        height: 30px;
        flex-shrink: 0;
        border: 1px solid #2b2922;
        border-radius: 8px;
        color: #59513c;
        font-family: Georgia, serif;
        font-size: 9px;
      }

      .got-journey-step.active
      .got-journey-number {
        border-color: rgba(201,162,39,.3);
        color: #d4af37;
      }

      .got-journey-step p {
        color: #817b70;
        font-size: 10px;
        font-weight: 700;
      }

      .got-journey-step span {
        display: block;
        margin-top: 3px;
        color: #45413a;
        font-size: 7px;
        text-transform: uppercase;
        letter-spacing: .12em;
      }

      .got-journey-check {
        position: absolute;
        right: 10px;
        top: 10px;
        color: #d4af37;
      }


      /* =====================================================
         THUMBNAIL
      ===================================================== */

      .got-thumbnail {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        aspect-ratio: 16 / 10;
        overflow: hidden;
        border: 1px dashed #403a2d;
        border-radius: 18px;
        background:
          radial-gradient(
            circle at center,
            rgba(201,162,39,.07),
            transparent 65%
          ),
          #080807;
        transition:
          border-color .4s ease,
          box-shadow .4s ease,
          transform .4s ease;
      }

      .got-thumbnail:hover {
        border-color: rgba(201,162,39,.55);
        box-shadow:
          inset 0 0 60px rgba(201,162,39,.035),
          0 15px 45px rgba(0,0,0,.25);
        transform: translateY(-2px);
      }

      .got-thumbnail img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform .8s ease;
      }

      .got-thumbnail:hover img {
        transform: scale(1.06);
      }

      .got-upload-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
      }

      .got-upload-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 58px;
        height: 58px;
        border: 1px solid rgba(201,162,39,.2);
        border-radius: 16px;
        background: rgba(201,162,39,.035);
        color: #9c7e30;
        transition: all .4s ease;
      }

      .got-thumbnail:hover
      .got-upload-icon {
        color: #d4af37;
        transform:
          translateY(-5px)
          scale(1.05);
        box-shadow:
          0 15px 35px rgba(201,162,39,.08);
      }

      .got-upload-content p {
        margin-top: 15px;
        font-family: Georgia, serif;
        font-size: 14px;
        font-weight: 600;
        color: #bbb5a8;
      }

      .got-upload-content span {
        margin-top: 8px;
        color: #59544b;
        font-size: 8px;
        text-transform: uppercase;
        letter-spacing: .15em;
      }

      .got-upload-content small {
        margin-top: 3px;
        color: #403d36;
        font-size: 7px;
      }

      .got-browse-button {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        margin-top: 15px;
        padding: 8px 12px;
        border: 1px solid rgba(201,162,39,.2);
        border-radius: 9px;
        background: rgba(201,162,39,.035);
        color: #967b31;
        font-size: 8px;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: .13em;
      }

      .got-thumbnail-overlay {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 9px;
        background: rgba(0,0,0,.62);
        color: #d4af37;
        opacity: 0;
        transition: opacity .4s ease;
        font-size: 8px;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: .15em;
      }

      .got-thumbnail:hover
      .got-thumbnail-overlay {
        opacity: 1;
      }

      .got-upload-circle {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 45px;
        height: 45px;
        border: 1px solid rgba(212,175,55,.45);
        border-radius: 50%;
        background: rgba(0,0,0,.65);
      }

      .got-file-card {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-top: 12px;
        padding: 11px;
        border: 1px solid #211f1b;
        border-radius: 12px;
        background: #0a0a09;
      }

      .got-file-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 31px;
        height: 31px;
        border: 1px solid rgba(201,162,39,.15);
        border-radius: 8px;
        color: #9b7f32;
      }

      .got-file-card p {
        overflow: hidden;
        color: #777168;
        font-size: 9px;
        font-weight: 700;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .got-file-card span {
        display: block;
        margin-top: 3px;
        color: #403d36;
        font-size: 7px;
        text-transform: uppercase;
        letter-spacing: .1em;
      }

      .got-remove-button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 30px;
        height: 30px;
        flex-shrink: 0;
        border-radius: 8px;
        color: #5b554d;
        transition: all .3s ease;
      }

      .got-remove-button:hover {
        background: rgba(100,10,10,.2);
        color: #d96a61;
      }


      /* =====================================================
         PREVIEW
      ===================================================== */

      .got-preview-card {
        overflow: hidden;
        border: 1px solid #29271f;
        border-radius: 22px;
        background: #080807;
        box-shadow:
          0 25px 75px rgba(0,0,0,.42);
        transition:
          transform .5s ease,
          border-color .5s ease,
          box-shadow .5s ease;
      }

      .got-preview-card:hover {
        transform: translateY(-5px);
        border-color: rgba(201,162,39,.22);
        box-shadow:
          0 35px 90px rgba(0,0,0,.55);
      }

      .got-preview-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 14px 15px;
        border-bottom: 1px solid #1d1c18;
      }

      .got-preview-header p {
        color: #8a7030;
        font-size: 7px;
        font-weight: 900;
        letter-spacing: .25em;
      }

      .got-preview-header span:not(.got-live) {
        display: block;
        margin-top: 4px;
        color: #3f3c36;
        font-size: 6px;
        letter-spacing: .12em;
      }

      .got-live {
        display: flex;
        align-items: center;
        gap: 5px;
        color: #3e9661;
        font-size: 7px;
        font-weight: 900;
        letter-spacing: .15em;
      }

      .got-live span {
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background: #49ad6e;
        box-shadow:
          0 0 10px rgba(73,173,110,.7);
        animation:
          livePulse 1.5s ease-in-out infinite;
      }

      .got-preview-image {
        position: relative;
        height: 245px;
        overflow: hidden;
        background:
          radial-gradient(
            circle at center,
            rgba(201,162,39,.09),
            transparent 60%
          ),
          #070706;
      }

      .got-preview-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        opacity: .82;
        transition: transform .8s ease;
      }

      .got-preview-card:hover
      .got-preview-image img {
        transform: scale(1.06);
      }

      .got-preview-vignette {
        position: absolute;
        inset: 0;
        background:
          linear-gradient(
            to top,
            rgba(0,0,0,.95),
            rgba(0,0,0,.08) 65%,
            rgba(0,0,0,.15)
          );
      }

      .got-preview-placeholder {
        display: flex;
        height: 100%;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 13px;
        color: #51452a;
      }

      .got-preview-placeholder span {
        font-family: Georgia, serif;
        font-size: 9px;
        letter-spacing: .42em;
      }

      .got-preview-content {
        position: absolute;
        left: 17px;
        right: 17px;
        bottom: 17px;
      }

      .got-preview-category {
        display: inline-flex;
        padding: 5px 8px;
        border: 1px solid rgba(201,162,39,.3);
        border-radius: 999px;
        background: rgba(0,0,0,.5);
        color: #d4af37;
        font-size: 6px;
        font-weight: 900;
        letter-spacing: .15em;
      }

      .got-preview-content h3 {
        margin-top: 8px;
        font-family: Georgia, serif;
        font-size: 20px;
        line-height: 1.2;
        color: white;
      }

      .got-preview-content p {
        margin-top: 5px;
        overflow: hidden;
        color: #a09a8d;
        font-size: 8px;
        line-height: 1.6;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .got-preview-footer {
        display: grid;
        grid-template-columns: 1fr 1fr;
        border-top: 1px solid #1c1b18;
      }

      .got-preview-footer > div {
        padding: 13px 15px;
      }

      .got-preview-footer > div + div {
        border-left: 1px solid #1c1b18;
      }

      .got-preview-footer span {
        display: block;
        color: #403d36;
        font-size: 6px;
        font-weight: 900;
        letter-spacing: .18em;
      }

      .got-preview-footer strong {
        display: block;
        margin-top: 4px;
        color: #817a6d;
        font-size: 10px;
      }


      /* =====================================================
         FORGE BUTTON
      ===================================================== */

      .got-forge-button {
        position: relative;
        display: flex;
        width: 100%;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        min-height: 59px;
        border: 1px solid rgba(220,183,65,.7);
        border-radius: 15px;
        background:
          linear-gradient(
            135deg,
            #936e17,
            #d5b23e 45%,
            #a97e1b
          );
        color: #0e0c06;
        box-shadow:
          0 15px 50px rgba(201,162,39,.13),
          inset 0 1px rgba(255,255,255,.25);
        transition:
          transform .4s ease,
          box-shadow .4s ease,
          filter .4s ease;
      }

      .got-forge-button:hover:not(:disabled) {
        transform: translateY(-4px);
        filter: brightness(1.08);
        box-shadow:
          0 25px 75px rgba(201,162,39,.22),
          0 0 40px rgba(201,162,39,.08);
      }

      .got-forge-button:active:not(:disabled) {
        transform: translateY(-1px);
      }

      .got-forge-button:disabled {
        opacity: .55;
      }

      .got-button-content {
        position: relative;
        z-index: 2;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        font-size: 9px;
        font-weight: 950;
        text-transform: uppercase;
        letter-spacing: .2em;
      }

      .got-button-shine {
        position: absolute;
        inset: 0;
        width: 35%;
        transform: translateX(-160%) skewX(-20deg);
        background:
          linear-gradient(
            90deg,
            transparent,
            rgba(255,255,255,.3),
            transparent
          );
        animation:
          buttonShine 4s ease-in-out infinite;
      }

      .got-warning {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 7px;
        color: #3e3a33;
        font-family: Georgia, serif;
        font-size: 7px;
        text-align: center;
        letter-spacing: .05em;
      }

      .got-warning svg {
        flex-shrink: 0;
        color: #625127;
      }


      /* =====================================================
         ALERT
      ===================================================== */

      .got-alert {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        margin-bottom: 24px;
        padding: 15px 17px;
        border-radius: 15px;
        backdrop-filter: blur(15px);
      }

      .got-alert p {
        flex: 1;
        font-size: 10px;
        line-height: 1.7;
      }

      .got-alert button {
        opacity: .55;
        transition: opacity .3s ease;
      }

      .got-alert button:hover {
        opacity: 1;
      }

      .got-alert-error {
        border: 1px solid rgba(130,35,35,.35);
        background: rgba(60,10,10,.15);
        color: #d86b68;
      }

      .got-alert-success {
        border: 1px solid rgba(30,100,60,.35);
        background: rgba(10,50,30,.12);
        color: #63b780;
      }


      /* =====================================================
         FOOTER
      ===================================================== */

      .got-footer {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 55px 0 25px;
        color: #51452a;
      }

      .got-footer div {
        height: 1px;
        flex: 1;
        background:
          linear-gradient(
            90deg,
            transparent,
            #211e17
          );
      }

      .got-footer div:last-of-type {
        background:
          linear-gradient(
            90deg,
            #211e17,
            transparent
          );
      }

      .got-footer span {
        font-family: Georgia, serif;
        font-size: 7px;
        letter-spacing: .45em;
      }


      /* =====================================================
         ANIMATIONS
      ===================================================== */

      @keyframes gotSpin {
        from {
          transform: rotate(0deg);
        }

        to {
          transform: rotate(360deg);
        }
      }

      @keyframes gotSpinReverse {
        from {
          transform: rotate(360deg);
        }

        to {
          transform: rotate(0deg);
        }
      }

      @keyframes sigilPulse {
        0%, 100% {
          transform: scale(.97);
          box-shadow:
            inset 0 0 35px rgba(201,162,39,.05),
            0 0 35px rgba(201,162,39,.04);
        }

        50% {
          transform: scale(1.04);
          box-shadow:
            inset 0 0 40px rgba(201,162,39,.1),
            0 0 70px rgba(201,162,39,.13);
        }
      }

      @keyframes panelReveal {
        from {
          opacity: 0;
          transform: translateY(20px);
        }

        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes emberRise {
        0% {
          transform:
            translate3d(0,40px,0)
            scale(.5);
          opacity: 0;
        }

        15% {
          opacity: .65;
        }

        50% {
          transform:
            translate3d(20px,-100px,0)
            scale(1);
        }

        100% {
          transform:
            translate3d(-20px,-270px,0)
            scale(.2);
          opacity: 0;
        }
      }

      @keyframes fogMove {
        0%, 100% {
          transform: translateX(0);
        }

        50% {
          transform: translateX(35vw);
        }
      }

      @keyframes fogMoveReverse {
        0%, 100% {
          transform: translateX(0);
        }

        50% {
          transform: translateX(-30vw);
        }
      }

      @keyframes backgroundFloat {
        0%, 100% {
          transform: translate(0,0);
        }

        50% {
          transform: translate(100px,-50px);
        }
      }

      @keyframes backgroundFloatReverse {
        0%, 100% {
          transform: translate(0,0);
        }

        50% {
          transform: translate(-80px,40px);
        }
      }

      @keyframes buttonShine {
        0%, 55% {
          transform:
            translateX(-160%)
            skewX(-20deg);
        }

        75%, 100% {
          transform:
            translateX(420%)
            skewX(-20deg);
        }
      }

      @keyframes livePulse {
        0%, 100% {
          opacity: .5;
          transform: scale(.8);
        }

        50% {
          opacity: 1;
          transform: scale(1.3);
        }
      }


      /* =====================================================
         RESPONSIVE
      ===================================================== */

      @media (max-width: 1100px) {

        .got-royal-sigil {
          width: 190px;
          height: 190px;
        }

        .got-sigil-core {
          width: 85px;
          height: 85px;
        }

        .sigil-inner-ring {
          width: 60px;
          height: 60px;
        }

      }


      @media (max-width: 900px) {

        .got-hero-grid {
          display: block;
        }

        .got-royal-sigil {
          display: none;
        }

      }


      @media (max-width: 640px) {

        .got-create-page,
        .got-create-page * {
          cursor: auto !important;
        }

        .got-cursor-dot,
        .got-cursor-ring,
        .got-mouse-light {
          display: none;
        }

        .got-title {
          font-size: 2.9rem;
        }

        .got-description {
          font-size: 12px;
        }

        .got-hero-meta {
          display: grid;
          grid-template-columns: 1fr 1fr;
        }

        .got-hero-meta-item {
          min-width: 0;
        }

        .got-panel-header {
          padding: 18px;
        }

        .got-panel-body {
          padding: 18px;
        }

        .got-thumbnail {
          aspect-ratio: 16 / 11;
        }

        .got-preview-image {
          height: 220px;
        }

        .got-journey-panel {
          padding: 17px;
        }

      }


      @media (prefers-reduced-motion: reduce) {

        *,
        *::before,
        *::after {
          animation-duration: .01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: .01ms !important;
          scroll-behavior: auto !important;
        }

      }

    `}</style>
  );
}

export default CreateCourse;


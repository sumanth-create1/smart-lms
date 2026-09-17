import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Castle,
  Check,
  CheckCircle2,
  ChevronDown,
  Crown,
  Gem,
  ImagePlus,
  Info,
  LoaderCircle,
  MessageSquareText,
  Plus,
  Sparkles,
  Swords,
  Upload,
  WandSparkles,
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
  const [aiLoading, setAiLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [aiPrompt, setAiPrompt] = useState("");

  const [showAI, setShowAI] = useState(true);

  const [cursor, setCursor] = useState({
    x: -100,
    y: -100,
  });


  // ==========================================================
  // CURSOR
  // ==========================================================

  useEffect(() => {
    const moveCursor = (event) => {
      setCursor({
        x: event.clientX,
        y: event.clientY,
      });
    };

    window.addEventListener("mousemove", moveCursor);

    return () => {
      window.removeEventListener(
        "mousemove",
        moveCursor
      );
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
        "Thumbnail must be smaller than 5MB."
      );

      return;
    }


    setThumbnail(file);
    setPreview(
      URL.createObjectURL(file)
    );

    setError("");

    toast.success(
      "Course banner prepared for the realm."
    );
  };


  // ==========================================================
  // REMOVE THUMBNAIL
  // ==========================================================

  const removeThumbnail = () => {
    setThumbnail(null);
    setPreview("");

    toast("Thumbnail removed.", {
      icon: "🗑️",
    });
  };


  // ==========================================================
  // VALIDATE
  // ==========================================================

  const validateForm = () => {
    const title =
      formData.courseTitle.trim();

    const subtitle =
      formData.subTitle.trim();

    const description =
      formData.description.trim();


    if (!title) {
      return "Every realm needs a name.";
    }


    if (title.length < 5) {
      return "Course title must contain at least 5 characters.";
    }


    if (!subtitle) {
      return "Give your course a powerful subtitle.";
    }


    if (!description) {
      return "Describe what students will conquer.";
    }


    if (description.length < 20) {
      return "Course description should contain at least 20 characters.";
    }


    if (!formData.category) {
      return "Choose a course domain.";
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
      return "Upload a course banner before forging the course.";
    }


    return null;
  };


  // ==========================================================
  // AI COURSE SCRIBE
  // ==========================================================

  const generateWithAI = async () => {
    const prompt =
      aiPrompt.trim();


    if (!prompt) {
      toast.error(
        "Tell the AI Scribe what course you want to create."
      );

      return;
    }


    if (prompt.length < 5) {
      toast.error(
        "Give the Scribe a little more information."
      );

      return;
    }


    try {
      setAiLoading(true);


      toast.loading(
        "The Course Scribe is forging your course...",
        {
          id: "course-ai",
        }
      );


      /*
       * Expected backend endpoint:
       *
       * POST /ai/course-assist
       *
       * body:
       * {
       *   prompt,
       *   currentForm: formData
       * }
       *
       */


      const response = await api.post(
        "/ai/course-assist",
        {
          prompt,
          currentForm: formData,
        }
      );


      const generated =
        response.data?.data ||
        response.data?.course ||
        response.data;


      if (!generated) {
        throw new Error(
          "AI returned an empty response."
        );
      }


      setFormData((previous) => ({
        ...previous,

        courseTitle:
          generated.courseTitle ||
          previous.courseTitle,

        subTitle:
          generated.subTitle ||
          previous.subTitle,

        description:
          generated.description ||
          previous.description,

        category:
          generated.category ||
          previous.category,

        courseLevel:
          generated.courseLevel ||
          previous.courseLevel,

        coursePrice:
          generated.coursePrice !== undefined &&
          generated.coursePrice !== null
            ? String(
                generated.coursePrice
              )
            : previous.coursePrice,
      }));


      toast.success(
        "The Course Scribe has forged your course details.",
        {
          id: "course-ai",
          duration: 4000,
        }
      );


      setAiPrompt("");

    } catch (error) {
      console.error(
        "AI course assistant error:",
        error
      );


      toast.error(
        error.response?.data?.message ||
          "The Course Scribe could not complete the task.",
        {
          id: "course-ai",
          duration: 4500,
        }
      );

    } finally {
      setAiLoading(false);
    }
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

      toast.error(
        validationError
      );

      return;
    }


    try {
      setLoading(true);


      toast.loading(
        "Forging your course...",
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
        "Your learning realm has been forged."
      );


      toast.success(
        "Course forged successfully! ⚔️",
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
      }, 1000);

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


      toast.error(
        message,
        {
          id: "create-course",
          duration: 4500,
        }
      );

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
          BACKGROUND
      ==================================================== */}

      <FantasyBackground />


      {/* ====================================================
          CURSOR
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
          PAGE
      ==================================================== */}

      <div className="relative z-10 mx-auto max-w-[1450px] px-4 py-6 sm:px-6 lg:px-8 lg:py-10">


        {/* ==================================================
            HEADER
        ================================================== */}

        <header className="mb-8">

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

            <ArrowLeft size={16} />

            Return to Course Hall

          </button>


          <div className="mt-7 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

            <div>

              <div className="got-eyebrow">

                <Crown size={13} />

                INSTRUCTOR COUNCIL

              </div>


              <h1 className="got-title">

                Forge a New

                <span>
                  Learning Realm
                </span>

              </h1>


              <p className="got-description">

                Create a course worthy of your
                students. Or let the AI Course
                Scribe shape the first draft for you.

              </p>

            </div>


            <div className="got-header-sigil">

              <div className="got-sigil-ring ring-one" />

              <div className="got-sigil-ring ring-two" />

              <div className="got-sigil-center">

                <Castle size={38} />

              </div>

            </div>

          </div>

        </header>


        {/* ==================================================
            AI COURSE SCRIBE
        ================================================== */}

        <section className="got-ai-panel mb-7">

          <div className="got-ai-glow" />

          <div className="relative z-10">

            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

              <div className="flex items-start gap-4">

                <div className="got-ai-icon">

                  <WandSparkles size={23} />

                </div>


                <div>

                  <div className="flex flex-wrap items-center gap-3">

                    <h2 className="font-serif text-xl font-semibold text-[#ead98a]">

                      AI Course Scribe

                    </h2>


                    <span className="got-ai-badge">

                      <Sparkles size={10} />

                      GEMINI POWERED

                    </span>

                  </div>


                  <p className="mt-2 max-w-2xl text-xs leading-6 text-stone-500 sm:text-sm">

                    Don't waste time filling every field.
                    Describe your course idea in plain
                    language and let the Scribe prepare
                    the first draft.

                  </p>

                </div>

              </div>


              <button
                type="button"
                onClick={() =>
                  setShowAI(
                    (previous) =>
                      !previous
                  )
                }
                className="got-collapse-button"
              >

                {showAI
                  ? "Collapse"
                  : "Open Scribe"}

                <ChevronDown
                  size={15}
                  className={
                    showAI
                      ? "rotate-180 transition-transform"
                      : "transition-transform"
                  }
                />

              </button>

            </div>


            {showAI && (

              <div className="mt-6">

                <div className="got-ai-input-wrap">

                  <MessageSquareText
                    size={17}
                    className="shrink-0 text-[#806b30]"
                  />


                  <input
                    type="text"
                    value={aiPrompt}
                    onChange={(event) =>
                      setAiPrompt(
                        event.target.value
                      )
                    }
                    onKeyDown={(event) => {
                      if (
                        event.key ===
                        "Enter"
                      ) {
                        generateWithAI();
                      }
                    }}
                    placeholder="Example: Create a beginner MERN Stack course for students who want to build real-world web applications..."
                    disabled={aiLoading}
                    className="got-ai-input"
                  />


                  <button
                    type="button"
                    onClick={
                      generateWithAI
                    }
                    disabled={
                      aiLoading ||
                      !aiPrompt.trim()
                    }
                    className="got-ai-generate"
                  >

                    {aiLoading ? (
                      <>
                        <LoaderCircle
                          size={16}
                          className="animate-spin"
                        />

                        Forging...

                      </>
                    ) : (
                      <>
                        <WandSparkles
                          size={16}
                        />

                        Generate

                      </>
                    )}

                  </button>

                </div>


                <div className="mt-3 flex flex-wrap gap-2">

                  <SuggestionChip
                    text="MERN Stack for beginners"
                    onClick={() =>
                      setAiPrompt(
                        "Create a beginner MERN Stack course focused on building real-world web applications."
                      )
                    }
                  />

                  <SuggestionChip
                    text="JavaScript from zero"
                    onClick={() =>
                      setAiPrompt(
                        "Create a JavaScript course from zero to advanced with practical projects."
                      )
                    }
                  />

                  <SuggestionChip
                    text="React frontend mastery"
                    onClick={() =>
                      setAiPrompt(
                        "Create a practical React frontend development course for freshers."
                      )
                    }
                  />

                </div>

              </div>

            )}

          </div>

        </section>


        {/* ==================================================
            ERROR / SUCCESS
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
          className="grid gap-7 xl:grid-cols-[minmax(0,1fr)_390px]"
        >


          {/* =================================================
              LEFT
          ================================================= */}

          <div className="space-y-7">


            {/* =================================================
                COURSE IDENTITY
            ================================================= */}

            <FantasyPanel
              number="01"
              icon={<ScrollIcon />}
              eyebrow="THE IDENTITY"
              title="Name Your Realm"
              description="Give students a reason to enter."
            >

              <div className="space-y-6">

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

                    <span className="text-[9px] uppercase tracking-wider text-stone-700">
                      {formData.description.length}
                      {" "}
                      characters
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
                    placeholder="Explain what students will learn, what they will build and where this course will take them..."
                    rows={8}
                    required
                    disabled={loading}
                    className="got-textarea"
                  />

                </div>

              </div>

            </FantasyPanel>


            {/* =================================================
                COURSE DETAILS
            ================================================= */}

            <FantasyPanel
              number="02"
              icon={<Gem size={18} />}
              eyebrow="THE DOMAIN"
              title="Choose Your Territory"
              description="Define the level and value of your course."
            >

              <div className="grid gap-5 sm:grid-cols-2">

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


              <div className="mt-5">

                <label className="got-label">
                  Course Price
                </label>


                <div className="got-price-input">

                  <span>
                    ₹
                  </span>

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

                  <span className="got-price-label">
                    COURSE VALUE
                  </span>

                </div>


                <p className="mt-2 flex items-center gap-1.5 text-[9px] leading-5 text-stone-700">

                  <Info size={11} />

                  You can change pricing later
                  from course management.

                </p>

              </div>

            </FantasyPanel>


            {/* =================================================
                CREATION FLOW
            ================================================= */}

            <div className="got-flow-panel">

              <div className="flex items-center gap-3">

                <Swords
                  size={17}
                  className="text-[#806b30]"
                />

                <div>

                  <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-[#806b30]">
                    AFTER CREATION
                  </p>

                  <h3 className="mt-1 font-serif text-base font-semibold text-stone-300">
                    Your journey continues
                  </h3>

                </div>

              </div>


              <div className="mt-5 grid gap-3 sm:grid-cols-3">

                <FlowStep
                  number="01"
                  title="Course"
                  description="Realm created"
                  active
                />

                <FlowStep
                  number="02"
                  title="Modules"
                  description="Structure lessons"
                />

                <FlowStep
                  number="03"
                  title="AI Quiz"
                  description="Test your students"
                />

              </div>

            </div>

          </div>


          {/* =================================================
              RIGHT SIDEBAR
          ================================================= */}

          <aside className="space-y-7">


            {/* =================================================
                THUMBNAIL
            ================================================= */}

            <FantasyPanel
              number="03"
              icon={<ImagePlus size={18} />}
              eyebrow="THE BANNER"
              title="Choose Your Sigil"
              description="Your course's visual identity."
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
                        alt="Course thumbnail preview"
                      />

                      <div className="got-thumbnail-overlay">

                        <div className="got-upload-circle">

                          <Upload
                            size={19}
                          />

                        </div>

                        <span>
                          Change Banner
                        </span>

                      </div>

                    </>

                  ) : (

                    <div className="flex flex-col items-center justify-center text-center">

                      <div className="got-upload-icon">

                        <ImagePlus
                          size={26}
                        />

                      </div>


                      <p className="mt-4 font-serif text-sm font-semibold text-stone-300">
                        Choose Your Banner
                      </p>


                      <p className="mt-2 max-w-[200px] text-[9px] leading-5 text-stone-700">
                        JPG, PNG or WEBP
                        <br />
                        Maximum 5MB
                      </p>


                      <span className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[#c9a227]/20 bg-[#c9a227]/[0.04] px-3 py-2 text-[9px] font-bold uppercase tracking-wider text-[#927a32]">
                        <Upload size={12} />
                        Browse Images
                      </span>

                    </div>

                  )}

                </div>

              </label>


              {thumbnail && (

                <div className="got-file-card">

                  <div className="min-w-0">

                    <p className="truncate text-[10px] font-semibold text-stone-400">
                      {thumbnail.name}
                    </p>

                    <p className="mt-1 text-[8px] uppercase tracking-wider text-stone-700">
                      {(
                        thumbnail.size /
                        1024 /
                        1024
                      ).toFixed(2)}
                      {" "}
                      MB
                    </p>

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

              <div className="got-preview-image">

                {preview ? (

                  <img
                    src={preview}
                    alt="Course preview"
                  />

                ) : (

                  <div className="got-preview-placeholder">

                    <Castle size={32} />

                    <span>
                      YOUR REALM
                    </span>

                  </div>

                )}


                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />


                <div className="absolute bottom-4 left-4 right-4">

                  <span className="got-preview-category">

                    {formData.category ||
                      "COURSE"}

                  </span>


                  <h3 className="mt-2 line-clamp-2 font-serif text-lg font-semibold text-white">

                    {formData.courseTitle ||
                      "Your Course Title"}

                  </h3>

                </div>

              </div>


              <div className="p-4">

                <div className="flex items-center justify-between">

                  <span className="text-[8px] uppercase tracking-[0.25em] text-stone-700">
                    LIVE PREVIEW
                  </span>


                  <span className="flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-wider text-emerald-500">

                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />

                    LIVE

                  </span>

                </div>

              </div>

            </div>


            {/* =================================================
                CREATE BUTTON
            ================================================= */}

            <button
              type="submit"
              disabled={loading}
              className="got-forge-button"
            >

              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />


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

                  Forge Course

                  <ArrowRight
                    size={16}
                  />

                </>

              )}

            </button>


            <p className="text-center text-[8px] uppercase tracking-[0.2em] text-stone-800">
              The realm will be created before
              its banner is uploaded.
            </p>

          </aside>

        </form>


        {/* ==================================================
            FOOTER
        ================================================== */}

        <footer className="flex items-center justify-center gap-3 py-10">

          <div className="h-px w-16 bg-gradient-to-r from-transparent to-stone-800" />

          <Gem
            size={10}
            className="text-[#6d5c2d]"
          />

          <span className="font-serif text-[8px] uppercase tracking-[0.45em] text-stone-800">
            Build Your Legacy
          </span>

          <Gem
            size={10}
            className="text-[#6d5c2d]"
          />

          <div className="h-px w-16 bg-gradient-to-l from-transparent to-stone-800" />

        </footer>

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
    <section className="got-panel group">

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

          <h2 className="mt-1 font-serif text-xl font-semibold text-stone-200">
            {title}
          </h2>

          <p className="mt-1 text-[10px] leading-5 text-stone-700">
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


      <input
        id={name}
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={false}
        required={required}
        className="got-input"
      />

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


      <div className="relative">

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
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-stone-700"
        />

      </div>

    </div>
  );
}


// ============================================================
// SUGGESTION CHIP
// ============================================================

function SuggestionChip({
  text,
  onClick,
}) {

  return (
    <button
      type="button"
      onClick={onClick}
      className="got-suggestion"
    >

      <Sparkles size={10} />

      {text}

    </button>
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
      className={`mb-6 flex items-start gap-3 rounded-2xl border px-4 py-4 ${
        success
          ? "border-emerald-900/40 bg-emerald-950/10 text-emerald-400"
          : "border-red-900/40 bg-red-950/10 text-red-400"
      }`}
    >

      {success ? (
        <CheckCircle2
          size={18}
        />
      ) : (
        <Info size={18} />
      )}


      <p className="flex-1 text-xs leading-5">
        {message}
      </p>


      {onClose && (

        <button
          type="button"
          onClick={onClose}
          className="opacity-50 transition hover:opacity-100"
        >
          <X size={15} />
        </button>

      )}

    </div>
  );
}


// ============================================================
// FLOW STEP
// ============================================================

function FlowStep({
  number,
  title,
  description,
  active = false,
}) {

  return (
    <div
      className={`rounded-xl border p-4 ${
        active
          ? "border-[#c9a227]/20 bg-[#c9a227]/[0.035]"
          : "border-stone-800 bg-black/10"
      }`}
    >

      <div className="flex items-center justify-between">

        <span className="font-serif text-lg text-stone-800">
          {number}
        </span>


        {active && (

          <Check
            size={13}
            className="text-[#d4af37]"
          />

        )}

      </div>


      <p className="mt-3 text-xs font-semibold text-stone-400">
        {title}
      </p>

      <p className="mt-1 text-[8px] uppercase tracking-wider text-stone-700">
        {description}
      </p>

    </div>
  );
}


// ============================================================
// SCROLL ICON
// ============================================================

function ScrollIcon() {
  return (
    <div className="relative h-5 w-5">

      <div className="absolute left-1 top-0 h-4 w-3 rounded-sm border border-current" />

      <div className="absolute left-0 top-1 h-4 w-3 rounded-sm border border-current opacity-40" />

    </div>
  );
}


// ============================================================
// BACKGROUND
// ============================================================

function FantasyBackground() {

  const particles =
    Array.from(
      { length: 35 },
      (_, index) => index
    );


  return (
    <>

      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_50%_-15%,rgba(212,175,55,0.10),transparent_32%),radial-gradient(circle_at_100%_45%,rgba(100,10,10,0.12),transparent_28%),radial-gradient(circle_at_0%_70%,rgba(35,45,60,0.08),transparent_30%)]" />


      <div className="pointer-events-none fixed -left-40 top-20 h-[500px] w-[500px] animate-pulse rounded-full bg-[#c9a227]/[0.025] blur-[110px]" />


      <div className="pointer-events-none fixed -right-40 bottom-20 h-[500px] w-[500px] animate-pulse rounded-full bg-red-950/10 blur-[110px]" />


      {/* grid */}

      <div className="pointer-events-none fixed inset-0 opacity-[0.025] [background-image:linear-gradient(rgba(212,175,55,0.7)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,55,0.7)_1px,transparent_1px)] [background-size:60px_60px]" />


      {/* particles */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        {particles.map((particle) => (

          <span
            key={particle}
            className="got-particle"
            style={{
              left: `${(particle * 31) % 100}%`,
              top: `${(particle * 43) % 100}%`,
              animationDelay:
                `${-(particle % 9)}s`,
              animationDuration:
                `${7 + (particle % 7)}s`,
            }}
          />

        ))}

      </div>


      {/* fog */}

      <div className="got-fog got-fog-one" />

      <div className="got-fog got-fog-two" />


      {/* vignette */}

      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.55)_100%)]" />

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
         BASE
      ===================================================== */

      .got-create-page {
        min-height: 100vh;
        background: #030303;
        color: #d6d3d1;
        overflow-x: hidden;
      }


      .got-create-page,
      .got-create-page * {
        cursor: none !important;
      }


      /* =====================================================
         CURSOR
      ===================================================== */

      .got-cursor-dot {
        position: fixed;
        z-index: 9999;
        width: 7px;
        height: 7px;
        margin-left: -3.5px;
        margin-top: -3.5px;
        border-radius: 999px;
        background: #e7ce67;
        box-shadow:
          0 0 12px rgba(212,175,55,.9),
          0 0 30px rgba(212,175,55,.3);
        pointer-events: none;
      }


      .got-cursor-ring {
        position: fixed;
        z-index: 9998;
        width: 38px;
        height: 38px;
        margin-left: -19px;
        margin-top: -19px;
        border-radius: 999px;
        border: 1px solid rgba(212,175,55,.25);
        pointer-events: none;
        transition:
          left .11s ease-out,
          top .11s ease-out;
      }


      /* =====================================================
         BACK BUTTON
      ===================================================== */

      .got-back-button {
        display: inline-flex;
        align-items: center;
        gap: 9px;
        padding: 9px 13px;
        border: 1px solid #24231f;
        border-radius: 10px;
        background: rgba(255,255,255,.015);
        color: #68645c;
        font-size: 10px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: .15em;
        transition: all .35s ease;
      }


      .got-back-button:hover {
        color: #d4af37;
        border-color: rgba(201,162,39,.3);
        background: rgba(201,162,39,.04);
        transform: translateX(-4px);
      }


      /* =====================================================
         HEADER
      ===================================================== */

      .got-eyebrow {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 7px 12px;
        border: 1px solid rgba(201,162,39,.18);
        border-radius: 999px;
        background: rgba(201,162,39,.035);
        color: #927b35;
        font-size: 8px;
        font-weight: 800;
        letter-spacing: .3em;
      }


      .got-title {
        margin-top: 18px;
        font-family: Georgia, 'Times New Roman', serif;
        font-size: clamp(2.5rem, 6vw, 5rem);
        line-height: 1;
        font-weight: 600;
        letter-spacing: -.035em;
        color: #ebe7dc;
      }


      .got-title span {
        display: block;
        margin-top: 7px;
        color: #d4af37;
        text-shadow:
          0 0 30px rgba(212,175,55,.08);
      }


      .got-description {
        max-width: 680px;
        margin-top: 22px;
        color: #65615a;
        font-size: 13px;
        line-height: 2;
      }


      /* =====================================================
         SIGIL
      ===================================================== */

      .got-header-sigil {
        position: relative;
        width: 150px;
        height: 150px;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 30px;
      }


      .got-sigil-ring {
        position: absolute;
        inset: 0;
        border-radius: 999px;
        border: 1px solid rgba(201,162,39,.13);
      }


      .ring-one {
        animation: gotSpin 24s linear infinite;
        border-style: dashed;
      }


      .ring-two {
        inset: 18px;
        animation: gotSpinReverse 17s linear infinite;
        border-color: rgba(201,162,39,.22);
        border-top-color: rgba(201,162,39,.7);
      }


      .got-sigil-center {
        width: 82px;
        height: 82px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 999px;
        border: 1px solid rgba(212,175,55,.28);
        color: #d4af37;
        background: #0b0a07;
        box-shadow:
          inset 0 0 35px rgba(201,162,39,.04),
          0 0 50px rgba(201,162,39,.08);
        animation: sigilPulse 5s ease-in-out infinite;
      }


      /* =====================================================
         AI PANEL
      ===================================================== */

      .got-ai-panel {
        position: relative;
        overflow: hidden;
        padding: 25px;
        border-radius: 23px;
        border: 1px solid rgba(201,162,39,.2);
        background:
          linear-gradient(
            135deg,
            rgba(201,162,39,.045),
            rgba(10,10,9,.96) 45%,
            rgba(70,10,10,.08)
          );
        box-shadow:
          0 25px 90px rgba(0,0,0,.4);
      }


      .got-ai-panel::before {
        content: "";
        position: absolute;
        top: 0;
        left: -30%;
        width: 25%;
        height: 100%;
        transform: skewX(-20deg);
        background: linear-gradient(
          90deg,
          transparent,
          rgba(212,175,55,.08),
          transparent
        );
        transition: transform 1.2s ease;
      }


      .got-ai-panel:hover::before {
        transform: translateX(520%) skewX(-20deg);
      }


      .got-ai-glow {
        position: absolute;
        right: -100px;
        top: -120px;
        width: 350px;
        height: 350px;
        border-radius: 50%;
        background: rgba(201,162,39,.045);
        filter: blur(80px);
        animation: glowFloat 8s ease-in-out infinite;
      }


      .got-ai-icon {
        width: 50px;
        height: 50px;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 15px;
        border: 1px solid rgba(201,162,39,.28);
        background: rgba(201,162,39,.05);
        color: #d4af37;
        box-shadow:
          0 0 30px rgba(201,162,39,.07);
        animation: aiFloat 4s ease-in-out infinite;
      }


      .got-ai-badge {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        padding: 5px 8px;
        border-radius: 999px;
        border: 1px solid rgba(201,162,39,.15);
        background: rgba(201,162,39,.025);
        color: #806b30;
        font-size: 7px;
        font-weight: 800;
        letter-spacing: .18em;
      }


      .got-collapse-button {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        color: #625d54;
        font-size: 9px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: .15em;
        transition: color .3s ease;
      }


      .got-collapse-button:hover {
        color: #d4af37;
      }


      .got-ai-input-wrap {
        display: flex;
        align-items: center;
        gap: 12px;
        min-height: 58px;
        padding: 7px 8px 7px 17px;
        border: 1px solid #29261d;
        border-radius: 15px;
        background: rgba(0,0,0,.38);
        transition: all .35s ease;
      }


      .got-ai-input-wrap:focus-within {
        border-color: rgba(201,162,39,.45);
        box-shadow:
          0 0 0 4px rgba(201,162,39,.03),
          0 0 40px rgba(201,162,39,.05);
      }


      .got-ai-input {
        min-width: 0;
        flex: 1;
        border: 0;
        outline: 0;
        background: transparent;
        color: #d6d3d1;
        font-size: 12px;
      }


      .got-ai-input::placeholder {
        color: #4c4942;
      }


      .got-ai-generate {
        display: inline-flex;
        flex-shrink: 0;
        align-items: center;
        gap: 8px;
        padding: 12px 17px;
        border-radius: 11px;
        border: 1px solid rgba(212,175,55,.5);
        background: #b99627;
        color: #100e08;
        font-size: 9px;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: .12em;
        transition: all .35s ease;
      }


      .got-ai-generate:hover:not(:disabled) {
        transform: translateY(-2px);
        background: #d4af37;
        box-shadow:
          0 10px 35px rgba(201,162,39,.18);
      }


      .got-ai-generate:disabled {
        opacity: .4;
      }


      .got-suggestion {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 7px 10px;
        border: 1px solid #24231f;
        border-radius: 999px;
        background: rgba(255,255,255,.01);
        color: #59554e;
        font-size: 8px;
        transition: all .3s ease;
      }


      .got-suggestion:hover {
        border-color: rgba(201,162,39,.25);
        background: rgba(201,162,39,.04);
        color: #a58a39;
        transform: translateY(-2px);
      }


      /* =====================================================
         PANEL
      ===================================================== */

      .got-panel {
        position: relative;
        overflow: hidden;
        border-radius: 24px;
        border: 1px solid #201f1c;
        background: rgba(9,9,8,.91);
        box-shadow:
          0 25px 80px rgba(0,0,0,.32);
        backdrop-filter: blur(20px);
        animation: panelReveal .7s ease-out both;
        transition:
          border-color .45s ease,
          transform .45s ease,
          box-shadow .45s ease;
      }


      .got-panel:hover {
        border-color: rgba(201,162,39,.16);
        transform: translateY(-3px);
        box-shadow:
          0 30px 90px rgba(0,0,0,.42);
      }


      .got-panel-top-line {
        position: absolute;
        top: 0;
        left: 50%;
        width: 25%;
        height: 1px;
        transform: translateX(-50%);
        background: linear-gradient(
          90deg,
          transparent,
          rgba(212,175,55,.5),
          transparent
        );
        transition: width .6s ease;
      }


      .got-panel:hover .got-panel-top-line {
        width: 60%;
      }


      .got-panel-header {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 22px 23px;
        border-bottom: 1px solid #1b1b18;
      }


      .got-panel-number {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 30px;
        height: 30px;
        border-radius: 9px;
        border: 1px solid #25231d;
        color: #49443a;
        font-family: Georgia, serif;
        font-size: 10px;
      }


      .got-panel-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-radius: 11px;
        border: 1px solid rgba(201,162,39,.16);
        background: rgba(201,162,39,.035);
        color: #a78a36;
        transition: all .4s ease;
      }


      .got-panel:hover .got-panel-icon {
        color: #d4af37;
        border-color: rgba(201,162,39,.35);
        transform: scale(1.08) rotate(3deg);
        box-shadow:
          0 0 25px rgba(201,162,39,.08);
      }


      .got-panel-eyebrow {
        color: #806b30;
        font-size: 7px;
        font-weight: 800;
        letter-spacing: .3em;
      }


      .got-panel-body {
        padding: 24px;
      }


      /* =====================================================
         LABELS / INPUTS
      ===================================================== */

      .got-label {
        display: block;
        margin-bottom: 9px;
        color: #777168;
        font-size: 9px;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: .17em;
      }


      .got-input,
      .got-textarea,
      .got-select {
        width: 100%;
        border: 1px solid #272621;
        outline: none;
        border-radius: 12px;
        background: #0c0c0b;
        color: #d4d0c8;
        font-size: 12px;
        transition: all .35s ease;
      }


      .got-input {
        padding: 14px 15px;
      }


      .got-textarea {
        resize: vertical;
        min-height: 150px;
        padding: 15px;
        line-height: 1.8;
      }


      .got-select {
        appearance: none;
        padding: 14px 42px 14px 15px;
      }


      .got-input::placeholder,
      .got-textarea::placeholder {
        color: #403e38;
      }


      .got-input:focus,
      .got-textarea:focus,
      .got-select:focus {
        border-color: rgba(201,162,39,.45);
        background: #0e0e0c;
        box-shadow:
          0 0 0 4px rgba(201,162,39,.025),
          0 0 35px rgba(201,162,39,.035);
      }


      .got-select option {
        background: #0b0b0a;
        color: #d4d0c8;
      }


      /* =====================================================
         PRICE
      ===================================================== */

      .got-price-input {
        display: flex;
        align-items: center;
        border: 1px solid #272621;
        border-radius: 12px;
        background: #0c0c0b;
        overflow: hidden;
        transition: all .35s ease;
      }


      .got-price-input:focus-within {
        border-color: rgba(201,162,39,.45);
        box-shadow:
          0 0 0 4px rgba(201,162,39,.025);
      }


      .got-price-input > span:first-child {
        padding-left: 15px;
        color: #a58a39;
        font-family: Georgia, serif;
      }


      .got-price-input input {
        width: 100%;
        padding: 14px 12px;
        border: 0;
        outline: 0;
        background: transparent;
        color: #d4d0c8;
        font-size: 12px;
      }


      .got-price-label {
        padding-right: 15px;
        color: #403d36;
        font-size: 7px;
        font-weight: 800;
        letter-spacing: .16em;
        white-space: nowrap;
      }


      /* =====================================================
         THUMBNAIL
      ===================================================== */

      .got-thumbnail {
        position: relative;
        aspect-ratio: 16 / 10;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        border: 1px dashed #37342b;
        border-radius: 17px;
        background:
          radial-gradient(
            circle at center,
            rgba(201,162,39,.04),
            transparent 65%
          ),
          #090908;
        transition: all .45s ease;
      }


      .got-thumbnail:hover {
        border-color: rgba(201,162,39,.45);
        background-color: #0c0c0a;
        box-shadow:
          inset 0 0 50px rgba(201,162,39,.03);
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


      .got-thumbnail-overlay {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 9px;
        background: rgba(0,0,0,.55);
        color: #d4af37;
        opacity: 0;
        transition: opacity .4s ease;
        font-size: 9px;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: .15em;
      }


      .got-thumbnail:hover .got-thumbnail-overlay {
        opacity: 1;
      }


      .got-upload-circle {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 42px;
        height: 42px;
        border: 1px solid rgba(212,175,55,.4);
        border-radius: 50%;
        background: rgba(0,0,0,.6);
      }


      .got-upload-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 58px;
        height: 58px;
        border-radius: 16px;
        border: 1px solid rgba(201,162,39,.18);
        background: rgba(201,162,39,.035);
        color: #9b8133;
        transition: all .4s ease;
      }


      .got-thumbnail:hover .got-upload-icon {
        transform: translateY(-4px) scale(1.05);
        color: #d4af37;
      }


      .got-file-card {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-top: 12px;
        padding: 11px 12px;
        border: 1px solid #211f1b;
        border-radius: 11px;
        background: #0b0b0a;
      }


      .got-remove-button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 29px;
        height: 29px;
        flex-shrink: 0;
        border-radius: 8px;
        color: #5d5951;
        transition: all .3s ease;
      }


      .got-remove-button:hover {
        background: rgba(100,10,10,.2);
        color: #e45c5c;
      }


      /* =====================================================
         PREVIEW
      ===================================================== */

      .got-preview-card {
        overflow: hidden;
        border-radius: 20px;
        border: 1px solid #24231f;
        background: #090909;
        box-shadow:
          0 20px 60px rgba(0,0,0,.35);
        transition: all .5s ease;
      }


      .got-preview-card:hover {
        transform: translateY(-5px);
        border-color: rgba(201,162,39,.18);
        box-shadow:
          0 30px 80px rgba(0,0,0,.5);
      }


      .got-preview-image {
        position: relative;
        height: 210px;
        overflow: hidden;
        background:
          radial-gradient(
            circle at center,
            rgba(201,162,39,.08),
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


      .got-preview-placeholder {
        display: flex;
        height: 100%;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 12px;
        color: #4b4330;
      }


      .got-preview-placeholder span {
        font-family: Georgia, serif;
        font-size: 9px;
        letter-spacing: .4em;
      }


      .got-preview-category {
        display: inline-flex;
        padding: 5px 8px;
        border: 1px solid rgba(201,162,39,.25);
        border-radius: 999px;
        background: rgba(0,0,0,.45);
        color: #d4af37;
        font-size: 7px;
        font-weight: 800;
        letter-spacing: .15em;
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
        gap: 10px;
        overflow: hidden;
        padding: 17px 20px;
        border: 1px solid rgba(212,175,55,.6);
        border-radius: 14px;
        background:
          linear-gradient(
            135deg,
            #b18e25,
            #d4af37,
            #a27d18
          );
        color: #100e08;
        font-size: 10px;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: .18em;
        box-shadow:
          0 15px 45px rgba(201,162,39,.12);
        transition: all .4s ease;
      }


      .got-forge-button:hover:not(:disabled) {
        transform: translateY(-3px);
        box-shadow:
          0 22px 65px rgba(201,162,39,.2);
      }


      .got-forge-button:active:not(:disabled) {
        transform: translateY(0);
      }


      .got-forge-button:disabled {
        opacity: .55;
      }


      /* =====================================================
         FLOW
      ===================================================== */

      .got-flow-panel {
        padding: 20px;
        border-radius: 20px;
        border: 1px solid #201f1c;
        background: rgba(8,8,7,.65);
      }


      /* =====================================================
         PARTICLES
      ===================================================== */

      .got-particle {
        position: absolute;
        width: 2px;
        height: 2px;
        border-radius: 50%;
        background: #d4af37;
        box-shadow:
          0 0 9px rgba(212,175,55,.55);
        opacity: .25;
        animation:
          particleFloat
          9s
          ease-in-out
          infinite;
      }


      /* =====================================================
         FOG
      ===================================================== */

      .got-fog {
        position: fixed;
        z-index: 1;
        pointer-events: none;
        width: 65vw;
        height: 180px;
        border-radius: 50%;
        background: rgba(120,120,120,.025);
        filter: blur(60px);
      }


      .got-fog-one {
        left: -20%;
        bottom: 15%;
        animation:
          fogMove
          24s
          ease-in-out
          infinite;
      }


      .got-fog-two {
        right: -20%;
        top: 30%;
        animation:
          fogMoveReverse
          30s
          ease-in-out
          infinite;
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
          transform: scale(.96);
          box-shadow:
            inset 0 0 35px rgba(201,162,39,.04),
            0 0 35px rgba(201,162,39,.04);
        }

        50% {
          transform: scale(1.04);
          box-shadow:
            inset 0 0 35px rgba(201,162,39,.08),
            0 0 60px rgba(201,162,39,.12);
        }
      }


      @keyframes panelReveal {
        from {
          opacity: 0;
          transform: translateY(18px);
        }

        to {
          opacity: 1;
          transform: translateY(0);
        }
      }


      @keyframes particleFloat {
        0% {
          transform:
            translate3d(0, 25px, 0)
            scale(.5);
          opacity: 0;
        }

        20% {
          opacity: .45;
        }

        50% {
          transform:
            translate3d(20px, -80px, 0)
            scale(1);
        }

        80% {
          opacity: .15;
        }

        100% {
          transform:
            translate3d(-15px, -170px, 0)
            scale(.4);
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


      @keyframes glowFloat {
        0%, 100% {
          transform: translate(0, 0) scale(1);
        }

        50% {
          transform: translate(-30px, 25px) scale(1.12);
        }
      }


      @keyframes aiFloat {
        0%, 100% {
          transform: translateY(0);
        }

        50% {
          transform: translateY(-5px);
        }
      }


      /* =====================================================
         RESPONSIVE
      ===================================================== */

      @media (max-width: 1024px) {

        .got-header-sigil {
          display: none;
        }

      }


      @media (max-width: 640px) {

        .got-create-page,
        .got-create-page * {
          cursor: auto !important;
        }


        .got-cursor-dot,
        .got-cursor-ring {
          display: none;
        }


        .got-ai-input-wrap {
          align-items: stretch;
          flex-direction: column;
          padding: 13px;
        }


        .got-ai-input {
          min-height: 40px;
        }


        .got-ai-generate {
          width: 100%;
          justify-content: center;
        }


        .got-title {
          font-size: 2.6rem;
        }


        .got-panel-body {
          padding: 18px;
        }


        .got-panel-header {
          padding: 18px;
        }

      }


      /* =====================================================
         REDUCED MOTION
      ===================================================== */

      @media (prefers-reduced-motion: reduce) {

        *,
        *::before,
        *::after {
          animation-duration: .01ms !important;
          animation-iteration-count: 1 !important;
          scroll-behavior: auto !important;
          transition-duration: .01ms !important;
        }

      }

    `}</style>
  );
}


export default CreateCourse;
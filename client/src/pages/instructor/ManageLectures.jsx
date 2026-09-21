import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  BookOpen,
  Check,
  Edit3,
  Film,
  FileText,
  LoaderCircle,
  Plus,
  Trash2,
  Upload,
  X,
  PlayCircle,
  Save,
  Crown,
  Sparkles,
  Flame,
  Shield,
  Gem,
  ScrollText,
  Eye,
  Sword,
  ChevronRight,
} from "lucide-react";

import toast from "react-hot-toast";
import api from "../../services/api";

const EMBERS = Array.from({ length: 22 }, (_, index) => ({
  id: index,
  left: `${(index * 37) % 100}%`,
  delay: `${(index * 0.73) % 8}s`,
  duration: `${6 + ((index * 1.17) % 7)}s`,
  size: `${2 + (index % 3)}px`,
}));

function ManageLectures() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const cursorRef = useRef(null);
  const cursorDotRef = useRef(null);

  const [course, setCourse] = useState(null);
  const [lectures, setLectures] = useState([]);

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  /* =====================================================
     CREATE STATE
  ===================================================== */

  const [showCreate, setShowCreate] = useState(false);

  const [lectureTitle, setLectureTitle] = useState("");
  const [lectureContent, setLectureContent] = useState("");

  /* =====================================================
     EDIT STATE
  ===================================================== */

  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingContent, setEditingContent] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  /* =====================================================
     OTHER STATES
  ===================================================== */

  const [uploadingId, setUploadingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [previewLoadingId, setPreviewLoadingId] = useState(null);

  /* =====================================================
     PREMIUM CURSOR
  ===================================================== */

  useEffect(() => {
    const handlePointerMove = (event) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(
          ${event.clientX}px,
          ${event.clientY}px,
          0
        )`;
      }

      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(
          ${event.clientX}px,
          ${event.clientY}px,
          0
        )`;
      }
    };

    window.addEventListener("pointermove", handlePointerMove);

    return () => {
      window.removeEventListener(
        "pointermove",
        handlePointerMove
      );
    };
  }, []);

  /* =====================================================
     FETCH COURSE
  ===================================================== */

  const fetchCourse = async () => {
    try {
      const response = await api.get(`/course/${courseId}`);

      if (response.data?.success) {
        setCourse(response.data.course);
      }
    } catch (error) {
      console.error("Fetch course error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to load course"
      );
    }
  };

  /* =====================================================
     FETCH LECTURES
  ===================================================== */

  const fetchLectures = async () => {
    try {
      setLoading(true);

      const response = await api.get(
        `/lecture/course/${courseId}`
      );

      if (response.data?.success) {
        const sortedLectures = [
          ...(response.data.lectures || []),
        ].sort((a, b) => a.order - b.order);

        setLectures(sortedLectures);
      }
    } catch (error) {
      console.error("Fetch lectures error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to load lectures"
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     INITIAL LOAD
  ===================================================== */

  useEffect(() => {
    if (!courseId) return;

    fetchCourse();
    fetchLectures();
  }, [courseId]);

  /* =====================================================
     RESET CREATE FORM
  ===================================================== */

  const resetCreateForm = () => {
    setLectureTitle("");
    setLectureContent("");
    setShowCreate(false);
  };

  /* =====================================================
     CREATE LECTURE
  ===================================================== */

  const handleCreateLecture = async (event) => {
    event.preventDefault();

    const title = lectureTitle.trim();
    const content = lectureContent.trim();

    if (!title) {
      toast.error("Please enter a lecture title.");
      return;
    }

    if (!content) {
      toast.error("Please add lecture content.");
      return;
    }

    try {
      setCreating(true);

      const response = await api.post(
        `/lecture/${courseId}`,
        {
          lectureTitle: title,
          lectureContent: content,
        }
      );

      if (!response.data?.success) {
        toast.error(
          response.data?.message ||
            "Unable to create lecture"
        );
        return;
      }

      toast.success("Lecture created successfully");

      resetCreateForm();

      await fetchLectures();
    } catch (error) {
      console.error(
        "Create lecture error:",
        error.response || error
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to create lecture"
      );
    } finally {
      setCreating(false);
    }
  };

  /* =====================================================
     START EDITING
  ===================================================== */

  const startEditing = (lecture) => {
    setEditingId(lecture._id);
    setEditingTitle(lecture.lectureTitle || "");
    setEditingContent(
      lecture.lectureContent || ""
    );
  };

  /* =====================================================
     CANCEL EDITING
  ===================================================== */

  const cancelEditing = () => {
    setEditingId(null);
    setEditingTitle("");
    setEditingContent("");
  };

  /* =====================================================
     UPDATE LECTURE
  ===================================================== */

  const handleUpdateLecture = async (lectureId) => {
    const title = editingTitle.trim();
    const content = editingContent.trim();

    if (!title) {
      toast.error("Lecture title cannot be empty.");
      return;
    }

    if (!content) {
      toast.error("Lecture content cannot be empty.");
      return;
    }

    try {
      setUpdatingId(lectureId);

      const response = await api.put(
        `/lecture/${lectureId}`,
        {
          lectureTitle: title,
          lectureContent: content,
        }
      );

      if (!response.data?.success) {
        toast.error(
          response.data?.message ||
            "Unable to update lecture"
        );
        return;
      }

      setLectures((previous) =>
        previous.map((lecture) =>
          lecture._id === lectureId
            ? response.data.lecture
            : lecture
        )
      );

      cancelEditing();

      toast.success(
        "Lecture updated successfully"
      );
    } catch (error) {
      console.error(
        "Update lecture error:",
        error.response || error
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to update lecture"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  /* =====================================================
     DELETE LECTURE
  ===================================================== */

  const handleDeleteLecture = async (lectureId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this lecture?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(lectureId);

      const response = await api.delete(
        `/lecture/delete/${lectureId}`
      );

      if (!response.data?.success) {
        toast.error(
          response.data?.message ||
            "Unable to delete lecture"
        );
        return;
      }

      toast.success(
        "Lecture deleted successfully"
      );

      setLectures((previous) =>
        previous.filter(
          (lecture) => lecture._id !== lectureId
        )
      );

      await fetchLectures();
    } catch (error) {
      console.error(
        "Delete lecture error:",
        error.response || error
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to delete lecture"
      );
    } finally {
      setDeletingId(null);
    }
  };

  /* =====================================================
     UPLOAD VIDEO
  ===================================================== */

  const handleVideoUpload = async (
    lectureId,
    file
  ) => {
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      toast.error(
        "Please select a valid video file."
      );
      return;
    }

    const formData = new FormData();

    formData.append("video", file);

    try {
      setUploadingId(lectureId);

      const response = await api.put(
        `/lecture/video/${lectureId}`,
        formData
      );

      if (!response.data?.success) {
        toast.error(
          response.data?.message ||
            "Video upload failed"
        );
        return;
      }

      setLectures((previous) =>
        previous.map((lecture) =>
          lecture._id === lectureId
            ? response.data.lecture
            : lecture
        )
      );

      toast.success(
        "Video uploaded successfully"
      );
    } catch (error) {
      console.error(
        "Video upload error:",
        error.response || error
      );

      toast.error(
        error.response?.data?.message ||
          "Video upload failed"
      );
    } finally {
      setUploadingId(null);
    }
  };

  /* =====================================================
     TOGGLE PREVIEW
  ===================================================== */

  const handleTogglePreview = async (
    lectureId
  ) => {
    try {
      setPreviewLoadingId(lectureId);

      const response = await api.patch(
        `/lecture/preview/${lectureId}`
      );

      if (!response.data?.success) {
        toast.error(
          response.data?.message ||
            "Unable to update preview"
        );
        return;
      }

      setLectures((previous) =>
        previous.map((lecture) =>
          lecture._id === lectureId
            ? response.data.lecture
            : lecture
        )
      );

      toast.success(
        response.data.lecture.isPreviewFree
          ? "Free preview enabled"
          : "Free preview disabled"
      );
    } catch (error) {
      console.error(
        "Toggle preview error:",
        error.response || error
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to update preview"
      );
    } finally {
      setPreviewLoadingId(null);
    }
  };

  /* =====================================================
     FORMAT DURATION
  ===================================================== */

  const formatDuration = (seconds) => {
    if (!seconds || seconds <= 0) {
      return "Not available";
    }

    const totalSeconds = Math.floor(seconds);

    const minutes = Math.floor(
      totalSeconds / 60
    );

    const remainingSeconds =
      totalSeconds % 60;

    return `${minutes}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-[#070504] text-white">

        {/* AMBIENT GLOW */}

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(245,158,11,0.12),transparent_35%),radial-gradient(circle_at_20%_80%,rgba(127,29,29,0.14),transparent_30%)]" />

        <div className="relative z-10 flex flex-col items-center">

          <div className="relative mb-6">

            <div className="absolute inset-0 animate-ping rounded-full bg-amber-500/10" />

            <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-amber-400/20 bg-white/[0.04] shadow-[0_0_60px_rgba(245,158,11,0.12)] backdrop-blur-xl">

              <Crown
                size={38}
                className="text-amber-400"
              />

            </div>
          </div>

          <p className="text-xs font-bold uppercase tracking-[0.35em] text-amber-400">
            Opening the Lecture Hall
          </p>

          <p className="mt-3 text-sm text-white/40">
            Summoning your lessons...
          </p>
        </div>
      </div>
    );
  }

  /* =====================================================
     UI
  ===================================================== */

  return (
    <div className="lecture-realm relative min-h-full overflow-hidden bg-[#070504] text-white">

      {/* =================================================
         PREMIUM CURSOR
      ================================================= */}

      <div
        ref={cursorRef}
        className="pointer-events-none fixed left-0 top-0 z-[100] hidden h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-400/40 bg-amber-400/5 shadow-[0_0_25px_rgba(245,158,11,0.18)] lg:block"
      />

      <div
        ref={cursorDotRef}
        className="pointer-events-none fixed left-0 top-0 z-[101] hidden h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.9)] lg:block"
      />

      {/* =================================================
         BACKGROUND ATMOSPHERE
      ================================================= */}

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(245,158,11,0.10),transparent_28%),radial-gradient(circle_at_85%_20%,rgba(127,29,29,0.13),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(180,83,9,0.08),transparent_35%)]" />

      <div className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)] [background-size:42px_42px]" />

      {/* VIGNETTE */}

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(0,0,0,0.55)_100%)]" />

      {/* =================================================
         EMBERS
      ================================================= */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {EMBERS.map((ember) => (
          <span
            key={ember.id}
            className="absolute bottom-[-10px] rounded-full bg-amber-300 opacity-0 blur-[0.5px] animate-[emberFloat_var(--duration)_linear_var(--delay)_infinite]"
            style={{
              left: ember.left,
              width: ember.size,
              height: ember.size,
              "--duration": ember.duration,
              "--delay": ember.delay,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">

        <div className="mx-auto max-w-7xl">

          {/* =================================================
             BACK BUTTON
          ================================================= */}

          <button
            type="button"
            onClick={() =>
              navigate("/instructor/courses")
            }
            className="group mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white/50 backdrop-blur-xl transition duration-300 hover:border-amber-400/30 hover:bg-amber-400/[0.06] hover:text-amber-300"
          >
            <ArrowLeft
              size={15}
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />

            Return to Courses
          </button>

          {/* =================================================
             HERO
          ================================================= */}

          <section className="relative mb-8 overflow-hidden rounded-[30px] border border-amber-400/10 bg-white/[0.035] p-6 shadow-[0_25px_100px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-8">

            <div className="pointer-events-none absolute right-[-80px] top-[-100px] h-72 w-72 rounded-full bg-amber-500/10 blur-[100px]" />

            <div className="pointer-events-none absolute bottom-[-100px] left-[20%] h-60 w-60 rounded-full bg-red-900/10 blur-[90px]" />

            <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">

              <div className="flex min-w-0 items-start gap-5">

                {/* SIGIL */}

                <div className="group relative hidden shrink-0 sm:block">

                  <div className="absolute inset-[-7px] rounded-[24px] border border-amber-400/10 transition duration-500 group-hover:rotate-6 group-hover:border-amber-400/30" />

                  <div className="relative flex h-20 w-20 items-center justify-center rounded-[22px] border border-amber-400/20 bg-gradient-to-br from-amber-500/15 to-red-950/20 shadow-[0_0_45px_rgba(245,158,11,0.12)]">

                    <div className="absolute inset-2 rounded-[16px] border border-amber-400/10" />

                    <Film
                      size={32}
                      className="text-amber-400 transition duration-500 group-hover:scale-110 group-hover:rotate-3"
                    />

                  </div>

                </div>

                <div className="min-w-0">

                  <div className="mb-3 flex flex-wrap items-center gap-2">

                    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/15 bg-amber-400/[0.06] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-amber-400">

                      <Crown size={12} />

                      Instructor Realm
                    </span>

                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/10 bg-emerald-400/[0.05] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-400">

                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />

                      Live Course
                    </span>

                  </div>

                  <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-amber-500/70">
                    The Lecture Hall
                  </p>

                  <h1 className="max-w-3xl truncate text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
                    {course?.courseTitle ||
                      "Course Lectures"}
                  </h1>

                  <p className="mt-3 max-w-2xl text-sm leading-7 text-white/40 sm:text-base">
                    Forge your course lesson by lesson.
                    Create knowledge, upload your
                    teachings and decide which
                    chapters students may preview.
                  </p>

                </div>
              </div>

              {/* ADD BUTTON */}

              <button
                type="button"
                onClick={() =>
                  setShowCreate(true)
                }
                className="group relative inline-flex shrink-0 items-center justify-center gap-2 overflow-hidden rounded-2xl border border-amber-400/25 bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-3.5 text-sm font-black text-black shadow-[0_12px_40px_rgba(245,158,11,0.18)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(245,158,11,0.28)]"
              >

                <span className="absolute inset-0 -translate-x-full bg-white/20 transition duration-700 group-hover:translate-x-full" />

                <Plus
                  size={18}
                  className="relative transition-transform duration-300 group-hover:rotate-90"
                />

                <span className="relative">
                  Add Lecture
                </span>

              </button>
            </div>

            {/* HERO FOOTER */}

            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/[0.06] pt-5">

              <div className="flex items-center gap-2 text-xs text-white/35">
                <ScrollText
                  size={14}
                  className="text-amber-400"
                />

                <span>
                  {lectures.length}{" "}
                  {lectures.length === 1
                    ? "chapter"
                    : "chapters"}{" "}
                  forged
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-white/35">
                <BookOpen
                  size={14}
                  className="text-amber-400"
                />

                <span>
                  Learning content
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-white/35">
                <Sparkles
                  size={14}
                  className="text-amber-400"
                />

                <span>
                  AI Mentor compatible
                </span>
              </div>

            </div>
          </section>

          {/* =================================================
             CREATE LECTURE
          ================================================= */}

          {showCreate && (
            <section className="relative mb-8 overflow-hidden rounded-[30px] border border-amber-400/20 bg-[#0e0b08]/90 shadow-[0_25px_90px_rgba(0,0,0,0.45)] backdrop-blur-2xl">

              <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

              <div className="border-b border-white/[0.06] bg-gradient-to-r from-amber-500/[0.06] to-transparent px-6 py-6 sm:px-7">

                <div className="flex items-start justify-between gap-4">

                  <div className="flex items-start gap-4">

                    <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-amber-400/20 bg-amber-400/[0.07]">

                      <FileText
                        size={22}
                        className="text-amber-400"
                      />

                      <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.8)]" />

                    </div>

                    <div>

                      <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-amber-500/70">
                        Forge New Knowledge
                      </p>

                      <h2 className="mt-1 text-xl font-black text-white">
                        Add New Lecture
                      </h2>

                      <p className="mt-1 text-sm text-white/35">
                        Create the next chapter of
                        your course.
                      </p>

                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={resetCreateForm}
                    className="rounded-xl border border-white/10 bg-white/[0.03] p-2 text-white/35 transition hover:border-red-400/20 hover:bg-red-400/10 hover:text-red-300"
                  >
                    <X size={18} />
                  </button>

                </div>
              </div>

              <form
                onSubmit={handleCreateLecture}
                className="space-y-6 p-6 sm:p-7"
              >

                {/* TITLE */}

                <div>

                  <label className="mb-2.5 block text-xs font-bold uppercase tracking-[0.16em] text-white/55">
                    Lecture Title
                  </label>

                  <div className="group relative">

                    <BookOpen
                      size={17}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/20 transition group-focus-within:text-amber-400"
                    />

                    <input
                      type="text"
                      value={lectureTitle}
                      onChange={(event) =>
                        setLectureTitle(
                          event.target.value
                        )
                      }
                      placeholder="e.g. Introduction to React"
                      className="w-full rounded-2xl border border-white/10 bg-black/30 py-4 pl-11 pr-4 text-sm text-white outline-none transition duration-300 placeholder:text-white/20 focus:border-amber-400/40 focus:bg-amber-400/[0.025] focus:shadow-[0_0_30px_rgba(245,158,11,0.07)]"
                    />

                  </div>
                </div>

                {/* CONTENT */}

                <div>

                  <div className="mb-2.5 flex items-center justify-between">

                    <label className="text-xs font-bold uppercase tracking-[0.16em] text-white/55">
                      Lecture Content
                    </label>

                    <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] font-semibold text-white/30">
                      {lectureContent.length}{" "}
                      characters
                    </span>

                  </div>

                  <textarea
                    value={lectureContent}
                    onChange={(event) =>
                      setLectureContent(
                        event.target.value
                      )
                    }
                    rows={11}
                    placeholder={`Write the concepts taught in this lecture...

Example:

A React component is a reusable piece of UI.

Functional components are JavaScript functions that return JSX.

Example:

function Welcome() {
  return <h1>Hello World</h1>;
}

Explain the important concepts, examples,
and notes students should understand.`}
                    className="w-full resize-y rounded-2xl border border-white/10 bg-black/30 px-5 py-4 text-sm leading-7 text-white outline-none transition duration-300 placeholder:text-white/20 focus:border-amber-400/40 focus:bg-amber-400/[0.025] focus:shadow-[0_0_30px_rgba(245,158,11,0.07)]"
                  />

                  <div className="mt-3 flex items-start gap-2 text-xs leading-5 text-white/30">

                    <Sparkles
                      size={14}
                      className="mt-0.5 shrink-0 text-amber-400/60"
                    />

                    <p>
                      This content will be available
                      to students and used by the AI
                      Mentor to answer lecture-related
                      questions.
                    </p>

                  </div>

                </div>

                {/* ACTIONS */}

                <div className="flex flex-col-reverse gap-3 border-t border-white/[0.06] pt-5 sm:flex-row sm:justify-end">

                  <button
                    type="button"
                    onClick={resetCreateForm}
                    className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-bold text-white/50 transition hover:bg-white/[0.07] hover:text-white"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={creating}
                    className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-3 text-sm font-black text-black shadow-[0_10px_30px_rgba(245,158,11,0.15)] transition hover:-translate-y-0.5 hover:shadow-[0_15px_35px_rgba(245,158,11,0.25)] disabled:cursor-not-allowed disabled:opacity-50"
                  >

                    {creating ? (
                      <>
                        <LoaderCircle
                          size={17}
                          className="animate-spin"
                        />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus size={17} />
                        Forge Lecture
                      </>
                    )}

                  </button>

                </div>
              </form>
            </section>
          )}

          {/* =================================================
             LECTURE HEADER
          ================================================= */}

          <section className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <div className="flex items-center gap-2">
                <Sword
                  size={15}
                  className="text-amber-400"
                />

                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-500/70">
                  The Chapters
                </p>
              </div>

              <h2 className="mt-2 text-2xl font-black text-white">
                Course Lectures
              </h2>

              <p className="mt-1 text-sm text-white/30">
                Manage every lesson forged inside
                this course.
              </p>

            </div>

            {lectures.length > 0 && (
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-amber-400/10 bg-amber-400/[0.05] px-3.5 py-2 text-xs font-bold text-amber-400">
                <BookOpen size={14} />
                {lectures.length}{" "}
                {lectures.length === 1
                  ? "Lecture"
                  : "Lectures"}
              </div>
            )}

          </section>

          {/* =================================================
             LECTURE LIST
          ================================================= */}

          <section className="relative overflow-hidden rounded-[30px] border border-white/[0.08] bg-[#0b0907]/90 shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-2xl">

            <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />

            {lectures.length === 0 ? (

              /* =================================================
                 EMPTY STATE
              ================================================= */

              <div className="flex min-h-[430px] flex-col items-center justify-center px-6 text-center">

                <div className="relative mb-7">

                  <div className="absolute inset-[-25px] rounded-full bg-amber-500/5 blur-2xl" />

                  <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-amber-400/15 bg-amber-400/[0.04] shadow-[0_0_50px_rgba(245,158,11,0.08)]">

                    <ScrollText
                      size={34}
                      className="text-amber-400/80"
                    />

                  </div>

                  <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full border border-amber-400/20 bg-[#0b0907] text-amber-400">
                    <Plus size={15} />
                  </div>

                </div>

                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-500/60">
                  The Hall Awaits
                </p>

                <h3 className="mt-2 text-2xl font-black text-white">
                  No lectures yet
                </h3>

                <p className="mt-2 max-w-md text-sm leading-6 text-white/35">
                  Every great course begins with
                  its first chapter. Forge your
                  first lecture and begin building
                  your learning realm.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    setShowCreate(true)
                  }
                  className="mt-7 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-5 py-3 text-sm font-black text-black shadow-[0_10px_35px_rgba(245,158,11,0.16)] transition hover:-translate-y-1 hover:shadow-[0_15px_45px_rgba(245,158,11,0.25)]"
                >
                  <Plus size={17} />
                  Forge First Lecture
                </button>

              </div>

            ) : (

              /* =================================================
                 LECTURES
              ================================================= */

              <div className="divide-y divide-white/[0.06]">

                {lectures.map((lecture) => {

                  const hasContent =
                    Boolean(
                      lecture.lectureContent?.trim()
                    );

                  const hasVideo =
                    Boolean(lecture.videoUrl);

                  const isEditing =
                    editingId === lecture._id;

                  return (
                    <div
                      key={lecture._id}
                      className="group relative p-5 transition duration-500 hover:bg-amber-400/[0.018] sm:p-6 lg:p-7"
                    >

                      {/* HOVER RAIL */}

                      <div className="absolute bottom-0 left-0 top-0 w-0.5 origin-bottom scale-y-0 bg-gradient-to-b from-amber-300 via-orange-500 to-transparent transition duration-500 group-hover:scale-y-100" />

                      {isEditing ? (

                        /* =================================================
                           EDIT MODE
                        ================================================= */

                        <div className="relative overflow-hidden rounded-[25px] border border-amber-400/20 bg-gradient-to-br from-amber-400/[0.07] to-transparent shadow-[0_15px_60px_rgba(0,0,0,0.25)]">

                          <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-700" />

                          <div className="border-b border-white/[0.06] px-5 py-5 sm:px-6">

                            <div className="flex items-center justify-between gap-4">

                              <div className="flex items-center gap-4">

                                <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-400/20 bg-amber-400/[0.08] text-sm font-black text-amber-300 shadow-[0_0_25px_rgba(245,158,11,0.08)]">

                                  {lecture.order}

                                </div>

                                <div>

                                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-amber-500/70">
                                    Editing Chapter
                                  </p>

                                  <h3 className="mt-1 font-black text-white">
                                    Update Lecture
                                  </h3>

                                </div>

                              </div>

                              <button
                                type="button"
                                onClick={
                                  cancelEditing
                                }
                                className="rounded-xl border border-white/10 bg-white/[0.04] p-2 text-white/35 transition hover:border-red-400/20 hover:bg-red-400/10 hover:text-red-300"
                              >
                                <X size={18} />
                              </button>

                            </div>
                          </div>

                          <div className="space-y-6 p-5 sm:p-6">

                            {/* TITLE */}

                            <div>

                              <label className="mb-2.5 block text-xs font-bold uppercase tracking-[0.16em] text-white/50">
                                Lecture Title
                              </label>

                              <input
                                autoFocus
                                type="text"
                                value={
                                  editingTitle
                                }
                                onChange={(
                                  event
                                ) =>
                                  setEditingTitle(
                                    event.target
                                      .value
                                  )
                                }
                                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3.5 text-sm font-semibold text-white outline-none transition focus:border-amber-400/40 focus:shadow-[0_0_30px_rgba(245,158,11,0.06)]"
                              />

                            </div>

                            {/* CONTENT */}

                            <div>

                              <div className="mb-2.5 flex items-center justify-between">

                                <label className="text-xs font-bold uppercase tracking-[0.16em] text-white/50">
                                  Lecture Content
                                </label>

                                <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] text-white/30">
                                  {
                                    editingContent.length
                                  }{" "}
                                  characters
                                </span>

                              </div>

                              <textarea
                                value={
                                  editingContent
                                }
                                onChange={(
                                  event
                                ) =>
                                  setEditingContent(
                                    event.target
                                      .value
                                  )
                                }
                                rows={12}
                                className="w-full resize-y rounded-2xl border border-white/10 bg-black/30 px-5 py-4 text-sm leading-7 text-white outline-none transition focus:border-amber-400/40 focus:shadow-[0_0_30px_rgba(245,158,11,0.06)]"
                              />

                              {!editingContent.trim() && (
                                <div className="mt-3 flex items-center gap-2 text-xs text-amber-400/70">
                                  <Sparkles
                                    size={13}
                                  />
                                  Add lecture content so
                                  the AI Mentor can use
                                  this lesson as context.
                                </div>
                              )}

                            </div>

                            {/* ACTIONS */}

                            <div className="flex flex-col-reverse gap-3 border-t border-white/[0.06] pt-5 sm:flex-row sm:justify-end">

                              <button
                                type="button"
                                onClick={
                                  cancelEditing
                                }
                                disabled={
                                  updatingId ===
                                  lecture._id
                                }
                                className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-bold text-white/45 transition hover:bg-white/[0.07] hover:text-white disabled:opacity-50"
                              >
                                Cancel
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleUpdateLecture(
                                    lecture._id
                                  )
                                }
                                disabled={
                                  updatingId ===
                                  lecture._id
                                }
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-3 text-sm font-black text-black shadow-[0_10px_30px_rgba(245,158,11,0.12)] transition hover:-translate-y-0.5 hover:shadow-[0_15px_35px_rgba(245,158,11,0.22)] disabled:cursor-not-allowed disabled:opacity-50"
                              >

                                {updatingId ===
                                lecture._id ? (
                                  <>
                                    <LoaderCircle
                                      size={17}
                                      className="animate-spin"
                                    />
                                    Saving...
                                  </>
                                ) : (
                                  <>
                                    <Save
                                      size={17}
                                    />
                                    Save Changes
                                  </>
                                )}

                              </button>

                            </div>
                          </div>
                        </div>

                      ) : (

                        /* =================================================
                           NORMAL MODE
                        ================================================= */

                        <div className="flex flex-col gap-6 xl:flex-row xl:items-center">

                          {/* ORDER / INFO */}

                          <div className="flex min-w-0 flex-1 items-start gap-4">

                            <div className="relative shrink-0">

                              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-400/15 bg-gradient-to-br from-amber-400/[0.12] to-orange-900/[0.12] text-lg font-black text-amber-300 shadow-[0_0_25px_rgba(245,158,11,0.05)] transition duration-500 group-hover:border-amber-400/30 group-hover:shadow-[0_0_35px_rgba(245,158,11,0.12)]">

                                {lecture.order}

                              </div>

                              <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border border-[#0b0907] bg-amber-500 text-[9px] font-black text-black">
                                <Gem size={9} />
                              </span>

                            </div>

                            <div className="min-w-0">

                              <div className="flex items-start gap-3">

                                <div className="min-w-0">

                                  <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-500/55">
                                    Chapter{" "}
                                    {lecture.order}
                                  </p>

                                  <h3 className="break-words text-lg font-black text-white transition group-hover:text-amber-300 sm:text-xl">
                                    {
                                      lecture.lectureTitle
                                    }
                                  </h3>

                                </div>

                              </div>

                              {/* STATUS */}

                              <div className="mt-3 flex flex-wrap items-center gap-2">

                                {hasContent ? (
                                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/10 bg-emerald-400/[0.06] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-400">
                                    <FileText
                                      size={12}
                                    />
                                    Content Ready
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/10 bg-amber-400/[0.06] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-400">
                                    <FileText
                                      size={12}
                                    />
                                    Content Missing
                                  </span>
                                )}

                                {hasVideo ? (
                                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/10 bg-emerald-400/[0.06] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-400">
                                    <Check
                                      size={12}
                                    />
                                    Video Ready
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1.5 rounded-full border border-red-400/10 bg-red-400/[0.05] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-red-300">
                                    <Film
                                      size={12}
                                    />
                                    Video Pending
                                  </span>
                                )}

                                {lecture.isPreviewFree && (
                                  <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/15 bg-amber-400/[0.06] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-300">
                                    <Eye
                                      size={12}
                                    />
                                    Free Preview
                                  </span>
                                )}

                              </div>

                            </div>
                          </div>

                          {/* META */}

                          <div className="hidden items-center gap-7 border-x border-white/[0.06] px-6 xl:flex">

                            <div className="text-center">

                              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/25">
                                Duration
                              </p>

                              <p className="mt-1.5 text-sm font-black text-white/75">
                                {formatDuration(
                                  lecture.videoDuration
                                )}
                              </p>

                            </div>

                            <div className="h-8 w-px bg-white/[0.06]" />

                            <div className="text-center">

                              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/25">
                                Preview
                              </p>

                              <p
                                className={`mt-1.5 text-xs font-black ${
                                  lecture.isPreviewFree
                                    ? "text-amber-400"
                                    : "text-white/30"
                                }`}
                              >
                                {lecture.isPreviewFree
                                  ? "ENABLED"
                                  : "LOCKED"}
                              </p>

                            </div>
                          </div>

                          {/* ACTIONS */}

                          <div className="flex flex-wrap items-center gap-2.5 xl:justify-end">

                            {/* PREVIEW */}

                            <button
                              type="button"
                              disabled={
                                previewLoadingId ===
                                lecture._id
                              }
                              onClick={() =>
                                handleTogglePreview(
                                  lecture._id
                                )
                              }
                              className={`group/btn inline-flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-[11px] font-black uppercase tracking-wide transition duration-300 disabled:cursor-not-allowed disabled:opacity-50 ${
                                lecture.isPreviewFree
                                  ? "border-amber-400/20 bg-amber-400/10 text-amber-300 hover:bg-amber-400/15 hover:shadow-[0_0_25px_rgba(245,158,11,0.12)]"
                                  : "border-white/10 bg-white/[0.04] text-white/40 hover:border-amber-400/20 hover:bg-amber-400/[0.05] hover:text-amber-300"
                              }`}
                            >
                              {previewLoadingId ===
                              lecture._id ? (
                                <LoaderCircle
                                  size={14}
                                  className="animate-spin"
                                />
                              ) : (
                                <PlayCircle
                                  size={14}
                                  className="transition group-hover/btn:scale-110"
                                />
                              )}

                              {lecture.isPreviewFree
                                ? "Preview On"
                                : "Preview Off"}
                            </button>

                            {/* UPLOAD */}

                            <label
                              className={`group/upload inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-[11px] font-black uppercase tracking-wide text-white/45 transition duration-300 hover:border-amber-400/20 hover:bg-amber-400/[0.05] hover:text-amber-300 ${
                                uploadingId ===
                                lecture._id
                                  ? "pointer-events-none opacity-50"
                                  : ""
                              }`}
                            >

                              {uploadingId ===
                              lecture._id ? (
                                <LoaderCircle
                                  size={14}
                                  className="animate-spin"
                                />
                              ) : (
                                <Upload
                                  size={14}
                                  className="transition group-hover/upload:-translate-y-0.5"
                                />
                              )}

                              <span className="hidden sm:inline">
                                {uploadingId ===
                                lecture._id
                                  ? "Uploading..."
                                  : lecture.videoUrl
                                  ? "Replace Video"
                                  : "Upload Video"}
                              </span>

                              <input
                                type="file"
                                accept="video/*"
                                className="hidden"
                                disabled={
                                  uploadingId ===
                                  lecture._id
                                }
                                onChange={(event) => {
                                  const file =
                                    event.target
                                      .files?.[0];

                                  handleVideoUpload(
                                    lecture._id,
                                    file
                                  );

                                  event.target.value =
                                    "";
                                }}
                              />
                            </label>

                            {/* EDIT */}

                            <button
                              type="button"
                              onClick={() =>
                                startEditing(
                                  lecture
                                )
                              }
                              className="group/edit rounded-xl border border-white/10 bg-white/[0.04] p-2.5 text-white/40 transition duration-300 hover:-translate-y-0.5 hover:border-amber-400/20 hover:bg-amber-400/[0.07] hover:text-amber-300 hover:shadow-[0_0_25px_rgba(245,158,11,0.08)]"
                              title="Edit lecture"
                            >
                              <Edit3
                                size={16}
                                className="transition group-hover/edit:rotate-12"
                              />
                            </button>

                            {/* DELETE */}

                            <button
                              type="button"
                              disabled={
                                deletingId ===
                                lecture._id
                              }
                              onClick={() =>
                                handleDeleteLecture(
                                  lecture._id
                                )
                              }
                              className="group/delete rounded-xl border border-red-400/10 bg-red-400/[0.04] p-2.5 text-red-400/60 transition duration-300 hover:-translate-y-0.5 hover:border-red-400/30 hover:bg-red-500/10 hover:text-red-300 hover:shadow-[0_0_25px_rgba(239,68,68,0.08)] disabled:cursor-not-allowed disabled:opacity-40"
                              title="Delete lecture"
                            >

                              {deletingId ===
                              lecture._id ? (
                                <LoaderCircle
                                  size={16}
                                  className="animate-spin"
                                />
                              ) : (
                                <Trash2
                                  size={16}
                                  className="transition group-hover/delete:scale-110"
                                />
                              )}

                            </button>

                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

              </div>
            )}
          </section>

          {/* =================================================
             FOOTER
          ================================================= */}

          <div className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-white/[0.05] pt-5 text-center sm:flex-row sm:text-left">

            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">

              <Shield
                size={13}
                className="text-amber-500/50"
              />

              Your course realm is protected
            </div>

            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">

              <Flame
                size={13}
                className="text-orange-500/60"
              />

              Forge. Teach. Inspire.
            </div>

          </div>
        </div>
      </div>

      {/* =================================================
         ANIMATION STYLES
      ================================================= */}

      <style>{`
        @keyframes emberFloat {
          0% {
            transform: translate3d(0, 0, 0) scale(0.7);
            opacity: 0;
          }

          10% {
            opacity: 0.7;
          }

          50% {
            transform: translate3d(
              25px,
              -45vh,
              0
            ) scale(1);
            opacity: 0.45;
          }

          100% {
            transform: translate3d(
              -15px,
              -100vh,
              0
            ) scale(0.4);
            opacity: 0;
          }
        }

        .lecture-realm {
          isolation: isolate;
        }

        .lecture-realm button,
        .lecture-realm label,
        .lecture-realm a {
          -webkit-tap-highlight-color: transparent;
        }

        @media (max-width: 1023px) {
          .lecture-realm {
            cursor: auto;
          }
        }

        ::selection {
          background: rgba(245, 158, 11, 0.25);
          color: #fff;
        }
      `}</style>
    </div>
  );
}

export default ManageLectures;
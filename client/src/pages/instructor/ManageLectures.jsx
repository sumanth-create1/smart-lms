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
  StickyNote,
  Paperclip,
  Download,
  ExternalLink,
} from "lucide-react";

import toast from "react-hot-toast";
import api from "../../services/api";

const EMBERS = Array.from({ length: 22 }, (_, index) => ({
  id: index,
  left: `${(index * 17.3) % 100}%`,
  delay: `${(index * 0.47) % 7}s`,
  duration: `${5 + ((index * 0.73) % 5)}s`,
  size: `${2 + (index % 3)}px`,
}));

function ManageLectures() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  // =====================================================
  // CURSOR
  // =====================================================

  const cursorRef = useRef(null);
  const cursorGlowRef = useRef(null);

  // =====================================================
  // COURSE / LECTURES
  // =====================================================

  const [course, setCourse] = useState(null);
  const [lectures, setLectures] = useState([]);

  const [loading, setLoading] = useState(true);

  // =====================================================
  // CREATE LECTURE
  // =====================================================

  const [creating, setCreating] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  const [lectureTitle, setLectureTitle] = useState("");
  const [lectureContent, setLectureContent] =
    useState("");

  // =====================================================
  // EDIT LECTURE
  // =====================================================

  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] =
    useState("");
  const [editingContent, setEditingContent] =
    useState("");
  const [updatingId, setUpdatingId] = useState(null);

  // =====================================================
  // VIDEO
  // =====================================================

  const [uploadingId, setUploadingId] =
    useState(null);

  const [deletingId, setDeletingId] =
    useState(null);

  const [previewLoadingId, setPreviewLoadingId] =
    useState(null);

  // =====================================================
  // NOTES
  // =====================================================

  const [notesLecture, setNotesLecture] =
    useState(null);

  const [lectureNotes, setLectureNotes] =
    useState([]);

  const [notesLoading, setNotesLoading] =
    useState(false);

  const [noteMode, setNoteMode] =
    useState("write");

  const [savingNote, setSavingNote] =
    useState(false);

  const [uploadingNoteFile, setUploadingNoteFile] =
    useState(false);

  const [deletingNoteId, setDeletingNoteId] =
    useState(null);

  const [editingNoteId, setEditingNoteId] =
    useState(null);

  const [noteTitle, setNoteTitle] =
    useState("");

  const [noteContent, setNoteContent] =
    useState("");

  const [selectedNoteFile, setSelectedNoteFile] =
    useState(null);

  // =====================================================
  // CUSTOM CURSOR
  // =====================================================

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      }

      if (cursorGlowRef.current) {
        cursorGlowRef.current.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      }
    };

    window.addEventListener(
      "mousemove",
      handleMouseMove
    );

    return () => {
      window.removeEventListener(
        "mousemove",
        handleMouseMove
      );
    };
  }, []);

  // =====================================================
  // FETCH COURSE
  // =====================================================

  const fetchCourse = async () => {
    try {
      const response = await api.get(
        `/course/${courseId}`
      );

      if (response.data?.success) {
        setCourse(response.data.course);
      }
    } catch (error) {
      console.error(
        "Fetch course error:",
        error.response || error
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to load course"
      );
    }
  };

  // =====================================================
  // FETCH LECTURES
  // =====================================================

  const fetchLectures = async () => {
    try {
      const response = await api.get(
        `/lecture/course/${courseId}`
      );

      if (response.data?.success) {
        const sortedLectures = [
          ...(response.data.lectures || []),
        ].sort(
          (a, b) =>
            (a.order || 0) -
            (b.order || 0)
        );

        setLectures(sortedLectures);
      }
    } catch (error) {
      console.error(
        "Fetch lectures error:",
        error.response || error
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to load lectures"
      );
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      await Promise.all([
        fetchCourse(),
        fetchLectures(),
      ]);

      setLoading(false);
    };

    loadData();
  }, [courseId]);

  // =====================================================
  // RESET CREATE FORM
  // =====================================================

  const resetCreateForm = () => {
    setLectureTitle("");
    setLectureContent("");
    setShowCreate(false);
  };

  // =====================================================
  // CREATE LECTURE
  // =====================================================

  const handleCreateLecture = async (event) => {
    event.preventDefault();

    if (!lectureTitle.trim()) {
      toast.error(
        "Please enter a lecture title."
      );
      return;
    }

    try {
      setCreating(true);

      const response = await api.post(
        `/lecture/${courseId}`,
        {
          lectureTitle:
            lectureTitle.trim(),

          lectureContent:
            lectureContent.trim(),
        }
      );

      if (!response.data?.success) {
        toast.error(
          response.data?.message ||
            "Unable to create lecture"
        );
        return;
      }

      setLectures((prev) => [
        ...prev,
        response.data.lecture,
      ]);

      toast.success(
        "Lecture forged successfully."
      );

      resetCreateForm();
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

  // =====================================================
  // START EDITING
  // =====================================================

  const startEditing = (lecture) => {
    setEditingId(lecture._id);

    setEditingTitle(
      lecture.lectureTitle || ""
    );

    setEditingContent(
      lecture.lectureContent || ""
    );
  };

  // =====================================================
  // CANCEL EDITING
  // =====================================================

  const cancelEditing = () => {
    setEditingId(null);
    setEditingTitle("");
    setEditingContent("");
  };

  // =====================================================
  // UPDATE LECTURE
  // =====================================================

  const handleUpdateLecture = async (
    event,
    lectureId
  ) => {
    event.preventDefault();

    if (!editingTitle.trim()) {
      toast.error(
        "Lecture title cannot be empty."
      );
      return;
    }

    try {
      setUpdatingId(lectureId);

      const response = await api.put(
        `/lecture/${lectureId}`,
        {
          lectureTitle:
            editingTitle.trim(),

          lectureContent:
            editingContent.trim(),
        }
      );

      if (!response.data?.success) {
        toast.error(
          response.data?.message ||
            "Unable to update lecture"
        );
        return;
      }

      setLectures((prev) =>
        prev.map((lecture) =>
          lecture._id === lectureId
            ? response.data.lecture
            : lecture
        )
      );

      toast.success(
        "Lecture updated successfully."
      );

      cancelEditing();
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

  // =====================================================
  // DELETE LECTURE
  // =====================================================

  const handleDeleteLecture = async (
    lectureId
  ) => {
    const confirmed = window.confirm(
      "Delete this lecture permanently?"
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

      setLectures((prev) =>
        prev.filter(
          (lecture) =>
            lecture._id !== lectureId
        )
      );

      toast.success(
        "Lecture removed from the realm."
      );
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

  // =====================================================
  // UPLOAD VIDEO
  // =====================================================

  const handleUploadVideo = async (
    event,
    lectureId
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    try {
      setUploadingId(lectureId);

      const formData = new FormData();

      formData.append("video", file);

      const response = await api.put(
        `/lecture/video/${lectureId}`,
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      if (!response.data?.success) {
        toast.error(
          response.data?.message ||
            "Unable to upload video"
        );
        return;
      }

      setLectures((prev) =>
        prev.map((lecture) =>
          lecture._id === lectureId
            ? response.data.lecture
            : lecture
        )
      );

      toast.success(
        "Lecture video uploaded successfully."
      );
    } catch (error) {
      console.error(
        "Upload video error:",
        error.response || error
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to upload video"
      );
    } finally {
      setUploadingId(null);

      event.target.value = "";
    }
  };

  // =====================================================
  // TOGGLE PREVIEW
  // =====================================================

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

      setLectures((prev) =>
        prev.map((lecture) =>
          lecture._id === lectureId
            ? response.data.lecture
            : lecture
        )
      );

      toast.success(
        response.data.lecture
          ?.isPreviewFree
          ? "Preview enabled."
          : "Preview disabled."
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

  // =====================================================
  // NOTES — RESET FORM
  // =====================================================

  const resetNoteForm = () => {
    setEditingNoteId(null);
    setNoteTitle("");
    setNoteContent("");
    setSelectedNoteFile(null);
    setNoteMode("write");
  };

  // =====================================================
  // NOTES — OPEN
  // =====================================================

  const openNotes = async (lecture) => {
    try {
      setNotesLecture(lecture);

      resetNoteForm();

      setNotesLoading(true);

      const response = await api.get(
        `/note/lecture/${lecture._id}`
      );

      if (response.data?.success) {
        setLectureNotes(
          response.data.notes || []
        );
      } else {
        setLectureNotes([]);

        toast.error(
          response.data?.message ||
            "Unable to load notes"
        );
      }
    } catch (error) {
      console.error(
        "Fetch notes error:",
        error.response || error
      );

      setLectureNotes([]);

      toast.error(
        error.response?.data?.message ||
          "Unable to load notes"
      );
    } finally {
      setNotesLoading(false);
    }
  };

  // =====================================================
  // NOTES — CLOSE
  // =====================================================

  const closeNotes = () => {
    setNotesLecture(null);
    setLectureNotes([]);
    resetNoteForm();
  };

  // =====================================================
  // NOTES — EDIT
  // =====================================================

  const startEditingNote = (note) => {
    if (note.fileUrl) {
      toast.error(
        "Uploaded files cannot be edited. Delete and upload the new file."
      );

      return;
    }

    setEditingNoteId(note._id);

    setNoteTitle(
      note.noteTitle || ""
    );

    setNoteContent(
      note.noteContent || ""
    );

    setNoteMode("write");
  };

  // =====================================================
  // NOTES — SAVE WRITTEN NOTE
  // =====================================================

  const handleSaveWrittenNote = async (
    event
  ) => {
    event.preventDefault();

    const title = noteTitle.trim();
    const content = noteContent.trim();

    if (!title) {
      toast.error(
        "Please enter a note title."
      );
      return;
    }

    if (!content) {
      toast.error(
        "Please write some note content."
      );
      return;
    }

    if (!notesLecture) return;

    try {
      setSavingNote(true);

      if (editingNoteId) {
        const response = await api.put(
          `/note/${editingNoteId}`,
          {
            noteTitle: title,
            noteContent: content,
          }
        );

        if (!response.data?.success) {
          toast.error(
            response.data?.message ||
              "Unable to update note"
          );

          return;
        }

        setLectureNotes((prev) =>
          prev.map((note) =>
            note._id === editingNoteId
              ? response.data.note
              : note
          )
        );

        toast.success(
          "Note updated successfully."
        );
      } else {
        const response = await api.post(
          `/note/lecture/${notesLecture._id}`,
          {
            noteTitle: title,
            noteContent: content,
          }
        );

        if (!response.data?.success) {
          toast.error(
            response.data?.message ||
              "Unable to create note"
          );

          return;
        }

        setLectureNotes((prev) => [
          response.data.note,
          ...prev,
        ]);

        toast.success(
          "Note forged successfully."
        );
      }

      resetNoteForm();
    } catch (error) {
      console.error(
        "Save note error:",
        error.response || error
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to save note"
      );
    } finally {
      setSavingNote(false);
    }
  };

  // =====================================================
  // NOTES — UPLOAD FILE
  // =====================================================

  const handleUploadNoteFile = async (
    event
  ) => {
    event.preventDefault();

    if (!notesLecture) return;

    if (!selectedNoteFile) {
      toast.error(
        "Please select a file."
      );

      return;
    }

    if (!noteTitle.trim()) {
      toast.error(
        "Please enter a title for the file."
      );

      return;
    }

    // Client-side 10MB validation
    if (
      selectedNoteFile.size >
      10 * 1024 * 1024
    ) {
      toast.error(
        "File size must be less than 10 MB."
      );

      return;
    }

    try {
      setUploadingNoteFile(true);

      const formData = new FormData();

      formData.append(
        "noteTitle",
        noteTitle.trim()
      );

      formData.append(
        "noteContent",
        noteContent.trim()
      );

      formData.append(
        "file",
        selectedNoteFile
      );

      const response = await api.post(
        `/note/lecture/${notesLecture._id}/file`,
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      if (!response.data?.success) {
        toast.error(
          response.data?.message ||
            "Unable to upload file"
        );

        return;
      }

      setLectureNotes((prev) => [
        response.data.note,
        ...prev,
      ]);

      toast.success(
        "Note file uploaded successfully."
      );

      resetNoteForm();
    } catch (error) {
      console.error(
        "Upload note file error:",
        error.response || error
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to upload note file"
      );
    } finally {
      setUploadingNoteFile(false);
    }
  };

  // =====================================================
  // NOTES — DELETE
  // =====================================================

  const handleDeleteNote = async (
    noteId
  ) => {
    const confirmed = window.confirm(
      "Delete this note permanently?"
    );

    if (!confirmed) return;

    try {
      setDeletingNoteId(noteId);

      const response = await api.delete(
        `/note/${noteId}`
      );

      if (!response.data?.success) {
        toast.error(
          response.data?.message ||
            "Unable to delete note"
        );

        return;
      }

      setLectureNotes((prev) =>
        prev.filter(
          (note) =>
            note._id !== noteId
        )
      );

      if (
        editingNoteId === noteId
      ) {
        resetNoteForm();
      }

      toast.success(
        "Note deleted."
      );
    } catch (error) {
      console.error(
        "Delete note error:",
        error.response || error
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to delete note"
      );
    } finally {
      setDeletingNoteId(null);
    }
  };

  // =====================================================
  // FORMAT FILE SIZE
  // =====================================================

  const formatFileSize = (
    bytes = 0
  ) => {
    if (!bytes) return "0 KB";

    const units = [
      "Bytes",
      "KB",
      "MB",
      "GB",
    ];

    const index = Math.floor(
      Math.log(bytes) /
        Math.log(1024)
    );

    return `${(
      bytes /
      Math.pow(1024, index)
    ).toFixed(
      index === 0 ? 0 : 1
    )} ${units[index]}`;
  };

  // =====================================================
  // FILE EXTENSION
  // =====================================================

  const getFileExtension = (
    fileName = ""
  ) => {
    const parts =
      fileName.split(".");

    return parts.length > 1
      ? parts.pop().toUpperCase()
      : "FILE";
  };

  // =====================================================
  // FORMAT VIDEO DURATION
  // =====================================================

  const formatDuration = (
    seconds = 0
  ) => {
    if (!seconds) return "00:00";

    const hours = Math.floor(
      seconds / 3600
    );

    const minutes = Math.floor(
      (seconds % 3600) / 60
    );

    const remainingSeconds =
      Math.floor(seconds % 60);

    if (hours > 0) {
      return `${String(hours).padStart(
        2,
        "0"
      )}:${String(minutes).padStart(
        2,
        "0"
      )}:${String(
        remainingSeconds
      ).padStart(2, "0")}`;
    }

    return `${String(minutes).padStart(
      2,
      "0"
    )}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  // =====================================================
  // LOADING SCREEN
  // =====================================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050403]">

        <div className="text-center">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-400/20 bg-amber-400/[0.05]">

            <Crown
              size={28}
              className="animate-pulse text-amber-400"
            />

          </div>

          <p className="mt-5 text-[10px] font-black uppercase tracking-[0.3em] text-amber-400/60">
            Entering the archives
          </p>

          <LoaderCircle
            size={20}
            className="mx-auto mt-4 animate-spin text-white/30"
          />

        </div>

      </div>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050403] text-white">

      {/* ================================================= */}
      {/* CUSTOM CURSOR */}
      {/* ================================================= */}

      <div
        ref={cursorGlowRef}
        className="pointer-events-none fixed left-0 top-0 z-[100] hidden h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-400/[0.035] blur-2xl md:block"
      />

      <div
        ref={cursorRef}
        className="pointer-events-none fixed left-0 top-0 z-[101] hidden h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-300 shadow-[0_0_18px_rgba(245,158,11,0.8)] md:block"
      />

      {/* ================================================= */}
      {/* AMBIENT BACKGROUND */}
      {/* ================================================= */}

      <div className="pointer-events-none absolute inset-0">

        <div className="absolute left-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-orange-500/[0.035] blur-[130px]" />

        <div className="absolute bottom-[-15%] right-[-10%] h-[600px] w-[600px] rounded-full bg-amber-400/[0.025] blur-[150px]" />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:70px_70px]" />

        {EMBERS.map((ember) => (
          <span
            key={ember.id}
            className="absolute bottom-[-20px] rounded-full bg-amber-400/60 shadow-[0_0_12px_rgba(245,158,11,0.5)]"
            style={{
              left: ember.left,
              width: ember.size,
              height: ember.size,
              animation: `emberFloat ${ember.duration} linear ${ember.delay} infinite`,
            }}
          />
        ))}

      </div>

      {/* ================================================= */}
      {/* PAGE */}
      {/* ================================================= */}

      <div className="relative z-10 mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">

        {/* ================================================= */}
        {/* TOP NAV */}
        {/* ================================================= */}

        <div className="mb-8 flex items-center justify-between">

          <button
            type="button"
            onClick={() =>
              navigate(
                `/dashboard/instructor/courses`
              )
            }
            className="group inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.16em] text-white/45 transition duration-300 hover:-translate-y-0.5 hover:border-amber-400/20 hover:bg-amber-400/[0.04] hover:text-amber-300"
          >
            <ArrowLeft
              size={15}
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />

            Back To Courses
          </button>

          <div className="hidden items-center gap-2 sm:flex">

            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber-400/15 bg-amber-400/[0.05] text-amber-300">

              <Sword size={15} />

            </div>

            <span className="text-[9px] font-black uppercase tracking-[0.25em] text-white/25">
              Lecture Command
            </span>

          </div>

        </div>

        {/* ================================================= */}
        {/* HERO */}
        {/* ================================================= */}

        <section className="relative mb-8 overflow-hidden rounded-[30px] border border-amber-400/10 bg-white/[0.025] p-6 shadow-[0_25px_100px_rgba(0,0,0,0.35)] sm:p-8 lg:p-10">

          <div className="absolute right-[-80px] top-[-100px] h-[300px] w-[300px] rounded-full bg-amber-400/[0.06] blur-[90px]" />

          <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-end">

            <div className="max-w-3xl">

              <div className="mb-5 flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-400/20 bg-amber-400/[0.06] text-amber-300">

                  <Crown size={20} />

                </div>

                <div>

                  <p className="text-[9px] font-black uppercase tracking-[0.32em] text-amber-400/70">
                    Royal Lecture Archives
                  </p>

                  <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.16em] text-white/20">
                    {lectures.length}{" "}
                    {lectures.length === 1
                      ? "Lecture"
                      : "Lectures"}
                  </p>

                </div>

              </div>

              <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">

                Manage{" "}

                <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-orange-500 bg-clip-text text-transparent">
                  Lectures
                </span>

              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-white/35 sm:text-base">
                Forge, organize and enrich every
                lesson inside your course archive.
              </p>

              {course && (
                <div className="mt-5 flex items-center gap-2">

                  <BookOpen
                    size={14}
                    className="text-amber-400/60"
                  />

                  <span className="text-xs font-bold text-white/50">
                    {course.courseTitle}
                  </span>

                </div>
              )}

            </div>

            <button
              type="button"
              onClick={() =>
                setShowCreate(
                  (prev) => !prev
                )
              }
              className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-3.5 text-[10px] font-black uppercase tracking-[0.18em] text-black shadow-[0_0_35px_rgba(245,158,11,0.15)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_0_45px_rgba(245,158,11,0.25)]"
            >

              <Plus
                size={16}
                className={`transition-transform duration-300 ${
                  showCreate
                    ? "rotate-45"
                    : "group-hover:rotate-90"
                }`}
              />

              {showCreate
                ? "Close Forge"
                : "Add Lecture"}

            </button>

          </div>

        </section>

        {/* ================================================= */}
        {/* CREATE LECTURE */}
        {/* ================================================= */}

        {showCreate && (
          <section className="mb-8 overflow-hidden rounded-[28px] border border-amber-400/15 bg-amber-400/[0.025] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.25)] sm:p-7">

            <div className="mb-6 flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-400/20 bg-amber-400/[0.06] text-amber-300">

                <Sparkles size={17} />

              </div>

              <div>

                <p className="text-[9px] font-black uppercase tracking-[0.25em] text-amber-400/70">
                  Forge New Lesson
                </p>

                <h2 className="mt-1 text-lg font-black text-white">
                  Create Lecture
                </h2>

              </div>

            </div>

            <form
              onSubmit={
                handleCreateLecture
              }
              className="space-y-5"
            >

              <div>

                <label className="mb-2 block text-[9px] font-black uppercase tracking-[0.2em] text-white/30">
                  Lecture Title
                </label>

                <input
                  type="text"
                  value={lectureTitle}
                  onChange={(event) =>
                    setLectureTitle(
                      event.target.value
                    )
                  }
                  placeholder="Enter lecture title..."
                  className="w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3.5 text-sm font-semibold text-white outline-none transition placeholder:text-white/20 focus:border-amber-400/30 focus:bg-amber-400/[0.03]"
                />

              </div>

              <div>

                <label className="mb-2 block text-[9px] font-black uppercase tracking-[0.2em] text-white/30">
                  Lecture Content
                </label>

                <textarea
                  value={lectureContent}
                  onChange={(event) =>
                    setLectureContent(
                      event.target.value
                    )
                  }
                  rows={5}
                  placeholder="Describe what students will learn..."
                  className="w-full resize-none rounded-xl border border-white/10 bg-black/25 px-4 py-3.5 text-sm leading-6 text-white outline-none transition placeholder:text-white/20 focus:border-amber-400/30 focus:bg-amber-400/[0.03]"
                />

              </div>

              <button
                type="submit"
                disabled={creating}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-3 text-[10px] font-black uppercase tracking-[0.16em] text-black transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
              >

                {creating ? (
                  <LoaderCircle
                    size={15}
                    className="animate-spin"
                  />
                ) : (
                  <Sword size={15} />
                )}

                {creating
                  ? "Forging..."
                  : "Forge Lecture"}

              </button>

            </form>

          </section>
        )}

        {/* ================================================= */}
        {/* LECTURES HEADER */}
        {/* ================================================= */}

        <div className="mb-5 flex items-center justify-between">

          <div>

            <p className="text-[9px] font-black uppercase tracking-[0.25em] text-amber-400/60">
              Course Structure
            </p>

            <h2 className="mt-1 text-xl font-black text-white">
              Lecture Archive
            </h2>

          </div>

          <div className="hidden items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2 sm:flex">

            <Shield
              size={13}
              className="text-amber-400/50"
            />

            <span className="text-[9px] font-black uppercase tracking-wider text-white/25">
              Instructor Control
            </span>

          </div>

        </div>

        {/* ================================================= */}
        {/* LECTURE LIST */}
        {/* ================================================= */}

        {lectures.length === 0 ? (

          <div className="rounded-[28px] border border-dashed border-amber-400/15 bg-white/[0.02] p-12 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-400/15 bg-amber-400/[0.04] text-amber-300/60">

              <Film size={28} />

            </div>

            <h3 className="mt-5 text-lg font-black text-white">
              No lectures yet
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/30">
              Begin building your course by
              forging your first lecture.
            </p>

          </div>

        ) : (

          <div className="space-y-4">

            {lectures.map(
              (lecture, index) => {

                const isEditing =
                  editingId ===
                  lecture._id;

                return (
                  <article
                    key={lecture._id}
                    className="group relative overflow-hidden rounded-[26px] border border-white/[0.07] bg-white/[0.025] shadow-[0_15px_60px_rgba(0,0,0,0.22)] transition duration-500 hover:border-amber-400/15 hover:bg-white/[0.035]"
                  >

                    <div className="absolute left-0 top-0 h-full w-[2px] bg-gradient-to-b from-amber-500/70 via-orange-500/20 to-transparent opacity-60" />

                    {/* ================================================= */}
                    {/* EDIT MODE */}
                    {/* ================================================= */}

                    {isEditing ? (

                      <form
                        onSubmit={(event) =>
                          handleUpdateLecture(
                            event,
                            lecture._id
                          )
                        }
                        className="p-5 sm:p-7"
                      >

                        <div className="mb-6 flex items-center justify-between">

                          <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-400/20 bg-amber-400/[0.06] text-amber-300">

                              <Edit3 size={16} />

                            </div>

                            <div>

                              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-400/60">
                                Editing
                              </p>

                              <h3 className="mt-1 text-sm font-black text-white">
                                Lecture {index + 1}
                              </h3>

                            </div>

                          </div>

                          <button
                            type="button"
                            onClick={
                              cancelEditing
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-white/35 transition hover:bg-red-400/[0.08] hover:text-red-300"
                          >
                            <X size={15} />
                          </button>

                        </div>

                        <div className="space-y-5">

                          <div>

                            <label className="mb-2 block text-[9px] font-black uppercase tracking-wider text-white/30">
                              Lecture Title
                            </label>

                            <input
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
                              className="w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm font-semibold text-white outline-none transition focus:border-amber-400/30"
                            />

                          </div>

                          <div>

                            <label className="mb-2 block text-[9px] font-black uppercase tracking-wider text-white/30">
                              Lecture Content
                            </label>

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
                              rows={6}
                              className="w-full resize-none rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm leading-6 text-white outline-none transition focus:border-amber-400/30"
                            />

                          </div>

                          <div className="flex flex-wrap gap-2">

                            <button
                              type="submit"
                              disabled={
                                updatingId ===
                                lecture._id
                              }
                              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-3 text-[10px] font-black uppercase tracking-wider text-black transition hover:-translate-y-0.5 disabled:opacity-50"
                            >

                              {updatingId ===
                              lecture._id ? (
                                <LoaderCircle
                                  size={14}
                                  className="animate-spin"
                                />
                              ) : (
                                <Save
                                  size={14}
                                />
                              )}

                              Save Changes

                            </button>

                            <button
                              type="button"
                              onClick={
                                cancelEditing
                              }
                              className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-[10px] font-black uppercase tracking-wider text-white/40 transition hover:bg-white/[0.06] hover:text-white"
                            >
                              Cancel
                            </button>

                          </div>

                        </div>

                      </form>

                    ) : (

                      <div className="p-5 sm:p-7">

                        {/* ================================================= */}
                        {/* LECTURE HEADER */}
                        {/* ================================================= */}

                        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">

                          <div className="flex min-w-0 gap-4">

                            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-amber-400/15 bg-amber-400/[0.04] text-amber-300">

                              <span className="text-sm font-black">
                                {String(
                                  index + 1
                                ).padStart(
                                  2,
                                  "0"
                                )}
                              </span>

                              <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.8)]" />

                            </div>

                            <div className="min-w-0">

                              <div className="mb-2 flex flex-wrap items-center gap-2">

                                <span className="rounded-md border border-amber-400/10 bg-amber-400/[0.04] px-2 py-1 text-[8px] font-black uppercase tracking-[0.15em] text-amber-300/60">
                                  Lesson
                                </span>

                                {lecture.videoUrl && (
                                  <span className="flex items-center gap-1 rounded-md border border-emerald-400/10 bg-emerald-400/[0.04] px-2 py-1 text-[8px] font-black uppercase tracking-wider text-emerald-300/60">
                                    <Check
                                      size={10}
                                    />
                                    Video Ready
                                  </span>
                                )}

                                {lecture.isPreviewFree && (
                                  <span className="flex items-center gap-1 rounded-md border border-orange-400/10 bg-orange-400/[0.04] px-2 py-1 text-[8px] font-black uppercase tracking-wider text-orange-300/60">
                                    <Eye
                                      size={10}
                                    />
                                    Preview
                                  </span>
                                )}

                              </div>

                              <h3 className="text-lg font-black tracking-tight text-white sm:text-xl">
                                {
                                  lecture.lectureTitle
                                }
                              </h3>

                              {lecture.lectureContent && (
                                <p className="mt-2 max-w-3xl text-xs leading-5 text-white/30 sm:text-sm">
                                  {
                                    lecture.lectureContent
                                  }
                                </p>
                              )}

                              <div className="mt-4 flex flex-wrap items-center gap-2">

                                <span className="flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.02] px-2.5 py-1.5 text-[9px] font-bold text-white/25">

                                  <PlayCircle
                                    size={11}
                                  />

                                  {formatDuration(
                                    lecture.videoDuration
                                  )}

                                </span>

                                {lecture.module && (
                                  <span className="flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.02] px-2.5 py-1.5 text-[9px] font-bold text-white/25">

                                    <BookOpen
                                      size={11}
                                    />

                                    {
                                      lecture
                                        .module
                                        .moduleTitle
                                    }

                                  </span>
                                )}

                              </div>

                            </div>

                          </div>

                          {/* ================================================= */}
                          {/* ACTIONS */}
                          {/* ================================================= */}

                          <div className="flex flex-wrap items-center gap-2">

                            {/* NOTES */}

                            <button
                              type="button"
                              onClick={() =>
                                openNotes(
                                  lecture
                                )
                              }
                              className="group/notes inline-flex items-center gap-2 rounded-xl border border-amber-400/10 bg-amber-400/[0.04] px-3.5 py-2.5 text-[10px] font-black uppercase tracking-wider text-amber-300/80 transition duration-300 hover:-translate-y-0.5 hover:border-amber-400/30 hover:bg-amber-400/[0.09] hover:text-amber-200 hover:shadow-[0_0_25px_rgba(245,158,11,0.1)]"
                            >

                              <StickyNote
                                size={14}
                                className="transition duration-300 group-hover/notes:-rotate-6 group-hover/notes:scale-110"
                              />

                              Notes

                            </button>

                            {/* PREVIEW */}

                            <button
                              type="button"
                              onClick={() =>
                                handleTogglePreview(
                                  lecture._id
                                )
                              }
                              disabled={
                                previewLoadingId ===
                                lecture._id
                              }
                              className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-[10px] font-black uppercase tracking-wider transition ${
                                lecture.isPreviewFree
                                  ? "border-orange-400/20 bg-orange-400/[0.08] text-orange-300"
                                  : "border-white/10 bg-white/[0.025] text-white/35 hover:border-amber-400/20 hover:text-amber-300"
                              }`}
                            >

                              {previewLoadingId ===
                              lecture._id ? (
                                <LoaderCircle
                                  size={14}
                                  className="animate-spin"
                                />
                              ) : (
                                <Eye
                                  size={14}
                                />
                              )}

                              {lecture.isPreviewFree
                                ? "Preview On"
                                : "Preview"}

                            </button>

                            {/* UPLOAD VIDEO */}

                            <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/[0.025] px-3.5 py-2.5 text-[10px] font-black uppercase tracking-wider text-white/40 transition hover:border-amber-400/20 hover:text-amber-300">

                              <input
                                type="file"
                                accept="video/*"
                                className="hidden"
                                onChange={(
                                  event
                                ) =>
                                  handleUploadVideo(
                                    event,
                                    lecture._id
                                  )
                                }
                              />

                              {uploadingId ===
                              lecture._id ? (
                                <LoaderCircle
                                  size={14}
                                  className="animate-spin"
                                />
                              ) : (
                                <Upload
                                  size={14}
                                />
                              )}

                              {uploadingId ===
                              lecture._id
                                ? "Uploading"
                                : "Video"}

                            </label>

                            {/* EDIT */}

                            <button
                              type="button"
                              onClick={() =>
                                startEditing(
                                  lecture
                                )
                              }
                              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.025] px-3.5 py-2.5 text-[10px] font-black uppercase tracking-wider text-white/40 transition hover:border-amber-400/20 hover:text-amber-300"
                            >

                              <Edit3
                                size={14}
                              />

                              Edit

                            </button>

                            {/* DELETE */}

                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteLecture(
                                  lecture._id
                                )
                              }
                              disabled={
                                deletingId ===
                                lecture._id
                              }
                              className="inline-flex items-center gap-2 rounded-xl border border-red-400/10 bg-red-400/[0.025] px-3.5 py-2.5 text-[10px] font-black uppercase tracking-wider text-red-300/50 transition hover:border-red-400/25 hover:bg-red-400/[0.06] hover:text-red-300 disabled:opacity-40"
                            >

                              {deletingId ===
                              lecture._id ? (
                                <LoaderCircle
                                  size={14}
                                  className="animate-spin"
                                />
                              ) : (
                                <Trash2
                                  size={14}
                                />
                              )}

                              Delete

                            </button>

                          </div>

                        </div>

                      </div>
                    )}

                  </article>
                );
              }
            )}

          </div>
        )}

        {/* ================================================= */}
        {/* FOOTER */}
        {/* ================================================= */}

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/[0.05] pt-6 text-center sm:flex-row sm:text-left">

          <div className="flex items-center gap-2">

            <Flame
              size={14}
              className="text-orange-400/40"
            />

            <span className="text-[9px] font-black uppercase tracking-[0.22em] text-white/15">
              Knowledge is forged, not given.
            </span>

          </div>

          <div className="flex items-center gap-2">

            <Gem
              size={12}
              className="text-amber-400/30"
            />

            <span className="text-[9px] font-bold uppercase tracking-wider text-white/15">
              Smart LMS
            </span>

          </div>

        </div>

      </div>

      {/* ================================================= */}
      {/* NOTES MODAL */}
      {/* ================================================= */}

      {notesLecture && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6">

          {/* Backdrop */}

          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            onClick={closeNotes}
          />

          {/* Modal */}

          <div className="relative flex max-h-[94vh] w-full max-w-6xl flex-col overflow-hidden rounded-[30px] border border-amber-400/20 bg-[#0b0806]/95 shadow-[0_30px_120px_rgba(0,0,0,0.85)]">

            {/* ================================================= */}
            {/* MODAL HEADER */}
            {/* ================================================= */}

            <div className="relative border-b border-white/[0.06] px-5 py-5 sm:px-7">

              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.10),transparent_35%)]" />

              <div className="relative flex items-center justify-between gap-4">

                <div className="flex min-w-0 items-center gap-4">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-amber-400/20 bg-amber-400/[0.08] text-amber-300 shadow-[0_0_30px_rgba(245,158,11,0.08)]">

                    <StickyNote size={21} />

                  </div>

                  <div className="min-w-0">

                    <div className="mb-1 flex items-center gap-2">

                      <span className="text-[9px] font-black uppercase tracking-[0.28em] text-amber-400/70">
                        Royal Archive
                      </span>

                      <span className="h-1 w-1 rounded-full bg-amber-400/50" />

                      <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/30">
                        {lectureNotes.length}{" "}
                        {lectureNotes.length ===
                        1
                          ? "Note"
                          : "Notes"}
                      </span>

                    </div>

                    <h2 className="truncate text-lg font-black tracking-tight text-white sm:text-xl">
                      {
                        notesLecture.lectureTitle
                      }
                    </h2>

                  </div>

                </div>

                <button
                  type="button"
                  onClick={closeNotes}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/50 transition hover:border-red-400/30 hover:bg-red-400/[0.08] hover:text-red-300"
                >
                  <X size={18} />
                </button>

              </div>

            </div>

            {/* ================================================= */}
            {/* MODAL CONTENT */}
            {/* ================================================= */}

            <div className="grid min-h-0 flex-1 lg:grid-cols-[1.08fr_.92fr]">

              {/* ================================================= */}
              {/* NOTES LIST */}
              {/* ================================================= */}

              <div className="min-h-0 overflow-y-auto border-b border-white/[0.06] p-5 sm:p-7 lg:border-b-0 lg:border-r">

                <div className="mb-5 flex items-center justify-between">

                  <div>

                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-amber-400/70">
                      Archive
                    </p>

                    <h3 className="mt-1 text-base font-black text-white">
                      Lecture Notes
                    </h3>

                  </div>

                  <div className="rounded-xl border border-amber-400/10 bg-amber-400/[0.04] px-3 py-2 text-[10px] font-black uppercase tracking-wider text-amber-300/70">
                    {lectureNotes.length}{" "}
                    Items
                  </div>

                </div>

                {notesLoading ? (

                  <div className="flex min-h-[300px] items-center justify-center">

                    <div className="text-center">

                      <LoaderCircle
                        size={28}
                        className="mx-auto animate-spin text-amber-400"
                      />

                      <p className="mt-3 text-xs font-bold uppercase tracking-wider text-white/30">
                        Opening the royal archives...
                      </p>

                    </div>

                  </div>

                ) : lectureNotes.length ===
                  0 ? (

                  <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-dashed border-amber-400/15 bg-amber-400/[0.02] p-8 text-center">

                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-400/15 bg-amber-400/[0.05] text-amber-300/60">

                      <ScrollText
                        size={28}
                      />

                    </div>

                    <h4 className="text-sm font-black text-white">
                      The archive is empty
                    </h4>

                    <p className="mt-2 max-w-xs text-xs leading-5 text-white/35">
                      Forge your first written
                      note or upload a study
                      document for this lecture.
                    </p>

                  </div>

                ) : (

                  <div className="space-y-3">

                    {lectureNotes.map(
                      (note) => {
                        const isFileNote =
                          Boolean(
                            note.fileUrl
                          );

                        return (
                          <div
                            key={
                              note._id
                            }
                            className="group rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 transition duration-300 hover:-translate-y-0.5 hover:border-amber-400/20 hover:bg-amber-400/[0.035] hover:shadow-[0_15px_40px_rgba(0,0,0,0.25)]"
                          >

                            <div className="flex gap-3">

                              {/* ICON */}

                              <div
                                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${
                                  isFileNote
                                    ? "border-orange-400/20 bg-orange-400/[0.07] text-orange-300"
                                    : "border-amber-400/20 bg-amber-400/[0.07] text-amber-300"
                                }`}
                              >

                                {isFileNote ? (
                                  <Paperclip
                                    size={
                                      17
                                    }
                                  />
                                ) : (
                                  <ScrollText
                                    size={
                                      17
                                    }
                                  />
                                )}

                              </div>

                              {/* CONTENT */}

                              <div className="min-w-0 flex-1">

                                <div className="flex flex-wrap items-start justify-between gap-3">

                                  <div className="min-w-0">

                                    <h4 className="truncate text-sm font-black text-white">
                                      {
                                        note.noteTitle
                                      }
                                    </h4>

                                    <div className="mt-1 flex flex-wrap items-center gap-2">

                                      <span className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 text-[8px] font-black uppercase tracking-wider text-white/35">
                                        {isFileNote
                                          ? getFileExtension(
                                              note.fileName
                                            )
                                          : "Written Note"}
                                      </span>

                                      <span className="text-[9px] text-white/25">
                                        {new Date(
                                          note.createdAt
                                        ).toLocaleDateString()}
                                      </span>

                                    </div>

                                  </div>

                                  {/* ACTIONS */}

                                  <div className="flex shrink-0 items-center gap-1">

                                    {isFileNote && (
                                      <>
                                        <a
                                          href={
                                            note.fileUrl
                                          }
                                          target="_blank"
                                          rel="noreferrer"
                                          className="flex h-8 w-8 items-center justify-center rounded-lg text-white/35 transition hover:bg-amber-400/10 hover:text-amber-300"
                                          title="Open file"
                                        >
                                          <ExternalLink
                                            size={
                                              14
                                            }
                                          />
                                        </a>

                                        <a
                                          href={
                                            note.fileUrl
                                          }
                                          download={
                                            note.fileName
                                          }
                                          target="_blank"
                                          rel="noreferrer"
                                          className="flex h-8 w-8 items-center justify-center rounded-lg text-white/35 transition hover:bg-amber-400/10 hover:text-amber-300"
                                          title="Download file"
                                        >
                                          <Download
                                            size={
                                              14
                                            }
                                          />
                                        </a>
                                      </>
                                    )}

                                    {!isFileNote && (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          startEditingNote(
                                            note
                                          )
                                        }
                                        className="flex h-8 w-8 items-center justify-center rounded-lg text-white/35 transition hover:bg-amber-400/10 hover:text-amber-300"
                                        title="Edit note"
                                      >
                                        <Edit3
                                          size={
                                            14
                                          }
                                        />
                                      </button>
                                    )}

                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleDeleteNote(
                                          note._id
                                        )
                                      }
                                      disabled={
                                        deletingNoteId ===
                                        note._id
                                      }
                                      className="flex h-8 w-8 items-center justify-center rounded-lg text-white/35 transition hover:bg-red-400/10 hover:text-red-300 disabled:opacity-40"
                                      title="Delete note"
                                    >

                                      {deletingNoteId ===
                                      note._id ? (
                                        <LoaderCircle
                                          size={
                                            14
                                          }
                                          className="animate-spin"
                                        />
                                      ) : (
                                        <Trash2
                                          size={
                                            14
                                          }
                                        />
                                      )}

                                    </button>

                                  </div>

                                </div>

                                {/* WRITTEN CONTENT */}

                                {note.noteContent && (
                                  <p className="mt-3 whitespace-pre-wrap text-xs leading-5 text-white/45">
                                    {
                                      note.noteContent
                                    }
                                  </p>
                                )}

                                {/* FILE INFO */}

                                {isFileNote && (
                                  <div className="mt-3 flex flex-wrap items-center gap-2">

                                    <div className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-black/20 px-3 py-2">

                                      <FileText
                                        size={
                                          13
                                        }
                                        className="text-amber-400/70"
                                      />

                                      <span className="max-w-[220px] truncate text-[10px] font-bold text-white/40">
                                        {
                                          note.fileName
                                        }
                                      </span>

                                    </div>

                                    <span className="rounded-lg border border-white/[0.06] bg-black/20 px-3 py-2 text-[10px] font-bold text-white/30">
                                      {formatFileSize(
                                        note.fileSize
                                      )}
                                    </span>

                                  </div>
                                )}

                              </div>

                            </div>

                          </div>
                        );
                      }
                    )}

                  </div>
                )}

              </div>

              {/* ================================================= */}
              {/* NOTE CREATOR */}
              {/* ================================================= */}

              <div className="min-h-0 overflow-y-auto p-5 sm:p-7">

                {/* MODE SWITCH */}

                <div className="mb-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-1.5">

                  <div className="grid grid-cols-2 gap-1">

                    <button
                      type="button"
                      onClick={() => {
                        setNoteMode(
                          "write"
                        );

                        setSelectedNoteFile(
                          null
                        );
                      }}
                      className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-[0.14em] transition ${
                        noteMode ===
                        "write"
                          ? "bg-amber-400/[0.10] text-amber-300 shadow-[0_0_25px_rgba(245,158,11,0.07)]"
                          : "text-white/30 hover:text-white/60"
                      }`}
                    >

                      <ScrollText
                        size={14}
                      />

                      Write Note

                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setNoteMode(
                          "file"
                        );

                        setEditingNoteId(
                          null
                        );
                      }}
                      className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-[0.14em] transition ${
                        noteMode ===
                        "file"
                          ? "bg-orange-400/[0.10] text-orange-300 shadow-[0_0_25px_rgba(249,115,22,0.07)]"
                          : "text-white/30 hover:text-white/60"
                      }`}
                    >

                      <Paperclip
                        size={14}
                      />

                      Upload File

                    </button>

                  </div>

                </div>

                {/* ================================================= */}
                {/* FORM */}
                {/* ================================================= */}

                <form
                  onSubmit={
                    noteMode ===
                    "write"
                      ? handleSaveWrittenNote
                      : handleUploadNoteFile
                  }
                >

                  {/* TITLE */}

                  <div className="mb-5">

                    <label className="mb-2 block text-[9px] font-black uppercase tracking-[0.22em] text-white/35">
                      {noteMode ===
                      "write"
                        ? "Note Title"
                        : "File Title"}
                    </label>

                    <input
                      type="text"
                      value={
                        noteTitle
                      }
                      onChange={(
                        event
                      ) =>
                        setNoteTitle(
                          event.target
                            .value
                        )
                      }
                      placeholder={
                        noteMode ===
                        "write"
                          ? "Enter your note title..."
                          : "Enter a title for this file..."
                      }
                      className="w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3.5 text-sm font-semibold text-white outline-none transition placeholder:text-white/20 focus:border-amber-400/30 focus:bg-amber-400/[0.03] focus:shadow-[0_0_25px_rgba(245,158,11,0.06)]"
                    />

                  </div>

                  {/* ================================================= */}
                  {/* WRITTEN NOTE */}
                  {/* ================================================= */}

                  {noteMode ===
                    "write" && (
                    <>

                      <div className="mb-5">

                        <div className="mb-2 flex items-center justify-between">

                          <label className="text-[9px] font-black uppercase tracking-[0.22em] text-white/35">
                            Note Content
                          </label>

                          <span className="text-[9px] text-white/20">
                            {
                              noteContent.length
                            }{" "}
                            characters
                          </span>

                        </div>

                        <textarea
                          value={
                            noteContent
                          }
                          onChange={(
                            event
                          ) =>
                            setNoteContent(
                              event.target
                                .value
                            )
                          }
                          rows={10}
                          placeholder="Write important concepts, explanations, examples, reminders..."
                          className="w-full resize-none rounded-xl border border-white/10 bg-black/25 px-4 py-3.5 text-sm leading-6 text-white outline-none transition placeholder:text-white/20 focus:border-amber-400/30 focus:bg-amber-400/[0.03] focus:shadow-[0_0_25px_rgba(245,158,11,0.06)]"
                        />

                      </div>

                      <div className="flex gap-2">

                        {editingNoteId && (
                          <button
                            type="button"
                            onClick={
                              resetNoteForm
                            }
                            className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-[10px] font-black uppercase tracking-wider text-white/40 transition hover:bg-white/[0.06] hover:text-white"
                          >
                            Cancel
                          </button>
                        )}

                        <button
                          type="submit"
                          disabled={
                            savingNote
                          }
                          className="group flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-3 text-[10px] font-black uppercase tracking-wider text-black shadow-[0_0_25px_rgba(245,158,11,0.15)] transition hover:-translate-y-0.5 hover:shadow-[0_0_35px_rgba(245,158,11,0.25)] disabled:cursor-not-allowed disabled:opacity-50"
                        >

                          {savingNote ? (
                            <LoaderCircle
                              size={
                                14
                              }
                              className="animate-spin"
                            />
                          ) : (
                            <Save
                              size={
                                14
                              }
                            />
                          )}

                          {editingNoteId
                            ? "Update Note"
                            : "Forge Note"}

                        </button>

                      </div>

                    </>
                  )}

                  {/* ================================================= */}
                  {/* FILE UPLOAD */}
                  {/* ================================================= */}

                  {noteMode ===
                    "file" && (
                    <>

                      <div className="mb-5">

                        <label
                          htmlFor="lecture-note-file"
                          className="group block cursor-pointer rounded-2xl border border-dashed border-amber-400/20 bg-amber-400/[0.025] p-6 text-center transition duration-300 hover:border-amber-400/40 hover:bg-amber-400/[0.05] hover:shadow-[0_0_35px_rgba(245,158,11,0.06)]"
                        >

                          <input
                            id="lecture-note-file"
                            type="file"
                            className="hidden"
                            accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                            onChange={(
                              event
                            ) => {
                              const file =
                                event
                                  .target
                                  .files?.[0];

                              setSelectedNoteFile(
                                file ||
                                  null
                              );

                              if (
                                file &&
                                !noteTitle
                              ) {
                                setNoteTitle(
                                  file.name.replace(
                                    /\.[^/.]+$/,
                                    ""
                                  )
                                );
                              }
                            }}
                          />

                          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-400/20 bg-amber-400/[0.07] text-amber-300 transition duration-300 group-hover:scale-110 group-hover:rotate-3">

                            {selectedNoteFile ? (
                              <FileText
                                size={
                                  25
                                }
                              />
                            ) : (
                              <Upload
                                size={
                                  25
                                }
                              />
                            )}

                          </div>

                          {selectedNoteFile ? (

                            <>
                              <p className="mt-4 text-sm font-black text-white">
                                {
                                  selectedNoteFile.name
                                }
                              </p>

                              <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-amber-400/60">
                                {getFileExtension(
                                  selectedNoteFile.name
                                )}{" "}
                                •{" "}
                                {formatFileSize(
                                  selectedNoteFile.size
                                )}
                              </p>

                              <p className="mt-3 text-[10px] text-white/25">
                                Click to choose another
                                file
                              </p>
                            </>

                          ) : (

                            <>
                              <p className="mt-4 text-sm font-black text-white">
                                Choose a study
                                document
                              </p>

                              <p className="mt-2 text-xs text-white/30">
                                PDF, DOC, DOCX,
                                PPT, PPTX or TXT
                              </p>

                              <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-amber-400/45">
                                Maximum size: 10 MB
                              </p>
                            </>

                          )}

                        </label>

                      </div>

                      <div className="mb-5">

                        <label className="mb-2 block text-[9px] font-black uppercase tracking-[0.22em] text-white/35">
                          Description{" "}
                          <span className="text-white/15">
                            Optional
                          </span>
                        </label>

                        <textarea
                          value={
                            noteContent
                          }
                          onChange={(
                            event
                          ) =>
                            setNoteContent(
                              event.target
                                .value
                            )
                          }
                          rows={4}
                          placeholder="Add a short description about this document..."
                          className="w-full resize-none rounded-xl border border-white/10 bg-black/25 px-4 py-3.5 text-sm leading-6 text-white outline-none transition placeholder:text-white/20 focus:border-amber-400/30 focus:bg-amber-400/[0.03]"
                        />

                      </div>

                      <button
                        type="submit"
                        disabled={
                          uploadingNoteFile ||
                          !selectedNoteFile
                        }
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-3.5 text-[10px] font-black uppercase tracking-[0.15em] text-black shadow-[0_0_30px_rgba(249,115,22,0.14)] transition hover:-translate-y-0.5 hover:shadow-[0_0_40px_rgba(249,115,22,0.25)] disabled:cursor-not-allowed disabled:opacity-40"
                      >

                        {uploadingNoteFile ? (
                          <LoaderCircle
                            size={
                              15
                            }
                            className="animate-spin"
                          />
                        ) : (
                          <Upload
                            size={
                              15
                            }
                          />
                        )}

                        {uploadingNoteFile
                          ? "Uploading..."
                          : "Upload To Archive"}

                      </button>

                    </>
                  )}

                </form>

                {/* ================================================= */}
                {/* TIP */}
                {/* ================================================= */}

                <div className="mt-6 rounded-2xl border border-amber-400/10 bg-amber-400/[0.025] p-4">

                  <div className="flex gap-3">

                    <Gem
                      size={16}
                      className="mt-0.5 shrink-0 text-amber-400/60"
                    />

                    <div>

                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-300/60">
                        Archive Tip
                      </p>

                      <p className="mt-1 text-[10px] leading-5 text-white/25">
                        Keep your lecture notes
                        concise and organized.
                        Uploaded study material
                        can be opened directly
                        from the archive.
                      </p>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* ================================================= */}
      {/* ANIMATIONS */}
      {/* ================================================= */}

      <style>{`
        @keyframes emberFloat {
          0% {
            transform: translate3d(0, 0, 0) scale(0.8);
            opacity: 0;
          }

          10% {
            opacity: 0.65;
          }

          50% {
            opacity: 0.35;
          }

          100% {
            transform: translate3d(
              40px,
              -105vh,
              0
            ) scale(1.2);
            opacity: 0;
          }
        }
      `}</style>

    </div>
  );
}

export default ManageLectures;
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  BookOpen,
  Check,
  Edit3,
  Film,
  LoaderCircle,
  Plus,
  Trash2,
  Upload,
  X,
  PlayCircle,
} from "lucide-react";

import toast from "react-hot-toast";
import api from "../../services/api";

function ManageLectures() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [lectures, setLectures] = useState([]);

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [showCreate, setShowCreate] = useState(false);
  const [lectureTitle, setLectureTitle] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");

  const [uploadingId, setUploadingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [previewLoadingId, setPreviewLoadingId] = useState(null);

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
     CREATE LECTURE
  ===================================================== */

  const handleCreateLecture = async (event) => {
    event.preventDefault();

    const title = lectureTitle.trim();

    if (!title) {
      toast.error("Please enter a lecture title.");
      return;
    }

    try {
      setCreating(true);

      const response = await api.post(
        `/lecture/${courseId}`,
        {
          lectureTitle: title,
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

      setLectureTitle("");
      setShowCreate(false);

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
     UPDATE LECTURE
  ===================================================== */

  const handleUpdateLecture = async (lectureId) => {
    const title = editingTitle.trim();

    if (!title) {
      toast.error("Lecture title cannot be empty.");
      return;
    }

    try {
      const response = await api.put(
        `/lecture/${lectureId}`,
        {
          lectureTitle: title,
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

      setEditingId(null);
      setEditingTitle("");

      toast.success("Lecture updated successfully");
    } catch (error) {
      console.error(
        "Update lecture error:",
        error.response || error
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to update lecture"
      );
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

      toast.success("Lecture deleted successfully");

      setLectures((previous) =>
        previous.filter(
          (lecture) => lecture._id !== lectureId
        )
      );

      // Re-fetch to keep lecture order correct.
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

  const handleVideoUpload = async (lectureId, file) => {
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      toast.error("Please select a valid video file.");
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

      toast.success("Video uploaded successfully");
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

  const handleTogglePreview = async (lectureId) => {
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

    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;

    return `${minutes}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <LoaderCircle
            size={36}
            className="animate-spin text-indigo-600"
          />

          <p className="text-sm text-gray-500">
            Loading lectures...
          </p>
        </div>
      </div>
    );
  }

  /* =====================================================
     UI
  ===================================================== */

  return (
    <div className="min-h-full bg-[#F7F6F2] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}

        <div className="mb-8">
          <button
            type="button"
            onClick={() =>
              navigate("/instructor/courses")
            }
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-gray-900"
          >
            <ArrowLeft size={18} />
            Back to Courses
          </button>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-sm">
                <Film size={24} />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-medium text-indigo-600">
                  Lecture Management
                </p>

                <h1 className="truncate text-2xl font-bold tracking-tight text-[#15121F] sm:text-3xl">
                  {course?.courseTitle ||
                    "Course Lectures"}
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  Manage lectures, videos and previews.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowCreate(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
            >
              <Plus size={18} />
              Add Lecture
            </button>
          </div>
        </div>

        {/* CREATE LECTURE */}

        {showCreate && (
          <div className="mb-6 rounded-3xl border border-indigo-100 bg-white p-6 shadow-sm">

            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Add New Lecture
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Create the lecture first, then upload
                  its video.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowCreate(false);
                  setLectureTitle("");
                }}
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              >
                <X size={19} />
              </button>
            </div>

            <form
              onSubmit={handleCreateLecture}
              className="flex flex-col gap-4 sm:flex-row"
            >
              <input
                type="text"
                value={lectureTitle}
                onChange={(event) =>
                  setLectureTitle(event.target.value)
                }
                placeholder="e.g. Introduction to React"
                className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
              />

              <button
                type="submit"
                disabled={creating}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {creating ? (
                  <>
                    <LoaderCircle
                      size={18}
                      className="animate-spin"
                    />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus size={18} />
                    Create Lecture
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* LECTURE LIST */}

        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">

          <div className="border-b border-gray-100 px-6 py-5">
            <h2 className="text-lg font-semibold text-gray-900">
              Course Lectures
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {lectures.length}{" "}
              {lectures.length === 1
                ? "lecture"
                : "lectures"}
            </p>
          </div>

          {lectures.length === 0 ? (
            <div className="flex min-h-[350px] flex-col items-center justify-center px-6 text-center">

              <div className="rounded-full bg-indigo-50 p-5">
                <BookOpen
                  size={30}
                  className="text-indigo-500"
                />
              </div>

              <h3 className="mt-5 font-semibold text-gray-900">
                No lectures yet
              </h3>

              <p className="mt-1 max-w-md text-sm text-gray-500">
                Start building your course by adding
                your first lecture.
              </p>

              <button
                type="button"
                onClick={() => setShowCreate(true)}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                <Plus size={17} />
                Add First Lecture
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">

              {lectures.map((lecture) => (
                <div
                  key={lecture._id}
                  className="p-5 transition hover:bg-gray-50 sm:p-6"
                >

                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center">

                    {/* LECTURE INFO */}

                    <div className="flex min-w-0 items-center gap-4 lg:w-[45%]">

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-sm font-bold text-indigo-600">
                        {lecture.order}
                      </div>

                      <div className="min-w-0 flex-1">

                        {editingId === lecture._id ? (
                          <div className="flex gap-2">

                            <input
                              autoFocus
                              type="text"
                              value={editingTitle}
                              onChange={(event) =>
                                setEditingTitle(
                                  event.target.value
                                )
                              }
                              onKeyDown={(event) => {
                                if (
                                  event.key === "Enter"
                                ) {
                                  handleUpdateLecture(
                                    lecture._id
                                  );
                                }

                                if (
                                  event.key === "Escape"
                                ) {
                                  setEditingId(null);
                                  setEditingTitle("");
                                }
                              }}
                              className="min-w-0 flex-1 rounded-lg border border-indigo-300 bg-white px-3 py-2 text-sm outline-none focus:ring-4 focus:ring-indigo-100"
                            />

                            <button
                              type="button"
                              onClick={() =>
                                handleUpdateLecture(
                                  lecture._id
                                )
                              }
                              className="rounded-lg bg-emerald-600 p-2 text-white hover:bg-emerald-700"
                            >
                              <Check size={17} />
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setEditingId(null);
                                setEditingTitle("");
                              }}
                              className="rounded-lg bg-gray-100 p-2 text-gray-500 hover:bg-gray-200"
                            >
                              <X size={17} />
                            </button>
                          </div>
                        ) : (
                          <>
                            <h3 className="truncate font-semibold text-gray-900">
                              {lecture.lectureTitle}
                            </h3>

                            <div className="mt-2 flex flex-wrap items-center gap-2">

                              {lecture.videoUrl ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600">
                                  <Check size={13} />
                                  Video uploaded
                                </span>
                              ) : (
                                <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-600">
                                  Video pending
                                </span>
                              )}

                              {lecture.isPreviewFree && (
                                <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-600">
                                  Free Preview
                                </span>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* ACTIONS */}

                    <div className="flex flex-wrap items-center gap-3 lg:flex-1 lg:justify-end">

                      {/* DURATION */}

                      <div className="hidden min-w-[90px] text-center sm:block">
                        <p className="text-xs text-gray-400">
                          Duration
                        </p>

                        <p className="mt-1 text-sm font-semibold text-gray-800">
                          {formatDuration(
                            lecture.videoDuration
                          )}
                        </p>
                      </div>

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
                        className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                          lecture.isPreviewFree
                            ? "bg-indigo-600 text-white hover:bg-indigo-700"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {previewLoadingId ===
                        lecture._id ? (
                          <LoaderCircle
                            size={15}
                            className="animate-spin"
                          />
                        ) : (
                          <PlayCircle size={15} />
                        )}

                        {lecture.isPreviewFree
                          ? "Preview On"
                          : "Preview Off"}
                      </button>

                      {/* VIDEO UPLOAD */}

                      <label
                        className={`inline-flex cursor-pointer items-center gap-2 rounded-xl bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-200 ${
                          uploadingId === lecture._id
                            ? "pointer-events-none opacity-60"
                            : ""
                        }`}
                      >
                        {uploadingId === lecture._id ? (
                          <LoaderCircle
                            size={15}
                            className="animate-spin"
                          />
                        ) : (
                          <Upload size={15} />
                        )}

                        {uploadingId === lecture._id
                          ? "Uploading..."
                          : lecture.videoUrl
                          ? "Replace Video"
                          : "Upload Video"}

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
                              event.target.files?.[0];

                            handleVideoUpload(
                              lecture._id,
                              file
                            );

                            event.target.value = "";
                          }}
                        />
                      </label>

                      {/* EDIT */}

                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(lecture._id);
                          setEditingTitle(
                            lecture.lectureTitle
                          );
                        }}
                        className="rounded-xl bg-gray-100 p-2 text-gray-600 transition hover:bg-gray-200"
                        title="Edit lecture"
                      >
                        <Edit3 size={16} />
                      </button>

                      {/* DELETE */}

                      <button
                        type="button"
                        disabled={
                          deletingId === lecture._id
                        }
                        onClick={() =>
                          handleDeleteLecture(
                            lecture._id
                          )
                        }
                        className="rounded-xl bg-red-50 p-2 text-red-500 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                        title="Delete lecture"
                      >
                        {deletingId === lecture._id ? (
                          <LoaderCircle
                            size={16}
                            className="animate-spin"
                          />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManageLectures;
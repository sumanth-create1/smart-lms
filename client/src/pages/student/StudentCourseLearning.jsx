import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  FileText,
  LoaderCircle,
  Lock,
  PlayCircle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

// =====================================================
// CONSTANTS
// =====================================================

const PROGRESS_SYNC_INTERVAL = 5;
const SEEK_TOLERANCE = 1;
const COMPLETION_PERCENTAGE = 95;

const getVideoStorageKey = (courseId, lectureId) =>
  `smart-lms-video-${courseId}-${lectureId}`;

// =====================================================
// MAIN COMPONENT
// =====================================================

const StudentCourseLearning = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [course, setCourse] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [progress, setProgress] = useState(null);
  const [selectedLecture, setSelectedLecture] = useState(null);

  const [loading, setLoading] = useState(true);
  const [lectureLoading, setLectureLoading] = useState(true);
  const [enrollmentLoading, setEnrollmentLoading] = useState(true);
  const [progressLoading, setProgressLoading] = useState(false);

  const [isEnrolled, setIsEnrolled] = useState(false);

  // ===================================================
  // INITIALIZE
  // ===================================================

  useEffect(() => {
    if (authLoading) return;

    initializeLearning();
  }, [authLoading, user, courseId]);

  const initializeLearning = async () => {
    if (!courseId) {
      toast.error("Invalid course ID.");
      navigate("/courses", { replace: true });
      return;
    }

    if (!user) {
      toast.error("Please login to access this course.");
      navigate("/login", { replace: true });
      return;
    }

    if (user.role !== "student") {
      toast.error("Only students can access the learning page.");
      navigate("/courses", { replace: true });
      return;
    }

    const enrolled = await checkEnrollment();

    if (!enrolled) return;

    await loadLearningData();
  };

  // ===================================================
  // ENROLLMENT
  // ===================================================

  const checkEnrollment = async () => {
    try {
      setEnrollmentLoading(true);

      const response = await api.get(`/enrollment/check/${courseId}`);

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "Unable to verify enrollment."
        );
      }

      const enrolled = Boolean(
        response.data.enrolled ?? response.data.isEnrolled
      );

      setIsEnrolled(enrolled);

      if (!enrolled) {
        toast.error("You are not enrolled in this course.");

        navigate(`/courses/${courseId}`, {
          replace: true,
        });

        return false;
      }

      return true;
    } catch (error) {
      console.error("Enrollment check error:", error);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Unable to verify course enrollment."
      );

      navigate(`/courses/${courseId}`, {
        replace: true,
      });

      return false;
    } finally {
      setEnrollmentLoading(false);
    }
  };

  // ===================================================
  // LOAD DATA
  // ===================================================

  const loadLearningData = async () => {
    try {
      setLoading(true);

      await Promise.all([
        fetchCourse(),
        fetchLectures(),
        fetchProgress(),
      ]);
    } finally {
      setLoading(false);
    }
  };

  // ===================================================
  // FETCH COURSE
  // ===================================================

  const fetchCourse = async () => {
    try {
      const response = await api.get(`/course/${courseId}`);

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "Unable to load course."
        );
      }

      setCourse(response.data.course);
    } catch (error) {
      console.error("Fetch course error:", error);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Unable to load course."
      );

      navigate("/courses", {
        replace: true,
      });
    }
  };

  // ===================================================
  // FETCH LECTURES
  // ===================================================

  const fetchLectures = async () => {
    try {
      setLectureLoading(true);

      const response = await api.get(`/lecture/course/${courseId}`);

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "Unable to load lectures."
        );
      }

      const lectureData =
        response.data.lectures ||
        response.data.courseLectures ||
        [];

      setLectures(lectureData);

      if (lectureData.length > 0) {
        setSelectedLecture(lectureData[0]);
      }
    } catch (error) {
      console.error("Fetch lectures error:", error);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Unable to load course lectures."
      );

      setLectures([]);
    } finally {
      setLectureLoading(false);
    }
  };

  // ===================================================
  // FETCH PROGRESS
  // ===================================================

  const fetchProgress = async () => {
    try {
      const response = await api.get(`/progress/course/${courseId}`);

      if (!response.data?.success) {
        setProgress(null);
        return;
      }

      setProgress(
        response.data.progress ||
          response.data.courseProgress ||
          null
      );
    } catch (error) {
      if (error.response?.status !== 404) {
        console.error("Fetch progress error:", error);
      }

      setProgress(null);
    }
  };

  // ===================================================
  // LECTURE PROGRESS
  // ===================================================

  const getLectureProgress = (lectureId) => {
    if (!progress?.lectures || !lectureId) {
      return null;
    }

    return (
      progress.lectures.find((item) => {
        const id =
          typeof item.lecture === "object"
            ? item.lecture?._id
            : item.lecture;

        return String(id) === String(lectureId);
      }) || null
    );
  };

  // ===================================================
  // COMPLETED LECTURES
  // ===================================================

  const completedLectureIds = useMemo(() => {
    const ids = new Set();

    progress?.lectures?.forEach((item) => {
      if (!item?.completed) return;

      const lectureId =
        typeof item.lecture === "object"
          ? item.lecture?._id
          : item.lecture;

      if (lectureId) {
        ids.add(String(lectureId));
      }
    });

    return ids;
  }, [progress]);

  // ===================================================
  // COURSE PROGRESS
  // ===================================================

  const progressPercentage = useMemo(() => {
    if (!lectures.length) return 0;

    return Math.round(
      Math.min(
        (completedLectureIds.size / lectures.length) * 100,
        100
      )
    );
  }, [lectures.length, completedLectureIds]);

  // ===================================================
  // CURRENT LECTURE
  // ===================================================

  const currentLectureIndex = useMemo(() => {
    if (!selectedLecture) return -1;

    return lectures.findIndex(
      (lecture) =>
        String(lecture._id) === String(selectedLecture._id)
    );
  }, [lectures, selectedLecture]);

  const isLectureCompleted = (lectureId) =>
    Boolean(lectureId) &&
    completedLectureIds.has(String(lectureId));

  // ===================================================
  // SELECT LECTURE
  // ===================================================

  const handleSelectLecture = (lecture) => {
    if (!lecture?._id) return;

    setSelectedLecture(lecture);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ===================================================
  // MARK COMPLETE
  // ===================================================

  const handleMarkComplete = async () => {
    const lectureId = selectedLecture?._id;

    if (!lectureId) {
      toast.error("No lecture selected.");
      return;
    }

    if (isLectureCompleted(lectureId)) {
      toast.info("This lecture is already completed.");
      return;
    }

    try {
      setProgressLoading(true);

      const lectureProgress = getLectureProgress(lectureId);
      const watchedSeconds = Number(
        lectureProgress?.watchedSeconds || 0
      );

      const duration = getLectureDuration(selectedLecture);

      if (duration > 0) {
        const watchedPercentage =
          (watchedSeconds / duration) * 100;

        if (watchedPercentage < COMPLETION_PERCENTAGE) {
          toast.error(
            `Watch at least ${COMPLETION_PERCENTAGE}% of the lecture before completing it.`
          );
          return;
        }
      }

      const response = await api.patch(
        `/progress/complete/${lectureId}`
      );

      if (!response.data?.success) {
        toast.error(
          response.data?.message ||
            "Unable to complete lecture."
        );
        return;
      }

      if (response.data.progress) {
        setProgress(response.data.progress);
      }

      clearSavedVideoPosition(courseId, lectureId);

      toast.success(
        response.data.message || "Lecture completed!"
      );
    } catch (error) {
      console.error("Mark lecture complete error:", error);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Unable to complete lecture."
      );
    } finally {
      setProgressLoading(false);
    }
  };

  // ===================================================
  // UNMARK COMPLETE
  // ===================================================

  const handleUnmarkComplete = async () => {
    const lectureId = selectedLecture?._id;

    if (!lectureId) {
      toast.error("No lecture selected.");
      return;
    }

    if (!isLectureCompleted(lectureId)) {
      toast.info("This lecture is already incomplete.");
      return;
    }

    try {
      setProgressLoading(true);

      const response = await api.patch(
        `/progress/uncomplete/${lectureId}`
      );

      if (!response.data?.success) {
        toast.error(
          response.data?.message ||
            "Unable to mark lecture as incomplete."
        );
        return;
      }

      if (response.data.progress) {
        setProgress(response.data.progress);

        const updatedLectureProgress =
          response.data.progress.lectures?.find(
            (item) => {
              const id =
                typeof item.lecture === "object"
                  ? item.lecture?._id
                  : item.lecture;

              return String(id) === String(lectureId);
            }
          );

        if (
          updatedLectureProgress?.watchedSeconds !==
          undefined
        ) {
          localStorage.setItem(
            getVideoStorageKey(courseId, lectureId),
            String(updatedLectureProgress.watchedSeconds)
          );
        }
      }

      toast.success(
        response.data.message ||
          "Lecture marked as incomplete."
      );
    } catch (error) {
      console.error(
        "Unmark lecture complete error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Unable to mark lecture as incomplete."
      );
    } finally {
      setProgressLoading(false);
    }
  };

  // ===================================================
  // VIDEO COMPLETED
  // ===================================================

  const handleVideoCompleted = async () => {
    const lectureId = selectedLecture?._id;

    if (!lectureId || isLectureCompleted(lectureId)) {
      return;
    }

    await handleMarkComplete();
  };

  // ===================================================
  // NAVIGATION
  // ===================================================

  const handleNextLecture = () => {
    if (currentLectureIndex === -1) return;

    if (currentLectureIndex >= lectures.length - 1) {
      toast.success("You have reached the last lecture.");
      return;
    }

    setSelectedLecture(
      lectures[currentLectureIndex + 1]
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handlePreviousLecture = () => {
    if (currentLectureIndex <= 0) {
      toast.info("This is the first lecture.");
      return;
    }

    setSelectedLecture(
      lectures[currentLectureIndex - 1]
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ===================================================
  // BACK
  // ===================================================

  const handleBack = () => {
    navigate("/dashboard");
  };

  // ===================================================
  // LOADING
  // ===================================================

  if (
    authLoading ||
    loading ||
    enrollmentLoading
  ) {
    return <LearningLoading />;
  }

  if (!isEnrolled || !course) {
    return null;
  }

  // ===================================================
  // NO LECTURES
  // ===================================================

  if (!lectureLoading && lectures.length === 0) {
    return (
      <div className="min-h-screen bg-[#F7F6F2]">
        <LearningHeader
          course={course}
          onBack={handleBack}
        />

        <div className="flex min-h-[70vh] items-center justify-center px-4">
          <EmptyLectures onBack={handleBack} />
        </div>
      </div>
    );
  }

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <div className="min-h-screen bg-[#F7F6F2]">
      <LearningHeader
        course={course}
        onBack={handleBack}
      />

      <div className="mx-auto max-w-[1500px] px-4 py-5 sm:px-6 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-[320px_1fr]">

          {/* SIDEBAR */}
          <LectureSidebar
            course={course}
            lectures={lectures}
            selectedLecture={selectedLecture}
            progressPercentage={progressPercentage}
            completedLectureIds={completedLectureIds}
            onSelectLecture={handleSelectLecture}
          />

          {/* MAIN CONTENT */}
          <main className="min-w-0">

            {/* VIDEO */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <LectureViewer
                lecture={selectedLecture}
                courseId={courseId}
                isCompleted={
                  selectedLecture
                    ? isLectureCompleted(
                        selectedLecture._id
                      )
                    : false
                }
                getLectureProgress={
                  getLectureProgress
                }
                onProgressSaved={setProgress}
                onVideoCompleted={
                  handleVideoCompleted
                }
              />
            </div>

            {/* INFORMATION */}
            <LectureInformation
              lecture={selectedLecture}
              lectureIndex={currentLectureIndex}
              progressLoading={progressLoading}
              isCompleted={
                selectedLecture
                  ? isLectureCompleted(
                      selectedLecture._id
                    )
                  : false
              }
              onMarkComplete={
                handleMarkComplete
              }
              onUnmarkComplete={
                handleUnmarkComplete
              }
            />

            {/* NAVIGATION */}
            <LectureNavigation
              currentLectureIndex={
                currentLectureIndex
              }
              totalLectures={lectures.length}
              onPrevious={
                handlePreviousLecture
              }
              onNext={handleNextLecture}
            />

            {/* COURSE COMPLETED */}
            {progressPercentage === 100 && (
              <CourseCompleted />
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

// =====================================================
// LECTURE SIDEBAR
// =====================================================

const LectureSidebar = ({
  course,
  lectures,
  selectedLecture,
  progressPercentage,
  completedLectureIds,
  onSelectLecture,
}) => {
  return (
    <aside className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm lg:sticky lg:top-5 lg:h-[calc(100vh-120px)]">
      <div className="border-b border-gray-100 p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          Course Content
        </p>

        <h2 className="mt-2 line-clamp-2 text-base font-bold text-gray-900">
          {course?.courseTitle}
        </h2>

        <div className="mt-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">
              Your Progress
            </span>

            <span className="text-xs font-bold text-gray-900">
              {progressPercentage}%
            </span>
          </div>

          <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-gray-900 transition-all duration-500"
              style={{
                width: `${progressPercentage}%`,
              }}
            />
          </div>

          <p className="mt-2 text-xs text-gray-400">
            {completedLectureIds.size} of{" "}
            {lectures.length} lectures completed
          </p>
        </div>
      </div>

      <div className="max-h-[500px] overflow-y-auto lg:max-h-[calc(100vh-350px)]">
        {lectures.map((lecture, index) => {
          const completed =
            completedLectureIds.has(
              String(lecture._id)
            );

          const active =
            String(selectedLecture?._id) ===
            String(lecture._id);

          return (
            <button
              key={lecture._id}
              type="button"
              onClick={() =>
                onSelectLecture(lecture)
              }
              className={`
                flex w-full items-start gap-3
                border-b border-gray-100
                px-5 py-4 text-left transition
                ${
                  active
                    ? "bg-gray-900 text-white"
                    : "bg-white hover:bg-gray-50"
                }
              `}
            >
              <div className="mt-0.5 shrink-0">
                {completed ? (
                  <CheckCircle2
                    size={19}
                    className={
                      active
                        ? "text-white"
                        : "text-green-600"
                    }
                  />
                ) : (
                  <PlayCircle
                    size={19}
                    className={
                      active
                        ? "text-white"
                        : "text-gray-400"
                    }
                  />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p
                  className={`
                    text-[11px] font-semibold uppercase
                    tracking-wide
                    ${
                      active
                        ? "text-gray-300"
                        : "text-gray-400"
                    }
                  `}
                >
                  Lecture {index + 1}
                </p>

                <p
                  className={`
                    mt-1 line-clamp-2 text-sm
                    font-semibold
                    ${
                      active
                        ? "text-white"
                        : "text-gray-800"
                    }
                  `}
                >
                  {lecture.title ||
                    lecture.lectureTitle ||
                    "Untitled Lecture"}
                </p>

                {lecture.duration && (
                  <div
                    className={`
                      mt-2 flex items-center gap-1
                      text-xs
                      ${
                        active
                          ? "text-gray-300"
                          : "text-gray-400"
                      }
                    `}
                  >
                    <Clock3 size={13} />
                    {lecture.duration}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
};

// =====================================================
// LECTURE INFORMATION
// =====================================================

const LectureInformation = ({
  lecture,
  lectureIndex,
  progressLoading,
  isCompleted,
  onMarkComplete,
  onUnmarkComplete,
}) => {
  return (
    <section className="mt-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Lecture{" "}
            {lectureIndex >= 0
              ? lectureIndex + 1
              : ""}
          </p>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">
            {lecture?.title ||
              lecture?.lectureTitle ||
              "Untitled Lecture"}
          </h1>
        </div>

        {isCompleted ? (
          <button
            type="button"
            onClick={onUnmarkComplete}
            disabled={progressLoading}
            className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-green-50 px-5 py-3 text-sm font-semibold text-green-700 transition hover:bg-red-50 hover:text-red-700 disabled:cursor-wait disabled:opacity-70"
          >
            {progressLoading ? (
              <>
                <LoaderCircle
                  size={17}
                  className="animate-spin"
                />
                Updating...
              </>
            ) : (
              <>
                <CheckCircle2 size={17} />
                Completed
              </>
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={onMarkComplete}
            disabled={
              progressLoading || !lecture
            }
            className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-wait disabled:opacity-70"
          >
            {progressLoading ? (
              <>
                <LoaderCircle
                  size={17}
                  className="animate-spin"
                />
                Saving...
              </>
            ) : (
              <>
                <CheckCircle2 size={17} />
                Mark Complete
              </>
            )}
          </button>
        )}
      </div>

      {(lecture?.description ||
        lecture?.content) && (
        <div className="mt-7 border-t border-gray-100 pt-6">
          <h2 className="text-base font-bold text-gray-900">
            About this lecture
          </h2>

          <p className="mt-3 whitespace-pre-line text-sm leading-7 text-gray-600">
            {lecture.description ||
              lecture.content}
          </p>
        </div>
      )}
    </section>
  );
};

// =====================================================
// LECTURE NAVIGATION
// =====================================================

const LectureNavigation = ({
  currentLectureIndex,
  totalLectures,
  onPrevious,
  onNext,
}) => {
  const isFirst =
    currentLectureIndex <= 0;

  const isLast =
    currentLectureIndex >= totalLectures - 1;

  return (
    <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <button
        type="button"
        onClick={onPrevious}
        disabled={isFirst}
        className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft size={18} />
        Previous Lecture
      </button>

      <button
        type="button"
        onClick={onNext}
        disabled={isLast}
        className="flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next Lecture
        <ChevronRight size={18} />
      </button>
    </div>
  );
};

// =====================================================
// COURSE COMPLETED
// =====================================================

const CourseCompleted = () => {
  return (
    <div className="mt-5 rounded-2xl border border-green-200 bg-green-50 p-6">
      <div className="flex items-start gap-4">
        <CheckCircle2
          size={26}
          className="mt-0.5 shrink-0 text-green-600"
        />

        <div>
          <h3 className="font-bold text-green-900">
            Course Completed!
          </h3>

          <p className="mt-1 text-sm leading-6 text-green-700">
            Congratulations! You have completed all
            lectures in this course.
          </p>
        </div>
      </div>
    </div>
  );
};

// =====================================================
// LECTURE VIEWER
// =====================================================

const LectureViewer = ({
  lecture,
  courseId,
  isCompleted,
  getLectureProgress,
  onProgressSaved,
  onVideoCompleted,
}) => {
  if (!lecture) {
    return (
      <div className="flex aspect-video items-center justify-center bg-gray-100">
        <div className="text-center">
          <BookOpen
            size={40}
            className="mx-auto text-gray-300"
          />

          <p className="mt-3 text-sm text-gray-500">
            Select a lecture to begin learning.
          </p>
        </div>
      </div>
    );
  }

  const videoUrl =
    lecture.videoUrl ||
    lecture.video?.url ||
    lecture.lectureVideo?.url ||
    lecture.video;

  const content =
    lecture.content || lecture.description;

  if (videoUrl) {
    return (
      <VideoPlayer
        key={lecture._id}
        videoUrl={videoUrl}
        courseId={courseId}
        lectureId={lecture._id}
        isCompleted={isCompleted}
        getLectureProgress={getLectureProgress}
        onProgressSaved={onProgressSaved}
        onCompleted={onVideoCompleted}
      />
    );
  }

  if (content) {
    return (
      <div className="flex min-h-[400px] items-center justify-center bg-gray-50 p-6 sm:p-10">
        <div className="max-w-3xl">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
            <FileText
              size={25}
              className="text-gray-600"
            />
          </div>

          <p className="whitespace-pre-line text-sm leading-7 text-gray-600">
            {content}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex aspect-video items-center justify-center bg-gray-100">
      <div className="text-center">
        <Lock
          size={38}
          className="mx-auto text-gray-300"
        />

        <p className="mt-3 text-sm font-medium text-gray-500">
          Lecture content is not available yet.
        </p>
      </div>
    </div>
  );
};

// =====================================================
// VIDEO PLAYER
// =====================================================

const VideoPlayer = ({
  videoUrl,
  courseId,
  lectureId,
  isCompleted,
  getLectureProgress,
  onProgressSaved,
  onCompleted,
}) => {
  const videoRef = useRef(null);

  const watchedTimeRef = useRef(0);
  const lastSyncedTimeRef = useRef(0);

  const restoringSeekRef = useRef(false);
  const completionTriggeredRef = useRef(false);
  const savingProgressRef = useRef(false);
  const isPlayingRef = useRef(false);
  const lastProgressUpdateRef = useRef(0);

  const storageKey = getVideoStorageKey(
    courseId,
    lectureId
  );

  // ===================================================
  // INITIAL POSITION
  // ===================================================

  const getInitialWatchedTime = () => {
    const backendProgress =
      getLectureProgress(lectureId);

    const backendTime = Number(
      backendProgress?.watchedSeconds || 0
    );

    const localTime = Number(
      localStorage.getItem(storageKey) || 0
    );

    return Math.max(backendTime, localTime);
  };

  // ===================================================
  // METADATA
  // ===================================================

  const handleLoadedMetadata = (event) => {
    const video = event.currentTarget;

    if (!video) return;

    if (isCompleted) {
      watchedTimeRef.current =
        video.duration || 0;
      return;
    }

    const initialTime =
      getInitialWatchedTime();

    const maxSafeTime = Math.max(
      0,
      (video.duration || initialTime) -
        SEEK_TOLERANCE
    );

    const resumeTime = Math.min(
      initialTime,
      maxSafeTime
    );

    watchedTimeRef.current = resumeTime;
    lastSyncedTimeRef.current =
      Math.floor(resumeTime);
    lastProgressUpdateRef.current =
      Math.floor(resumeTime);

    if (resumeTime > 0) {
      try {
        video.currentTime = resumeTime;
      } catch (error) {
        console.error(
          "Unable to restore video position:",
          error
        );
      }
    }
  };

  // ===================================================
  // SEEK PROTECTION
  // ===================================================

  const handleSeeking = () => {
    const video = videoRef.current;

    if (
      !video ||
      isCompleted ||
      restoringSeekRef.current
    ) {
      return;
    }

    const requestedTime = video.currentTime;
    const allowedTime = watchedTimeRef.current;

    // Backward seeking is allowed.
    if (
      requestedTime <=
      allowedTime + SEEK_TOLERANCE
    ) {
      return;
    }

    // Forward seeking is blocked.
    restoringSeekRef.current = true;

    try {
      video.currentTime = allowedTime;

      toast.error(
        "You cannot skip ahead. Please watch the video."
      );
    } catch (error) {
      console.error(
        "Seek restoration error:",
        error
      );
    } finally {
      setTimeout(() => {
        restoringSeekRef.current = false;
      }, 100);
    }
  };

  // ===================================================
  // TIME UPDATE
  // ===================================================

  const handleTimeUpdate = () => {
    const video = videoRef.current;

    if (!video || isCompleted) return;

    const currentTime = video.currentTime;

    // Extra protection against forward seeking.
    if (
      currentTime >
      watchedTimeRef.current + SEEK_TOLERANCE
    ) {
      if (!restoringSeekRef.current) {
        restoringSeekRef.current = true;

        video.currentTime =
          watchedTimeRef.current;

        setTimeout(() => {
          restoringSeekRef.current = false;
        }, 100);
      }

      return;
    }

    // Only count time while playing.
    if (!isPlayingRef.current) {
      return;
    }

    if (
      currentTime >
      watchedTimeRef.current
    ) {
      watchedTimeRef.current =
        currentTime;
    }

    const watchedSeconds = Math.floor(
      watchedTimeRef.current
    );

    localStorage.setItem(
      storageKey,
      String(watchedSeconds)
    );

    if (
      watchedTimeRef.current -
        lastProgressUpdateRef.current >=
      PROGRESS_SYNC_INTERVAL
    ) {
      lastProgressUpdateRef.current =
        watchedTimeRef.current;

      syncProgress();
    }
  };

  // ===================================================
  // PLAY / PAUSE
  // ===================================================

  const handlePlay = () => {
    isPlayingRef.current = true;
  };

  const handlePause = () => {
    isPlayingRef.current = false;

    syncProgress(true);
  };

  // ===================================================
  // SYNC PROGRESS
  // ===================================================

  const syncProgress = async (force = false) => {
    const video = videoRef.current;

    if (!video || isCompleted) {
      return;
    }

    const watchedTime = Math.floor(
      watchedTimeRef.current
    );

    const previousTime = Math.floor(
      lastSyncedTimeRef.current
    );

    if (watchedTime <= 0) return;

    if (!force && watchedTime <= previousTime) {
      return;
    }

    if (savingProgressRef.current) {
      return;
    }

    try {
      savingProgressRef.current = true;

      const response = await api.patch(
        `/progress/${lectureId}`,
        {
          watchedSeconds: watchedTime,
        }
      );

      if (response.data?.success) {
        lastSyncedTimeRef.current =
          watchedTime;

        localStorage.setItem(
          storageKey,
          String(watchedTime)
        );

        if (response.data.progress) {
          onProgressSaved(
            response.data.progress
          );
        }
      }
    } catch (error) {
      console.error(
        "Video progress sync error:",
        error
      );
    } finally {
      savingProgressRef.current = false;
    }
  };

  // ===================================================
  // VIDEO ENDED
  // ===================================================

  const handleEnded = async () => {
    if (completionTriggeredRef.current) {
      return;
    }

    completionTriggeredRef.current = true;

    const video = videoRef.current;

    try {
      if (video) {
        const duration =
          video.duration || 0;

        watchedTimeRef.current =
          duration;

        const finalSeconds = Math.floor(
          duration
        );

        lastSyncedTimeRef.current =
          finalSeconds;

        localStorage.setItem(
          storageKey,
          String(finalSeconds)
        );

        const response = await api.patch(
          `/progress/${lectureId}`,
          {
            watchedSeconds: finalSeconds,
          }
        );

        if (response.data?.progress) {
          onProgressSaved(
            response.data.progress
          );
        }
      }

      await onCompleted();

      clearSavedVideoPosition(
        courseId,
        lectureId
      );
    } catch (error) {
      console.error(
        "Video completion error:",
        error
      );
    } finally {
      completionTriggeredRef.current = false;
    }
  };

  // ===================================================
  // RESET ON LECTURE CHANGE
  // ===================================================

  useEffect(() => {
    const lectureProgress =
      getLectureProgress(lectureId);

    const backendTime = Number(
      lectureProgress?.watchedSeconds || 0
    );

    const localTime = Number(
      localStorage.getItem(storageKey) || 0
    );

    watchedTimeRef.current = Math.max(
      backendTime,
      localTime
    );

    lastSyncedTimeRef.current =
      backendTime;

    lastProgressUpdateRef.current =
      watchedTimeRef.current;

    restoringSeekRef.current = false;
    completionTriggeredRef.current = false;
    isPlayingRef.current = false;
    savingProgressRef.current = false;
  }, [lectureId, storageKey]);

  // ===================================================
  // PAGE UNLOAD
  // ===================================================

  useEffect(() => {
    const saveBeforeUnload = () => {
      const watchedTime = Math.floor(
        watchedTimeRef.current
      );

      if (watchedTime > 0) {
        localStorage.setItem(
          storageKey,
          String(watchedTime)
        );
      }
    };

    window.addEventListener(
      "beforeunload",
      saveBeforeUnload
    );

    return () => {
      window.removeEventListener(
        "beforeunload",
        saveBeforeUnload
      );
    };
  }, [storageKey]);

  // ===================================================
  // KEYBOARD SEEK PROTECTION
  // ===================================================

  useEffect(() => {
    const handleKeyDown = (event) => {
      const video = videoRef.current;

      if (!video || isCompleted) {
        return;
      }

      // Disable forward keyboard seeking.
      if (
        event.key === "ArrowRight" ||
        event.key === "l" ||
        event.key === "L"
      ) {
        event.preventDefault();

        toast.error(
          "Forward seeking is disabled."
        );

        return;
      }

      // Allow 10-second backward seeking.
      if (
        event.key === "ArrowLeft" ||
        event.key === "j" ||
        event.key === "J"
      ) {
        event.preventDefault();

        video.currentTime = Math.max(
          0,
          video.currentTime - 10
        );
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [isCompleted]);

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <div className="relative bg-black">
      <video
        ref={videoRef}
        src={videoUrl}
        controls
        controlsList="nodownload"
        disablePictureInPicture
        playsInline
        preload="metadata"
        onLoadedMetadata={
          handleLoadedMetadata
        }
        onSeeking={handleSeeking}
        onTimeUpdate={handleTimeUpdate}
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={handleEnded}
        className="aspect-video h-auto w-full bg-black object-contain"
      >
        Your browser does not support the video
        element.
      </video>
    </div>
  );
};

// =====================================================
// HELPERS
// =====================================================

const getLectureDuration = (lecture) => {
  if (!lecture) return 0;

  const duration =
    lecture.videoDuration ??
    lecture.durationSeconds ??
    lecture.duration ??
    0;

  const numericDuration = Number(duration);

  return Number.isFinite(numericDuration)
    ? numericDuration
    : 0;
};

const clearSavedVideoPosition = (
  courseId,
  lectureId
) => {
  if (!courseId || !lectureId) return;

  localStorage.removeItem(
    getVideoStorageKey(courseId, lectureId)
  );
};

// =====================================================
// EMPTY LECTURES
// =====================================================

const EmptyLectures = ({ onBack }) => {
  return (
    <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
        <BookOpen
          size={26}
          className="text-gray-500"
        />
      </div>

      <h2 className="mt-5 text-xl font-bold text-gray-900">
        No lectures available
      </h2>

      <p className="mt-2 text-sm leading-6 text-gray-500">
        The instructor hasn't added any lectures
        to this course yet.
      </p>

      <button
        type="button"
        onClick={onBack}
        className="mt-6 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
      >
        Back to Dashboard
      </button>
    </div>
  );
};

// =====================================================
// HEADER
// =====================================================

const LearningHeader = ({
  course,
  onBack,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex min-h-[70px] max-w-[1500px] items-center gap-4 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onBack}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
        >
          <ArrowLeft size={19} />
        </button>

        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            Learning
          </p>

          <h1 className="truncate text-sm font-bold text-gray-900 sm:text-base">
            {course?.courseTitle || "Course"}
          </h1>
        </div>
      </div>
    </header>
  );
};

// =====================================================
// LOADING
// =====================================================

const LearningLoading = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F7F6F2]">
      <div className="text-center">
        <LoaderCircle
          size={40}
          className="mx-auto animate-spin text-gray-900"
        />

        <p className="mt-4 text-sm text-gray-500">
          Loading your course...
        </p>
      </div>
    </div>
  );
};

export default StudentCourseLearning;


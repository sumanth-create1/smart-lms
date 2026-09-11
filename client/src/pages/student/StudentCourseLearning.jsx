import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  FileText,
  Flame,
  Info,
  Keyboard,
  LoaderCircle,
  Lock,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  PlayCircle,
  Search,
  Shield,
  SkipBack,
  SkipForward,
  Sparkles,
  Sword,
  Trophy,
  Volume2,
  X,
} from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

import AchievementUnlockCelebration from "./components/student/AchievementUnlockCelebration";

// =====================================================
// CONSTANTS
// =====================================================

const PROGRESS_SYNC_INTERVAL = 5;
const SEEK_TOLERANCE = 1;
const MAX_FORWARD_SEEK = 15;
const COMPLETION_PERCENTAGE = 95;

const getVideoStorageKey = (courseId, lectureId) =>
  `smart-lms-video-${courseId}-${lectureId}`;

// =====================================================
// MAIN COMPONENT
// =====================================================

const StudentCourseLearning = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const {
    user,
    loading: authLoading,
  } = useAuth();

  const [course, setCourse] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [progress, setProgress] = useState(null);
  const [selectedLecture, setSelectedLecture] =
    useState(null);

  const [loading, setLoading] = useState(true);
  const [lectureLoading, setLectureLoading] =
    useState(true);
  const [enrollmentLoading, setEnrollmentLoading] =
    useState(true);
  const [progressLoading, setProgressLoading] =
    useState(false);

  const [isEnrolled, setIsEnrolled] = useState(false);

  const [unlockedAchievements, setUnlockedAchievements] =
    useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [theaterMode, setTheaterMode] = useState(false);
  const [showShortcuts, setShowShortcuts] =
    useState(false);

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
      toast.error(
        "Only students can access the learning page."
      );
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

      const response = await api.get(
        `/enrollment/check/${courseId}`
      );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
            "Unable to verify enrollment."
        );
      }

      const enrolled = Boolean(
        response.data.enrolled ??
          response.data.isEnrolled
      );

      setIsEnrolled(enrolled);

      if (!enrolled) {
        toast.error(
          "You are not enrolled in this course."
        );

        navigate(`/courses/${courseId}`, {
          replace: true,
        });

        return false;
      }

      return true;
    } catch (error) {
      console.error(
        "Enrollment check error:",
        error
      );

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
      const response = await api.get(
        `/course/${courseId}`
      );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
            "Unable to load course."
        );
      }

      setCourse(response.data.course);
    } catch (error) {
      console.error(
        "Fetch course error:",
        error
      );

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

      const response = await api.get(
        `/lecture/course/${courseId}`
      );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
            "Unable to load lectures."
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
      console.error(
        "Fetch lectures error:",
        error
      );

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
      const response = await api.get(
        `/progress/course/${courseId}`
      );

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
        console.error(
          "Fetch progress error:",
          error
        );
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

        return (
          String(id) === String(lectureId)
        );
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
        (completedLectureIds.size /
          lectures.length) *
          100,
        100
      )
    );
  }, [
    lectures.length,
    completedLectureIds,
  ]);

  // ===================================================
  // SEARCHED LECTURES
  // ===================================================

  const filteredLectures = useMemo(() => {
    const query =
      searchTerm.trim().toLowerCase();

    if (!query) return lectures;

    return lectures.filter((lecture) => {
      const title =
        lecture.title ||
        lecture.lectureTitle ||
        "";

      return title
        .toLowerCase()
        .includes(query);
    });
  }, [lectures, searchTerm]);

  // ===================================================
  // CURRENT LECTURE
  // ===================================================

  const currentLectureIndex = useMemo(() => {
    if (!selectedLecture) return -1;

    return lectures.findIndex(
      (lecture) =>
        String(lecture._id) ===
        String(selectedLecture._id)
    );
  }, [lectures, selectedLecture]);

  const isLectureCompleted = (lectureId) =>
    Boolean(lectureId) &&
    completedLectureIds.has(
      String(lectureId)
    );

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
  // ACHIEVEMENT
  // ===================================================

  const showAchievementCelebration = (
    newlyUnlocked = []
  ) => {
    if (
      !Array.isArray(newlyUnlocked) ||
      newlyUnlocked.length === 0
    ) {
      return;
    }

    setUnlockedAchievements(
      newlyUnlocked
    );
  };

  // ===================================================
  // MARK COMPLETE
  // ===================================================

  const handleMarkComplete = async () => {
    const lectureId =
      selectedLecture?._id;

    if (!lectureId) {
      toast.error("No lecture selected.");
      return;
    }

    if (isLectureCompleted(lectureId)) {
      toast.info(
        "This lecture is already completed."
      );
      return;
    }

    try {
      setProgressLoading(true);

      const lectureProgress =
        getLectureProgress(lectureId);

      const watchedSeconds = Number(
        lectureProgress?.watchedSeconds || 0
      );

      const duration =
        getLectureDuration(
          selectedLecture
        );

      if (duration > 0) {
        const watchedPercentage =
          (watchedSeconds / duration) *
          100;

        if (
          watchedPercentage <
          COMPLETION_PERCENTAGE
        ) {
          toast.error(
            `Watch at least ${COMPLETION_PERCENTAGE}% before completing this lecture.`
          );

          return;
        }
      }

      // IMPORTANT:
      // Completion endpoint is different
      // from progress save endpoint.
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
        setProgress(
          response.data.progress
        );
      }

      clearSavedVideoPosition(
        courseId,
        lectureId
      );

      toast.success(
        response.data.message ||
          "Lecture completed!"
      );

      showAchievementCelebration(
        response.data.newlyUnlocked ||
          []
      );
    } catch (error) {
      console.error(
        "Mark lecture complete error:",
        error.response?.data || error
      );

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
    const lectureId =
      selectedLecture?._id;

    if (!lectureId) {
      toast.error("No lecture selected.");
      return;
    }

    if (!isLectureCompleted(lectureId)) {
      toast.info(
        "This lecture is already incomplete."
      );
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
            "Unable to mark lecture incomplete."
        );

        return;
      }

      if (response.data.progress) {
        setProgress(
          response.data.progress
        );

        const updated =
          response.data.progress.lectures?.find(
            (item) => {
              const id =
                typeof item.lecture ===
                "object"
                  ? item.lecture?._id
                  : item.lecture;

              return (
                String(id) ===
                String(lectureId)
              );
            }
          );

        if (
          updated?.watchedSeconds !==
          undefined
        ) {
          localStorage.setItem(
            getVideoStorageKey(
              courseId,
              lectureId
            ),
            String(
              updated.watchedSeconds
            )
          );
        }
      }

      toast.success(
        response.data.message ||
          "Lecture marked incomplete."
      );
    } catch (error) {
      console.error(
        "Unmark lecture error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Unable to update lecture."
      );
    } finally {
      setProgressLoading(false);
    }
  };

  // ===================================================
  // VIDEO COMPLETED
  // ===================================================

  const handleVideoCompleted = async () => {
    const lectureId =
      selectedLecture?._id;

    if (
      !lectureId ||
      isLectureCompleted(lectureId)
    ) {
      return;
    }

    await handleMarkComplete();
  };

  // ===================================================
  // NAVIGATION
  // ===================================================

  const handleNextLecture = () => {
    if (currentLectureIndex === -1)
      return;

    if (
      currentLectureIndex >=
      lectures.length - 1
    ) {
      toast.success(
        "You have reached the final lecture."
      );

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
      toast.info(
        "This is the first lecture."
      );

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

  if (
    !lectureLoading &&
    lectures.length === 0
  ) {
    return (
      <div className="min-h-screen bg-[#090b0d] text-slate-200">
        <LearningHeader
          course={course}
          onBack={handleBack}
        />

        <div className="flex min-h-[70vh] items-center justify-center px-4">
          <EmptyLectures
            onBack={handleBack}
          />
        </div>
      </div>
    );
  }

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#080a0c] text-slate-200">

      {/* WINTER ATMOSPHERE */}

      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-cyan-950/20 blur-[120px]" />

        <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-red-950/20 blur-[130px]" />

        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-amber-950/10 blur-[120px]" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <LearningHeader
        course={course}
        onBack={handleBack}
      />

      <div
        className={`relative z-10 mx-auto px-4 py-6 sm:px-6 lg:px-8 ${
          theaterMode
            ? "max-w-[1800px]"
            : "max-w-[1550px]"
        }`}
      >

        {/* TOP TITLE */}

        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">

          <div>
            <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-amber-500">
              <Sword size={13} />
              The Seven Paths of Knowledge
            </div>

            <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
              {course.courseTitle}
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Continue your journey through the
              realm of knowledge.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">

            <button
              type="button"
              onClick={() =>
                setShowShortcuts(
                  (value) => !value
                )
              }
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:border-amber-700 hover:text-amber-400"
            >
              <Keyboard size={15} />
              Shortcuts
            </button>

            <button
              type="button"
              onClick={() =>
                setTheaterMode(
                  (value) => !value
                )
              }
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:border-cyan-700 hover:text-cyan-400"
            >
              {theaterMode ? (
                <Minimize2 size={15} />
              ) : (
                <Maximize2 size={15} />
              )}

              {theaterMode
                ? "Exit Theater"
                : "Theater Mode"}
            </button>
          </div>
        </div>

        {/* SHORTCUT PANEL */}

        {showShortcuts && (
          <div className="mb-5 rounded-2xl border border-amber-900/50 bg-[#111417] p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Keyboard
                  size={17}
                  className="text-amber-500"
                />

                <h3 className="font-bold text-white">
                  Battle Commands
                </h3>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowShortcuts(false)
                }
                className="text-slate-500 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Shortcut
                keys="Space"
                label="Play / Pause"
              />

              <Shortcut
                keys="←"
                label="Rewind 10 sec"
              />

              <Shortcut
                keys="→"
                label="Forward up to 15 sec"
              />

              <Shortcut
                keys="F"
                label="Fullscreen"
              />

              <Shortcut
                keys="N"
                label="Next lecture"
              />

              <Shortcut
                keys="P"
                label="Previous lecture"
              />
            </div>
          </div>
        )}

        <div
          className={`grid gap-6 ${
            theaterMode
              ? "grid-cols-1"
              : "lg:grid-cols-[330px_minmax(0,1fr)]"
          }`}
        >

          {/* SIDEBAR */}

          {!theaterMode && (
            <LectureSidebar
              course={course}
              lectures={filteredLectures}
              allLecturesCount={
                lectures.length
              }
              selectedLecture={
                selectedLecture
              }
              progressPercentage={
                progressPercentage
              }
              completedLectureIds={
                completedLectureIds
              }
              searchTerm={searchTerm}
              setSearchTerm={
                setSearchTerm
              }
              onSelectLecture={
                handleSelectLecture
              }
            />
          )}

          {/* MAIN */}

          <main className="min-w-0">

            {/* VIDEO */}

            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-black shadow-[0_20px_80px_rgba(0,0,0,.5)]">

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
                onProgressSaved={
                  setProgress
                }
                onVideoCompleted={
                  handleVideoCompleted
                }
              />
            </div>

            {/* VIDEO STATUS */}

            {selectedLecture && (
              <VideoStatusBar
                lecture={
                  selectedLecture
                }
                progress={
                  getLectureProgress(
                    selectedLecture._id
                  )
                }
                isCompleted={isLectureCompleted(
                  selectedLecture._id
                )}
              />
            )}

            {/* INFORMATION */}

            <LectureInformation
              lecture={selectedLecture}
              lectureIndex={
                currentLectureIndex
              }
              progressLoading={
                progressLoading
              }
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
              totalLectures={
                lectures.length
              }
              onPrevious={
                handlePreviousLecture
              }
              onNext={
                handleNextLecture
              }
            />

            {/* COURSE COMPLETED */}

            {progressPercentage === 100 && (
              <CourseCompleted />
            )}
          </main>
        </div>
      </div>

      {/* ACHIEVEMENT */}

      {unlockedAchievements.length >
        0 && (
        <AchievementUnlockCelebration
          achievements={
            unlockedAchievements
          }
          onClose={() =>
            setUnlockedAchievements([])
          }
        />
      )}
    </div>
  );
};

// =====================================================
// SIDEBAR
// =====================================================

const LectureSidebar = ({
  course,
  lectures,
  allLecturesCount,
  selectedLecture,
  progressPercentage,
  completedLectureIds,
  searchTerm,
  setSearchTerm,
  onSelectLecture,
}) => {
  return (
    <aside className="overflow-hidden rounded-2xl border border-slate-800 bg-[#0d1012] shadow-2xl lg:sticky lg:top-[90px] lg:h-[calc(100vh-115px)]">

      {/* HEADER */}

      <div className="border-b border-slate-800 p-5">

        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-amber-500">
          <Shield size={13} />
          Course Chronicle
        </div>

        <h2 className="mt-3 line-clamp-2 text-sm font-bold text-white">
          {course?.courseTitle}
        </h2>

        {/* PROGRESS */}

        <div className="mt-5">

          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Realm Progress
            </span>

            <span className="text-sm font-black text-amber-400">
              {progressPercentage}%
            </span>
          </div>

          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-700 via-amber-500 to-yellow-300 transition-all duration-700"
              style={{
                width: `${progressPercentage}%`,
              }}
            />
          </div>

          <div className="mt-2 flex items-center justify-between text-[10px] text-slate-600">
            <span>
              {completedLectureIds.size} completed
            </span>

            <span>
              {allLecturesCount} total
            </span>
          </div>
        </div>

        {/* SEARCH */}

        <div className="relative mt-5">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
          />

          <input
            type="text"
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(
                event.target.value
              )
            }
            placeholder="Search lectures..."
            className="w-full rounded-xl border border-slate-800 bg-[#080a0c] py-2.5 pl-9 pr-3 text-xs text-slate-200 outline-none placeholder:text-slate-600 focus:border-amber-700"
          />
        </div>
      </div>

      {/* LECTURES */}

      <div className="max-h-[calc(100vh-340px)] overflow-y-auto">

        {lectures.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-600">
            No lectures found.
          </div>
        ) : (
          lectures.map(
            (lecture, index) => {
              const completed =
                completedLectureIds.has(
                  String(lecture._id)
                );

              const active =
                String(
                  selectedLecture?._id
                ) ===
                String(lecture._id);

              return (
                <button
                  key={lecture._id}
                  type="button"
                  onClick={() =>
                    onSelectLecture(
                      lecture
                    )
                  }
                  className={`group flex w-full items-start gap-3 border-b border-slate-800/70 px-5 py-4 text-left transition ${
                    active
                      ? "bg-gradient-to-r from-amber-950/40 to-transparent"
                      : "hover:bg-slate-900/70"
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {completed ? (
                      <CheckCircle2
                        size={19}
                        className="text-emerald-500"
                      />
                    ) : (
                      <PlayCircle
                        size={19}
                        className={
                          active
                            ? "text-amber-400"
                            : "text-slate-600 group-hover:text-slate-400"
                        }
                      />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">

                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-600">
                      Chapter {index + 1}
                    </p>

                    <p
                      className={`mt-1 line-clamp-2 text-sm font-semibold ${
                        active
                          ? "text-amber-300"
                          : "text-slate-300"
                      }`}
                    >
                      {lecture.title ||
                        lecture.lectureTitle ||
                        "Untitled Lecture"}
                    </p>

                    {lecture.duration && (
                      <div className="mt-2 flex items-center gap-1 text-[10px] text-slate-600">
                        <Clock3 size={12} />
                        {lecture.duration}
                      </div>
                    )}
                  </div>
                </button>
              );
            }
          )
        )}
      </div>
    </aside>
  );
};

// =====================================================
// VIDEO STATUS
// =====================================================

const VideoStatusBar = ({
  lecture,
  progress,
  isCompleted,
}) => {
  const duration =
    getLectureDuration(lecture);

  const watched =
    Number(
      progress?.watchedSeconds || 0
    );

  const percentage =
    duration > 0
      ? Math.min(
          Math.round(
            (watched / duration) * 100
          ),
          100
        )
      : 0;

  return (
    <div className="mt-3 grid gap-3 sm:grid-cols-3">

      <StatusCard
        icon={Clock3}
        label="Watched"
        value={`${formatTime(watched)} / ${formatTime(duration)}`}
      />

      <StatusCard
        icon={Flame}
        label="Lecture Progress"
        value={`${percentage}%`}
      />

      <StatusCard
        icon={
          isCompleted
            ? Trophy
            : Sword
        }
        label="Status"
        value={
          isCompleted
            ? "Conquered"
            : "In Progress"
        }
      />
    </div>
  );
};

const StatusCard = ({
  icon: Icon,
  label,
  value,
}) => {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-[#0d1012] px-4 py-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-950/30 text-amber-500">
        <Icon size={16} />
      </div>

      <div>
        <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-600">
          {label}
        </p>

        <p className="mt-0.5 text-xs font-bold text-slate-300">
          {value}
        </p>
      </div>
    </div>
  );
};

// =====================================================
// INFORMATION
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
    <section className="mt-5 rounded-2xl border border-slate-800 bg-[#0d1012] p-6 shadow-2xl sm:p-8">

      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

        <div className="min-w-0">

          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-amber-500">
            <Sparkles size={12} />
            Chapter{" "}
            {lectureIndex >= 0
              ? lectureIndex + 1
              : ""}
          </div>

          <h1 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl">
            {lecture?.title ||
              lecture?.lectureTitle ||
              "Untitled Lecture"}
          </h1>
        </div>

        {isCompleted ? (
          <button
            type="button"
            onClick={
              onUnmarkComplete
            }
            disabled={
              progressLoading
            }
            className="flex shrink-0 items-center justify-center gap-2 rounded-xl border border-emerald-900 bg-emerald-950/30 px-5 py-3 text-sm font-bold text-emerald-400 transition hover:border-red-900 hover:bg-red-950/30 hover:text-red-400 disabled:opacity-50"
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
                <CheckCircle2
                  size={17}
                />
                Conquered
              </>
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={
              onMarkComplete
            }
            disabled={
              progressLoading ||
              !lecture
            }
            className="flex shrink-0 items-center justify-center gap-2 rounded-xl border border-amber-700/50 bg-gradient-to-r from-amber-800 to-amber-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-amber-950/20 transition hover:from-amber-700 hover:to-amber-500 disabled:cursor-wait disabled:opacity-50"
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
                <CheckCircle2
                  size={17}
                />
                Mark Complete
              </>
            )}
          </button>
        )}
      </div>

      {(lecture?.description ||
        lecture?.content) && (
        <div className="mt-7 border-t border-slate-800 pt-6">

          <div className="flex items-center gap-2">
            <FileText
              size={16}
              className="text-amber-500"
            />

            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">
              Maester's Notes
            </h2>
          </div>

          <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-500">
            {lecture.description ||
              lecture.content}
          </p>
        </div>
      )}
    </section>
  );
};

// =====================================================
// NAVIGATION
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
    currentLectureIndex >=
    totalLectures - 1;

  return (
    <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

      <button
        type="button"
        onClick={onPrevious}
        disabled={isFirst}
        className="group flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-[#0d1012] px-5 py-3 text-sm font-bold text-slate-400 transition hover:border-slate-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
      >
        <ChevronLeft
          size={18}
          className="transition group-hover:-translate-x-1"
        />
        Previous Chapter
      </button>

      <button
        type="button"
        onClick={onNext}
        disabled={isLast}
        className="group flex items-center justify-center gap-2 rounded-xl border border-amber-800/50 bg-amber-950/20 px-5 py-3 text-sm font-bold text-amber-400 transition hover:bg-amber-900/30 disabled:cursor-not-allowed disabled:opacity-30"
      >
        Next Chapter
        <ChevronRight
          size={18}
          className="transition group-hover:translate-x-1"
        />
      </button>
    </div>
  );
};

// =====================================================
// COURSE COMPLETED
// =====================================================

const CourseCompleted = () => {
  return (
    <div className="relative mt-5 overflow-hidden rounded-2xl border border-amber-800/50 bg-gradient-to-r from-amber-950/40 via-[#15110b] to-red-950/30 p-6">

      <div className="absolute right-5 top-5 opacity-10">
        <Trophy size={80} />
      </div>

      <div className="relative flex items-start gap-4">

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-amber-700/40 bg-amber-950/40 text-amber-400">
          <Trophy size={24} />
        </div>

        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-amber-500">
            The Realm Remembers
          </p>

          <h3 className="mt-1 text-lg font-black text-white">
            Course Conquered
          </h3>

          <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500">
            You have completed every chapter
            in this course. Your knowledge has
            been forged through every lesson.
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
      <div className="flex aspect-video items-center justify-center bg-[#0d1012]">
        <div className="text-center">
          <BookOpen
            size={40}
            className="mx-auto text-slate-700"
          />

          <p className="mt-3 text-sm text-slate-500">
            Choose a chapter to begin.
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
    lecture.content ||
    lecture.description;

  if (videoUrl) {
    return (
      <VideoPlayer
        key={lecture._id}
        videoUrl={videoUrl}
        courseId={courseId}
        lectureId={lecture._id}
        isCompleted={isCompleted}
        getLectureProgress={
          getLectureProgress
        }
        onProgressSaved={
          onProgressSaved
        }
        onCompleted={
          onVideoCompleted
        }
      />
    );
  }

  if (content) {
    return (
      <div className="flex min-h-[400px] items-center justify-center bg-[#0d1012] p-6 sm:p-10">
        <div className="max-w-3xl">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 text-amber-500">
            <FileText size={25} />
          </div>

          <p className="whitespace-pre-line text-sm leading-7 text-slate-500">
            {content}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex aspect-video items-center justify-center bg-[#0d1012]">
      <div className="text-center">
        <Lock
          size={38}
          className="mx-auto text-slate-700"
        />

        <p className="mt-3 text-sm font-medium text-slate-500">
          This chapter has not been unlocked yet.
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

  // ---------------------------------------------------
  // LEGITIMATE WATCHED POSITION
  // ---------------------------------------------------

  const furthestWatchedRef =
    useRef(0);

  const serverWatchedRef =
    useRef(0);

  const previousTimeRef =
    useRef(0);

  // ---------------------------------------------------
  // FORWARD SEEK STATE
  // ---------------------------------------------------

  const forwardSeekActiveRef =
    useRef(false);

  const forwardSeekStartRef =
    useRef(0);

  const forwardSeekTargetRef =
    useRef(0);

  const forwardSeekRequiredRef =
    useRef(0);

  const forwardSeekAccumulatedRef =
    useRef(0);

  // ---------------------------------------------------
  // CONTROL REFS
  // ---------------------------------------------------

  const restoringSeekRef =
    useRef(false);

  const completionTriggeredRef =
    useRef(false);

  const savingProgressRef =
    useRef(false);

  const isPlayingRef =
    useRef(false);

  const lastSyncedTimeRef =
    useRef(0);

  const lastProgressUpdateRef =
    useRef(0);

  const storageKey =
    getVideoStorageKey(
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
      localStorage.getItem(
        storageKey
      ) || 0
    );

    /*
      Backend is authoritative.

      If local storage is ahead by a large
      amount, don't trust it because the user
      could have manipulated localStorage.
    */

    if (backendTime > 0) {
      return backendTime;
    }

    // New lecture: only trust a small
    // local resume position.
    return Math.min(
      localTime,
      MAX_FORWARD_SEEK
    );
  };

  // ===================================================
  // METADATA
  // ===================================================

  const handleLoadedMetadata = (
    event
  ) => {
    const video =
      event.currentTarget;

    if (!video) return;

    const backendProgress =
      getLectureProgress(lectureId);

    const backendTime = Number(
      backendProgress?.watchedSeconds || 0
    );

    serverWatchedRef.current =
      backendTime;

    if (isCompleted) {
      furthestWatchedRef.current =
        video.duration || 0;

      previousTimeRef.current =
        video.duration || 0;

      return;
    }

    const initialTime =
      getInitialWatchedTime();

    const maxSafeTime = Math.max(
      0,
      (video.duration ||
        initialTime) -
        SEEK_TOLERANCE
    );

    const resumeTime = Math.min(
      initialTime,
      maxSafeTime
    );

    furthestWatchedRef.current =
      resumeTime;

    previousTimeRef.current =
      resumeTime;

    lastSyncedTimeRef.current =
      backendTime;

    lastProgressUpdateRef.current =
      resumeTime;

    forwardSeekActiveRef.current =
      false;

    forwardSeekAccumulatedRef.current =
      0;

    if (resumeTime > 0) {
      try {
        video.currentTime =
          resumeTime;
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

    const requestedTime =
      video.currentTime;

    const furthest =
      furthestWatchedRef.current;

    // -----------------------------------------------
    // BACKWARD SEEK
    // -----------------------------------------------

    if (
      requestedTime <=
      furthest + SEEK_TOLERANCE
    ) {
      forwardSeekActiveRef.current =
        false;

      forwardSeekAccumulatedRef.current =
        0;

      return;
    }

    // -----------------------------------------------
    // FORWARD SEEK
    // -----------------------------------------------

    const maximumAllowed =
      furthest +
      MAX_FORWARD_SEEK;

    if (
      requestedTime <=
      maximumAllowed
    ) {
      /*
        Allow up to 15 seconds forward.

        BUT:

        The skipped section becomes "debt".

        Example:

        watched = 100
        seek = 115

        User can move to 115,
        but must actually watch
        100 -> 115 before progress
        can move beyond 115.
      */

      forwardSeekActiveRef.current =
        true;

      forwardSeekStartRef.current =
        furthest;

      forwardSeekTargetRef.current =
        requestedTime;

      forwardSeekRequiredRef.current =
        requestedTime - furthest;

      forwardSeekAccumulatedRef.current =
        0;

      previousTimeRef.current =
        requestedTime;

      toast(
        "15-second jump allowed. Watch the skipped section to continue.",
        {
          icon: "⚔️",
          duration: 2500,
        }
      );

      return;
    }

    // -----------------------------------------------
    // TOO LARGE
    // -----------------------------------------------

    restoringSeekRef.current =
      true;

    try {
      video.currentTime =
        furthest;

      previousTimeRef.current =
        furthest;

      toast.error(
        `Forward jumps are limited to ${MAX_FORWARD_SEEK} seconds.`
      );
    } finally {
      setTimeout(() => {
        restoringSeekRef.current =
          false;
      }, 100);
    }
  };

  // ===================================================
  // TIME UPDATE
  // ===================================================

  const handleTimeUpdate = () => {
    const video = videoRef.current;

    if (
      !video ||
      isCompleted
    ) {
      return;
    }

    const currentTime =
      video.currentTime;

    const previousTime =
      previousTimeRef.current;

    // -----------------------------------------------
    // BACKWARD / NORMAL PLAYBACK
    // -----------------------------------------------

    if (
      currentTime <
      previousTime - SEEK_TOLERANCE
    ) {
      previousTimeRef.current =
        currentTime;

      return;
    }

    // -----------------------------------------------
    // FORWARD SEEK DEBT
    // -----------------------------------------------

    if (
      forwardSeekActiveRef.current
    ) {
      if (isPlayingRef.current) {
        const delta =
          currentTime -
          previousTime;

        if (
          delta > 0 &&
          delta < 2
        ) {
          forwardSeekAccumulatedRef.current +=
            delta;
        }
      }

      const required =
        forwardSeekRequiredRef.current;

      const accumulated =
        forwardSeekAccumulatedRef.current;

      /*
        Once the user has watched the skipped
        section, unlock the new position.
      */

      if (
        accumulated >=
        required - SEEK_TOLERANCE
      ) {
        furthestWatchedRef.current =
          Math.max(
            furthestWatchedRef.current,
            forwardSeekTargetRef.current
          );

        forwardSeekActiveRef.current =
          false;

        forwardSeekAccumulatedRef.current =
          0;
      }

      previousTimeRef.current =
        currentTime;

      return;
    }

    // -----------------------------------------------
    // NORMAL PLAYBACK
    // -----------------------------------------------

    if (
      isPlayingRef.current &&
      currentTime >
        furthestWatchedRef.current
    ) {
      const delta =
        currentTime -
        previousTime;

      /*
        Prevent abnormal jumps from being
        counted as watched.
      */

      if (
        delta >= 0 &&
        delta < 2
      ) {
        furthestWatchedRef.current =
          currentTime;
      }
    }

    previousTimeRef.current =
      currentTime;

    // -----------------------------------------------
    // SAVE LOCAL POSITION
    // -----------------------------------------------

    const watchedSeconds =
      Math.floor(
        furthestWatchedRef.current
      );

    localStorage.setItem(
      storageKey,
      String(watchedSeconds)
    );

    // -----------------------------------------------
    // PERIODIC BACKEND SYNC
    // -----------------------------------------------

    if (
      furthestWatchedRef.current -
        lastProgressUpdateRef.current >=
      PROGRESS_SYNC_INTERVAL
    ) {
      lastProgressUpdateRef.current =
        furthestWatchedRef.current;

      syncProgress();
    }
  };

  // ===================================================
  // PLAY
  // ===================================================

  const handlePlay = () => {
    isPlayingRef.current = true;
  };

  // ===================================================
  // PAUSE
  // ===================================================

  const handlePause = () => {
    isPlayingRef.current = false;

    syncProgress(true);
  };

  // ===================================================
  // SYNC PROGRESS
  // ===================================================

  const syncProgress = async (
    force = false
  ) => {
    const video =
      videoRef.current;

    if (
      !video ||
      isCompleted
    ) {
      return;
    }

    const watchedTime =
      Math.floor(
        furthestWatchedRef.current
      );

    const previousSynced =
      Math.floor(
        lastSyncedTimeRef.current
      );

    if (watchedTime <= 0) {
      return;
    }

    if (
      !force &&
      watchedTime <=
        previousSynced
    ) {
      return;
    }

    if (
      savingProgressRef.current
    ) {
      return;
    }

    try {
      savingProgressRef.current =
        true;

      /*
        IMPORTANT:

        Only send the legitimate watched
        position.

        Never send video.currentTime directly.
      */

      const response =
        await api.patch(
          `/progress/${lectureId}`,
          {
            watchedSeconds:
              watchedTime,
          }
        );

      if (
        response.data?.success
      ) {
        lastSyncedTimeRef.current =
          watchedTime;

        serverWatchedRef.current =
          watchedTime;

        localStorage.setItem(
          storageKey,
          String(watchedTime)
        );

        if (
          response.data.progress
        ) {
          onProgressSaved(
            response.data.progress
          );
        }
      }
    } catch (error) {
      console.error(
        "Video progress sync error:",
        error.response?.data ||
          error
      );

      /*
        Don't spam the user with a toast
        every 5 seconds.
      */
    } finally {
      savingProgressRef.current =
        false;
    }
  };

  // ===================================================
  // VIDEO ENDED
  // ===================================================

  const handleEnded = async () => {
    if (
      completionTriggeredRef.current
    ) {
      return;
    }

    const video =
      videoRef.current;

    if (!video) return;

    const duration =
      video.duration || 0;

    const furthest =
      furthestWatchedRef.current;

    const percentage =
      duration > 0
        ? (furthest / duration) *
          100
        : 100;

    /*
      VERY IMPORTANT:

      Never blindly set watchedTime = duration.

      Otherwise dragging the progress bar
      to the end would create fake progress.
    */

    if (
      duration > 0 &&
      percentage <
        COMPLETION_PERCENTAGE
    ) {
      completionTriggeredRef.current =
        false;

      video.currentTime =
        furthest;

      previousTimeRef.current =
        furthest;

      toast.error(
        `You still need to watch ${COMPLETION_PERCENTAGE}% of this lecture.`
      );

      return;
    }

    completionTriggeredRef.current =
      true;

    try {
      const finalSeconds =
        Math.floor(
          Math.max(
            furthest,
            duration *
              (COMPLETION_PERCENTAGE /
                100)
          )
        );

      /*
        Sync legitimate progress first.
      */

      furthestWatchedRef.current =
        Math.min(
          finalSeconds,
          duration
        );

      await syncProgress(true);

      /*
        Only after progress has been saved
        do we request completion.
      */

      await onCompleted();

      clearSavedVideoPosition(
        courseId,
        lectureId
      );
    } catch (error) {
      console.error(
        "Video completion error:",
        error.response?.data ||
          error
      );
    } finally {
      completionTriggeredRef.current =
        false;
    }
  };

  // ===================================================
  // RESET ON LECTURE CHANGE
  // ===================================================

  useEffect(() => {
    const lectureProgress =
      getLectureProgress(
        lectureId
      );

    const backendTime =
      Number(
        lectureProgress?.watchedSeconds ||
          0
      );

    const localTime =
      Number(
        localStorage.getItem(
          storageKey
        ) || 0
      );

    serverWatchedRef.current =
      backendTime;

    /*
      Backend is authoritative when
      progress already exists.
    */

    const initial =
      backendTime > 0
        ? backendTime
        : Math.min(
            localTime,
            MAX_FORWARD_SEEK
          );

    furthestWatchedRef.current =
      initial;

    previousTimeRef.current =
      initial;

    lastSyncedTimeRef.current =
      backendTime;

    lastProgressUpdateRef.current =
      initial;

    restoringSeekRef.current =
      false;

    completionTriggeredRef.current =
      false;

    isPlayingRef.current =
      false;

    savingProgressRef.current =
      false;

    forwardSeekActiveRef.current =
      false;

    forwardSeekAccumulatedRef.current =
      0;

    forwardSeekRequiredRef.current =
      0;

    forwardSeekTargetRef.current =
      initial;
  }, [
    lectureId,
    storageKey,
  ]);

  // ===================================================
  // PAGE UNLOAD
  // ===================================================

  useEffect(() => {
    const saveBeforeUnload = () => {
      const watchedTime =
        Math.floor(
          furthestWatchedRef.current
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
  // KEYBOARD CONTROLS
  // ===================================================

  useEffect(() => {
    const handleKeyDown = (
      event
    ) => {
      const video =
        videoRef.current;

      if (
        !video ||
        isCompleted
      ) {
        return;
      }

      const target =
        event.target;

      if (
        target instanceof
          HTMLInputElement ||
        target instanceof
          HTMLTextAreaElement
      ) {
        return;
      }

      // ---------------------------------------------
      // SPACE
      // ---------------------------------------------

      if (event.code === "Space") {
        event.preventDefault();

        if (video.paused) {
          video.play();
        } else {
          video.pause();
        }

        return;
      }

      // ---------------------------------------------
      // ARROW LEFT
      // ---------------------------------------------

      if (
        event.key === "ArrowLeft" ||
        event.key === "j" ||
        event.key === "J"
      ) {
        event.preventDefault();

        video.currentTime =
          Math.max(
            0,
            video.currentTime - 10
          );

        previousTimeRef.current =
          video.currentTime;

        return;
      }

      // ---------------------------------------------
      // ARROW RIGHT
      // ---------------------------------------------

      if (
        event.key === "ArrowRight" ||
        event.key === "l" ||
        event.key === "L"
      ) {
        event.preventDefault();

        const furthest =
          furthestWatchedRef.current;

        const targetTime =
          Math.min(
            video.duration || Infinity,
            furthest +
              MAX_FORWARD_SEEK
          );

        if (
          targetTime <=
          furthest +
            SEEK_TOLERANCE
        ) {
          toast(
            "Watch the current section before moving forward.",
            {
              icon: "⚔️",
            }
          );

          return;
        }

        video.currentTime =
          targetTime;

        return;
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
  // RATE PROTECTION
  // ===================================================

  const handleRateChange = () => {
    const video =
      videoRef.current;

    if (!video) return;

    if (video.playbackRate !== 1) {
      video.playbackRate = 1;

      toast(
        "Playback speed is locked for progress tracking.",
        {
          icon: "🛡️",
          duration: 2000,
        }
      );
    }
  };

  // ===================================================
  // CONTEXT MENU
  // ===================================================

  const handleContextMenu = (
    event
  ) => {
    event.preventDefault();

    toast(
      "This realm is protected.",
      {
        icon: "🛡️",
        duration: 1500,
      }
    );
  };

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <div className="relative bg-black">

      {/* CINEMATIC TOP BORDER */}

      <div className="absolute left-0 right-0 top-0 z-10 h-[2px] bg-gradient-to-r from-transparent via-amber-500/70 to-transparent" />

      <video
        ref={videoRef}
        src={videoUrl}
        controls
        controlsList="nodownload noplaybackrate noremoteplayback"
        disablePictureInPicture
        disableRemotePlayback
        playsInline
        preload="metadata"
        onLoadedMetadata={
          handleLoadedMetadata
        }
        onSeeking={handleSeeking}
        onTimeUpdate={
          handleTimeUpdate
        }
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={handleEnded}
        onRateChange={
          handleRateChange
        }
        onContextMenu={
          handleContextMenu
        }
        className="aspect-video h-auto w-full bg-black object-contain"
      >
        Your browser does not support
        the video element.
      </video>

      {/* ANTI-SKIP NOTICE */}

      {!isCompleted && (
        <div className="absolute bottom-14 left-3 flex items-center gap-2 rounded-lg border border-slate-700/70 bg-black/80 px-3 py-2 text-[10px] font-semibold text-slate-400 backdrop-blur">
          <Shield
            size={12}
            className="text-cyan-500"
          />

          Forward jumps limited to{" "}
          {MAX_FORWARD_SEEK}s
        </div>
      )}

      {/* CINEMATIC BOTTOM BORDER */}

      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-900/70 to-transparent" />
    </div>
  );
};

// =====================================================
// SHORTCUT
// =====================================================

const Shortcut = ({
  keys,
  label,
}) => {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-[#0a0c0e] px-4 py-3">
      <span className="text-xs text-slate-500">
        {label}
      </span>

      <kbd className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-[10px] font-bold text-amber-400">
        {keys}
      </kbd>
    </div>
  );
};

// =====================================================
// HELPERS
// =====================================================

const getLectureDuration = (
  lecture
) => {
  if (!lecture) return 0;

  const duration =
    lecture.videoDuration ??
    lecture.durationSeconds ??
    lecture.duration ??
    0;

  const numericDuration =
    Number(duration);

  return Number.isFinite(
    numericDuration
  )
    ? numericDuration
    : 0;
};

const formatTime = (
  seconds
) => {
  const value = Math.max(
    0,
    Math.floor(
      Number(seconds) || 0
    )
  );

  const hours = Math.floor(
    value / 3600
  );

  const minutes = Math.floor(
    (value % 3600) / 60
  );

  const secs = value % 60;

  if (hours > 0) {
    return `${String(
      hours
    ).padStart(2, "0")}:${String(
      minutes
    ).padStart(2, "0")}:${String(
      secs
    ).padStart(2, "0")}`;
  }

  return `${String(
    minutes
  ).padStart(2, "0")}:${String(
    secs
  ).padStart(2, "0")}`;
};

const clearSavedVideoPosition = (
  courseId,
  lectureId
) => {
  if (!courseId || !lectureId) {
    return;
  }

  localStorage.removeItem(
    getVideoStorageKey(
      courseId,
      lectureId
    )
  );
};

// =====================================================
// EMPTY
// =====================================================

const EmptyLectures = ({
  onBack,
}) => {
  return (
    <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-[#0d1012] p-8 text-center shadow-2xl">

      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-slate-800 bg-slate-900 text-amber-500">
        <BookOpen size={26} />
      </div>

      <h2 className="mt-5 text-xl font-black text-white">
        No chapters available
      </h2>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        The instructor has not added any
        chapters to this course yet.
      </p>

      <button
        type="button"
        onClick={onBack}
        className="mt-6 rounded-xl border border-amber-800/50 bg-amber-950/30 px-5 py-3 text-sm font-bold text-amber-400 transition hover:bg-amber-900/30"
      >
        Return to the Great Hall
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
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-[#090b0d]/95 backdrop-blur-xl">

      <div className="mx-auto flex min-h-[72px] max-w-[1550px] items-center gap-4 px-4 sm:px-6 lg:px-8">

        <button
          type="button"
          onClick={onBack}
          className="group flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/60 text-slate-500 transition hover:border-amber-800/50 hover:text-amber-400"
        >
          <ArrowLeft
            size={18}
            className="transition group-hover:-translate-x-0.5"
          />
        </button>

        <div className="min-w-0">

          <div className="flex items-center gap-2">
            <Sword
              size={13}
              className="text-amber-500"
            />

            <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-amber-500">
              The Learning Realm
            </p>
          </div>

          <h1 className="mt-1 truncate text-sm font-black text-white sm:text-base">
            {course?.courseTitle ||
              "Course"}
          </h1>
        </div>

        <div className="ml-auto hidden items-center gap-2 sm:flex">

          <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,.8)]" />

            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">
              Chronicle Active
            </span>
          </div>

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
    <div className="flex min-h-screen items-center justify-center bg-[#080a0c] text-slate-200">

      <div className="text-center">

        <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-amber-800/50 bg-amber-950/20">
          <Sword
            size={25}
            className="text-amber-500"
          />

          <div className="absolute inset-0 animate-ping rounded-full border border-amber-700/20" />
        </div>

        <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.3em] text-amber-500">
          Summoning the Chronicle
        </p>

        <p className="mt-2 text-sm text-slate-600">
          Preparing your learning realm...
        </p>
      </div>
    </div>
  );
};

export default StudentCourseLearning;
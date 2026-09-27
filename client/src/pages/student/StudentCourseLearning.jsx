import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Download,
  ExternalLink,
  FileText,
  Flame,
  Keyboard,
  Layers3,
  LoaderCircle,
  Lock,
  Maximize2,
  Minimize2,
  NotebookPen,
  Paperclip,
  PlayCircle,
  Search,
  Sparkles,
  Trophy,
  X,
} from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";

import toast from "react-hot-toast";

import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

import AchievementUnlockCelebration from "../student/components/student/AchievementUnlockCelebration";
import AIMentor from "../ai/AIMentor";

// =====================================================
// CONSTANTS
// =====================================================

const PROGRESS_SYNC_INTERVAL = 5000;
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

  const { user, loading: authLoading } = useAuth();

  // ---------------------------------------------------
  // COURSE
  // ---------------------------------------------------

  const [course, setCourse] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [progress, setProgress] = useState(null);
  const [selectedLecture, setSelectedLecture] = useState(null);

  const [currentWatchSeconds, setCurrentWatchSeconds] = useState(0);

  // ---------------------------------------------------
  // MODULES
  // ---------------------------------------------------

  const [modules, setModules] = useState([]);
  const [moduleQuizzes, setModuleQuizzes] = useState({});

  // FIX:
  // Store each module's quiz attempt/pass status separately.
  const [moduleQuizAttempts, setModuleQuizAttempts] = useState({});

  const [modulesLoading, setModulesLoading] = useState(false);

  // ---------------------------------------------------
  // LOADING
  // ---------------------------------------------------

  const [loading, setLoading] = useState(true);
  const [enrollmentLoading, setEnrollmentLoading] = useState(true);
  const [progressLoading, setProgressLoading] = useState(false);

  // ---------------------------------------------------
  // ACHIEVEMENTS
  // ---------------------------------------------------

  const [unlockedAchievements, setUnlockedAchievements] = useState([]);

  // ---------------------------------------------------
  // UI
  // ---------------------------------------------------

  const [searchTerm, setSearchTerm] = useState("");
  const [theaterMode, setTheaterMode] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showAIMentor, setShowAIMentor] = useState(false);

  // ---------------------------------------------------
  // NOTES
  // ---------------------------------------------------

  const [lectureNotes, setLectureNotes] = useState([]);
  const [notesLoading, setNotesLoading] = useState(false);

  // ---------------------------------------------------
  // MODULE UI
  // ---------------------------------------------------

  const [expandedModules, setExpandedModules] = useState({});

  // ---------------------------------------------------
  // VIDEO
  // ---------------------------------------------------

  const videoRef = useRef(null);

  const lastAllowedTimeRef = useRef(0);
  const lastSeekWarningRef = useRef(0);
  const progressSyncTimerRef = useRef(null);

  const lastProgressUiUpdateRef = useRef(0);

  // ---------------------------------------------------
  // KEYBOARD
  // ---------------------------------------------------

  const currentLectureIndexRef = useRef(-1);
  const lecturesRef = useRef([]);

  // =====================================================
  // INITIALIZE
  // =====================================================

  useEffect(() => {
    if (authLoading) return;

    initializeLearning();
  }, [authLoading, user?.role, courseId]);

  // =====================================================
  // KEEP KEYBOARD REFS UPDATED
  // =====================================================

  const currentLectureIndex = useMemo(() => {
    if (!selectedLecture) return -1;

    return lectures.findIndex(
      (lecture) => String(lecture?._id) === String(selectedLecture?._id),
    );
  }, [lectures, selectedLecture]);

  useEffect(() => {
    currentLectureIndexRef.current = currentLectureIndex;
    lecturesRef.current = lectures;
  }, [currentLectureIndex, lectures]);

  // =====================================================
  // INITIALIZE LEARNING
  // =====================================================

  const initializeLearning = async () => {
    if (!courseId) {
      toast.error("Invalid course ID.");

      navigate("/courses", {
        replace: true,
      });

      return;
    }

    if (!user) {
      toast.error("Please login to access this course.");

      navigate("/login", {
        replace: true,
      });

      return;
    }

    if (user.role !== "student") {
      toast.error("Only students can access the learning page.");

      navigate("/courses", {
        replace: true,
      });

      return;
    }

    const enrolled = await checkEnrollment();

    if (!enrolled) return;

    await loadLearningData();
  };

  // =====================================================
  // ENROLLMENT
  // =====================================================

  const checkEnrollment = async () => {
    try {
      setEnrollmentLoading(true);

      const response = await api.get(`/enrollment/check/${courseId}`);

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "Unable to verify enrollment.",
        );
      }

      const enrolled = Boolean(
        response.data?.enrolled ?? response.data?.isEnrolled,
      );

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
          "Unable to verify course enrollment.",
      );

      navigate(`/courses/${courseId}`, {
        replace: true,
      });

      return false;
    } finally {
      setEnrollmentLoading(false);
    }
  };

  // =====================================================
  // LOAD LEARNING DATA
  // =====================================================

  const loadLearningData = async () => {
    try {
      setLoading(true);

      const [, , , moduleList] = await Promise.all([
        fetchCourse(),
        fetchLectures(),
        fetchProgress(),
        fetchModules(),
      ]);

      if (Array.isArray(moduleList) && moduleList.length > 0) {
        await fetchModuleQuizzes(moduleList);
      } else {
        setModuleQuizzes({});
        setModuleQuizAttempts({});
      }
    } catch (error) {
      console.error("Learning data loading error:", error);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // FETCH COURSE
  // =====================================================

  const fetchCourse = async () => {
    try {
      const response = await api.get(`/course/${courseId}`);

      if (!response.data?.success) {
        throw new Error(response.data?.message || "Unable to load course.");
      }

      setCourse(response.data?.course || null);
    } catch (error) {
      console.error("Fetch course error:", error);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Unable to load course.",
      );

      navigate("/courses", {
        replace: true,
      });
    }
  };

  // =====================================================
  // FETCH LECTURES
  // =====================================================

  const fetchLectures = async () => {
    try {
      const response = await api.get(`/lecture/course/${courseId}`);

      if (!response.data?.success) {
        throw new Error(response.data?.message || "Unable to load lectures.");
      }

      let lectureData = [];

      if (Array.isArray(response.data?.lectures)) {
        lectureData = response.data.lectures;
      } else if (Array.isArray(response.data?.courseLectures)) {
        lectureData = response.data.courseLectures;
      }

      const sortedLectures = [...lectureData].sort(
        (a, b) => Number(a?.order ?? 0) - Number(b?.order ?? 0),
      );

      setLectures(sortedLectures);

      if (sortedLectures.length > 0) {
        setSelectedLecture(sortedLectures[0]);
      }
    } catch (error) {
      console.error("Fetch lectures error:", error);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Unable to load course lectures.",
      );

      setLectures([]);
    }
  };

  // =====================================================
  // FETCH MODULES
  // =====================================================

  const fetchModules = async () => {
    try {
      setModulesLoading(true);

      const response = await api.get(`/course/${courseId}/modules`);

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "Unable to load course modules.",
        );
      }

      const moduleData = Array.isArray(response.data?.modules)
        ? response.data.modules
        : [];

      const sortedModules = [...moduleData].sort(
        (a, b) => Number(a?.order ?? 0) - Number(b?.order ?? 0),
      );

      setModules(sortedModules);

      if (sortedModules.length > 0) {
        setExpandedModules((previous) => ({
          ...previous,
          [sortedModules[0]._id]: true,
        }));
      }

      return sortedModules;
    } catch (error) {
      if (error.response?.status !== 404) {
        console.error("Fetch modules error:", error);
      }

      setModules([]);

      return [];
    } finally {
      setModulesLoading(false);
    }
  };

  // =====================================================
  // FETCH MODULE QUIZZES + STUDENT QUIZ PASS STATUS
  // =====================================================

  const fetchModuleQuizzes = async (moduleList) => {
    try {
      if (!Array.isArray(moduleList) || moduleList.length === 0) {
        setModuleQuizzes({});
        setModuleQuizAttempts({});
        return;
      }

      const results = await Promise.all(
        moduleList.map(async (module) => {
          try {
            // ---------------------------------------------
            // 1. Fetch quiz
            // ---------------------------------------------

            const quizResponse = await api.get(`/module/${module._id}/quiz`);

            const quiz = quizResponse.data?.quiz || null;

            // ---------------------------------------------
            // 2. No quiz for this module
            // ---------------------------------------------

            if (!quiz?._id) {
              return {
                moduleId: module._id,
                quiz: null,
                attempt: null,
              };
            }

            // ---------------------------------------------
            // 3. Fetch student's quiz pass status
            // ---------------------------------------------

            let attempt = null;

            try {
              const attemptResponse = await api.get(
                `/quiz/${quiz._id}/my-attempt`,
              );

              if (attemptResponse.data?.success) {
                attempt = attemptResponse.data;
              }
            } catch (attemptError) {
              console.error(
                `Failed to fetch quiz attempt for quiz ${quiz._id}:`,
                attemptError,
              );
            }

            return {
              moduleId: module._id,
              quiz,
              attempt,
            };
          } catch (error) {
            if (error.response?.status !== 404) {
              console.error(
                `Failed to fetch quiz for module ${module._id}:`,
                error,
              );
            }

            return {
              moduleId: module._id,
              quiz: null,
              attempt: null,
            };
          }
        }),
      );

      // ===================================================
      // CREATE QUIZ MAP
      // ===================================================

      const quizMap = {};

      // ===================================================
      // CREATE ATTEMPT/PASS STATUS MAP
      // ===================================================

      const attemptMap = {};

      results.forEach(({ moduleId, quiz, attempt }) => {
        quizMap[moduleId] = quiz;

        attemptMap[moduleId] = {
          passed: Boolean(attempt?.passed),
          attempt: attempt?.attempt || null,
        };
      });

      // ===================================================
      // UPDATE STATE
      // ===================================================

      setModuleQuizzes(quizMap);
      setModuleQuizAttempts(attemptMap);
    } catch (error) {
      console.error("FETCH MODULE QUIZZES ERROR:", error);

      setModuleQuizzes({});
      setModuleQuizAttempts({});
    }
  };

  // =====================================================
  // FETCH PROGRESS
  // =====================================================

  const fetchProgress = async () => {
    try {
      const response = await api.get(`/progress/course/${courseId}`);

      if (!response.data?.success) {
        setProgress(null);
        return;
      }

      setProgress(
        response.data?.progress || response.data?.courseProgress || null,
      );
    } catch (error) {
      if (error.response?.status !== 404) {
        console.error("Fetch progress error:", error);
      }

      setProgress(null);
    }
  };

  // =====================================================
  // LECTURE PROGRESS
  // =====================================================

  const getLectureProgress = useCallback(
    (lectureId) => {
      if (!progress?.lectures || !lectureId) {
        return null;
      }

      return (
        progress.lectures.find((item) => {
          const id =
            typeof item?.lecture === "object"
              ? item?.lecture?._id
              : item?.lecture;

          return String(id) === String(lectureId);
        }) || null
      );
    },
    [progress],
  );

  // =====================================================
  // COMPLETED LECTURES
  // =====================================================

  const completedLectureIds = useMemo(() => {
    const ids = new Set();

    if (!Array.isArray(progress?.lectures)) {
      return ids;
    }

    progress.lectures.forEach((item) => {
      if (!item?.completed) return;

      const lectureId =
        typeof item?.lecture === "object" ? item?.lecture?._id : item?.lecture;

      if (lectureId) {
        ids.add(String(lectureId));
      }
    });

    return ids;
  }, [progress]);

  // =====================================================
  // COURSE PROGRESS
  // =====================================================

  const progressPercentage = useMemo(() => {
    if (!lectures.length) return 0;

    return Math.round(
      Math.min((completedLectureIds.size / lectures.length) * 100, 100),
    );
  }, [lectures.length, completedLectureIds]);

  // =====================================================
  // MODULE GROUPING + UNLOCK LOGIC
  // =====================================================

  const modulesWithLectures = useMemo(() => {
    if (!modules.length) {
      return [];
    }

    const lectureMap = new Map();

    lectures.forEach((lecture) => {
      const moduleId =
        typeof lecture?.module === "object"
          ? lecture?.module?._id
          : lecture?.module;

      if (!moduleId) return;

      const key = String(moduleId);

      if (!lectureMap.has(key)) {
        lectureMap.set(key, []);
      }

      lectureMap.get(key).push(lecture);
    });

    return modules.map((module, moduleIndex) => {
      const moduleLectures = [
        ...(lectureMap.get(String(module?._id)) || []),
      ].sort((a, b) => Number(a?.order ?? 0) - Number(b?.order ?? 0));

      const completedCount = moduleLectures.filter((lecture) =>
        completedLectureIds.has(String(lecture?._id)),
      ).length;

      const totalLectures = moduleLectures.length;

      const modulePercentage =
        totalLectures > 0
          ? Math.round((completedCount / totalLectures) * 100)
          : 0;

      const quiz = moduleQuizzes[String(module?._id)] || null;

      const allLecturesCompleted =
        totalLectures > 0 && completedCount === totalLectures;

      // ===================================================
      // QUIZ PASS STATUS
      // ===================================================

      const quizAttempt =
        moduleQuizAttempts[String(module?._id)] || null;

      const quizPassed = quizAttempt?.passed === true;

      // ===================================================
      // MODULE UNLOCK LOGIC
      // ===================================================

      let isUnlocked = false;

      // First module is always unlocked.
      if (moduleIndex === 0) {
        isUnlocked = true;
      } else {
        // Current module depends on previous module quiz.
        const previousModule = modules[moduleIndex - 1];

        const previousModuleAttempt =
          moduleQuizAttempts[String(previousModule?._id)] || null;

        const previousQuizPassed =
          previousModuleAttempt?.passed === true;

        isUnlocked = previousQuizPassed;
      }

      const isLocked = !isUnlocked;

      const lecturesCompleted = allLecturesCompleted;

      const canTakeQuiz =
        isUnlocked &&
        allLecturesCompleted &&
        !quizPassed;

      return {
        ...module,

        lectures: moduleLectures,

        completedCount,
        totalLectures,
        modulePercentage,

        quiz,

        allLecturesCompleted,

        isUnlocked,
        isLocked,

        quizPassed,

        lecturesCompleted,
        canTakeQuiz,
      };
    });
  }, [
    modules,
    lectures,
    completedLectureIds,
    moduleQuizzes,
    moduleQuizAttempts,
  ]);

  // =====================================================
  // UNASSIGNED LECTURES
  // =====================================================

  const unassignedLectures = useMemo(() => {
    return lectures.filter((lecture) => {
      const moduleId =
        typeof lecture?.module === "object"
          ? lecture?.module?._id
          : lecture?.module;

      return !moduleId;
    });
  }, [lectures]);

  // =====================================================
  // SEARCH
  // =====================================================

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredModules = useMemo(() => {
    if (!normalizedSearch) {
      return modulesWithLectures;
    }

    return modulesWithLectures
      .map((module) => {
        const moduleTitle = String(module?.moduleTitle ?? "");

        const moduleMatches = moduleTitle
          .toLowerCase()
          .includes(normalizedSearch);

        const matchingLectures = Array.isArray(module?.lectures)
          ? module.lectures.filter((lecture) => {
              const title = String(
                lecture?.lectureTitle ?? lecture?.title ?? "",
              );

              return title.toLowerCase().includes(normalizedSearch);
            })
          : [];

        if (moduleMatches || matchingLectures.length > 0) {
          return {
            ...module,
            lectures: moduleMatches ? module.lectures : matchingLectures,
          };
        }

        return null;
      })
      .filter(Boolean);
  }, [modulesWithLectures, normalizedSearch]);

  const filteredUnassignedLectures = useMemo(() => {
    if (!normalizedSearch) {
      return unassignedLectures;
    }

    return unassignedLectures.filter((lecture) => {
      const title = String(lecture?.lectureTitle ?? lecture?.title ?? "");

      return title.toLowerCase().includes(normalizedSearch);
    });
  }, [unassignedLectures, normalizedSearch]);

  // =====================================================
  // LOAD NOTES
  // =====================================================

  useEffect(() => {
    const lectureId = selectedLecture?._id;

    if (!lectureId) {
      setLectureNotes([]);
      return;
    }

    let cancelled = false;

    const loadNotes = async () => {
      try {
        setNotesLoading(true);

        const response = await api.get(`/note/lecture/${lectureId}`);

        if (cancelled) return;

        if (response.data?.success) {
          setLectureNotes(
            Array.isArray(response.data?.notes) ? response.data.notes : [],
          );
        } else {
          setLectureNotes([]);
        }
      } catch (error) {
        if (cancelled) return;

        console.error("Fetch lecture notes error:", error);

        setLectureNotes([]);
      } finally {
        if (!cancelled) {
          setNotesLoading(false);
        }
      }
    };

    loadNotes();

    return () => {
      cancelled = true;
    };
  }, [selectedLecture?._id]);

  // =====================================================
  // RESET VIDEO STATE
  // =====================================================

  useEffect(() => {
    lastAllowedTimeRef.current = 0;
    lastSeekWarningRef.current = 0;
    lastProgressUiUpdateRef.current = 0;

    setCurrentWatchSeconds(0);

    if (progressSyncTimerRef.current) {
      clearInterval(progressSyncTimerRef.current);

      progressSyncTimerRef.current = null;
    }
  }, [selectedLecture?._id]);

  // =====================================================
  // CHECK COMPLETION
  // =====================================================

  const isLectureCompleted = useCallback(
    (lectureId) => {
      return Boolean(lectureId) && completedLectureIds.has(String(lectureId));
    },
    [completedLectureIds],
  );

  // =====================================================
  // GET MODULE FOR LECTURE
  // =====================================================

  const getModuleForLecture = useCallback(
    (lecture) => {
      if (!lecture) return null;

      const moduleId =
        typeof lecture?.module === "object"
          ? lecture?.module?._id
          : lecture?.module;

      if (!moduleId) {
        return null;
      }

      return (
        modulesWithLectures.find(
          (module) => String(module?._id) === String(moduleId),
        ) || null
      );
    },
    [modulesWithLectures],
  );

  // =====================================================
  // SELECT LECTURE
  // =====================================================

  const handleSelectLecture = useCallback(
    (lecture) => {
      if (!lecture?._id) return;

      const moduleId =
        typeof lecture?.module === "object"
          ? lecture?.module?._id
          : lecture?.module;

      if (moduleId) {
        const module = modulesWithLectures.find(
          (item) => String(item?._id) === String(moduleId),
        );

        if (module?.isLocked) {
          toast.error(
            "This module is locked. Complete the previous module and pass its quiz first.",
          );

          return;
        }
      }

      setSelectedLecture(lecture);
      setShowAIMentor(false);

      window.scrollTo({
        top: 0,
        behavior: "auto",
      });
    },
    [modulesWithLectures],
  );

  // =====================================================
  // TOGGLE MODULE
  // =====================================================

  const toggleModule = useCallback(
    (moduleId) => {
      const module = modulesWithLectures.find(
        (item) => String(item?._id) === String(moduleId),
      );

      if (module?.isLocked) {
        toast.error(
          "This module is locked. Complete the previous module and pass its quiz first.",
        );

        return;
      }

      setExpandedModules((previous) => ({
        ...previous,
        [moduleId]: !previous[moduleId],
      }));
    },
    [modulesWithLectures],
  );

  // =====================================================
  // OPEN MODULE QUIZ
  // =====================================================

  const handleOpenModuleQuiz = useCallback(
    (module) => {
      if (!module?._id) {
        toast.error("Invalid module.");

        return;
      }

      if (module?.isLocked) {
        toast.error(
          "This module is locked. Complete the previous module and pass its quiz first.",
        );

        return;
      }

      if (!module?.quiz) {
        toast.info(
          "The instructor has not generated the AI quiz for this module yet.",
        );

        return;
      }

      if (module.totalLectures === 0) {
        toast.info("This module does not have any lectures yet.");

        return;
      }

      if (!module.allLecturesCompleted) {
        const remaining =
          module.totalLectures - module.completedCount;

        toast.error(
          `Complete ${remaining} more lecture${
            remaining === 1 ? "" : "s"
          } before taking this quiz.`,
        );

        return;
      }

      if (module.quizPassed) {
        toast.info("You have already passed this module quiz.");

        return;
      }

      navigate(`/dashboard/modules/${module._id}/quiz`, {
        state: {
          courseId,
        },
      });
    },
    [courseId, navigate],
  );

  // =====================================================
  // AI MENTOR
  // =====================================================

  const handleOpenAIMentor = useCallback(() => {
    if (!selectedLecture) {
      toast.error("Select a lecture before asking the AI Mentor.");

      return;
    }

    setShowAIMentor(true);
  }, [selectedLecture]);

  // =====================================================
  // ACHIEVEMENT
  // =====================================================

  const showAchievementCelebration = useCallback((newAchievements = []) => {
    if (
      !Array.isArray(newAchievements) ||
      newAchievements.length === 0
    ) {
      return;
    }

    setUnlockedAchievements(newAchievements);
  }, []);

  // =====================================================
  // VIDEO HELPERS
  // =====================================================

  const getLectureDuration = (lecture) => {
    return Number(lecture?.videoDuration || 0);
  };

  const clearSavedVideoPosition = (
    currentCourseId,
    lectureId,
  ) => {
    if (!currentCourseId || !lectureId) {
      return;
    }

    try {
      localStorage.removeItem(
        getVideoStorageKey(currentCourseId, lectureId),
      );
    } catch (error) {
      console.error(
        "Unable to clear video position:",
        error,
      );
    }
  };

  // =====================================================
  // MARK COMPLETE
  // =====================================================

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

      const lectureProgress =
        getLectureProgress(lectureId);

      const watchedSeconds = Math.max(
        Number(lectureProgress?.watchedSeconds || 0),
        Number(currentWatchSeconds || 0),
      );

      const duration =
        getLectureDuration(selectedLecture);

      if (duration > 0) {
        const watchedPercentage =
          (watchedSeconds / duration) * 100;

        if (
          watchedPercentage <
          COMPLETION_PERCENTAGE
        ) {
          toast.error(
            `Watch at least ${COMPLETION_PERCENTAGE}% before completing this lecture.`,
          );

          return;
        }
      }

      // ==========================================
      // MARK LECTURE COMPLETE
      // ==========================================

      const response = await api.patch(
        `/progress/complete/${lectureId}`,
      );

      // ==========================================
      // ACHIEVEMENT UNLOCK
      // ==========================================

      const newlyUnlocked =
        response.data?.newlyUnlocked || [];

      console.log(
        "🏆 Newly unlocked achievements:",
        newlyUnlocked,
      );

      if (newlyUnlocked.length > 0) {
        setUnlockedAchievements(newlyUnlocked);
      }

      // ==========================================
      // HANDLE API RESPONSE
      // ==========================================

      if (!response.data?.success) {
        toast.error(
          response.data?.message ||
            "Unable to complete lecture.",
        );

        return;
      }

      if (response.data?.progress) {
        setProgress(response.data.progress);
      }

      clearSavedVideoPosition(
        courseId,
        lectureId,
      );

      toast.success(
        response.data?.message ||
          "Lecture completed!",
      );
    } catch (error) {
      console.error(
        "Mark lecture complete error:",
        error,
      );

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Unable to complete lecture.",
      );
    } finally {
      setProgressLoading(false);
    }
  };

  // =====================================================
  // UNMARK COMPLETE
  // =====================================================

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
        `/progress/uncomplete/${lectureId}`,
      );

      if (!response.data?.success) {
        toast.error(
          response.data?.message ||
            "Unable to update lecture.",
        );

        return;
      }

      if (response.data?.progress) {
        setProgress(response.data.progress);
      }

      toast.success(
        response.data?.message ||
          "Lecture marked incomplete.",
      );
    } catch (error) {
      console.error(
        "Unmark lecture error:",
        error,
      );

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Unable to update lecture.",
      );
    } finally {
      setProgressLoading(false);
    }
  };

  // =====================================================
  // LECTURE NAVIGATION
  // =====================================================

  const handlePreviousLecture =
    useCallback(() => {
      if (currentLectureIndex <= 0) {
        return;
      }

      handleSelectLecture(
        lectures[currentLectureIndex - 1],
      );
    }, [
      currentLectureIndex,
      lectures,
      handleSelectLecture,
    ]);

  const handleNextLecture =
    useCallback(() => {
      if (
        currentLectureIndex === -1 ||
        currentLectureIndex >=
          lectures.length - 1
      ) {
        return;
      }

      handleSelectLecture(
        lectures[currentLectureIndex + 1],
      );
    }, [
      currentLectureIndex,
      lectures,
      handleSelectLecture,
    ]);

  // =====================================================
  // CURRENT LECTURE PERCENTAGE
  // =====================================================

  const currentLecturePercentage = useMemo(() => {
    const duration = Number(
      selectedLecture?.videoDuration || 0,
    );

    if (!duration || duration <= 0) {
      return 0;
    }

    return Math.min(
      Math.round(
        (currentWatchSeconds / duration) * 100,
      ),
      100,
    );
  }, [
    selectedLecture?.videoDuration,
    currentWatchSeconds,
  ]);

  // =====================================================
  // VIDEO LOADED
  // =====================================================

  const handleVideoLoadedMetadata =
    useCallback(() => {
      const video = videoRef.current;

      if (!video || !selectedLecture) {
        return;
      }

      let savedTime = 0;

      try {
        savedTime = Number(
          localStorage.getItem(
            getVideoStorageKey(
              courseId,
              selectedLecture._id,
            ),
          ) || 0,
        );
      } catch {
        savedTime = 0;
      }

      const lectureProgress =
        getLectureProgress(
          selectedLecture._id,
        );

      const serverTime = Number(
        lectureProgress?.watchedSeconds || 0,
      );

      const resumeTime = Math.max(
        savedTime,
        serverTime,
      );

      const safeResumeTime =
        Number.isFinite(video.duration)
          ? Math.min(
              resumeTime,
              Math.max(video.duration - 0.5, 0),
            )
          : resumeTime;

      if (
        safeResumeTime > 0 &&
        safeResumeTime < video.duration
      ) {
        video.currentTime = safeResumeTime;
      }

      lastAllowedTimeRef.current =
        safeResumeTime;

      lastProgressUiUpdateRef.current =
        safeResumeTime;

      setCurrentWatchSeconds(
        safeResumeTime,
      );
    }, [
      courseId,
      selectedLecture,
      getLectureProgress,
    ]);

  // =====================================================
  // VIDEO TIME UPDATE
  // =====================================================

  const handleVideoTimeUpdate =
    useCallback(() => {
      const video = videoRef.current;

      if (!video || !selectedLecture) {
        return;
      }

      const currentTime = Number(
        video.currentTime || 0,
      );

      const lastAllowed =
        lastAllowedTimeRef.current;

      if (
        currentTime >
        lastAllowed + MAX_FORWARD_SEEK
      ) {
        video.currentTime = lastAllowed;

        const now = Date.now();

        if (
          now -
            lastSeekWarningRef.current >
          2500
        ) {
          lastSeekWarningRef.current =
            now;

          toast.error(
            `You can only seek ${MAX_FORWARD_SEEK} seconds forward.`,
          );
        }

        return;
      }

      if (currentTime > lastAllowed) {
        lastAllowedTimeRef.current =
          currentTime;
      }

      if (
        currentTime -
          lastProgressUiUpdateRef.current >=
        0.5
      ) {
        lastProgressUiUpdateRef.current =
          currentTime;

        setCurrentWatchSeconds(
          currentTime,
        );
      }
    }, [selectedLecture]);

  // =====================================================
  // VIDEO PROGRESS SYNC
  // =====================================================

  useEffect(() => {
    if (!selectedLecture?._id) {
      return;
    }

    const lectureId =
      selectedLecture._id;

    const saveProgress = async () => {
      const video = videoRef.current;

      if (!video) {
        return;
      }

      const currentTime = Math.floor(
        video.currentTime || 0,
      );

      if (currentTime <= 0) {
        return;
      }

      try {
        localStorage.setItem(
          getVideoStorageKey(
            courseId,
            lectureId,
          ),
          String(currentTime),
        );
      } catch (error) {
        console.error(
          "Local video save error:",
          error,
        );
      }

      try {
        await api.patch(
          `/progress/${lectureId}`,
          {
            watchedSeconds: currentTime,
          },
        );
      } catch (error) {
        console.error(
          "Video progress sync error:",
          error,
        );
      }
    };

    progressSyncTimerRef.current =
      window.setInterval(
        saveProgress,
        PROGRESS_SYNC_INTERVAL,
      );

    return () => {
      if (progressSyncTimerRef.current) {
        window.clearInterval(
          progressSyncTimerRef.current,
        );

        progressSyncTimerRef.current = null;
      }
    };
  }, [
    courseId,
    selectedLecture?._id,
  ]);

  // =====================================================
  // VIDEO ENDED
  // =====================================================

  const handleVideoEnded =
    useCallback(async () => {
      if (!selectedLecture?._id) {
        return;
      }

      const duration =
        getLectureDuration(
          selectedLecture,
        );

      if (duration <= 0) {
        return;
      }

      const finalTime = Math.floor(
        duration,
      );

      lastAllowedTimeRef.current =
        duration;

      lastProgressUiUpdateRef.current =
        duration;

      setCurrentWatchSeconds(duration);

      try {
        localStorage.setItem(
          getVideoStorageKey(
            courseId,
            selectedLecture._id,
          ),
          String(finalTime),
        );
      } catch {
        // Ignore localStorage errors.
      }

      try {
        await api.patch(
          `/progress/${selectedLecture._id}`,
          {
            watchedSeconds: finalTime,
          },
        );
      } catch (error) {
        console.error(
          "Final video sync error:",
          error,
        );
      }
    }, [
      courseId,
      selectedLecture,
    ]);

  // =====================================================
  // DOWNLOAD NOTE
  // =====================================================

  const handleDownloadNote =
    useCallback(async (note) => {
      const downloadUrl =
        note?.downloadUrl ||
        note?.fileUrl;

      if (!downloadUrl) {
        toast.error(
          "Download link is not available.",
        );

        return;
      }

      try {
        const response = await api.get(
          downloadUrl,
          {
            responseType: "blob",
          },
        );

        const blob = response.data;

        if (!blob || blob.size === 0) {
          throw new Error(
            "The downloaded file is empty.",
          );
        }

        const blobUrl =
          window.URL.createObjectURL(
            blob,
          );

        const link =
          document.createElement("a");

        link.href = blobUrl;

        link.download =
          note?.fileName ||
          note?.originalName ||
          note?.noteTitle ||
          "lecture-note";

        document.body.appendChild(link);

        link.click();

        link.remove();

        window.URL.revokeObjectURL(
          blobUrl,
        );
      } catch (error) {
        console.error(
          "Note download error:",
          error,
        );

        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Unable to download the note.",
        );
      }
    }, []);

  // =====================================================
  // KEYBOARD SHORTCUTS
  // =====================================================

  useEffect(() => {
    const handleKeyDown = (event) => {
      const target = event.target;

      if (
        target instanceof
          HTMLInputElement ||
        target instanceof
          HTMLTextAreaElement ||
        target instanceof
          HTMLSelectElement
      ) {
        return;
      }

      const video = videoRef.current;

      if (event.code === "Space") {
        event.preventDefault();

        if (!video) return;

        if (video.paused) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }

        return;
      }

      if (event.key === "ArrowRight") {
        if (!video) return;

        video.currentTime = Math.min(
          video.currentTime + 5,
          video.duration ||
            video.currentTime,
        );

        return;
      }

      if (event.key === "ArrowLeft") {
        if (!video) return;

        video.currentTime = Math.max(
          video.currentTime - 5,
          0,
        );

        return;
      }

      const index =
        currentLectureIndexRef.current;

      const lectureList =
        lecturesRef.current;

      if (
        event.key === "n" ||
        event.key === "N"
      ) {
        if (
          index >= 0 &&
          index < lectureList.length - 1
        ) {
          handleSelectLecture(
            lectureList[index + 1],
          );
        }

        return;
      }

      if (
        event.key === "p" ||
        event.key === "P"
      ) {
        if (index > 0) {
          handleSelectLecture(
            lectureList[index - 1],
          );
        }

        return;
      }

      if (
        event.key === "t" ||
        event.key === "T"
      ) {
        setTheaterMode(
          (previous) => !previous,
        );
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [handleSelectLecture]);

  // =====================================================
  // LOADING
  // =====================================================

  if (
    authLoading ||
    loading ||
    enrollmentLoading
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050607] text-amber-400">
        <div className="flex flex-col items-center gap-4">
          <LoaderCircle
            size={40}
            className="animate-spin"
          />

          <p className="text-xs font-black uppercase tracking-[0.3em]">
            Entering the Realm...
          </p>
        </div>
      </div>
    );
  }

  if (!course) {
    return null;
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="min-h-screen bg-[#050607] text-slate-200">
      {/* =================================================
          HEADER
      ================================================= */}

      <header className="sticky top-0 z-50 border-b border-amber-900/30 bg-[#07090b]">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-3 lg:px-6">
          <button
            type="button"
            onClick={() =>
              navigate(`/courses/${courseId}`)
            }
            className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 transition-colors hover:text-amber-400"
          >
            <ArrowLeft size={16} />
            Course
          </button>

          <div className="hidden items-center gap-2 md:flex">
            <CrownIcon />

            <span className="text-xs font-black uppercase tracking-[0.25em] text-amber-400">
              Scholar's Keep
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                setShowShortcuts(
                  (previous) => !previous,
                )
              }
              className="rounded-xl border border-slate-800 bg-slate-950 p-2 text-slate-400 transition-colors hover:border-amber-700/40 hover:text-amber-400"
              title="Keyboard shortcuts"
            >
              <Keyboard size={17} />
            </button>

            <button
              type="button"
              onClick={() =>
                setTheaterMode(
                  (previous) => !previous,
                )
              }
              className="rounded-xl border border-slate-800 bg-slate-950 p-2 text-slate-400 transition-colors hover:border-amber-700/40 hover:text-amber-400"
              title="Theater mode"
            >
              {theaterMode ? (
                <Minimize2 size={17} />
              ) : (
                <Maximize2 size={17} />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* =================================================
          SHORTCUTS
      ================================================= */}

      {showShortcuts && (
        <div className="fixed right-4 top-20 z-[60] w-72 rounded-2xl border border-amber-900/40 bg-[#0c0f11] p-5 shadow-2xl">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Keyboard
                size={17}
                className="text-amber-400"
              />

              <h3 className="text-xs font-black uppercase tracking-widest">
                Shortcuts
              </h3>
            </div>

            <button
              type="button"
              onClick={() =>
                setShowShortcuts(false)
              }
              className="text-slate-500 transition-colors hover:text-white"
            >
              <X size={16} />
            </button>
          </div>

          <div className="space-y-2 text-xs text-slate-400">
            <ShortcutRow
              label="Play / Pause"
              shortcut="Space"
            />

            <ShortcutRow
              label="Forward"
              shortcut="→"
            />

            <ShortcutRow
              label="Backward"
              shortcut="←"
            />

            <ShortcutRow
              label="Next lecture"
              shortcut="N"
            />

            <ShortcutRow
              label="Previous lecture"
              shortcut="P"
            />

            <ShortcutRow
              label="Theater mode"
              shortcut="T"
            />
          </div>
        </div>
      )}

      {/* =================================================
          MAIN
      ================================================= */}

      <main
        className={`mx-auto px-4 py-5 lg:px-6 ${
          theaterMode
            ? "max-w-[1900px]"
            : "max-w-[1600px]"
        }`}
      >
        {/* =================================================
            COURSE HERO
        ================================================= */}

        <section className="relative mb-6 overflow-hidden rounded-3xl border border-amber-900/30 bg-gradient-to-br from-[#111518] via-[#0b0e10] to-[#08090a] p-5 shadow-2xl lg:p-7">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-amber-500/10 blur-[60px]" />

          <div className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-orange-600/5 blur-[60px]" />

          <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-amber-700/30 bg-amber-950/30 px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-amber-400">
                  The Citadel
                </span>

                {course.courseLevel && (
                  <span className="rounded-full border border-slate-800 bg-slate-950 px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-slate-500">
                    {course.courseLevel}
                  </span>
                )}
              </div>

              <h1 className="max-w-4xl text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl">
                {course.courseTitle}
              </h1>

              {course.subTitle && (
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                  {course.subTitle}
                </p>
              )}

              <div className="mt-5 flex flex-wrap gap-4">
                <StatBadge
                  icon={
                    <BookOpen size={14} />
                  }
                  value={lectures.length}
                  label="Lectures"
                />

                <StatBadge
                  icon={
                    <Trophy size={14} />
                  }
                  value={`${progressPercentage}%`}
                  label="Progress"
                />

                <StatBadge
                  icon={
                    <Flame size={14} />
                  }
                  value={
                    completedLectureIds.size
                  }
                  label="Completed"
                />
              </div>
            </div>

            <div className="min-w-[220px] rounded-2xl border border-amber-900/30 bg-black/30 p-4">
              <div className="mb-2 flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                <span className="text-slate-500">
                  Course Progress
                </span>

                <span className="text-amber-400">
                  {progressPercentage}%
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-900">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-orange-700 via-amber-500 to-yellow-300 transition-[width] duration-500"
                  style={{
                    width: `${progressPercentage}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* =================================================
            SEARCH
        ================================================= */}

        {!theaterMode && (
          <div className="mb-5 flex items-center gap-3 rounded-2xl border border-slate-800 bg-[#0b0e10] px-4 py-3">
            <Search
              size={17}
              className="shrink-0 text-slate-600"
            />

            <input
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(
                  event.target.value,
                )
              }
              placeholder="Search modules or lectures..."
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-700"
            />

            {searchTerm && (
              <button
                type="button"
                onClick={() =>
                  setSearchTerm("")
                }
                className="text-slate-600 transition-colors hover:text-amber-400"
              >
                <X size={16} />
              </button>
            )}
          </div>
        )}

        <div
          className={`grid gap-6 ${
            theaterMode
              ? "grid-cols-1"
              : "lg:grid-cols-[minmax(0,1fr)_380px]"
          }`}
        >
          {/* =================================================
              VIDEO + CONTENT
          ================================================= */}

          <section className="min-w-0">
            <div className="overflow-hidden rounded-3xl border border-amber-900/30 bg-black shadow-2xl">
              <div className="relative aspect-video bg-black">
                {selectedLecture?.videoUrl ? (
                  <video
                    key={
                      selectedLecture?._id
                    }
                    ref={videoRef}
                    src={
                      selectedLecture.videoUrl
                    }
                    controls
                    playsInline
                    preload="metadata"
                    className="h-full w-full object-contain"
                    onLoadedMetadata={
                      handleVideoLoadedMetadata
                    }
                    onTimeUpdate={
                      handleVideoTimeUpdate
                    }
                    onEnded={
                      handleVideoEnded
                    }
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center">
                      <PlayCircle
                        size={52}
                        className="mx-auto mb-4 text-slate-800"
                      />

                      <p className="text-sm font-bold text-slate-600">
                        No video available
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {selectedLecture?.videoUrl && (
              <div className="border-x border-b border-amber-900/30 bg-[#080b0d] px-4 py-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-500">
                    Lecture Progress
                  </span>

                  <span className="text-[10px] font-black text-amber-400">
                    {currentLecturePercentage}%
                  </span>
                </div>

                <div className="h-1.5 overflow-hidden rounded-full bg-slate-900">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-orange-700 via-amber-500 to-yellow-300 transition-[width] duration-300 ease-out"
                    style={{
                      width: `${currentLecturePercentage}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {/* =================================================
                CURRENT LECTURE
            ================================================= */}

            {selectedLecture && (
              <div className="mt-5 rounded-3xl border border-slate-800 bg-[#0b0e10] p-5 lg:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-500">
                        Lecture{" "}
                        {currentLectureIndex +
                          1}
                      </span>

                      {isLectureCompleted(
                        selectedLecture._id,
                      ) && (
                        <span className="flex items-center gap-1 rounded-full border border-emerald-800/40 bg-emerald-950/30 px-2 py-1 text-[9px] font-black uppercase tracking-widest text-emerald-400">
                          <CheckCircle2
                            size={12}
                          />
                          Completed
                        </span>
                      )}
                    </div>

                    <h2 className="text-xl font-black text-white">
                      {
                        selectedLecture.lectureTitle
                      }
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={
                      isLectureCompleted(
                        selectedLecture._id,
                      )
                        ? handleUnmarkComplete
                        : handleMarkComplete
                    }
                    disabled={
                      progressLoading
                    }
                    className="flex shrink-0 items-center justify-center gap-2 rounded-xl border border-amber-700/40 bg-amber-950/20 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-amber-400 transition-colors hover:bg-amber-900/30 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {progressLoading ? (
                      <LoaderCircle
                        size={15}
                        className="animate-spin"
                      />
                    ) : (
                      <CheckCircle2
                        size={15}
                      />
                    )}

                    {isLectureCompleted(
                      selectedLecture._id,
                    )
                      ? "Mark Incomplete"
                      : "Mark Complete"}
                  </button>
                </div>

                {selectedLecture.lectureContent && (
                  <div className="mt-6 border-t border-slate-800 pt-5">
                    <div className="mb-3 flex items-center gap-2">
                      <ScrollIcon />

                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                        Lecture Scroll
                      </span>
                    </div>

                    <div className="whitespace-pre-wrap text-sm leading-7 text-slate-400">
                      {
                        selectedLecture.lectureContent
                      }
                    </div>
                  </div>
                )}

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={
                      handleOpenAIMentor
                    }
                    className="flex items-center gap-2 rounded-xl border border-amber-700/40 bg-gradient-to-r from-orange-900/30 to-amber-900/20 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-amber-400 transition-colors hover:border-amber-500/50"
                  >
                    <Sparkles size={15} />
                    Ask AI Mentor
                  </button>
                </div>
              </div>
            )}

            {/* =================================================
                NOTES
            ================================================= */}

            <LectureNotes
              notes={lectureNotes}
              loading={notesLoading}
              onDownload={
                handleDownloadNote
              }
            />

            {/* =================================================
                NAVIGATION
            ================================================= */}

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

            {/* =================================================
                MODULE QUIZ
            ================================================= */}

            {modules.length > 0 && (
              <ModuleQuizRequirement
                modules={modulesWithLectures}
                onOpenQuiz={
                  handleOpenModuleQuiz
                }
              />
            )}

            {/* =================================================
                LEGACY COURSE COMPLETION
            ================================================= */}

            {progressPercentage ===
              100 &&
              modules.length === 0 && (
                <LegacyCourseCompleted />
              )}
          </section>

          {/* =================================================
              CURRICULUM
          ================================================= */}

          {!theaterMode && (
            <aside className="min-w-0">
              <div className="sticky top-20 overflow-hidden rounded-3xl border border-slate-800 bg-[#0b0e10]">
                <div className="border-b border-slate-800 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Layers3
                          size={17}
                          className="text-amber-400"
                        />

                        <h2 className="text-xs font-black uppercase tracking-[0.18em] text-white">
                          Course Curriculum
                        </h2>
                      </div>

                      <p className="mt-1 text-[10px] text-slate-600">
                        {lectures.length}{" "}
                        lectures
                      </p>
                    </div>

                    <div className="rounded-xl border border-amber-900/30 bg-amber-950/20 px-3 py-2 text-[10px] font-black text-amber-400">
                      {progressPercentage}%
                    </div>
                  </div>
                </div>

                <div className="max-h-[calc(100vh-180px)] overflow-y-auto p-3">
                  {modulesLoading &&
                    modules.length ===
                      0 && (
                      <div className="flex justify-center py-10">
                        <LoaderCircle
                          size={25}
                          className="animate-spin text-amber-400"
                        />
                      </div>
                    )}

                  {filteredModules.map(
                    (module) => (
                      <CurriculumModule
                        key={module._id}
                        module={module}
                        expanded={Boolean(
                          expandedModules[
                            module._id
                          ],
                        )}
                        selectedLecture={
                          selectedLecture
                        }
                        onToggle={
                          toggleModule
                        }
                        onSelectLecture={
                          handleSelectLecture
                        }
                        isLectureCompleted={
                          isLectureCompleted
                        }
                        onOpenQuiz={
                          handleOpenModuleQuiz
                        }
                      />
                    ),
                  )}

                  {filteredUnassignedLectures.length >
                    0 && (
                    <div className="mt-3 rounded-2xl border border-slate-800 bg-slate-950/40 p-3">
                      <div className="mb-2 flex items-center gap-2 px-2">
                        <BookOpen
                          size={14}
                          className="text-slate-500"
                        />

                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                          Additional Lectures
                        </span>
                      </div>

                      {filteredUnassignedLectures.map(
                        (lecture) => (
                          <LectureItem
                            key={
                              lecture._id
                            }
                            lecture={
                              lecture
                            }
                            selected={
                              String(
                                selectedLecture?._id,
                              ) ===
                              String(
                                lecture._id,
                              )
                            }
                            completed={isLectureCompleted(
                              lecture._id,
                            )}
                            onClick={() =>
                              handleSelectLecture(
                                lecture,
                              )
                            }
                          />
                        ),
                      )}
                    </div>
                  )}

                  {!modulesLoading &&
                    filteredModules.length ===
                      0 &&
                    filteredUnassignedLectures.length ===
                      0 && (
                      <div className="px-4 py-10 text-center">
                        <Search
                          size={28}
                          className="mx-auto mb-3 text-slate-800"
                        />

                        <p className="text-xs font-bold text-slate-600">
                          No lectures found
                        </p>
                      </div>
                    )}
                </div>
              </div>
            </aside>
          )}
        </div>
      </main>

      {/* =================================================
          ACHIEVEMENT
      ================================================= */}

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

      {/* =================================================
          AI MENTOR
      ================================================= */}

      {showAIMentor &&
        selectedLecture && (
          <AIMentor
            course={course}
            lecture={selectedLecture}
            user={user}
            onClose={() =>
              setShowAIMentor(false)
            }
          />
        )}
    </div>
  );
};

// =====================================================
// LECTURE NOTES
// =====================================================

const LectureNotes = memo(
  ({
    notes = [],
    loading,
    onDownload,
  }) => {
    return (
      <section className="relative mt-6 overflow-hidden rounded-2xl border border-amber-900/40 bg-[#0d1012]">
        <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-amber-600/10 blur-[50px]" />

        <div className="relative">
          <div className="flex flex-col gap-4 border-b border-slate-800/80 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-amber-700/40 bg-amber-950/30 text-amber-400">
                <NotebookPen size={20} />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-black uppercase tracking-[0.15em] text-slate-100">
                    Maester's Notes
                  </h2>

                  {notes.length > 0 && (
                    <span className="rounded-full border border-amber-800/40 bg-amber-950/30 px-2 py-0.5 text-[9px] font-bold text-amber-400">
                      {notes.length}
                    </span>
                  )}
                </div>

                <p className="mt-1 text-[10px] text-slate-600">
                  Knowledge scrolls and resources for this lecture
                </p>
              </div>
            </div>
          </div>

          <div className="p-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <LoaderCircle
                  size={24}
                  className="animate-spin text-amber-400"
                />
              </div>
            ) : notes.length ===
              0 ? (
              <div className="rounded-xl border border-dashed border-slate-800 bg-black/20 px-5 py-8 text-center">
                <NotebookPen
                  size={28}
                  className="mx-auto mb-3 text-slate-800"
                />

                <p className="text-xs font-bold text-slate-600">
                  No notes available for this lecture.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {notes.map(
                  (note, index) => (
                    <div
                      key={
                        note?._id ||
                        note?.id ||
                        index
                      }
                      className="group rounded-2xl border border-slate-800 bg-black/20 p-4 transition-colors hover:border-amber-800/50 hover:bg-amber-950/5"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-amber-900/30 bg-amber-950/20 text-amber-400">
                              {note?.fileUrl ? (
                                <Paperclip
                                  size={16}
                                />
                              ) : (
                                <FileText
                                  size={16}
                                />
                              )}
                            </div>

                            <div className="min-w-0">
                              <h3 className="truncate text-sm font-black text-slate-100">
                                {String(
                                  note?.noteTitle ||
                                    "Untitled Note",
                                )}
                              </h3>

                              {note?.noteContent && (
                                <p className="mt-1 whitespace-pre-wrap text-xs leading-6 text-slate-500">
                                  {String(
                                    note.noteContent,
                                  )}
                                </p>
                              )}

                              {note?.fileName && (
                                <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px] text-slate-600">
                                  <span className="truncate">
                                    {String(
                                      note.fileName,
                                    )}
                                  </span>

                                  {Number(
                                    note.fileSize,
                                  ) >
                                    0 && (
                                    <>
                                      <span>
                                        •
                                      </span>

                                      <span>
                                        {formatFileSize(
                                          note.fileSize,
                                        )}
                                      </span>
                                    </>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {note?.fileUrl && (
                          <div className="flex shrink-0 items-center gap-2">
                            <a
                              href={
                                note.fileUrl
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-[9px] font-black uppercase tracking-widest text-slate-400 transition-colors hover:border-amber-700/50 hover:text-amber-400"
                            >
                              <ExternalLink
                                size={13}
                              />
                              View
                            </a>

                            <button
                              type="button"
                              onClick={() =>
                                onDownload(
                                  note,
                                )
                              }
                              className="flex items-center gap-2 rounded-lg border border-amber-800/40 bg-amber-950/20 px-3 py-2 text-[9px] font-black uppercase tracking-widest text-amber-400 transition-colors hover:bg-amber-900/30"
                            >
                              <Download
                                size={13}
                              />
                              Download
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ),
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    );
  },
);

LectureNotes.displayName =
  "LectureNotes";

// =====================================================
// CURRICULUM MODULE
// =====================================================

const CurriculumModule = memo(
  ({
    module,
    expanded,
    selectedLecture,
    onToggle,
    onSelectLecture,
    isLectureCompleted,
    onOpenQuiz,
  }) => {
    const isLocked = Boolean(
      module?.isLocked,
    );

    const quizPassed = Boolean(
      module?.quizPassed,
    );

    const quizReady =
      Boolean(
        module?.allLecturesCompleted,
      ) &&
      !quizPassed &&
      !isLocked;

    return (
      <div
        className={`mb-2 overflow-hidden rounded-2xl border ${
          isLocked
            ? "border-slate-900 bg-black/30"
            : "border-slate-800 bg-black/20"
        }`}
      >
        {/* MODULE HEADER */}

        <button
          type="button"
          onClick={() =>
            onToggle(module._id)
          }
          className={`flex w-full items-center gap-3 p-4 text-left transition-colors ${
            isLocked
              ? "cursor-pointer hover:bg-slate-950"
              : "hover:bg-amber-950/10"
          }`}
        >
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
              isLocked
                ? "border border-slate-800 bg-slate-950 text-slate-700"
                : "border border-amber-900/30 bg-amber-950/20 text-amber-400"
            }`}
          >
            {isLocked ? (
              <Lock size={15} />
            ) : (
              <Layers3 size={15} />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-3">
              <h3
                className={`truncate text-xs font-black ${
                  isLocked
                    ? "text-slate-600"
                    : "text-slate-200"
                }`}
              >
                {String(
                  module?.moduleTitle ??
                    "Untitled Module",
                )}
              </h3>

              <span
                className={`shrink-0 text-[9px] font-black ${
                  isLocked
                    ? "text-slate-700"
                    : "text-amber-500"
                }`}
              >
                {isLocked
                  ? "LOCKED"
                  : `${module?.modulePercentage}%`}
              </span>
            </div>

            <div className="mt-2 h-1 overflow-hidden rounded-full bg-slate-900">
              <div
                className={`h-full rounded-full transition-[width] duration-300 ${
                  isLocked
                    ? "bg-slate-800"
                    : "bg-amber-500"
                }`}
                style={{
                  width: `${
                    module?.modulePercentage ||
                    0
                  }%`,
                }}
              />
            </div>
          </div>

          {isLocked ? (
            <Lock
              size={15}
              className="shrink-0 text-slate-700"
            />
          ) : expanded ? (
            <ChevronDown
              size={16}
              className="shrink-0 text-slate-600"
            />
          ) : (
            <ChevronRight
              size={16}
              className="shrink-0 text-slate-600"
            />
          )}
        </button>

        {/* LOCKED MESSAGE */}

        {isLocked && (
          <div className="border-t border-slate-900/80 px-4 py-4">
            <div className="flex items-center gap-3">
              <Lock
                size={15}
                className="shrink-0 text-slate-700"
              />

              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">
                  Module Locked
                </p>

                <p className="mt-1 text-[9px] leading-5 text-slate-700">
                  Complete the previous module and pass its quiz to unlock this
                  module.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* UNLOCKED CONTENT */}

        {expanded && !isLocked && (
          <div className="border-t border-slate-800/80 p-2">
            {Array.isArray(
              module?.lectures,
            ) &&
              module.lectures.map(
                (lecture) => (
                  <LectureItem
                    key={lecture?._id}
                    lecture={lecture}
                    selected={
                      String(
                        selectedLecture?._id,
                      ) ===
                      String(
                        lecture?._id,
                      )
                    }
                    completed={isLectureCompleted(
                      lecture?._id,
                    )}
                    onClick={() =>
                      onSelectLecture(
                        lecture,
                      )
                    }
                  />
                ),
              )}

            {/* MODULE QUIZ */}

            {module?.quiz && (
              <button
                type="button"
                disabled={
                  !quizReady &&
                  !quizPassed
                }
                onClick={() =>
                  onOpenQuiz(module)
                }
                className={`mt-2 flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors ${
                  quizPassed
                    ? "border-emerald-900/30 bg-emerald-950/10"
                    : quizReady
                      ? "border-amber-900/30 bg-amber-950/10 hover:border-amber-700/50 hover:bg-amber-950/20"
                      : "cursor-not-allowed border-slate-800 bg-slate-950/40 opacity-60"
                }`}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                    quizPassed
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-amber-500/10 text-amber-400"
                  }`}
                >
                  {quizPassed ? (
                    <CheckCircle2
                      size={15}
                    />
                  ) : quizReady ? (
                    <ClipboardCheck
                      size={15}
                    />
                  ) : (
                    <Lock size={15} />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p
                    className={`text-[10px] font-black uppercase tracking-wider ${
                      quizPassed
                        ? "text-emerald-400"
                        : "text-amber-400"
                    }`}
                  >
                    Module Quiz
                  </p>

                  <p className="mt-1 text-[9px] text-slate-600">
                    {quizPassed
                      ? "Quiz passed"
                      : quizReady
                        ? "Ready to take quiz"
                        : "Complete all lectures to unlock"}
                  </p>
                </div>

                {!quizPassed &&
                  quizReady && (
                    <ChevronRight
                      size={15}
                      className="text-amber-500"
                    />
                  )}
              </button>
            )}

            {/* NO QUIZ */}

            {!module?.quiz &&
              module?.allLecturesCompleted && (
                <div className="mt-2 flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                  <ClipboardCheck
                    size={15}
                    className="text-slate-700"
                  />

                  <div>
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-600">
                      Module Quiz
                    </p>

                    <p className="mt-1 text-[9px] text-slate-700">
                      Quiz not generated yet
                    </p>
                  </div>
                </div>
              )}
          </div>
        )}
      </div>
    );
  },
);

CurriculumModule.displayName =
  "CurriculumModule";

// =====================================================
// LECTURE ITEM
// =====================================================

const LectureItem = memo(
  ({
    lecture,
    selected,
    completed,
    onClick,
  }) => {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`group flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors ${
          selected
            ? "border border-amber-800/40 bg-amber-950/20"
            : "border border-transparent hover:bg-slate-900/70"
        }`}
      >
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
            completed
              ? "bg-emerald-950/30 text-emerald-400"
              : selected
                ? "bg-amber-500/10 text-amber-400"
                : "bg-slate-900 text-slate-600"
          }`}
        >
          {completed ? (
            <CheckCircle2 size={15} />
          ) : (
            <PlayCircle size={15} />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p
            className={`truncate text-[11px] font-bold ${
              selected
                ? "text-amber-300"
                : "text-slate-400 group-hover:text-slate-200"
            }`}
          >
            {String(
              lecture?.lectureTitle ||
                lecture?.title ||
                "Untitled Lecture",
            )}
          </p>

          <p className="mt-1 text-[9px] text-slate-700">
            Lecture{" "}
            {lecture?.order || ""}
          </p>
        </div>

        {lecture?.isPreviewFree && (
          <span className="rounded-full border border-emerald-900/30 bg-emerald-950/20 px-2 py-1 text-[8px] font-black uppercase tracking-wider text-emerald-500">
            Preview
          </span>
        )}
      </button>
    );
  },
);

LectureItem.displayName =
  "LectureItem";

// =====================================================
// NAVIGATION
// =====================================================

const LectureNavigation = memo(
  ({
    currentLectureIndex,
    totalLectures,
    onPrevious,
    onNext,
  }) => {
    return (
      <div className="mt-5 grid grid-cols-2 gap-3">
        <button
          type="button"
          disabled={
            currentLectureIndex <= 0
          }
          onClick={onPrevious}
          className="flex items-center justify-center gap-2 rounded-2xl border border-slate-800 bg-[#0b0e10] px-4 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 transition-colors hover:border-amber-800/40 hover:text-amber-400 disabled:cursor-not-allowed disabled:opacity-30"
        >
          <ChevronLeft size={16} />
          Previous
        </button>

        <button
          type="button"
          disabled={
            currentLectureIndex ===
              -1 ||
            currentLectureIndex >=
              totalLectures - 1
          }
          onClick={onNext}
          className="flex items-center justify-center gap-2 rounded-2xl border border-amber-900/30 bg-amber-950/10 px-4 py-4 text-[10px] font-black uppercase tracking-widest text-amber-400 transition-colors hover:bg-amber-950/20 disabled:cursor-not-allowed disabled:opacity-30"
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    );
  },
);

LectureNavigation.displayName =
  "LectureNavigation";

// =====================================================
// MODULE QUIZ
// =====================================================

const ModuleQuizRequirement = memo(
  ({ modules, onOpenQuiz }) => {
    const quizReadyModules =
      modules.filter(
        (module) =>
          module?.totalLectures > 0 &&
          module?.allLecturesCompleted &&
          !module?.quizPassed &&
          !module?.isLocked,
      );

    const passedModules =
      modules.filter(
        (module) =>
          module?.totalLectures > 0 &&
          module?.quizPassed,
      );

    const incompleteModules =
      modules.filter(
        (module) =>
          module?.totalLectures > 0 &&
          !module?.allLecturesCompleted &&
          !module?.isLocked,
      );

    const lockedModules =
      modules.filter(
        (module) =>
          module?.totalLectures > 0 &&
          module?.isLocked,
      );

    return (
      <section className="mt-6 overflow-hidden rounded-3xl border border-amber-900/40 bg-gradient-to-br from-amber-950/20 via-[#0d1012] to-[#08090a] p-5">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-amber-700/40 bg-amber-950/30 text-amber-400">
            <Trophy size={20} />
          </div>

          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-white">
              Module Trials
            </h3>

            <p className="mt-1 text-xs leading-6 text-slate-500">
              Complete each module's lectures and pass its quiz to unlock the next
              module.
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-2">
          {/* QUIZ READY */}

          {quizReadyModules.map(
            (module) => (
              <button
                key={module._id}
                type="button"
                onClick={() =>
                  onOpenQuiz(module)
                }
                className="flex w-full items-center gap-3 rounded-xl border border-amber-900/30 bg-amber-950/10 p-3 text-left transition-colors hover:border-amber-700/50 hover:bg-amber-950/20"
              >
                <ClipboardCheck
                  size={17}
                  className="text-amber-400"
                />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-black text-slate-200">
                    {String(
                      module?.moduleTitle ||
                        "Untitled Module",
                    )}
                  </p>

                  <p className="mt-1 text-[9px] uppercase tracking-widest text-amber-500">
                    Lectures complete — take quiz
                  </p>
                </div>

                <ChevronRight
                  size={16}
                  className="text-amber-500"
                />
              </button>
            ),
          )}

          {/* PASSED */}

          {passedModules.map(
            (module) => (
              <div
                key={module._id}
                className="flex w-full items-center gap-3 rounded-xl border border-emerald-900/30 bg-emerald-950/10 p-3"
              >
                <CheckCircle2
                  size={17}
                  className="text-emerald-400"
                />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-black text-slate-200">
                    {String(
                      module?.moduleTitle ||
                        "Untitled Module",
                    )}
                  </p>

                  <p className="mt-1 text-[9px] uppercase tracking-widest text-emerald-500">
                    Quiz passed
                  </p>
                </div>

                <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">
                  Complete
                </span>
              </div>
            ),
          )}

          {/* INCOMPLETE */}

          {incompleteModules.map(
            (module) => (
              <div
                key={module._id}
                className="flex items-center gap-3 rounded-xl border border-slate-800 bg-black/20 p-3"
              >
                <Lock
                  size={17}
                  className="text-slate-700"
                />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-black text-slate-500">
                    {String(
                      module?.moduleTitle ||
                        "Untitled Module",
                    )}
                  </p>

                  <p className="mt-1 text-[9px] uppercase tracking-widest text-slate-700">
                    {
                      module?.completedCount
                    }
                    /
                    {
                      module?.totalLectures
                    }{" "}
                    completed
                  </p>
                </div>
              </div>
            ),
          )}

          {/* LOCKED */}

          {lockedModules.map(
            (module) => (
              <div
                key={module._id}
                className="flex items-center gap-3 rounded-xl border border-slate-900 bg-black/30 p-3"
              >
                <Lock
                  size={17}
                  className="text-slate-800"
                />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-black text-slate-700">
                    {String(
                      module?.moduleTitle ||
                        "Untitled Module",
                    )}
                  </p>

                  <p className="mt-1 text-[9px] uppercase tracking-widest text-slate-800">
                    Complete previous module + pass quiz
                  </p>
                </div>

                <span className="text-[9px] font-black uppercase tracking-widest text-slate-800">
                  Locked
                </span>
              </div>
            ),
          )}
        </div>
      </section>
    );
  },
);

ModuleQuizRequirement.displayName =
  "ModuleQuizRequirement";

// =====================================================
// LEGACY COMPLETION
// =====================================================

const LegacyCourseCompleted = memo(
  () => {
    return (
      <section className="mt-6 rounded-3xl border border-emerald-900/30 bg-emerald-950/10 p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-950/30 text-emerald-400">
            <Trophy size={22} />
          </div>

          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-emerald-300">
              Course Completed
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              You have completed every lecture in this course.
            </p>
          </div>
        </div>
      </section>
    );
  },
);

LegacyCourseCompleted.displayName =
  "LegacyCourseCompleted";

// =====================================================
// SMALL COMPONENTS
// =====================================================

const CrownIcon = memo(() => (
  <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-amber-700/40 bg-amber-950/20 text-amber-400">
    <Trophy size={14} />
  </div>
));

CrownIcon.displayName = "CrownIcon";

const ScrollIcon = memo(() => (
  <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-amber-900/30 bg-amber-950/20 text-amber-500">
    <FileText size={13} />
  </div>
));

ScrollIcon.displayName = "ScrollIcon";

const ShortcutRow = memo(
  ({ label, shortcut }) => (
    <div className="flex items-center justify-between">
      <span>{label}</span>

      <kbd className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-[9px] font-black text-slate-400">
        {shortcut}
      </kbd>
    </div>
  ),
);

ShortcutRow.displayName =
  "ShortcutRow";

const StatBadge = memo(
  ({ icon, value, label }) => (
    <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-black/20 px-3 py-2">
      <span className="text-amber-500">
        {icon}
      </span>

      <div>
        <p className="text-xs font-black text-slate-200">
          {value}
        </p>

        <p className="text-[8px] font-bold uppercase tracking-widest text-slate-700">
          {label}
        </p>
      </div>
    </div>
  ),
);

StatBadge.displayName =
  "StatBadge";

// =====================================================
// FILE SIZE
// =====================================================

const formatFileSize = (bytes) => {
  const value = Number(bytes);

  if (!value || value <= 0) {
    return "0 B";
  }

  const units = [
    "B",
    "KB",
    "MB",
    "GB",
  ];

  const index = Math.min(
    Math.floor(
      Math.log(value) /
        Math.log(1024),
    ),
    units.length - 1,
  );

  return `${(
    value /
    Math.pow(1024, index)
  ).toFixed(
    index === 0 ? 0 : 1,
  )} ${units[index]}`;
};

export default StudentCourseLearning;
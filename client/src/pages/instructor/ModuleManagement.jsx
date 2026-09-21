import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Crown,
  Edit3,
  Film,
  Flame,
  Gem,
  Layers,
  LoaderCircle,
  Plus,
  RefreshCw,
  ScrollText,
  Shield,
  Sparkles,
  Trash2,
  WandSparkles,
  X,
} from "lucide-react";

import toast from "react-hot-toast";
import api from "../../services/api";

/* =========================================================
   AMBIENT PARTICLES
========================================================= */

const particles = Array.from({ length: 22 }, (_, index) => ({
  id: index,
  left: `${(index * 17) % 100}%`,
  top: `${(index * 29) % 100}%`,
  delay: `${(index % 7) * 0.7}s`,
  duration: `${5 + (index % 6)}s`,
  size: `${2 + (index % 3)}px`,
}));

/* =========================================================
   MAIN COMPONENT
========================================================= */

function ModuleManagement() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const pageRef = useRef(null);
  const cursorRef = useRef(null);
  const cursorDotRef = useRef(null);

  /* =====================================================
     STATE
  ===================================================== */

  const [course, setCourse] = useState(null);

  const [modules, setModules] = useState([]);
  const [lectures, setLectures] = useState([]);

  const [loading, setLoading] = useState(true);
  const [savingModule, setSavingModule] = useState(false);

  const [showCreateForm, setShowCreateForm] = useState(false);

  const [editingModuleId, setEditingModuleId] = useState(null);

  const [expandedModules, setExpandedModules] = useState({});

  const [moduleForm, setModuleForm] = useState({
    moduleTitle: "",
    description: "",
  });

  const [assigningLectureId, setAssigningLectureId] =
    useState(null);

  const [generatingQuizModuleId, setGeneratingQuizModuleId] =
    useState(null);

  const [quizStatus, setQuizStatus] = useState({});

  /* =====================================================
     PREMIUM CURSOR
  ===================================================== */

  useEffect(() => {
    const handlePointerMove = (event) => {
      if (!cursorRef.current || !cursorDotRef.current) return;

      const { clientX, clientY } = event;

      cursorRef.current.style.transform = `translate3d(${clientX}px, ${clientY}px, 0)`;
      cursorDotRef.current.style.transform = `translate3d(${clientX}px, ${clientY}px, 0)`;
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

  const fetchCourse = useCallback(async () => {
    try {
      const response = await api.get(`/course/${courseId}`);

      if (response.data?.success) {
        setCourse(response.data.course);
      }
    } catch (error) {
      console.error("Fetch course error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to load course."
      );
    }
  }, [courseId]);

  /* =====================================================
     FETCH MODULES
  ===================================================== */

  const fetchModules = useCallback(async () => {
    try {
      const response = await api.get(
        `/course/${courseId}/modules`
      );

      if (response.data?.success) {
        setModules(response.data.modules || []);
      } else {
        setModules([]);
      }
    } catch (error) {
      console.error("Fetch modules error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to load modules."
      );
    }
  }, [courseId]);

  /* =====================================================
     FETCH LECTURES
  ===================================================== */

  const fetchLectures = useCallback(async () => {
    try {
      const response = await api.get(
        `/lecture/course/${courseId}`
      );

      if (response.data?.success) {
        setLectures(response.data.lectures || []);
      } else {
        setLectures([]);
      }
    } catch (error) {
      console.error("Fetch lectures error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to load lectures."
      );
    }
  }, [courseId]);

  /* =====================================================
     FETCH QUIZ STATUS
  ===================================================== */

  const fetchQuizStatuses = useCallback(
    async (moduleList) => {
      if (!moduleList?.length) {
        setQuizStatus({});
        return;
      }

      const statuses = {};

      await Promise.all(
        moduleList.map(async (module) => {
          try {
            const response = await api.get(
              `/module/${module._id}/quiz`
            );

            statuses[module._id] =
              response.data?.success &&
              response.data?.quiz
                ? true
                : false;
          } catch (error) {
            if (error.response?.status === 404) {
              statuses[module._id] = false;
            } else {
              console.error(
                `Quiz status error for ${module.moduleTitle}:`,
                error
              );

              statuses[module._id] = false;
            }
          }
        })
      );

      setQuizStatus(statuses);
    },
    []
  );

  /* =====================================================
     LOAD EVERYTHING
  ===================================================== */

  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      await Promise.all([
        fetchCourse(),
        fetchModules(),
        fetchLectures(),
      ]);
    } finally {
      setLoading(false);
    }
  }, [fetchCourse, fetchModules, fetchLectures]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (modules.length > 0) {
      fetchQuizStatuses(modules);
    }
  }, [modules, fetchQuizStatuses]);

  /* =====================================================
     LECTURES GROUPED BY MODULE
  ===================================================== */

  const moduleLectureMap = useMemo(() => {
    const map = {};

    modules.forEach((module) => {
      map[module._id] = [];
    });

    lectures.forEach((lecture) => {
      const moduleId =
        lecture.module?._id ||
        lecture.module ||
        null;

      if (moduleId && map[moduleId]) {
        map[moduleId].push(lecture);
      }
    });

    Object.keys(map).forEach((moduleId) => {
      map[moduleId].sort(
        (a, b) => (a.order || 0) - (b.order || 0)
      );
    });

    return map;
  }, [modules, lectures]);

  /* =====================================================
     UNASSIGNED LECTURES
  ===================================================== */

  const unassignedLectures = useMemo(() => {
    return lectures.filter((lecture) => {
      const moduleId =
        lecture.module?._id ||
        lecture.module ||
        null;

      return !moduleId;
    });
  }, [lectures]);

  /* =====================================================
     TOGGLE MODULE
  ===================================================== */

  const toggleModule = (moduleId) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  /* =====================================================
     CREATE MODULE
  ===================================================== */

  const handleCreateModule = async (e) => {
    e.preventDefault();

    const title = moduleForm.moduleTitle.trim();
    const description = moduleForm.description.trim();

    if (!title) {
      toast.error("Module title is required.");
      return;
    }

    try {
      setSavingModule(true);

      const response = await api.post(
        `/course/${courseId}/modules`,
        {
          moduleTitle: title,
          description,
        }
      );

      if (response.data?.success) {
        toast.success("Module created successfully.");

        setModuleForm({
          moduleTitle: "",
          description: "",
        });

        setShowCreateForm(false);

        await fetchModules();
      } else {
        toast.error(
          response.data?.message ||
            "Failed to create module."
        );
      }
    } catch (error) {
      console.error("Create module error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to create module."
      );
    } finally {
      setSavingModule(false);
    }
  };

  /* =====================================================
     START EDIT
  ===================================================== */

  const startEditModule = (module) => {
    setEditingModuleId(module._id);

    setModuleForm({
      moduleTitle: module.moduleTitle || "",
      description: module.description || "",
    });
  };

  /* =====================================================
     CANCEL EDIT
  ===================================================== */

  const cancelEdit = () => {
    setEditingModuleId(null);

    setModuleForm({
      moduleTitle: "",
      description: "",
    });
  };

  /* =====================================================
     UPDATE MODULE
  ===================================================== */

  const handleUpdateModule = async (e, moduleId) => {
    e.preventDefault();

    const title = moduleForm.moduleTitle.trim();
    const description = moduleForm.description.trim();

    if (!title) {
      toast.error("Module title is required.");
      return;
    }

    try {
      setSavingModule(true);

      const response = await api.put(
        `/module/${moduleId}`,
        {
          moduleTitle: title,
          description,
        }
      );

      if (response.data?.success) {
        toast.success("Module updated successfully.");

        cancelEdit();

        await fetchModules();
      } else {
        toast.error(
          response.data?.message ||
            "Failed to update module."
        );
      }
    } catch (error) {
      console.error("Update module error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to update module."
      );
    } finally {
      setSavingModule(false);
    }
  };

  /* =====================================================
     DELETE MODULE
  ===================================================== */

  const handleDeleteModule = async (module) => {
    const moduleLectures =
      moduleLectureMap[module._id] || [];

    if (moduleLectures.length > 0) {
      toast.error(
        "Remove all lectures from this module before deleting it."
      );

      return;
    }

    const confirmed = window.confirm(
      `Delete "${module.moduleTitle}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      const response = await api.delete(
        `/module/${module._id}`
      );

      if (response.data?.success) {
        toast.success("Module deleted successfully.");

        await fetchModules();
      } else {
        toast.error(
          response.data?.message ||
            "Failed to delete module."
        );
      }
    } catch (error) {
      console.error("Delete module error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to delete module."
      );
    }
  };

  /* =====================================================
     ASSIGN LECTURE
  ===================================================== */

  const handleAssignLecture = async (
    lectureId,
    moduleId
  ) => {
    try {
      setAssigningLectureId(lectureId);

      const response = await api.put(
        `/lecture/${lectureId}`,
        {
          moduleId: moduleId || null,
        }
      );

      if (response.data?.success) {
        toast.success(
          moduleId
            ? "Lecture assigned to module."
            : "Lecture removed from module."
        );

        await fetchLectures();
      } else {
        toast.error(
          response.data?.message ||
            "Failed to update lecture."
        );
      }
    } catch (error) {
      console.error("Assign lecture error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to update lecture."
      );
    } finally {
      setAssigningLectureId(null);
    }
  };

  /* =====================================================
     GENERATE AI QUIZ
  ===================================================== */

  const handleGenerateQuiz = async (module) => {
    const moduleLectures =
      moduleLectureMap[module._id] || [];

    if (moduleLectures.length === 0) {
      toast.error(
        "Add lectures to this module before generating the AI quiz."
      );

      return;
    }

    if (quizStatus[module._id]) {
      toast(
        "This module already has an AI quiz.",
        {
          icon: "ℹ️",
        }
      );

      return;
    }

    const confirmed = window.confirm(
      `Generate an AI quiz for "${module.moduleTitle}" using its lectures?`
    );

    if (!confirmed) return;

    try {
      setGeneratingQuizModuleId(module._id);

      const response = await api.post(
        `/module/${module._id}/quiz/generate`,
        {
          questionCount: 10,
        }
      );

      if (response.data?.success) {
        toast.success(
          "AI quiz generated successfully!"
        );

        setQuizStatus((prev) => ({
          ...prev,
          [module._id]: true,
        }));
      } else {
        toast.error(
          response.data?.message ||
            "Failed to generate AI quiz."
        );
      }
    } catch (error) {
      console.error("Generate quiz error:", error);

      if (
        error.response?.data?.code ===
        "AI_QUOTA_EXCEEDED"
      ) {
        toast.error(
          "AI quota exceeded. Please try again later."
        );
      } else {
        toast.error(
          error.response?.data?.message ||
            "Unable to generate AI quiz."
        );
      }
    } finally {
      setGeneratingQuizModuleId(null);
    }
  };

  /* =====================================================
     NAVIGATION
  ===================================================== */

  const goBack = () => {
    navigate(`/instructor/courses/${courseId}`);
  };

  const goToLectures = () => {
    navigate(`/instructor/courses/${courseId}/lectures`);
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="relative flex min-h-[calc(100vh-80px)] items-center justify-center overflow-hidden bg-[#070605] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(245,158,11,0.12),transparent_35%),radial-gradient(circle_at_80%_90%,rgba(127,29,29,0.15),transparent_30%)]" />

        {particles.slice(0, 12).map((particle) => (
          <span
            key={particle.id}
            className="absolute rounded-full bg-amber-400/50 blur-[1px] animate-pulse"
            style={{
              left: particle.left,
              top: particle.top,
              width: particle.size,
              height: particle.size,
              animationDelay: particle.delay,
              animationDuration: particle.duration,
            }}
          />
        ))}

        <div className="relative z-10 text-center">
          <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center">
            <div className="absolute inset-0 animate-spin rounded-full border border-amber-400/20 border-t-amber-400" />

            <div className="absolute inset-3 rounded-full bg-amber-500/10 shadow-[0_0_50px_rgba(245,158,11,0.2)]" />

            <Crown
              size={38}
              className="relative text-amber-400"
            />
          </div>

          <p className="text-xs font-bold uppercase tracking-[0.35em] text-amber-400/70">
            Instructor Realm
          </p>

          <h2 className="mt-3 text-xl font-semibold">
            Summoning Course Structure
          </h2>

          <p className="mt-2 text-sm text-white/40">
            Preparing your modules and lectures...
          </p>
        </div>
      </div>
    );
  }

  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <div
      ref={pageRef}
      className="relative min-h-full overflow-hidden bg-[#070605] text-white"
    >
      {/* =================================================
          AMBIENT BACKGROUND
      ================================================= */}

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-20 h-[420px] w-[420px] rounded-full bg-orange-600/10 blur-[130px]" />

        <div className="absolute right-[-120px] top-[30%] h-[420px] w-[420px] rounded-full bg-red-900/10 blur-[140px]" />

        <div className="absolute bottom-[-180px] left-[35%] h-[400px] w-[500px] rounded-full bg-amber-500/[0.06] blur-[140px]" />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:44px_44px]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_25%,rgba(0,0,0,0.55)_100%)]" />
      </div>

      {/* =================================================
          EMBERS
      ================================================= */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <span
            key={particle.id}
            className="absolute rounded-full bg-amber-400/50 shadow-[0_0_12px_rgba(245,158,11,0.7)] animate-pulse"
            style={{
              left: particle.left,
              top: particle.top,
              width: particle.size,
              height: particle.size,
              animationDelay: particle.delay,
              animationDuration: particle.duration,
            }}
          />
        ))}
      </div>

      {/* =================================================
          PREMIUM CURSOR
      ================================================= */}

      <div
        ref={cursorRef}
        className="pointer-events-none fixed left-0 top-0 z-[100] hidden h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-400/50 md:block"
        style={{
          marginLeft: 0,
          marginTop: 0,
          transition:
            "width .2s ease, height .2s ease, border-color .2s ease",
        }}
      />

      <div
        ref={cursorDotRef}
        className="pointer-events-none fixed left-0 top-0 z-[101] hidden h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-400 shadow-[0_0_12px_rgba(245,158,11,1)] md:block"
      />

      {/* =================================================
          CONTENT
      ================================================= */}

      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">

          {/* =================================================
              TOP NAV
          ================================================= */}

          <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={goBack}
              className="group inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-4 py-2.5 text-xs font-semibold text-white/55 backdrop-blur-xl transition duration-300 hover:border-amber-400/30 hover:bg-amber-400/[0.06] hover:text-amber-300"
            >
              <ArrowLeft
                size={16}
                className="transition-transform duration-300 group-hover:-translate-x-1"
              />
              Back to Course
            </button>

            <div className="flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/[0.05] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-300/80">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
              Course Structure Online
            </div>
          </div>

          {/* =================================================
              HERO
          ================================================= */}

          <section className="relative mb-8 overflow-hidden rounded-[32px] border border-amber-200/10 bg-gradient-to-br from-[#17110b] via-[#0e0b08] to-[#090807] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.45)] sm:p-8 lg:p-10">
            <div className="pointer-events-none absolute right-[-80px] top-[-100px] h-[300px] w-[300px] rounded-full bg-orange-500/10 blur-[90px]" />

            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">

                <div className="mb-5 flex flex-wrap items-center gap-3">
                  <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/[0.06] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.24em] text-amber-300">
                    <Layers size={13} />
                    Module Management
                  </div>

                  <div className="h-1 w-1 rounded-full bg-white/20" />

                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">
                    Instructor Command
                  </span>
                </div>

                <div className="flex items-start gap-4">
                  <div className="hidden h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-amber-400/20 bg-amber-400/[0.06] shadow-[0_0_40px_rgba(245,158,11,0.08)] sm:flex">
                    <Crown
                      size={30}
                      className="text-amber-400"
                    />
                  </div>

                  <div>
                    <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
                      The Course
                      <span className="block bg-gradient-to-r from-amber-200 via-orange-400 to-amber-500 bg-clip-text text-transparent">
                        Realm
                      </span>
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-7 text-white/45">
                      {course?.courseTitle ||
                        "Course Modules"}
                    </p>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-white/35">
                      Shape your course into a structured
                      learning journey, command your lectures,
                      and forge AI-powered assessments.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={goToLectures}
                  className="group inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.045] px-5 py-3.5 text-sm font-semibold text-white/70 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-amber-400/30 hover:bg-amber-400/[0.07] hover:text-amber-200"
                >
                  <Film
                    size={17}
                    className="text-amber-400"
                  />
                  Manage Lectures
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setShowCreateForm(true)
                  }
                  className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 px-5 py-3.5 text-sm font-bold text-black shadow-[0_12px_35px_rgba(245,158,11,0.18)] transition duration-300 hover:-translate-y-1 hover:from-amber-400 hover:to-orange-500"
                >
                  <Plus
                    size={17}
                    className="transition-transform duration-300 group-hover:rotate-90"
                  />
                  Create Module
                </button>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3 border-t border-white/[0.06] pt-6 sm:grid-cols-4">
              <HeroMetric
                icon={<Layers size={15} />}
                label="Modules"
                value={modules.length}
              />

              <HeroMetric
                icon={<Film size={15} />}
                label="Lectures"
                value={lectures.length}
              />

              <HeroMetric
                icon={<Sparkles size={15} />}
                label="AI Quizzes"
                value={
                  Object.values(quizStatus).filter(Boolean)
                    .length
                }
              />

              <HeroMetric
                icon={<ScrollText size={15} />}
                label="Unassigned"
                value={unassignedLectures.length}
              />
            </div>
          </section>

          {/* =================================================
              CREATE MODULE
          ================================================= */}

          {showCreateForm && (
            <section className="mb-7 overflow-hidden rounded-[30px] border border-amber-400/15 bg-[#100d09]/90 shadow-[0_25px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
              <div className="border-b border-white/[0.06] bg-gradient-to-r from-amber-400/[0.07] to-transparent px-5 py-5 sm:px-7">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-amber-400/20 bg-amber-400/[0.07] text-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.08)]">
                      <Plus size={19} />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-bold text-white">
                          Forge New Module
                        </h2>

                        <Sparkles
                          size={15}
                          className="text-amber-400"
                        />
                      </div>

                      <p className="mt-1 text-xs leading-5 text-white/35">
                        Create a new chapter in your
                        learning realm.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateForm(false);

                      setModuleForm({
                        moduleTitle: "",
                        description: "",
                      });
                    }}
                    className="rounded-xl border border-white/10 p-2 text-white/35 transition hover:border-red-400/20 hover:bg-red-500/[0.08] hover:text-red-300"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              <form
                onSubmit={handleCreateModule}
                className="space-y-5 p-5 sm:p-7"
              >
                <ModuleFormFields
                  form={moduleForm}
                  setForm={setModuleForm}
                />

                <div className="flex flex-wrap justify-end gap-3 border-t border-white/[0.06] pt-5">
                  <button
                    type="button"
                    onClick={() =>
                      setShowCreateForm(false)
                    }
                    className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white/50 transition hover:border-white/20 hover:text-white"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={savingModule}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-5 py-3 text-sm font-bold text-black transition hover:from-amber-400 hover:to-orange-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {savingModule ? (
                      <>
                        <LoaderCircle
                          size={17}
                          className="animate-spin"
                        />
                        Forging...
                      </>
                    ) : (
                      <>
                        <Plus size={17} />
                        Create Module
                      </>
                    )}
                  </button>
                </div>
              </form>
            </section>
          )}

          {/* =================================================
              MODULES
          ================================================= */}

          {modules.length === 0 ? (
            <EmptyModules
              onCreate={() => setShowCreateForm(true)}
            />
          ) : (
            <div className="space-y-5">
              {modules.map((module, index) => {
                const moduleLectures =
                  moduleLectureMap[module._id] || [];

                const isExpanded =
                  expandedModules[module._id] ?? true;

                const isEditing =
                  editingModuleId === module._id;

                const hasQuiz =
                  quizStatus[module._id] === true;

                const generatingQuiz =
                  generatingQuizModuleId ===
                  module._id;

                return (
                  <section
                    key={module._id}
                    className={`group overflow-hidden rounded-[30px] border bg-[#0e0b08]/90 shadow-[0_20px_70px_rgba(0,0,0,0.3)] backdrop-blur-xl transition duration-500 ${
                      isExpanded
                        ? "border-amber-400/15"
                        : "border-white/[0.07]"
                    }`}
                  >
                    {/* MODULE HEADER */}

                    <div className="relative p-5 sm:p-7">
                      <div className="pointer-events-none absolute right-[-60px] top-[-80px] h-44 w-44 rounded-full bg-amber-500/[0.05] blur-[70px] transition duration-500 group-hover:bg-amber-500/[0.09]" />

                      <div className="relative flex items-start gap-4">
                        {/* NUMBER */}

                        <div className="relative shrink-0">
                          <div className="absolute inset-0 rounded-2xl bg-amber-500/20 blur-xl transition duration-500 group-hover:bg-amber-500/35" />

                          <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-400/20 bg-gradient-to-br from-amber-400/[0.12] to-orange-600/[0.04] text-sm font-black text-amber-300">
                            {String(index + 1).padStart(
                              2,
                              "0"
                            )}
                          </div>
                        </div>

                        <div className="min-w-0 flex-1">
                          {isEditing ? (
                            <form
                              onSubmit={(e) =>
                                handleUpdateModule(
                                  e,
                                  module._id
                                )
                              }
                              className="space-y-5"
                            >
                              <ModuleFormFields
                                form={moduleForm}
                                setForm={setModuleForm}
                              />

                              <div className="flex flex-wrap gap-3">
                                <button
                                  type="submit"
                                  disabled={savingModule}
                                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-2.5 text-sm font-bold text-black transition hover:from-amber-400 hover:to-orange-500 disabled:opacity-50"
                                >
                                  {savingModule ? (
                                    <>
                                      <LoaderCircle
                                        size={16}
                                        className="animate-spin"
                                      />
                                      Saving...
                                    </>
                                  ) : (
                                    <>
                                      <CheckCircle2
                                        size={16}
                                      />
                                      Save Changes
                                    </>
                                  )}
                                </button>

                                <button
                                  type="button"
                                  onClick={cancelEdit}
                                  className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-white/50 transition hover:bg-white/[0.06] hover:text-white"
                                >
                                  Cancel
                                </button>
                              </div>
                            </form>
                          ) : (
                            <>
                              <div className="flex flex-wrap items-center gap-2">
                                <h2 className="text-lg font-bold tracking-tight text-white sm:text-xl">
                                  {module.moduleTitle}
                                </h2>

                                {hasQuiz && (
                                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/[0.07] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                                    <CheckCircle2
                                      size={12}
                                    />
                                    AI Quiz Ready
                                  </span>
                                )}
                              </div>

                              <p className="mt-2 max-w-3xl text-sm leading-6 text-white/35">
                                {module.description ||
                                  "No module description added."}
                              </p>

                              <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px] font-medium text-white/35">
                                <span className="inline-flex items-center gap-1.5">
                                  <Film
                                    size={13}
                                    className="text-amber-400/70"
                                  />
                                  {moduleLectures.length}{" "}
                                  {moduleLectures.length ===
                                  1
                                    ? "Lecture"
                                    : "Lectures"}
                                </span>

                                <span className="h-1 w-1 rounded-full bg-white/15" />

                                <span className="inline-flex items-center gap-1.5">
                                  <Shield
                                    size={13}
                                    className="text-orange-400/70"
                                  />
                                  Module {index + 1}
                                </span>
                              </div>
                            </>
                          )}
                        </div>

                        {/* ACTIONS */}

                        {!isEditing && (
                          <div className="flex shrink-0 items-center gap-1">
                            <button
                              type="button"
                              onClick={() =>
                                startEditModule(
                                  module
                                )
                              }
                              title="Edit module"
                              className="rounded-xl border border-transparent p-2.5 text-white/25 transition duration-300 hover:border-amber-400/15 hover:bg-amber-400/[0.06] hover:text-amber-300"
                            >
                              <Edit3 size={17} />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteModule(
                                  module
                                )
                              }
                              title="Delete module"
                              className="rounded-xl border border-transparent p-2.5 text-white/25 transition duration-300 hover:border-red-400/15 hover:bg-red-500/[0.06] hover:text-red-300"
                            >
                              <Trash2 size={17} />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                toggleModule(
                                  module._id
                                )
                              }
                              title={
                                isExpanded
                                  ? "Collapse"
                                  : "Expand"
                              }
                              className="rounded-xl border border-transparent p-2.5 text-white/25 transition duration-300 hover:border-white/10 hover:bg-white/[0.05] hover:text-white"
                            >
                              {isExpanded ? (
                                <ChevronUp size={18} />
                              ) : (
                                <ChevronDown
                                  size={18}
                                />
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* MODULE CONTENT */}

                    {!isEditing && isExpanded && (
                      <div className="border-t border-white/[0.06] bg-black/10">
                        <div className="p-5 sm:p-7">
                          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <ScrollText
                                  size={15}
                                  className="text-amber-400"
                                />

                                <h3 className="text-sm font-bold text-white">
                                  Module Lectures
                                </h3>
                              </div>

                              <p className="mt-1 text-xs text-white/30">
                                These lectures belong to
                                this module.
                              </p>
                            </div>

                            <span className="w-fit rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white/45">
                              {moduleLectures.length}{" "}
                              lectures
                            </span>
                          </div>

                          {moduleLectures.length ===
                          0 ? (
                            <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center">
                              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-400/10 bg-amber-400/[0.04]">
                                <Film
                                  size={22}
                                  className="text-white/20"
                                />
                              </div>

                              <p className="mt-4 text-sm font-semibold text-white/60">
                                No lectures assigned
                              </p>

                              <p className="mt-1 text-xs text-white/25">
                                Use the assignment section
                                below to organize this
                                module.
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {moduleLectures.map(
                                (
                                  lecture,
                                  lectureIndex
                                ) => (
                                  <LectureRow
                                    key={
                                      lecture._id
                                    }
                                    lecture={
                                      lecture
                                    }
                                    index={
                                      lectureIndex
                                    }
                                    moduleId={
                                      module._id
                                    }
                                    modules={
                                      modules
                                    }
                                    assigningLectureId={
                                      assigningLectureId
                                    }
                                    onAssign={
                                      handleAssignLecture
                                    }
                                  />
                                )
                              )}
                            </div>
                          )}

                          {/* AI QUIZ */}

                          <div className="relative mt-6 overflow-hidden rounded-[24px] border border-amber-400/15 bg-gradient-to-br from-amber-400/[0.07] via-orange-500/[0.025] to-transparent p-5 sm:p-6">
                            <div className="pointer-events-none absolute right-[-40px] top-[-60px] h-40 w-40 rounded-full bg-amber-400/10 blur-[60px]" />

                            <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                              <div className="flex items-start gap-4">
                                <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-amber-400/20 bg-amber-400/[0.08] text-amber-400 shadow-[0_0_35px_rgba(245,158,11,0.08)]">
                                  <WandSparkles
                                    size={21}
                                  />
                                </div>

                                <div>
                                  <div className="flex flex-wrap items-center gap-2">
                                    <h3 className="text-sm font-bold text-white">
                                      AI Module Quiz
                                    </h3>

                                    <span className="rounded-full border border-amber-400/15 bg-amber-400/[0.05] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-300/70">
                                      Gemini
                                    </span>
                                  </div>

                                  <p className="mt-1 max-w-xl text-xs leading-5 text-white/35">
                                    Generate an intelligent
                                    assessment from the
                                    lectures inside this
                                    module.
                                  </p>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  handleGenerateQuiz(
                                    module
                                  )
                                }
                                disabled={
                                  generatingQuiz ||
                                  moduleLectures.length ===
                                    0 ||
                                  hasQuiz
                                }
                                className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-xl px-5 py-3 text-xs font-bold transition ${
                                  hasQuiz
                                    ? "cursor-default border border-emerald-400/20 bg-emerald-400/[0.07] text-emerald-300"
                                    : "bg-gradient-to-r from-amber-500 to-orange-600 text-black shadow-[0_10px_30px_rgba(245,158,11,0.15)] hover:-translate-y-0.5 hover:from-amber-400 hover:to-orange-500 disabled:cursor-not-allowed disabled:opacity-40"
                                }`}
                              >
                                {generatingQuiz ? (
                                  <>
                                    <LoaderCircle
                                      size={16}
                                      className="animate-spin"
                                    />
                                    Generating...
                                  </>
                                ) : hasQuiz ? (
                                  <>
                                    <CheckCircle2
                                      size={16}
                                    />
                                    Quiz Generated
                                  </>
                                ) : (
                                  <>
                                    <Sparkles
                                      size={16}
                                    />
                                    Generate AI Quiz
                                  </>
                                )}
                              </button>
                            </div>

                            {generatingQuiz && (
                              <div className="relative mt-4 overflow-hidden rounded-xl border border-amber-400/10 bg-black/20 px-4 py-3 text-xs leading-5 text-amber-200/60">
                                <div className="absolute inset-y-0 left-0 w-1/3 animate-[pulse_1.5s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-amber-400/10 to-transparent" />

                                <span className="relative">
                                  Gemini is reading the
                                  module lectures and
                                  forging questions. This
                                  may take a few seconds.
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </section>
                );
              })}
            </div>
          )}

          {/* =================================================
              UNASSIGNED LECTURES
          ================================================= */}

          <section className="mt-8 overflow-hidden rounded-[30px] border border-orange-400/15 bg-[#0d0a07]/90 shadow-[0_20px_70px_rgba(0,0,0,0.3)] backdrop-blur-xl">
            <div className="border-b border-orange-400/10 bg-gradient-to-r from-orange-500/[0.07] to-transparent px-5 py-5 sm:px-7">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-orange-400/20 bg-orange-400/[0.06] text-orange-400">
                  <Film size={19} />
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-base font-bold text-white">
                      Unassigned Lectures
                    </h2>

                    <span className="rounded-full border border-orange-400/15 bg-orange-400/[0.06] px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-orange-300">
                      Needs Attention
                    </span>
                  </div>

                  <p className="mt-1 text-xs leading-5 text-white/30">
                    These lectures are not currently inside
                    any module.
                  </p>
                </div>

                <span className="ml-auto rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-bold text-orange-300">
                  {unassignedLectures.length}
                </span>
              </div>
            </div>

            <div className="p-5 sm:p-7">
              {unassignedLectures.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-9 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.05]">
                    <CheckCircle2
                      size={28}
                      className="text-emerald-400"
                    />
                  </div>

                  <h3 className="mt-4 text-sm font-bold text-white">
                    All lectures are organized
                  </h3>

                  <p className="mt-1 text-xs text-white/30">
                    Every lecture belongs to a module.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {unassignedLectures.map(
                    (lecture, index) => (
                      <LectureRow
                        key={lecture._id}
                        lecture={lecture}
                        index={index}
                        moduleId={null}
                        modules={modules}
                        assigningLectureId={
                          assigningLectureId
                        }
                        onAssign={
                          handleAssignLecture
                        }
                        showAssignmentOnly
                      />
                    )
                  )}
                </div>
              )}
            </div>
          </section>

          {/* =================================================
              REFRESH
          ================================================= */}

          <div className="mt-7 flex justify-center pb-6">
            <button
              type="button"
              onClick={loadData}
              className="group inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.025] px-4 py-2.5 text-xs font-semibold text-white/35 transition duration-300 hover:border-amber-400/20 hover:bg-amber-400/[0.04] hover:text-amber-300"
            >
              <RefreshCw
                size={14}
                className="transition-transform duration-500 group-hover:rotate-180"
              />
              Refresh Structure
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   MODULE FORM FIELDS
========================================================= */

function ModuleFormFields({ form, setForm }) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <div>
        <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-amber-300/60">
          Module Title
        </label>

        <div className="relative">
          <BookOpen
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20"
          />

          <input
            type="text"
            value={form.moduleTitle}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                moduleTitle: e.target.value,
              }))
            }
            placeholder="Example: JavaScript Fundamentals"
            className="w-full rounded-2xl border border-white/10 bg-black/20 py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-amber-400/40 focus:bg-black/30 focus:ring-4 focus:ring-amber-400/[0.05]"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-amber-300/60">
          Description
        </label>

        <textarea
          value={form.description}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              description: e.target.value,
            }))
          }
          rows={1}
          placeholder="Describe what students will learn in this module..."
          className="w-full resize-none rounded-2xl border border-white/10 bg-black/20 px-4 py-3.5 text-sm leading-6 text-white outline-none transition placeholder:text-white/20 focus:border-amber-400/40 focus:bg-black/30 focus:ring-4 focus:ring-amber-400/[0.05]"
        />
      </div>
    </div>
  );
}

/* =========================================================
   LECTURE ROW
========================================================= */

function LectureRow({
  lecture,
  index,
  moduleId,
  modules,
  assigningLectureId,
  onAssign,
  showAssignmentOnly = false,
}) {
  const currentModuleId =
    lecture.module?._id ||
    lecture.module ||
    null;

  const isUpdating =
    assigningLectureId === lecture._id;

  return (
    <div className="group/lecture relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 transition duration-300 hover:-translate-y-0.5 hover:border-amber-400/15 hover:bg-amber-400/[0.035]">
      <div className="absolute inset-y-0 left-0 w-0.5 bg-gradient-to-b from-amber-400 to-orange-600 opacity-0 transition duration-300 group-hover/lecture:opacity-100" />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-black/20 text-[10px] font-bold text-white/35">
            {String(index + 1).padStart(2, "0")}
          </div>

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-amber-400/10 bg-amber-400/[0.05] text-amber-400">
            <Film size={16} />
          </div>

          <div className="min-w-0">
            <h4 className="truncate text-sm font-semibold text-white/80 transition group-hover/lecture:text-white">
              {lecture.lectureTitle ||
                lecture.title ||
                "Untitled Lecture"}
            </h4>

            <p className="mt-1 text-[10px] uppercase tracking-wider text-white/25">
              Lecture {lecture.order || index + 1}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <select
            value={currentModuleId || ""}
            disabled={isUpdating}
            onChange={(e) =>
              onAssign(
                lecture._id,
                e.target.value || null
              )
            }
            className="min-w-[230px] cursor-pointer rounded-xl border border-white/10 bg-[#090806] px-3 py-2.5 text-xs font-medium text-white/55 outline-none transition focus:border-amber-400/40 focus:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">
              {showAssignmentOnly
                ? "Select module"
                : "Remove from module"}
            </option>

            {modules.map((module) => (
              <option
                key={module._id}
                value={module._id}
              >
                Module {module.order} —{" "}
                {module.moduleTitle}
              </option>
            ))}
          </select>

          {isUpdating && (
            <LoaderCircle
              size={17}
              className="animate-spin text-amber-400"
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   HERO METRIC
========================================================= */

function HeroMetric({ icon, label, value }) {
  return (
    <div className="group/metric rounded-2xl border border-white/[0.06] bg-white/[0.025] p-3 transition duration-300 hover:border-amber-400/15 hover:bg-amber-400/[0.035]">
      <div className="flex items-center gap-2">
        <span className="text-amber-400/70">
          {icon}
        </span>

        <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/25">
          {label}
        </span>
      </div>

      <p className="mt-2 text-xl font-black text-white">
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   EMPTY MODULES
========================================================= */

function EmptyModules({ onCreate }) {
  return (
    <div className="relative overflow-hidden rounded-[32px] border border-dashed border-amber-400/15 bg-[#0d0a07]/90 px-6 py-20 text-center shadow-[0_25px_80px_rgba(0,0,0,0.3)]">
      <div className="pointer-events-none absolute left-1/2 top-0 h-56 w-56 -translate-x-1/2 rounded-full bg-amber-500/10 blur-[90px]" />

      <div className="relative">
        <div className="relative mx-auto flex h-20 w-20 items-center justify-center">
          <div className="absolute inset-0 rounded-[28px] border border-amber-400/20 bg-amber-400/[0.05] rotate-45" />

          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-400/15 bg-[#120d08] text-amber-400 shadow-[0_0_40px_rgba(245,158,11,0.1)]">
            <Layers size={29} />
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-amber-400/60">
          <Flame size={13} />
          The Realm Awaits
          <Flame size={13} />
        </div>

        <h2 className="mt-3 text-2xl font-black text-white">
          No Modules Yet
        </h2>

        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/30">
          Begin shaping your course by creating its
          first module. Your lectures can then be assigned
          to their rightful place.
        </p>

        <button
          type="button"
          onClick={onCreate}
          className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-3.5 text-sm font-bold text-black shadow-[0_15px_40px_rgba(245,158,11,0.16)] transition duration-300 hover:-translate-y-1 hover:from-amber-400 hover:to-orange-500"
        >
          <Plus size={18} />
          Forge First Module
        </button>
      </div>
    </div>
  );
}

export default ModuleManagement;
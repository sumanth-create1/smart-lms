import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Edit3,
  Film,
  Layers,
  LoaderCircle,
  Plus,
  RefreshCw,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

import api from "../../services/api";

function ModuleManagement() {
  const { courseId } = useParams();
  const navigate = useNavigate();

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

  const [assigningLectureId, setAssigningLectureId] = useState(null);

  const [generatingQuizModuleId, setGeneratingQuizModuleId] =
    useState(null);

  const [quizStatus, setQuizStatus] = useState({});

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
     ASSIGN LECTURE TO MODULE
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
     BACK TO COURSE
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
      <div className="flex min-h-[600px] items-center justify-center bg-[#F7F6F2]">
        <div className="flex flex-col items-center gap-3">
          <LoaderCircle
            size={38}
            className="animate-spin text-indigo-600"
          />

          <p className="text-sm text-gray-500">
            Loading course structure...
          </p>
        </div>
      </div>
    );
  }

  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <div className="min-h-full bg-[#F7F6F2] p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-8">

          <button
            type="button"
            onClick={goBack}
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-gray-900"
          >
            <ArrowLeft size={18} />
            Back to Course
          </button>

          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

            <div>
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-indigo-600">
                <Layers size={17} />
                Module Management
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-[#15121F]">
                {course?.courseTitle || "Course Modules"}
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                Organize your lectures into modules and
                generate AI-powered quizzes for each module.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">

              <button
                type="button"
                onClick={goToLectures}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-indigo-200 hover:text-indigo-600"
              >
                <Film size={17} />
                Manage Lectures
              </button>

              <button
                type="button"
                onClick={() =>
                  setShowCreateForm(true)
                }
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
              >
                <Plus size={17} />
                Create Module
              </button>
            </div>
          </div>
        </div>

        {/* =================================================
            CREATE MODULE
        ================================================= */}

        {showCreateForm && (
          <div className="mb-6 rounded-3xl border border-indigo-100 bg-white p-6 shadow-sm">

            <div className="mb-5 flex items-start justify-between">

              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <Plus size={18} />
                  </div>

                  <h2 className="text-lg font-semibold text-gray-900">
                    Create New Module
                  </h2>
                </div>

                <p className="mt-2 text-sm text-gray-500">
                  Create a learning section for your
                  course lectures.
                </p>
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
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              >
                <X size={19} />
              </button>
            </div>

            <form
              onSubmit={handleCreateModule}
              className="space-y-5"
            >
              <ModuleFormFields
                form={moduleForm}
                setForm={setModuleForm}
              />

              <div className="flex justify-end gap-3">

                <button
                  type="button"
                  onClick={() =>
                    setShowCreateForm(false)
                  }
                  className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={savingModule}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
                >
                  {savingModule ? (
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
                      Create Module
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* =================================================
            SUMMARY
        ================================================= */}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

          <SummaryCard
            icon={<Layers size={20} />}
            title="Modules"
            value={modules.length}
          />

          <SummaryCard
            icon={<Film size={20} />}
            title="Lectures"
            value={lectures.length}
          />

          <SummaryCard
            icon={<Sparkles size={20} />}
            title="AI Quizzes"
            value={
              Object.values(quizStatus).filter(Boolean)
                .length
            }
          />
        </div>

        {/* =================================================
            MODULE LIST
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
                <div
                  key={module._id}
                  className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm"
                >

                  {/* MODULE HEADER */}

                  <div className="p-5 sm:p-6">

                    <div className="flex items-start gap-4">

                      {/* ORDER */}

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-sm font-bold text-indigo-600">
                        {index + 1}
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
                            className="space-y-4"
                          >
                            <ModuleFormFields
                              form={moduleForm}
                              setForm={setModuleForm}
                            />

                            <div className="flex flex-wrap gap-3">

                              <button
                                type="submit"
                                disabled={
                                  savingModule
                                }
                                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
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
                                className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        ) : (
                          <>
                            <div className="flex flex-wrap items-center gap-2">

                              <h2 className="text-lg font-bold text-gray-900">
                                {module.moduleTitle}
                              </h2>

                              {hasQuiz && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-600">
                                  <CheckCircle2
                                    size={13}
                                  />
                                  AI Quiz Ready
                                </span>
                              )}
                            </div>

                            <p className="mt-1 text-sm text-gray-500">
                              {module.description ||
                                "No module description added."}
                            </p>

                            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-500">

                              <span className="inline-flex items-center gap-1.5">
                                <Film size={14} />
                                {moduleLectures.length}{" "}
                                {moduleLectures.length ===
                                1
                                  ? "Lecture"
                                  : "Lectures"}
                              </span>

                              <span className="h-1 w-1 rounded-full bg-gray-300" />

                              <span>
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
                            className="rounded-xl p-2.5 text-gray-400 transition hover:bg-indigo-50 hover:text-indigo-600"
                          >
                            <Edit3 size={18} />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteModule(
                                module
                              )
                            }
                            title="Delete module"
                            className="rounded-xl p-2.5 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 size={18} />
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
                            className="rounded-xl p-2.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                          >
                            {isExpanded ? (
                              <ChevronUp
                                size={19}
                              />
                            ) : (
                              <ChevronDown
                                size={19}
                              />
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* MODULE CONTENT */}

                  {!isEditing && isExpanded && (
                    <div className="border-t border-gray-100 bg-gray-50/70">

                      {/* LECTURES */}

                      <div className="p-5 sm:p-6">

                        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                          <div>
                            <h3 className="text-sm font-semibold text-gray-900">
                              Module Lectures
                            </h3>

                            <p className="mt-1 text-xs text-gray-500">
                              These lectures belong to this
                              module.
                            </p>
                          </div>

                          <span className="w-fit rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-gray-500 shadow-sm">
                            {moduleLectures.length}{" "}
                            lectures
                          </span>
                        </div>

                        {moduleLectures.length ===
                        0 ? (
                          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-6 text-center">

                            <Film
                              size={26}
                              className="mx-auto text-gray-300"
                            />

                            <p className="mt-3 text-sm font-semibold text-gray-700">
                              No lectures assigned
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                              Use the lecture assignment
                              section below.
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

                        <div className="mt-6 rounded-2xl border border-indigo-100 bg-white p-5">

                          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                            <div className="flex items-start gap-3">

                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                <Sparkles
                                  size={21}
                                />
                              </div>

                              <div>
                                <h3 className="text-sm font-bold text-gray-900">
                                  AI Module Quiz
                                </h3>

                                <p className="mt-1 max-w-xl text-xs leading-5 text-gray-500">
                                  Generate a quiz automatically
                                  from the lectures inside this
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
                              className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                                hasQuiz
                                  ? "cursor-default bg-emerald-50 text-emerald-600"
                                  : "bg-indigo-600 text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                              }`}
                            >
                              {generatingQuiz ? (
                                <>
                                  <LoaderCircle
                                    size={17}
                                    className="animate-spin"
                                  />
                                  Generating...
                                </>
                              ) : hasQuiz ? (
                                <>
                                  <CheckCircle2
                                    size={17}
                                  />
                                  Quiz Generated
                                </>
                              ) : (
                                <>
                                  <Sparkles
                                    size={17}
                                  />
                                  Generate AI Quiz
                                </>
                              )}
                            </button>
                          </div>

                          {generatingQuiz && (
                            <div className="mt-4 rounded-xl bg-indigo-50 px-4 py-3 text-xs leading-5 text-indigo-700">
                              Gemini is reading the
                              module lectures and creating
                              questions. This may take a few
                              seconds.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* =================================================
            UNASSIGNED LECTURES
        ================================================= */}

        <div className="mt-8 overflow-hidden rounded-3xl border border-amber-200 bg-white shadow-sm">

          <div className="border-b border-amber-100 bg-amber-50/60 px-5 py-5 sm:px-6">

            <div className="flex items-start gap-3">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                <Film size={19} />
              </div>

              <div>
                <h2 className="text-base font-bold text-gray-900">
                  Unassigned Lectures
                </h2>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  These lectures are not currently inside
                  any module. Assign them below.
                </p>
              </div>

              <span className="ml-auto rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-amber-700 shadow-sm">
                {unassignedLectures.length}
              </span>
            </div>
          </div>

          <div className="p-5 sm:p-6">

            {unassignedLectures.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">

                <CheckCircle2
                  size={32}
                  className="text-emerald-500"
                />

                <h3 className="mt-3 text-sm font-semibold text-gray-900">
                  All lectures are organized
                </h3>

                <p className="mt-1 text-xs text-gray-500">
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
        </div>

        {/* =================================================
            REFRESH
        ================================================= */}

        <div className="mt-6 flex justify-center">

          <button
            type="button"
            onClick={loadData}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-semibold text-gray-600 shadow-sm transition hover:border-indigo-200 hover:text-indigo-600"
          >
            <RefreshCw size={15} />
            Refresh Structure
          </button>
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
    <div className="space-y-4">

      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          Module Title
        </label>

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
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">
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
          rows={3}
          placeholder="Describe what students will learn in this module..."
          className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm leading-6 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
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
    <div className="rounded-2xl border border-gray-200 bg-white p-4">

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">

        <div className="flex min-w-0 flex-1 items-center gap-3">

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-xs font-bold text-gray-500">
            {index + 1}
          </div>

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <Film size={17} />
          </div>

          <div className="min-w-0">
            <h4 className="truncate text-sm font-semibold text-gray-900">
              {lecture.lectureTitle ||
                lecture.title ||
                "Untitled Lecture"}
            </h4>

            <p className="mt-1 text-xs text-gray-400">
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
            className="min-w-[210px] rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs font-medium text-gray-700 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 disabled:opacity-60"
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
              className="animate-spin text-indigo-600"
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   SUMMARY CARD
========================================================= */

function SummaryCard({ icon, title, value }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

      <div className="flex items-center justify-between">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          {icon}
        </div>

        <span className="text-2xl font-bold text-gray-900">
          {value}
        </span>
      </div>

      <p className="mt-4 text-sm font-medium text-gray-500">
        {title}
      </p>
    </div>
  );
}

/* =========================================================
   EMPTY MODULES
========================================================= */

function EmptyModules({ onCreate }) {
  return (
    <div className="rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center shadow-sm">

      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
        <Layers size={30} />
      </div>

      <h2 className="mt-5 text-xl font-bold text-gray-900">
        No modules yet
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
        Start organizing your course by creating your
        first module. You can then assign your existing
        lectures to it.
      </p>

      <button
        type="button"
        onClick={onCreate}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
      >
        <Plus size={18} />
        Create First Module
      </button>
    </div>
  );
}

export default ModuleManagement;
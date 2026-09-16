import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CircleAlert,
  Clock3,
  LoaderCircle,
  RotateCcw,
  Trophy,
  XCircle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../services/api";

const ModuleQuiz = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();

  // =====================================================
  // STATE
  // =====================================================

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [answers, setAnswers] = useState({});

  const [submitting, setSubmitting] = useState(false);

  const [result, setResult] = useState(null);

  // =====================================================
  // FETCH QUIZ
  // =====================================================

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);

        const response = await api.get(
          `/module/${moduleId}/quiz`
        );

        if (response.data?.success) {
          setQuiz(response.data.quiz);
        } else {
          toast.error(
            response.data?.message || "Failed to load quiz"
          );
        }
      } catch (error) {
        console.error("FETCH QUIZ ERROR:", error);

        toast.error(
          error.response?.data?.message ||
            "Failed to load quiz"
        );
      } finally {
        setLoading(false);
      }
    };

    if (moduleId) {
      fetchQuiz();
    }
  }, [moduleId]);

  // =====================================================
  // CURRENT QUESTION
  // =====================================================

  const currentQuestionData =
    quiz?.questions?.[currentQuestion];

  // =====================================================
  // PROGRESS
  // =====================================================

  const progressPercentage = useMemo(() => {
    if (!quiz?.questions?.length) return 0;

    return Math.round(
      ((currentQuestion + 1) /
        quiz.questions.length) *
        100
    );
  }, [currentQuestion, quiz]);

  // =====================================================
  // ANSWER SELECTION
  // =====================================================

  const handleAnswerSelect = (questionId, answer) => {
    setAnswers((previous) => ({
      ...previous,
      [questionId]: answer,
    }));
  };

  // =====================================================
  // NEXT
  // =====================================================

  const handleNext = () => {
    if (!currentQuestionData) return;

    const selectedAnswer =
      answers[currentQuestionData._id];

    if (!selectedAnswer) {
      toast.error("Please select an answer first.");
      return;
    }

    if (
      currentQuestion <
      quiz.questions.length - 1
    ) {
      setCurrentQuestion(
        (previous) => previous + 1
      );
    }
  };

  // =====================================================
  // PREVIOUS
  // =====================================================

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(
        (previous) => previous - 1
      );
    }
  };

  // =====================================================
  // SUBMIT QUIZ
  // =====================================================

  const handleSubmit = async () => {
    if (!quiz?.questions?.length) return;

    const unansweredQuestions =
      quiz.questions.filter(
        (question) =>
          !answers[question._id]
      );

    if (unansweredQuestions.length > 0) {
      toast.error(
        `Please answer all questions. ${unansweredQuestions.length} question${
          unansweredQuestions.length > 1
            ? "s are"
            : " is"
        } unanswered.`
      );

      // Move to first unanswered question
      const firstUnansweredIndex =
        quiz.questions.findIndex(
          (question) =>
            !answers[question._id]
        );

      if (firstUnansweredIndex !== -1) {
        setCurrentQuestion(
          firstUnansweredIndex
        );
      }

      return;
    }

    try {
      setSubmitting(true);

      const formattedAnswers =
        quiz.questions.map((question) => ({
          questionId: question._id,
          selectedAnswer:
            answers[question._id],
        }));

      const response = await api.post(
        `/quiz/${quiz._id}/submit`,
        {
          answers: formattedAnswers,
        }
      );

      if (response.data?.success) {
        setResult(response.data.result);

        toast.success(
          response.data.message ||
            "Quiz submitted successfully!"
        );

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      } else {
        toast.error(
          response.data?.message ||
            "Failed to submit quiz"
        );
      }
    } catch (error) {
      console.error(
        "SUBMIT QUIZ ERROR:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to submit quiz"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =====================================================
  // RETRY QUIZ
  // =====================================================

  const handleRetry = () => {
    setAnswers({});
    setCurrentQuestion(0);
    setResult(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070707] text-white flex items-center justify-center">
        <div className="text-center">
          <LoaderCircle
            size={42}
            className="animate-spin mx-auto mb-4 text-red-500"
          />

          <p className="text-gray-400">
            Loading module quiz...
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // QUIZ NOT FOUND
  // =====================================================

  if (!quiz) {
    return (
      <div className="min-h-screen bg-[#070707] text-white flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <CircleAlert
            size={52}
            className="mx-auto mb-5 text-red-500"
          />

          <h1 className="text-2xl font-bold mb-3">
            Quiz Not Available
          </h1>

          <p className="text-gray-400 mb-6">
            This module does not have a quiz yet.
          </p>

          <button
            onClick={() => navigate(-1)}
            className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-500 transition font-semibold"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // =====================================================
  // RESULT SCREEN
  // =====================================================

  if (result) {
    const passed = result.passed;

    return (
      <div className="min-h-screen bg-[#070707] text-white px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-5xl mx-auto">

          {/* Back */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-8"
          >
            <ArrowLeft size={18} />
            Back to Module
          </button>

          {/* Result Hero */}
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#171717] via-[#0d0d0d] to-[#090909] p-8 sm:p-12 text-center">

            <div className="absolute -top-32 -right-32 w-72 h-72 bg-red-600/10 rounded-full blur-3xl" />

            <div className="absolute -bottom-32 -left-32 w-72 h-72 bg-yellow-500/5 rounded-full blur-3xl" />

            <div className="relative">

              <div
                className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6 border ${
                  passed
                    ? "bg-green-500/10 border-green-500/30"
                    : "bg-red-500/10 border-red-500/30"
                }`}
              >
                {passed ? (
                  <Trophy
                    size={40}
                    className="text-yellow-400"
                  />
                ) : (
                  <XCircle
                    size={40}
                    className="text-red-500"
                  />
                )}
              </div>

              <p className="uppercase tracking-[0.3em] text-xs text-gray-500 mb-3">
                Module Quiz Complete
              </p>

              <h1 className="text-3xl sm:text-4xl font-black mb-3">
                {passed
                  ? "Congratulations! 🎉"
                  : "Keep Learning 💪"}
              </h1>

              <p className="text-gray-400 max-w-xl mx-auto">
                {passed
                  ? "You have successfully passed this module quiz."
                  : "You did not reach the passing score this time. Review the module and try again."}
              </p>

              {/* Score */}
              <div className="mt-10 flex justify-center">
                <div
                  className={`w-40 h-40 rounded-full border-8 flex items-center justify-center ${
                    passed
                      ? "border-green-500/60"
                      : "border-red-500/60"
                  }`}
                >
                  <div>
                    <div className="text-4xl font-black">
                      {result.percentage}%
                    </div>

                    <div className="text-xs text-gray-500 mt-1">
                      Score
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10">

                <ResultStat
                  label="Correct"
                  value={`${result.correctAnswers}`}
                />

                <ResultStat
                  label="Questions"
                  value={`${result.totalQuestions}`}
                />

                <ResultStat
                  label="Passing"
                  value={`${result.passingScore}%`}
                />

                <ResultStat
                  label="Status"
                  value={passed ? "PASSED" : "FAILED"}
                  highlight={passed}
                />

              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row justify-center gap-3 mt-10">

                <button
                  onClick={handleRetry}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition font-semibold"
                >
                  <RotateCcw size={18} />
                  Try Again
                </button>

                <button
                  onClick={() => navigate(-1)}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 transition font-semibold"
                >
                  Continue Learning
                  <ArrowRight size={18} />
                </button>

              </div>
            </div>
          </div>

          {/* Detailed Results */}
          {Array.isArray(result.details) &&
            result.details.length > 0 && (
              <div className="mt-8">

                <h2 className="text-xl font-bold mb-5">
                  Review Your Answers
                </h2>

                <div className="space-y-4">

                  {result.details.map(
                    (detail, index) => (
                      <div
                        key={detail.questionId}
                        className="rounded-2xl border border-white/10 bg-[#111111] p-5 sm:p-6"
                      >
                        <div className="flex items-start gap-4">

                          <div className="mt-1 shrink-0">
                            {detail.isCorrect ? (
                              <CheckCircle2
                                size={22}
                                className="text-green-500"
                              />
                            ) : (
                              <XCircle
                                size={22}
                                className="text-red-500"
                              />
                            )}
                          </div>

                          <div className="min-w-0 flex-1">

                            <p className="text-sm text-gray-500 mb-2">
                              Question {index + 1}
                            </p>

                            <h3 className="font-semibold text-white leading-relaxed">
                              {detail.question}
                            </h3>

                            <div className="mt-4 space-y-2 text-sm">

                              <p>
                                <span className="text-gray-500">
                                  Your answer:
                                </span>{" "}
                                <span
                                  className={
                                    detail.isCorrect
                                      ? "text-green-400"
                                      : "text-red-400"
                                  }
                                >
                                  {detail.selectedAnswer ||
                                    "Not answered"}
                                </span>
                              </p>

                              {!detail.isCorrect && (
                                <p>
                                  <span className="text-gray-500">
                                    Correct answer:
                                  </span>{" "}
                                  <span className="text-green-400">
                                    {detail.correctAnswer}
                                  </span>
                                </p>
                              )}

                            </div>

                            {detail.explanation && (
                              <div className="mt-4 rounded-xl bg-white/[0.03] border border-white/5 p-4">
                                <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                                  Explanation
                                </p>

                                <p className="text-sm text-gray-300 leading-relaxed">
                                  {detail.explanation}
                                </p>
                              </div>
                            )}

                          </div>
                        </div>
                      </div>
                    )
                  )}

                </div>
              </div>
            )}

        </div>
      </div>
    );
  }

  // =====================================================
  // QUIZ SCREEN
  // =====================================================

  return (
    <div className="min-h-screen bg-[#070707] text-white px-4 sm:px-6 lg:px-8 py-8">

      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition w-fit"
          >
            <ArrowLeft size={18} />
            Back to Module
          </button>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock3 size={16} />
            Module Assessment
          </div>

        </div>

        {/* Quiz Header */}
        <div className="mb-8">

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-4">

            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-red-500 mb-2">
                AI Generated Assessment
              </p>

              <h1 className="text-2xl sm:text-3xl font-black">
                {quiz.title}
              </h1>

              {quiz.module?.moduleTitle && (
                <p className="text-gray-500 mt-2">
                  {quiz.module.moduleTitle}
                </p>
              )}
            </div>

            <div className="text-sm text-gray-400">
              Question{" "}
              <span className="text-white font-semibold">
                {currentQuestion + 1}
              </span>{" "}
              / {quiz.questions.length}
            </div>

          </div>

          {/* Progress */}
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-red-600 rounded-full transition-all duration-300"
              style={{
                width: `${progressPercentage}%`,
              }}
            />
          </div>

          <div className="flex justify-between mt-2 text-xs text-gray-600">
            <span>
              {progressPercentage}% completed
            </span>

            <span>
              Pass mark: {quiz.passingScore}%
            </span>
          </div>

        </div>

        {/* Question Card */}
        <div className="rounded-3xl border border-white/10 bg-[#101010] overflow-hidden">

          <div className="p-6 sm:p-8 lg:p-10">

            {/* Question Number */}
            <div className="flex items-center gap-3 mb-6">

              <div className="w-10 h-10 rounded-xl bg-red-600/10 border border-red-500/20 flex items-center justify-center">
                <span className="text-red-500 font-bold">
                  {currentQuestion + 1}
                </span>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-gray-600">
                  Question
                </p>

                <p className="text-sm text-gray-400">
                  Select one answer
                </p>
              </div>

            </div>

            {/* Question */}
            <h2 className="text-xl sm:text-2xl font-bold leading-relaxed mb-8">
              {currentQuestionData.question}
            </h2>

            {/* Options */}
            <div className="space-y-3">

              {currentQuestionData.options.map(
                (option, index) => {
                  const isSelected =
                    answers[
                      currentQuestionData._id
                    ] === option;

                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() =>
                        handleAnswerSelect(
                          currentQuestionData._id,
                          option
                        )
                      }
                      className={`w-full text-left rounded-2xl border p-4 sm:p-5 transition-all duration-200 ${
                        isSelected
                          ? "border-red-500 bg-red-500/10"
                          : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]"
                      }`}
                    >

                      <div className="flex items-center gap-4">

                        <div
                          className={`w-9 h-9 shrink-0 rounded-xl flex items-center justify-center text-sm font-bold ${
                            isSelected
                              ? "bg-red-600 text-white"
                              : "bg-white/5 text-gray-400"
                          }`}
                        >
                          {String.fromCharCode(
                            65 + index
                          )}
                        </div>

                        <span
                          className={`leading-relaxed ${
                            isSelected
                              ? "text-white"
                              : "text-gray-300"
                          }`}
                        >
                          {option}
                        </span>

                        <div className="ml-auto shrink-0">
                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                              isSelected
                                ? "border-red-500"
                                : "border-white/20"
                            }`}
                          >
                            {isSelected && (
                              <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                            )}
                          </div>
                        </div>

                      </div>

                    </button>
                  );
                }
              )}

            </div>

          </div>

          {/* Navigation */}
          <div className="border-t border-white/10 bg-white/[0.02] px-6 sm:px-8 py-5">

            <div className="flex items-center justify-between gap-4">

              <button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className="flex items-center gap-2 px-4 py-3 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 transition disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ArrowLeft size={18} />
                <span className="hidden sm:inline">
                  Previous
                </span>
              </button>

              {currentQuestion ===
              quiz.questions.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex items-center gap-2 px-5 sm:px-7 py-3 rounded-xl bg-red-600 hover:bg-red-500 transition font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <LoaderCircle
                        size={18}
                        className="animate-spin"
                      />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Quiz
                      <CheckCircle2 size={18} />
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-5 sm:px-7 py-3 rounded-xl bg-red-600 hover:bg-red-500 transition font-semibold"
                >
                  Next
                  <ArrowRight size={18} />
                </button>
              )}

            </div>

          </div>
        </div>

        {/* Question Navigator */}
        <div className="mt-8 rounded-2xl border border-white/10 bg-[#101010] p-5">

          <p className="text-xs uppercase tracking-wider text-gray-600 mb-4">
            Questions
          </p>

          <div className="flex flex-wrap gap-2">

            {quiz.questions.map(
              (question, index) => {
                const answered =
                  Boolean(
                    answers[question._id]
                  );

                const active =
                  currentQuestion === index;

                return (
                  <button
                    key={question._id}
                    onClick={() =>
                      setCurrentQuestion(index)
                    }
                    className={`w-10 h-10 rounded-xl text-sm font-semibold transition ${
                      active
                        ? "bg-red-600 text-white"
                        : answered
                        ? "bg-green-500/10 border border-green-500/30 text-green-400"
                        : "bg-white/5 border border-white/10 text-gray-500 hover:text-white"
                    }`}
                  >
                    {index + 1}
                  </button>
                );
              }
            )}

          </div>

        </div>

      </div>
    </div>
  );
};

// =====================================================
// RESULT STAT
// =====================================================

const ResultStat = ({
  label,
  value,
  highlight = false,
}) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">

      <p className="text-xs text-gray-600 uppercase tracking-wider">
        {label}
      </p>

      <p
        className={`text-lg font-bold mt-1 ${
          highlight
            ? "text-green-400"
            : "text-white"
        }`}
      >
        {value}
      </p>

    </div>
  );
};

export default ModuleQuiz;


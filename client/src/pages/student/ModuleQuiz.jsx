import { useEffect, useState } from "react";
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

/* =========================================================
   HELPERS
========================================================= */

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

/* =========================================================
   LOADING SCREEN
========================================================= */

function QuizLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#070707] px-6 text-white">
      <div className="text-center">
        <LoaderCircle
          size={42}
          className="mx-auto mb-4 animate-spin text-red-500"
        />

        <p className="text-gray-400">
          Loading module quiz...
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   QUIZ NOT FOUND
========================================================= */

function QuizNotFound({ onBack }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#070707] px-6 text-white">
      <div className="max-w-md text-center">
        <CircleAlert
          size={52}
          className="mx-auto mb-5 text-red-500"
        />

        <h1 className="mb-3 text-2xl font-bold">
          Quiz Not Available
        </h1>

        <p className="mb-6 text-gray-400">
          This module does not have a quiz yet.
        </p>

        <button
          type="button"
          onClick={onBack}
          className="rounded-xl bg-red-600 px-5 py-3 font-semibold transition hover:bg-red-500"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   RESULT STAT
========================================================= */

function ResultStat({
  label,
  value,
  highlight = false,
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <p className="text-xs uppercase tracking-wider text-gray-600">
        {label}
      </p>

      <p
        className={`mt-1 text-lg font-bold ${
          highlight
            ? "text-green-400"
            : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   RESULT DETAIL
========================================================= */

function ResultDetail({
  detail,
  index,
}) {
  const correct = Boolean(detail?.isCorrect);

  return (
    <div className="rounded-2xl border border-white/10 bg-[#111111] p-5 sm:p-6">
      <div className="flex items-start gap-4">
        <div className="mt-1 shrink-0">
          {correct ? (
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
          <p className="mb-2 text-sm text-gray-500">
            Question {index + 1}
          </p>

          <h3 className="font-semibold leading-relaxed text-white">
            {detail?.question}
          </h3>

          <div className="mt-4 space-y-2 text-sm">
            <p>
              <span className="text-gray-500">
                Your answer:
              </span>{" "}
              <span
                className={
                  correct
                    ? "text-green-400"
                    : "text-red-400"
                }
              >
                {detail?.selectedAnswer ||
                  "Not answered"}
              </span>
            </p>

            {!correct && (
              <p>
                <span className="text-gray-500">
                  Correct answer:
                </span>{" "}
                <span className="text-green-400">
                  {detail?.correctAnswer}
                </span>
              </p>
            )}
          </div>

          {detail?.explanation && (
            <div className="mt-4 rounded-xl border border-white/5 bg-white/[0.03] p-4">
              <p className="mb-1 text-xs uppercase tracking-wider text-gray-500">
                Explanation
              </p>

              <p className="text-sm leading-relaxed text-gray-300">
                {detail.explanation}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   RESULT SCREEN
========================================================= */

function QuizResult({
  result,
  onBack,
  onRetry,
}) {
  const passed = Boolean(result?.passed);

  return (
    <div className="min-h-screen bg-[#070707] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Back */}
        <button
          type="button"
          onClick={onBack}
          className="mb-8 flex items-center gap-2 text-gray-400 transition hover:text-white"
        >
          <ArrowLeft size={18} />
          Back to Module
        </button>

        {/* Result Hero */}
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#171717] via-[#0d0d0d] to-[#090909] p-8 text-center sm:p-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-32 -top-32 h-72 w-72 rounded-full bg-red-600/10 blur-3xl"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-yellow-500/5 blur-3xl"
          />

          <div className="relative">
            {/* Result Icon */}
            <div
              className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border ${
                passed
                  ? "border-green-500/30 bg-green-500/10"
                  : "border-red-500/30 bg-red-500/10"
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

            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-gray-500">
              Module Quiz Complete
            </p>

            <h1 className="mb-3 text-3xl font-black sm:text-4xl">
              {passed
                ? "Congratulations! 🎉"
                : "Keep Learning 💪"}
            </h1>

            <p className="mx-auto max-w-xl text-gray-400">
              {passed
                ? "You have successfully passed this module quiz."
                : "You did not reach the passing score this time. Review the module and try again."}
            </p>

            {/* Score */}
            <div className="mt-10 flex justify-center">
              <div
                className={`flex h-40 w-40 items-center justify-center rounded-full border-8 ${
                  passed
                    ? "border-green-500/60"
                    : "border-red-500/60"
                }`}
              >
                <div>
                  <div className="text-4xl font-black">
                    {result?.percentage}%
                  </div>

                  <div className="mt-1 text-xs text-gray-500">
                    Score
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <ResultStat
                label="Correct"
                value={result?.correctAnswers}
              />

              <ResultStat
                label="Questions"
                value={result?.totalQuestions}
              />

              <ResultStat
                label="Passing"
                value={`${result?.passingScore}%`}
              />

              <ResultStat
                label="Status"
                value={passed ? "PASSED" : "FAILED"}
                highlight={passed}
              />
            </div>

            {/* Actions */}
            <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={onRetry}
                className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-semibold transition hover:bg-white/10"
              >
                <RotateCcw size={18} />
                Try Again
              </button>

              <button
                type="button"
                onClick={onBack}
                className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 font-semibold transition hover:bg-red-500"
              >
                Continue Learning
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </section>

        {/* Detailed Results */}
        {Array.isArray(result?.details) &&
          result.details.length > 0 && (
            <section className="mt-8">
              <h2 className="mb-5 text-xl font-bold">
                Review Your Answers
              </h2>

              <div className="space-y-4">
                {result.details.map(
                  (detail, index) => (
                    <ResultDetail
                      key={
                        detail?.questionId ||
                        `result-${index}`
                      }
                      detail={detail}
                      index={index}
                    />
                  )
                )}
              </div>
            </section>
          )}
      </div>
    </div>
  );
}

/* =========================================================
   QUESTION NAVIGATOR
========================================================= */

function QuestionNavigator({
  questions,
  answers,
  currentQuestion,
  onSelect,
}) {
  return (
    <div className="mt-8 rounded-2xl border border-white/10 bg-[#101010] p-5">
      <p className="mb-4 text-xs uppercase tracking-wider text-gray-600">
        Questions
      </p>

      <div className="flex flex-wrap gap-2">
        {questions.map((question, index) => {
          const answered = Boolean(
            answers[question._id]
          );

          const active =
            currentQuestion === index;

          return (
            <button
              key={question._id}
              type="button"
              onClick={() => onSelect(index)}
              className={`h-10 w-10 rounded-xl text-sm font-semibold transition ${
                active
                  ? "bg-red-600 text-white"
                  : answered
                  ? "border border-green-500/30 bg-green-500/10 text-green-400"
                  : "border border-white/10 bg-white/5 text-gray-500 hover:text-white"
              }`}
            >
              {index + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* =========================================================
   QUESTION CARD
========================================================= */

function QuestionCard({
  question,
  selectedAnswer,
  onSelect,
}) {
  if (!question) return null;

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#101010]">
      <div className="p-6 sm:p-8 lg:p-10">
        {/* Question Number */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-500/20 bg-red-600/10">
            <span className="font-bold text-red-500">
              {question.index + 1}
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
        <h2 className="mb-8 text-xl font-bold leading-relaxed sm:text-2xl">
          {question.question}
        </h2>

        {/* Options */}
        <div className="space-y-3">
          {question.options.map(
            (option, index) => {
              const isSelected =
                selectedAnswer === option;

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() =>
                    onSelect(
                      question._id,
                      option
                    )
                  }
                  className={`w-full rounded-2xl border p-4 text-left transition-all duration-200 sm:p-5 ${
                    isSelected
                      ? "border-red-500 bg-red-500/10"
                      : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${
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
                        className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                          isSelected
                            ? "border-red-500"
                            : "border-white/20"
                        }`}
                      >
                        {isSelected && (
                          <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
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
    </div>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

const ModuleQuiz = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] =
    useState(0);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  /* =======================================================
     FETCH QUIZ
  ======================================================= */

  useEffect(() => {
    if (!moduleId) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchQuiz = async () => {
      try {
        setLoading(true);

        const response = await api.get(
          `/module/${moduleId}/quiz`
        );

        if (cancelled) return;

        if (response.data?.success) {
          setQuiz(response.data.quiz);
        } else {
          toast.error(
            response.data?.message ||
              "Failed to load quiz"
          );
        }
      } catch (error) {
        if (cancelled) return;

        console.error(
          "FETCH QUIZ ERROR:",
          error
        );

        toast.error(
          error.response?.data?.message ||
            "Failed to load quiz"
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchQuiz();

    return () => {
      cancelled = true;
    };
  }, [moduleId]);

  /* =======================================================
     DERIVED DATA
  ======================================================= */

  const questions = quiz?.questions || [];

  const totalQuestions = questions.length;

  const currentQuestionData =
    questions[currentQuestion];

  const selectedAnswer = currentQuestionData
    ? answers[currentQuestionData._id]
    : undefined;

  const progressPercentage =
    totalQuestions > 0
      ? Math.round(
          ((currentQuestion + 1) /
            totalQuestions) *
            100
        )
      : 0;

  /* =======================================================
     ANSWER
  ======================================================= */

  const handleAnswerSelect = (
    questionId,
    answer
  ) => {
    setAnswers((previous) => {
      if (previous[questionId] === answer) {
        return previous;
      }

      return {
        ...previous,
        [questionId]: answer,
      };
    });
  };

  /* =======================================================
     NEXT
  ======================================================= */

  const handleNext = () => {
    if (!currentQuestionData) return;

    if (!answers[currentQuestionData._id]) {
      toast.error(
        "Please select an answer first."
      );
      return;
    }

    if (
      currentQuestion <
      totalQuestions - 1
    ) {
      setCurrentQuestion(
        (previous) => previous + 1
      );

      scrollToTop();
    }
  };

  /* =======================================================
     PREVIOUS
  ======================================================= */

  const handlePrevious = () => {
    if (currentQuestion === 0) return;

    setCurrentQuestion(
      (previous) => previous - 1
    );

    scrollToTop();
  };

  /* =======================================================
     SUBMIT
  ======================================================= */

  const handleSubmit = async () => {
    if (
      !quiz?._id ||
      totalQuestions === 0 ||
      submitting
    ) {
      return;
    }

    const firstUnansweredIndex =
      questions.findIndex(
        (question) =>
          !answers[question._id]
      );

    if (firstUnansweredIndex !== -1) {
      const unansweredCount =
        questions.reduce(
          (count, question) =>
            count +
            (!answers[question._id] ? 1 : 0),
          0
        );

      toast.error(
        `Please answer all questions. ${unansweredCount} question${
          unansweredCount > 1
            ? "s are"
            : " is"
        } unanswered.`
      );

      setCurrentQuestion(
        firstUnansweredIndex
      );

      return;
    }

    try {
      setSubmitting(true);

      const formattedAnswers =
        questions.map((question) => ({
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

        scrollToTop();
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

  /* =======================================================
     RETRY
  ======================================================= */

  const handleRetry = () => {
    setAnswers({});
    setCurrentQuestion(0);
    setResult(null);

    scrollToTop();
  };

  /* =======================================================
     STATES
  ======================================================= */

  if (loading) {
    return <QuizLoading />;
  }

  if (!quiz) {
    return (
      <QuizNotFound
        onBack={() => navigate(-1)}
      />
    );
  }

  if (result) {
    return (
      <QuizResult
        result={result}
        onBack={() => navigate(-1)}
        onRetry={handleRetry}
      />
    );
  }

  /* =======================================================
     QUIZ SCREEN
  ======================================================= */

  return (
    <div className="min-h-screen bg-[#070707] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex w-fit items-center gap-2 text-gray-400 transition hover:text-white"
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
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.25em] text-red-500">
                AI Generated Assessment
              </p>

              <h1 className="text-2xl font-black sm:text-3xl">
                {quiz.title}
              </h1>

              {quiz.module?.moduleTitle && (
                <p className="mt-2 text-gray-500">
                  {quiz.module.moduleTitle}
                </p>
              )}
            </div>

            <div className="text-sm text-gray-400">
              Question{" "}
              <span className="font-semibold text-white">
                {currentQuestion + 1}
              </span>{" "}
              / {totalQuestions}
            </div>
          </div>

          {/* Progress */}
          <div className="h-2 overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full rounded-full bg-red-600 transition-[width] duration-300"
              style={{
                width: `${progressPercentage}%`,
              }}
            />
          </div>

          <div className="mt-2 flex justify-between text-xs text-gray-600">
            <span>
              {progressPercentage}% completed
            </span>

            <span>
              Pass mark: {quiz.passingScore}%
            </span>
          </div>
        </div>

        {/* Question */}
        <QuestionCard
          question={{
            ...currentQuestionData,
            index: currentQuestion,
          }}
          selectedAnswer={selectedAnswer}
          onSelect={handleAnswerSelect}
        />

        {/* Navigation */}
        <div className="border-x border-b border-white/10 bg-white/[0.02] px-6 py-5 sm:px-8">
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={
                currentQuestion === 0 ||
                submitting
              }
              className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-gray-300 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ArrowLeft size={18} />

              <span className="hidden sm:inline">
                Previous
              </span>
            </button>

            {currentQuestion ===
            totalQuestions - 1 ? (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-semibold transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60 sm:px-7"
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
                type="button"
                onClick={handleNext}
                disabled={submitting}
                className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-semibold transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60 sm:px-7"
              >
                Next
                <ArrowRight size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Navigator */}
        <QuestionNavigator
          questions={questions}
          answers={answers}
          currentQuestion={currentQuestion}
          onSelect={setCurrentQuestion}
        />
      </div>
    </div>
  );
};

export default ModuleQuiz;
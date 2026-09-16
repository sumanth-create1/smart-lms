import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bot,
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  FileCode2,
  LoaderCircle,
  Send,
  Sparkles,
  User,
  X,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import toast from "react-hot-toast";

import { askAIMentor } from "../../services/aiService";

// =====================================================
// HELPERS
// =====================================================

const getCourseTitle = (course) =>
  course?.courseTitle ||
  course?.title ||
  course?.name ||
  "Current Course";

const getCourseCategory = (course) =>
  course?.category ||
  course?.courseCategory ||
  "";

const getCourseLevel = (course) =>
  course?.courseLevel ||
  course?.level ||
  course?.difficulty ||
  "";

const getLectureTitle = (lecture) =>
  lecture?.title ||
  lecture?.lectureTitle ||
  lecture?.name ||
  "Current Lecture";

const getLectureContent = (lecture) => {
  if (!lecture) return "";

  const possibleContent = [
    lecture.lectureContent,
    lecture.content,
    lecture.description,
    lecture.notes,
    lecture.body,
  ];

  const validContent = possibleContent.find(
    (value) =>
      typeof value === "string" &&
      value.trim().length > 0
  );

  return validContent?.trim() || "";
};

const getLectureId = (lecture) =>
  lecture?._id ||
  lecture?.id ||
  lecture?.lectureId ||
  "";

const getLectureDuration = (lecture) =>
  lecture?.duration ||
  lecture?.videoDuration ||
  lecture?.durationSeconds ||
  0;

// =====================================================
// CHAT STORAGE
// =====================================================

const MAX_LOCAL_HISTORY = 24;

const getChatStorageKey = (course, lecture) => {
  const courseKey =
    course?._id ||
    course?.id ||
    getCourseTitle(course);

  const lectureKey =
    lecture?._id ||
    lecture?.id ||
    lecture?.lectureId ||
    getLectureTitle(lecture);

  return `smart-lms-ai-mentor-${String(courseKey)}-${String(lectureKey)}`;
};

// =====================================================
// CODE BLOCK
// =====================================================

const CodeBlock = ({
  inline,
  className,
  children,
}) => {
  const [copied, setCopied] = useState(false);

  const language =
    className?.replace("language-", "") || "code";

  const code = String(children).replace(/\n$/, "");

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);

      setCopied(true);
      toast.success("Code copied.");

      setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch (error) {
      console.error("Code copy failed:", error);
      toast.error("Unable to copy code.");
    }
  };

  if (inline) {
    return (
      <code className="rounded-md border border-cyan-400/10 bg-black/40 px-1.5 py-0.5 font-mono text-[12px] text-cyan-300">
        {children}
      </code>
    );
  }

  return (
    <div className="my-4 overflow-hidden rounded-xl border border-white/[0.08] bg-[#07090d]">
      <div className="flex items-center justify-between border-b border-white/[0.07] bg-white/[0.025] px-3 py-2">
        <div className="flex items-center gap-2">
          <FileCode2
            size={13}
            className="text-cyan-400"
          />

          <span className="text-[9px] font-black uppercase tracking-[0.18em] text-zinc-500">
            {language}
          </span>
        </div>

        <button
          type="button"
          onClick={handleCopyCode}
          className="flex items-center gap-1.5 rounded-md border border-white/[0.07] px-2 py-1 text-[9px] font-bold text-zinc-500 transition hover:border-cyan-400/20 hover:text-cyan-300"
        >
          {copied ? (
            <>
              <Check size={11} />
              Copied
            </>
          ) : (
            <>
              <Copy size={11} />
              Copy
            </>
          )}
        </button>
      </div>

      <pre className="overflow-x-auto p-4">
        <code className="font-mono text-[12px] leading-6 text-zinc-300">
          {code}
        </code>
      </pre>
    </div>
  );
};

// =====================================================
// MARKDOWN MESSAGE
// =====================================================

const MarkdownMessage = ({ content }) => {
  return (
    <div className="ai-markdown text-sm leading-7 text-zinc-300">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code: CodeBlock,

          h1: ({ children }) => (
            <h1 className="mb-4 mt-2 text-xl font-black text-zinc-100">
              {children}
            </h1>
          ),

          h2: ({ children }) => (
            <h2 className="mb-3 mt-5 text-lg font-black text-zinc-100">
              {children}
            </h2>
          ),

          h3: ({ children }) => (
            <h3 className="mb-2 mt-5 text-base font-black text-cyan-300">
              {children}
            </h3>
          ),

          p: ({ children }) => (
            <p className="mb-3 last:mb-0">
              {children}
            </p>
          ),

          strong: ({ children }) => (
            <strong className="font-bold text-zinc-100">
              {children}
            </strong>
          ),

          em: ({ children }) => (
            <em className="text-zinc-200">
              {children}
            </em>
          ),

          ul: ({ children }) => (
            <ul className="mb-4 ml-5 list-disc space-y-1.5 marker:text-cyan-400">
              {children}
            </ul>
          ),

          ol: ({ children }) => (
            <ol className="mb-4 ml-5 list-decimal space-y-1.5 marker:text-amber-400">
              {children}
            </ol>
          ),

          li: ({ children }) => (
            <li className="pl-1">
              {children}
            </li>
          ),

          blockquote: ({ children }) => (
            <blockquote className="my-4 border-l-2 border-cyan-400/40 bg-cyan-950/10 px-4 py-2 text-zinc-400">
              {children}
            </blockquote>
          ),

          hr: () => (
            <hr className="my-5 border-white/[0.08]" />
          ),

          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="text-cyan-300 underline decoration-cyan-400/30 underline-offset-4 hover:text-cyan-200"
            >
              {children}
            </a>
          ),

          table: ({ children }) => (
            <div className="my-4 overflow-x-auto rounded-xl border border-white/[0.08]">
              <table className="w-full border-collapse text-xs">
                {children}
              </table>
            </div>
          ),

          th: ({ children }) => (
            <th className="border-b border-white/[0.08] bg-white/[0.025] px-3 py-2 text-left font-bold text-zinc-200">
              {children}
            </th>
          ),

          td: ({ children }) => (
            <td className="border-b border-white/[0.05] px-3 py-2 text-zinc-400">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

// =====================================================
// MAIN COMPONENT
// =====================================================
// Conversation memory is maintained per course + lecture in sessionStorage.

const AIMentor = ({
  course,
  lecture,
  user,
  onClose,
}) => {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [showContext, setShowContext] = useState(false);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // =====================================================
  // CURRENT CONTEXT
  // =====================================================

  const context = useMemo(() => {
    const lectureContent =
      getLectureContent(lecture);

    const result = {
      courseTitle: getCourseTitle(course),
      courseCategory: getCourseCategory(course),
      courseLevel: getCourseLevel(course),
      lectureTitle: getLectureTitle(lecture),
      lectureContent,
      lectureId: getLectureId(lecture),
      lectureDuration: getLectureDuration(lecture),
    };

    // IMPORTANT DEBUG LOG
    console.log(
      "================================="
    );
    console.log("🧠 AI MENTOR CONTEXT");
    console.log(
      "📚 Course:",
      result.courseTitle
    );
    console.log(
      "📖 Lecture:",
      result.lectureTitle
    );
    console.log(
      "🆔 Lecture ID:",
      result.lectureId
    );
    console.log(
      "📦 Full lecture object:",
      lecture
    );
    console.log(
      "📝 Lecture content:",
      result.lectureContent
    );
    console.log(
      "📏 Content length:",
      result.lectureContent.length
    );
    console.log(
      "================================="
    );

    return result;
  }, [course, lecture]);

  const chatStorageKey = useMemo(
    () => getChatStorageKey(course, lecture),
    [course, lecture]
  );

  const hasLectureContent =
    Boolean(context.lectureContent);

  // =====================================================
  // RESET CHAT WHEN LECTURE CHANGES
  // =====================================================

  useEffect(() => {
    setQuestion("");
    setLoading(false);
    setCopiedIndex(null);

    try {
      const saved = sessionStorage.getItem(chatStorageKey);

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          setMessages(parsed.slice(-MAX_LOCAL_HISTORY));
        } else {
          setMessages([]);
        }
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.warn("Unable to restore AI Mentor conversation:", error);
      setMessages([]);
    }

    const timer = setTimeout(() => {
      textareaRef.current?.focus();
    }, 150);

    return () => clearTimeout(timer);
  }, [chatStorageKey, context.lectureId]);

  // =====================================================
  // AUTO SCROLL
  // =====================================================

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  // =====================================================
  // PERSIST CHAT FOR THIS LECTURE
  // =====================================================

  useEffect(() => {
    try {
      if (!chatStorageKey) return;

      if (messages.length === 0) {
        sessionStorage.removeItem(chatStorageKey);
        return;
      }

      sessionStorage.setItem(
        chatStorageKey,
        JSON.stringify(messages.slice(-MAX_LOCAL_HISTORY))
      );
    } catch (error) {
      console.warn("Unable to save AI Mentor conversation:", error);
    }
  }, [messages, chatStorageKey]);

  // =====================================================
  // ESCAPE TO CLOSE
  // =====================================================

  useEffect(() => {
    const handleEscape = (event) => {
      if (
        event.key === "Escape" &&
        !loading
      ) {
        onClose?.();
      }
    };

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [loading, onClose]);

  // =====================================================
  // FOCUS INPUT
  // =====================================================

  useEffect(() => {
    const timer = setTimeout(() => {
      textareaRef.current?.focus();
    }, 150);

    return () => clearTimeout(timer);
  }, []);

  // =====================================================
  // ASK AI
  // =====================================================

  const handleAsk = async (event) => {
    event?.preventDefault();

    const trimmedQuestion =
      question.trim();

    if (!trimmedQuestion) {
      toast.error(
        "Ask your mentor a question first."
      );
      return;
    }

    if (loading) return;

    const userMessage = {
      role: "user",
      content: trimmedQuestion,
    };

    // Capture conversation BEFORE adding
    // the new question.
    const conversationHistory =
      messages
        .filter(
          (message) =>
            !message.error &&
            (message.role === "user" ||
              message.role === "assistant")
        )
        .slice(-12)
        .map((message) => ({
          role: message.role,
          content: message.content,
        }));

    setMessages((previous) => [
      ...previous,
      userMessage,
    ]);

    setQuestion("");
    setLoading(true);

    try {
      const response =
        await askAIMentor({
          question: trimmedQuestion,

          // COURSE CONTEXT
          courseTitle:
            context.courseTitle,

          courseCategory:
            context.courseCategory,

          courseLevel:
            context.courseLevel,

          // LECTURE CONTEXT
          lectureTitle:
            context.lectureTitle,

          lectureContent:
            context.lectureContent,

          // EXTRA CONTEXT
          lectureId:
            context.lectureId,

          lectureDuration:
            context.lectureDuration,

          // USER
          userName:
            user?.name || "",

          // CONVERSATION MEMORY
          conversationHistory,
        });

      if (!response?.success) {
        throw new Error(
          response?.message ||
            "AI Mentor failed to respond."
        );
      }

      const answer =
        response.answer ||
        "I wasn't able to generate an answer.";

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: answer,
        },
      ]);
    } catch (error) {
      console.error(
        "AI Mentor request failed:",
        error
      );

      const status =
        error?.response?.status;

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to contact AI Mentor.";

      // ===============================================
      // QUOTA ERROR
      // ===============================================

      if (status === 429) {
        toast.error(
          "Gemini API quota reached."
        );

        setMessages((previous) => [
          ...previous,
          {
            role: "assistant",
            content:
              "⚠️ **AI Mentor is temporarily unavailable.**\n\nThe Gemini API quota has been reached. Please try again later.",
            error: true,
          },
        ]);

        return;
      }

      // ===============================================
      // NORMAL ERROR
      // ===============================================

      toast.error(message);

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content:
            "I couldn't answer that right now. Please try again in a moment.",
          error: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // SUGGESTION
  // =====================================================

  const handleSuggestion = (text) => {
    setQuestion(text);

    setTimeout(() => {
      textareaRef.current?.focus();
    }, 50);
  };

  // =====================================================
  // COPY ANSWER
  // =====================================================

  const handleCopy = async (
    content,
    index
  ) => {
    try {
      await navigator.clipboard.writeText(
        content
      );

      setCopiedIndex(index);

      toast.success("Answer copied.");

      setTimeout(() => {
        setCopiedIndex(null);
      }, 1800);
    } catch (error) {
      console.error(
        "Copy failed:",
        error
      );

      toast.error(
        "Unable to copy answer."
      );
    }
  };

  // =====================================================
  // CLEAR CHAT
  // =====================================================

  const handleClearChat = () => {
    if (loading) return;

    setMessages([]);
    setQuestion("");

    try {
      sessionStorage.removeItem(chatStorageKey);
    } catch (error) {
      console.warn("Unable to clear AI Mentor conversation:", error);
    }

    setTimeout(() => {
      textareaRef.current?.focus();
    }, 50);
  };

  // =====================================================
  // PREVENT BACKGROUND SCROLL
  // =====================================================

  useEffect(() => {
    const originalOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow =
        originalOverflow;
    };
  }, []);

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-3 backdrop-blur-md sm:p-5"
      onMouseDown={(event) => {
        if (
          event.target ===
            event.currentTarget &&
          !loading
        ) {
          onClose?.();
        }
      }}
    >
      {/* AMBIENT BACKGROUND */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[8%] top-[10%] h-72 w-72 rounded-full bg-cyan-500/10 blur-[120px]" />

        <div className="absolute bottom-[5%] right-[8%] h-80 w-80 rounded-full bg-amber-600/10 blur-[130px]" />

        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-900/10 blur-[150px]" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.7) 1px, transparent 1px)",
            backgroundSize:
              "40px 40px",
          }}
        />
      </div>

      {/* MAIN PANEL */}

      <div
        className="
          relative
          flex
          h-[min(780px,94vh)]
          w-full
          max-w-4xl
          flex-col
          overflow-hidden
          rounded-2xl
          border
          border-amber-500/20
          bg-[#080a0e]
          shadow-2xl
          shadow-black/70
        "
      >
        {/* TOP LINE */}

        <div className="absolute left-0 right-0 top-0 z-20 h-px bg-gradient-to-r from-transparent via-amber-400/70 to-transparent" />

        {/* HEADER */}

        <header className="relative z-10 flex shrink-0 items-center justify-between border-b border-white/[0.08] bg-[#0c0f14]/95 px-4 py-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-950/30 shadow-lg shadow-cyan-950/20">
              <Bot
                size={22}
                className="text-cyan-300"
              />

              <div className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full border border-[#080a0e] bg-amber-400">
                <Sparkles
                  size={8}
                  className="text-[#17120a]"
                />
              </div>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="truncate text-sm font-black tracking-[0.15em] text-zinc-100 sm:text-base">
                  AI MENTOR
                </h2>

                <span className="hidden rounded-full border border-emerald-400/20 bg-emerald-950/30 px-2 py-0.5 text-[8px] font-black tracking-[0.15em] text-emerald-300 sm:inline-flex">
                  ONLINE
                </span>

                {messages.length > 0 && (
                  <span className="hidden rounded-full border border-cyan-400/10 bg-cyan-950/20 px-2 py-0.5 text-[8px] font-black tracking-[0.12em] text-cyan-400 sm:inline-flex">
                    MEMORY {Math.min(messages.length, 12)}
                  </span>
                )}
              </div>

              <p className="mt-0.5 truncate text-[11px] text-zinc-500">
                Your personal learning companion
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {messages.length > 0 && (
              <button
                type="button"
                onClick={handleClearChat}
                disabled={loading}
                className="hidden rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-[10px] font-black tracking-wider text-zinc-500 transition hover:border-amber-400/20 hover:text-amber-300 disabled:cursor-not-allowed disabled:opacity-40 sm:block"
              >
                CLEAR
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              aria-label="Close AI Mentor"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-zinc-400 transition hover:border-red-500/30 hover:bg-red-950/30 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <X size={18} />
            </button>
          </div>
        </header>

        {/* CONTEXT */}

        <div className="relative z-10 shrink-0 border-b border-white/[0.07] bg-[#0a0d12] px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-amber-500/15 bg-amber-950/20 sm:flex">
              <Sparkles
                size={14}
                className="text-amber-400"
              />
            </div>

            <div className="min-w-0 flex-1">
              <div className="mb-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="text-[9px] font-black tracking-[0.2em] text-amber-400">
                  CURRENT LECTURE
                </span>

                {context.courseLevel && (
                  <>
                    <span className="text-zinc-700">
                      •
                    </span>

                    <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-600">
                      {context.courseLevel}
                    </span>
                  </>
                )}
              </div>

              <p className="truncate text-sm font-bold text-zinc-200">
                {context.lectureTitle}
              </p>

              <p className="mt-0.5 truncate text-[11px] text-zinc-600">
                {context.courseTitle}

                {context.courseCategory
                  ? ` • ${context.courseCategory}`
                  : ""}
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setShowContext(
                  (value) => !value
                )
              }
              className={`hidden shrink-0 items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[8px] font-black uppercase tracking-wider transition sm:flex ${
                hasLectureContent
                  ? "border-emerald-400/15 bg-emerald-950/20 text-emerald-400 hover:border-emerald-400/30"
                  : "border-amber-400/15 bg-amber-950/20 text-amber-400 hover:border-amber-400/30"
              }`}
            >
              {hasLectureContent
                ? "Lecture context"
                : "No lecture notes"}

              {showContext ? (
                <ChevronUp size={11} />
              ) : (
                <ChevronDown size={11} />
              )}
            </button>
          </div>

          {showContext && (
            <div className="mt-3 rounded-xl border border-white/[0.07] bg-black/20 p-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-[8px] font-black uppercase tracking-[0.18em] text-zinc-600">
                    Course
                  </p>

                  <p className="mt-1 text-xs text-zinc-300">
                    {context.courseTitle}
                  </p>
                </div>

                <div>
                  <p className="text-[8px] font-black uppercase tracking-[0.18em] text-zinc-600">
                    Lecture
                  </p>

                  <p className="mt-1 text-xs text-zinc-300">
                    {context.lectureTitle}
                  </p>
                </div>
              </div>

              <div className="mt-3 border-t border-white/[0.05] pt-3">
                <p className="text-[8px] font-black uppercase tracking-[0.18em] text-zinc-600">
                  Lecture content
                </p>

                <p className="mt-1 text-[11px] leading-5 text-zinc-500">
                  {hasLectureContent
                    ? `${context.lectureContent.slice(
                        0,
                        280
                      )}${
                        context.lectureContent
                          .length > 280
                          ? "..."
                          : ""
                      }`
                    : "No lecture content is currently available to the AI Mentor."}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* CHAT */}

        <main className="relative flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
            {messages.length === 0 && (
              <div className="flex min-h-[360px] flex-col items-center justify-center text-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 rounded-3xl bg-cyan-400/10 blur-2xl" />

                  <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl border border-cyan-400/20 bg-cyan-950/30 shadow-xl shadow-cyan-950/20">
                    <Bot
                      size={34}
                      strokeWidth={1.5}
                      className="text-cyan-300"
                    />

                    <Sparkles
                      size={15}
                      className="absolute right-3 top-3 text-amber-300"
                    />
                  </div>
                </div>

                <p className="mb-2 text-[9px] font-black tracking-[0.3em] text-cyan-400/70">
                  THE LEARNING MENTOR
                </p>

                <h3 className="text-xl font-black text-zinc-100 sm:text-2xl">
                  What shall we master?
                </h3>

                <p className="mt-3 max-w-lg text-sm leading-6 text-zinc-500">
                  Ask me about{" "}
                  <span className="text-zinc-300">
                    {context.lectureTitle}
                  </span>
                  . I can explain concepts,
                  provide practical examples,
                  review code, remember your recent
                  questions, and guide you step by step.
                </p>

                {!hasLectureContent && (
                  <div className="mt-5 max-w-lg rounded-xl border border-amber-400/15 bg-amber-950/10 px-4 py-3 text-left">
                    <p className="text-[10px] font-bold text-amber-300">
                      Lecture notes unavailable
                    </p>

                    <p className="mt-1 text-[10px] leading-5 text-zinc-600">
                      Your mentor can still answer
                      general questions, but it
                      won't be able to reference
                      instructor-provided lecture
                      material until content is
                      available.
                    </p>
                  </div>
                )}

                <div className="mt-7 grid w-full max-w-xl gap-2 sm:grid-cols-3">
                  {[
                    {
                      title: "Explain simply",
                      text: `Explain ${context.lectureTitle} in simple terms`,
                    },
                    {
                      title: "Practical example",
                      text: `Give me a practical example of ${context.lectureTitle}`,
                    },
                    {
                      title: "Key concepts",
                      text: `What are the most important concepts in ${context.lectureTitle}?`,
                    },
                  ].map((item) => (
                    <button
                      key={item.title}
                      type="button"
                      onClick={() =>
                        handleSuggestion(
                          item.text
                        )
                      }
                      className="group rounded-xl border border-white/[0.08] bg-white/[0.025] p-3 text-left transition hover:-translate-y-0.5 hover:border-cyan-400/25 hover:bg-cyan-950/20"
                    >
                      <div className="mb-1 text-xs font-bold text-zinc-300 transition group-hover:text-cyan-300">
                        {item.title}
                      </div>

                      <div className="line-clamp-2 text-[10px] leading-4 text-zinc-600">
                        {item.text}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-6">
              {messages.map(
                (message, index) => {
                  const isUser =
                    message.role === "user";

                  return (
                    <div
                      key={`${message.role}-${index}`}
                      className={`flex gap-3 ${
                        isUser
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      {!isUser && (
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-cyan-400/20 bg-cyan-950/30">
                          <Bot
                            size={16}
                            className="text-cyan-300"
                          />
                        </div>
                      )}

                      <div
                        className={`group relative max-w-[92%] rounded-2xl px-4 py-3 sm:max-w-[82%] ${
                          isUser
                            ? "rounded-br-md border border-amber-500/20 bg-amber-950/20"
                            : "rounded-bl-md border border-white/[0.08] bg-[#11151b]"
                        } ${
                          message.error
                            ? "border-red-500/20 bg-red-950/10"
                            : ""
                        }`}
                      >
                        <div
                          className={`mb-2 flex items-center gap-1.5 text-[8px] font-black tracking-[0.2em] ${
                            isUser
                              ? "text-amber-400/70"
                              : "text-cyan-400/70"
                          }`}
                        >
                          {isUser ? (
                            <>
                              <User size={10} />
                              YOU
                            </>
                          ) : (
                            <>
                              <Sparkles size={10} />
                              AI MENTOR
                            </>
                          )}
                        </div>

                        {isUser ? (
                          <div className="whitespace-pre-wrap text-sm leading-7 text-amber-50">
                            {message.content}
                          </div>
                        ) : message.error ? (
                          <div className="text-sm leading-7 text-red-300">
                            <MarkdownMessage
                              content={message.content}
                            />
                          </div>
                        ) : (
                          <MarkdownMessage
                            content={message.content}
                          />
                        )}

                        {!isUser &&
                          !message.error && (
                            <button
                              type="button"
                              onClick={() =>
                                handleCopy(
                                  message.content,
                                  index
                                )
                              }
                              className="mt-3 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-zinc-600 transition hover:text-zinc-300"
                            >
                              {copiedIndex ===
                              index ? (
                                <>
                                  <Check size={11} />
                                  Copied
                                </>
                              ) : (
                                <>
                                  <Copy size={11} />
                                  Copy answer
                                </>
                              )}
                            </button>
                          )}
                      </div>

                      {isUser && (
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-amber-400/20 bg-amber-950/30">
                          <User
                            size={16}
                            className="text-amber-300"
                          />
                        </div>
                      )}
                    </div>
                  );
                }
              )}

              {loading && (
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-cyan-400/20 bg-cyan-950/30">
                    <Bot
                      size={16}
                      className="text-cyan-300"
                    />
                  </div>

                  <div className="rounded-2xl rounded-bl-md border border-white/[0.08] bg-[#11151b] px-4 py-3">
                    <div className="flex items-center gap-2">
                      <LoaderCircle
                        size={14}
                        className="animate-spin text-cyan-300"
                      />

                      <span className="text-xs text-zinc-500">
                        Mentor is thinking
                      </span>

                      <span className="flex gap-1">
                        <span className="h-1 w-1 animate-pulse rounded-full bg-cyan-400" />
                        <span className="h-1 w-1 animate-pulse rounded-full bg-cyan-400 [animation-delay:200ms]" />
                        <span className="h-1 w-1 animate-pulse rounded-full bg-cyan-400 [animation-delay:400ms]" />
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div ref={messagesEndRef} />
          </div>
        </main>

        {/* INPUT */}

        <footer className="relative z-10 shrink-0 border-t border-white/[0.08] bg-[#090c11] px-3 py-3 sm:px-5 sm:py-4">
          <form
            onSubmit={handleAsk}
            className="mx-auto max-w-3xl"
          >
            <div className="flex items-end gap-2 rounded-xl border border-white/10 bg-[#10141a] p-2 transition focus-within:border-cyan-400/30 focus-within:shadow-lg focus-within:shadow-cyan-950/10">
              <textarea
                ref={textareaRef}
                value={question}
                onChange={(event) =>
                  setQuestion(
                    event.target.value
                  )
                }
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" &&
                    !event.shiftKey
                  ) {
                    event.preventDefault();

                    if (
                      !loading &&
                      question.trim()
                    ) {
                      handleAsk(event);
                    }
                  }
                }}
                disabled={loading}
                rows={2}
                placeholder="Ask your mentor anything about this lecture..."
                className="min-h-[48px] flex-1 resize-none bg-transparent px-2 py-1 text-sm leading-6 text-zinc-200 outline-none placeholder:text-zinc-600 disabled:cursor-not-allowed disabled:opacity-50"
              />

              <button
                type="submit"
                disabled={
                  loading ||
                  !question.trim()
                }
                aria-label="Send question"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-cyan-400/20 bg-cyan-500/10 text-cyan-300 transition hover:border-cyan-400/40 hover:bg-cyan-500/20 hover:text-cyan-200 disabled:cursor-not-allowed disabled:opacity-30"
              >
                {loading ? (
                  <LoaderCircle
                    size={18}
                    className="animate-spin"
                  />
                ) : (
                  <Send size={18} />
                )}
              </button>
            </div>

            <div className="mt-2 flex items-center justify-between px-1">
              <p className="text-[8px] tracking-wide text-zinc-700">
                ENTER TO SEND • SHIFT + ENTER
                FOR NEW LINE
              </p>

              <p className="hidden text-[8px] text-zinc-700 sm:block">
                RECENT CHAT MEMORY • AI responses may contain mistakes
              </p>
            </div>
          </form>
        </footer>

        <div className="absolute bottom-0 left-0 right-0 z-20 h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent" />
      </div>
    </div>
  );
};

export default AIMentor;
import Quiz from "../models/quiz.model.js";
import QuizAttempt from "../models/quizAttempt.model.js";
import Module from "../models/module.model.js";
import Course from "../models/course.model.js";
import Lecture from "../models/lecture.model.js";
import { generateModuleQuiz } from "../services/ai.service.js";

// =====================================================
// CREATE QUIZ MANUALLY
// POST /api/v1/module/:moduleId/quiz
// =====================================================

export const createQuiz = async (req, res) => {
  try {
    const { moduleId } = req.params;

    const { title, questions, passingScore = 70 } = req.body;

    // -------------------------------------------------
    // Validate module
    // -------------------------------------------------

    const module = await Module.findById(moduleId);

    if (!module) {
      return res.status(404).json({
        success: false,
        message: "Module not found",
      });
    }

    // -------------------------------------------------
    // Validate course
    // -------------------------------------------------

    const course = await Course.findById(module.course);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // -------------------------------------------------
    // Check instructor ownership
    // -------------------------------------------------

    if (
      course.instructor &&
      course.instructor.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to create a quiz for this course",
      });
    }

    // -------------------------------------------------
    // Validate questions
    // -------------------------------------------------

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Quiz must contain at least one question",
      });
    }

    for (const question of questions) {
      if (
        !question.question ||
        !Array.isArray(question.options) ||
        question.options.length !== 4 ||
        !question.correctAnswer
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Each question must contain a question, exactly 4 options, and a correct answer",
        });
      }

      // Make sure correct answer exists in options
      if (!question.options.includes(question.correctAnswer)) {
        return res.status(400).json({
          success: false,
          message: "Correct answer must match one of the provided options",
        });
      }
    }

    // -------------------------------------------------
    // Check if quiz already exists
    // -------------------------------------------------

    const existingQuiz = await Quiz.findOne({
      module: moduleId,
    });

    if (existingQuiz) {
      return res.status(409).json({
        success: false,
        message: "A quiz already exists for this module",
      });
    }

    // -------------------------------------------------
    // Create quiz
    // -------------------------------------------------

    const quiz = await Quiz.create({
      course: module.course,
      module: moduleId,
      title: title || "Module Quiz",
      questions,
      passingScore,
      generatedByAI: false,
      generatedAt: new Date(),
    });

    return res.status(201).json({
      success: true,
      message: "Quiz created successfully",
      quiz,
    });
  } catch (error) {
    console.error("CREATE QUIZ ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create quiz",
      error: error.message,
    });
  }
};

// =====================================================
// GENERATE AI QUIZ
// POST /api/v1/module/:moduleId/quiz/generate
// =====================================================

export const generateAIQuiz = async (req, res) => {
  try {
    const { moduleId } = req.params;

    const { numberOfQuestions = 10 } = req.body;

    // -------------------------------------------------
    // Validate question count
    // -------------------------------------------------

    const questionCount = Number(numberOfQuestions);

    if (
      !Number.isInteger(questionCount) ||
      questionCount < 5 ||
      questionCount > 20
    ) {
      return res.status(400).json({
        success: false,
        message: "Number of questions must be between 5 and 20",
      });
    }

    // -------------------------------------------------
    // Find module
    // -------------------------------------------------

    const module = await Module.findById(moduleId);

    if (!module) {
      return res.status(404).json({
        success: false,
        message: "Module not found",
      });
    }

    // -------------------------------------------------
    // Find course
    // -------------------------------------------------

    const course = await Course.findById(module.course);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // -------------------------------------------------
    // Check instructor ownership
    // -------------------------------------------------

    if (
      course.instructor &&
      course.instructor.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to generate a quiz for this course",
      });
    }

    // -------------------------------------------------
    // Check existing quiz
    // -------------------------------------------------

    const existingQuiz = await Quiz.findOne({
      module: moduleId,
    });

    if (existingQuiz) {
      return res.status(409).json({
        success: false,
        message: "A quiz already exists for this module",
        quizId: existingQuiz._id,
      });
    }

    // -------------------------------------------------
    // Get module lectures
    // -------------------------------------------------

    const lectures = await Lecture.find({
      course: module.course,
      module: moduleId,
    }).sort({ order: 1 });

    if (!lectures || lectures.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "This module does not contain any lectures. Add lectures before generating the quiz.",
      });
    }

    // -------------------------------------------------
    // Prepare lecture content for Gemini
    // -------------------------------------------------

    const lectureData = lectures.map((lecture) => ({
      lectureTitle: lecture.lectureTitle || lecture.title || "Untitled Lecture",

      lectureContent:
        lecture.lectureContent || lecture.content || lecture.description || "",
    }));

    // -------------------------------------------------
    // Generate quiz using Gemini
    // -------------------------------------------------

    console.log("=================================");
    console.log("🤖 GENERATING AI QUIZ");
    console.log("📚 Course:", course.title || course.courseTitle);
    console.log("📖 Module:", module.moduleTitle);
    console.log("📝 Lectures:", lectures.length);
    console.log("❓ Questions:", questionCount);
    console.log("=================================");

    const generatedQuestions = await generateModuleQuiz({
      courseTitle: course.title || course.courseTitle || "Course",

      courseCategory: course.category || "",

      courseLevel: course.level || "",

      moduleTitle: module.moduleTitle || "Module",

      moduleDescription: module.description || "",

      lectures: lectureData,

      numberOfQuestions: questionCount,
    });

    // -------------------------------------------------
    // Validate AI response
    // -------------------------------------------------

    if (
      !Array.isArray(generatedQuestions) ||
      generatedQuestions.length !== questionCount
    ) {
      return res.status(500).json({
        success: false,
        message: "AI generated an invalid quiz. Please try again.",
      });
    }

    // -------------------------------------------------
    // Create quiz in MongoDB
    // -------------------------------------------------

    const quiz = await Quiz.create({
      course: module.course,
      module: moduleId,
      title: `${module.moduleTitle} - AI Quiz`,
      questions: generatedQuestions,
      passingScore: 70,
      generatedByAI: true,
      generatedAt: new Date(),
    });

    // -------------------------------------------------
    // Return safe response
    // -------------------------------------------------

    return res.status(201).json({
      success: true,
      message: "AI quiz generated successfully",
      quiz: {
        _id: quiz._id,
        title: quiz.title,
        module: quiz.module,
        course: quiz.course,
        questionCount: quiz.questions.length,
        passingScore: quiz.passingScore,
        generatedByAI: quiz.generatedByAI,
        generatedAt: quiz.generatedAt,
      },
    });
  } catch (error) {
    console.error("=================================");
    console.error("❌ GENERATE AI QUIZ ERROR");
    console.error("Message:", error.message);
    console.error("=================================");

    // -------------------------------------------------
    // Gemini quota error
    // -------------------------------------------------

    if (
      error.message === "AI_QUOTA_EXCEEDED" ||
      error.code === "AI_QUOTA_EXCEEDED"
    ) {
      return res.status(429).json({
        success: false,
        message: "AI quiz generation limit reached. Please try again later.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to generate AI quiz",
      error: error.message,
    });
  }
};

// =====================================================
// GET QUIZ FOR STUDENT
// GET /api/v1/module/:moduleId/quiz
// =====================================================

export const getModuleQuiz = async (req, res) => {
  try {
    const { moduleId } = req.params;

    const quiz = await Quiz.findOne({
      module: moduleId,
    }).populate("module", "moduleTitle description order");

    // No quiz for this module is NOT a server error.
    // The student simply has no quiz yet.
    if (!quiz) {
      return res.status(200).json({
        success: true,
        quiz: null,
        message: "No quiz available for this module",
      });
    }

    // Never expose correct answers to students
    const safeQuestions = quiz.questions.map((question) => ({
      _id: question._id,
      question: question.question,
      options: question.options,
    }));

    return res.status(200).json({
      success: true,
      quiz: {
        _id: quiz._id,
        title: quiz.title,
        module: quiz.module,
        passingScore: quiz.passingScore,
        totalQuestions: quiz.questions.length,
        questions: safeQuestions,
      },
    });
  } catch (error) {
    console.error("GET MODULE QUIZ ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get quiz",
      error: error.message,
    });
  }
};
// =====================================================
// SUBMIT QUIZ
// POST /api/v1/quiz/:quizId/submit
// =====================================================

export const submitQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;

    const { answers } = req.body;

    // -------------------------------------------------
    // Validate answers
    // -------------------------------------------------

    if (!Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: "Answers must be provided as an array",
      });
    }

    // -------------------------------------------------
    // Find quiz
    // -------------------------------------------------

    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    // -------------------------------------------------
    // Calculate result
    // -------------------------------------------------

    let correctAnswers = 0;

    const resultDetails = [];

    for (const question of quiz.questions) {
      const submittedAnswer = answers.find(
        (answer) => answer.questionId?.toString() === question._id.toString(),
      );

      const selectedAnswer = submittedAnswer?.selectedAnswer || "";

      const isCorrect = selectedAnswer.trim() === question.correctAnswer.trim();

      if (isCorrect) {
        correctAnswers++;
      }

      resultDetails.push({
        questionId: question._id,
        question: question.question,
        selectedAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        explanation: question.explanation || "",
      });
    }

    const totalQuestions = quiz.questions.length;

    const percentage =
      totalQuestions > 0
        ? Math.round((correctAnswers / totalQuestions) * 100)
        : 0;

    const passed = percentage >= quiz.passingScore;

    // -------------------------------------------------
    // Save attempt
    // -------------------------------------------------

    const attempt = await QuizAttempt.create({
      student: req.user._id,
      quiz: quiz._id,
      course: quiz.course,
      module: quiz.module,
      answers: answers.map((answer) => ({
        questionId: answer.questionId,
        selectedAnswer: answer.selectedAnswer || "",
      })),
      score: correctAnswers,
      totalQuestions,
      correctAnswers,
      percentage,
      passed,
      completedAt: new Date(),
    });

    // -------------------------------------------------
    // Response
    // -------------------------------------------------

    return res.status(200).json({
      success: true,

      message: passed
        ? "Quiz passed successfully"
        : "Quiz completed. Try again to improve your score.",

      result: {
        attemptId: attempt._id,
        score: correctAnswers,
        totalQuestions,
        correctAnswers,
        percentage,
        passingScore: quiz.passingScore,
        passed,
        details: resultDetails,
      },
    });
  } catch (error) {
    console.error("SUBMIT QUIZ ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to submit quiz",
      error: error.message,
    });
  }
};

// =====================================================
// GET MY LATEST QUIZ ATTEMPT
// GET /api/v1/quiz/:quizId/my-attempt
// =====================================================

export const getMyQuizAttempt = async (req, res) => {
  try {
    const { quizId } = req.params;

    const attempt = await QuizAttempt.findOne({
      quiz: quizId,
      student: req.user._id,
    }).sort({ createdAt: -1 });

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: "No quiz attempt found",
      });
    }

    return res.status(200).json({
      success: true,
      attempt,
    });
  } catch (error) {
    console.error("GET QUIZ ATTEMPT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get quiz attempt",
      error: error.message,
    });
  }
};

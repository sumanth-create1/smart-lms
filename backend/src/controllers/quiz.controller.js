import Quiz from "../models/quiz.model.js";
import QuizAttempt from "../models/quizAttempt.model.js";
import Module from "../models/module.model.js";
import Course from "../models/course.model.js";
import Lecture from "../models/lecture.model.js";
import { generateModuleQuiz } from "../services/ai.service.js";
import { awardXP } from "../services/achievement.service.js";

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

export const generateAIQuiz = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const { questionCount = 10 } = req.body;

    console.log("=================================");
    console.log("🤖 GENERATING AI QUIZ");
    console.log("📦 Module ID:", moduleId);
    console.log("❓ Questions:", questionCount);
    console.log("=================================");

    // --------------------------------------------------
    // 1. Validate question count
    // --------------------------------------------------
    const parsedQuestionCount = Number(questionCount);

    if (
      !Number.isInteger(parsedQuestionCount) ||
      parsedQuestionCount < 5 ||
      parsedQuestionCount > 20
    ) {
      return res.status(400).json({
        success: false,
        message: "Question count must be between 5 and 20.",
      });
    }

    // --------------------------------------------------
    // 2. Find module
    // --------------------------------------------------
    const module = await Module.findById(moduleId);

    if (!module) {
      return res.status(404).json({
        success: false,
        message: "Module not found.",
      });
    }

    // --------------------------------------------------
    // 3. Find course
    // --------------------------------------------------
    const course = await Course.findById(module.course);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    // --------------------------------------------------
    // 4. Check instructor ownership
    // --------------------------------------------------
    if (
      course.instructor &&
      course.instructor.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to generate a quiz for this course.",
      });
    }

    // --------------------------------------------------
    // 5. Check if quiz already exists
    // --------------------------------------------------
    const existingQuiz = await Quiz.findOne({
      module: moduleId,
    });

    if (existingQuiz) {
      return res.status(400).json({
        success: false,
        message: "A quiz already exists for this module.",
        quizId: existingQuiz._id,
      });
    }

    // --------------------------------------------------
    // 6. Get lectures belonging to this module
    // --------------------------------------------------
    const lectures = await Lecture.find({
      module: moduleId,
    })
      .select(
        "lectureTitle lectureContent videoDuration order"
      )
      .sort({ order: 1 });

    if (!lectures || lectures.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No lectures found for this module.",
      });
    }

    // --------------------------------------------------
    // 7. Prepare lecture data for AI
    // --------------------------------------------------
    const lectureData = lectures.map((lecture) => ({
      title: lecture.lectureTitle || "",
      content: lecture.lectureContent || "",
      duration: lecture.videoDuration || 0,
      order: lecture.order || 0,
    }));

    console.log("=================================");
    console.log("🤖 GENERATING AI QUIZ");
    console.log("📚 Course:", course.courseTitle);
    console.log("📖 Module:", module.moduleTitle);
    console.log("📝 Lectures:", lectureData.length);
    console.log("❓ Questions:", parsedQuestionCount);
    console.log("=================================");

    // --------------------------------------------------
    // 8. Generate quiz using Gemini
    // --------------------------------------------------
    const generatedQuiz = await generateModuleQuiz({
      moduleTitle: module.moduleTitle || "Module",
      moduleDescription: module.description || "",
      lectures: lectureData,
      questionCount: parsedQuestionCount,
      passingScore: 70,
    });

    console.log("=================================");
    console.log("🤖 AI QUIZ RESULT");
    console.log("Title:", generatedQuiz?.title);
    console.log(
      "Questions:",
      generatedQuiz?.questions?.length
    );
    console.log("=================================");

    // --------------------------------------------------
    // 9. Validate AI response
    // --------------------------------------------------
    if (
      !generatedQuiz ||
      !Array.isArray(generatedQuiz.questions) ||
      generatedQuiz.questions.length !== parsedQuestionCount
    ) {
      console.error(
        "❌ Invalid AI quiz response:",
        generatedQuiz
      );

      return res.status(500).json({
        success: false,
        message:
          "AI generated an invalid quiz. Please try again.",
      });
    }

    // --------------------------------------------------
    // 10. Save quiz to MongoDB
    // --------------------------------------------------
    const quiz = await Quiz.create({
      course: module.course,
      module: moduleId,

      title:
        generatedQuiz.title ||
        `${module.moduleTitle} - AI Quiz`,

      description:
        generatedQuiz.description ||
        `AI-generated quiz for ${module.moduleTitle}`,

      questions: generatedQuiz.questions,

      passingScore:
        generatedQuiz.passingScore || 70,

      generatedByAI: true,

      generatedAt: new Date(),
    });

    // --------------------------------------------------
    // 11. Return response
    // --------------------------------------------------
    return res.status(201).json({
      success: true,
      message: "AI quiz generated successfully.",

      quiz: {
        _id: quiz._id,
        course: quiz.course,
        module: quiz.module,
        title: quiz.title,
        description: quiz.description,
        passingScore: quiz.passingScore,
        totalQuestions: quiz.questions.length,
        generatedByAI: quiz.generatedByAI,
        generatedAt: quiz.generatedAt,
      },
    });
  } catch (error) {
    console.error("=================================");
    console.error("❌ AI QUIZ GENERATION ERROR");
    console.error("Message:", error.message);
    console.error("Stack:", error.stack);
    console.error("=================================");

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to generate AI quiz.",
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
        (answer) =>
          answer.questionId?.toString() ===
          question._id.toString()
      );

      const selectedAnswer =
        submittedAnswer?.selectedAnswer || "";

      const isCorrect =
        selectedAnswer.trim() ===
        question.correctAnswer.trim();

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

    // -------------------------------------------------
    // Calculate percentage
    // -------------------------------------------------

    const totalQuestions = quiz.questions.length;

    const percentage =
      totalQuestions > 0
        ? Math.round(
            (correctAnswers / totalQuestions) * 100
          )
        : 0;

    const passed =
      percentage >= quiz.passingScore;

    // -------------------------------------------------
    // Check if student already passed this quiz
    // -------------------------------------------------

    const previousPassedAttempt =
      await QuizAttempt.findOne({
        student: req.user._id,
        quiz: quiz._id,
        passed: true,
      });

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
        selectedAnswer:
          answer.selectedAnswer || "",
      })),

      score: correctAnswers,
      totalQuestions,
      correctAnswers,
      percentage,
      passed,

      completedAt: new Date(),
    });

    // -------------------------------------------------
    // Award XP
    // -------------------------------------------------

    let xpAwarded = 0;
    let xpData = null;

    const QUIZ_XP = 100;

    if (passed && !previousPassedAttempt) {
      xpData = await awardXP(
        req.user._id,
        QUIZ_XP
      );

      xpAwarded = QUIZ_XP;
    }

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

        xpAwarded,

        totalXP:
          xpData?.totalXP ?? null,

        level:
          xpData?.level ?? null,

        details: resultDetails,
      },
    });
  } catch (error) {
    console.error(
      "SUBMIT QUIZ ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to submit quiz",
      error: error.message,
    });
  }
};

// =====================================================
// GET MY QUIZ PASS STATUS
// GET /api/v1/quiz/:quizId/my-attempt
// =====================================================

export const getMyQuizAttempt = async (req, res) => {
  try {
    const { quizId } = req.params;

    // Find the latest PASSED attempt.
    //
    // Important:
    // We intentionally search for passed: true.
    // Otherwise, a later failed attempt could incorrectly
    // make a previously unlocked module appear locked.
    const passedAttempt = await QuizAttempt.findOne({
      quiz: quizId,
      student: req.user._id,
      passed: true,
    }).sort({ createdAt: -1 });

    // Student has never passed this quiz.
    if (!passedAttempt) {
      return res.status(200).json({
        success: true,
        passed: false,
        attempt: null,
      });
    }

    return res.status(200).json({
      success: true,
      passed: true,

      attempt: {
        _id: passedAttempt._id,
        quiz: passedAttempt.quiz,
        module: passedAttempt.module,

        score: passedAttempt.score,
        totalQuestions: passedAttempt.totalQuestions,
        correctAnswers: passedAttempt.correctAnswers,

        percentage: passedAttempt.percentage,
        passed: passedAttempt.passed,

        completedAt: passedAttempt.completedAt,
      },
    });
  } catch (error) {
    console.error(
      "GET QUIZ PASS STATUS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to get quiz pass status",
      error: error.message,
    });
  }
};

import Quiz from "../models/quiz.model.js";
import QuizAttempt from "../models/quizAttempt.model.js";
import Module from "../models/module.model.js";
import Course from "../models/course.model.js";
import Lecture from "../models/lecture.model.js";
import CourseProgress from "../models/courseProgress.model.js";

import { generateModuleQuiz } from "../services/ai.service.js";
import { awardXP } from "../services/achievement.service.js";

// =====================================================
// HELPER: CHECK MODULE ACCESS
// =====================================================
//
// Rules:
//
// Module 1:
//   → Always unlocked
//
// Module 2+:
//   → Previous module lectures must ALL be completed
//   → Previous module quiz must be PASSED
//
// This helper is used by both:
//   1. getModuleQuiz()
//   2. submitQuiz()
//
// This means the backend itself protects the module.
// =====================================================

const checkModuleAccess = async ({
  moduleId,
  studentId,
}) => {
  // -------------------------------------------------
  // Find current module
  // -------------------------------------------------

  const currentModule =
    await Module.findById(moduleId).lean();

  if (!currentModule) {
    return {
      exists: false,
      isUnlocked: false,
      reason: "Module not found.",
    };
  }

  // -------------------------------------------------
  // Get all modules of this course
  // -------------------------------------------------

  const modules =
    await Module.find({
      course: currentModule.course,
    })
      .sort({
        order: 1,
      })
      .lean();

  // -------------------------------------------------
  // Find current module index
  // -------------------------------------------------

  const currentIndex =
    modules.findIndex(
      (module) =>
        String(module._id) ===
        String(moduleId)
    );

  if (currentIndex === -1) {
    return {
      exists: false,
      isUnlocked: false,
      reason:
        "Module not found in this course.",
    };
  }

  // =================================================
  // FIRST MODULE
  // =================================================

  if (currentIndex === 0) {
    return {
      exists: true,

      isUnlocked: true,

      previousModule: null,

      reason: null,
    };
  }

  // =================================================
  // PREVIOUS MODULE
  // =================================================

  const previousModule =
    modules[currentIndex - 1];

  // -------------------------------------------------
  // Get previous module lectures
  // -------------------------------------------------

  const previousLectures =
    await Lecture.find({
      module: previousModule._id,
    })
      .select("_id")
      .lean();

  // -------------------------------------------------
  // Get student's course progress
  // -------------------------------------------------

  const courseProgress =
    await CourseProgress.findOne({
      student: studentId,
      course: currentModule.course,
    }).lean();

  const lectureProgress =
    courseProgress?.lectures || [];

  // -------------------------------------------------
  // Count completed previous lectures
  // -------------------------------------------------

  const completedPreviousLectures =
    previousLectures.filter(
      (lecture) =>
        lectureProgress.some(
          (progress) =>
            String(progress.lecture) ===
              String(lecture._id) &&
            progress.completed === true
        )
    ).length;

  // -------------------------------------------------
  // Check all previous lectures completed
  // -------------------------------------------------

  const previousLecturesCompleted =
    previousLectures.length > 0 &&
    completedPreviousLectures ===
      previousLectures.length;

  // -------------------------------------------------
  // Find previous module quiz
  // -------------------------------------------------

  const previousQuiz =
    await Quiz.findOne({
      module: previousModule._id,
    })
      .select("_id")
      .lean();

  // -------------------------------------------------
  // Check previous quiz passed
  // -------------------------------------------------

  let previousQuizPassed = false;

  if (previousQuiz) {
    const passedAttempt =
      await QuizAttempt.findOne({
        student: studentId,
        quiz: previousQuiz._id,
        passed: true,
      })
        .select("_id")
        .lean();

    previousQuizPassed =
      Boolean(passedAttempt);
  }

  // -------------------------------------------------
  // Final unlock condition
  // -------------------------------------------------

  const isUnlocked =
    previousLecturesCompleted &&
    previousQuizPassed;

  // -------------------------------------------------
  // Determine reason
  // -------------------------------------------------

  let reason = null;

  if (!isUnlocked) {
    if (!previousLecturesCompleted) {
      reason =
        `Complete all lectures in ${previousModule.moduleTitle} first.`;
    } else if (!previousQuizPassed) {
      reason =
        `Pass the quiz for ${previousModule.moduleTitle} first.`;
    }
  }

  // -------------------------------------------------
  // Return access information
  // -------------------------------------------------

  return {
    exists: true,

    isUnlocked,

    reason,

    previousModule: {
      _id: previousModule._id,

      moduleTitle:
        previousModule.moduleTitle,

      order:
        previousModule.order,

      lecturesCompleted:
        previousLecturesCompleted,

      completedLectures:
        completedPreviousLectures,

      totalLectures:
        previousLectures.length,

      quizPassed:
        previousQuizPassed,
    },
  };
};

// =====================================================
// HELPER: CHECK CURRENT MODULE LECTURES
// =====================================================
//
// A student can take the module quiz only after
// completing every lecture in that module.
// =====================================================

const checkAllModuleLecturesCompleted = async ({
  moduleId,
  studentId,
}) => {
  // -------------------------------------------------
  // Find module
  // -------------------------------------------------

  const module =
    await Module.findById(moduleId)
      .select("course")
      .lean();

  if (!module) {
    return {
      exists: false,
      completed: false,
      totalLectures: 0,
      completedLectures: 0,
    };
  }

  // -------------------------------------------------
  // Get module lectures
  // -------------------------------------------------

  const lectures =
    await Lecture.find({
      module: moduleId,
    })
      .select("_id")
      .lean();

  // -------------------------------------------------
  // No lectures
  // -------------------------------------------------

  if (lectures.length === 0) {
    return {
      exists: true,
      completed: false,
      totalLectures: 0,
      completedLectures: 0,
    };
  }

  // -------------------------------------------------
  // Get course progress
  // -------------------------------------------------

  const courseProgress =
    await CourseProgress.findOne({
      student: studentId,
      course: module.course,
    }).lean();

  const lectureProgress =
    courseProgress?.lectures || [];

  // -------------------------------------------------
  // Count completed lectures
  // -------------------------------------------------

  const completedLectures =
    lectures.filter(
      (lecture) =>
        lectureProgress.some(
          (progress) =>
            String(progress.lecture) ===
              String(lecture._id) &&
            progress.completed === true
        )
    ).length;

  // -------------------------------------------------
  // Check completion
  // -------------------------------------------------

  const completed =
    lectures.length > 0 &&
    completedLectures ===
      lectures.length;

  return {
    exists: true,

    completed,

    totalLectures:
      lectures.length,

    completedLectures,
  };
};

// =====================================================
// CREATE QUIZ MANUALLY
// POST /api/v1/module/:moduleId/quiz
// =====================================================

export const createQuiz = async (
  req,
  res
) => {
  try {
    const { moduleId } =
      req.params;

    const {
      title,
      questions,
      passingScore = 70,
    } = req.body;

    // -------------------------------------------------
    // Validate module
    // -------------------------------------------------

    const module =
      await Module.findById(
        moduleId
      );

    if (!module) {
      return res.status(404).json({
        success: false,
        message: "Module not found",
      });
    }

    // -------------------------------------------------
    // Validate course
    // -------------------------------------------------

    const course =
      await Course.findById(
        module.course
      );

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
      course.instructor.toString() !==
        req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to create a quiz for this course",
      });
    }

    // -------------------------------------------------
    // Validate questions
    // -------------------------------------------------

    if (
      !Array.isArray(questions) ||
      questions.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Quiz must contain at least one question",
      });
    }

    for (const question of questions) {
      if (
        !question.question ||
        !Array.isArray(
          question.options
        ) ||
        question.options.length !== 4 ||
        !question.correctAnswer
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Each question must contain a question, exactly 4 options, and a correct answer",
        });
      }

      // -------------------------------------------------
      // Make sure correct answer exists
      // -------------------------------------------------

      if (
        !question.options.includes(
          question.correctAnswer
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Correct answer must match one of the provided options",
        });
      }
    }

    // -------------------------------------------------
    // Check existing quiz
    // -------------------------------------------------

    const existingQuiz =
      await Quiz.findOne({
        module: moduleId,
      });

    if (existingQuiz) {
      return res.status(409).json({
        success: false,
        message:
          "A quiz already exists for this module",
      });
    }

    // -------------------------------------------------
    // Create quiz
    // -------------------------------------------------

    const quiz =
      await Quiz.create({
        course: module.course,

        module: moduleId,

        title:
          title || "Module Quiz",

        questions,

        passingScore,

        generatedByAI: false,

        generatedAt: new Date(),
      });

    return res.status(201).json({
      success: true,

      message:
        "Quiz created successfully",

      quiz,
    });
  } catch (error) {
    console.error(
      "CREATE QUIZ ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to create quiz",
      error: error.message,
    });
  }
};

// =====================================================
// GENERATE AI QUIZ
// POST /api/v1/module/:moduleId/quiz/ai
// =====================================================

export const generateAIQuiz = async (
  req,
  res
) => {
  try {
    const { moduleId } =
      req.params;

    const {
      questionCount = 10,
    } = req.body;

    console.log(
      "================================="
    );

    console.log(
      "🤖 GENERATING AI QUIZ"
    );

    console.log(
      "📦 Module ID:",
      moduleId
    );

    console.log(
      "❓ Questions:",
      questionCount
    );

    console.log(
      "================================="
    );

    // -------------------------------------------------
    // Validate question count
    // -------------------------------------------------

    const parsedQuestionCount =
      Number(questionCount);

    if (
      !Number.isInteger(
        parsedQuestionCount
      ) ||
      parsedQuestionCount < 5 ||
      parsedQuestionCount > 20
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Question count must be between 5 and 20.",
      });
    }

    // -------------------------------------------------
    // Find module
    // -------------------------------------------------

    const module =
      await Module.findById(
        moduleId
      );

    if (!module) {
      return res.status(404).json({
        success: false,
        message:
          "Module not found.",
      });
    }

    // -------------------------------------------------
    // Find course
    // -------------------------------------------------

    const course =
      await Course.findById(
        module.course
      );

    if (!course) {
      return res.status(404).json({
        success: false,
        message:
          "Course not found.",
      });
    }

    // -------------------------------------------------
    // Check instructor ownership
    // -------------------------------------------------

    if (
      course.instructor &&
      course.instructor.toString() !==
        req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to generate a quiz for this course.",
      });
    }

    // -------------------------------------------------
    // Check existing quiz
    // -------------------------------------------------

    const existingQuiz =
      await Quiz.findOne({
        module: moduleId,
      });

    if (existingQuiz) {
      return res.status(400).json({
        success: false,
        message:
          "A quiz already exists for this module.",
        quizId:
          existingQuiz._id,
      });
    }

    // -------------------------------------------------
    // Get module lectures
    // -------------------------------------------------

    const lectures =
      await Lecture.find({
        module: moduleId,
      })
        .select(
          "lectureTitle lectureContent videoDuration order"
        )
        .sort({
          order: 1,
        });

    if (
      !lectures ||
      lectures.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "No lectures found for this module.",
      });
    }

    // -------------------------------------------------
    // Prepare lecture data
    // -------------------------------------------------

    const lectureData =
      lectures.map(
        (lecture) => ({
          title:
            lecture.lectureTitle ||
            "",

          content:
            lecture.lectureContent ||
            "",

          duration:
            lecture.videoDuration ||
            0,

          order:
            lecture.order || 0,
        })
      );

    console.log(
      "================================="
    );

    console.log(
      "🤖 GENERATING AI QUIZ"
    );

    console.log(
      "📚 Course:",
      course.courseTitle
    );

    console.log(
      "📖 Module:",
      module.moduleTitle
    );

    console.log(
      "📝 Lectures:",
      lectureData.length
    );

    console.log(
      "❓ Questions:",
      parsedQuestionCount
    );

    console.log(
      "================================="
    );

    // -------------------------------------------------
    // Generate quiz using Gemini
    // -------------------------------------------------

    const generatedQuiz =
      await generateModuleQuiz({
        moduleTitle:
          module.moduleTitle ||
          "Module",

        moduleDescription:
          module.description ||
          "",

        lectures:
          lectureData,

        questionCount:
          parsedQuestionCount,

        passingScore: 70,
      });

    console.log(
      "================================="
    );

    console.log(
      "🤖 AI QUIZ RESULT"
    );

    console.log(
      "Title:",
      generatedQuiz?.title
    );

    console.log(
      "Questions:",
      generatedQuiz?.questions
        ?.length
    );

    console.log(
      "================================="
    );

    // -------------------------------------------------
    // Validate AI response
    // -------------------------------------------------

    if (
      !generatedQuiz ||
      !Array.isArray(
        generatedQuiz.questions
      ) ||
      generatedQuiz.questions.length !==
        parsedQuestionCount
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

    // -------------------------------------------------
    // Save quiz
    // -------------------------------------------------

    const quiz =
      await Quiz.create({
        course: module.course,

        module: moduleId,

        title:
          generatedQuiz.title ||
          `${module.moduleTitle} - AI Quiz`,

        description:
          generatedQuiz.description ||
          `AI-generated quiz for ${module.moduleTitle}`,

        questions:
          generatedQuiz.questions,

        passingScore:
          generatedQuiz.passingScore ||
          70,

        generatedByAI: true,

        generatedAt:
          new Date(),
      });

    // -------------------------------------------------
    // Response
    // -------------------------------------------------

    return res.status(201).json({
      success: true,

      message:
        "AI quiz generated successfully.",

      quiz: {
        _id: quiz._id,

        course: quiz.course,

        module: quiz.module,

        title: quiz.title,

        description:
          quiz.description,

        passingScore:
          quiz.passingScore,

        totalQuestions:
          quiz.questions.length,

        generatedByAI:
          quiz.generatedByAI,

        generatedAt:
          quiz.generatedAt,
      },
    });
  } catch (error) {
    console.error(
      "================================="
    );

    console.error(
      "❌ AI QUIZ GENERATION ERROR"
    );

    console.error(
      "Message:",
      error.message
    );

    console.error(
      "Stack:",
      error.stack
    );

    console.error(
      "================================="
    );

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

export const getModuleQuiz = async (
  req,
  res
) => {
  try {
    const { moduleId } =
      req.params;

    const studentId =
      req.user._id;

    // -------------------------------------------------
    // Check module access
    // -------------------------------------------------

    const access =
      await checkModuleAccess({
        moduleId,
        studentId,
      });

    if (!access.exists) {
      return res.status(404).json({
        success: false,
        message:
          access.reason ||
          "Module not found.",
      });
    }

    // -------------------------------------------------
    // Block locked modules
    // -------------------------------------------------

    if (!access.isUnlocked) {
      return res.status(403).json({
        success: false,

        message:
          access.reason ||
          "This module is locked.",

        access: {
          isUnlocked: false,

          isLocked: true,

          previousModule:
            access.previousModule,
        },
      });
    }

    // -------------------------------------------------
    // Find quiz
    // -------------------------------------------------

    const quiz =
      await Quiz.findOne({
        module: moduleId,
      }).populate(
        "module",
        "moduleTitle description order"
      );

    // -------------------------------------------------
    // No quiz
    // -------------------------------------------------

    if (!quiz) {
      return res.status(200).json({
        success: true,

        quiz: null,

        message:
          "No quiz available for this module.",
      });
    }

    // -------------------------------------------------
    // Check current module lectures
    // -------------------------------------------------

    const lectureStatus =
      await checkAllModuleLecturesCompleted({
        moduleId,

        studentId,
      });

    // -------------------------------------------------
    // Block quiz until lectures complete
    // -------------------------------------------------

    if (
      !lectureStatus.completed
    ) {
      return res.status(403).json({
        success: false,

        message:
          "Complete all lectures in this module before taking the quiz.",

        quizAvailable: false,

        lectures: {
          completed:
            lectureStatus
              .completedLectures,

          total:
            lectureStatus
              .totalLectures,

          allCompleted:
            false,
        },
      });
    }

    // -------------------------------------------------
    // Never expose correct answers
    // -------------------------------------------------

    const safeQuestions =
      quiz.questions.map(
        (question) => ({
          _id: question._id,

          question:
            question.question,

          options:
            question.options,
        })
      );

    // -------------------------------------------------
    // Response
    // -------------------------------------------------

    return res.status(200).json({
      success: true,

      quizAvailable: true,

      quiz: {
        _id: quiz._id,

        title: quiz.title,

        description:
          quiz.description,

        module:
          quiz.module,

        passingScore:
          quiz.passingScore,

        totalQuestions:
          quiz.questions.length,

        questions:
          safeQuestions,
      },
    });
  } catch (error) {
    console.error(
      "GET MODULE QUIZ ERROR:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to get quiz",

      error:
        error.message,
    });
  }
};

// =====================================================
// SUBMIT QUIZ
// POST /api/v1/quiz/:quizId/submit
// =====================================================

export const submitQuiz = async (
  req,
  res
) => {
  try {
    const { quizId } =
      req.params;

    const { answers } =
      req.body;

    const studentId =
      req.user._id;

    // -------------------------------------------------
    // Validate answers
    // -------------------------------------------------

    if (
      !Array.isArray(answers)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Answers must be provided as an array",
      });
    }

    // -------------------------------------------------
    // Find quiz
    // -------------------------------------------------

    const quiz =
      await Quiz.findById(
        quizId
      );

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message:
          "Quiz not found",
      });
    }

    // =================================================
    // CHECK MODULE ACCESS
    // =================================================

    const access =
      await checkModuleAccess({
        moduleId: quiz.module,
        studentId,
      });

    if (!access.exists) {
      return res.status(404).json({
        success: false,
        message:
          "Module not found.",
      });
    }

    // -------------------------------------------------
    // Block locked module
    // -------------------------------------------------

    if (!access.isUnlocked) {
      return res.status(403).json({
        success: false,

        message:
          access.reason ||
          "This module is locked.",

        access: {
          isUnlocked: false,

          isLocked: true,

          previousModule:
            access.previousModule,
        },
      });
    }

    // =================================================
    // CHECK CURRENT MODULE LECTURES
    // =================================================

    const lectureStatus =
      await checkAllModuleLecturesCompleted({
        moduleId: quiz.module,
        studentId,
      });

    if (
      !lectureStatus.completed
    ) {
      return res.status(403).json({
        success: false,

        message:
          "Complete all lectures in this module before taking the quiz.",

        lectures: {
          completed:
            lectureStatus
              .completedLectures,

          total:
            lectureStatus
              .totalLectures,

          allCompleted:
            false,
        },
      });
    }

    // =================================================
    // CALCULATE RESULT
    // =================================================

    let correctAnswers = 0;

    const resultDetails = [];

    for (
      const question of
        quiz.questions
    ) {
      const submittedAnswer =
        answers.find(
          (answer) =>
            answer.questionId
              ?.toString() ===
            question._id.toString()
        );

      const selectedAnswer =
        submittedAnswer
          ?.selectedAnswer ||
        "";

      const isCorrect =
        selectedAnswer.trim() ===
        question.correctAnswer.trim();

      if (isCorrect) {
        correctAnswers++;
      }

      resultDetails.push({
        questionId:
          question._id,

        question:
          question.question,

        selectedAnswer,

        correctAnswer:
          question.correctAnswer,

        isCorrect,

        explanation:
          question.explanation ||
          "",
      });
    }

    // =================================================
    // CALCULATE PERCENTAGE
    // =================================================

    const totalQuestions =
      quiz.questions.length;

    const percentage =
      totalQuestions > 0
        ? Math.round(
            (correctAnswers /
              totalQuestions) *
              100
          )
        : 0;

    const passed =
      percentage >=
      quiz.passingScore;

    // =================================================
    // CHECK PREVIOUS PASSED ATTEMPT
    // =================================================
    //
    // Important:
    // If the student passed once, a later failed
    // attempt must NOT remove the passed state.
    //
    // =================================================

    const previousPassedAttempt =
      await QuizAttempt.findOne({
        student: studentId,

        quiz: quiz._id,

        passed: true,
      }).lean();

    // =================================================
    // SAVE ATTEMPT
    // =================================================

    const attempt =
      await QuizAttempt.create({
        student: studentId,

        quiz: quiz._id,

        course: quiz.course,

        module: quiz.module,

        answers:
          answers.map(
            (answer) => ({
              questionId:
                answer.questionId,

              selectedAnswer:
                answer.selectedAnswer ||
                "",
            })
          ),

        score:
          correctAnswers,

        totalQuestions,

        correctAnswers,

        percentage,

        passed,

        completedAt:
          new Date(),
      });

    // =================================================
    // AWARD XP
    // =================================================

    let xpAwarded = 0;

    let xpData = null;

    const QUIZ_XP = 100;

    // Award XP only on FIRST successful pass
    if (
      passed &&
      !previousPassedAttempt
    ) {
      xpData =
        await awardXP(
          studentId,
          QUIZ_XP
        );

      xpAwarded =
        QUIZ_XP;
    }

    // =================================================
    // RESPONSE
    // =================================================

    return res.status(200).json({
      success: true,

      message: passed
        ? "Quiz passed successfully"
        : "Quiz completed. Try again to improve your score.",

      result: {
        attemptId:
          attempt._id,

        score:
          correctAnswers,

        totalQuestions,

        correctAnswers,

        percentage,

        passingScore:
          quiz.passingScore,

        passed,

        xpAwarded,

        totalXP:
          xpData?.totalXP ??
          null,

        level:
          xpData?.level ??
          null,

        details:
          resultDetails,
      },
    });
  } catch (error) {
    console.error(
      "SUBMIT QUIZ ERROR:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to submit quiz",

      error:
        error.message,
    });
  }
};

// =====================================================
// GET MY QUIZ PASS STATUS
// GET /api/v1/quiz/:quizId/my-attempt
// =====================================================

export const getMyQuizAttempt = async (
  req,
  res
) => {
  try {
    const { quizId } =
      req.params;

    const studentId =
      req.user._id;

    // -------------------------------------------------
    // Find latest attempt
    // -------------------------------------------------

    const latestAttempt =
      await QuizAttempt.findOne({
        quiz: quizId,

        student: studentId,
      })
        .sort({
          createdAt: -1,
        })
        .lean();

    // -------------------------------------------------
    // No attempts
    // -------------------------------------------------

    if (!latestAttempt) {
      return res.status(200).json({
        success: true,

        hasAttempted: false,

        passed: false,

        attempt: null,
      });
    }

    // -------------------------------------------------
    // Find any passed attempt
    // -------------------------------------------------
    //
    // We search separately for a passed attempt because
    // a student can have:
    //
    // Attempt 1 → PASS
    // Attempt 2 → FAIL
    //
    // The module must remain passed.
    //
    // -------------------------------------------------

    const passedAttempt =
      await QuizAttempt.findOne({
        quiz: quizId,

        student: studentId,

        passed: true,
      })
        .sort({
          createdAt: -1,
        })
        .lean();

    // -------------------------------------------------
    // No passed attempt
    // -------------------------------------------------

    if (!passedAttempt) {
      return res.status(200).json({
        success: true,

        hasAttempted: true,

        passed: false,

        attempt: {
          _id:
            latestAttempt._id,

          quiz:
            latestAttempt.quiz,

          module:
            latestAttempt.module,

          score:
            latestAttempt.score,

          totalQuestions:
            latestAttempt.totalQuestions,

          correctAnswers:
            latestAttempt.correctAnswers,

          percentage:
            latestAttempt.percentage,

          passed:
            latestAttempt.passed,

          completedAt:
            latestAttempt.completedAt,
        },
      });
    }

    // -------------------------------------------------
    // Student has passed
    // -------------------------------------------------

    return res.status(200).json({
      success: true,

      hasAttempted: true,

      passed: true,

      attempt: {
        _id:
          passedAttempt._id,

        quiz:
          passedAttempt.quiz,

        module:
          passedAttempt.module,

        score:
          passedAttempt.score,

        totalQuestions:
          passedAttempt.totalQuestions,

        correctAnswers:
          passedAttempt.correctAnswers,

        percentage:
          passedAttempt.percentage,

        passed:
          passedAttempt.passed,

        completedAt:
          passedAttempt.completedAt,
      },
    });
  } catch (error) {
    console.error(
      "GET QUIZ PASS STATUS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to get quiz pass status",

      error:
        error.message,
    });
  }
};
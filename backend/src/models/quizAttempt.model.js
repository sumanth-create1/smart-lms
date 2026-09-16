import mongoose from "mongoose";

// =====================================================
// QUIZ ATTEMPT SCHEMA
// =====================================================

const quizAttemptSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
      required: true,
    },

    answers: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },

        selectedAnswer: {
          type: String,
          default: "",
        },
      },
    ],

    score: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalQuestions: {
      type: Number,
      required: true,
    },

    correctAnswers: {
      type: Number,
      default: 0,
      min: 0,
    },

    percentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    passed: {
      type: Boolean,
      default: false,
    },

    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const QuizAttempt = mongoose.model(
  "QuizAttempt",
  quizAttemptSchema
);

export default QuizAttempt;


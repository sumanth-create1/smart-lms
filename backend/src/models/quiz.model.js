import mongoose from "mongoose";

// =====================================================
// QUIZ QUESTION SCHEMA
// =====================================================

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },

    options: {
      type: [String],
      required: true,
      validate: {
        validator: (value) => value.length === 4,
        message: "Each question must have exactly 4 options.",
      },
    },

    correctAnswer: {
      type: String,
      required: true,
      trim: true,
    },

    explanation: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    _id: true,
  }
);

// =====================================================
// QUIZ SCHEMA
// =====================================================

const quizSchema = new mongoose.Schema(
  {
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

    title: {
      type: String,
      default: "Module Quiz",
      trim: true,
    },

    questions: {
      type: [questionSchema],
      required: true,
      validate: {
        validator: (value) => value.length > 0,
        message: "Quiz must contain at least one question.",
      },
    },

    passingScore: {
      type: Number,
      default: 70,
      min: 0,
      max: 100,
    },

    generatedByAI: {
      type: Boolean,
      default: true,
    },

    generatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Quiz = mongoose.model("Quiz", quizSchema);

export default Quiz;


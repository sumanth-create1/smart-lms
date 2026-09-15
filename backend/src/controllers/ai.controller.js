import { askAIMentor } from "../services/ai.service.js";

export const mentorChat = async (req, res) => {
  try {
    const {
      question,
      courseTitle,
      courseCategory,
      courseLevel,
      lectureTitle,
      lectureContent,
    } = req.body;

    // ============================================
    // VALIDATE QUESTION
    // ============================================

    if (!question?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please enter a question.",
      });
    }

    // ============================================
    // ASK AI MENTOR
    // ============================================

    const answer = await askAIMentor({
      question,
      courseTitle,
      courseCategory,
      courseLevel,
      lectureTitle,
      lectureContent,
    });

    // ============================================
    // SUCCESS
    // ============================================

    return res.status(200).json({
      success: true,
      answer,
    });
  } catch (error) {
    // ============================================
    // ERROR LOGGING
    // ============================================

    console.error("=================================");
    console.error("❌ AI MENTOR ERROR");
    console.error("Message:", error.message);
    console.error("Status:", error.status);
    console.error("Code:", error.code);
    console.error("Name:", error.name);
    console.error("=================================");

    // ============================================
    // GEMINI QUOTA / RATE LIMIT ERROR
    // ============================================

    if (
      error.status === 429 ||
      error.statusCode === 429 ||
      error.code === "too_many_requests" ||
      error.code === "quota_exceeded"
    ) {
      return res.status(429).json({
        success: false,
        message:
          "AI Mentor is temporarily unavailable because the Gemini API quota has been reached. Please try again later.",
      });
    }

    // ============================================
    // OTHER AI ERRORS
    // ============================================

    return res.status(500).json({
      success: false,
      message: "Unable to get response from AI Mentor.",
    });
  }
};
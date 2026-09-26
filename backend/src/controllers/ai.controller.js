import {
  askAIMentor,
  generateCourseSuggestions,
} from "../services/ai.service.js";

/* =========================================================
   AI MENTOR
========================================================= */

export const mentorChat = async (req, res) => {
  try {
    const {
      question,
      courseTitle,
      category,
      level,
      lectureTitle,
      lectureContent,
      history = [],
    } = req.body;

    if (!question?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Question is required.",
      });
    }

    const answer = await askAIMentor({
      question,
      courseTitle,
      category,
      level,
      lectureTitle,
      lectureContent,
      history,
    });

    return res.status(200).json({
      success: true,
      answer,
    });
  } catch (error) {
    console.error("AI Mentor Error:", error);

    if (error?.code === "AI_QUOTA_EXCEEDED") {
      return res.status(429).json({
        success: false,
        code: "AI_QUOTA_EXCEEDED",
        message:
          "AI usage limit has been reached. Please try again later.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "AI Mentor failed.",
    });
  }
};


/* =========================================================
   COURSE AI ARCHITECT
========================================================= */

export const courseAISuggestions = async (req, res) => {
  try {
    const {
      action,
      title,
      subtitle,
      description,
      category,
      level,
      price,
    } = req.body;

    console.log("=================================");
    console.log("COURSE AI REQUEST");
    console.log("action:", action);
    console.log("title:", title);
    console.log("subtitle:", subtitle);
    console.log("description:", description);
    console.log("category:", category);
    console.log("level:", level);
    console.log("price:", price);
    console.log("=================================");

    if (!action?.trim()) {
      return res.status(400).json({
        success: false,
        message: "AI action is required.",
      });
    }

    const result = await generateCourseSuggestions({
      courseTitle: title,
      subTitle: subtitle,
      description,
      category,
      courseLevel: level,
      coursePrice: price,
      action,
    });

    console.log("COURSE AI RESULT:", result);

    return res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("=================================");
    console.error("COURSE AI ERROR");
    console.error("message:", error?.message);
    console.error("name:", error?.name);
    console.error("code:", error?.code);
    console.error("stack:", error?.stack);
    console.error("=================================");

    if (error?.code === "AI_QUOTA_EXCEEDED") {
      return res.status(429).json({
        success: false,
        code: "AI_QUOTA_EXCEEDED",
        message:
          "AI usage limit has been reached. Please try again later.",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        error?.message || "Course AI generation failed.",
    });
  }
};
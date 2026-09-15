import api from "./api";

export const askAIMentor = async ({
  question,
  courseTitle,
  courseCategory,
  courseLevel,
  lectureTitle,
  lectureContent,
}) => {
  try {
    const response = await api.post("/ai/mentor", {
      question,
      courseTitle,
      courseCategory,
      courseLevel,
      lectureTitle,
      lectureContent,
    });

    return response.data;
  } catch (error) {
    console.error("AI Mentor API Error:", error);
    throw error;
  }
};
import Achievement from "../models/achievement.model.js";

const achievements = [
  {
    key: "FIRST_LECTURE",
    title: "First Step",
    description: "Complete your first lecture.",
    icon: "🎯",
    category: "LEARNING",
    requirement: "LECTURES_COMPLETED",
    requirementValue: 1,
  },

  {
    key: "FIRST_COURSE",
    title: "Course Starter",
    description: "Enroll in your first course.",
    icon: "📚",
    category: "COURSE",
    requirement: "COURSES_ENROLLED",
    requirementValue: 1,
  },

  {
    key: "FIVE_LECTURES",
    title: "Fast Learner",
    description: "Complete 5 lectures.",
    icon: "🚀",
    category: "LEARNING",
    requirement: "LECTURES_COMPLETED",
    requirementValue: 5,
  },

  {
    key: "TWENTY_FIVE_LECTURES",
    title: "Knowledge Seeker",
    description: "Complete 25 lectures.",
    icon: "📖",
    category: "LEARNING",
    requirement: "LECTURES_COMPLETED",
    requirementValue: 25,
  },

  {
    key: "THREE_DAY_STREAK",
    title: "Getting Consistent",
    description: "Maintain a 3-day study streak.",
    icon: "🔥",
    category: "STREAK",
    requirement: "STREAK",
    requirementValue: 3,
  },

  {
    key: "SEVEN_DAY_STREAK",
    title: "Dedicated Learner",
    description: "Maintain a 7-day study streak.",
    icon: "🔥",
    category: "STREAK",
    requirement: "STREAK",
    requirementValue: 7,
  },

  {
    key: "TEN_HOURS",
    title: "Study Master",
    description: "Study for 10 hours.",
    icon: "⏱️",
    category: "TIME",
    requirement: "LEARNING_HOURS",
    requirementValue: 10,
  },

  {
    key: "FIFTY_HOURS",
    title: "Learning Machine",
    description: "Study for 50 hours.",
    icon: "⚡",
    category: "TIME",
    requirement: "LEARNING_HOURS",
    requirementValue: 50,
  },

  {
    key: "COURSE_COMPLETED",
    title: "Course Graduate",
    description: "Complete your first course.",
    icon: "🎓",
    category: "COURSE",
    requirement: "COURSES_COMPLETED",
    requirementValue: 1,
  },

  {
    key: "PERFECT_COURSE",
    title: "Perfectionist",
    description: "Complete a course with 100% progress.",
    icon: "💯",
    category: "COURSE",
    requirement: "PERFECT_COURSE",
    requirementValue: 1,
  },
];

export const seedAchievements = async () => {
  for (const achievement of achievements) {
    await Achievement.findOneAndUpdate(
      { key: achievement.key },
      achievement,
      {
        upsert: true,
        new: true,
      }
    );
  }

  console.log("Achievements seeded successfully");
};
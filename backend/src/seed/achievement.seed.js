import mongoose from "mongoose";
import dotenv from "dotenv";

import Achievement from "../models/achievement.model.js";

dotenv.config();

const achievements = [
  // =====================================================
  // 📚 LEARNING ACHIEVEMENTS
  // =====================================================

  {
    key: "FIRST_LECTURE",
    title: "First Steps",
    description: "Complete your first lecture.",
    icon: "🎯",
    category: "LEARNING",
    requirement: "LECTURES_COMPLETED",
    requirementValue: 1,
    isActive: true,
  },

  {
    key: "FIVE_LECTURES",
    title: "Getting Started",
    description: "Complete 5 lectures.",
    icon: "📚",
    category: "LEARNING",
    requirement: "LECTURES_COMPLETED",
    requirementValue: 5,
    isActive: true,
  },

  {
    key: "TEN_LECTURES",
    title: "Knowledge Builder",
    description: "Complete 10 lectures.",
    icon: "🧠",
    category: "LEARNING",
    requirement: "LECTURES_COMPLETED",
    requirementValue: 10,
    isActive: true,
  },

  {
    key: "TWENTY_FIVE_LECTURES",
    title: "Knowledge Seeker",
    description: "Complete 25 lectures.",
    icon: "🔥",
    category: "LEARNING",
    requirement: "LECTURES_COMPLETED",
    requirementValue: 25,
    isActive: true,
  },

  {
    key: "FIFTY_LECTURES",
    title: "Learning Beast",
    description: "Complete 50 lectures.",
    icon: "⚡",
    category: "LEARNING",
    requirement: "LECTURES_COMPLETED",
    requirementValue: 50,
    isActive: true,
  },

  {
    key: "HUNDRED_LECTURES",
    title: "Lecture Legend",
    description: "Complete 100 lectures.",
    icon: "👑",
    category: "LEARNING",
    requirement: "LECTURES_COMPLETED",
    requirementValue: 100,
    isActive: true,
  },

  // =====================================================
  // 🎓 COURSE ACHIEVEMENTS
  // =====================================================

  {
    key: "FIRST_COURSE",
    title: "Course Explorer",
    description: "Enroll in your first course.",
    icon: "🚀",
    category: "COURSE",
    requirement: "COURSES_ENROLLED",
    requirementValue: 1,
    isActive: true,
  },

  {
    key: "THREE_COURSES",
    title: "Course Collector",
    description: "Enroll in 3 courses.",
    icon: "📦",
    category: "COURSE",
    requirement: "COURSES_ENROLLED",
    requirementValue: 3,
    isActive: true,
  },

  {
    key: "FIVE_COURSES",
    title: "Learning Explorer",
    description: "Enroll in 5 courses.",
    icon: "🌎",
    category: "COURSE",
    requirement: "COURSES_ENROLLED",
    requirementValue: 5,
    isActive: true,
  },

  {
    key: "FIRST_COURSE_COMPLETED",
    title: "Course Graduate",
    description: "Complete your first course.",
    icon: "🎓",
    category: "COURSE",
    requirement: "COURSES_COMPLETED",
    requirementValue: 1,
    isActive: true,
  },

  {
    key: "THREE_COURSES_COMPLETED",
    title: "Triple Graduate",
    description: "Complete 3 courses.",
    icon: "🏅",
    category: "COURSE",
    requirement: "COURSES_COMPLETED",
    requirementValue: 3,
    isActive: true,
  },

  {
    key: "FIVE_COURSES_COMPLETED",
    title: "Master Learner",
    description: "Complete 5 courses.",
    icon: "🏆",
    category: "COURSE",
    requirement: "COURSES_COMPLETED",
    requirementValue: 5,
    isActive: true,
  },

  // =====================================================
  // 🔥 STREAK ACHIEVEMENTS
  // =====================================================

  {
    key: "THREE_DAY_STREAK",
    title: "On Fire",
    description: "Maintain a 3-day learning streak.",
    icon: "🔥",
    category: "STREAK",
    requirement: "STREAK",
    requirementValue: 3,
    isActive: true,
  },

  {
    key: "SEVEN_DAY_STREAK",
    title: "Consistency Champion",
    description: "Maintain a 7-day learning streak.",
    icon: "⚡",
    category: "STREAK",
    requirement: "STREAK",
    requirementValue: 7,
    isActive: true,
  },

  {
    key: "FOURTEEN_DAY_STREAK",
    title: "Unstoppable",
    description: "Maintain a 14-day learning streak.",
    icon: "💪",
    category: "STREAK",
    requirement: "STREAK",
    requirementValue: 14,
    isActive: true,
  },

  {
    key: "THIRTY_DAY_STREAK",
    title: "Legendary Streak",
    description: "Maintain a 30-day learning streak.",
    icon: "👑",
    category: "STREAK",
    requirement: "STREAK",
    requirementValue: 30,
    isActive: true,
  },

  // =====================================================
  // ⏱️ TIME ACHIEVEMENTS
  // =====================================================

  {
    key: "TEN_HOURS",
    title: "Dedicated Learner",
    description: "Spend 10 hours learning.",
    icon: "⏱️",
    category: "TIME",
    requirement: "LEARNING_HOURS",
    requirementValue: 10,
    isActive: true,
  },

  {
    key: "TWENTY_FIVE_HOURS",
    title: "Focused Learner",
    description: "Spend 25 hours learning.",
    icon: "🎯",
    category: "TIME",
    requirement: "LEARNING_HOURS",
    requirementValue: 25,
    isActive: true,
  },

  {
    key: "FIFTY_HOURS",
    title: "Learning Machine",
    description: "Spend 50 hours learning.",
    icon: "🤖",
    category: "TIME",
    requirement: "LEARNING_HOURS",
    requirementValue: 50,
    isActive: true,
  },

  {
    key: "HUNDRED_HOURS",
    title: "Learning Legend",
    description: "Spend 100 hours learning.",
    icon: "🧙",
    category: "TIME",
    requirement: "LEARNING_HOURS",
    requirementValue: 100,
    isActive: true,
  },
];

const seedAchievements = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    console.log("MongoDB connected.");

    for (const achievement of achievements) {
      await Achievement.updateOne(
        { key: achievement.key },
        { $set: achievement },
        { upsert: true }
      );
    }

    console.log(
      `✅ ${achievements.length} achievements seeded successfully.`
    );

    const allAchievements = await Achievement.find({
      isActive: true,
    }).lean();

    console.log("\n🏆 ACTIVE ACHIEVEMENTS:");

    allAchievements.forEach((achievement) => {
      console.log(
        `${achievement.icon} ${achievement.key} → ${achievement.requirement} >= ${achievement.requirementValue}`
      );
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Achievement seed failed:", error);
    process.exit(1);
  }
};

seedAchievements();
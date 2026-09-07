// src/services/achievementService.js

import api from "./api";

export const getAllAchievements = async () => {
  const response = await api.get("/achievements/all");

  return response.data;
};

export const getStudentAchievements = async () => {
  const response = await api.get("/achievements");

  return response.data;
};
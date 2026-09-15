import api from "./api";

// =====================================================
// PROFILE SERVICE
// =====================================================

// Get current profile
export const getProfile = async () => {
  const response = await api.get("/auth/me");

  return response.data;
};

// Update profile
export const updateProfile = async (profileData) => {
  const response = await api.put(
    "/auth/profile",
    profileData
  );

  return response.data;
};

// Change password
export const changePassword = async (passwordData) => {
  const response = await api.patch(
    "/auth/change-password",
    passwordData
  );

  return response.data;
};

// Change email
export const changeEmail = async (emailData) => {
  const response = await api.patch(
    "/auth/change-email",
    emailData
  );

  return response.data;
};
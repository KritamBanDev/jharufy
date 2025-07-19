import { axiosInstance } from "./axios";

export const signup = async (signupData) => {
  if (import.meta.env.DEV) {
    console.log("🔗 API SIGNUP REQUEST:", signupData);
  }
  const response = await axiosInstance.post("/auth/signup", signupData);
  if (import.meta.env.DEV) {
    console.log("📨 API SIGNUP RESPONSE:", response.data);
  }
  return response.data;
};

export const login = async (loginData) => {
  if (import.meta.env.DEV) {
    console.log("🔗 API LOGIN REQUEST:", loginData);
  }
  const response = await axiosInstance.post("/auth/login", loginData);
  if (import.meta.env.DEV) {
    console.log("📨 API LOGIN RESPONSE:", response.data);
  }
  return response.data;
};

export const logout = async () => {
  const response = await axiosInstance.post("/auth/logout");
  return response.data;
};

export const onboard = async (onboardData) => {
  if (import.meta.env.DEV) {
    console.log("🔗 API ONBOARD REQUEST:", onboardData);
  }
  const response = await axiosInstance.post("/auth/onboarding", onboardData);
  if (import.meta.env.DEV) {
    console.log("📨 API ONBOARD RESPONSE:", response.data);
  }
  return response.data;
};

export const getRecommendedUsers = async (page = 1, limit = 10) => {
  const response = await axiosInstance.get(
    `/users?page=${page}&limit=${limit}`
  );
  return response.data.data; // Return the data array directly
};

export const getMyFriends = async () => {
  const response = await axiosInstance.get("/users/friends");
  return response.data;
};

export const getUserById = async (userId) => {
  const response = await axiosInstance.get(`/users/${userId}`);
  return response.data;
};

export const sendFriendRequest = async (userId) => {
  const response = await axiosInstance.post(`/users/friend-request/${userId}`);
  return response.data;
};

export const acceptFriendRequest = async (requestId) => {
  const response = await axiosInstance.put(
    `/users/friend-request/${requestId}/accept`
  );
  return response.data;
};

export const getFriendRequests = async () => {
  const response = await axiosInstance.get("/users/friend-requests");
  return response.data;
};

export const getUserFriends = async () => {
  const response = await axiosInstance.get("/users/friends");
  return response.data.data; // Return the data array directly
};

export const getOutgoingFriendRequests = async () => {
  const response = await axiosInstance.get("/users/outgoing-friend-requests");
  return response.data;
};

export const getStreamToken = async () => {
  const response = await axiosInstance.get("/chat/token");
  return response.data;
};

export const getAuthUser = async () => {
  try {
    console.log("🔗 API GET AUTH USER REQUEST");
    const response = await axiosInstance.get("/auth/me");
    console.log("📨 API GET AUTH USER RESPONSE:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching authenticated user:", error);
    return null;
  }
};

export const cancelFriendRequest = async (requestId) => {
  const response = await axiosInstance.delete(
    `/users/friend-request/${requestId}`
  );
  return response.data;
};

// Status API functions
export const createStatus = async (statusData) => {
  console.log("🔗 API CREATE STATUS REQUEST:", statusData);
  const response = await axiosInstance.post("/status", statusData);
  console.log("📨 API CREATE STATUS RESPONSE:", response.data);
  return response.data;
};

export const getStatusFeed = async (page = 1, limit = 10) => {
  const response = await axiosInstance.get(`/status/feed?page=${page}&limit=${limit}`);
  return response.data;
};

export const getUserStatuses = async (userId, page = 1, limit = 10) => {
  const response = await axiosInstance.get(`/status/user/${userId}?page=${page}&limit=${limit}`);
  return response.data;
};

export const reactToStatus = async (statusId, reactionType) => {
  const response = await axiosInstance.post(`/status/${statusId}/react`, { reactionType });
  return response.data;
};

export const removeStatusReaction = async (statusId) => {
  const response = await axiosInstance.delete(`/status/${statusId}/react`);
  return response.data;
};

export const addStatusComment = async (statusId, content) => {
  const response = await axiosInstance.post(`/status/${statusId}/comments`, { content });
  return response.data;
};

export const addCommentReply = async (statusId, commentId, content) => {
  const response = await axiosInstance.post(`/status/${statusId}/comments/${commentId}/replies`, { content });
  return response.data;
};

export const updateStatus = async (statusId, statusData) => {
  const response = await axiosInstance.put(`/status/${statusId}`, statusData);
  return response.data;
};

export const deleteStatus = async (statusId) => {
  const response = await axiosInstance.delete(`/status/${statusId}`);
  return response.data;
};

export const getStatusById = async (statusId) => {
  const response = await axiosInstance.get(`/status/${statusId}`);
  return response.data;
};

// Notification API functions
export const markNotificationAsRead = async (notificationId) => {
  const response = await axiosInstance.put(`/users/notifications/${notificationId}/read`);
  return response.data;
};

export const markAllNotificationsAsRead = async () => {
  const response = await axiosInstance.put("/users/notifications/mark-all-read");
  return response.data;
};

// Profile API functions
export const getUserProfile = async (userId) => {
  const response = await axiosInstance.get(`/users/${userId}`);
  return response.data.data; // Extract the actual user data from the response
};

export const updateProfile = async (profileData) => {
  const response = await axiosInstance.put("/users/profile", profileData);
  return response.data;
};

export const getStatusesByUser = async (userId, page = 1, limit = 10) => {
  const response = await axiosInstance.get(`/status/user/${userId}?page=${page}&limit=${limit}`);
  return response.data.data; // Return the data array directly
};

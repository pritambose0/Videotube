import axiosInstance from "./axiosInstance";

// Endpoints functions
export const createAccount = (userData) => {
  axiosInstance.post("/users/register", userData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const login = (credentials) =>
  axiosInstance.post("/users/login", credentials);

export const getCurrentUser = () => axiosInstance.get("/users/current-user");

export const logout = () => axiosInstance.post("/users/logout");
export const fetchVideos = () => axiosInstance.get("/videos");
export const fetchVideoDetail = (id) => axiosInstance.get(`/videos/${id}`);
export const uploadVideo = (videoData) =>
  axiosInstance.post("/videos", videoData);

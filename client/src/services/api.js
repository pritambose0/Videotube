import axios from "axios";
import config from "../config/config";

// Axios instance with base URL
const api = axios.create({
  baseURL: config.baseUrl,
});

// Endpoints functions
export const createAccount = (userData) =>
  api.post("/users/register", userData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const login = (credentials) => api.post("/users/login", credentials);
export const logout = () => api.post("/users/logout");
export const fetchVideos = () => api.get("/videos");
export const fetchVideoDetail = (id) => api.get(`/videos/${id}`);
export const uploadVideo = (videoData) => api.post("/videos", videoData);

export default api;

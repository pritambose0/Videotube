import axios from "axios";
import config from "../config/config";

// Create axios instance with base URL
const api = axios.create({
  baseURL: config.baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// Endpoints functions
export const createAccount = (userData) =>
  api.post("/users/register", userData);

export const login = (credentials) => api.post("/users/login", credentials);
export const logout = () => api.post("/users/logout");
export const fetchVideos = () => api.get("/videos");
export const fetchVideoDetail = (id) => api.get(`/videos/${id}`);
export const uploadVideo = (videoData) => api.post("/videos", videoData);

export default api;

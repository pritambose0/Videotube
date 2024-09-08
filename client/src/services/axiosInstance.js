import axios from "axios";
import config from "../config/config";

const axiosInstance = axios.create({
  baseURL: config.baseUrl,
  withCredentials: true, // Include cookies in requests
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const serverError = error;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await axios.post(
          `${config.baseUrl}/users/refresh-token`,
          {},
          { withCredentials: true }
        );

        // Retry the original request with the new token
        return axiosInstance(originalRequest);
      } catch (error) {
        console.error(error.response);
        return Promise.reject(serverError ? serverError : error);
      }
    }
    // If the error is not a 401 or the retry fails, pass it along
    return Promise.reject(error);
  }
);

export default axiosInstance;

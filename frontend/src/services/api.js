import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

API.interceptors.request.use(
  (req) => {
    let userInfo = null;

    try {
      // Read the same storage used by AuthContext
      const storedUser =
        sessionStorage.getItem("userInfo") || localStorage.getItem("userInfo");

      userInfo = storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Unable to read stored user info:", error);
    }

    if (userInfo?.token) {
      req.headers.Authorization = `Bearer ${userInfo.token}`;
    }

    return req;
  },
  (error) => Promise.reject(error),
);

export default API;

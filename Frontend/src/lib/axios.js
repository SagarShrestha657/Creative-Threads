import axios from "axios";

export const axiosInstance = axios.create({
  // baseURL: "http://localhost:5001/api",
  baseURL:
    import.meta.env.NODE_ENV === "development"
      ? "http://localhost:5001/api"
      : "https://creative-theard.onrender.com/api",
  withCredentials: true,
});

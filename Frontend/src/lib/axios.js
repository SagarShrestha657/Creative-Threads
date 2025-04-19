import axios from "axios";

export const axiosInstance = axios.create({
  // baseURL: "http://localhost:5001/api",
  baseURL:
    process.env.NODE_ENV === "development"
      ? "http://localhost:5001/api"
      : "https://creativethreads.onrender.com/api",
  withCredentials: true,
});

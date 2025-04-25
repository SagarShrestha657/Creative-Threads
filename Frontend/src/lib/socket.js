import { io } from "socket.io-client";

const backendUrl = process.env.NODE_ENV === 'production' ? import.meta.env.VITE_BACKEND_URL : "http://localhost:5001";

export const socket = io(backendUrl, {
  autoConnect: false,
});

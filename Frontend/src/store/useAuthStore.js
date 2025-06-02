import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import { persist, createJSONStorage } from "zustand/middleware";
import toast from "react-hot-toast";
import { Navigate } from "react-router-dom";
import { socket } from "../lib/socket";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      authUser: null,
      isSigningUp: false,
      isLoggingIng: false,
      isUpdateProfile: false,
      isCheckingAuth: true,
      token: false,
      onlineUsers: [],
      socket: null,

      user: (data) => {
        set({ authUser: data });
      },

      userUpdate: (key, value) => {
        set((state) => ({
          authUser: {
            ...state.authUser,
            [key]: value,
          },
        }));
      },

      checkAuth: async () => {
        try {
          const res = await axiosInstance.get("/auth/check", {
            withCredentials: true,
          });
          set({ token: true });
        } catch (error) {
          console.log("Error in CheckAuth: ", error.message);
          set({ authUser: null });
          set({ token: false });
        } finally {
          set({ isCheckingAuth: false });
        }
      },

      connectSocket: () => {
        if (get().authUser?._id) {
          socket.connect();
          socket.emit("join", get().authUser._id);
          
          // Listen for initial list of online users
          socket.on("onlineUsers", (users) => {
            set({ onlineUsers: users });
          });

          // Listen for online/offline events
          socket.on("userOnline", (userId) => {
            set((state) => ({
              onlineUsers: [...new Set([...state.onlineUsers, userId])]
            }));
          });

          socket.on("userOffline", (userId) => {
            set((state) => ({
              onlineUsers: state.onlineUsers.filter(id => id !== userId)
            }));
          });
        }
      },

      disconnectSocket: () => {
        socket.disconnect();
        set({ onlineUsers: [] });
      },
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

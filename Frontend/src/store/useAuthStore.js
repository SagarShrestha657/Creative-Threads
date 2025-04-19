import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import { persist, createJSONStorage } from "zustand/middleware";
import toast from "react-hot-toast";
import { Navigate } from "react-router-dom";

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
          // console.log(res);
          set({ token: true });
          // get().connectSocket();
        } catch (error) {
          console.log("Error in CheckAuth: ", error.message);
          set({ authUser: null });
          set({ token: false });
        } finally {
          set({ isCheckingAuth: false });
        }
      },
      connectSocket: () => {},
      disconnectSocket: () => {},
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

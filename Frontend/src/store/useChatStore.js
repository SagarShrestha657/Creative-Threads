import toast from "react-hot-toast";
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { socket } from "../lib/socket";
import { useAuthStore } from "./useAuthStore";


export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUserLoading: false,
  isMessageLoading: false,

  getUsers: async () => {
    set({ isUserLoading: true });
    try {
      const res = await axiosInstance.get("/message/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUserLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessageLoading: true });
    try {
      const res = await axiosInstance.get(`/message/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessageLoading: false });
    }
  },

  sendMessages: async (messageData) => {
    const { authUser } = useAuthStore.getState();
    const { selectedUser, addNewMessageToChat } = get();
  
    const newMessage = {
      _id: new Date().getTime(), // Temporary ID for frontend
      senderId: authUser._id,
      text: messageData.text || "",
      image: messageData.image || "",
      createdAt: new Date().toISOString(),
    };
  
    // 1. Optimistically update the UI
    addNewMessageToChat(newMessage);
  
    try {
      // 2. Store message in DB
      await axiosInstance.post(`/message/send/${selectedUser._id}`, messageData);
  
      // 3. Emit via socket
      socket.emit("sendMessage", {
        senderId: authUser._id,
        receiverId: selectedUser._id,
        message: {
          text: messageData.text || "",
          image: messageData.image || "",
        },
        createdAt: newMessage.createdAt,
      });
    } catch (error) {
      console.log("Failed to send message:", error);
      toast.error("Message failed to send");
    }
  },
  
  setSelectedUser: (selectedUser) => {
    set({ selectedUser: selectedUser });
  },

  addNewMessageToChat: (newMessage) =>
    set((state) => ({
      messages: [...state.messages, newMessage],
    })),
}));

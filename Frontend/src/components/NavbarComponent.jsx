import React from "react";
import {
  Home,
  Compass,
  User,
  MessageCircle,
  Bell,
  Settings,
  LogOut,
  Plus,
} from "lucide-react";
import toast from "react-hot-toast";
import io from "socket.io-client"

import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "../store/useAuthStore";

const Navbar = () => {
  const { authUser } = useAuthStore();
  const socketUrl = process.env.NODE_ENV === "production"
    ? import.meta.env.VITE_BACKEND_URL // Use your production URL here
    : "http://localhost:5001";  // Local development URL
  const socket = io.connect(socketUrl, {
    // transport:["websocket"]
  })

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
      socket.disconnect()
      sessionStorage.clear();
      window.location.href = "/login";
      toast.success("Logout successfully");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="sticky top-0 h-screen w-72 bg-black border-r border-neutral-200/20 hidden lg:block">
        <div className="flex flex-col h-full px-2">
          {/* Logo */}
          <div className="p-6 border-b border-neutral-200/20">
            <h1 className="text-2xl font-bold text-white">Creative Threads</h1>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 py-6 space-y-1">
            <a
              href="/"
              className="flex items-center gap-3 px-6 py-3 text-white text-xl rounded-2xl hover:bg-[#1A1A1A] transition-all active"
            >
              <Home size={22} />
              <span>Feed</span>
            </a>
            <a
              href="/Explore"
              className="flex items-center gap-3 px-6 py-3 text-white text-xl rounded-2xl hover:bg-[#1A1A1A] transition-all"
            >
              <Compass size={22} />
              <span>Explore</span>
            </a>
            <a
              href={`/profile/${authUser?._id}`}
              className="flex items-center gap-3 px-6 py-3 text-white text-xl rounded-2xl hover:bg-[#1A1A1A] transition-all"
            >
              <User size={22} />
              <span>Profile</span>
            </a>
            <a
              href="/Chat"
              className="flex items-center gap-3 px-6 py-3 text-white text-xl rounded-2xl hover:bg-[#1A1A1A] transition-all"
            >
              <MessageCircle size={22} />
              <span>Chat</span>
            </a>
            {/* <a
              href="/Notifications"
              className="flex items-center gap-3 px-6 py-3 text-white text-xl rounded-2xl hover:bg-[#1A1A1A] transition-all"
            >
              <Bell size={22} />
              <span>Notifications</span>
            </a> */}

            {/* 👇 Show Create Post only if user is an artist */}
            {authUser?.role === "artist" && (
              <a
                href="/createpost"
                className="flex items-center gap-3 px-6 py-3 text-white text-xl rounded-2xl hover:bg-[#1A1A1A] transition-all"
              >
                <Plus size={22} />
                <span>Create Post</span>
              </a>
            )}

            <a
              href="/setting"
              className="flex items-center gap-3 px-6 py-3 text-white text-xl rounded-2xl hover:bg-[#1A1A1A] transition-all"
            >
              <Settings size={22} />
              <span>Settings</span>
            </a>
          </div>

          {/* Logout Button */}
          <div className="p-6 border-t border-neutral-200/20">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full text-white text-xl rounded-2xl px-6 py-3 hover:bg-[#1A1A1A] transition-all"
            >
              <LogOut size={22} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* 📱 Bottom navbar for mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-black border-t border-neutral-200/20 flex justify-around items-center h-16 px-4">
        <a href="/">
          <Home className="text-white w-6 h-6" />
        </a>
        <a href="/Explore">
          <Compass className="text-white w-6 h-6" />
        </a>
        <a href={`/profile/${authUser?._id}`}>
          <User className="text-white w-6 h-6" />
        </a>
        <a href="/Chat">
          <MessageCircle className="text-white w-6 h-6" />
        </a>
        <a href="/Setting">
          <Settings className="text-white w-6 h-6" />
        </a>
      </div>
    </>
  );
};

export default Navbar;

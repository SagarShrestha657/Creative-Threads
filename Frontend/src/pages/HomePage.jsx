import React, { useEffect, useState } from "react";
import Navbar from "../components/NavbarComponent";
import Feed from "../components/FeedComponent";
import Notification from "../components/NotificationComponent";
import { Bell } from "lucide-react";
import "../index.css";
import { socket } from "../lib/socket";
import { useAuthStore } from "../store/useAuthStore";

const Home = () => {
  const { authUser } = useAuthStore();
  useEffect(() => {
    if (authUser?._id) {
      socket.connect();
      socket.emit("join", authUser._id); // Join user-specific room
      console.log("Socket connected");
      socket.on("receiveMessage", (messageData) => {
        console.log("New message:", messageData);
      });

      socket.on("receiveNotification", (notificationData) => {
        console.log("Notification received:", notificationData);
      });
    }

    return () => {
      socket.disconnect();
    };
  }, [authUser]);
  return (
    <div className="bg-black min-h-screen flex flex-col lg:flex-row relative">
      {/* 🔝 Top bar for mobile */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-black border-b border-neutral-200/20 flex items-center justify-between px-4 h-14">
        <h1 className="text-white font-bold text-lg">Creative Threads</h1>
        <button>
          <Bell className="text-white w-6 h-6" />
        </button>
      </div>

      {/* 🧭 Sidebar for desktop */}
      <div className="hidden lg:block">
        <Navbar />
      </div>

      {/* 📱 Bottom navbar for mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-black border-t border-neutral-200/20 flex justify-around items-center h-16 px-4">
        <Navbar />
      </div>

      {/* 📰 Feed */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pt-16 pb-20 lg:pt-10 lg:pb-10 lg:px-8">
        <Feed />
      </div>

      {/* 🔔 Notification (Desktop only) */}
      <div className="hidden xl:block pr-[20px]">
        <Notification />
      </div>
    </div>
  );
};

export default Home;

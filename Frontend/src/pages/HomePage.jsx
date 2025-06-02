import React, { useEffect } from "react";
import Navbar from "../components/NavbarComponent";
import Feed from "../components/FeedComponent";
import Notification from "../components/NotificationComponent";
import { Bell } from "lucide-react";
import "../index.css";
import { useAuthStore } from "../store/useAuthStore";

const Home = () => {
  const { authUser, connectSocket, disconnectSocket } = useAuthStore();

  useEffect(() => {
    if (authUser?._id) {
      connectSocket();
    }

    return () => {
      disconnectSocket();
    };
  }, [authUser]);

  return (
    <div className="bg-black min-h-screen flex flex-col lg:flex-row relative">
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

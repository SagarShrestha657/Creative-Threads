import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import useSocket from "../hooks/useSocket";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get user ID and socket
  const token = localStorage.getItem("token");
  const userId = token ? jwt.decode(token)._id : null;
  const socket = useSocket(userId);  // Custom hook to manage socket connection

  useEffect(() => {
    // Fetch initial notifications
    const fetchNotifications = async () => {
      try {
        const res = await axiosInstance.get("/notifications/");
        setNotifications(res.data);
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setError("Failed to load notifications.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();

    // Listen for real-time notifications
    if (socket) {
      socket.on("receiveNotification", (notification) => {
        setNotifications((prevNotifications) => [
          notification,
          ...prevNotifications,
        ]);
      });
    }

    return () => {
      if (socket) socket.off("receiveNotification");
    };
  }, [socket]);

  const handleMarkAllRead = async () => {
    try {
      await axiosInstance.patch("/notifications/mark-all-read", null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true }))
      );
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const handleNotificationClick = (notification) => {
    // Logic to handle clicks (post, user profile, etc.)
  };

  if (loading) return <div>Loading notifications...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-bold text-white">Notifications</h2>
        <button onClick={handleMarkAllRead} className="text-blue-500 hover:underline">
          Mark all as read
        </button>
      </div>

      {notifications.length === 0 ? (
        <p className="text-white">No notifications</p>
      ) : (
        notifications.map((n) => (
          <div
            key={n._id}
            onClick={() => handleNotificationClick(n)}
            className={`p-3 mb-2 rounded-lg shadow cursor-pointer ${n.isRead ? "bg-gray-100" : "bg-white"}`}
          >
            <div className="flex items-center gap-2">
              <img
                src={n.sender?.profilePic || "/default.jpg"}
                alt="profile"
                className="w-8 h-8 rounded-full"
              />
              <p>
                <strong>{n.sender?.username}</strong> {n.content}
              </p>
            </div>
            <small className="text-gray-500">
              {new Date(n.createdAt).toLocaleString()}
            </small>
          </div>
        ))
      )}
    </div>
  );
};

export default Notification;

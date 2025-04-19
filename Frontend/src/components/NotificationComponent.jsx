import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import useSocket from "../hooks/useSocket";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Bell } from "lucide-react";  // Importing icons from lucide-react

const Notification = () => {
  // const [notifications, setNotifications] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);
  // const [hasMore, setHasMore] = useState(true);  // For pagination control
  // const [page, setPage] = useState(1);  // Page state for "Read More"

  // // Get user ID and socket
  // const token = localStorage.getItem("token");
  // const userId = token ? jwt.decode(token)._id : null;
  // const socket = useSocket(userId);  // Custom hook to manage socket connection
  // const navigate = useNavigate();

  // useEffect(() => {
  //   // Fetch initial notifications
  //   const fetchNotifications = async () => {
  //     try {
  //       const res = await axiosInstance.get(`/notifications/`);
  //       // setNotifications((prev) => [...prev, ...res.data.notifications]);
  //       // setHasMore(res.data.hasMore);
  //     } catch (err) {
  //       console.error("Error fetching notifications:", err);
  //       setError("Failed to load notifications.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchNotifications();

  //   // Listen for real-time notifications
  //   if (socket) {
  //     socket.on("receiveNotification", (notification) => {
  //       setNotifications((prevNotifications) => [
  //         notification,
  //         ...prevNotifications,
  //       ]);
  //     });
  //   }

  //   return () => {
  //     if (socket) socket.off("receiveNotification");
  //   };
  // }, [socket, page]);

  // const handleMarkAllRead = async () => {
  //   try {
  //     await axiosInstance.patch("/notifications/mark-all-read", null, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     setNotifications((prev) =>
  //       prev.map((n) => ({ ...n, isRead: true }))
  //     );
  //   } catch (err) {
  //     console.error("Failed to mark as read:", err);
  //   }
  // };

  // const handleNotificationClick = (notification) => {
  //   if (notification.postId) {
  //     navigate(`/post/${notification.postId}`);
  //   } else if (notification.type === "follow" && notification.sender?._id) {
  //     navigate(`/profile/${notification.sender._id}`);
  //   }
  // };

  // const handleLoadMore = () => {
  //   if (hasMore) {
  //     setPage((prev) => prev + 1);  // Increment page number to load more notifications
  //   }
  // };

  // if (loading) return <div>Loading notifications...</div>;
  // if (error) return <div>{error}</div>;

  // return (
  //   <div className="p-4">
  //     <div className="flex justify-between items-center mb-6"> {/* Added margin-bottom for spacing */}
  //       <h2 className="text-xl font-bold text-white">Notifications</h2>
  //       <div className="flex items-center gap-4"> {/* Increased gap */}
  //         <button
  //           onClick={handleMarkAllRead}
  //           className="text-blue-500 hover:underline flex items-center"
  //         >
  //           <CheckCircle className="mr-2" />
  //           Mark all as read
  //         </button>
  //         <button
  //           onClick={() => navigate("/notifications")}
  //           className="text-blue-500 hover:underline flex items-center"
  //         >
  //           <Bell className="mr-2" />
  //           View All Notifications
  //         </button>
  //       </div>
  //     </div>

  //     {notifications.length === 0 ? (
  //       <p className="text-white">No notifications</p>
  //     ) : (
  //       notifications.map((n) => (
  //         <div
  //           key={n._id}
  //           onClick={() => handleNotificationClick(n)}
  //           className={`p-3 mb-2 rounded-lg shadow cursor-pointer ${n.isRead ? "bg-gray-100" : "bg-white"}`}
  //         >
  //           <div className="flex items-center gap-2">
  //             <img
  //               src={n.sender?.profilePic || "/default.jpg"}
  //               alt="profile"
  //               className="w-8 h-8 rounded-full"
  //             />
  //             <p>
  //               <strong>{n.sender?.username}</strong> {n.content}
  //             </p>
  //           </div>
  //           <small className="text-gray-500">
  //             {new Date(n.createdAt).toLocaleString()}
  //           </small>
  //         </div>
  //       ))
  //     )}

  //     {hasMore && (
  //       <button
  //         onClick={handleLoadMore}
  //         className="text-blue-500 hover:underline mt-3"
  //       >
  //         Read More
  //       </button>
  //     )}
  //   </div>
  // );
};

export default Notification;

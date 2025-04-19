import Notification from "../models/notificationModel.js";
import User from "../models/userModel.js";

// Create and store a new notification
const sendNotification = async ({ senderId, receiverId, type, postId }) => {
  let content = "";

  if (type === "follow") {
    content = "started following you.";
  } else if (type === "like") {
    content = "liked your post.";
  } else if (type === "comment") {
    content = "commented on your post.";
  }

  // Resolve receiver if it's a username
  let resolvedReceiverId = receiverId;
  if (typeof receiverId === "string") {
    try {
      const user = await User.findOne({ username: receiverId });
      if (!user) throw new Error("User not found");
      resolvedReceiverId = user._id;
    } catch (error) {
      console.error("Error resolving receiver username:", error);
      throw new Error("Error resolving receiver username.");
    }
  }

  const notification = await Notification.create({
    recipient: resolvedReceiverId,
    sender: senderId,
    type,
    content,
    postId,
    isRead: false,
    createdAt: new Date().toISOString(),
  });

  return notification;
};

// Emit a notification using socket.io
const emitNotification = (io, receiverId, notification) => {
  io.to(receiverId).emit("receiveNotification", {
    senderId: notification.sender,
    type: notification.type,
    content: notification.content,
    postId: notification.postId,
    createdAt: notification.createdAt,
  });
};

// Get all notifications for the current user
export const getNotificationsForUser = async (req, res) => {
  try {
    const userId = req.user._id;

    const notifications = await Notification.find({ recipient: userId })
      .sort({ createdAt: -1 })
      .populate("sender", "username profilePic");

    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Failed to get notifications" });
  }
};

// Mark all unread notifications as read for the current user
export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user._id;

    await Notification.updateMany(
      { recipient: userId, isRead: false },
      { $set: { isRead: true } }
    );

    res.status(200).json({ message: "Marked all as read" });
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    res.status(500).json({ message: "Failed to mark notifications as read" });
  }
};

export default {
  sendNotification,
  emitNotification,
  getNotificationsForUser,
  markAllAsRead,
};

import toast from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore";

export const showNotification = (notification) => {
  const { senderId, type, createdAt } = notification;

  let message = "";

  switch (type) {
    case "like":
      message = "Someone liked your post.";
      break;
    case "comment":
      message = "Someone commented on your post.";
      break;
    case "follow":
      message = "You got a new follower.";
      break;
    case "message":
      message = "New message received.";
      break;
    case "share":
      message = "Your post was shared.";
      break;
    case "feature":
      message = "Your post was featured!";
      break;
    default:
      message = "You have a new notification.";
  }

  toast(message, {
    duration: 4000,
    position: "top-right",
    icon: "🔔",
    style: {
      background: "#333",
      color: "#fff",
      borderRadius: "8px",
    },
  });

  // Optional: Add to your notification store
  // useNotificationStore.getState().addNotification(notification);
};

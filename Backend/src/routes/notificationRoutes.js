import express from "express";
import {
  getNotificationsForUser,
  markAllAsRead,
} from "../controller/notificationController.js";
import { protectedRoute } from "../middleware/authMiddleware.js";

const NotificationRoutes = express.Router();

// Get all notifications for a user
NotificationRoutes.get("/", protectedRoute, getNotificationsForUser);

// Mark all notifications as read
NotificationRoutes.patch("/mark-all-read", protectedRoute, markAllAsRead);

export default NotificationRoutes;

import express from "express";
import { getUsers } from "../controller/exploreController.js";
import { protectedRoute } from "../middleware/authMiddleware.js";

const exploreRoutes = express.Router();

exploreRoutes.get("/users",protectedRoute, getUsers)

export default exploreRoutes;

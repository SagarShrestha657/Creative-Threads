import express from "express";
import { getUsers, search } from "../controller/exploreController.js";
import { protectedRoute } from "../middleware/authMiddleware.js";

const exploreRoutes = express.Router();

exploreRoutes.get("/users",protectedRoute, getUsers)

exploreRoutes.get("/search/:type/:q", protectedRoute, search)

export default exploreRoutes;

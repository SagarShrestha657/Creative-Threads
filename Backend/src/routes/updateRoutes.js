import express from "express";
import {  personalinfo, followUser, unFollowUser, getFollowers, getFollowing, editprofile, follow } from "../controller/updateController.js";
import { multerUpload } from "../middleware/multerMiddleware.js";
import { protectedRoute } from "../middleware/authMiddleware.js";

const updateRoutesoutes = express.Router();

updateRoutesoutes.patch("/personalinfo",protectedRoute, personalinfo)

updateRoutesoutes.patch("/editProfile",multerUpload.single('profilePic'),protectedRoute, editprofile)

updateRoutesoutes.post("/follow",protectedRoute, followUser)

updateRoutesoutes.post("/follow/:id",protectedRoute, follow)

updateRoutesoutes.delete("/:userId/unfollow", unFollowUser);

updateRoutesoutes.get("/:userId/followers", getFollowers);

updateRoutesoutes.get("/:userId/following", getFollowing);


export default updateRoutesoutes
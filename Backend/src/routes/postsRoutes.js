import express from "express";
import { addcomment,addreply,updatecomment,updatereply,deletecomment,deletereply,randomposts,addpost,updatemypost,getmypost, deletemypost, postlike, postunlike, getPostById, suggested, getotheruserposts } from "../controller/postsController.js";
import { Checkrole } from "../middleware/roleMiddlerware.js";
import { multerUpload } from "../middleware/multerMiddleware.js";
import { protectedRoute } from "../middleware/authMiddleware.js";

const postsRoutes = express.Router();

postsRoutes.post("/addcomment", protectedRoute ,addcomment);

postsRoutes.patch("/updatecomment",updatecomment);

postsRoutes.delete("/deletecomment",deletecomment);

postsRoutes.get("/getpost/:postId", getPostById);

postsRoutes.post("/likepost", protectedRoute , postlike)

postsRoutes.post("/unlikepost", protectedRoute , postunlike)

postsRoutes.post("/addreply",addreply);

postsRoutes.patch("/updatereply",updatereply);

postsRoutes.delete("/deletereply",deletereply);

postsRoutes.get("/randomposts",randomposts);

postsRoutes.post("/addpost", multerUpload.array('files'),protectedRoute,Checkrole, addpost);

postsRoutes.patch("/updatemypost",Checkrole,updatemypost);

postsRoutes.get("/getmypost",protectedRoute, getmypost);

postsRoutes.delete("/delete",Checkrole, deletemypost);

postsRoutes.get("/suggested",protectedRoute,suggested);

postsRoutes.get("/getotheruserposts",getotheruserposts);


export default postsRoutes;
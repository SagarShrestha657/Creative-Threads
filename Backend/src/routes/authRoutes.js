import express from "express";
import {
  changepassword,
  checkAuth,
  emailAddressCheck,
  emailVerificationCheck,
  login,
  logout,
  signup,
  sendotp,
  verifyotp,
  getotheruserprofile
} from "../controller/authController.js";
import { protectedRoute } from "../middleware/authMiddleware.js";
import { trackUserActivity } from "../middleware/TrackUserMiddleware.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/verificationcode", emailVerificationCheck);

router.post("/emailaddress",emailAddressCheck)

router.post("/login", login);

router.post("/logout", logout);

router.get("/check", protectedRoute, checkAuth);

router.patch("/changepassword", protectedRoute, trackUserActivity, changepassword);

router.post("/sendotp", protectedRoute, sendotp);

router.patch("/verifyotp", protectedRoute,verifyotp)

// router.post("/checkotp", protectedRoute, checkOtp);

router.get("/user/:username",protectedRoute,getotheruserprofile)

export default router;

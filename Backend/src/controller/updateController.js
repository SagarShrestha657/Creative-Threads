import { Readable } from "stream";
import cloudinary from "../lib/cloudinary.js"; // Notice the .js extension
import User from "../models/userModel.js";
import notificationController from "./notificationController.js";

const uploadtocloudinary = async (buffer) => {
  return new Promise(async (resolve, reject) => {
    let cld_upload_stream = cloudinary.uploader.upload_stream(
      { folder: "test" },
      function (error, result) {
        if (error) {
          return reject(error);
        }
        return resolve({ public_id: result.public_id, url: result.secure_url });
      }
    );

    Readable.from(buffer).pipe(cld_upload_stream);
  });
};

const uploader = async (file) => {
  const buffer = file.buffer;
  const result = await uploadtocloudinary(buffer);

  return result;
};

export const personalinfo = async (req, res) => {
  try {
    const { dob, phone, country, city, gender } = req.body;
    //const userId = req.user._id;

    // Create an object with only fields that should be updated
    let updateFields = { dob, phone, country, city, gender };

    // Find and update the user without modifying profilePic if no new image is uploaded
    const user = await User.findByIdAndUpdate(req.decode.userId, { $set: updateFields }, { new: true });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (req.file) {
      const uploadedImage = await uploader(req.file);
      updateFields.profilePic = uploadedImage.url;
    }

    await User.findByIdAndUpdate(
      user._id,
      { $set: updateFields },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({
      success: false,
      message: "Error updating profile",
      error: error.message,
    });
  }
};

export const editprofile = async (req, res) => {
  try {
    const { username, name, arttype, bio } = req.body;

    if (username.length > 0) {
      const existingUser = await User.find({ username: username });
      if (existingUser.length > 0) {
        return res.status(400).json({ message: "Username already exists" });
      }
      var updateData = {
        name,
        username,
        arttype,
        bio,
      };
    } else {
      var updateData = {
        name,
        arttype,
        bio,
      };
    }

    if (req.file) {
      const upload_resp = await uploader(req.file); // Pass multer's file
      updateData.profilePic = upload_resp.url;
    }

    const user = await User.findByIdAndUpdate(req.decode.userId, updateData, {
      new: true,
    });

    res.json({ profilePic: user.profilePic });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update failed" });
  }
};

export const followUser = async (req, res) => {
  try {
    const follower = await User.findById(req.decode.userId);
    const { username } = req.body;

    // Get user to be followed by username
    const userToFollow = await User.findOne({ username });

    if (!userToFollow || !follower) {
      return res.status(404).json({ message: "User not found" });
    }

    if (userToFollow._id.toString() === follower._id.toString()) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    if (userToFollow.followers.includes(follower._id)) {
      return res.status(400).json({ message: "Already following this user" });
    }

    // Add follower
    userToFollow.followers.push(follower._id);
    await userToFollow.save();

    follower.following.push(userToFollow._id);
    await follower.save();

    // ✅ Create a "follow" notification
    const notification = await notificationController.sendNotification({
      senderId: follower._id,
      receiverId: userToFollow._id,
      type: "follow",
    });

    // ✅ Emit notification if `req.io` is available (injected from app.js/server.js)
    if (req.io) {
      notificationController.emitNotification(req.io, userToFollow._id, notification);
    }

    res
      .status(200)
      .json({
        message: "Followed successfully",
        user: userToFollow,
        follower: follower,
      });

  } catch (error) {
    console.log("Error in followUser controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const unFollowUser = async (req, res) => {
  try {
    const { userId } = req.params; // The user being unfollowed
    const { followerId } = req.body; // The user who wants to unfollow

    const user = await User.findById(userId);
    const follower = await User.findById(followerId);

    if (!user || !follower) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.followers.includes(followerId)) {
      return res
        .status(400)
        .json({ message: "You are not following this user" });
    }

    user.followers = user.followers.filter(
      (id) => id.toString() !== followerId
    );
    follower.following = follower.following.filter(
      (id) => id.toString() !== userId
    );

    await user.save();
    await follower.save();

    res.status(200).json({ message: "User unfollowed successfully" });
  } catch (error) {
    console.error("Unfollow User Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getFollowers = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate(
      "followers",
      "username email"
    ); // Populate to get follower details

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ followers: user.followers });
  } catch (error) {
    console.error("Get Followers Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getFollowing = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate(
      "following",
      "username email"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ following: user.following });
  } catch (error) {
    console.error("Get Following Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const follow = async (req, res) => {
  const currentUserId = req.decode.userId; // make sure this comes from auth middleware
  const targetUserId = req.params.id;

  if (currentUserId === targetUserId) {
    return res.status(400).json({ message: "You can't follow yourself" });
  }

  const currentUser = await User.findById(currentUserId);
  const targetUser = await User.findById(targetUserId);

  if (!targetUser || !currentUser) {
    return res.status(404).json({ message: "User not found" });
  }

  const isFollowing = currentUser.following.includes(targetUserId);

  if (isFollowing) {
    // Unfollow
    currentUser.following.pull(targetUserId);
    targetUser.followers.pull(currentUserId);
  } else {
    // Follow
    currentUser.following.push(targetUserId);
    targetUser.followers.push(currentUserId);
  }

  await currentUser.save();
  await targetUser.save();

  res.status(200).json({
    message: isFollowing ? "Unfollowed" : "Followed",
    followers: targetUser.followers,
    following: currentUser.following,
  });
};


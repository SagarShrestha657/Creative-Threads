import mongoose from "mongoose";
import User from "../models/userModel.js";

export const getUsers = async (req, res) => {
  try {
    const user = await User.findById(req.decode.userId); // You said `user` var has full user info
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log(user);    
    // Get array of user IDs to exclude (already followed + self)
    const excludeIds = [...user.following, user._id];

    const suggestedUsers = await User.aggregate([
      {
        $match: {
          _id: { $nin: excludeIds.map(id => new mongoose.Types.ObjectId(id)) },
        },
      },
      { $sample: { size: 4 } },
      {
        $project: {
          id: "$_id",
          username: 1,
          role: 1,
          profilePic: 1,
          followers: { $size: "$followers" },
        },
      },
    ]);

    // Map users to include isFollowing: false and format followers count
    const formatted = suggestedUsers.map(user => ({
      id: user._id,
      username: user.username,
      role: user.role || "Artist",
      followers: formatFollowers(user.followers),
      profilePic: user.profilePic || "",
      isFollowing: false,
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error("Error in get user controller of explore: ", error);
    res.status(500).json({
      message: "Error getting suggested users",
      error: error.message,
    });
  }
};

// Helper to format followers count like "10.2k"
function formatFollowers(count) {
  if (count >= 1000000) return (count / 1000000).toFixed(1) + "M";
  if (count >= 1000) return (count / 1000).toFixed(1) + "k";
  return count.toString();
}

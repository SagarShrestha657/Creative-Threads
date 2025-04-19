import User from "../models/userModel.js";
import Message from "../models/messageModel.js";
import cloudinary from "../lib/cloudinary.js";
import notification from "../models/notificationModel.js";

export const getUserForSideBar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");
    console.log(filteredUsers);
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Message getUserForSideBar error", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getMessage = async (req, res) => {
  try {
    const { id: userToChatId } = req.params; // User we want to chat with
    const user = await User.findById(req.decode.userId); // Authenticated user's data

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const myId = user._id.toString(); // Ensure `myId` is a string

    console.log("Logged-in User ID:", myId);
    console.log("Chatting with User ID:", userToChatId);

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    }).sort({ createdAt: 1 }); // Sorting messages by creation time in ascending order (oldest first)

    console.log("Messages found:", messages); // Debugging line to check the result

    res.status(200).json(messages);
  } catch (error) {
    console.log("getMessage Controller Error: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const sendMessage = async (req, res, io) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const user = await User.findById(req.decode.userId); // You said `user` var has full user info
    const senderId = user._id.toString();

    let imageURL;

    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageURL = uploadResponse.secure_url;
    }

    console.log("Creating message with:", { senderId, receiverId, text, image });

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageURL,
    });
    console.log("✅ Message saved to DB:", newMessage);
    await newMessage.save();

    await notification.create({
      recipient: receiverId,
      sender: senderId,
      type: "message",
      content: text,
    });

    // Emit the message via Socket.io
    req.io.to(receiverId).emit("newMessage", newMessage);

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("sendMessage Controller Error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

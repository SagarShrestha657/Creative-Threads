import User from "../models/userModel.js";
import Message from "../models/messageModel.js";
import cloudinary from "../lib/cloudinary.js";
import notification from "../models/notificationModel.js";
import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.ENCRYPT_SECRET || "your-strong-secret-key";

export const getUserForSideBar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    console.log("Logged-in User ID:", loggedInUserId);

    const messageUsers = await Message.find({
      $or: [
        { senderId: loggedInUserId },
        { receiverId: loggedInUserId },
        { senderId: loggedInUserId, receiverId: loggedInUserId },
      ],
    })
      .sort({ createdAt: -1 })
      .select("senderId receiverId -_id");

    const userIds = [
      ...new Set(
        messageUsers.flatMap((msg) => [
          msg.senderId.toString(),
          msg.receiverId.toString(),
        ])
      ),
    ];

    let users = await User.find({ _id: { $in: userIds } }).select("-password");

    users = users.reverse();

    res.status(200).json(users);
  } catch (error) {
    console.error("getUserForSideBar Error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getMessage = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const user = await User.findById(req.decode.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const myId = user._id.toString();
    let messages = []
    if (myId === userToChatId) {
      messages = await Message.find({
        $or: [
          { senderId: myId, receiverId: myId },
        ],
      }).sort({ createdAt: 1 });
    } else {
      messages = await Message.find({
        $or: [
          { senderId: myId, receiverId: userToChatId },
          { senderId: userToChatId, receiverId: myId },
        ],
      }).sort({ createdAt: 1 });
    }

    // Decrypt messages using crypto-js
    const decryptedMessages = messages.map((msg) => ({
      ...msg._doc,
      text: msg.text
        ? CryptoJS.AES.decrypt(msg.text, SECRET_KEY).toString(CryptoJS.enc.Utf8)
        : "",
    }));

    res.status(200).json(decryptedMessages);
  } catch (error) {
    console.log("getMessage Controller Error: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const sendMessage = async (req, res, io) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const user = await User.findById(req.decode.userId);
    const senderId = user._id.toString();

    let imageURL;

    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageURL = uploadResponse.secure_url;
    }

    // Encrypt the message text using crypto-js before saving
    const encryptedText = text
      ? CryptoJS.AES.encrypt(text, SECRET_KEY).toString()
      : "";

    const newMessage = new Message({
      senderId,
      receiverId,
      text: encryptedText,
      image: imageURL,
    });
    await newMessage.save();

    await notification.create({
      recipient: receiverId,
      sender: senderId,
      type: "message",
      content: text,
    });

    req.io.to(receiverId).emit("newMessage", {
      ...newMessage._doc,
      text, // send decrypted text to socket clients
    });

    res.status(201).json({
      ...newMessage._doc,
      text, // send decrypted text to API clients
    });
  } catch (error) {
    console.error("sendMessage Controller Error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

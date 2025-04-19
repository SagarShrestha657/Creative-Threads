import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // 🔧 fix spelling from "require" to "required"
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // 🔧 fix spelling
    },
    text: {
      type: String, // 🔧 use String instead of "string"
      default: "",  // ✅ helps avoid undefined
    },
    image: {
      type: String,
      default: "",  // ✅ prevents undefined
    },
  },
  {
    timestamps: true, // ✅ createdAt and updatedAt
  }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;

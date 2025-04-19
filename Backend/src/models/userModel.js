import mongoose from "mongoose";

const userschema = new mongoose.Schema(
  {
    profilePic: {
      type: String,
    },
    name: {
      type: String,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    bio: {
      type: String,
    },
    arttype: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
    },
    dob: {
      type: Date,
    },
    gender: {
      type: String,
    },
    country: {
      type: String,
    },
    city: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["normal", "artist"],
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    verificationCode: {
      type: String,
      default: null,
      expire: "60*10",
    },
  },
  {
    timestamps: true,
  }
);

// ✅ Set default profilePic based on role before saving
userschema.pre("save", function (next) {
  if (!this.profilePic) {
    if (this.role === "artist") {
      this.profilePic =
        "https://res.cloudinary.com/dojtnawk0/image/upload/v1744267624/test/fgwlrnundr23vyqcbyuq.jpg";
    } else {
      this.profilePic =
        "https://res.cloudinary.com/dojtnawk0/image/upload/v1744267591/test/jeg2eevftzovl69ap2o0.jpg";
    }
  }
  next();
});

const User = mongoose.model("User", userschema);
export default User;

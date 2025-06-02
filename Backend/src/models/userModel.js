import mongoose from "mongoose";

const userschema = new mongoose.Schema(
  {
    profilePic: {
      type: String,
    },
    name: {
      type: String,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    bio: {
      type: String,
      trim: true,
    },
    arttype: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: Number,
      trim: true,
    },
    dob: {
      type: Date,
    },
    gender: {
      type: String,
    },
    country: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
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
        "https://res.cloudinary.com/dyg0nl1fj/image/upload/v1747728955/xvgry8s0moxnfowdubod.jpg";
    } else {
      this.profilePic =
        "https://res.cloudinary.com/dyg0nl1fj/image/upload/v1747729261/eqfq6yzi8vs5wsvndxbf.jpg";
    }
  }
  next();
});

const User = mongoose.model("User", userschema);
export default User;

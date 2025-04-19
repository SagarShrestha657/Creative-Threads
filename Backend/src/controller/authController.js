import { sendVerificationEmail, sendWelcomeEmail } from "../lib/email.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";

export const signup = async (req, res) => {
  const { username, email, password, role } = req.body;
  // console.log(req.body);
  try {
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    if (!["normal", "artist"].includes(role)) {
      return res
        .status(400)
        .json({ message: "Role should normal user or artist user Only! " });
    }

    const user = await User.findOne({ email });

    if (user)
      return res
        .status(400)
        .json({ message: "User has been already registered." });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const newUser = new User({
      username,
      email,
      role,
      password: hashedPassword,
      verificationCode,
    });

    sendVerificationEmail(email, verificationCode);

    //generateToken(newUser._id, res);
    await newUser.save();

    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
      profilePic: newUser.profilePic,
      bio: newUser.bio,
      arttype: newUser.arttype,
      followers: newUser.followers,
      following: newUser.following,
    });
  } catch (error) {
    console.log("Error Signup Controller", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "user doesn`t exists" });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid credentials" });

    if (!user.isVerified) {
      console.log(user.isVerified);
      const verificationCode = Math.floor(
        100000 + Math.random() * 900000
      ).toString();
      await User.findOneAndUpdate(
        { email },
        { verificationCode: verificationCode }
      );
      sendVerificationEmail(user.email, verificationCode);
      return res.status(200).json({
        emailverification: false,
        _id: user._id,
        email: user.email,
        role: user.role,
        username: user.username,
        phone: user.phone,
        bio: user.bio,
        arttype: user.arttype,
        profilePic: user.profilePic,
        followers: user.followers,
        following: user.following,
        dob: user.dob,
        country: user.country,
        city: user.city,
        phone: user.phone,
        gender: user.gender,
      });
    }
    generateToken(user._id, res);

    res.status(200).json({
      emailverification: true,
      _id: user._id,
      email: user.email,
      role: user.role,
      username: user.username,
      phone: user.phone,
      bio: user.bio,
      arttype: user.arttype,
      profilePic: user.profilePic,
      followers: user.followers,
      following: user.following,
      dob: user.dob,
      country: user.country,
      city: user.city,
      phone: user.phone,
      gender: user.gender,
    });
  } catch (error) {
    console.log("Error in Login Controller", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged Out" });
  } catch (error) {
    console.log("Error in Logout Controller", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const emailVerificationCheck = async (req, res) => {
  try {
    const { code, email } = req.body;
    const user = await User.findOne({
      email,
    });
    // console.log(email);
    if (!user) {
      return res.status(400).json({ message: "Invalid Code or Expired Code." });
    }
    if (user.verificationCode === code) {
      user.isVerified = true;
      user.verificationCode = null;
      await user.save();
      generateToken(user._id, res);
      sendWelcomeEmail(user.email);
      return res
        .status(200)
        .json({ isVerified: user.isVerified, message: "User isVerified! " });
    } else {
      // console.log("Verification failed");
      return res.status(404).json({ message: "incorrect code " });
    }
  } catch (error) {
    console.log("Error in checking email verifcation: ", error);
    res
      .status(500)
      .json({ message: "Error checking verification", error: error.message });
  }
};

export const checkAuth = (req, res) => {
  try {
    // console.log("Cookies: ",req.cookies);
    console.log(req.user);
    if (req.user) return res.status(200).json({ message: "token is provided" });
    res.status(401).json({ message: "token not provided" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const emailAddressCheck = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const verificationCode = Math.floor(
        100000 + Math.random() * 900000
      ).toString();

      user.verificationCode = verificationCode;

      await user.save();
      sendVerificationEmail(email, verificationCode);
      res.status(200).json({
        _id: user._id,
        email: user.email,
        role: user.role,
        username: user.username,
        phone: user.phone,
        bio: user.bio,
        arttype: user.arttype,
        profilePic: user.profilePic,
        followers: user.followers,
        following: user.following,
        dob: user.dob,
        country: user.country,
        city: user.city,
        phone: user.phone,
        gender: user.gender,
      })
    }
    else {
      res.status(401).json({ message: "user does'nt exists" })
    }
  } catch (error) {
    console.log("Error in checking email address: ", error);
    res
      .status(500)
      .json({
        message: "Error in checking email address",
        error: error.message,
      });
  }
};

export const changepassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.decode.userId);

    if (!user) return res.status(404).json({ message: "user not found" });

    const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordCorrect)
      return res.status(404).json({ message: "Incorrect password" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    const hello = await User.findByIdAndUpdate(user._id, { password: hashedPassword });

    //sendPasswordChangeEmail(user.email, req.userActivity);

    res.status(200).json({ message: "password change successfully" });
  } catch (error) {
    console.log("error :", error);
    res.status(500).json({ message: "internal server error" });
  }
};

export const sendotp = async (req, res) => {
  const { newEmail } = req.body;
  try {
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    await User.findByIdAndUpdate(req.decode.userId, {
      verificationCode: verificationCode,
    });
    sendVerificationEmail(newEmail, verificationCode);
    res.status(200).json({ message: "code send successfully" });
  } catch (error) {
    console.log("Error in checking email address: ", error);
    res
      .status(500)
      .json({
        message: "Error in checking email address",
        error: error.message,
      });
  }
};

export const verifyotp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findById(req.decode.userId);

    if (!user.verificationCode) {
      return res.status(400).json({ message: " OTP expired" });
    }
    if (user.verificationCode !== otp) {
      return res.status(400).json({ message: " OTP invalid" });
    }

    // Update email
    user.email = email;
    user.verificationCode = undefined;
    await user.save();

    res.status(200).json({ message: "Email updated successfully" });
  } catch (error) {
    console.log("Error in checking email address: ", error);
    res.status(500).json({ message: "Failed to verify OTP" });
  }
};

export const getotheruserprofile = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ user:user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
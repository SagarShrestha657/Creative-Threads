import cloudinary from "../lib/cloudinary.js"; // Notice the .js extension
import Post from "../models/postModel.js"; // Post model is in 'models/Post.js'
import { Readable } from "stream";
import User from "../models/userModel.js";
import axios from "axios";
import sharp from "sharp";

// Hugging Face API Token from .env
const HF_API_TOKEN = process.env.HF_API_TOKEN;

// Upload a buffer to Cloudinary and return the URL
const uploadtocloudinary = async (buffer) => {
  return new Promise((resolve, reject) => {
    let cld_upload_stream = cloudinary.uploader.upload_stream(
      { folder: "posts" },
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

// Upload all files to Cloudinary and return array of URLs
const uploader = async (files) => {
  const resp = [];
  for (let i = 0; i < files.length; i++) {
    const buffer = await sharp(files[i].buffer)
      .resize({ width: 512 }) // or any reasonable size
      .jpeg({ quality: 30 })
      .toBuffer();
    const result = await uploadtocloudinary(buffer);
    resp.push(result);
  }
  return resp;
};

// const artKeywords = [
//   "art", "drawing", "sketch", "painting", "digital", "3d", "illustration",
//   "anime", "cartoon", "render", "graffiti", "mural", "concept art", "character", "comic"
// ];

// // Hugging Face image classification
// const isArtImage = async (imageUrl) => {
//   try {
//     const response = await axios.post(
//       "https://api-inference.huggingface.co/models/google/vit-base-patch16-224",
//       { inputs: imageUrl },
//       {
//         headers: { Authorization: `Bearer ${HF_API_TOKEN}` },
//       }
//     );
//     console.log(response)
//     // response.data is an array of label objects
//     return response.data.some(
//       (label) =>
//         artKeywords.some((kw) =>
//           label.label.toLowerCase().includes(kw)
//         )
//     );
//   } catch (err) {
//     console.error("Hugging Face art check failed:", err?.response?.data || err.message);
//     return false;
//   }
// };

// API Route to Add Post (with art check)
export const addpost = async (req, res) => {
  try {
    const { username, title, description } = req.body;

    // 1. Upload images to Cloudinary
    const upload_resp = await uploader(req.files);
    const image_arr = upload_resp.map((img) => img.url);

    // 2. Check every image for art using Hugging Face
    // for (const url of image_arr) {
    //   const isArt = await isArtImage(url);
    //   if (!isArt) {
    //     return res.status(400).json({
    //       message: "Please upload an image related to any type of art.",
    //     });
    //   }
    // }

    // 3. Create new post
    const newPost = new Post({
      username,
      title,
      description,
      image: image_arr, // Store the image URLs
    });

    // 4. Save the post to the database
    await newPost.save();

    // 5. Respond with the saved post
    res.status(201).json({
      message: "Post added successfully!",
      post: newPost,
    });
  } catch (error) {
    console.error("Error uploading post:", error);
    res
      .status(500)
      .json({ message: "Error uploading post", error: error.message });
  }
};

export const postlike = async (req, res) => {
  const { postId } = req.body;
  const decoded = req.decode;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const user = await User.findById(decoded.userId).select("_id");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const userIdStr = user._id.toString();
    if (post.likes.userId.includes(userIdStr)) {
      return res.status(400).json({ message: "User already liked this post" });
    }
    post.likes.userId.push(userIdStr);
    post.likes.Totallike = post.likes.userId.length;
    await post.save();
    return res.status(200).json({
      message: "Post liked successfully",
      likes: {
        Totallike: post.likes.Totallike,
        userId: post.likes.userId,
      },
    });
  } catch (error) {
    console.error("Error in postlike:", error.message);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const postunlike = async (req, res) => {
  const { postId } = req.body;
  const decoded = req.decode;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const user = await User.findById(decoded.userId).select("_id");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const userIdStr = user._id.toString();
    if (!post.likes.userId.includes(userIdStr)) {
      return res.status(400).json({ message: "User has not liked this post" });
    }
    post.likes.userId.pull(userIdStr);
    post.likes.Totallike = post.likes.userId.length;
    await post.save();
    return res.status(200).json({
      message: "Post unliked successfully",
      likes: {
        Totallike: post.likes.Totallike,
        userId: post.likes.userId,
      },
    });
  } catch (error) {
    console.error("Error in unlikePost:", error.message);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const addcomment = async (req, res) => {
  try {
    const { postId, text } = req.body;
    const decoded = req.decode;
    const userId = decoded.userId;
    if (!postId || !userId || !text) {
      return res
        .status(400)
        .json({ message: "Post ID, User ID, and text are required." });
    }
    const post = await Post.findById(postId);
    post.comments.push({ userId, text });
    await post.save();
    res.status(201).json({ message: "Comment added successfully!", post });
  } catch (error) {
    res.status(500).json({ message: "Error adding comment", error });
  }
};

export const updatecomment = async (req, res) => {
  try {
    const { postId, commentIndex } = req.body;
    const { text } = req.body;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }
    if (!post.comments[commentIndex]) {
      return res.status(404).json({ message: "Comment not found." });
    }
    post.comments[commentIndex].text = text;
    await post.save();
    res.status(200).json({ message: "Comment updated successfully", post });
  } catch (error) {
    res.status(500).json({ message: "Error updating comment", error });
  }
};

export const deletecomment = async (req, res) => {
  try {
    const { postId, commentIndex } = req.body;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }
    if (!post.comments[commentIndex]) {
      return res.status(404).json({ message: "Comment not found." });
    }
    post.comments.splice(commentIndex, 1);
    await post.save();
    res.status(200).json({ message: "Comment deleted successfully", post });
  } catch (error) {
    res.status(500).json({ message: "Error deleting comment", error });
  }
};

export const addreply = async (req, res) => {
  try {
    const { postId, commentIndex, text } = req.body;
    const userId = req.cookies.jwt;
    if (!postId || !commentIndex || !userId || !text) {
      return res.status(400).json({
        message: "Post ID, Comment Index, User ID, and text are required.",
      });
    }
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }
    const comment = post.comments[commentIndex];
    if (!comment) {
      return res.status(404).json({ message: "Comment not found." });
    }
    comment.replies.push({ userId, text });
    await post.save();
    res.status(201).json({ message: "Reply added successfully!", post });
  } catch (error) {
    res.status(500).json({ message: "Error adding reply", error });
  }
};

export const deletereply = async (req, res) => {
  try {
    const { postId, commentIndex, replyIndex } = req.params;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }
    const comment = post.comments[commentIndex];
    if (!comment) {
      return res.status(404).json({ message: "Comment not found." });
    }
    const reply = comment.replies[replyIndex];
    if (!reply) {
      return res.status(404).json({ message: "Reply not found." });
    }
    comment.replies.splice(replyIndex, 1);
    await post.save();
    res.status(200).json({ message: "Reply deleted successfully", post });
  } catch (error) {
    res.status(500).json({ message: "Error deleting reply", error });
  }
};

export const updatereply = async (req, res) => {
  try {
    const { postId, commentIndex, replyIndex } = req.body;
    const { text } = req.body;
    if (!text) {
      return res
        .status(400)
        .json({ message: "Text for the reply is required." });
    }
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }
    const comment = post.comments[commentIndex];
    if (!comment) {
      return res.status(404).json({ message: "Comment not found." });
    }
    const reply = comment.replies[replyIndex];
    if (!reply) {
      return res.status(404).json({ message: "Reply not found." });
    }
    reply.text = text;
    await post.save();
    res.status(200).json({ message: "Reply updated successfully", post });
  } catch (error) {
    res.status(500).json({ message: "Error updating reply", error });
  }
};

export const getPostById = async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json({
      message: "Post fetched successfully",
      data: post,
    });
  } catch (error) {
    console.error("Error fetching post:", error.message);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const randomposts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const posts = await Post.find()
      .skip(skip)
      .limit(limit)
      .populate("username", "username profilePic");
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const getmypost = async (req, res) => {
  try {
    const posts = await Post.find({ username: req.decode.userId }).populate(
      "username",
      "username profilePic"
    );
    if (posts.length === 0) {
      return res
        .status(404)
        .json({ message: "No posts found for this artist " });
    }
    res.status(200).json({
      posts,
    });
  } catch (error) {
    console.error("Error fetching posts by artist:", error);
    res
      .status(500)
      .json({ message: "Error fetching posts", error: error.message });
  }
};

export const updatemypost = async (req, res) => {
  try {
    const { postId } = req.body;
    const { title, description } = req.body;
    const updatedPost = await Post.findOneAndUpdate(
      { postId: postId },
      {
        title,
        description,
        updatedAt: Date.now(),
      },
      { new: true }
    );
    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json({
      message: "Post updated successfully!",
      post: updatedPost,
    });
  } catch (error) {
    console.error("Error updating post:", error);
    res
      .status(500)
      .json({ message: "Error updating post", error: error.message });
  }
};

export const deletemypost = async (req, res) => {
  try {
    const { postId } = req.query;
    if (!postId) {
      return res.status(400).json({ message: "Post ID is required. " });
    }
    const deletePost = await Post.findOneAndDelete({ postId: postId });
    if (!deletePost) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting post",
      error: error.message,
    });
  }
};

export const suggested = async (req, res) => {
  try {
    const currentUser = await User.findById(req.decode.userId).select(
      "following"
    );
    if (!currentUser) {
      return res.status(404).json({ error: "User not found" });
    }
    const excludeIds = [req.decode.userId, ...currentUser.following];
    const suggestedUsers = await User.find({
      _id: { $nin: excludeIds },
      role: "artist",
    })
      .limit(10)
      .select("username profilePic arttype followers");
    res.status(200).json({ suggestedUsers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getotheruserposts = async (req, res) => {
  try {
    const username = req.query.username;
    const user = await User.findOne({ username: username });
    if (!user)
      return res.status(404).json({ message: "user not found" });
    const posts = await Post.find({ username: user._id }).populate(
      "username",
      "username profilePic"
    );
    if (!posts)
      return res.status(404).json({ message: "user have not posted " });
    return res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};


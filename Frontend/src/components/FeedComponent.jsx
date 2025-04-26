import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { Heart, MessageCircle, Share, Bookmark, Send } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

const Feed = () => {
  const [artworks, setArtworks] = useState([]);
  const [isLikedMap, setIsLikedMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [commentInputs, setCommentInputs] = useState({});
  const [visibleCommentsMap, setVisibleCommentsMap] = useState({});
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const navigate = useNavigate();
  const { authUser } = useAuthStore()

  const userId = localStorage.getItem("userId");

  const fetchArtworks = async () => {
    try {
      const response = await axiosInstance.get("/posts/randomposts");
      const posts = response?.data || [];

      const likedStatus = {};
      const visibleMap = {};
      const commentInputMap = {};

      posts.forEach((post) => {
        likedStatus[post._id] = post.likes?.userId?.includes(userId);
        visibleMap[post._id] = 2;
        commentInputMap[post._id] = "";
      });

      setIsLikedMap(likedStatus);
      setVisibleCommentsMap(visibleMap);
      setCommentInputs(commentInputMap);
      setArtworks(posts);
    } catch (err) {
      setError("Failed to load artworks.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    NProgress.start();
    fetchArtworks();
    NProgress.done();
  }, [userId]);

  const handleLikeToggle = async (postId) => {
    const isLiked = isLikedMap[postId];
    try {
      let response;
      if (isLiked) {
        response = await axiosInstance.post("/posts/unlikepost", { postId });
      } else {
        response = await axiosInstance.post("/posts/likepost", { postId });
      }
      const updatedLikes = response.data.likes;
      setArtworks((prev) =>
        prev.map((art) =>
          art._id === postId ? { ...art, likes: updatedLikes } : art
        )
      );
      setIsLikedMap((prev) => ({ ...prev, [postId]: !isLiked }));
    } catch (error) {
      console.error("Like toggle failed:", error);
      toast.error("Failed to update like status.");
    }
  };

  const handleCopyLink = (postId) => {
    const postUrl = `${window.location.origin}/post/${postId}`;
    navigator.clipboard
      .writeText(postUrl)
      .then(() => toast.success("Link copied to clipboard!"))
      .catch((err) => {
        console.error("Failed to copy link:", err);
        toast.error("Failed to copy link");
      });
  };

  const handleCommentChange = (postId, value) => {
    setCommentInputs((prev) => ({ ...prev, [postId]: value }));
  };

  const handleCommentSubmit = async (postId) => {
    const comment = commentInputs[postId];
    if (!comment.trim()) return;
    try {
      await axiosInstance.post("/posts/addcomment", {
        postId,
        text: comment,
      });
      setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
      fetchArtworks();
    } catch (err) {
      console.error("Failed to post comment", err);
      toast.error("Failed to post comment");
    }
  };

  const toggleViewAllComments = (postId, total) => {
    setVisibleCommentsMap((prev) => ({
      ...prev,
      [postId]: prev[postId] === 2 ? total : 2,
    }));
  };

  const toggleDescription = (postId) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };
  console.log(artworks);
  

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
      <div className="space-y-6">
        {loading ? (
          <p className="text-white">Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          artworks.map((artwork) => {
            const isLiked = isLikedMap[artwork._id] || false;
            const visibleCount = visibleCommentsMap[artwork._id] || 2;

            return (
              <div
                key={artwork._id}
                className="bg-[#1A1A1A] rounded-xl border border-neutral-200/20 overflow-hidden"
              >
                <div className="aspect-video bg-gray-100">
                  {artwork.image?.length > 0 ? (
                    <Swiper
                      modules={[Pagination]}
                      pagination={{ clickable: true }}
                      spaceBetween={10}
                      slidesPerView={1}
                      className="w-full h-full"
                    >
                      {artwork.image.map((img, index) => (
                        <SwiperSlide key={index}>
                          <img
                            src={img}
                            alt={`Artwork ${index + 1}`}
                            className="w-full h-full object-cover"
                            onDoubleClick={() => handleLikeToggle(artwork._id)}
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  ) : (
                    <img
                      src={artwork.username}
                      alt="Default Artwork"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                <div className="p-4 flex items-center justify-between border-b border-neutral-200/20">
                  <div className="flex items-center space-x-3"
                    onClick={() => {
                      if (artwork.username === authUser.username) return navigate(`/profile/${authUser._id}`)
                      navigate(`/otheruserprofile/${artwork.username.username}`)
                    }}
                  >
                    <img
                      src={artwork.username.profilePic || "/default-avatar.png"}
                      alt="User Profile"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-white text-sm sm:text-base">
                        {artwork.username.username || "Unknown User"}
                      </p>
                      <p className="text-xs text-gray-500">Digital Artist</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t border-neutral-200/20 text-white">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-4">
                      <button
                        className="flex items-center space-x-1"
                        onClick={() => handleLikeToggle(artwork._id)}
                      >
                        <Heart
                          className={`w-6 h-6 transition-colors ${isLiked ? "text-red-500 fill-red-500" : ""
                            }`}
                        />
                        <span className="text-sm">
                          {artwork.likes?.Totallike || 0}
                        </span>
                      </button>

                      <button className="flex items-center space-x-1">
                        <MessageCircle className="w-6 h-6" />
                        <span className="text-sm">
                          {artwork.comments?.length || 0}
                        </span>
                      </button>

                      <button onClick={() => handleCopyLink(artwork._id)}>
                        <Share className="w-6 h-6 cursor-pointer" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="font-medium text-white text-sm sm:text-base">
                      {artwork.title}
                    </p>
                    <p
                      className={`text-sm text-gray-400 mt-1 ${expandedDescriptions[artwork._id]
                        ? ""
                        : "line-clamp-4"
                        }`}
                    >
                      {artwork.description}
                    </p>
                    {artwork.description?.length > 200 && (
                      <button
                        onClick={() => toggleDescription(artwork._id)}
                        className="text-blue-400 text-sm"
                      >
                        {expandedDescriptions[artwork._id]
                          ? "Show less"
                          : "Read more"}
                      </button>
                    )}

                    <div className="mt-2 space-y-1">
                      {(artwork.comments || [])
                        .slice(0, visibleCount)
                        .map((comment, idx) => (
                          <p key={idx} className="text-sm text-gray-300">
                            {comment.text}
                          </p>
                        ))}
                      {artwork.comments?.length > 2 && (
                        <button
                          onClick={() =>
                            toggleViewAllComments(
                              artwork._id,
                              artwork.comments.length
                            )
                          }
                          className="text-blue-400 text-sm"
                        >
                          {visibleCount < artwork.comments.length
                            ? `View all ${artwork.comments.length} comments`
                            : "Less comments"}
                        </button>
                      )}
                    </div>

                    <div className="mt-3 flex items-center space-x-2">
                      <input
                        type="text"
                        value={commentInputs[artwork._id] || ""}
                        onChange={(e) =>
                          handleCommentChange(artwork._id, e.target.value)
                        }
                        placeholder="Add a comment..."
                        className="flex-1 px-3 py-1 text-sm text-white bg-[#2A2A2A] rounded-lg outline-none"
                      />
                      <button
                        onClick={() => handleCommentSubmit(artwork._id)}
                        disabled={!commentInputs[artwork._id]?.trim()}
                      >
                        <Send className="w-5 h-5 text-blue-500" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Feed;

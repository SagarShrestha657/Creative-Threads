import React, { useEffect, useState, useRef } from "react";
import { axiosInstance } from "../lib/axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { Heart, MessageCircle, Share, Bookmark, Send, X } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import InfiniteScroll from "react-infinite-scroll-component";

const Feed = () => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [commentInputs, setCommentInputs] = useState({});
  const [visibleCommentsMap, setVisibleCommentsMap] = useState({});
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [commentsOpen, setCommentsOpen] = useState({});
  const [comments, setComments] = useState({});
  const [showFullDesc, setShowFullDesc] = useState({});
  const { authUser } = useAuthStore();
  const clickTimeoutRef = useRef(null);

  const userId = authUser._id;


  const fetchArtworks = async (pageNum = 1, isInitial = false) => {
    try {
      if (isInitial) {
        setLoading(true);
      }

      const response = await axiosInstance.get(`/posts/randomposts?page=${pageNum}&limit=10`);
      const posts = response?.data || [];

      if (posts.length === 0) {
        setHasMore(false);
        return;
      }

      const likedStatus = {};
      const visibleMap = {};
      const commentInputMap = {};

      posts.forEach((post) => {
        likedStatus[post._id] = post.likes?.userId?.includes(userId);
        visibleMap[post._id] = 2;
        commentInputMap[post._id] = "";
      });

      if (isInitial) {
        setVisibleCommentsMap(visibleMap);
        setCommentInputs(commentInputMap);
        setArtworks(posts);
      } else {
        setVisibleCommentsMap(prev => ({ ...prev, ...visibleMap }));
        setCommentInputs(prev => ({ ...prev, ...commentInputMap }));
        setArtworks(prev => [...prev, ...posts]);
      }
    } catch (err) {
      setError("Failed to load artworks.");
      console.error(err);
    } finally {
      if (isInitial) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    NProgress.start();
    fetchArtworks(1, true);
    NProgress.done();
  }, [userId]);

  const loadMoreData = () => {
    if (!hasMore) return;
    setPage(prevPage => prevPage + 1);
    fetchArtworks(page + 1);
  };

  const handleLikeToggle = async (postId) => {
    const post = artworks.find((post) => post._id === postId);
    if (!post) return;
    const isLiked = post.likes.userId?.includes(userId);
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

  const handleImageClick = (post) => {
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
    }

    clickTimeoutRef.current = setTimeout(() => {
      setSelectedArtwork(post);
      clickTimeoutRef.current = null;
    }, 300); // Adjust delay as needed (e.g., 300ms)
  };

  const handleImageDoubleClick = (postId) => {
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
    }
    handleLikeToggle(postId); // Your existing double-click action
  };


  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
      {loading ? (
        <p className="text-white">Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <InfiniteScroll
          dataLength={artworks.length}
          next={loadMoreData}
          hasMore={hasMore}
          loader={<p className="text-white text-center py-4">Loading more posts...</p>}
          endMessage={
            <p className="text-white text-center py-4">
              No more posts to load
            </p>
          }
          scrollThreshold="85%"
        >
          <div className="space-y-6">
            {artworks.map((artwork) => {
              const visibleCount = visibleCommentsMap[artwork._id] || 2;
              return (
                <div
                  key={artwork._id}
                  className="bg-[#1A1A1A] rounded-xl border border-neutral-200/20 overflow-hidden"
                >
                  <div className="aspect-video bg-gray-100"
                    onClick={() => handleImageClick(artwork)}
                    onDoubleClick={() => handleImageDoubleClick(artwork._id)}
                  >
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
                            className={`w-6 h-6 transition-colors ${artwork.likes?.userId?.includes(userId) ? "text-red-500 fill-red-500" : ""
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
            })}
          </div>
        </InfiniteScroll>
      )}
      {selectedArtwork && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative max-w-4xl w-full bg-gray-900 rounded-lg p-4 sm:p-6">
            <button
              className="absolute top-4 right-4 text-white hover:text-red-400"
              onClick={() => setSelectedArtwork(null)}
            >
              <X size={28} />
            </button>
            <img
              src={
                Array.isArray(selectedArtwork.image) &&
                  selectedArtwork.image.length > 0
                  ? selectedArtwork.image[0]
                  : "/fallback.jpg"
              }
              alt={selectedArtwork.title || "Artwork"}
              className="w-full max-h-[60vh] object-contain rounded-lg mb-4"
            />
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">
              {selectedArtwork.title}
            </h2>
            <div className="flex items-center gap-2 mb-2">
              <img
                src={selectedArtwork.username.profilePic || "/fallback.jpg"}
                className="w-6 h-6 rounded-full object-cover"
                alt="User profile"
              />
              <p className="text-white/70 text-sm sm:text-base">
                By: {selectedArtwork.username.username}
              </p>
            </div>

            {/* Description with Read More */}
            <div className="text-white/70 text-sm sm:text-base mb-4">
              <p
                className={`whitespace-pre-line ${showFullDesc[selectedArtwork._id] ? "" : "line-clamp-4"
                  }`}
              >
                {selectedArtwork.description}
              </p>
              {selectedArtwork.description?.length > 200 && (
                <button
                  className="text-blue-400 text-sm mt-2"
                  onClick={() => toggleDescription(selectedArtwork._id)}
                >
                  {showFullDesc[selectedArtwork._id] ? "Show less" : "Read more"}
                </button>
              )}
            </div>

            {/* Comments Section */}
            <div className="bg-black/20 rounded-lg p-3">
              {commentsOpen[selectedArtwork._id] ? (
                <>
                  {comments[selectedArtwork._id]?.map((c, i) => (
                    <div key={i} className="border-t border-white/10 py-2">
                      <p className="text-sm">
                        <span className="font-semibold">{c.username}</span>: {c.text}
                      </p>
                    </div>
                  ))}
                  <button
                    onClick={() => toggleComments(selectedArtwork._id)}
                    className="text-blue-400 text-sm mt-2"
                  >
                    Less comments
                  </button>
                </>
              ) : (
                <>
                  {(comments[selectedArtwork._id]?.slice(0, 2) || []).map((c, i) => (
                    <div key={i} className="border-t border-white/10 py-2">
                      <p className="text-sm">
                        <span className="font-semibold">{c.username}</span>: {c.text}
                      </p>
                    </div>
                  ))}
                  {comments[selectedArtwork._id]?.length > 2 && (
                    <button
                      onClick={() => toggleComments(selectedArtwork._id)}
                      className="text-blue-400 text-sm mt-2"
                    >
                      View all comments
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feed;

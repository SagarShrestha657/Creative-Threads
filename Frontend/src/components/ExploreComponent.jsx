import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { X,Search } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

const ExploreComponent = () => {
  const [user, setUser] = useState([]);
  const [posts, setPosts] = useState([]);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [commentsOpen, setCommentsOpen] = useState({});
  const [comments, setComments] = useState({});
  const [showFullDesc, setShowFullDesc] = useState({});
  const navigate = useNavigate()
  const { authUser , userUpdate} = useAuthStore();

  const fetchUser = async () => {
    try {
      const res = await axiosInstance.get("/explore/users");
      setUser(res.data);
    } catch (err) {
      console.error("Failed to fetch explore user", err);
    }
  };

  const fetchPost = async () => {
    try {
      const res = await axiosInstance.get("/posts/randomposts");
      if (Array.isArray(res.data)) {
        setPosts(res.data);
      } else if (Array.isArray(res.data.data)) {
        setPosts(res.data.data);
      } else {
        setPosts([]);
      }
    } catch (err) {
      console.error("Failed to fetch explore post", err);
    }
  };

  const toggleComments = async (postId) => {
    const isOpen = commentsOpen[postId];
    setCommentsOpen((prev) => ({
      ...prev,
      [postId]: !isOpen,
    }));

    if (!isOpen && !comments[postId]) {
      try {
        const res = await axiosInstance.get(`/posts/comments/${postId}`);
        setComments((prev) => ({ ...prev, [postId]: res.data }));
      } catch (err) {
        console.error("Error loading comments", err);
      }
    }
  };

  const handleFollowing = async (username, _id) => {
    try {
      await axiosInstance.post("/update/follow", { username });
      // socket.emit("sendNotification", {
      //   senderId: authUser._id,
      //   receiverId: username,
      //   type: "follow",
      // });
      fetchUser(); // Refresh users
      const currentFollowing = authUser?.following || [];

      const updatedFollowing = [...currentFollowing, _id]; // Add

      userUpdate('following', updatedFollowing);
    } catch (error) {
      console.error("Failed in following user", error);
    }
  };

  const toggleDescription = (postId) => {
    setShowFullDesc((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  useEffect(() => {
    NProgress.start();
    fetchUser();
    fetchPost();
    NProgress.done();
  }, []);

  useEffect(() => {
    document.body.style.overflow = selectedArtwork ? "hidden" : "unset";
  }, [selectedArtwork]);

  // const categories = [
  //   "All",
  //   "Digital Art",
  //   "Photography",
  //   "Illustrations",
  //   "Paintings",
  //   "3D Art",
  // ];

  return (
    <div className="bg-black min-h-screen text-white px-4 mt-0 max-w-7xl mx-auto relative">
      {/* Category Filter */}
      {/* <div className="flex overflow-x-auto space-x-4 mb-8 scrollbar-hide">
        {categories.map((cat, i) => (
          <button
            key={i}
            className={`px-6 py-2 rounded-full whitespace-nowrap ${i === 0 ? "bg-white text-black" : "bg-black border border-white"
              }`}
          >
            {cat}
          </button>
        ))}
      </div> */}
      <div className="flex justify-center mb-6">
        <button
          onClick={() => navigate("/search")}
          className="flex items-center w-full max-w-md bg-neutral-900 border border-neutral-700 rounded-full px-4 py-2 text-left text-zinc-400 hover:bg-neutral-800 transition"
        >
          <Search size={20} className="mr-2" />
          <span className="flex-1">Search users or posts...</span>
        </button>
      </div>

      {/* Trending Artists */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Trending Artists</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {user.map((artist, idx) => (
            <div key={idx} className="bg-white text-black p-4 rounded-lg shadow-md">
              <div className="flex items-center space-x-4"
                onClick={() => {
                  navigate(`/otheruserprofile/${artist.username}`)
                }}
              >
                <img
                  src={artist.profilePic || "/fallback.jpg"}
                  alt={artist.username}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold">{artist.username}</h3>
                  <p className="text-sm text-gray-600 capitalize">{artist.role}</p>
                  <p className="text-sm text-gray-600">{artist.followers} followers</p>
                </div>
              </div>
              <button
                onClick={() => handleFollowing(artist.username, artist._id)}
                className="mt-4 w-full bg-black text-white py-2 rounded-lg hover:bg-gray-900 transition"
              >
                Follow
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Artworks */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Trending Artworks</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-fr">
          {posts.map((artwork, i) => (
            <div
              key={i}
              onClick={() => setSelectedArtwork(artwork)}
              className="relative group overflow-hidden rounded-lg bg-gray-800 cursor-pointer"
              style={{ aspectRatio: "1 / 1" }}
            >
              <img
                src={
                  Array.isArray(artwork.image) && artwork.image.length > 0
                    ? artwork.image[0]
                    : "/fallback.jpg"
                }
                alt={artwork.title || "Artwork"}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-opacity-0 group-hover:bg-black/40 transition-all" />
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-black/60 text-white translate-y-full group-hover:translate-y-0 transition-transform">
                <p className="font-semibold">{artwork.title}</p>
                <div className="flex items-center mt-1 space-x-2">
                  <img
                    src={artwork.username.profilePic || "/fallback.jpg"}
                    alt="Artist"
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <p className="text-sm">{artwork.username.username}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fullscreen Artwork Modal */}
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

export default ExploreComponent;

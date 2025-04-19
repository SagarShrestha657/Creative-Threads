import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { Heart, MessageCircle, Share, Bookmark } from "lucide-react";
import "swiper/css";
import "swiper/css/pagination";
import toast from "react-hot-toast";

const SinglePost = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axiosInstance.get(`/posts/getpost/${postId}`);
        const data = res.data.data;
        setPost(data);
        setIsLiked(data.likes.userId.includes(userId));
      } catch (err) {
        toast.error("Failed to load post");
      }
    };
    fetchPost();
  }, [postId, userId]);

  const handleLikeToggle = async () => {
    try {
      const endpoint = isLiked ? "/posts/unlikepost" : "/posts/likepost";
      const res = await axiosInstance.post(endpoint, { postId });
      setPost((prev) => ({
        ...prev,
        likes: res.data.likes,
      }));
      setIsLiked(!isLiked);
    } catch (err) {
      toast.error("Failed to update like status");
    }
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/post/${postId}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

  if (!post) return <p className="text-white text-center py-8">Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4 sm:py-6 bg-black">
      <div className="bg-[#1A1A1A] rounded-xl border border-neutral-200/20 overflow-hidden">
        <div className="aspect-video bg-gray-100">
          {post.image?.length ? (
            <Swiper
              modules={[Pagination]}
              pagination={{ clickable: true }}
              spaceBetween={10}
              slidesPerView={1}
              className="w-full h-full"
            >
              {post.image.map((img, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={img}
                    alt={`Artwork ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <img
              src="default_image.png"
              alt="Default Artwork"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        <div className="p-4 flex items-center justify-between border-b border-neutral-200/20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gray-300"></div>
            <div>
              <p className="font-medium text-white text-sm sm:text-base">
                {post.username}
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
                onClick={handleLikeToggle}
              >
                <Heart
                  className={`w-6 h-6 transition-colors ${
                    isLiked ? "text-red-500 fill-red-500" : ""
                  }`}
                />
                <span className="text-sm">
                  {post.likes?.Totallike || 0}
                </span>
              </button>
              <button className="flex items-center space-x-1">
                <MessageCircle className="w-6 h-6" />
                <span className="text-sm">
                  {post.comments?.length || 0}
                </span>
              </button>
              <button onClick={handleCopyLink}>
                <Share className="w-6 h-6 cursor-pointer" />
              </button>
            </div>
            <button>
              <Bookmark className="w-6 h-6" />
            </button>
          </div>

          <div>
            <p className="font-medium text-white text-sm sm:text-base">
              {post.title}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {post.description}
            </p>
            <p className="text-sm text-white mt-2">
              View all {post.comments?.length || 0} comments
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SinglePost;

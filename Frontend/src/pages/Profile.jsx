import React, { useState, useEffect, useRef } from 'react'
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../lib/axios';
import Navbar from '../components/NavbarComponent';
import toast from 'react-hot-toast';
import { Heart } from 'lucide-react';
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { X } from "lucide-react";

const Profile = () => {
    const [activeTab, setActiveTab] = useState('posts'); // Set default active tab
    const [showFullBio, setShowFullBio] = useState(false);
    const [posts, setposts] = useState([])
    const [suggestedUsers, setsuggestedUser] = useState([])
    const [mostliked, setmostliked] = useState([])
    const { authUser, userUpdate } = useAuthStore()
    const navigate = useNavigate()
    const [selectedArtwork, setSelectedArtwork] = useState(null);
    const [commentsOpen, setCommentsOpen] = useState({});
    const [comments, setComments] = useState({});
    const [showFullDesc, setShowFullDesc] = useState({});
    const clickTimeoutRef = useRef(null); // Ref to store the click timer ID

    const fetchPosts = async () => {
        try {
            const res = await axiosInstance.get(`/posts/getmypost`); // 
            setposts(res.data.posts);
        } catch (err) {
            console.error('Error fetching user posts:', err.response.data.message);
        }
    };

    // Fetch suggested users
    const fetchSuggestedUsers = async () => {
        try {
            // console.log("hi")
            const res = await axiosInstance.get('/posts/suggested');
            setsuggestedUser(res.data.suggestedUsers);
            // console.log(res.data.suggestedUsers)
        } catch (err) {
            console.error('Error fetching suggested users:', err);
        }
    };

    useEffect(() => {
        NProgress.start();
        if (authUser.role === "artist") {
            fetchPosts();
        }
        if (authUser.role !== "artist") {
            fetchSuggestedUsers()
            setActiveTab("suggested")
            console.log(suggestedUsers)
        }
        NProgress.done();
    }, []);

    const navigating = () => {
        navigate("/editprofile")
    };


    const sortedmostlikedPosts = () => {
        if (!posts || posts.length === 0) return []
        const mostlike = ([...posts].sort((a, b) => b.likes.Totallike - a.likes.Totallike))
        setmostliked(mostlike)
    };

    const toggleFollowButton = async (userId) => {
        try {
            const res = await axiosInstance.post(`/update/follow/${userId}`); // backend handles toggle
            const currentFollowing = authUser?.following || [];

            const isFollowing = currentFollowing.includes(userId);

            const updatedFollowing = isFollowing
                ? currentFollowing.filter((id) => id !== userId) // Remove
                : [...currentFollowing, userId]; // Add

            userUpdate('following', updatedFollowing);
            setsuggestedUser((prevUsers) =>
                prevUsers.map((user) =>
                    user._id === userId ? { ...user, followers: res.data.followers } : user
                )
            )
            toast.success(res.data.message)
        } catch (error) {
            console.error("Follow/Unfollow error:", error);
        }
    };

    const handleLikeToggle = async (postId) => {
        try {
            const post = posts.find((post) => post._id === postId);
            if (!post) return;
            const isLiked = post.likes.userId?.includes(authUser._id); // Assuming post.likes.users is an array of userIds
            let response;

            if (isLiked) {
                response = await axiosInstance.post("/posts/unlikepost", { postId });
            } else {
                response = await axiosInstance.post("/posts/likepost", { postId });
            }

            const updatedLikes = response.data.likes;

            setposts((prev) =>
                prev.map((post) =>
                    post._id === postId ? { ...post, likes: updatedLikes } : post
                )
            );
            setmostliked((prev) =>
                prev.map((post) =>
                    post._id === postId ? { ...post, likes: updatedLikes } : post
                )
            )
        } catch (error) {
            console.error("Like toggle failed:", error);
            toast.error("Failed to update like status.");
        }
    };

    const handleShare = () => {
        const currentUrl = window.location.href;
        navigator.clipboard
            .writeText(currentUrl)
            .then(() => {
                toast.success("Link copied to clipboard!");
            })
            .catch((err) => {
                console.error("Failed to copy:", err);
                toast.error("Failed to copy the link.");
            });
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
        <>
            <div className="bg-[#080808] min-h-screen flex flex-col md:flex-row">
                <div className="w-[95%] mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    {/* Profile Header */}
                    <div className="bg-white rounded-lg border border-neutral-200/20 p-6 mb-6 w-full overflow-hidden">
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 w-full">
                            {/* Profile Picture */}
                            <div className="w-32 h-32 rounded-full aspect-square bg-gray-300 overflow-hidden flex-shrink-0">
                                <img src={authUser.profilePic} className="w-full h-full object-cover" />
                            </div>

                            {/* Profile Info */}
                            <div className="flex-1 w-full px-2">
                                <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-4">
                                    <div className="text-center md:text-left">
                                        <h1 className="text-2xl font-semibold break-words">{authUser.name}</h1>
                                        <p className="text-sm text-gray-500 mb-1">@{authUser.username}</p>
                                        <p className="text-gray-500 max-w-2xl">{authUser.arttype}</p>
                                    </div>
                                    <div className="flex flex-wrap gap-3 justify-center md:justify-end">
                                        <button
                                            className="px-4 py-2 w-32 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors"
                                            onClick={navigating}
                                        >
                                            Edit Profile
                                        </button>
                                        <button className="px-4 py-2 w-32 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                                            onClick={handleShare}
                                        >
                                            Share Profile
                                        </button>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="flex justify-center md:justify-start gap-6 mb-4">
                                    {authUser.role === "artist" && <div className="text-center">
                                        <p className="font-bold">{posts.length}</p>
                                        <p className="text-gray-500">Posts</p>
                                    </div>}
                                    <div className="text-center">
                                        <p className="font-bold">{authUser.followers?.length || 0}</p>
                                        <p className="text-gray-500">Followers</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="font-bold">{authUser.following?.length || 0}</p>
                                        <p className="text-gray-500">Following</p>
                                    </div>
                                </div>

                                {/* Bio */}
                                <div className="w-full max-w-full overflow-hidden">
                                    <p className={`text-sm text-gray-700 whitespace-pre-wrap break-all transition-all   duration-200 ${showFullBio ? "" : "line-clamp-3"}`}>
                                        {authUser.bio}
                                    </p>
                                    {authUser?.bio?.length > 100 && (
                                        <button
                                            onClick={() => setShowFullBio(!showFullBio)}
                                            className="mt-1 text-xs text-black font-medium underline hover:text-gray-800"
                                        >
                                            {showFullBio ? "Show Less" : "Read More"}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* <!-- Content Tabs --> */}
                    <div className="bg-white rounded-lg border border-neutral-200/20">
                        {/* <!-- Tab Navigation --> */}
                        <div className="flex border-b border-neutral-200/20">
                            {authUser.role === "artist" && (
                                <>
                                    <button className={`flex-1 py-4 font-medium ${activeTab === 'posts' ? 'border-b-2 border-black' : ''}`} onClick={() => setActiveTab("posts")} >Posts</button>
                                    <button className={`flex-1 py-4 font-medium ${activeTab === 'mostliked' ? 'border-b-2 border-black' : ''}`}
                                        onClick={() => {
                                            setActiveTab('mostliked')
                                            sortedmostlikedPosts()
                                        }}>Most liked</button>
                                </>
                            )}
                            <button className={`flex-1 py-4 font-medium ${activeTab === 'suggested' ? 'border-b-2 border-black' : ''}`}
                                onClick={() => {
                                    setActiveTab('suggested')
                                    fetchSuggestedUsers()
                                }}>suggested</button>
                        </div>

                        {activeTab === 'posts' && authUser.role === "artist" && (
                            <div className="p-4">
                                {posts.length > 0 && (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {posts.slice().reverse().map((post, index) => (
                                            <div key={index} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden"
                                                onClick={() => handleImageClick(post)}
                                                onDoubleClick={() => handleImageDoubleClick(post._id)}
                                            >
                                                <img
                                                    src={post.image[0]}
                                                    alt="Post"
                                                    className="w-full h-full object-cover rounded-lg"
                                                />
                                                <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-sm px-2 py-1 rounded-full flex items-center gap-1">
                                                    <span>
                                                        <Heart className={`${post.likes.userId.includes(authUser._id) ? "text-red-500 fill-red-500" : ""}`} />
                                                    </span>
                                                    <span>{post.likes.Totallike || 0}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}


                        {/* <!-- mostliked Posts --> */}

                        {activeTab === 'mostliked' && authUser.role === "artist" && (
                            <div className="p-4">
                                {mostliked.length > 0 && (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {mostliked.map((post) => (
                                            <div
                                                key={post._id}
                                                className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden"
                                                onClick={() => handleImageClick(post)}
                                                onDoubleClick={() => handleImageDoubleClick(post._id)}
                                            >
                                                <img
                                                    src={post.image[0]}
                                                    alt="mostliked Post"
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-sm px-2 py-1 rounded-full flex items-center gap-1">
                                                    <span>
                                                        <Heart className={`${post.likes.userId.includes(authUser._id) ? "text-red-500 fill-red-500" : ""}`} />
                                                    </span>
                                                    <span>{post.likes.Totallike || 0}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}


                        {/* <!-- suggested List --> */}
                        {activeTab === 'suggested' && (
                            <div className="p-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {suggestedUsers.map((user, index) => (
                                        <div key={index} className='w-full h-full flex flex-col bg-gray-400 border border-neutral-200/20 rounded-lg space-x-4 p-4' >
                                            <div className="flex items-center space-x-2 " onClick={() => navigate(`/otheruserprofile/${user.username}`)}>
                                                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-300">
                                                    <img src={user.profilePic} className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold">{user.username}</h3>
                                                    <p className="text-sm text-gray-500">{user.arttype}</p>
                                                    < p className="text-sm text-gray-500">{user?.followers?.length || 0} followers</p>
                                                </div>
                                            </div>
                                            <button className="mt-2 px-4 py-1 text-sm bg-black text-white rounded-md hover:bg-gray-900"
                                                onClick={() => toggleFollowButton(user._id)}>
                                                {authUser.following?.includes(user._id) ? "Unfollow" : "Follow"}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div >
                </div >
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
            </div >
        </>
    )
}

export default Profile
import React, { useState } from "react";
import Navbar from "../components/NavbarComponent";
import { axiosInstance } from "../lib/axios";
import { Search, User, Image } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const SearchPage = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [type, setType] = useState("users");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { authUser } = useAuthStore();

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;
        setLoading(true);
        setError("");
        setResults([]);
        try {
            const res = await axiosInstance.get(
                `/explore/search/${type}/${query.trim()}`
            );
            setResults(res.data.results);
        } catch (err) {
            setError("No results found.");
        }
        setLoading(false);
    };

    return (
        <div className="bg-black min-h-screen text-white flex flex-col md:flex-row">
            {/* Navbar column */}
            <div>
                <Navbar />
            </div>

            {/* Search and results column */}
            <div className=" flex flex-col items-center w-[95%] mx-auto">
                {/* Search bar at the top */}
                <form
                    onSubmit={handleSearch}
                    className="flex gap-2 mb-6 w-full  px-4 pt-8"
                >
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white"
                    >
                        <option value="users">Users</option>
                        <option value="posts">Posts</option>
                    </select>
                    <input
                        type="text"
                        placeholder={`Search ${type}...`}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="flex-1 px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-700 text-white outline-none"
                    />
                    <button
                        type="submit"
                        className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg flex items-center gap-1"
                    >
                        <Search size={18} /> Search
                    </button>
                </form>

                <div className="w-full  px-4 pb-8 flex-1">
                    {loading && <div className="text-center py-8">Searching...</div>}
                    {error && <div className="text-center text-red-400 py-8">{error}</div>}

                    {!loading && !error && results.length > 0 && (
                        <div className="flex flex-col gap-6">
                            {type === "users" &&
                                results.map((user) => (
                                    <div
                                        key={user._id}
                                        className="flex items-center gap-4 bg-neutral-800 rounded-lg p-4 hover:bg-neutral-700 transition"
                                        onClick={() => {
                                            if (user.username === authUser.username) return navigate(`/profile/${authUser._id}`)
                                            navigate(`/otheruserprofile/${user.username}`)
                                        }}
                                    >
                                        <img
                                            src={user.profilePic || "/avatar.png"}
                                            alt={user.username}
                                            className="w-14 h-14 rounded-full object-cover"
                                        />
                                        <div>
                                            <div className="font-semibold text-lg flex items-center gap-2">
                                                <User size={18} /> {user.username}
                                            </div>
                                            <div className="text-gray-400 text-sm">{user.arttype}</div>
                                        </div>
                                    </div>
                                ))}

                            {type === "posts" &&
                                results.map((post) => (
                                    <div
                                        key={post._id}
                                        className="bg-neutral-800 rounded-lg overflow-hidden hover:bg-neutral-700 transition"
                                        onClick={() => {
                                            if (post.username === authUser.username) return navigate(`/profile/${authUser._id}`)
                                            navigate(`/otheruserprofile/${post.username.username}`)
                                        }}
                                    >
                                        <img
                                            src={Array.isArray(post.image) ? post.image[0] : post.image}
                                            alt="Post"
                                            className="w-full h-auto object-cover"
                                        />
                                        <div className="p-4">
                                            <div className="font-semibold flex items-center gap-2">
                                                <Image size={18} /> {post.title || "Untitled"}
                                            </div>
                                            <div className="text-gray-400 text-sm line-clamp-2">
                                                {post.description}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    )}

                    {!loading && !error && results.length === 0 && query && (
                        <div className="text-center text-gray-400 py-8">No results found.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchPage;
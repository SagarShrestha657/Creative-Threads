import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

export default function EditProfile() {
    const { authUser, userUpdate } = useAuthStore();
    const [name, setName] = useState(authUser.username || "");
    const [artType, setArtType] = useState(authUser.arttype || "");
    const [bio, setBio] = useState(authUser.bio || "");
    const [image, setImage] = useState(authUser.profilePic || null);
    const [preview, setPreview] = useState(image);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setPreview(imageUrl);
            setImage(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        NProgress.start();
        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append("profilePic", image);
            formData.append("username", name);
            formData.append("arttype", artType);
            formData.append("bio", bio);
            // console.log(formData)

            const res = await axiosInstance.patch("/update/editprofile", formData);

            userUpdate("username", name);
            userUpdate("arttype", artType);
            userUpdate("bio", bio);
            userUpdate("profilePic", res.data.profilePic);

            toast.success("Profile updated successfully");
            navigate(`/profile/${authUser._id}`, { replace: true });
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");

        }
        setIsSubmitting(false);
        NProgress.done();
    };

    const isUnchanged =
        name === authUser.username &&
        artType === authUser.arttype &&
        bio === authUser.bio &&
        image === authUser.profilePic;

    return (<div className="w-full min-h-screen bg-black p-5">
        <div className="max-w-xl mx-auto p-6 mt-10  rounded-xl bg-white shadow-md w-full">
            <h2 className="text-2xl font-semibold mb-6 text-center">Edit Profile</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="aspect-square w-24 sm:w-28 md:w-32 rounded-full overflow-hidden border shadow-sm">
                        <img
                            src={preview}
                            className="w-full h-full object-cover"

                        />
                    </div>

                    <label className="relative cursor-pointer text-sm bg-gray-100 border border-gray-300 px-3 py-2 rounded-md hover:bg-gray-200 transition">
                        Choose Image
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                    </label>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input
                        type="text"
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                {authUser.role === "artist" && (
                    <div>
                        <label className="block text-sm font-medium mb-1">Art Type</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                            value={artType}
                            onChange={(e) => setArtType(e.target.value)}
                        />
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium mb-1">Bio</label>
                    <textarea
                        className="w-full p-2 border rounded-md resize-none overflow-hidden scrollbar-none  focus:outline-none focus:ring-2 focus:ring-black"
                        rows={4}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                    ></textarea>
                </div>

                <button
                    type="submit"
                    disabled={isUnchanged || isSubmitting}
                    className={`w-full px-4 py-2 rounded-md text-white font-medium transition ${isUnchanged || isSubmitting
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-black hover:bg-gray-800"
                        }`}
                >
                    {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
            </form>
        </div>
    </div>
    );
}

import React, { useState } from 'react';
import Navbar from '../components/NavbarComponent';
import { axiosInstance } from '../lib/axios';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import ImagePreviewSlider from '../components/PreviewComponent';

const MAX_TITLE_LENGTH = 60;
const MAX_DESCRIPTION_LENGTH = 160;
const MAX_FILE_SIZE_MB = 10;
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

const CreatePost = () => {
    const [files, setFiles] = useState([]);
    const [previews, setpreviews] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { authUser } = useAuthStore();
    const navigate = useNavigate();

    const handleimagesChange = (e) => {
        const selectedFiles = Array.from(e.target.files);

        const validFiles = selectedFiles.filter(file => {
            const isValidType = ALLOWED_TYPES.includes(file.type);
            const isValidSize = file.size / (1024 * 1024) <= MAX_FILE_SIZE_MB;

            if (!isValidType) {
                toast.error(`${file.name} is not a supported image type.`);
            } else if (!isValidSize) {
                toast.error(`${file.name} exceeds 10MB limit.`);
            }

            return isValidType && isValidSize;
        });

        if (validFiles.length === 0) {
            setFiles([]);
            setpreviews([]);
            return;
        }

        setFiles(validFiles);
        setpreviews(validFiles.map(file => URL.createObjectURL(file)));
    };

    const handlePostSubmit = async () => {
        setIsSubmitting(true);
        NProgress.start();

        if (!files.length || !title.trim() || !description.trim()) {
            toast.error('Please fill in all fields and upload images.');
            NProgress.done();
            setIsSubmitting(false);
            return;
        }

        if (title.length > MAX_TITLE_LENGTH) {
            toast.error(`Title must be ${MAX_TITLE_LENGTH} characters or less.`);
            NProgress.done();
            setIsSubmitting(false);
            return;
        }

        if (description.length > MAX_DESCRIPTION_LENGTH) {
            toast.error(`Description must be ${MAX_DESCRIPTION_LENGTH} characters or less.`);
            NProgress.done();
            setIsSubmitting(false);
            return;
        }

        const formData = new FormData();
        formData.append('title', title.trim());
        formData.append('description', description.trim());
        formData.append("username", authUser._id);
        formData.append("arttype", authUser.arttype);
        formData.append("role", authUser.role);

        files.forEach((img) => formData.append('files', img));

        try {
            await axiosInstance.post(`/posts/addpost`, formData);
            toast.success('Post created successfully!');
            navigate(`/profile/${authUser._id}`);
        } catch (err) {
            console.error('Error creating post:', err);
            if (err.response?.data?.message) {
                toast.error(err.response.data.message);
            }
        }

        NProgress.done();
        setIsSubmitting(false);
    };

    return (
        <div className="bg-black min-h-screen flex flex-col md:flex-row">
            {/* <Navbar /> */}
            <div className="w-[95%] mx-auto px-4 py-6">
                <div className="bg-white rounded-lg border border-neutral-200/20 mb-6">
                    <div className="p-6 border-b border-neutral-200/20 flex items-center justify-between">
                        <h2 className="text-2xl font-bold">Create Post</h2>
                    </div>
                    <div className="p-6">
                        {/* Title */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-2">Post Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => {
                                    if (e.target.value.length <= MAX_TITLE_LENGTH) {
                                        setTitle(e.target.value);
                                    }
                                }}
                                className="w-full px-4 py-2 border border-gray-300 bg-white focus:border-black focus:outline-none rounded-lg"
                                placeholder="Give your artwork a title (max 60 characters)"
                            />
                            <p className={`mt-1 text-xs ${title.length === MAX_TITLE_LENGTH ? "text-red-500" : "text-gray-500"}`}>
                                {title.length}/{MAX_TITLE_LENGTH} characters
                            </p>
                        </div>

                        {/* Upload Files */}
                        <div className="mb-6">
                            <div className="border-2 border-dashed border-neutral-200/20 rounded-lg p-8">
                                <div className="text-center">
                                    {files.length === 0 ? (
                                        <>
                                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                                />
                                            </svg>
                                            <p className="mt-2 text-sm text-gray-500">Drag and drop your artwork here, or click to browse</p>
                                            <p className="mt-1 mb-4 text-xs text-gray-400">Only image formats allowed: JPG, JPEG, PNG, GIF (Max 10MB each)</p>
                                            <label className="relative cursor-pointer text-sm bg-black border px-4 py-2 text-white rounded-lg hover:bg-gray-900 transition">
                                                Choose Files
                                                <input
                                                    type="file"
                                                    accept=".jpg,.jpeg,.png,.gif"
                                                    multiple
                                                    onChange={handleimagesChange}
                                                    className="absolute opacity-0 left-0 top-0 w-full h-full cursor-pointer"
                                                />
                                            </label>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center">
                                            <span className="bg-black text-white text-xs px-3 py-1 rounded-full shadow mb-4">
                                                ↓ Scroll down to preview your post
                                            </span>
                                            <div className="flex flex-wrap gap-4 justify-center mb-2">
                                                {previews.map((src, idx) => (
                                                    <div key={idx} className="relative inline-block">
                                                        <img
                                                            src={src}
                                                            alt={`preview-${idx}`}
                                                            className="w-20 h-20 object-cover rounded border"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const newFiles = [...files];
                                                                const newPreviews = [...previews];
                                                                newFiles.splice(idx, 1);
                                                                newPreviews.splice(idx, 1);
                                                                setFiles(newFiles);
                                                                setpreviews(newPreviews);
                                                            }}
                                                            className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-800"
                                                            title="Remove"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                            <button
                                                type="button"
                                                className="text-xs text-blue-600 underline mt-2"
                                                onClick={() => {
                                                    setFiles([]);
                                                    setpreviews([]);
                                                }}
                                            >
                                                Remove all
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-2">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => {
                                    if (e.target.value.length <= MAX_DESCRIPTION_LENGTH) {
                                        setDescription(e.target.value);
                                    }
                                }}
                                className="w-full px-4 py-2 scrollbar-none rounded-lg border border-gray-300 bg-white focus:border-black focus:outline-none"
                                rows="4"
                                placeholder="Tell the story behind your artwork (max 160 characters)"
                            />
                            <p className={`mt-1 text-xs ${description.length === MAX_DESCRIPTION_LENGTH ? "text-red-500" : "text-gray-500"}`}>
                                {description.length}/{MAX_DESCRIPTION_LENGTH} characters
                            </p>
                        </div>

                        {/* Submit */}
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={handlePostSubmit}
                                disabled={isSubmitting}
                                className={`px-6 py-2 text-white rounded-lg transition ${isSubmitting
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-black hover:bg-gray-800"
                                    }`}
                            >
                                Publish Post
                            </button>
                        </div>
                    </div>
                </div>

                {/* Preview */}
                <div className="bg-white rounded-lg border border-neutral-200/20 mt-4 relatives mb-16 lg:mb-0">
                    <ImagePreviewSlider previews={previews} title={title} description={description} />
                </div>
            </div>
        </div>
    );
};

export default CreatePost;

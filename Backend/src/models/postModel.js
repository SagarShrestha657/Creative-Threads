import mongoose from "mongoose";

const postschema = new mongoose.Schema(
    {
        username: {
            required: true,
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        title: {
            type: String,
            required: true,
            trim: true,  // Automatically trims extra spaces
        },
        description: {
            type: String,
            required: true,
        },
        image: [{
            type: String,  // This can be a URL to the image
            required: true,
        }],
        likes: {
            Totallike: {
                type: Number,
                default: 0,  // Default value of likes is 0
            },
            userId: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            }],
        },
        comments: [{
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
            text: {
                type: String,
            },
            createdAt: {
                type: Date,
                default: Date.now,
            },
            replies: [{
                userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                },
                text: {
                    type: String,
                },
                createdAt: {
                    type: Date,
                    default: Date.now,
                },
            }]
        }],
    },
    { timestamps: true },

);

const Post = mongoose.model("Post", postschema);
export default Post;

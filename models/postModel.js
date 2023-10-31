import mongoose from "mongoose";

const commentSchema = mongoose.Schema(
    {
        commentedBy: {
            type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true
        }
        ,
        commentDescription: {
            type: String, required: true,
        },
        parentId: {
            type: mongoose.Schema.Types.ObjectId, ref: 'commentSchema', required: true, default: null
        }
    }
);

const postSchema = mongoose.Schema(
    {
        authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        type: { type: String, required: true },
        url: { type: String, required: true },
        description: { type: String, required: true },
        likedBy: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }],
        comments: [commentSchema],
    },
    { timestamps: true }
);
const Post = mongoose.model("Post", postSchema);


export default Post

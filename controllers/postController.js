import Post from "../models/postModel.js";
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import generateUniqueFilename from "../utils/generateUniqueFilename.mjs";
import sendResponse from "../utils/sendResponse.mjs";

const createPost = async (req, res) => {
    const { type, description } = req.body;
    let downloadURL = null
    if (req.file) {

        //USING FIREBASE STORAGE AND MULTER
        const storage = getStorage();
        const originalFilename = req.file.originalname;
        const uniqueFilename = generateUniqueFilename(originalFilename);
        const storageRef = ref(storage, `posts/${uniqueFilename}`);
        const metadata = {
            contentType: req.file.mimetype,
        };

        // Upload the file in the bucket storage
        const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);

        downloadURL = await getDownloadURL(snapshot.ref); //DOWNLOAD URL
    }
    const post = await Post.create({
        authorId: req.user, type, url: downloadURL, description
    })
    res.json({ post })
}
const getUserPosts = async (req, res) => {
    const user = req.user;
    try {
        const posts = await Post.find({ authorId: user })
        if (posts.length != 0) {
            res.json({ TotalPost: posts.length, posts })
        }
        else {
            return res.status(404).send(sendResponse(false, "No posting yet"));
        }
    } catch (error) {
        console.log(error);
    }
}
const likePost = async (req, res) => {
    const user = req.user;
    const { postId } = req.params;
    try {
        // Update the post's likedBy array to add the user's ID
        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            { $addToSet: { likedBy: user } }, // Use $addToSet to prevent duplicate likes
            { new: true } // Return the updated document
        );
        if (updatedPost == null) { return res.status(404).send(sendResponse(false, "Not found")); }
        return res.status(200).send(sendResponse(true, "Successful", { updatedPost }));
    } catch (error) {
        return res.status(404).send(sendResponse(false, "Not found"));
    }
}
const createComment = async (req, res) => {
    const user = req.user;
    const { postId } = req.params;
    const { commentDescription } = req.body;
    try {

        const comment = {
            commentedBy: user,
            commentDescription: commentDescription
        };

        //FIND THE POST ON WHICH USRE NEEDS TO ADD THE COMMENT
        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            { $addToSet: { comments: comment } }, // Use $addToSet to prevent duplicate likes
            { new: true } // Return the updated document
        )
        if (updatedPost == null) { return res.status(404).send(sendResponse(false, "Not found")); }
        return res.status(200).send(sendResponse(true, "Successful", { updatedPost })); //else
    } catch (error) {
        console.log(error);
    }
}
const getPostComments = async (req, res) => {
    const user = req.user;
    const { postId } = req.params;
    const post = await Post.findOne({
        _id: postId,
        authorId: user
    }).select('-comments.createdAt -comments.updatedAt')

    if (post && post.comments.length != 0) {
        return res.status(200).send(sendResponse(true, "Successful", { comments: post.comments }));
    }
    else if (post && post.comments.length == 0) {
        return res.status(200).send(sendResponse(true, "No comments yet on this post"));
    }
    else {
        return res.status(404).send(sendResponse(false, "Not Found"));
    }
}
const replyToComment = async (req, res) => {
    const user = req.user;
    const { postId } = req.params;
    const { commentId, commentDescription } = req.body;

    const post = await Post.findOne({ _id: postId, 'comments._id': commentId });
    if (post) {
        const comment = {
            commentedBy: user,
            commentDescription: commentDescription,
            parentId: commentId
        };

        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            { $addToSet: { comments: comment } }, // Use $addToSet to prevent duplicate likes
            { new: true } // Return the updated document
        )
        res.json(updatedPost)
    }
    else {
        res.json('not found')
    }
}

const getRepliesOfComment = async (req, res) => {
    const user = req.user;
    const { postId } = req.params;
    const { commentId } = req.body;

    try {
        // Find the post and the comment by postId and commentId
        const post = await Post.findOne({ _id: postId, 'comments._id': commentId });
        if (!post) {
            return res.status(404).json({ message: 'Post or comment not found' });
        }

        // Define a recursive function to retrieve replies
        const retrieveReplies = (comment) => {
            const replies = post.comments.filter((c) => c.parentId && c.parentId.toString() === comment._id.toString());
            if (replies.length === 0) {
                return [];
            }
            return replies.map((reply) => {
                const nestedReplies = retrieveReplies(reply);
                return {
                    reply,
                    nestedReplies,
                };
            });
        };

        // Find the specific comment with the given commentId
        const comment = post.comments.find((c) => c._id.toString() === commentId);

        // Retrieve all replies, including nested replies
        const allReplies = retrieveReplies(comment);

        // Return the comment and all replies in the response
        return res.status(200).json({ data: { comment, replies: allReplies } });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


export { createPost, getUserPosts, likePost, createComment, getPostComments, replyToComment, getRepliesOfComment }
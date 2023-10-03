import express from 'express';
import { createPost, getUserPosts, likePost, createComment, getPostComments, replyToComment, getRepliesOfComment } from '../controllers/postController.mjs';
import fetchUser from '../middlewares/fetchUser.mjs';
import { initializeApp } from "firebase/app";
import multer from "multer";
import config from "../config/firebaseconfig.mjs";


initializeApp(config.firebaseConfig);

const upload = multer({ storage: multer.memoryStorage() });

const postRouter = express.Router();

postRouter.get('/', fetchUser, getUserPosts);//USER CAN SEE HIS ALL POSTS
postRouter.get('/comment/:postId', fetchUser, getPostComments);// SEE COMMENTS ON SPECIFIC POST
postRouter.get('/comment/fetchReplies/:postId', fetchUser, getRepliesOfComment);
postRouter.post('/', upload.single("post"), fetchUser, createPost);//CREATE A POST 
postRouter.post('/interact/like/:postId', fetchUser, likePost);//LIKE A SPECIFIC POST
postRouter.post('/interact/comment/:postId', fetchUser, createComment);//COMMENT ON A POST
postRouter.post('/comment/reply/:postId', fetchUser, replyToComment);//REPLY TO A COMMENT

export default postRouter;
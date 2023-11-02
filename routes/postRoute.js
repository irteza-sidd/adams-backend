import express from 'express';
import { createPost, getUserPosts, likePost, createComment, getPostComments, replyToComment, getRepliesOfComment, deletePost } from '../controllers/postController.js';
import fetchUser from '../middlewares/fetchUser.js';
import { initializeApp } from "firebase/app";
import multer from "multer";
import config from "../config/firebaseconfig.js";


initializeApp(config.firebaseConfig);

const upload = multer({ storage: multer.memoryStorage() });

const postRouter = express.Router();

//POST RELATED ROUTES
postRouter.get('/', fetchUser, getUserPosts);//USER CAN SEE HIS ALL POSTS
postRouter.delete('/delete/:postId', fetchUser, deletePost)//DELETE A POST 
postRouter.post('/interact/like/:postId', fetchUser, likePost);//LIKE A SPECIFIC POST
postRouter.post('/', upload.single("post"), fetchUser, createPost);//CREATE A POST 


//COMMENTS RELATED ROUTES
postRouter.get('/comment/:postId', fetchUser, getPostComments);// SEE COMMENTS ON SPECIFIC POST
postRouter.get('/comment/fetchReplies/:postId', fetchUser, getRepliesOfComment);
postRouter.post('/interact/comment/:postId', fetchUser, createComment);//COMMENT ON A POST
postRouter.post('/comment/reply/:postId', fetchUser, replyToComment);//REPLY TO A COMMENT

export default postRouter;
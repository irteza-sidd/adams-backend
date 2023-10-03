import express from 'express';
import { createUser, allUsers, getUser, deleteUser, loginUser } from '../controllers/userController.mjs';
import { initializeApp } from "firebase/app";
import multer from "multer";
import config from "../config/firebaseconfig.mjs";

initializeApp(config.firebaseConfig);

const upload = multer({ storage: multer.memoryStorage() });

const userRouter = express.Router();

userRouter.post('/', upload.single("image"), createUser); //SIGN UP ENDPOINT
userRouter.post('/login', loginUser); //SIGN IN ENDPOINT
userRouter.get('/', allUsers);  //GET ALL USERS ENDPOINT
userRouter.get('/:userId', getUser); // GET SPECIFIC USER ENDPOINT
userRouter.delete('/:userId', deleteUser); // DELETE SPECIFIC USER ENDPOINT

export default userRouter;
import express from 'express';
import dotenv from 'dotenv';
import connectToMongo from './config/db.js';
import userRouter from './routes/userRoute.js';
import postRouter from './routes/postRoute.js';
import cors from 'cors'

const app = express();
dotenv.config();
app.use(cors({ origin: '*', credentials: true }));

app.use(express.json());

app.use('/adam/user', userRouter);
app.use('/adam/post', postRouter);

//DATABASE AND PORT CONNECTION
connectToMongo();
app.listen(process.env.PORT || 3000, () => {
    console.log(`Server Running on port ${process.env.PORT}`);
})
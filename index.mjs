import express from 'express';
import dotenv from 'dotenv';
import connectToMongo from './config/db.mjs';
import userRouter from './routes/userRoute.mjs';
import postRouter from './routes/postRoute.mjs';
import cors from 'cors'

const app = express();
dotenv.config();
app.use(cors())
app.use(express.json());

app.use('/adam/user', userRouter);
app.use('/adam/post', postRouter);
//DATABASE AND PORT CONNECTION
connectToMongo();
app.listen(process.env.PORT, () => {
    console.log(`Server Running on port ${process.env.PORT}`);
})
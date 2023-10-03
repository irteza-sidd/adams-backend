import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();
const connectionString = process.env.DATABASE_URL;
const connectToMongo = () => {
    mongoose.connect(connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        autoIndex: true,
    })
        .then(() => console.log('Connected to MongoDB'))
        .catch((err) => console.error('Failed to connect to MongoDB', err));
}

export default connectToMongo
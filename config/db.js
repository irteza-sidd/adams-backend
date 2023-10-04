import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();
const connectToMongo = () => {
    mongoose.connect("mongodb+srv://irtezasiddiqui:VpVIJGj5lmubKWQw@cluster0.8p8ywia.mongodb.net/ADAMSBACKEND", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        autoIndex: true,
    })
        .then(() => console.log('Connected to MongoDB'))
        .catch((err) => console.error('Failed to connect to MongoDB', err));
}

export default connectToMongo
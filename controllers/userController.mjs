import axios from "axios";
import User from "../models/userModel.mjs";
import dotenv from 'dotenv';
import bcrypt from "bcryptjs";
import sendResponse from "../utils/sendResponse.mjs";
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import jwt from 'jsonwebtoken';
import generateUniqueFilename from "../utils/generateUniqueFilename.mjs";
dotenv.config();

const createUser = async (req, res) => {
    try {
        // Google SIGNUP
        if (req.body.providor === "google") {
            const { googleAccessToken } = req.body;
            axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
                headers: {
                    "Authorization": `Bearer ${googleAccessToken}`
                }
            })
                .then(async response => {
                    const user = {
                        fullname: response.data.given_name + " " + response.data.family_name,
                        email: response.data.email,
                        image: response.data.picture ? response.data.picture : ""
                    }
                    let existingUser = await User.findOne({ email: user.email });
                    if (existingUser) {
                        const payload = {
                            userId: existingUser._id,
                        };
                        const authToken = jwt.sign(payload, process.env.JWT_SECRET);
                        return res.status(201).send(sendResponse(true, "Successful", { user: existingUser, authToken }));
                    }
                    const googleUser = await User.create({
                        name: user.fullname,
                        email: user.email,
                        image: user.image,
                        loginOrSignupMethod: "SOCIAL",
                        googleId: response.data.sub,
                        providorName: "GOOGLE",
                    })
                    const payload = {
                        userId: googleUser._id,
                    };
                    const authToken = jwt.sign(payload, process.env.JWT_SECRET);
                    res.status(201).send(sendResponse(true, "Successful", { googleUser, authToken }));
                }).catch(err => {
                    res.status(500).json({ success: false, message: err.message });
                })
        }

        //CUSTOM USER SIGNUP
        else {
            const { name, confirmPassword, password, email } = req.body;
            let existingUser = await User.findOne({ email: email });
            if (existingUser) return res.status(409).send(sendResponse(false, "User Already Exist"));
            let downloadURL = null
            if (req.file) {

                //USING FIREBASE STORAGE AND MULTER
                const storage = getStorage();
                const originalFilename = req.file.originalname;
                const uniqueFilename = generateUniqueFilename(originalFilename);
                const storageRef = ref(storage, `profileImages/${uniqueFilename}`);
                const metadata = {
                    contentType: req.file.mimetype,
                };

                // Upload the file in the bucket storage
                const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);

                downloadURL = await getDownloadURL(snapshot.ref); //DOWNLOAD URL
            }
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt); //HASH PASSWORD

            const user = await User.create({
                name, image: downloadURL, confirmPassword, password: hashedPassword, email,
            });
            //PROVIDING USER THE JWT TOKEN
            const payload = {
                userId: user._id,
            };
            const authToken = jwt.sign(payload, process.env.JWT_SECRET);
            return res.status(201).send(sendResponse(true, "Signup Successful", { user, authToken }));
        }
    } catch (error) {
        console.log(error);
    }


}

const allUsers = async (req, res) => {
    const users = await User.find({})
    const length = users.length;
    res.json({ Total_users: length, users });
}
const getUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId)
        if (user) {
            return res.status(200).send(sendResponse(true, "Authorized", { user }));
        }
        else {
            return res.status(404).send(sendResponse(false, "Operation Failed ! User not found"));
        }
    } catch (err) {
        console.log(err);
    }
}
const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findOneAndDelete({ _id: userId })
        if (user) {
            res.json("User Deleted Successfully");
        }
        else {
            res.json("Operation Failed ! User not found")
        }
    } catch (err) {
        console.log(err);
    }

}
//TODO
const loginUser = async (req, res) => {

    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email: email });
        if (!user) {

            return res.status(404).send(sendResponse(true, "Not found"));
        }
        const matchPassword = await bcrypt.compare(password, user.password);
        if (!matchPassword) {
            return res.status(404).send(sendResponse(true, "Not found"));
        }
        const payload = {
            userId: user._id,
        };

        const authToken = jwt.sign(payload, process.env.JWT_SECRET);
        return res.status(200).send(sendResponse(true, "Successful", { user, authToken }));
    } catch (error) {
        return res.status(404).send(sendResponse(false, "Not found"));
    }

}


export { createUser, allUsers, getUser, deleteUser, loginUser }
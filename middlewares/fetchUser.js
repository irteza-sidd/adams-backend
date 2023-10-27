import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import sendResponse from '../utils/sendResponse.js';

dotenv.config();

const fetchUser = (req, res, next) => {
    let token = req.header('Authorization');
    token = token.split('Bearer ')[1];
    if (!token) {
        return res.status(401).send(sendResponse(false, "Unauthorized"));
    }

    try {
        const data = jwt.verify(token, process.env.JWT_SECRET);
        req.user = data.userId;
        next();
    } catch (error) {
        return res.status(500).json({ error: error.message }); 
    }
}

export default fetchUser
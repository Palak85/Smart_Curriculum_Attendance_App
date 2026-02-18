import jwt from 'jsonwebtoken'
import User from '../models/User.js';

const verifyUser = async(req,res,next)=>{
    try{
        const authHeader = req.headers && req.headers.authorization;
        if(!authHeader){
            return res.status(401).json({success: false, error: "Authorization header missing"})
        }
        const parts = authHeader.split(' ');
        if(parts.length !== 2) {
            return res.status(401).json({success: false, error: "Authorization header malformed"})
        }
        const token = parts[1];
        if(!token){
            return res.status(401).json({success: false, error: "Token Not Provided"})
        }
        const decoded = jwt.verify(token, process.env.JWT_KEY)
        if(!decoded){
            return res.status(401).json({success: false, error: "Token Not Valid"})
        }
        const user = await User.findById({_id: decoded._id}).select('-password')

        if(!user){
            return res.status(404).json({success: false, error: "User not found"})
        }

        req.user = user
        next()
    }
    catch(error){
        console.error('authMiddleware error:', error);
        // JWT errors and missing/invalid token -> 401
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, error: error.message });
        }
        return res.status(500).json({success: false, error: "server error"})
    }
}

export default verifyUser
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.js";
dotenv.config();
export const protectRoute=async(req,res,next)=>{
    try{
        const token=req.cookies.jwt;
        if(!token){
            return res.status(401).json({message:"Not authorized, no token"});
        }
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({message:"Not authorized, invalid token"});
        }
        const user=await User.findById(decoded.userId).select("-password");
        if(!user){
            return res.status(404).json({message:"Not authorized, user not found"});

        }
        req.user=user;
        next();
    }
    catch(err){
        return res.status(500).json({message:err.message});
    }
}
    
